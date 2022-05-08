const MailosaurClient = require('mailosaur')
const mongoose = require('mongoose');
const ExecutionCounter = require('./models/executionCounter.js');
const Visit = require('./models/visit.js');
try {
  require('dotenv').config();
} catch (e) {
  console.log("no dotenv file")
}



mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', (e) => console.log(e));
db.on('open', () => {
  console.log("DB connection succesful")
  handleStatusMessage();  
});




const mailosaur = new MailosaurClient(process.env.API_KEY)


async function sendStatus(){
  //Creating date from which to take new visits
  let from = new Date();
  from.setHours(from.getHours() - parseInt(process.env.EXECUTIONS_BEFORE_MESSAGE)*24);
  const visits = await getVisistsInRange(from, new Date());

  let mailOptions = {
    to: process.env.RECIEVER,
    send: true,
    subject: "Status",
    html: `Automailer is running on Projekt_Doucko, it was visited ${visits.length} times last ${process.env.EXECUTIONS_BEFORE_MESSAGE} days. Visit dates: ${visits.map(visit => {return visit.visitDate})}`
  }
  console.log("sending mail ...")
  await mailosaur.messages.create(process.env.SERVER_ID, mailOptions);
  console.log("email sent.")

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
  console.log(executionCounter);

  //if it was triggered x times we should send new status message, and restart counter
  //else we should increment counter
  if(executionCounter.executions >= parseInt(process.env.EXECUTIONS_BEFORE_MESSAGE)){
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
