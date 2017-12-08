const knex = require('../connection')

// retornar filas e categorias
module.exports.getAllRestaurantes = () => {
  return knex
    .select(
      'restaurante.*',
      knex.raw(`ARRAY(SELECT fila.id
                FROM fila
               WHERE fila.id_restaurante = restaurante.id) AS filas`))
    .from('restaurante')
    .catch(error => {
      logger.error(error)
    })
}

module.exports.getSingleRestaurante = id => {
  return knex('restaurante')
    .select(
      'restaurante.*',
      knex.raw(`ARRAY(SELECT fila.id
                FROM fila
               WHERE fila.id_restaurante = restaurante.id) AS filas`))
    .where('restaurante.id', parseInt(id))
    .then(([restaurante]) => {
      if (restaurante === undefined) {
        return null
      }
      return knex('mesa')
        .select('mesa.id_mesa', 'mesa.capacidade', 'mesa.ocupada')
        .where('mesa.id_restaurante', restaurante.id)
        .then(mesas => {
          restaurante.mesas = mesas
          return restaurante
        })
    })
    .catch(error => {
      logger.error(error)
    })
}

module.exports.addRestaurante = restaurante => {
  return knex('restaurante')
    .insert(restaurante)
    .returning('*')
}

module.exports.updateRestaurante = (id_restaurante, restaurante) => {
  return knex('restaurante')
    .update(restaurante)
    .where('id', parseInt(id_restaurante))
    .returning('*')
}

module.exports.addMesa = mesa => {
  return knex('mesa')
    .insert(mesa)
    .returning('*')
}

module.exports.updateMesa = (ids, mesa) => {
  return knex('mesa')
    .update(mesa)
    .where({
      id_mesa: parseInt(ids.id_mesa),
      id_restaurante: parseInt(ids.id_restaurante),
    })
    .returning('*')
}

//Avaliação

/**
 * Atualiza o valor de uma avaliação de um restaurante feita por um usuario. 
 * @param id_restaurante[int]
 * @param id_usuario_cadastrado[int]
 * @param valor[int]
 */
module.exports.updateAvaliacao = async (id_restaurante, id_sessao, valor) => {
  const [response] = await this.getUsuarioIdBySessionId(id_sessao)
  return knex('avaliacao')
    .update({
      'valor': parseInt(valor),
    })
    .where({
      'id_restaurante': parseInt(id_restaurante),
      'id_usuario': parseInt(response.id_usuario),
    })
    .returning('*')
}

/**
 * Pega a média da avaliação de um restaurante. 
 * @param id_restaurante[int]
 * @param id_usuario_cadastrado[int]
 */
module.exports.getAvaliacao = async (id_restaurante, id_sessao) => {
  const [response] = await this.getUsuarioIdBySessionId(id_sessao)
  return knex('avaliacao')
    .select('valor')
    .where({
      'id_restaurante': parseInt(id_restaurante),
      'id_usuario': parseInt(response.id_usuario),
    })
}

 /**
 * Pega a média da avaliação de um restaurante. 
 * @param id_restaurante 
 */
module.exports.getAverageAvaliacao = id_restaurante => {
  return knex('avaliacao')
    .avg('valor')
    .where({
      'id_restaurante': parseInt(id_restaurante),
    })
}

/**
 * Cria uma nova avaliacao com um objeto avaliacao.
 * @param id_restaurante[int]
 * @param id_usuario_cadastrado[int]
 * @param valor[int]
 */
module.exports.createAvaliacao = async (id_restaurante, id_sessao, valor) => {
  const [response] = await this.getUsuarioIdBySessionId(id_sessao)
  return knex('avaliacao')
    .insert({
      id_restaurante: parseInt(id_restaurante),
      id_usuario: parseInt(response.id_usuario),
      valor: parseInt(valor),
    })
    .returning('*')
}
