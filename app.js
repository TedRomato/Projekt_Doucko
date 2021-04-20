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

const errorAlert = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ERRORALERTADRESS,
    pass: process.env.ERRORALERTPASSWORD
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

  mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECIEVER,
    subject: 'New Client',
    html: str
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log("Error sending email");
      let errorContent = JSON.stringify(error) + "\n\nUser request:" + str;
      let errorAlertMessageOptions = {
        from: process.env.ERRORALERTADRESS,
        to: process.env.ERRORALERTADRESS,
        subject: "Projekt doucko email error",
        html: errorContent
      }
      errorAlert.sendMail(errorAlertMessageOptions, function(err, info){
        if(err){
          console.log("couldnt send error alert");
        }else{
          console.log("error alert has been sent");
        }
      })
    } else {
      console.log('Email sent: ' + info.response);
    }
  });


  res.redirect("/");
});

app.listen(process.env.PORT || 5000, function() {

});
