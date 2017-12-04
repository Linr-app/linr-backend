const Router = require('koa-router')

const queries = require('../database/queries/fila')

const router = new Router()

/**
 GET    /fila        Return ALL filas
 GET    /fila/:id    Return a SINGLE fila
 POST   /fila        Add a fila
 PUT    /fila/:id    Update a fila
 DELETE /fila/:id    Delete a fila
 */

router.get('/', async ctx => {
  try {
    ctx.body = {
      status: 'ok',
      data: await queries.getAllFilas(),
    }
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id', async ctx => {
  try {
    const fila = await queries.getSingleFila(ctx.params.id)
    if (fila) {
      ctx.body = {
        status: 'ok',
        data: fila,
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: 'Este fila nao existe',
      }
    }
  } catch (err) {
    console.log(err)
  }
})

router.post('/', async ctx => {
  try {
    const fila = await queries.addFila(ctx.request.body)
    if (fila.length) {
      ctx.status = 201
      ctx.body = {
        status: 'ok',
        data: fila,
      }
    } else {
      throw new Error('Erro ao inserir fila')
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Ocorreu um erro no servidor',
    }
  }
})

router.put('/:id', async ctx => {
  try {
    const fila = await queries.updateFila(ctx.params.id, ctx.request.body)
    if (fila.length) {
      ctx.status = 200
      ctx.body = {
        status: 'ok',
        data: fila,
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: 'Este fila nao existe',
      }
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Ocorreu um erro no servidor',
    }
  }
})

router.put('/:id/enter', async ctx => {
  try {
    const usuario = {
      id_usuario: ctx.request.body.id_usuario,
      qtd_pessoas: ctx.request.body.qtd_pessoas,
    }
    const novo_usuario = await queries.addUserToFila(ctx.params.id, usuario)
    ctx.status = 200
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

router.put('/:id/remove', async ctx => {
  try {
    const id_usuario_fila = ctx.request.body.id_usuario_fila
    const novo_usuario = await queries.setUserAsGivenUp(id_usuario_fila)
    ctx.status = 200
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

router.put('/:id/exit', async ctx => {
  try {
    const id_usuario = ctx.request.body.id_usuario_fila
    const novo_usuario = await queries.setUserAsExited(ctx.params.id, id_usuario)
    ctx.status = 200
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
