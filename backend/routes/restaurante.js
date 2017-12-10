const Router = require('koa-router')

const queries = require('../database/queries/restaurante')

const router = new Router()

/**
 *
 * @module Restaurantes
 */

 /**
 * Retorna todos os restaurantes presentes no banco.
 *
 * Formato de retorno:
 * ```json
 * [
 *   {
 *      id: int,
 *      nome: String,
 *      endereco: String,
 *      descricao: String,
 *      site: String,
 *      telefone: String,
 *      hora_funcionamento_inicio: Optional[String],
 *      hora_funcionamento_fim: Optional[String],
 *      forma_pagamento: Optional[String],
 *      informacao_adicional: Optional[String],
 *      filas: int[] // IDs das filas do restaurante
 *   },
 *   ...
 * ]
 * ```
 *
 * @function
 * @inner
 * @memberof module:Restaurantes
 * @name GET /restaurantes
 * @return Informacoes de todos os restaurantes
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

 /**
 * Retorna um restaunte especifico com ID `id`
 *
 * Formato de retorno:
 * ```json
 * {
 *   id: int,
 *   nome: String,
 *   endereco: String,
 *   descricao: String,
 *   site: String,
 *   telefone: String,
 *   hora_funcionamento_inicio: Optional[String],
 *   hora_funcionamento_fim: Optional[String],
 *   forma_pagamento: Optional[String],
 *   informacao_adicional: Optional[String],
 *   filas: int[], // IDs das filas do restaurante
 *   mesas: [
 *     {
 *       id_mesa: int,
 *       capacidade: int,
 *       ocupada: bool
 *     },
 *     ...
 *   ]
 * }
 * ```
 *
 * @function
 * @inner
 * @memberof module:Restaurantes
 * @name GET /restaurantes/:id
 * @return Informacoes de todos os restaurantes
 * @param {Object} URL Parametros de URL
 * @param {int} URL.id ID do restaurante
 * @return Informacoes do restaurante com ID `id`
 */
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

/**
 * Cria um novo restaurante
 *
 * Formato de retorno:
 * ```json
 * [
 *   {
 *      id: int,
 *      nome: String,
 *      endereco: String,
 *      descricao: String,
 *      site: String,
 *      telefone: String,
 *      hora_funcionamento_inicio: Optional[String],
 *      hora_funcionamento_fim: Optional[String],
 *      forma_pagamento: Optional[String],
 *      informacao_adicional: Optional[String]
 *   }
 * ]
 * ```
 *
 * @function
 * @inner
 * @memberof module:Restaurantes
 * @name POST /restaurantes
 * @param {Object} Body Parametros da request POST/PUT
 * @param {int} Body.id_restaurante
 * @param {String} Body.hora_funcionamento_inicio
 * @param {String} Body.hora_funcionamento_fim
 * @param {int} Body.tempo_medio_inicial Tempo de espera medio em minutos
 * @return Informacoes do novo restaurante criado
 */
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

/**
 * Edita o restaurante com o ID `id`
 *
 * Formato de retorno:
 * ```json
 * [
 *   {
 *      id: int,
 *      nome: String,
 *      endereco: String,
 *      descricao: String,
 *      site: String,
 *      telefone: String,
 *      hora_funcionamento_inicio: Optional[String],
 *      hora_funcionamento_fim: Optional[String],
 *      forma_pagamento: Optional[String],
 *      informacao_adicional: Optional[String]
 *   }
 * ]
 * ```
 *
 * @function
 * @inner
 * @memberof module:Restaurantes
 * @name PUT /restaurantes/:id
 * @param {Object} URL Parametros de URL
 * @param {int} URL.id ID do restaurante
 * @param {Object} Body Parametros da request POST/PUT
 * @param {String} [Body.nome]
 * @param {String} [Body.hora_funcionamento_fim]
 * @param {String} [Body.endereco]
 * @param {String} [Body.descricao]
 * @param {String} [Body.site]
 * @param {String} [Body.telefone]
 * @param {String} [Body.hora_funcionamento_inicio]
 * @param {String} [Body.hora_funcionamento_fim]
 * @param {String} [Body.forma_pagamento]
 * @param {String} [Body.informacao_adicional]
 * @return Informacoes do restaurante alterado
 */
