const Router = require('koa-router')

const Auth = require('./auth')
const Restaurante = require('./restaurante')
const Fila = require('./fila')

const router = new Router()

router.all('/', async ctx => {
  logger.debug('SESSION: ', ctx.session)
  logger.debug('USER: ', ctx.user)
  ctx.body = {
    message: 'Hello!',
  }
})

router.use('/restaurantes', Restaurante.routes(), Restaurante.allowedMethods())
router.use('/filas', Fila.routes(), Fila.allowedMethods())
router.use('/auth', Auth.routes(), Auth.allowedMethods())

module.exports = router
