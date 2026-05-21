from flask import request, make_response
import mysql.connector
import re
from functools import wraps
from icecream import ic

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

ic.configureOutput(prefix=f"_____ | ", includeContext=True)


##############################
def db():
    try:
        db = mysql.connector.connect(
            host="mariadb",
            user="root",
            password="password",
            database="2026_1_washworld"
        )
        cursor = db.cursor(dictionary=True)
        return db, cursor

    except Exception as e:
        print(e, flush=True)
        raise Exception("Database under maintenance")


##############################
def no_cache(view):
    @wraps(view)
    def no_cache_view(*args, **kwargs):
        response = make_response(view(*args, **kwargs))
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response

    return no_cache_view


##############################
def get_data():
    if request.is_json:
        return request.get_json()
    return request.form


##############################
USER_FIRST_NAME_MIN = 2
USER_FIRST_NAME_MAX = 50
REGEX_USER_FIRST_NAME = f"^.{{{USER_FIRST_NAME_MIN},{USER_FIRST_NAME_MAX}}}$"

def validate_user_first_name(value=None):
    data = get_data()

    if value:
        user_first_name = value.strip()
    else:
        user_first_name = data.get("user_first_name", "").strip()

    if not re.match(REGEX_USER_FIRST_NAME, user_first_name):
        raise Exception("company_exception user_first_name")

    return user_first_name


##############################
USER_LAST_NAME_MIN = 2
USER_LAST_NAME_MAX = 50
REGEX_USER_LAST_NAME = f"^.{{{USER_LAST_NAME_MIN},{USER_LAST_NAME_MAX}}}$"

def validate_user_last_name(value=None):
    data = get_data()

    if value:
        user_last_name = value.strip()
    else:
        user_last_name = data.get("user_last_name", "").strip()

    if not re.match(REGEX_USER_LAST_NAME, user_last_name):
        raise Exception("company_exception user_last_name")

    return user_last_name


##############################
REGEX_EMAIL = r"^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$"

def validate_email(value=None):
    data = get_data()

    if value:
        email = value.strip().lower()
    else:
        email = (
            data.get("user_email", "") or
            data.get("email", "")
        ).strip().lower()

    if not re.match(REGEX_EMAIL, email):
        raise Exception("company_exception email")

    return email


##############################
USER_PASSWORD_MIN = 8
USER_PASSWORD_MAX = 50
REGEX_USER_PASSWORD = f"^.{{{USER_PASSWORD_MIN},{USER_PASSWORD_MAX}}}$"

def validate_user_password(value=None):
    data = get_data()

    if value:
        user_password = value.strip()
    else:
        user_password = (
            data.get("user_password", "") or
            data.get("password", "")
        ).strip()

    if not re.match(REGEX_USER_PASSWORD, user_password):
        raise Exception("company_exception user_password")

    return user_password


##############################
REGEX_LICENSE_PLATE = r"^[A-ZÆØÅ0-9 -]{2,20}$"

def validate_license_plate(value=None):
    data = get_data()

    if value:
        license_plate = value.strip().upper()
    else:
        license_plate = (
            data.get("user_license_plate", "") or
            data.get("license_plate", "")
        ).strip().upper()

    if not re.match(REGEX_LICENSE_PLATE, license_plate):
        raise Exception("company_exception license_plate")

    return license_plate


##############################
REGEX_UUID4 = "^[0-9a-f]{32}$"

def validate_uuid4(uuid4):
    uuid = uuid4.strip()

    if not re.match(REGEX_UUID4, uuid):
        raise Exception("company_exception uuid4 invalid")

    return uuid


##############################
REGEX_PARANOIA = "^[0-9a-f]{64}$"

def validate_uuid4_paranoia(uuid4):
    uuid = uuid4.strip()

    if not re.match(REGEX_PARANOIA, uuid):
        raise Exception("company_exception paranoia")

    return uuid


##############################
def send_email(receiver_email, subject, html):
    try:
        # Create a Gmail account
        # Enable 2-step verification in Google account
        # Visit: https://myaccount.google.com/apppasswords
        # Create an app password and paste it below

        sender_email = "campuskoreskolee@gmail.com"
        password = "yqmx yoel lvoy kglm"  # If 2FA is on, use an App Password instead

        # Receiver email address
        
        # Create the email message
        message = MIMEMultipart()
        message["From"] = "Washworld"
        message["To"] = receiver_email
        message["Subject"] = "subject"

        # Body of the email
        # body = f"""<h1>Hi</h1><h2>Hi again</h2>"""
        message.attach(MIMEText(html, "html"))

        # Connect to Gmail's SMTP server and send the email
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # Upgrade the connection to secure
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
            
        ic("Email sent successfully!")

        return "email sent"
       
    except Exception as ex:
        return "cannot send email", 500
    finally:
        pass