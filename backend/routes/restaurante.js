const Router = require('koa-router')

const queries = require('../database/queries/restaurante')

const router = new Router()

/**
 GET    /restaurante        Return ALL restaurants
 GET    /restaurante/:id    Return a SINGLE restaurant
 POST   /restaurante        Add a restaurant
 PUT    /restaurante/:id    Update a restaurant
 DELETE /restaurante/:id    Delete a restaurant
 */

router.get('/', async ctx => {
  try {
    ctx.body = {
      status: 'ok',
      data: await queries.getAllRestaurantes(),
    }
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id', async ctx => {
  try {
    const restaurante = await queries.getSingleRestaurante(ctx.params.id)
    if (restaurante.length) {
      ctx.body = {
        status: 'ok',
        data: restaurante,
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: 'Este restaurante nao existe',
      }
    }
  } catch (err) {
    console.log(err)
  }
})

router.post('/', async ctx => {
  try {
    const restaurante = await queries.addRestaurante(ctx.request.body)
    if (restaurante.length) {
      ctx.status = 201
      ctx.body = {
        status: 'ok',
        data: restaurante,
      }
    } else {
      throw new Error('Erro ao inserir restaurante')
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
    const restaurante = await queries.updateRestaurante(ctx.params.id, ctx.request.body)
    if (restaurante.length) {
      ctx.status = 200
      ctx.body = {
        status: 'ok',
        data: restaurante,
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: 'Este restaurante nao existe',
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

module.exports = router
