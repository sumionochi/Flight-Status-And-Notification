import pika
import json
import random
from datetime import datetime, timedelta

def random_status():
    statuses = ["On Time", "Delayed", "Cancelled", "Boarding"]
    return random.choice(statuses)

def random_gate():
    gates = [f"A{random.randint(1, 10)}", f"B{random.randint(1, 10)}", f"C{random.randint(1, 10)}"]
    return random.choice(gates)

def random_time():
    base_time = datetime.now()
    random_minutes = random.randint(0, 180)
    return (base_time + timedelta(minutes=random_minutes)).strftime("%Y-%m-%dT%H:%M:%SZ")

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='flight_status')

flights = [
    {"flightNumber": "AI101"},
    {"flightNumber": "AI102"},
    {"flightNumber": "AI103"},
    {"flightNumber": "AI104"},
    {"flightNumber": "AI105"},
    {"flightNumber": "AI106"},
    {"flightNumber": "AI107"},
    {"flightNumber": "AI108"},
    {"flightNumber": "AI109"},
    {"flightNumber": "AI110"},
    {"flightNumber": "AI111"},
    {"flightNumber": "AI112"},
    {"flightNumber": "AI113"},
    {"flightNumber": "AI114"},
    {"flightNumber": "AI115"},
    {"flightNumber": "AI116"},
    {"flightNumber": "AI117"},
    {"flightNumber": "AI118"},
    {"flightNumber": "AI119"},
    {"flightNumber": "AI120"}
]

for flight in flights:
    update = {
        "flightNumber": flight["flightNumber"],
        "status": random_status(),
        "gate": random_gate(),
        "departureTime": random_time(),
        "arrivalTime": random_time()
    }

    channel.basic_publish(
        exchange='',
        routing_key='flight_status',
        body=json.dumps(update)
    )

    print(f"Update sent for {flight['flightNumber']}: {update}")

connection.close()
