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
  let str = JSON.stringify(req.body);
  str = str.replace('{"', "");
  str = str.replace('":""}', "");
  console.log(str);

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

app.listen(process.env.PORT || 5000, function() {

});
