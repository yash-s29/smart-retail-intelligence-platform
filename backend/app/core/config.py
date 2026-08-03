from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Smart Retail Intelligence Platform"
    api_prefix: str = "/api/v1"

    database_url: str = Field(
        default="postgresql+psycopg2://postgres:postgres@localhost:5432/smart_retail",
        validation_alias="DATABASE_URL",
    )

    secret_key: str = Field(
        default="change-this-secret-key",
        validation_alias="SECRET_KEY",
    )

    algorithm: str = Field(
        default="HS256",
        validation_alias="ALGORITHM",
    )

    access_token_expire_minutes: int = Field(
        default=1440,
        validation_alias="ACCESS_TOKEN_EXPIRE_MINUTES",
    )

    frontend_origin: str = Field(
        default="http://localhost:5173",
        validation_alias="FRONTEND_ORIGIN",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()