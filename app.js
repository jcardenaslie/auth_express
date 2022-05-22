// TODO: Separar entre config (Infra) y api (App)
// TODO: implementar helmet, logger, sentry

const express = require("express")
const morgan = require("morgan")
const httpErrors = require("http-errors")
const cors = require('cors')

require("dotenv").config()
require("./helpers/init.mongodb")
require("./helpers/init.redis")

const initApplication = require ("./api")

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT = process.env.PORT || 4000

initApplication(app)

app.listen(PORT, ()=> {
  console.log(`Server runninng on port: ${PORT}`)
})

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server')
  app.close(() => {
    debug('HTTP server closed')
  })
})