router.put('/:id', async ctx => {
  try {
    const [restaurante] = await queries.updateRestaurante(ctx.params.id, ctx.request.body)
    if (restaurante) {
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
 * Adiciona uma nova mesa ao restaurante.
 *
 * Formato de retorno:
 * ```json
 * {
 *    id_mesa: int,
 *    id_restaurante: int,
 *    capacidade: int,
 *    ocupada: bool
 * }
 * ```
 *
 * @function
 * @inner
 * @memberof module:Restaurantes
 * @name POST /restaurantes/:id/mesas
 * @param {Object} URL Parametros de URL
 * @param {int} URL.id ID do restaurante
 * @param {Object} Body Parametros da request POST/PUT
 * @param {String} Body.id_mesa ID da mesa a ser adicionada
 * @param {String} Body.capacidade Capacidade da mesa em cadeiras
 * @return Informacoes da mesa adicionada
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

/**
 * Adiciona uma nova mesa ao restaurante.
 *
 * Formato de retorno:
 * ```json
 * {
 *    id_mesa: int,
 *    id_restaurante: int,
 *    capacidade: int,
 *    ocupada: bool
 * }
 * ```
 *
 * @function
 * @inner
 * @memberof module:Restaurantes
 * @name PUT /restaurantes/:id_restaurante/mesas/:id_mesa
 * @param {Object} URL Parametros de URL
 * @param {int} URL.id_restaurante ID do restaurante
 * @param {int} URL.id_mesa ID da mesa
 * @param {Object} Body Parametros da request POST/PUT
 * @param {String} Body.capacidade Capacidade da mesa em cadeiras
 * @param {bool} Body.Ocupada Se a mesa esta ocupada ou nao
 * @return Informacoes da mesa alterada
 */
router.put('/:id_restaurante/mesas/:id_mesa', async ctx => {
  try {
    const ids = {
      id_restaurante: ctx.params.id_restaurante,
      id_mesa: ctx.params.id_mesa,
    }
    const mesa = await queries.updateMesa(ids, ctx.params.body)
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

// AVALIACAO

/**
 * Retorna as avaliacoes do restaurante com o ID `id_restaurante`, tanto a media
 * quanto a de um usuario com o ID `id_usuario`.
 *
 * Formato de retorno:
 * ```json
 * {
 *    avaliacao_media: float,
 *    avaliacao_usuario: float,
 * }
 * ```
 *
 * @function
 * @inner
 * @memberof module:Restaurantes
 * @name GET /restaurantes/:id_restaurante/avaliacao/:id_usuario
 * @param {Object} URL Parametros de URL
 * @param {int} URL.id_restaurante ID do restaurante
 * @param {int} URL.id_usuario ID do usuario avaliador
 * @return Avaliacoes do restaurante
 */
router.get('/:id_restaurante/avaliacao/:id_usuario', async ctx => {
  try {
    const [av_media] = await queries.getAverageAvaliacao(ctx.params.id_restaurante)
    const [av_user] = await queries.getAvaliacao(ctx.params.id_restaurante, ctx.params.id_usuario)
    ctx.body = {
      status: 'ok',
      data: {
        avaliacao_media: av_media,
        avaliacao_usuario: av_user,
      }
    }
  } catch (err) {
    console.log(err)
    ctx.status = 400
    ctx.body = {
      status: 'error',
      message: err.message || 'Ocorreu um erro no servidor',
    }
  }
})

/**
 * Adiciona uma nova avaliacao ao restaurante com o ID `id_restaurante`
 * proveniente de um usuario com o ID `id_usuario` com o valor `valor`.\
 *
 * WTF POR FAVOR ALGUEM ARRUMA ESSE NEGOCIO
 *
 * Formato de retorno:
 * ```json
 * [
 *   {
 *      id_restaurante: float,
 *      id_usuario: int,
 *      valor: int
 *   }
 * ]
 * ```
 *
 * @function
 * @inner
 * @memberof module:Restaurantes
 * @name POST /restaurantes/:id_restaurante/avaliacao/:id_usuario/:valor
 * @param {Object} URL Parametros de URL
 * @param {int} URL.id_restaurante ID do restaurante
 * @param {int} URL.id_usuario ID do usuario avaliador
 * @param {int} URL.valor Avaliacao a ser dada
 * @return Avaliacao adicionada
 */
router.post('/:id_restaurante/avaliacao/:id_usuario/:valor', async ctx => {
  try {
    const av = await queries.createAvaliacao(ctx.params.id_restaurante, ctx.params.id_usuario, ctx.params.valor)
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

/**
 * Altera uma avaliacao ao restaurante com o ID `id_restaurante`
 * proveniente de um usuario com o ID `id_usuario` com o valor `valor`.\
 *
 * WTF POR FAVOR ALGUEM ARRUMA ESSE NEGOCIO
 *
 * Formato de retorno:
 * ```json
 * [
 *   {
 *      id_restaurante: float,
 *      id_usuario: int,
 *      valor: int
 *   }
 * ]
 * ```
 *
 * @function
 * @inner
 * @memberof module:Restaurantes
 * @name PUT /restaurantes/:id_restaurante/avaliacao/:id_usuario/:valor
 * @param {Object} URL Parametros de URL
 * @param {int} URL.id_restaurante ID do restaurante
 * @param {int} URL.id_usuario ID do usuario avaliador
 * @param {int} URL.valor Avaliacao a ser dada
 * @return Avaliacao alterada
 */
router.put('/:id_restaurante/avaliacao/:id_usuario/:valor', async ctx => {
  try {
    const av = await queries.updateAvaliacao(ctx.params.id_restaurante, ctx.params.id_usuario, ctx.params.valor)
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
