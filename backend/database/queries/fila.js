const knex = require('../connection')

module.exports.getAllFilas = () => {
  return knex('fila')
    .select('*')
}

module.exports.getSingleFila = id => {
  return knex('fila')
    .select('*')
    .where('id', parseInt(id))
    .then(([fila]) => {
      if (fila === undefined) {
        return null
      }
      return knex('usuario_fila')
        .select('*')
        .where({
          id_fila: parseInt(id),
          hora_entrada_atendimento: null,
          hora_saida_restaurante: null,
          desistiu_da_fila: false,
        })
        .then(usuarios_na_fila => {
          fila.usuarios_na_fila = usuarios_na_fila
          return fila
        })
    })
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
    .returning('*')
}

module.exports.setUserAsGivenUp = (id_fila, id_usuario) => {
  return knex('usuario_fila')
    .update({
      desistiu_da_fila: true,
    })
    .where({
      'id_fila': parseInt(id_fila),
      'id_usuario': id_usuario,
    })
    .returning('*')
}
