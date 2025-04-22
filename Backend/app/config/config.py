import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "root")
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "test_db")
    MYSQL_PORT = os.getenv("MYSQL_PORT", 3306)
    FLASK_RUN_PORT = os.getenv("FLASK_RUN_PORT")
    FLASK_DEBUG = os.getenv("FLASK_DEBUG")

    SMTP_USERNAME = os.getenv("SMTP_USERNAME")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    SMTP_SERVER = os.getenv("SMTP_SERVER")
    SMTP_PORT = os.getenv("SMTP_PORT")

    SERVER_URL = os.getenv("SERVER_URL")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
