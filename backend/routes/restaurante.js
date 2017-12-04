const Router = require('koa-router')

const queries = require('../database/queries/restaurante')

const router = new Router()

/**
 GET    /restaurante        Return ALL restaurants
 GET    /restaurante/:id    Return a SINGLE restaurant
 POST   /restaurante        Add a restaurant
 PUT    /restaurante/:id    Update a restaurant
 DELETE /restaurante/:id    Delete a restaurant
 
 GET    /restaurante/:id/avaliacao/           Returna a avaliação media
 GET    /restaurante/:id/avaliacao/           Returna a avaliação de uma pessoa
 POST   /restaurante/:id/avaliacao/           Add uma avaliação
 PUT    /restaurante/:id/avaliacao/           Atualiza uma avaliacao
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
    if (restaurante) {
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

/**
 * Parametros:
 *  id_mesa
 *  capacidade
 *
 */
router.post('/:id/mesas', async ctx => {
  try {
    const params = {
      id_restaurante: ctx.params.id,
      id_mesa: ctx.request.body.id_mesa,
      capacidade: ctx.request.body.capacidade,
    }
    const [mesa] = await queries.addMesa(params)
    if (mesa) {
      ctx.status = 200
      ctx.body = {
        status: 'ok',
        data: mesa,
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: 'Esta mesa nao existe',
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

router.put('/:id_restaurante/mesas/:id_mesa', async ctx => {
  try {
    const mesa = await queries.updateMesa(ctx.params, )
    if (mesa) {
      ctx.status = 200
      ctx.body = {
        status: 'ok',
        data: mesa,
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: 'Esta mesa nao existe',
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

//AVALIACAO
router.get('/:id_restaurante/avaliacao', async ctx => {
  try {
    const av = await queries.getAverageAvaliacao (ctx.params.id_restaurante)
    const av2 = await queries.getAvaliacao(ctx.params.id_restaurante,ctx.request.body) //DUAS
    
    ctx.body = {
      status: 'ok',
      data: av,
      data2: av2,
    }
    
  } catch (err) {
    console.log(err)
  }
})

/*router.get('/:id_restaurante/avaliacao/:id_usuario_cadastrado', async ctx => {
  try {
    const av = await queries.getAvaliacao(ctx.params,)
    if (av) {
      ctx.body = {
        status: 'ok',
        data: av,
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: 'Esta avaliação nao existe',
      }
    }
  } catch (err) {
    console.log(err)
  }
})*/

router.post('/:id_restaurante/avaliacao', async ctx => {
  try {
    const av = await queries.createAvaliacao (ctx.params.id_restaurante,ctx.request.body)
    if (av.length) {
      ctx.status = 201
      ctx.body = {
        status: 'ok',
        data: av,
      }
    } else {
      throw new Error('Erro ao inserir avaliacao')
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Ocorreu um erro no servidor',
    }
  }
})

router.put('/:id_restaurante/avalicao', async ctx => {
  try {
    const av = await queries.updateAvaliacao (ctx.params.id_restaurante,ctx.request.body)
    if (av) {
      ctx.status = 200
      ctx.body = {
        status: 'ok',
        data: av,
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: 'Esta avaliação nao existe',
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
