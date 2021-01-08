const mongoose = require("mongoose")

const username = process.env.DBUSERAME
const password = process.env.DBPASSWORD
const host = process.env.DBHOST
const db = process.env.DBNAME

const uri = `mongodb+srv://${username}:${password}@${host}/${db}?retryWrites=true&w=majority`

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() =>{
    console.log("DB connnection successful")
  })
  .catch(error => {
    console.log("DB connnection failed")
    console.log(error.message)
  })

mongoose.connection.on('connected', () => {
  console.log("Mongoose connected to DB");
})

mongoose.connection.on('error', (err) => {
  console.log(err.message);
})

mongoose.connection.on('disconnected', () => {
  console.log("Mongoose disconnected from DB");
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})