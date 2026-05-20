from flask import Flask, jsonify
from flask_cors import CORS
from flask import request
import uuid
import time
from datetime import datetime
from decimal import Decimal

from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from icecream import ic
import x

ic.configureOutput(prefix="_____ | ", includeContext=True)

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "super-secret-key-change-this"
jwt = JWTManager(app)


##############################
@app.get("/")
def index():
    return jsonify({
        "status": "ok",
        "message": "Wash World backend connected"
    }), 200


##############################
@app.post("/api/sign-up")
def sign_up():
    try:
        data = x.get_data()

        user_first_name = x.validate_user_first_name(data.get("user_first_name"))
        user_email = x.validate_email(data.get("user_email"))
        user_password = x.validate_user_password(data.get("user_password"))
        user_license_plate = x.validate_license_plate(data.get("user_license_plate"))

        user_phone = (data.get("user_phone") or "").strip()
        selected_wash = (data.get("selected_wash") or "").strip()
        package_name = (data.get("package_name") or "").strip()

        has_all_locations_access = int(data.get("has_all_locations_access") or 0)
        all_locations_price = 10.00 if has_all_locations_access == 1 else 0.00

        card_number = (data.get("card_number") or "").replace(" ", "").replace("-", "")
        card_expiry = (data.get("card_expiry") or "").strip()
        card_name = (data.get("card_name") or "").strip()

        if not selected_wash:
            return jsonify({"error": "Primary wash location is required"}), 400

        if not package_name:
            return jsonify({"error": "Subscription package is required"}), 400

        if len(card_number) < 4:
            return jsonify({"error": "Card number is invalid"}), 400

        user_pk = uuid.uuid4().hex
        verification_key = uuid.uuid4().hex
        reset_password_key = uuid.uuid4().hex + uuid.uuid4().hex
        password_hash = generate_password_hash(user_password)

        db, cursor = x.db()

        cursor.execute("""
            SELECT location_pk
            FROM wash_locations
            WHERE location_city = %s
               OR location_name LIKE %s
            LIMIT 1
        """, (
            selected_wash,
            f"%{selected_wash}%"
        ))

        location = cursor.fetchone()

        if not location:
            return jsonify({"error": "Selected wash location not found"}), 404

        primary_location_fk = location["location_pk"]

        cursor.execute("""
            SELECT normal_price, subscription_price
            FROM wash_categories
            WHERE wash_type = %s
            LIMIT 1
        """, (package_name,))

        category = cursor.fetchone()

        if not category:
            return jsonify({"error": "Selected subscription package not found"}), 404

        normal_price = category["normal_price"]
        subscription_price = category["subscription_price"]

        cursor.execute("""
            INSERT INTO users (
                user_pk,
                user_first_name,
                user_email,
                user_password_hash,
                user_license_plate,
                user_phone,
                primary_location_fk,
                has_all_locations_access,
                user_verified_at,
                user_verification_key,
                user_reset_password_key,
                user_created_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NULL, %s, %s, NOW())
        """, (
            user_pk,
            user_first_name,
            user_email,
            password_hash,
            user_license_plate,
            user_phone,
            primary_location_fk,
            has_all_locations_access,
            verification_key,
            reset_password_key
        ))

        subscription_pk = uuid.uuid4().hex

        cursor.execute("""
            INSERT INTO subscriptions (
                subscription_pk,
                user_fk,
                subscription_name,
                wash_type,
                subscription_price,
                normal_price,
                all_locations_price,
                subscription_started_at,
                subscription_active
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), 1)
        """, (
            subscription_pk,
            user_pk,
            package_name,
            package_name,
            subscription_price,
            normal_price,
            all_locations_price
        ))

        payment_card_pk = uuid.uuid4().hex
        card_last4 = card_number[-4:]

        cursor.execute("""
            INSERT INTO payment_cards (
                payment_card_pk,
                user_fk,
                cardholder_name,
                card_last4,
                card_expiry,
                is_default,
                created_at
            )
            VALUES (%s, %s, %s, %s, %s, 1, NOW())
        """, (
            payment_card_pk,
            user_pk,
            card_name,
            card_last4,
            card_expiry
        ))

        db.commit()

        access_token = create_access_token(identity=user_pk)

        return jsonify({
            "message": "User created",
            "access_token": access_token,
            "user": {
                "user_pk": user_pk,
                "user_first_name": user_first_name,
                "user_email": user_email,
                "user_phone": user_phone,
                "user_license_plate": user_license_plate,
                "primary_location_fk": primary_location_fk,
                "subscription_name": package_name,
                "subscription_price": float(subscription_price),
                "card_last4": card_last4
            }
        }), 201

    except Exception as ex:
        ic(ex)

        if "company_exception user_first_name" in str(ex):
            return jsonify({"error": "Name is invalid"}), 400

        if "company_exception email" in str(ex):
            return jsonify({"error": "Invalid email"}), 400

        if "company_exception user_password" in str(ex):
            return jsonify({"error": "Invalid password"}), 400

        if "company_exception license_plate" in str(ex):
            return jsonify({"error": "Invalid license plate"}), 400

        if "Duplicate entry" in str(ex):
            return jsonify({"error": "Email already exists"}), 409

        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()


