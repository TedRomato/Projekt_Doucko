const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Visit = require('./models/visit.js');
require('dotenv').config();


app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', (e) => console.log(e));
db.on('open', () => console.log("DB connection succesful"));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});


app.get('/',async function(req, res) {
  res.sendFile(__dirname + '/index.html');
  try {
    const newVisit = new Visit();
    newVisit.save();
  } catch (e) {
    console.log("Error: ");
    console.error(e);
  }
});

app.post('/form', function(req, res) {
  let str = JSON.stringify(req.body);
  str = str.replace('{"', "");
  str = str.replace('":""}', "");

  let mailOptions;

  mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECIEVER,
    subject: 'New Client',
    html: str
  };

  transporter.sendMail(mailOptions, function(e, info) {
    if (e){
      console.error(e.name + ":" + e.message);
      return;
    }
    console.log('Email sent: ' + info.response);
  });


  res.redirect("/");
});


app.listen(process.env.PORT || 5000, function() {

});
