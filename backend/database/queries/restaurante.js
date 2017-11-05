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