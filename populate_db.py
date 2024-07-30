from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_CONNECTION_STRING = 'mongodb+srv://aadityasrivastavaconnect:M4D8pEnfXuj4VCPm@cluster0.9efwohs.mongodb.net/khyalaidb?retryWrites=true&w=majority'
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client["flight_db"]
flights_collection = db["flights"]

flights = [
    {"flightNumber": "AI101", "status": "On Time", "gate": "A1", "departureTime": "2024-07-29T14:00:00Z", "arrivalTime": "2024-07-29T16:00:00Z", "departing": "Delhi", "arriving": "Mumbai"},
    {"flightNumber": "AI102", "status": "Delayed", "gate": "B1", "departureTime": "2024-07-29T15:00:00Z", "arrivalTime": "2024-07-29T17:30:00Z", "departing": "Mumbai", "arriving": "Chennai"},
    {"flightNumber": "AI103", "status": "Cancelled", "gate": "C1", "departureTime": "2024-07-29T16:00:00Z", "arrivalTime": "2024-07-29T18:00:00Z", "departing": "Chennai", "arriving": "Kolkata"},
    {"flightNumber": "AI104", "status": "On Time", "gate": "A2", "departureTime": "2024-07-29T17:00:00Z", "arrivalTime": "2024-07-29T19:00:00Z", "departing": "Kolkata", "arriving": "Bangalore"},
    {"flightNumber": "AI105", "status": "Delayed", "gate": "B2", "departureTime": "2024-07-29T18:00:00Z", "arrivalTime": "2024-07-29T20:00:00Z", "departing": "Bangalore", "arriving": "Hyderabad"},
    {"flightNumber": "AI106", "status": "On Time", "gate": "C2", "departureTime": "2024-07-29T19:00:00Z", "arrivalTime": "2024-07-29T21:00:00Z", "kol": "Hyderabad", "arriving": "Ahmedabad"},
    {"flightNumber": "AI107", "status": "Delayed", "gate": "A3", "departureTime": "2024-07-29T20:00:00Z", "arrivalTime": "2024-07-29T22:00:00Z", "departing": "Ahmedabad", "arriving": "Pune"},
    {"flightNumber": "AI108", "status": "Cancelled", "gate": "B3", "departureTime": "2024-07-29T21:00:00Z", "arrivalTime": "2024-07-29T23:00:00Z", "departing": "Pune", "arriving": "Goa"},
    {"flightNumber": "AI109", "status": "On Time", "gate": "C3", "departureTime": "2024-07-29T22:00:00Z", "arrivalTime": "2024-07-30T00:00:00Z", "departing": "Goa", "arriving": "Jaipur"},
    {"flightNumber": "AI110", "status": "Delayed", "gate": "A4", "departureTime": "2024-07-29T23:00:00Z", "arrivalTime": "2024-07-30T01:00:00Z", "departing": "Jaipur", "arriving": "Lucknow"},
    {"flightNumber": "AI111", "status": "On Time", "gate": "B4", "departureTime": "2024-07-30T00:00:00Z", "arrivalTime": "2024-07-30T02:00:00Z", "departing": "Lucknow", "arriving": "Patna"},
    {"flightNumber": "AI112", "status": "Delayed", "gate": "C4", "departureTime": "2024-07-30T01:00:00Z", "arrivalTime": "2024-07-30T03:00:00Z", "departing": "Patna", "arriving": "Bhubaneswar"},
    {"flightNumber": "AI113", "status": "Cancelled", "gate": "A5", "departureTime": "2024-07-30T02:00:00Z", "arrivalTime": "2024-07-30T04:00:00Z", "departing": "Bhubaneswar", "arriving": "Chandigarh"},
    {"flightNumber": "AI114", "status": "On Time", "gate": "B5", "departureTime": "2024-07-30T03:00:00Z", "arrivalTime": "2024-07-30T05:00:00Z", "departing": "Chandigarh", "arriving": "Guwahati"},
    {"flightNumber": "AI115", "status": "Delayed", "gate": "C5", "departureTime": "2024-07-30T04:00:00Z", "arrivalTime": "2024-07-30T06:00:00Z", "departing": "Guwahati", "arriving": "Indore"},
    {"flightNumber": "AI116", "status": "On Time", "gate": "A6", "departureTime": "2024-07-30T05:00:00Z", "arrivalTime": "2024-07-30T07:00:00Z", "departing": "Indore", "arriving": "Bhopal"},
    {"flightNumber": "AI117", "status": "Delayed", "gate": "B6", "departureTime": "2024-07-30T06:00:00Z", "arrivalTime": "2024-07-30T08:00:00Z", "departing": "Bhopal", "arriving": "Kochi"},
    {"flightNumber": "AI118", "status": "Cancelled", "gate": "C6", "departureTime": "2024-07-30T07:00:00Z", "arrivalTime": "2024-07-30T09:00:00Z", "departing": "Kochi", "arriving": "Trivandrum"},
    {"flightNumber": "AI119", "status": "On Time", "gate": "A7", "departureTime": "2024-07-30T08:00:00Z", "arrivalTime": "2024-07-30T10:00:00Z", "departing": "Nagpur", "arriving": "Vadodara"},
    {"flightNumber": "AI120", "status": "Delayed", "gate": "B7", "departureTime": "2024-07-30T09:00:00Z", "arrivalTime": "2024-07-30T11:00:00Z", "departing": "Nagpur", "arriving": "Vadodara"}
]

# Populate the database
flights_collection.delete_many({})
flights_collection.insert_many(flights)
print("Database populated with mock data.")
