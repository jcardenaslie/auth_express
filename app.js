const express = require("express")
const morgan = require("morgan")
const httpErrors = require("http-errors")
require("dotenv").config()
require("./helpers/init.mongodb")
require("./helpers/init.redis")
const { verifyAccessToken } = require("./helpers/jwt.helper")

const AuthRoute = require("./routes/auth.route")

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT = process.env.PORT || 4000

app.use("/auth", AuthRoute )

app.get("/", verifyAccessToken, async ( req, res, next )=> {
  res.send("Hola")
})

app.get("/protected", verifyAccessToken, async ( req, res, next )=> {
  res.send("Protected")
})

app.use( async (req, res, next ) => {
  next(httpErrors.NotFound())
})

app.use(async (err, req, res, next )=>{
  console.log(err);
  const status =  err.status || 500
  res.status(status).send({
    error:{
      status: err.status || 500,
      message: err.message
    }
  })
})


app.listen(PORT, ()=> {
  console.log(`Server runninng on port: ${PORT}`)
})