const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = new express();

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//app.get('/', (req, res) => res.send('API Running'));

// Define Routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Server static assests in production
if (process.env.NODE_ENV === 'production') {
    //Set static folder

    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        // go from curr dir to the client dir then to the build folder and launch index.html
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));