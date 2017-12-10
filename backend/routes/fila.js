const Router = require('koa-router')

const queries = require('../database/queries/fila')

const router = new Router()

/**
 *
 * @module Filas
 */

/**
 * Retorna todas as filas presentes no banco.
 *
 * Formato de retorno:
 * ```json
 * [
 *   {
 *      id: int,
 *      id_restaurante: int,
 *      hora_funcionamento_inicio: Optional[String],
 *      hora_funcionamento_fim: Optional[String],
 *      tempo_medio_inicial: String,
 *      descricao: Optional[String]
 *   },
 *   ...
 * ]
 * ```
 *
 * @function
 * @inner
 * @memberof module:Filas
 * @name GET /filas
 * @return Informacoes de todas as filas
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

/**
 * Retorna uma fila especifica com ID `id`
 *
 * Formato de retorno:
 * ```json
 * {
 *   id: int,
 *   id_restaurante: int,
 *   hora_funcionamento_inicio: Optional[String],
 *   hora_funcionamento_fim: Optional[String],
 *   tempo_medio_inicial: String,
 *   descricao: Optional[String],
 *   usuarios_na_fila: {
 *     id: int,
 *     id_usuario: int,
 *     nome: String,
 *     telefone: String,
 *     fcmtoken: String,
 *     hora_entrada_fila: String,
 *     hora_entrada_atendimento: Optional[String],
 *     hora_saida_restaurante: Optional[String],
 *     qtd_pessoas: int,
 *     tem_reserva: bool,
 *     desistiu_da_fila: bool
 *   }
 * }
 * ```
 *
 * @function
 * @inner
 * @memberof module:Filas
 * @name GET /filas/:id
 * @param {Object} URL Parametros de URL
 * @param {int} URL.id ID da fila
 * @return Informacoes da fila com ID `id`
 */
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

/**
 * Cria uma nova fila
 *
 * Formato de retorno:
 * ```json
 * [
 *   {
 *      id: int,
 *      id_restaurante: int,
 *      hora_funcionamento_inicio: Optional[String],
 *      hora_funcionamento_fim: Optional[String],
 *      tempo_medio_inicial: String,
 *      descricao: Optional[String]
 *   },
 *   ...
 * ]
 * ```
 *
 * @function
 * @inner
 * @memberof module:Filas
 * @name POST /filas
 * @param {Object} Body Parametros da request POST/PUT
 * @param {int} Body.id_restaurante
 * @param {String} Body.hora_funcionamento_inicio
 * @param {String} Body.hora_funcionamento_fim
 * @param {int} Body.tempo_medio_inicial Segundos
 * @return Informacoes da nova fila criada
 */
router.post('/', async ctx => {
  try {
    const fila = await queries.addFila(ctx.request.body)
    if (fila.length) {
      ctx.status = 201
      ctx.body = {
        status: 'ok',
        data: fila,
      }
      const tempo_medio_inicial = tempo_medio_inicial
      await axios.post(`https://linrapp-prediction.herokuapp.com/register/${ctx.params.id}`, {
        tempo_medio_inicial: tempo_medio_inicial,
      })
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

/**
 * Edita a fila com o ID `id`
 *
 * Formato de retorno:
 * ```json
 * [
 *   {
 *      id: int,
 *      id_restaurante: int,
 *      hora_funcionamento_inicio: Optional[String],
 *      hora_funcionamento_fim: Optional[String],
 *      tempo_medio_inicial: String,
 *      descricao: Optional[String]
 *   },
 *   ...
 * ]
 * ```
 *
 * @function
 * @inner
 * @memberof module:Filas
 * @name PUT /filas/:id
 * @param {Object} URL Parametros de URL
 * @param {int} URL.id ID da fila
 * @param {Object} Body Parametros da request POST/PUT
 * @param {String} [Body.hora_funcionamento_inicio]
 * @param {String} [Body.hora_funcionamento_fim]
 * @param {int} [Body.tempo_medio_inicial] Tempo de espera medio em segundos
 * @return Informacoes da fila alterada
 */
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

/**
 * Adiciona um novo usuario na fila com o ID `id`
 *
 * @function
 * @inner
 * @memberof module:Filas
 * @name POST /filas
 * @param {String} [hora_funcionamento_inicio]
 * @param {String} [hora_funcionamento_fim]
 * @param {int} [tempo_medio_inicial] Tempo de espera medio em segundos
 */
router.put('/:id/enter', async ctx => {
  try {
    const usuario = {
      id_usuario: ctx.request.body.id_usuario,
      qtd_pessoas: ctx.request.body.qtd_pessoas,
      posicao_qdo_entrou: ctx.request.body.posicao_qdo_entrou
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

/**
 * Adiciona um novo usuario cadastrado a fila de ID `id` a partir do token.
 *
 * @function
 * @inner
 * @memberof module:Filas
 * @name PUT /filas/:id/entercadastrado
 * @param {int} id Novo id do usuario a ser criado
 * @param {Object} URL Parametros de URL
 * @param {int} URL.id ID da fila
 * @param {Object} Body Parametros da request POST/PUT
 * @param {int} [Body.session_token] Token da sessao
 * @param {int} [Body.qtd_pessoas] Quantidade de pessoas junto com o usuario
 * @param {int} [Body.posicao_qdo_entrou] Posicao que entrou na fila
 */
router.put('/:id/entercadastrado', async ctx => {
  try {
    const usuario = {
      session_token: ctx.request.body.session_token,
      qtd_pessoas: ctx.request.body.qtd_pessoas,
      posicao_qdo_entrou: ctx.request.body.posicao_qdo_entrou
    }
    const novo_usuario = await queries.addUserCadastradoToFila(ctx.params.id, usuario)
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

/**
 * Marca um usuario como desistido na fila com o ID `id`
 *
 * @function
 * @inner
 * @memberof module:Filas
 * @name PUT /filas/:id/desistir
 * @param {Object} URL Parametros de URL
 * @param {int} URL.id ID da fila
 * @param {Object} Body Parametros da request POST/PUT
 * @param {int} [Body.id_usuario_fila]
 */
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

/**
 * Marca um usuario como saido na fila com o ID `id`
 *
 * @function
 * @inner
 * @memberof module:Filas
 * @name PUT /filas/:id/sair
 * @param {Object} URL Parametros de URL
 * @param {int} URL.id ID da fila
 * @param {Object} Body Parametros da request POST/PUT
 * @param {int} [Body.id_usuario_fila]
 * @param {int} [Body.posicao_qdo_entrou] Posicao que entrou na fila
 */
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
    const hora_de_entrada = data.getHours()*60*60 + data.getMinutes()*60 + data.getSeconds()

    const posicao = ctx.request.body.posicao_qdo_entrou
    const hora_de_saida = dia.getHours()*60*60 + dia.getMinutes()*60 + dia.getSeconds()

    const tempo_de_espera_na_fila = hora_de_saida - hora_de_entrada
    
    if (tempo_de_espera_na_fila < 0) { //Caso vire o dia
      tempo_de_espera_na_fila = tempo_de_espera_na_fila + 1440*60
    } 
   
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
