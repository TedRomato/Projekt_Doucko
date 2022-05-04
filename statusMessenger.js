const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const ExecutionCounter = require('./models/executionCounter.js');
const Visit = require('./models/visit.js');
require('dotenv').config();


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

const errorMailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ERRORALERTADRESS,
    pass: process.env.ERRORALERTPASSWORD
  }
});


async function sendStatus(){
  console.log(parseInt(process.env.LOGGED_VISITS_DAYS_BACK));
  //Creating date from which to take new visits
  let from = new Date();
  from.setHours(from.getHours() - parseInt(process.env.LOGGED_VISITS_DAYS_BACK)*24);
  const visits = await getVisistsInRange(from, new Date());

  let websiteStatusOptions = {
    from: process.env.EMAIL,
    to: process.env.RECIEVER,
    subject: "Status",
    html: `Automailer is running on Projekt_Doucko, it was visited ${visits.length} times last ${process.env.LOGGED_VISITS_DAYS_BACK} days. Visit dates: ${visits.map(visit => {return visit.visitDate})}`
  }
  transporter.sendMail(websiteStatusOptions, function(e, info) {
    if (e){
      console.error(e.name + ":" + e.message);
      return;
    }
    console.log('Automailer status email sent');
  });

  websiteStatusOptions.to = process.env.EMAIL;
  transporter.sendMail(websiteStatusOptions, function(e, info) {
    if (e){
      console.error(e.name + ":" + e.message);
      return;
    }
    console.log('Automailer status email sent');
  });

  let errorStatusOptions = {
    from: process.env.ERRORALERTADRESS,
    to: process.env.ERRORALERTADRESS,
    subject: "Status",
    html: `Erromailer is up and running on Projekt_Doucko`
  }
  errorMailer.sendMail(errorStatusOptions, function(e, info) {
    if (e){
      console.error(e.name + ":" + e.message);
      return;
    }
    console.log('Error  status email sent');
  });
}


async function getVisistsInRange(from, to){
  return Visit.find({
    visitDate: {
        $gte: from,
        $lt: to
    }
})
}


async function getExecutionCounter(){
  let executionCounter;
  try {
    executionCounter = await ExecutionCounter.find();
    console.log(executionCounter);
    return executionCounter[0];
  } catch (e) {
    console.error(e.name + ":" + e.message)
    return null;
  }
}

async function updateExecutionCounter(executionCounter, updatedValue){
  if(typeof updatedValue === 'Number') throw new Error("updatedValue must be a number");
  try {
    executionCounter.executions = updatedValue;
    console.log(executionCounter);
    await executionCounter.save();
    return true;
  } catch (e) {
    console.error(e.name + ":" + e.message)
    return null;
  }
}


async function handleStatusMessage(){
  //get amount of times this script was triggered from last status message
  const executionCounter = await getExecutionCounter();

  //if it was triggered x times we should send new status message, and restart counter
  //else we should increment counter
  if(executionCounter.executions >= parseInt(process.env.EXECUTIONS_BEFORE_STATUS_MESSAGE)){
    try {
      await sendStatus();
      await updateExecutionCounter(executionCounter, 0);
    } catch (e) {
      console.error(e.name + ":" + e.message)
    }
  }else{
    try {
      updateExecutionCounter(executionCounter, executionCounter.executions + 1);
    } catch (e) {
      console.error(e.name + ":" + e.message)
    }
  }
}

handleStatusMessage();