##############################
@app.post("/api/login")
def login():
    try:
        user_email = x.validate_email()
        user_password = x.validate_user_password()

        db, cursor = x.db()

        q = """
            SELECT 
                user_pk,
                user_first_name,
                user_email,
                user_password_hash,
                user_license_plate,
                user_verified_at
            FROM users
            WHERE user_email = %s
            AND user_is_active = 1
        """

        cursor.execute(q, (user_email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        if not check_password_hash(user["user_password_hash"], user_password):
            return jsonify({"error": "Invalid email or password"}), 401

        access_token = create_access_token(identity=user["user_pk"])

        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "user_pk": user["user_pk"],
                "user_first_name": user["user_first_name"],
                "user_email": user["user_email"],
                "user_license_plate": user["user_license_plate"],
                "user_verified_at": user["user_verified_at"]
            }
        }), 200

    except Exception as ex:
        ic(ex)

        if "company_exception email" in str(ex):
            return jsonify({"error": "Invalid email"}), 400

        if "company_exception user_password" in str(ex):
            return jsonify({"error": "Invalid password"}), 400

        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()


##############################
@app.route("/api/me", methods=["GET", "PUT", "DELETE"])
@jwt_required()
def me():
    try:
        user_pk = get_jwt_identity()
        db, cursor = x.db()

        if request.method == "GET":
            cursor.execute("""
                SELECT 
                    u.user_pk,
                    u.user_first_name,
                    u.user_email,
                    u.user_license_plate,
                    u.user_phone,
                    u.primary_location_fk,
                    wl.location_name,
                    wl.location_city,
                    s.subscription_name AS user_membership,
                    s.subscription_price,
                    pc.card_last4,
                    pc.card_expiry
                FROM users u
                LEFT JOIN subscriptions s ON u.user_pk = s.user_fk
                LEFT JOIN wash_locations wl ON u.primary_location_fk = wl.location_pk
                LEFT JOIN payment_cards pc 
                    ON u.user_pk = pc.user_fk 
                    AND pc.is_default = 1
                WHERE u.user_pk = %s
                LIMIT 1
            """, (user_pk,))

            user = cursor.fetchone()

            if not user:
                return jsonify({"error": "User not found"}), 404

            return jsonify({"user": user}), 200

        if request.method == "PUT":
            data = x.get_data()

            user_first_name = x.validate_user_first_name(data.get("user_first_name"))
            user_email = x.validate_email(data.get("user_email"))
            user_license_plate = x.validate_license_plate(data.get("user_license_plate"))
            user_phone = (data.get("user_phone") or "").strip()
            user_membership = (data.get("user_membership") or "").strip()

            cursor.execute("""
                UPDATE users
                SET 
                    user_first_name = %s,
                    user_email = %s,
                    user_license_plate = %s,
                    user_phone = %s
                WHERE user_pk = %s
            """, (
                user_first_name,
                user_email,
                user_license_plate,
                user_phone,
                user_pk
            ))

            if user_membership:
                cursor.execute("""
                    SELECT subscription_price
                    FROM wash_categories
                    WHERE wash_type = %s
                    LIMIT 1
                """, (user_membership,))

                category = cursor.fetchone()

                if not category:
                    return jsonify({"error": "Ugyldigt medlemskab"}), 400

                cursor.execute("""
                    UPDATE subscriptions
                    SET 
                        subscription_name = %s,
                        wash_type = %s,
                        subscription_price = %s
                    WHERE user_fk = %s
                """, (
                    user_membership,
                    user_membership,
                    category["subscription_price"],
                    user_pk
                ))

            db.commit()

            return jsonify({"message": "Profile updated"}), 200

        if request.method == "DELETE":
            cursor.execute("""UPDATE users SET user_is_active = 0 WHERE user_pk = %s""", (user_pk,))
            db.commit()

            return jsonify({"message": "Account deactivated"}), 200

    except Exception as ex:
        ic(ex)

        if "company_exception user_first_name" in str(ex):
            return jsonify({"error": "Navn er ugyldigt"}), 400

        if "company_exception email" in str(ex):
            return jsonify({"error": "Email er ugyldig"}), 400

        if "company_exception license_plate" in str(ex):
            return jsonify({"error": "Nummerplade er ugyldig"}), 400

        if "Duplicate entry" in str(ex):
            return jsonify({"error": "Email findes allerede"}), 409

        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()

