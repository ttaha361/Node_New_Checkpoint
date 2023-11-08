import React, { useState, useEffect } from 'react';

const App = () => {
  const [cars, setCars] = useState([]);
  const [persons, setPersons] = useState([]);
  const [newCar, setNewCar] = useState({ brand: '', model: '', year: '' });
  const [newPerson, setNewPerson] = useState({ name: '' });
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [showOwners, setShowOwners] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsResponse, personsResponse] = await Promise.all([
          fetch('http://localhost:3050/cars'),
          fetch('http://localhost:3050/persons'),
        ]);

        if (carsResponse.ok) {
          const carsData = await carsResponse.json();
          setCars(carsData);
        } else {
          console.error('Error fetching cars:', carsResponse.statusText);
        }

        if (personsResponse.ok) {
          const personsData = await personsResponse.json();
          setPersons(personsData);
        } else {
          console.error('Error fetching persons:', personsResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.message);
        if (error instanceof TypeError) {
          console.error('This is a network error');
        } else {
          console.error('This is not a network error');
        }
      }

    };

    fetchData();
  }, []);

  const handleDeletePerson = async (id) => {
    try {
      await fetch(`http://localhost:3050/persons/${id}`, { method: 'DELETE' });
      setPersons(persons.filter(person => person.id !== id));
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  const getCarOwners = () => {
    return persons.filter(person => {
      const car = cars.find(car => {
        console.log('Checking car:', car.owner_id, 'against person:', person.id);
        return car.owner_id === person.id;
      });
      return car !== undefined;
    });
  };



  const handleCreateCar = async () => {
    try {
      const response = await fetch('http://localhost:3050/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCar),
      });

      if (response.ok) {
        const newCar = await response.json();
        setCars(prevCars => [...prevCars, newCar]);
        setNewCar({ brand: '', model: '', year: '' });
      } else {
        console.error('Error creating car:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating car:', error);
    }
  };

  const handleDeleteCar = async (id) => {
    try {
      const response = await fetch(`http://localhost:3050/cars/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCars(prevCars => prevCars.filter(car => car.id !== id));
      } else {
        console.error('Error deleting car:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const handleCreatePerson = async () => {
    try {
      const response = await fetch('http://localhost:3050/persons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPerson),
      });

      if (response.ok) {
        const newPerson = await response.json();
        setPersons(prevPersons => [...prevPersons, newPerson]);
        setNewPerson({ name: '' });
      } else {
        console.error('Error creating person:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating person:', error);
    }
  };

  const handleSellCar = async (carId) => {
    try {
      const response = await fetch(`http://localhost:3050/cars/sell/${carId}/${selectedPersonId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        // Handle success as needed
        console.log(`Sold car with ID ${carId} to person with ID ${selectedPersonId}`);

        // Update the list of cars
        fetch('http://localhost:3050/cars')
          .then(response => response.json())
          .then(data => setCars(data))
          .catch(error => console.error('Error fetching cars:', error));
      } else {
        console.error('Error selling car:', response.statusText);
      }
    } catch (error) {
      console.error('Error selling car:', error);
    }
  };
  console.log('Persons:', persons);
  console.log('Cars:', cars);

  return (
    <div className='mainDiv'>
      <h1>Taha Oren's 33 Car Shop</h1>
      <h2>Welcome</h2>

      <div className='carDiv'>
        <h2>Cars</h2>
        <ul>
          {cars.map(car => (
            <li key={car.id}>
              {`${car.brand} ${car.model} (${car.year}) - Owner: ${car.owner_name || 'None'}`}
              <button onClick={() => handleDeleteCar(car.id)}>Delete</button>
            </li>
          ))}
        </ul>


        <h2>Create Car</h2>
        <label>
          Brand:
          <input type="text" value={newCar.brand} onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })} />
        </label>
        <label>
          Model:
          <input type="text" value={newCar.model} onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} />
        </label>
        <label>
          Year:
          <input type="number" value={newCar.year} onChange={(e) => setNewCar({ ...newCar, year: e.target.value })} />
        </label>
        <button onClick={handleCreateCar}>Create Car</button>
      </div>

      <div className='personDiv'>
        <h2>Persons</h2>
        <ul>
          {persons.map(person => (
            <li key={person.id}>
              {person.name}
              <button onClick={() => handleDeletePerson(person.id)}>Delete</button>
            </li>
          ))}
        </ul>

        <h2>Create Person</h2>
        <label>
          Name:
          <input type="text" value={newPerson.name} onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })} />
        </label>
        <button onClick={handleCreatePerson}>Create Person</button>
      </div>
      <div>
        <h2>Sell Car</h2>
        <label>
          Select Car:
          <select value={selectedCarId} onChange={(e) => setSelectedCarId(e.target.value)}>
            <option value="">Select Car</option>
            {cars.map(car => (
              <option key={car.id} value={car.id}>
                {`${car.brand} ${car.model} (${car.year}) - Owner: ${car.owner_name || 'None'}`}
              </option>
            ))}
          </select>
        </label>
        <label>
          Select Owner:
          <select value={selectedPersonId} onChange={(e) => setSelectedPersonId(e.target.value)}>
            <option value="">Select Person</option>
            {persons.map(person => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </label>
        <button onClick={() => handleSellCar(selectedCarId, selectedPersonId)}>Sell Car</button>
      </div>
    </div>
  );
};

export default App;
