const mongoose = require('mongoose');

const breachSchema = new mongoose.Schema({
  phone: { type: String, index: true },
  first_name: { type: String, index: true },
  last_name: { type: String, index: true },
  email: String,
  facebook_id: String,
  gender: String,
  location: String,
  current_city: String,
  hometown: String,
  job: String,
  date: String,
  time: String,
  ampm: String,
  extra: String
});

module.exports = mongoose.model('Breach', breachSchema, 'users');