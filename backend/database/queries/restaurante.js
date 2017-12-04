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
        .join('restaurante', 'mesa.id_restaurante', 'restaurante.id')
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

module.exports.updateRestaurante = (id_restaurante, id_mesa) => {
  return knex('mesa')
    .update(restaurante)
    .where('id', parseInt(id))
    .returning('*')
}

module.exports.addMesa = mesa => {
  return knex('mesa')
    .insert(mesa)
    .returning('*')
}

module.exports.updateMesa = (id, restaurante) => {
  return knex('restaurante')
    .update(restaurante)
    .where('id', parseInt(id))
    .returning('*')
}
