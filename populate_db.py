from pymongo import MongoClient

client = MongoClient("mongodb+srv://aadityasrivastavaconnect:M4D8pEnfXuj4VCPm@cluster0.9efwohs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
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

flights_collection.insert_many(flights)
print("Database populated with mock data.")
