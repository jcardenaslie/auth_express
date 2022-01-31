const mongoose = require("mongoose")
const colors = require('colors');

const username = process.env.DBUSERAME
const password = process.env.DBPASSWORD
const host = process.env.DBHOST
const db = process.env.DBNAME
let uri = ""

console.log(process.env.ENV)

if (process.env.ENV === "local") {
  uri = `mongodb://${username}:${password}@localhost:27017`
} else {
  uri = `mongodb+srv://${username}:${password}@${host}/${db}?retryWrites=true&w=majority`  
}

console.log(uri)


// TODO: make async
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    dbName: db
  })
  .then(() =>{
    console.log("DB connnection successful".green)
  })
  .catch(error => {
    console.log("DB connnection failed".red)
    console.log(error.message)
  })

mongoose.connection.on('connected', () => {
  console.log("Mongoose connected to DB".green);
})

mongoose.connection.on('error', (err) => {
  console.log(err.message.red);
})

mongoose.connection.on('disconnected', () => {
  console.log("Mongoose disconnected from DB".red);
})

mongoose.set("debug", true);

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})