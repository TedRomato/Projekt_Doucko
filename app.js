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


let visits = 0;
let errorCount = 0;

app.get('/', function(req, res) {
  ++visits;
  res.sendFile(__dirname + '/index.html');

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

  transporter.sendMail(mailOptions, function(error, info) {
    if (error){
      alertErrorSendingEmail(error, str);
      return;
    }
    console.log('Email sent: ' + info.response);
  });


  res.redirect("/");
});


function alertErrorSendingEmail(error, failedRequestData){
    errorCount++;
    console.log("Error sending email");
    let errorContent = JSON.stringify(error) + "\n\nUser request:" + failedRequestData;
    let errorAlertMessageOptions = {
      from: process.env.ERRORALERTADRESS,
      to: process.env.ERRORALERTADRESS,
      subject: "Projekt doucko email error",
      html: errorContent
    }
    errorAlert.sendMail(errorAlertMessageOptions, function(err, info){
      if(err){
        console.log("couldnt send error alert");
        return;
      }
      console.log("error alert has been sent");
    })

}

const statusDelayDays = 3;
const intervalLenght = statusDelayDays*24*60*60*1000;

setInterval(() => {
  sendErrorAlertStatus();
  sendStatusWebsiteEmail();
  visits = 0;
  errorCount = 0;
}
, intervalLenght);


function sendStatusWebsiteEmail(){
  let websiteStatusOptions = {
    from: process.env.EMAIL,
    to: process.env.RECIEVER,
    subject: "Status",
    html: `Server is running. Website has been loaded ${visits} times in last ${statusDelayDays} days.`
  }
  transporter.sendMail(websiteStatusOptions, function(error, info) {
    if (error){
      alertErrorSendingEmail();
      return;
    }
    console.log('Automailer status email sent');
  });
}

function sendErrorAlertStatus(){
  let websiteStatusOptions = {
    from: process.env.ERRORALERTADRESS,
    to: process.env.ERRORALERTADRESS,
    subject: "Status",
    html: `Error alert is tunning on Projekt_Doucko. There were ${errorCount} error(s) in last ${statusDelayDays} days.`
  }
  errorAlert.sendMail(websiteStatusOptions, function(error, info) {
    if (error){
      alertErrorSendingEmail();
      return;
    }
    console.log('Error alert status email sent');
  });
}

app.listen(process.env.PORT || 5000, function() {

});
