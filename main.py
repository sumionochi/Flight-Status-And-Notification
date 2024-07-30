from fastapi import FastAPI, WebSocket, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import pika
import json
import os
import requests
from twilio.rest import Client
from dotenv import load_dotenv
import asyncio

load_dotenv()

MAILGUN_API_KEY = os.getenv('MAILGUN_API_KEY')
MAILGUN_DOMAIN = os.getenv('MAILGUN_DOMAIN')
NOTIFICATION_TO_EMAIL = os.getenv('NOTIFICATION_TO_EMAIL')

TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
NOTIFICATION_TO_PHONE = os.getenv('NOTIFICATION_TO_PHONE')

# MongoDB setup
MONGODB_CONNECTION_STRING='mongodb+srv://aadityasrivastavaconnect:M4D8pEnfXuj4VCPm@cluster0.9efwohs.mongodb.net/khyalaidb?retryWrites=true&w=majority&appName=Cluster0'
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["flight_db"]
flights_collection = db["flights"]

# RabbitMQ setup
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='flight_status')

# Twilio client
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def send_email_notification(flight):
    try:
        subject = f'Flight {flight["flightNumber"]} Status Update'
        body = (f'Flight {flight["flightNumber"]} status changed to {flight["status"]}. '
                f'Gate: {flight["gate"]}, Departure Time: {flight["departureTime"]}, '
                f'Arrival Time: {flight["arrivalTime"]}.')
        
        response = requests.post(
            f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
            auth=("api", MAILGUN_API_KEY),
            data={"from": f"Flight Notifications <mailgun@{MAILGUN_DOMAIN}>",
                  "to": NOTIFICATION_TO_EMAIL,
                  "subject": subject,
                  "text": body})
        
        print("Email sent successfully, response:", response.text)
    except Exception as e:
        print(f"Error sending email: {e}")

def send_sms_notification(flight):
    try:
        body = (f'Flight {flight["flightNumber"]} status changed to {flight["status"]}. '
                f'Gate: {flight["gate"]}, Departure Time: {flight["departureTime"]}, '
                f'Arrival Time: {flight["arrivalTime"]}.')
        
        message = twilio_client.messages.create(
            body=body,
            from_=TWILIO_PHONE_NUMBER,
            to=NOTIFICATION_TO_PHONE
        )
        
        print("SMS sent successfully, SID:", message.sid)
    except Exception as e:
        print(f"Error sending SMS: {e}")

@app.get("/api/flights")
async def get_flights(
    departing: str = Query(None),
    arriving: str = Query(None),
    flightNo: str = Query(None)
):
    query = {}
    if departing:
        query["departing"] = departing
    if arriving:
        query["arriving"] = arriving
    if flightNo:
        query["flightNumber"] = flightNo
    flights = list(flights_collection.find(query, {"_id": 0}))
    return flights

@app.post("/api/flights/update")
async def update_flight(flight: dict):
    flights_collection.update_one({"flightNumber": flight["flightNumber"]}, {"$set": flight})
    send_update(flight)
    return {"message": "Flight updated"}

def send_update(flight):
    channel.basic_publish(
        exchange='',
        routing_key='flight_status',
        body=json.dumps(flight)
    )

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
