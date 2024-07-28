import pika
import json

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='flight_status')

def send_email_notification(flight):
    print(f"Sending email notification for flight {flight['flightNumber']} with status {flight['status']}")

def send_sms_notification(flight):
    print(f"Sending SMS notification for flight {flight['flightNumber']} with status {flight['status']}")

def callback(ch, method, properties, body):
    flight = json.loads(body)
    send_email_notification(flight)
    send_sms_notification(flight)
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume(queue='flight_status', on_message_callback=callback)

print('Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
