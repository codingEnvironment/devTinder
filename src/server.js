const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const port = 3000;

// mongodb+srv://gmaheshreddy538_db_user:qmZEqZGge2EiZTQp@cluster0.9copg9c.mongodb.net/

app.use(express.json()); // Middleware to parse JSON bodies

/**
 * if we enable the below code then for any route it always executes the below code and sends the response as "Welcome to DevTinder API" and 
 * it will not execute the actual route handler code for that route. So we should not enable the below code. We can use it for testing purpose only.
 */
// app.use('/', (req, res) => {
//     console.log('Received request for root endpoint');
//     res.send('Welcome to DevTinder API');
// });

app.use('/', authRoutes);
app.use('/profile', profileRoutes);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
});