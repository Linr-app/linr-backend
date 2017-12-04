const Router = require('koa-router')

const queries = require('../database/queries/usuarios')

const router = new Router()

/**
 GET    /logout Logout an user
 POST   /login  Login an user
 POST   /new    Register a new user
 */

/**
 * Parametros:
 *  email
 *  senha
 */
router.post('/login', async ctx => {
  const email = ctx.request.body.email
  const senha = ctx.request.body.senha
  const [usuario] = await queries.getSingleUsuarioCadastradoByEmail(email)
  if (usuario) {
    // Usuario existe
    if (usuario.senha === senha) {
      // Usuario acertou a senha. Retorna uma nova sessao para ele
      ctx.status = 200
      ctx.body = {
        status: 'ok',
        session: {
          usuario_id: usuario.id,
          usuario_nome: usuario.nome,
          usuario_email: usuario.email,
          usuario_telefone: usuario.telefone,
        }
      }
    } else {
      ctx.status = 400
      ctx.body = {
        status: 'error',
        message: 'Senha errada'
      }
    }
  } else {
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Usuario nao existe'
    }
  }
})

router.get('/logout', async ctx => {
  ctx.logout()
  ctx.redirect('/')
})

router.post('/new', async ctx => {
  try {
    const [usuario] = await queries.addUsuarioCadastrado(ctx.request.body)
    ctx.status = 201
    ctx.body = {
      status: 'ok',
      data: {
        id_usuario: usuario.id_usuario,
      },
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Ocorreu um erro no servidor',
    }
  }
})

router.post('/new/temp', async ctx => {
  try {
    const [usuario] = await queries.addUsuario(ctx.request.body)
    ctx.status = 201
    ctx.body = {
      status: 'ok',
      data: {
        id_usuario: usuario.id,
      },
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
