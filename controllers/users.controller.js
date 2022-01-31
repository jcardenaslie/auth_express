const User = require('../models/user.model')
const { authSchema } = require('../validationSchemas/user.schema')
const httpErrors = require('http-errors')

const UserDAO = ({username, password, country, isSubscribed, birthYear, email}) => {
  return {username, password, country, isSubscribed, birthYear, email}
}

const create = async (user) => {
  user = new User(user)
  return await user.save()
}

const update = async (req, res, next) => {
  let userDAO = req.body
  const { id } = req.params

  let user = await User.findById(id)

  if (!user)
    throw httpErrors.NotFound()
  Object.assign(user, userDAO)

  user = await user.save()
  
  res.send ( {status: 200, message: "User updated", data: user})
}

const getAll = async (req, res, next) => {
  console.log(req.query)
  const filter = req.query

  const query = {}

  filter.username && (query.username =  { $regex: filter.username } )
  filter.googleUID && (query.googleUID = filter.googleUID)
  filter.email && (query.email = filter.email)


  const { page = 1, limit = 10 } = req.query

  const options = {
		page : page || 1,
		limit : limit || 10,
		lean : true,
		pagination : (limit) ? true : false,
		sort : {createdAt: 'desc'}
	}

  const users = await User.paginate(query, options)
  console.log(users)

  res.send ( { status: 200, message: "success", data: users})
}

const getById = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(id)
  res.send ( {status: 200, message: "success", data: user})
}

const remove = async (req, res, next) => {
  const { id } = req.params
  const result = await User.remove({_id: id})

  console.log(result);

  if (result.ok !== 1 ) {
    throw httpErrors.InternalServerError()
  }

  if ( !result.n ) {
    throw httpErrors.NotFound()
  }

  res.send ( {status: 204, message: "success" })
}

module.exports = {
  create,
  update,
  getAll,
  getById,
  remove
}