import pika
import json
import os
import requests
from twilio.rest import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Mailgun setup
MAILGUN_API_KEY = os.getenv('MAILGUN_API_KEY')
MAILGUN_DOMAIN = os.getenv('MAILGUN_DOMAIN')
NOTIFICATION_TO_EMAIL = os.getenv('NOTIFICATION_TO_EMAIL')

# Twilio setup
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
NOTIFICATION_TO_PHONE = os.getenv('NOTIFICATION_TO_PHONE')

# RabbitMQ connection
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='flight_status')

# Twilio client
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

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

def callback(ch, method, properties, body):
    flight = json.loads(body)
    send_email_notification(flight)
    send_sms_notification(flight)
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume(queue='flight_status', on_message_callback=callback)

print('Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
