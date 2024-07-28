import pika
import json

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='flight_status')

update = {
    "flightNumber": "AA123",
    "status": "Boarding",
    "gate": "A1",
    "departureTime": "2024-07-29T14:00:00Z",
    "arrivalTime": "2024-07-29T16:00:00Z"
}

channel.basic_publish(
    exchange='',
    routing_key='flight_status',
    body=json.dumps(update)
)

print("Update sent.")
connection.close()
