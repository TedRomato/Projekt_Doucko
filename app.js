const express = require('express');
const app = express();
const MailosaurClient = require('mailosaur')
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

const mailosaur = new MailosaurClient(process.env.API_KEY)


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

app.post('/form', async function(req, res) {
  let str = JSON.stringify(req.body);
  str = str.replace('{"', "");
  str = str.replace('":""}', "");

  let mailOptions;

  mailOptions = {
    send: true,
    to: process.env.RECIEVER,
    subject: 'New Client',
    html: str
  };

  const status = await mailosaur.messages.create(process.env.SERVER_ID, mailOptions);
  console.log(status);

  res.redirect("/");
});


app.listen(process.env.PORT || 5000, function() {

});
