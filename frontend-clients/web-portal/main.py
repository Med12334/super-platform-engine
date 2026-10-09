from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database

# Create the database tables
database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Multi-Service Super-Platform API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/v1/logistics/status")
def get_logistics(db: Session = Depends(get_db)):
    # Check if we have data, if not, create a seed record
    record = db.query(database.Telemetry).first()
    if not record:
        record = database.Telemetry(active_drivers=85, pending_deliveries=312, system_load="HEAVY")
        db.add(record)
        db.commit()
        db.refresh(record)
        
    return {
        "active_drivers": record.active_drivers,
        "pending_deliveries": record.pending_deliveries,
        "system_load": record.system_load
    }
