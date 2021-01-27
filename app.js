const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");
require('dotenv').config();


app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

let mailOptions;


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');

});

app.post('/form', function(req, res) {
  console.log("jsem tu");
  console.log(req.body.subject);

  str = "<p>name: " + req.body.name + "<br>" +
    "e-mail: " + req.body.email + "<br>" +
    "subject: " + req.body.subject + "<br>" +
    "lvl: " + req.body.lvl + "<br>" +
    "frequency: " + req.body.frequency + "<br>" +
    "time-note: " + req.body.time_note + "<br>" +
    "lection_type: " + req.body.lection_type + "<br>" +
    "notes: " + req.body.notes + "<br></p>";

  mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'New Client',
    html: str
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {

});
