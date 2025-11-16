import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    def __init__(self) -> None:
        self.ENV = os.getenv("ENV", "development")
        self.DEBUG = self.ENV == "development"
        self.PORT = int(os.getenv("PORT", "5002"))
        cors_origins = os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://localhost:3001",
        )
        self.CORS_ORIGINS = cors_origins.split(",")
        self.SQLALCHEMY_DATABASE_URI = os.getenv(
            "DATABASE_URL",
            "postgresql+psycopg2://postgres:postgres@localhost:5432/work_easy_dev",
        )
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False