##############################
@app.get("/api/verify/<key>")
def verify_account(key):
    try:
        key = x.validate_uuid4(key)

        db, cursor = x.db()

        verified_at = int(time.time())

        q = """
            UPDATE users
            SET user_verified_at = %s
            WHERE user_verification_key = %s
            AND user_verified_at = 0
        """

        cursor.execute(q, (verified_at, key))
        db.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "User already verified or invalid key"}), 400

        return jsonify({"message": "Account verified"}), 200

    except Exception as ex:
        ic(ex)

        if "company_exception uuid4 invalid" in str(ex):
            return jsonify({"error": "Invalid key"}), 400

        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()


##############################
##############################
@app.post("/api/forgot-password")
def forgot_password():
    try:
        email = x.validate_email()

        db, cursor = x.db()

        q = """
            SELECT user_pk, user_first_name 
            FROM users 
            WHERE user_email = %s
        """
        cursor.execute(q, (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "Check your email"}), 200

        reset_key = uuid.uuid4().hex + uuid.uuid4().hex
        reset_pk = uuid.uuid4().hex
        created_at = int(time.time())

        cursor.execute("""
            INSERT INTO password_reset_tokens 
            (reset_pk, user_fk, reset_key, used_at, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            reset_pk,
            user["user_pk"],
            reset_key,
            0,
            created_at
        ))

        db.commit()

        html = f"""
            <h1>Reset your Wash World password</h1>
            <p>Hi {user['user_first_name']}</p>
            <p>Click here to reset your password:</p>
            <a href="http://localhost:3000/login/reset-password/{reset_key}">
                Reset password
            </a>
        """

        x.send_email(
            email,
            "Reset your Wash World password",
            html
        )

        return jsonify({"message": "Check your email"}), 200

    except Exception as ex:
        ic(ex)
        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()


##############################
@app.post("/api/reset-password")
def reset_password():
    try:
        data = x.get_data()

        reset_key = x.validate_uuid4_paranoia(data.get("reset_key", ""))
        password = x.validate_user_password(data.get("password", ""))
        confirm_password = data.get("confirm_password", "").strip()

        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400

        db, cursor = x.db()

        cursor.execute("""
            SELECT user_fk, created_at 
            FROM password_reset_tokens
            WHERE reset_key = %s 
            AND used_at = 0
        """, (reset_key,))

        row = cursor.fetchone()

        if not row:
            return jsonify({"error": "Invalid or used reset key"}), 400

        expires_after = 10 * 60
        now = int(time.time())

        if now - row["created_at"] > expires_after:
            return jsonify({"error": "Reset link is expired"}), 400

        password_hash = generate_password_hash(password)

        cursor.execute("""
            UPDATE users 
            SET user_password_hash = %s
            WHERE user_pk = %s
        """, (password_hash, row["user_fk"]))

        cursor.execute("""
            UPDATE password_reset_tokens 
            SET used_at = %s
            WHERE reset_key = %s
        """, (int(time.time()), reset_key))

        db.commit()

        return jsonify({"message": "Password changed"}), 200

    except Exception as ex:
        ic(ex)
        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()


##############################
@app.get("/api/locations")
@jwt_required()
def get_locations():
    try:
        user_pk = get_jwt_identity()
        db, cursor = x.db()

        cursor.execute("""
            SELECT location_lat, location_lng
            FROM users u
            JOIN wash_locations wl ON u.primary_location_fk = wl.location_pk
            WHERE u.user_pk = %s
        """, (user_pk,))
        user_location = cursor.fetchone()

        q = """
            SELECT 
                location_pk,
                location_name,
                location_city,
                location_address,
                location_opening_hours,
                location_lat,
                location_lng,
                location_description
            FROM wash_locations
        """

        cursor.execute(q)
        locations = cursor.fetchall()

        if user_location:
            user_lat = float(user_location["location_lat"])
            user_lng = float(user_location["location_lng"])
            for loc in locations:
                lat_diff = (float(loc["location_lat"]) - user_lat) * 111
                lng_diff = (float(loc["location_lng"]) - user_lng) * 111 * 0.7
                loc["distance"] = (lat_diff**2 + lng_diff**2)**0.5
            locations.sort(key=lambda x: x["distance"])
        else:
            for loc in locations:
                loc["distance"] = None

        return jsonify({"locations": locations}), 200

    except Exception as ex:
        ic(ex)
        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()


##############################
@app.get("/api/wash-history")
@jwt_required()
def get_wash_history():
    try:
        user_pk = get_jwt_identity()

        db, cursor = x.db()

        q = """
            SELECT
                wh.wash_pk,
                wl.location_name,
                wl.location_city,
                wh.wash_type,
                wh.normal_price,
                wh.subscription_price,
                wh.washed_at
            FROM wash_history wh
            JOIN wash_locations wl ON wh.location_fk = wl.location_pk
            WHERE wh.user_fk = %s
            ORDER BY wh.washed_at DESC
        """

        cursor.execute(q, (user_pk,))
        history = cursor.fetchall()

        return jsonify({"wash_history": history}), 200

    except Exception as ex:
        ic(ex)
        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()


##############################
@app.post("/api/wash-history")
@jwt_required()
def create_wash_history():
    try:
        user_pk = get_jwt_identity()
        data = x.get_data()

        location_fk = data.get("location_fk", "").strip()
        wash_type = data.get("wash_type", "Premium Wash").strip()

        wash_pk = uuid.uuid4().hex
        normal_price = 99.00
        subscription_price = 0.00
        washed_at = int(time.time())

        db, cursor = x.db()

        q = """
            INSERT INTO wash_history (
                wash_pk,
                user_fk,
                location_fk,
                wash_type,
                normal_price,
                subscription_price,
                washed_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(q, (
            wash_pk,
            user_pk,
            location_fk,
            wash_type,
            normal_price,
            subscription_price,
            washed_at
        ))

        db.commit()

        return jsonify({
            "message": "Wash added",
            "wash_pk": wash_pk
        }), 201

    except Exception as ex:
        ic(ex)
        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()


##############################
@app.get("/api/dashboard")
@jwt_required()
def dashboard():
    try:
        user_pk = get_jwt_identity()

        db, cursor = x.db()

        q_user = """
            SELECT 
                u.user_first_name,
                s.subscription_name,
                s.subscription_price
            FROM users u
            LEFT JOIN subscriptions s ON u.user_pk = s.user_fk
            WHERE u.user_pk = %s
            LIMIT 1
        """

        cursor.execute(q_user, (user_pk,))
        user = cursor.fetchone()

        q_stats = """
            SELECT 
                COUNT(*) AS total_washes,
                COALESCE(SUM(normal_price), 0) AS total_normal_price,
                COALESCE(SUM(subscription_price), 0) AS total_subscription_price,
                COALESCE(SUM(normal_price - subscription_price), 0) AS total_saved
            FROM wash_history
            WHERE user_fk = %s
        """

        cursor.execute(q_stats, (user_pk,))
        stats = cursor.fetchone()

        q_monthly = """
            SELECT 
                MONTH(FROM_UNIXTIME(washed_at)) AS month,
                YEAR(FROM_UNIXTIME(washed_at)) AS year,
                COUNT(*) AS count
            FROM wash_history
            WHERE user_fk = %s
            AND washed_at >= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 12 MONTH))
            GROUP BY YEAR(FROM_UNIXTIME(washed_at)), MONTH(FROM_UNIXTIME(washed_at))
            ORDER BY year DESC, month DESC
        """

        cursor.execute(q_monthly, (user_pk,))
        monthly_data = cursor.fetchall()

        monthly_washes = [0] * 12
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        for row in monthly_data:
            month = row["month"]
            year = row["year"]
            count = row["count"]
            
            months_back = ((current_year - year) * 12) + (current_month - month)
            if 0 <= months_back < 12:
                monthly_washes[11 - months_back] = count

        return jsonify({
            "user": user,
            "stats": stats,
            "monthly_washes": monthly_washes
        }), 200

    except Exception as ex:
        ic(ex)
        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()

##############################
@app.get("/api/wash-history-detailed")
@jwt_required()
def get_wash_history_detailed():
    try:
        user_pk = get_jwt_identity()

        db, cursor = x.db()

        q = """
            SELECT 
                `user_fk`, 
                `wash_type`,
                `washed_at`,
                ROW_NUMBER() OVER (ORDER BY `washed_at` ASC) AS `wash_number`
            FROM `wash_history`
            WHERE `user_fk` = %s
            ORDER BY `washed_at` DESC
        """

        cursor.execute(q, (user_pk,))
        history = cursor.fetchall()

        formatted_history = []
        for wash in history:
            formatted_history.append({
                "user_fk": wash["user_fk"],
                "wash_type": wash["wash_type"],
                "washed_at": int(wash["washed_at"]),
                "wash_number": wash["wash_number"]
            })

        return jsonify({"wash_history": formatted_history}), 200

    except Exception as ex:
        ic(ex)
        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()

##############################
@app.get("/api/activity-log")
@jwt_required()
def get_activity_log():
    try:
        user_pk = get_jwt_identity()

        db, cursor = x.db()

        q = """
            SELECT
                wl.location_city,
                wh.wash_type,
                wh.subscription_price,
                wh.washed_at
            FROM wash_history wh
            JOIN wash_locations wl ON wh.location_fk = wl.location_pk
            WHERE wh.user_fk = %s
            ORDER BY wh.washed_at DESC
        """

        cursor.execute(q, (user_pk,))
        history = cursor.fetchall()

        activity_log = []
        total_spent = 0
        for wash in history:
            price = float(wash["subscription_price"])
            activity_log.append({
                "location_city": wash["location_city"],
                "wash_type": wash["wash_type"],
                "subscription_price": price,
                "washed_at": int(wash["washed_at"])
            })
            total_spent += price

        return jsonify({"activity_log": activity_log, "total_spent": total_spent}), 200

    except Exception as ex:
        ic(ex)
        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()

##############################
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
