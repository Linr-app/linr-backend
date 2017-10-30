const Router = require('koa-router')

const Auth = require('./auth')
const Restaurante = require('./restaurante')
const Fila = require('./fila')

const router = new Router()

router.all('/', async ctx => {
  ctx.body = {
    message: 'Hello!',
  }
})

router.use('/restaurante', Restaurante.routes(), Restaurante.allowedMethods())
router.use('/fila', Fila.routes(), Fila.allowedMethods())
router.use('/auth', Auth.routes(), Auth.allowedMethods())

module.exports = router
