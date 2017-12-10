const Router = require('koa-router')

const queries = require('../database/queries/usuarios')

const router = new Router()

/**
 * Auth module.
 *
 * @module Auth
 */

/**
 * Realiza o login no servico, retornando as informacoes do usuario e um token
 *
 * @function
 * @inner
 * @memberof module:Auth
 * @name POST /auth/login
 * @param {String} email
 * @param {String} senha
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
            id: usuario.id,
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

/**
 * Realiza o logout do usuario no servico
 *
 * @function
 * @inner
 * @memberof module:Auth
 * @name POST /auth/logout
 */
router.post('/logout', async ctx => {
  ctx.logout()
  ctx.redirect('/')
})

/**
 * Adiciona um novo usuario cadastrado ao banco de dados.
 *
 * Como um usuario cadastrado requer um Usuario normal para existir, é
 * necessário adicionar um Usuario primeiro e depois criar o usuário cadastrado.
 *
 * @function
 * @inner
 * @memberof module:Auth
 * @name POST /auth/new
 * @param {int} id Novo id do usuario a ser criado
 * @param {String} nome
 * @param {String} telefone
 * @param {String} email
 * @param {String} senha
 */
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

/**
 * Adiciona um novo usuario temporario ao banco de dados.
 *
 * @function
 * @inner
 * @memberof module:Auth
 * @name POST /auth/new/temp
 * @param {int} id Novo id do usuario a ser criado
 * @param {String} nome
 * @param {String} telefone
 */
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

/**
 * Atualiza os dados de um usuario cadastrado
 *
 * @function
 * @inner
 * @memberof module:Auth
 * @name PUT /auth/updateuser
 * @param {int} id Novo id do usuario a ser criado
 * @param {String} nome
 * @param {String} telefone
 * @param {String} email
 * @param {String} senha
 */
router.put('/updateuser', async ctx => {
  try {
    if(ctx.request.body.nome !== '') {
      const [nome] = await queries.updateNomeUsuarioCadastrado(ctx.request.body.session, ctx.request.body.nome)
    }
    if(ctx.request.body.email !== '') {
      const [email] = await queries.updateEmailUsuarioCadastrado(ctx.request.body.session, ctx.request.body.email)
    }
    if(ctx.request.body.senha !== '') {
      const [senha] = await queries.updateSenhaUsuarioCadastrado(ctx.request.body.session, ctx.request.body.senha)
    }
    if(ctx.request.body.telefone !== '') {
      const [telefone] = await queries.updateTelefoneUsuarioCadastrado(ctx.request.body.session, ctx.request.body.telefone)
    }

    ctx.status = 201
    ctx.body = {
      status: 'ok',
      data: {},
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Ocorreu um erro no servidor',
    }
  }
})

/**
 * Atualiza o token Firebase de um usuario cadastrado
 *
 * @function
 * @inner
 * @memberof module:Auth
 * @name PUT /auth/updatetoken
 * @param {int} id Novo id do usuario a ser criado
 * @param {String} nome
 * @param {String} telefone
 * @param {String} email
 * @param {String} senha
 */
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
