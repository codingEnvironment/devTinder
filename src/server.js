const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const connectDB = require('./config/database');
const User = require('./models/userModel');
const port = 3000;

// mongodb+srv://gmaheshreddy538_db_user:qmZEqZGge2EiZTQp@cluster0.9copg9c.mongodb.net/

app.use(express.json()); // Middleware to parse JSON bodies

// app.use('/admin', (req, res, next) => {
//     console.log('first middleware');
//     //   res.send('Hello World!');
//     next()
// },
//     (req, res, next) => {
//         console.log('second middleware');
//         next()
//     },
//     (req, res, next) => {
//         console.log('third middleware');
//         next()
//     });
// app.use('/admin/about', (req, res) => {
//     res.send('About Page');
// });
// app.get('/{ab*cd}', (req, res) => {
//   res.send('ab ANYTHING cd')
// })
// app.get('/a{bc}d', (req, res) => {
//   res.send('a bc is optinal d')
// })

// signup
app.post('/signup', async (req, res) => {
    try {
        console.log(req.body);
        const { firstName, lastName, email, password } = req.body;
        const data = {
            firstName,
            lastName,
            email,
            password
        }
        await new User(data).save();
        res.send('User signed up successfully');
    } catch (err) {
        console.log('Error during signup:', err);
        res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.post('/login', async (req, res) => {
    /**
     * validate email and password ****
     * check email exists in database or not
     * if email exists then validate the password using bcrypt
     * if password is valid then create a token using jwt and send it to client in cookie
     */
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }
        // validated the password using bcrypt
        const token = jwt.sign({ _id: user._id }, 'testinggg');
        res.cookie('token', token, { httpOnly: true });
        res.send('Login successful');
    } catch (err) {
        console.log('Error during login:', err);
        res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.get('/profile', (req, res) => {
    /**
     * get the token from cookie
     * if token exists then verify the token using jwt
     * if token is valid then retrieve id from it
     * fetch the user details from database using id and send it to client
     */
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, 'testinggg');
            res.send(`Welcome to your profile, ${decoded.email}`);
        } catch (err) {
            res.status(401).send('Invalid token');
        }
    } else {
        res.status(401).send('No token provided');
    }
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
});