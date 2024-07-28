from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import pika
import json
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb+srv://aadityasrivastavaconnect:M4D8pEnfXuj4VCPm@cluster0.9efwohs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["flight_db"]
flights_collection = db["flights"]

# RabbitMQ setup
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='flight_status')

@app.get("/api/flights")
async def get_flights():
    flights = list(flights_collection.find({}, {"_id": 0}))
    return flights

@app.websocket("/ws/flights")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    async def send_updates():
        while True:
            try:
                method_frame, header_frame, body = channel.basic_get(queue='flight_status')
                if method_frame:
                    data = json.loads(body)
                    flights_collection.update_one({"flightNumber": data["flightNumber"]}, {"$set": data})
                    await websocket.send_text(json.dumps(data))
                    channel.basic_ack(method_frame.delivery_tag)
                else:
                    await asyncio.sleep(1)
            except Exception as e:
                print(f"Error: {e}")
                await websocket.close()
                break

    await send_updates()

def send_update(flight):
    channel.basic_publish(
        exchange='',
        routing_key='flight_status',
        body=json.dumps(flight)
    )

@app.post("/api/flights/update")
async def update_flight(flight: dict):
    flights_collection.update_one({"flightNumber": flight["flightNumber"]}, {"$set": flight})
    send_update(flight)
    return {"message": "Flight updated"}
