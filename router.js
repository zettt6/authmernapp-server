const Router = require('express')
const router = new Router()
const controller = require('./controller')
const { check } = require('express-validator')
const authMiddleWare = require('./middleware/authMiddleware')
const accessMiddleware = require('./middleware/accessMiddleware')

router.post(
  '/register',
  [check('username', 'Имя пользователя не может быть пустым').notEmpty()],
  [check('email', 'Email не может быть пустым').notEmpty()],
  [check('password', 'Password не может быть пустым').notEmpty()],
  controller.registration,
  authMiddleWare
)

router.post('/login', controller.login)

router.get('/users', authMiddleWare, accessMiddleware, controller.getUsers)

router.delete(
  '/users/:id',
  authMiddleWare,
  accessMiddleware,
  controller.deleteUsers
)

router.put(
  '/block/:id',
  authMiddleWare,
  accessMiddleware,
  controller.blockUsers
)
router.put(
  '/unblock/:id',
  authMiddleWare,
  accessMiddleware,
  controller.unblockUsers
)

module.exports = router
