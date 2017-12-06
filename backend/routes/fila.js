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
      posicao: ctx.request.body.posicao_qdo_entrou,
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

router.put('/:id/desistir', async ctx => {
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

router.put('/:id/sair', async ctx => {
  try {
    const id_usuario = ctx.request.body.id_usuario_fila
    const novo_usuario = await queries.setUserAsExited(ctx.params.id, id_usuario)
    ctx.status = 200
    ctx.body = {
      status: 'ok',
    }
   const dia = new Date()
   const dia_da_semama = dia.getDay()
   
   const data = new Date(ctx.body.hora_entrada_fila)
   const hora_de_entrada = data.getHours()*60 + data.getMinutes()
   
   const posicao = ctx.request.body.posicao_qdo_entrou
   const hora_de_saida = dia.getHours()*60 + dia.getMinutes()
   const tempo_de_espera_na_fila = hora_de_saida - hora_de_entrada //Bug caso vire o dia
   
    await axios.post(`https://linrapp-prediction.herokuapp.com/fit/${ctx.params.id}`, {
      dia_da_semana: dia_da_semama,
      hora_de_entrada: hora_de_entrada,
      posicao: posicao,
      tempo_de_espera_na_fila: tempo_de_espera_na_fila,
    })
    //linrapp-prediction.herokuapp.com
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Ocorreu um erro no servidor',
    }
  }
})

module.exports = router
