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
  departing: string;
  arriving: string;
}

const SearchPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [formData, setFormData] = useState({
    departing: '',
    arriving: '',
    flightNo: '',
    departureDate: ''
  });

  const dummyLocations = [
    'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat',
    'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
    'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
    'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad',
    'Amritsar', 'Navi Mumbai', 'Allahabad', 'Howrah', 'Ranchi', 'Coimbatore', 'Jabalpur', 'Gwalior',
    'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur',
    'Hubli-Dharwad', 'Bareilly', 'Mysore', 'Tiruchirappalli', 'Tiruppur', 'Gurgaon', 'Aligarh',
    'Jalandhar', 'Bhubaneswar', 'Salem', 'Mira-Bhayandar', 'Warangal', 'Thiruvananthapuram',
    'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur',
    'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur',
    'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain',
    'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar'
  ];
  

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format as yyyy-mm-dd
    setFormData((prevFormData) => ({
      ...prevFormData,
      departureDate: formattedDate
    }));
  }, []);

  const fetchFlights = async (query: object) => {
    try {
      const response = await axios.get<Flight[]>('http://localhost:8000/api/flights', { params: query });
      setFlights(response.data);
      console.log('Fetched flights:', response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
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
      <div className='max-w-3xl mt-10 lg:max-w-5xl mx-auto'>
        <h2 className='text-2xl mb-5 font-bold'>Check Flight Status</h2>
        <p className='mb-14 text-base'>With IndiGo's flight tracker, you can now track the live status of domestic and international flights. Just enter a few details such as flight number, travel date, departing and arriving locations and get the flight status on the go from anywhere.</p>
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
      </div>
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
          <p>Departing: {selectedFlight.departing}</p>
          <p>Arriving: {selectedFlight.arriving}</p>
        </div>
      )}
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
        <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-y-auto">
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
