import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Flight {
  _id: string; // Using MongoDB's default id field
  flightNumber: string;
  status: string;
  gate: string;
  departureTime: string;
  arrivalTime: string;
}

const SearchPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  useEffect(() => {
    fetchFlights();

    const socket = new WebSocket('ws://localhost:8000/ws/flights');
    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data) as Flight;
      console.log('Received data from WebSocket:', data);
      toast.info(`Flight ${data.flightNumber} status changed to ${data.status}`);
      fetchFlights();
    };
    socket.onerror = (error) => {
      console.log('WebSocket error:', error);
    };
    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    return () => {
      socket.close();
    };
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get<Flight[]>('http://localhost:8000/api/flights');
      setFlights(response.data);
      console.log('Fetched flights:', response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
  };

  return (
    <div className="App">
      <h1>Flight Status Updates</h1>
      <div className="flight-list">
        {flights.length > 0 ? (
          flights.map((flight) => (
            <div key={flight._id} onClick={() => handleFlightSelect(flight)}>
              <h2>{flight.flightNumber}</h2>
              <p>Status: {flight.status}</p>
              <p>Gate: {flight.gate}</p>
            </div>
          ))
        ) : (
          <p>No flights available</p>
        )}
      </div>
      {selectedFlight && (
        <div className="flight-details">
          <h2>Flight Details</h2>
          <p>Flight Number: {selectedFlight.flightNumber}</p>
          <p>Status: {selectedFlight.status}</p>
          <p>Gate: {selectedFlight.gate}</p>
          <p>Departure Time: {selectedFlight.departureTime}</p>
          <p>Arrival Time: {selectedFlight.arrivalTime}</p>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
}

export default SearchPage;
