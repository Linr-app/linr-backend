const Router = require('koa-router')

const queries = require('../database/queries/usuarios')

const router = new Router()

/**
 GET    /logout      Logout a user
 POST   /login       Login a user
 POST   /new         Register a new user
 PUT    /updatetoken Update a user's FCM token
 PUT    /updatename  Update a user's name
 PUT    /updateemail Update a user's email
 PUT    /updatepass  Update a user's password
 */

/**
 * Parametros:
 *  email
 *  senha
 */
router.post('/login', async ctx => {
  const email = ctx.request.body.email
  logger.debug('email: ', email)
  const senha = ctx.request.body.senha
  const usuario = await queries.getSingleUsuarioCadastradoByEmail(email)
  logger.debug('Usuario: ', usuario)
  if (usuario) {
    // Usuario existe
    if (usuario.senha === senha) {
      // Usuario acertou a senha. Retorna uma nova sessao para ele
      const [token] = await queries.generateTokenForUser(usuario.id)
      ctx.status = 200
      ctx.body = {
        status: 'ok',
        session: {
          usuario: {
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            historico: usuario.historico,
          },
          token: token,
        },
      }
    } else {
      ctx.status = 400
      ctx.body = {
        status: 'error',
        message: 'Senha errada',
      }
    }
  } else {
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: 'Usuario nao existe',
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

router.put('/updatename', async ctx => {
  try {
    const [usuario] = await queries.updateNomeUsuarioCadastrado(ctx.request.body.id_usuario, ctx.request.body.nome)
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

router.put('/updateemail', async ctx => {
  try {
    const [usuario] = await queries.updateEmailUsuarioCadastrado(ctx.request.body.id_usuario, ctx.request.body.email)
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

router.put('/updatepass', async ctx => {
  try {
    const [usuario] = await queries.updateSenhaUsuarioCadastrado(ctx.request.body.id_usuario, ctx.request.body.senha)
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

router.put('/updatetoken', async ctx => {
  try {
    const [usuario] = await queries.updateTokenUsuarioCadastrado(ctx.request.body.session, ctx.request.body.fcmtoken)
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
