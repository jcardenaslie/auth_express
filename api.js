const AuthRoute = require("./routes/auth.route")
const UsersRoute = require("./routes/users.routes")
const FriendsRoute = require("./routes/friends.routes")
const NotificationsRoute = require("./routes/notifications.routes")
const httpErrors = require("http-errors")

const { verifyAccessToken } = require("./helpers/jwt.helper")


const initApplication = (app) => {
  app.use("/auth", AuthRoute )
  app.use("/users", UsersRoute )
  app.use("/friends", verifyAccessToken, FriendsRoute )
  app.use("/notifications", verifyAccessToken, NotificationsRoute )
  app.get("/", verifyAccessToken, helloWorld)
  app.get("/unprotected", helloWorld )
  app.get("/protected", verifyAccessToken, protected)
  
  app.use( async (req, res, next ) => {
    next(httpErrors.NotFound())
  })
  
  app.use( errorHandler )

}

const helloWorld = (req, res, next) => res.send("Hola") 

const protected = async ( req, res, next )=> {
  res.send("Protected")
}

const errorHandler = async (err, req, res, next )=>{
  console.error(err);
  const status =  err.status || 500
  res.status(status).send({
    error:{
      status: err.status || 500,
      message: err.message
    }
  })
}


module.exports = initApplication
