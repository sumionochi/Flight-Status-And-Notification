import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Flight {
  id: number;
  flightNumber: string;
  status: string;
  gate: string;
  departureTime: string;
  arrivalTime: string;
}

function SearchPage() {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  
    useEffect(() => {
      fetchFlights();
    }, []);
  
    const fetchFlights = async () => {
      try {
        const response = await axios.get<Flight[]>('http://localhost:8000/api/flights');
        setFlights(response.data);
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
          {flights.map((flight) => (
            <div key={flight.id} onClick={() => handleFlightSelect(flight)}>
              <h2>{flight.flightNumber}</h2>
              <p>Status: {flight.status}</p>
              <p>Gate: {flight.gate}</p>
            </div>
          ))}
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
      </div>
    );
}

export default SearchPage;
