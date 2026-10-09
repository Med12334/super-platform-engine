from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

# Create a local SQLite database file
SQLALCHEMY_DATABASE_URL = "sqlite:///./super_platform.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Define the SQL Table for Logistics Telemetry
class Telemetry(Base):
    __tablename__ = "telemetry"

    id = Column(Integer, primary_key=True, index=True)
    active_drivers = Column(Integer, default=0)
    pending_deliveries = Column(Integer, default=0)
    system_load = Column(String, default="optimal")
