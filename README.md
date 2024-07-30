# Real-Time Flight Status Tracking System

# Presentation PPT - [Flight Status & Tracking System](https://www.canva.com/design/DAGMc7aO7Go/VJpQJjighureOPXtJnOtSw/edit?utm_content=DAGMc7aO7Go&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

---

Video Demo - 

https://github.com/user-attachments/assets/7b01749c-cc17-43a0-860d-0187c68eb8dc

---
A comprehensive system for real-time flight status updates, designed to notify users about tagged flights through email and SMS. Built with FastAPI, MongoDB, RabbitMQ, and React.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Code Snippets](#code-snippets)
- [Contributing](#contributing)

## Introduction

The Real-Time Flight Status Tracking System provides users with real-time updates on flight statuses. Users can tag specific flights they want to monitor, and receive updates through email and SMS.

![image](https://github.com/user-attachments/assets/581dc1f1-3c48-4de3-974a-2e1357a29ea6)


## Features

- Real-time flight status updates
- Notifications via email and SMS for tagged flights
- Search for flights by departing, arriving, flight number, and departure date
- User-friendly interface for tagging and monitoring flights

![Screenshot 2024-07-31 005948](https://github.com/user-attachments/assets/02ff97f6-2998-482b-871f-d537d85d5359)
![Screenshot 2024-07-31 010043](https://github.com/user-attachments/assets/0e66ad83-0bf4-45ad-9625-9a4e6291abdc)
![Screenshot 2024-07-31 010049](https://github.com/user-attachments/assets/346fb57f-f400-4a6c-bd5c-cff74cbc8b66)

## Architecture

- **Backend:** FastAPI
- **Database:** MongoDB
- **Message Queue:** RabbitMQ
- **Frontend:** React, Typescript

## Installation

### Prerequisites

- Python 3.x
- Node.js
- MongoDB
- RabbitMQ

### Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/flight-status-tracker.git
    cd flight-status-tracker/backend
    ```

2. Install dependencies:
    ```sh
    fastapi
    pydantic
    uvicorn
    pymongo
    python-dotenv
    requests
    twilio
    pika

    ```

**Create and Activate Virtual Environment**

    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Create a `.env` file with the following variables:
    ```env
    MONGODB_CONNECTION_STRING=your_mongodb_connection_string
    MAILGUN_API_KEY=your_mailgun_api_key
    MAILGUN_DOMAIN=your_mailgun_domain
    NOTIFICATION_TO_EMAIL=your_email
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=your_twilio_phone_number
    NOTIFICATION_TO_PHONE=your_phone_number
    ```

4. Run the FastAPI server:
    ```sh
    uvicorn main:app --reload
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd ../frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Start the React development server:
    ```sh
    npm start
    ```

## Usage

1. Visit the frontend URL (usually `http://localhost:3000`).
2. Use the search form to find flights.
3. Tag flights to monitor them.
4. Receive real-time updates for tagged flights.

## API Endpoints

### Get Flights
- **URL:** `/api/flights`
- **Method:** `GET`
- **Query Parameters:** `departing`, `arriving`, `flightNo`, `departureDate`

### Update Flight
- **URL:** `/api/flights/update`
- **Method:** `POST`
- **Body:** JSON containing flight details

## Code Snippets

### Backend (FastAPI)
```python
@app.get("/api/flights")
async def get_flights(departing: str, arriving: str, flightNo: str, departureDate: str):
    query = { ... }
    flights = list(flights_collection.find(query, {"_id": 0}))
    return flights

def send_email_notification(flight):
    response = requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={"from": f"Flight Notifications <mailgun@{MAILGUN_DOMAIN}>",
              "to": NOTIFICATION_TO_EMAIL,
              "subject": f'Flight {flight["flightNumber"]} Status Update',
              "text": f'Flight {flight["flightNumber"]} status changed to {flight["status"]}. Gate: {flight["gate"]}, Departure Time: {flight["departureTime"]}, Arrival Time: {flight["arrivalTime"]}.'})
```

![Screenshot 2024-07-31 010105](https://github.com/user-attachments/assets/368a3c18-fafd-4dc0-bba2-3afb34edf93a)

### Frontend (React)
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  fetchFlights(formData);
};

const tagFlight = (flight) => {
  setTaggedFlights([...taggedFlights, flight]);
};
```
![Screenshot 2024-07-31 010056](https://github.com/user-attachments/assets/8e45f35b-bffb-4baf-83ef-8b7766506e86)
![Screenshot 2024-07-31 010137](https://github.com/user-attachments/assets/14f59a1b-fd9c-45d5-8515-52096910ae98)


## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss improvements or features.
