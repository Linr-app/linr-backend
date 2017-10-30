const knex = require('../connection')

module.exports.getAllFilas = () => {
  return knex('fila')
    .select('*')
}

module.exports.getSingleFila = id => {
  return knex('fila')
    .select('*')
    .where({id: parseInt(id)})
}

module.exports.getTempoMedio = id => {
  return knex('fila')
    .select('tempo_medio_inicial')
    .where({id: parseInt(id)})
}

module.exports.addFila = fila => {
  return knex('fila')
    .insert(fila)
    .returning('*')
}

module.exports.updateFila = (id, fila) => {
  return knex('fila')
    .update(fila)
    .where({id: parseInt(id)})
    .returning('*')
}

module.exports.deleteFila = id => {
  return knex('fila')
    .del()
    .where({id: parseInt(id)})
    .returning('*')
}
