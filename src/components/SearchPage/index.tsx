import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BookmarkCheck, BookmarkX } from 'lucide-react';

interface Flight {
  _id: string; // Using MongoDB's default id field
  flightNumber: string;
  status: string;
  gate: string;
  departureTime: string;
  arrivalTime: string;
  departing: string;
  arriving: string;
}

const SearchPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [taggedFlights, setTaggedFlights] = useState<Flight[]>([]);
  const [formData, setFormData] = useState({
    departing: '',
    arriving: '',
    flightNo: '',
    departureDate: ''
  });

  const dummyLocations = [
    'Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Ahmedabad',
    'Pune', 'Goa', 'Jaipur', 'Lucknow', 'Patna', 'Bhubaneswar', 'Chandigarh',
    'Guwahati', 'Indore', 'Bhopal', 'Kochi', 'Trivandrum', 'Nagpur', 'Vadodara'
  ];

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format as yyyy-mm-dd
    setFormData((prevFormData) => ({
      ...prevFormData,
      departureDate: formattedDate
    }));

    const storedTaggedFlights = localStorage.getItem('taggedFlights');
    if (storedTaggedFlights) {
      setTaggedFlights(JSON.parse(storedTaggedFlights));
    }

    const socket = new WebSocket('ws://localhost:8000/ws/flights');
    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data) as Flight;
      if (taggedFlights.some(flight => flight.flightNumber === data.flightNumber)) {
        toast.info(`Flight ${data.flightNumber} status changed to ${data.status}`);
        updateTaggedFlight(data);
      }
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
  }, [taggedFlights]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/flights');
    socket.onopen = () => {
      console.log('WebSocket connection opened');
      socket.send(JSON.stringify({ taggedFlights: taggedFlights.map(flight => flight.flightNumber) }));
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (taggedFlights.some(flight => flight.flightNumber === data.flightNumber)) {
        toast.info(`Flight ${data.flightNumber} status changed to ${data.status}`);
        updateTaggedFlight(data);
      }
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
  }, [taggedFlights]);
  

  const fetchFlights = async (query: object) => {
    try {
      const response = await axios.get<Flight[]>('http://localhost:8000/api/flights', { params: query });
      setFlights(response.data);
      console.log('Fetched flights:', response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const updateTaggedFlight = (updatedFlight: Flight) => {
    setTaggedFlights(prevTaggedFlights => {
      const updatedTaggedFlights = prevTaggedFlights.map(flight =>
        flight.flightNumber === updatedFlight.flightNumber ? updatedFlight : flight
      );
      localStorage.setItem('taggedFlights', JSON.stringify(updatedTaggedFlights));
      return updatedTaggedFlights;
    });
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
  };

  const handleTagFlight = (flight: Flight) => {
    setTaggedFlights((prevTaggedFlights) => {
      const updatedTaggedFlights = prevTaggedFlights.some(f => f.flightNumber === flight.flightNumber)
        ? prevTaggedFlights.filter(f => f.flightNumber !== flight.flightNumber)
        : [...prevTaggedFlights, flight];
      localStorage.setItem('taggedFlights', JSON.stringify(updatedTaggedFlights));
      return updatedTaggedFlights;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { flightNo } = formData;
    if (flightNo && flightNo.length !== 5) {
      toast.error('Flight number must be 5 characters long in the format AA123');
      return;
    }

    const firstTwoChars = flightNo.slice(0, 2);
    const lastThreeChars = flightNo.slice(2);

    if (flightNo && (!/^[A-Z]+$/.test(firstTwoChars) || !/^\d+$/.test(lastThreeChars))) {
      toast.error('Flight number must be in the format AA123 with first two characters as capital letters and last three as numbers');
      return;
    }

    fetchFlights(formData);
  };

  return (
    <div className="App">
      <div className='max-w-3xl mt-10 lg:max-w-5xl mx-auto p-4'>
        <h2 className='text-2xl mb-5 font-bold'>Check Flight Status</h2>
        <p className='mb-14 text-base'>With IndiGo's flight tracker, you can now track the live status of domestic and international flights. Just enter a few details such as flight number, travel date, departing and arriving locations and get the flight status on the go from anywhere.</p>
        <div className='flex flex-col gap-8'>
          <form onSubmit={handleSubmit} className=''>
            <p className='mb-4 text-gray-500'>Enter flight details to check your flight status.</p>
            <div className='grid grid-cols-3 gap-4 mb-4 items-end'>
              <div>
                <Dropdown
                  options={dummyLocations}
                  value={formData.departing}
                  onChange={(value) => setFormData({ ...formData, departing: value })}
                  placeholder="Departing"
                />
              </div>
              <div>
                <Dropdown
                  options={dummyLocations}
                  value={formData.arriving}
                  onChange={(value) => setFormData({ ...formData, arriving: value })}
                  placeholder="Arriving"
                />
              </div>
              <div>
                <input
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  className='w-full text-lg border p-2 rounded border-t-0 border-l-0 border-r-0 outline-none border-b-2 border-gray-300'
                  value={formData.departureDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4 mt-8 mb-4 items-end'>
              <div>
                <input
                  type="text"
                  id="flightNo"
                  name="flightNo"
                  className='w-full text-lg border p-2 rounded border-t-0 border-l-0 border-r-0 outline-none border-b-2 border-gray-300'
                  value={formData.flightNo}
                  onChange={handleChange}
                  placeholder="AA123"
                />
              </div>
            </div>
            <div className='flex mt-8 w-full justify-end'>
              <button type="submit" className='px-20 bg-blue-900 text-white p-4 font-bold rounded hover:bg-blue-900/80 transition duration-300 ease-in-out'>
                Search Flight
              </button>
            </div>
          </form>
          <div className="tagged-flights w-full">
          <h3 className="text-2xl mb-4 font-bold">Tagged Flights</h3>
          {taggedFlights.length > 0 ? (
            taggedFlights.map((flight) => (
              <div key={flight._id} className="border flex flex-row justify-between w-full p-4 rounded mb-4 shadow hover:shadow-lg transition duration-300 ease-in-out">
              <div>
                  <h2 className="text-xl font-bold">{flight.flightNumber}</h2>
                  <p><strong>Status:</strong> {flight.status}</p>
                  <p><strong>Gate:</strong> {flight.gate}</p>
                  <p><strong>Departure Time:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
                  <p><strong>Arrival Time:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
                  <p><strong>Departure Location:</strong> {flight.departing}</p>
                  <p><strong>Arrival Location:</strong> {flight.arriving}</p>
              </div>
              <div>
                <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out"
                    onClick={() => handleTagFlight(flight)}
                  >
                    <BookmarkX/>
                </button>
              </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No tagged flights</p>
          )}
          </div>
          <div className="flight-list">
          <h3 className="text-2xl mb-4 font-bold">Flight Details</h3>
            {flights.length > 0 ? (
              flights.map((flight) => (
                <div key={flight._id} onClick={() => handleFlightSelect(flight)} className="border flex flex-row justify-between p-4 rounded mb-4 shadow hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
                  <div>
                  <h2 className="text-xl font-bold">{flight.flightNumber}</h2>
                  <p><strong>Status:</strong> {flight.status}</p>
                  <p><strong>Gate:</strong> {flight.gate}</p>
                  <p><strong>Departure Time:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
                  <p><strong>Arrival Time:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
                  <p><strong>Departure Location:</strong> {flight.departing}</p>
                  <p><strong>Arrival Location:</strong> {flight.arriving}</p>
                  </div>
                  <div>
                  <button
                    className="px-2 py-1 bg-blue-900 text-white rounded hover:bg-blue-700 transition duration-300 ease-in-out"
                    onClick={() => handleTagFlight(flight)}
                  >
                    {taggedFlights.some(f => f.flightNumber === flight.flightNumber) ? <BookmarkX/> : <BookmarkCheck/>}
                  </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No flights available</p>
            )}
          </div>
        </div>
      </div>

      
      <ToastContainer />
    </div>
  );
}

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onClick={() => setIsOpen(!isOpen)}
        className='w-full text-lg border p-2 rounded border-t-0 border-l-0 border-r-0 outline-none border-b-2 border-gray-300'
      />
      {isOpen && (
        <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-y-auto shadow-lg z-10">
          {options
            .filter((option) => option.toLowerCase().includes(value.toLowerCase()))
            .map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="cursor-pointer p-2 hover:bg-gray-200"
              >
                {option}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;
