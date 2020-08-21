import express from 'express'
import axios from 'axios'

const router = express.Router()
const { readFile, stat, unlink } = require('fs').promises
const { outputFile } = require('fs-extra')

const getFileUserProvider = (fileName) => {
  const readUsers = () => {
    return stat(fileName)
      .then(() => {
        return readFile(fileName, { encoding: 'utf8' }).then((text) => JSON.parse(text))
      })
      .catch(() => {
        return []
      })
  }

  const writeUsers = (users) => {
    return outputFile(fileName, JSON.stringify(users), { encoding: 'utf8' }).catch(() => {
      throw new Error(`Error writing into ${fileName}`)
    })
  }

  const deleteFile = () => {
    return stat(fileName)
      .then(() => {
        return unlink(fileName)
      })
      .catch(() => {
        return true
      })
  }

  return {
    all() {
      return readUsers()
    },
    rewriteWith(users) {
      return writeUsers(users)
    },
    async getById(userId) {
      const users = await readUsers()
      return users.filter((u) => u.id === userId)
    },
    async add(userData) {
      const users = await readUsers()
      let nextUserId = 1
      if (users.length) {
        nextUserId = users[users.length - 1].id + 1
      }

      const newUser = { ...userData, id: nextUserId }
      users.push(newUser)

      await writeUsers(users)

      return newUser
    },
    async updateById(userId, userData) {
      let users = await readUsers()
      let updatedUser

      users = users.map((user) => {
        if (+user.id === +userId) {
          updatedUser = { ...user, ...userData, id: userId }
          return updatedUser
        }
        return user
      })

      await writeUsers(users)

      return updatedUser
    },
    async deleteById(userId) {
      let users = await readUsers()
      let deletedUser

      users = users.filter((user) => {
        if (+user.id === +userId) {
          deletedUser = user
          return false
        }
        return true
      })

      await writeUsers(users)

      return deletedUser
    },
    deleteAll() {
      return deleteFile()
    }
  }
}

const getApiUserProvider = (baseUrl) => {
  const getData = (relativeUrl = '') => {
    const url = `${baseUrl}/${relativeUrl}`
    return axios.get(url).then(({ data }) => data)
  }

  return {
    all() {
      return getData()
    },
    getById(userId) {
      return getData(userId)
    }
  }
}

const getUserProvider = () => {
  const fup = getFileUserProvider(`${__dirname}/../../var/cache/server/users.json`)
  const aup = getApiUserProvider('https://jsonplaceholder.typicode.com/users')

  return {
    async all() {
      let users = await fup.all()
      if (users.length) {
        return users
      }
      users = await aup.all()
      await fup.rewriteWith(users)

      return users
    },
    addUser(userData) {
      return fup.add(userData)
    },
    updateById(userId, userData) {
      return fup.updateById(userId, userData)
    },
    deleteById(userId) {
      return fup.deleteById(userId)
    },
    deleteAll() {
      return fup.deleteAll()
    }
  }
}

const successfullResponse = (data) => {
  return { status: 'success', ...data }
}
const errorResponse = (msg = 'Something went wrong') => {
  return { status: 'error', msg }
}

const userProvider = getUserProvider()

// get all users from users.json
router.get('', async (req, res) => {
  const users = await userProvider.all()
  res.json(users)
})

// add new user into users.json
router.post('', async (req, res) => {
  const userData = req.body
  if (!userData) {
    res.status(400)
    res.json(errorResponse('Invalid user data passed'))
  }

  const user = await userProvider.addUser(userData)
  res.json(successfullResponse({ id: user.id }))
  if (user) {
    res.json(successfullResponse({ id: user.id }))
  } else {
    res.status(404)
    res.json(errorResponse('User not found'))
  }
})

// update user with  userId in users.json
router.patch('/:userId', async (req, res) => {
  const { userId } = req.params
  const userData = req.body
  const user = await userProvider.updateById(userId, userData)
  if (user) {
    res.json(successfullResponse({ id: user.id }))
  } else {
    res.status(404)
    res.json(errorResponse('User not found'))
  }
})

// delete user from users.json by userId
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params
  const user = await userProvider.deleteById(userId)
  if (user) {
    res.json(successfullResponse({ id: user.id }))
  } else {
    res.status(404)
    res.json(errorResponse('User not found'))
  }
})

// delete users.json
router.delete('/', async (req, res) => {
  await userProvider.deleteAll()
  res.status(204)
  res.send()
})

export default router
