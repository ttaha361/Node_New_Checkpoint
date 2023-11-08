const express = require('express');
const cors = require('cors');
const db = require('./db'); // Update the path if necessary

const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3050;

const connectionString = process.env.DATABASE_URL;

app.use(express.json());
app.use(cors());

// Create a car
app.post('/cars', async (req, res) => {
  try {
    const { brand, model, year } = req.body;
    const newCar = await db.one('INSERT INTO cars(brand, model, year) VALUES($1, $2, $3) RETURNING *', [brand, model, year]);
    res.json(newCar);
    console.log('Git');
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a car
app.delete('/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.none('DELETE FROM cars WHERE id = $1', [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a person
app.post('/persons', async (req, res) => {
  try {
    const { name } = req.body;
    const newPerson = await db.one('INSERT INTO persons(name) VALUES($1) RETURNING *', [name]);
    res.json(newPerson);
  } catch (error) {
    console.error('Error creating person:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a person
app.delete('/persons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.none('DELETE FROM persons WHERE id = \$1', [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting person:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 });
 


// Sell a car to a person
app.put('/cars/sell/:carId/:personId', async (req, res) => {
  try {
    const { carId, personId } = req.params;
    await db.none('UPDATE cars SET owner_id = $1 WHERE id = $2', [personId, carId]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error selling car:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all persons
app.get('/persons', async (req, res) => {
  try {
    const persons = await db.any('SELECT * FROM persons');
    res.json(persons);
  } catch (error) {
    console.error('Error getting persons:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 });
 

// Get all cars and car owners
app.get('/cars', async (req, res) => {
  try {
    const cars = await db.any(`
      SELECT cars.id, cars.brand, cars.model, cars.year, persons.name AS owner_name
      FROM cars
      LEFT JOIN persons ON cars.owner_id = persons.id
    `);
    res.json(cars);
  } catch (error) {
    console.error('Error getting cars:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 });
 

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});