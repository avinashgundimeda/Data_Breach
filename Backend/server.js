const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({ windowMs: 60000, max: 10 });
app.use(limiter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected to:', process.env.MONGO_URI))
  .catch(err => console.log(err));
  
app.use('/api', require('./routes/breach'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});