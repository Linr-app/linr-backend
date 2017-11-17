const knex = require('../connection')

module.exports.getAllFilas = () => {
  return knex('fila')
    .select('*')
}

module.exports.getSingleFila = id => {
  return knex('fila')
    .select('*')
    .where('id', parseInt(id))
}

module.exports.getTempoMedio = id => {
  return knex('fila')
    .select('tempo_medio_inicial')
    .where('id', parseInt(id))
}

module.exports.addFila = fila => {
  return knex('fila')
    .insert(fila)
    .returning('*')
}

module.exports.updateFila = (id, fila) => {
  return knex('fila')
    .update(fila)
    .where('id', parseInt(id))
    .returning('*')
}

module.exports.addUserToFila = (id_fila, user_data) => {
  return knex('usuario_fila')
    .insert({
      id_fila: id_fila,
      id_usuario: user_data.id_usuario,
      qtd_pessoas: user_data.qtd_pessoas,
    })
    .where('id_fila', parseInt(id_fila))
    .returning('*')
}
