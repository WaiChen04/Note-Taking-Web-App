const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, important: 1 })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.id).populate('notes', { content: 1, important: 1, date: 1 })

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    response.json(user.notes)
  } catch (error) {
    console.error('Error fetching user:', error)
    response.status(400).json({ error: 'Invalid user ID format' })
  }
})

module.exports = usersRouter