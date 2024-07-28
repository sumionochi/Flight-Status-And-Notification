// src/App.tsx
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

  return (
    <div className="SearchPage">
      <h1>Flight Status Updates</h1>
      <div className="flight-list">
        {flights.map((flight) => (
          <div key={flight.id}>
            <h2>{flight.flightNumber}</h2>
            <p>Status: {flight.status}</p>
            <p>Gate: {flight.gate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
