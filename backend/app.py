from flask import Flask, jsonify
from flask_cors import CORS
import uuid
import time
from datetime import datetime

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
        user_first_name = x.validate_user_first_name()
        user_email = x.validate_email()
        user_password = x.validate_user_password()
        user_license_plate = x.validate_license_plate()

        user_pk = uuid.uuid4().hex
        verification_key = uuid.uuid4().hex
        reset_password_key = uuid.uuid4().hex + uuid.uuid4().hex
        

        password_hash = generate_password_hash(user_password)

        db, cursor = x.db()

        q = """
            INSERT INTO users (
                user_pk,
                user_first_name,
                user_email,
                user_password_hash,
                user_license_plate,
                user_verified_at,
                user_verification_key,
                user_reset_password_key,
                user_created_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
        """

        cursor.execute(q, (
            user_pk,
            user_first_name,
            user_email,
            password_hash,
            user_license_plate,
            None,
            verification_key,
            reset_password_key,
        ))

        subscription_pk = uuid.uuid4().hex

        q_subscription = """
            INSERT INTO subscriptions (
                subscription_pk,
                user_fk,
                subscription_name,
                subscription_price,
                subscription_started_at,
                subscription_active
            )
            VALUES (%s, %s, %s, %s, NOW(), %s)
        """

        cursor.execute(q_subscription, (
            subscription_pk,
            user_pk,
            "Premium Wash",
            179.00,
            1
        ))

        db.commit()

        html = f"""
            <h1>Welcome to Wash World</h1>
            <p>Hi {user_first_name}</p>
            <p>Thank you for signing up.</p>
            <p>Click here to verify your account:</p>
            <a href="http://127.0.0.1:5001/api/verify/{verification_key}">
                Verify account
            </a>
        """

        x.send_email(user_email, "Welcome to Wash World", html)

        return jsonify({
            "message": "User created. Please check your email."
        }), 201

    except Exception as ex:
        ic(ex)

        if "company_exception user_first_name" in str(ex):
            return jsonify({"error": f"Name must be {x.USER_FIRST_NAME_MIN} to {x.USER_FIRST_NAME_MAX} characters"}), 400

        if "company_exception email" in str(ex):
            return jsonify({"error": "Invalid email"}), 400

        if "company_exception user_password" in str(ex):
            return jsonify({"error": f"Password must be {x.USER_PASSWORD_MIN} to {x.USER_PASSWORD_MAX} characters"}), 400

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
@app.get("/api/me")
@jwt_required()
def me():
    try:
        user_pk = get_jwt_identity()

        db, cursor = x.db()

        q = """
            SELECT 
                user_pk,
                user_first_name,
                user_email,
                user_license_plate,
                user_verified_at
            FROM users
            WHERE user_pk = %s
        """

        cursor.execute(q, (user_pk,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": user}), 200

    except Exception as ex:
        ic(ex)
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
        email = x.validate_email()  # valider email fra request

        db, cursor = x.db()

        # Find user
        q = "SELECT user_pk, user_first_name FROM users WHERE user_email=%s"
        cursor.execute(q, (email,))
        user = cursor.fetchone()

        # Vi sender success uanset om email findes for sikkerhed
        if not user:
            return jsonify({"message": "Check your email"}), 200

        # Generer reset key
        reset_key = uuid.uuid4().hex + uuid.uuid4().hex

        # Gem i password_reset_tokens og users
        reset_pk = uuid.uuid4().hex
        created_at = int(time.time())

        cursor.execute("""
            INSERT INTO password_reset_tokens (reset_pk, user_fk, reset_key, used_at, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """, (reset_pk, user["user_pk"], reset_key, 0, created_at))

        cursor.execute("""
            UPDATE users SET user_reset_password_key = %s WHERE user_pk = %s
        """, (reset_key, user["user_pk"]))

        db.commit()

        # Email HTML
        html = f"""
            <h1>Reset your Wash World password</h1>
            <p>Hi {user['user_first_name']}</p>
            <p>Click here to reset your password:</p>
            <a href="http://localhost:3000/login/reset-password/{reset_key}">
                Reset password
            </a>
        """

        x.send_email(email, "Reset your Wash World password", html)

        return jsonify({"message": "Check your email"}), 200

    except Exception as ex:
        ic(ex)
        # Specific error handling kan tilføjes her, hvis ønsket
        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()


##############################
@app.post("/api/reset-password")
def reset_password():
    try:
        data = x.get_data()  # får JSON eller form data

        reset_key = x.validate_uuid4_paranoia(data.get("reset_key", ""))
        password = x.validate_user_password(data.get("password", ""))
        confirm_password = data.get("confirm_password", "").strip()

        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400

        password_hash = generate_password_hash(password)

        db, cursor = x.db()

        # Tjek reset key
        cursor.execute("""
            SELECT user_fk FROM password_reset_tokens
            WHERE reset_key=%s AND used_at=0
        """, (reset_key,))
        row = cursor.fetchone()

        if not row:
            return jsonify({"error": "Invalid or used reset key"}), 400

        # Opdater user password
        cursor.execute("""
            UPDATE users SET user_password_hash=%s
            WHERE user_pk=%s
        """, (password_hash, row["user_fk"]))

        # Marker token som brugt
        cursor.execute("""
            UPDATE password_reset_tokens SET used_at=%s
            WHERE reset_key=%s
        """, (int(time.time()), reset_key))

        db.commit()

        return jsonify({"message": "Password changed"}), 200

    except Exception as ex:
        ic(ex)
        # Specific error handling kan tilføjes her, hvis ønsket
        return jsonify({"error": str(ex)}), 500

    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()


##############################
@app.get("/api/locations")
def get_locations():
    try:
        db, cursor = x.db()

        q = """
            SELECT 
                location_pk,
                location_name,
                location_city,
                location_address,
                location_opening_hours
            FROM wash_locations
            ORDER BY location_city
        """

        cursor.execute(q)
        locations = cursor.fetchall()

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
                u.user_email,
                u.user_license_plate,
                s.subscription_name,
                s.subscription_price
            FROM users u
            LEFT JOIN subscriptions s ON u.user_pk = s.user_fk
            WHERE u.user_pk = %s
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

        return jsonify({
            "user": user,
            "stats": stats
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
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
