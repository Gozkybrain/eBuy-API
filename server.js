const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors module
const data = require('./list.json');

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Set up CORS to allow requests from specific origins
app.use(cors({
    origin: [
        'http://localhost:3000', // Allow requests from localhost:3000
        'http://localhost:5173', // Vite default development server port
        'https://linzhomes-wi8h.vercel.app',
        'https://real-estate-ashen-mu.vercel.app' // Corrected production domain (removed trailing slash)
    ]
}));

// Route handler for the root path ("/") to display all properties
app.get('/', (req, res) => {
    res.json(data);
});

// Route to get properties by type
app.get('/properties/type/:type', (req, res) => {
    const { type } = req.params;
    const propertiesByType = data.filter(property => property.type.toLowerCase() === type.toLowerCase());
    res.json(propertiesByType);
});

// Route to get properties by location
app.get('/properties/location/:location', (req, res) => {
    const { location } = req.params;
    const propertiesByLocation = data.filter(property => property.location.toLowerCase() === location.toLowerCase());
    res.json(propertiesByLocation);
});

// Route to get properties by type and location
app.get('/properties/:type/:location', (req, res) => {
    const { type, location } = req.params;
    const propertiesByTypeAndLocation = data.filter(property => property.type.toLowerCase() === type.toLowerCase() && property.location.toLowerCase() === location.toLowerCase());
    res.json(propertiesByTypeAndLocation);
});

// Route to get a random property
app.get('/properties/random', (req, res) => {
    const randomProperty = data[Math.floor(Math.random() * data.length)];
    res.json(randomProperty);
});

// Route to get properties by price range below $500,000
app.get('/properties/price-below-500k', (req, res) => {
    const propertiesBelow500k = data.filter(property => parseFloat(property.price.replace(/[^0-9.-]+/g, "")) < 500000);
    res.json(propertiesBelow500k);
});

// Catch-all route for unsupported routes (Optional)
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

// Export the Express app as a Cloud Function
exports.app = functions.https.onRequest(app);
