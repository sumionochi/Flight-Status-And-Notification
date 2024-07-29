import pika
import json
import os
import smtplib
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = int(os.getenv('SMTP_PORT'))
EMAIL_USERNAME = os.getenv('EMAIL_USERNAME')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
NOTIFICATION_TO_EMAIL = os.getenv('NOTIFICATION_TO_EMAIL')
NOTIFICATION_TO_PHONE = os.getenv('NOTIFICATION_TO_PHONE')

VERIZON = f"{NOTIFICATION_TO_PHONE}@vtext.com"

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='flight_status')

def send_email_notification(flight):
    try:
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)

        subject = f'Flight {flight["flightNumber"]} Status Update'
        body = (f'Flight {flight["flightNumber"]} status changed to {flight["status"]}. '
                f'Gate: {flight["gate"]}, Departure Time: {flight["departureTime"]}, '
                f'Arrival Time: {flight["arrivalTime"]}.')
        
        message = f'Subject: {subject}\n\n{body}'
        
        server.sendmail(EMAIL_USERNAME, NOTIFICATION_TO_EMAIL, message)
        server.quit()
        
        print("Email sent successfully")
    except Exception as e:
        print(f"Error sending email: {e}")

def send_sms_notification(flight):
    try:
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
        
        body = (f'Flight {flight["flightNumber"]} status changed to {flight["status"]}. '
                f'Gate: {flight["gate"]}, Departure Time: {flight["departureTime"]}, '
                f'Arrival Time: {flight["arrivalTime"]}.')
        
        message = f'Subject: Flight Status Update\n\n{body}'
        
        server.sendmail(EMAIL_USERNAME, VERIZON, message)
        server.quit()
        
        print("SMS sent successfully")
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
