const knex = require('../connection')

// retornar filas e categorias
module.exports.getAllRestaurantes = () => {
  return knex
    .select('restaurante.*', knex.raw(
      `ARRAY(SELECT fila.id
               FROM fila
              WHERE fila.id_restaurante = restaurante.id) AS filas`))
    .from('restaurante')
    .catch(error => {
      logger.error(error)
    })
}

module.exports.getSingleRestaurante = id => {
  return knex
    .select('restaurante.*', knex.raw(
      `ARRAY(SELECT fila.id
               FROM fila
              WHERE fila.id_restaurante = restaurante.id) AS filas`))
    .from('restaurante')
    .where('restaurante.id', parseInt(id))
    .catch(error => {
      logger.error(error)
    })
}

module.exports.addRestaurante = restaurante => {
  return knex('restaurante')
    .insert(restaurante)
    .returning('*')
}

module.exports.updateRestaurante = (id, restaurante) => {
  return knex('restaurante')
    .update(restaurante)
    .where('id', parseInt(id))
    .returning('*')
}

//Avaliação

/**
 * Atualiza o valor de uma avaliação de um restaurante feita por um usuario. 
 * @param avaliacao Objeto contendo id_restaurante[int], id_usuario_cadastrado[int] e valor[int]
 */
module.exports.updateAvaliacao = avaliacao => {
  return knex('avaliacao')
    .update({
      'valor': parseInt(avaliacao.valor),
    })
    .where({
      'id_restaurante': parseInt(avaliacao.id_restaurante),
      'id_usuario': parseInt(avaliacao.id_usuario_cadastrado),
    })
    .returning('*')
}

/**
 * Pega a média da avaliação de um restaurante. 
 * @param ids Objeto contendo id_restaurante[int] e id_usuario_cadastrado[int]
 */
module.exports.getAvaliacao = ids => {
  return knex('avaliacao')
    .select('valor')
    .where({
      'id_restaurante': parseInt(ids.id_restaurante),
      'id_usuario': parseInt(ids.id_usuario_cadastrado),
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
 * @param avaliacao Objeto contendo id_restaurante[int], id_usuario_cadastrado[int] e valor[int]
 */
module.exports.createAvaliacao = avaliacao => {
  return knex('avaliacao')
    .insert({
      id_restaurante: parseInt(avaliacao.id_restaurante),
      id_usuario: parseInt(avaliacao.id_usuario_cadastrado),
      valor: parseInt(avaliacao.valor),
    })
    .returning('*')
}
