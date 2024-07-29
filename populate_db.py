from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_CONNECTION_STRING = os.getenv('MONGODB_CONNECTION_STRING')

client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["flight_db"]
flights_collection = db["flights"]

flights = [
    {
        "flightNumber": "AA123",
        "status": "On Time",
        "gate": "A1",
        "departureTime": "2024-07-29T14:00:00Z",
        "arrivalTime": "2024-07-29T16:00:00Z"
    },
    {
        "flightNumber": "BA456",
        "status": "Delayed",
        "gate": "B2",
        "departureTime": "2024-07-29T15:00:00Z",
        "arrivalTime": "2024-07-29T17:30:00Z"
    }
]

# Populate the database
flights_collection.delete_many({})
flights_collection.insert_many(flights)
print("Database populated with mock data.")
