const Router = require('koa-router')
const passport = require('koa-passport')

const queries = require('../database/queries/usuarios')

const router = new Router()

/**
 GET    /logout Logout an user
 POST   /login  Login an user
 POST   /new    Register a new user
 */

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  }),
)

router.get('/logout', async ctx => {
  ctx.logout()
  ctx.redirect('/')
})

router.post('/new', async ctx => {
  try {
    console.log(`/auth/new POST ${JSON.stringify(ctx.request.body)}`)
    const usuario = await queries.addUsuarioCadastrado(ctx.request.body)
    console.log(`Novo usuario: ${JSON.stringify(usuario)}`)
    ctx.status = 201
    ctx.body = {
      status: 'ok',
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Ocorreu um erro no servidor',
    }
  }
})

module.exports = router

