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
      return knex
        .select('usuario.nome', 'usuario.telefone')
        .from('usuario')
        .leftJoin('usuario_cadastrado', 'usuario.id', 'usuario_cadastrado.id_usuario')
        .join('usuario_fila', 'usuario_fila.id_usuario', 'usuario.id')
        .select(
          'usuario_fila.id',
          'usuario_fila.hora_entrada_fila',
          'usuario_fila.hora_entrada_atendimento',
          'usuario_fila.hora_saida_restaurante',
          'usuario_fila.qtd_pessoas',
          'usuario_fila.tem_reserva',
          'usuario_fila.desistiu_da_fila',
        )
        .where({
          'usuario_fila.id_fila': parseInt(id),
          'usuario_fila.hora_entrada_atendimento': null,
          'usuario_fila.hora_saida_restaurante': null,
          'usuario_fila.desistiu_da_fila': false,
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

module.exports.setUserAsGivenUp = id_usuario_fila => {
  return knex('usuario_fila')
    .update({
      hora_saida_restaurante: knex.fn.now(),
      desistiu_da_fila: true,
    })
    .where('id', id_usuario_fila)
    .returning('*')
}

module.exports.setUserAsExited = (id_fila, id_usuario) => {
  return knex('usuario_fila')
    .update({
      hora_saida_restaurante: knex.fn.now(),
    })
    .where({
      'id_fila': parseInt(id_fila),
      'id_usuario': id_usuario,
    })
    .returning('*')
}
