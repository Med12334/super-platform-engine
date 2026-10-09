from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database
import ai_engine

database.Base.metadata.create_all(bind=database.engine)
app = FastAPI(title="Multi-Service Super-Platform API", version="4.0")

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try: yield db
    finally: db.close()

@app.get("/api/v1/logistics/status")
def get_logistics(db: Session = Depends(get_db)):
    record = db.query(database.Telemetry).first()
    if not record:
        record = database.Telemetry(active_drivers=85, pending_deliveries=312, system_load="HEAVY")
        db.add(record)
        db.commit()
        db.refresh(record)
        
    # Calculate real-time AI routing efficiency
    efficiency = ai_engine.calculate_routing_efficiency(
        record.active_drivers, 
        record.pending_deliveries
    )
        
    return {
        "active_drivers": record.active_drivers,
        "pending_deliveries": record.pending_deliveries,
        "system_load": record.system_load,
        "routing_efficiency": efficiency
    }

@app.post("/api/v1/logistics/dispatch")
def dispatch_driver(db: Session = Depends(get_db)):
    record = db.query(database.Telemetry).first()
    if record and record.pending_deliveries > 0:
        record.active_drivers += 1
        record.pending_deliveries -= 1
        if record.pending_deliveries < 300:
            record.system_load = "OPTIMAL"
        db.commit()
    return {"status": "dispatched"}
