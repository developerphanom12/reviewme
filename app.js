const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const employeroutes = require('./routes/employer')
const employroutes = require('./routes/employroutes')
dotenv.config();


app.use(helmet());


app.use(express.json()); 

app.use(cors({ origin: true })); 



app.use('/api/employer',employeroutes)


app.use('/api/employ',employroutes)



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});



const port = process.env.PORT || 3500;
const ipAddress = '127.0.0.1';

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`Server is running on http://${ipAddress}:${port}`);
});
