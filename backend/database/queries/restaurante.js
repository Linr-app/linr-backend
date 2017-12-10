const knex = require('../connection')

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

module.exports.updateAvaliacao = (id_restaurante, id_usuario_cadastrado, valor) => {
  return knex('avaliacao')
    .update({
      'valor': parseInt(valor),
    })
    .where({
      'id_restaurante': parseInt(id_restaurante),
      'id_usuario': parseInt(id_usuario_cadastrado),
    })
    .returning('*')
}

module.exports.getAvaliacao = (id_restaurante, id_usuario_cadastrado) => {
  console.log('id_rest: ' + id_restaurante + ' id_user: ' + id_usuario_cadastrado)
  return knex('avaliacao')
    .select('valor')
    .where({
      'id_restaurante': parseInt(id_restaurante),
      'id_usuario': parseInt(id_usuario_cadastrado),
    })
}

module.exports.getAverageAvaliacao = id_restaurante => {
  return knex('avaliacao')
    .avg('valor')
    .where({
      'id_restaurante': parseInt(id_restaurante),
    })
}

module.exports.createAvaliacao = (id_restaurante, id_usuario_cadastrado, valor) => {
  return knex('avaliacao')
    .insert({
      id_restaurante: parseInt(id_restaurante),
      id_usuario: parseInt(id_usuario_cadastrado),
      valor: parseInt(valor),
    })
    .returning('*')
}
