const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true, // Allow cookies to be sent with requests
}));
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const requestRoutes = require('./routes/request'); // Importing the request routes
const userRoutes = require('./routes/user'); // Importing the user routes
const dotenv = require('dotenv');
dotenv.config();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

/**
 * if we enable the below code then for any route it always executes the below code and sends the response as "Welcome to DevTinder API" and 
 * it will not execute the actual route handler code for that route. So we should not enable the below code. We can use it for testing purpose only.
 * but for the express router all apis works because we are not directly passing the route handler function to the app.use() method, instead we are passing 
 * the router object which internally maintains the list of routes and their handlers and it executes the correct handler based on the route and method of the request.
 */
// app.use('/', (req, res) => {
//     console.log('Received request for root endpoint');
//     res.send('Welcome to DevTinder API');
// });

app.use('/', authRoutes);
app.use('/profile', profileRoutes);
app.use('/', requestRoutes);
app.use('/', userRoutes);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
});