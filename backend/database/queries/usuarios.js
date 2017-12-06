const knex = require('../connection')

module.exports.generateTokenForUser = id => {
  const token = Math.floor(Math.random() * 1000000 + 1)
  return knex('sessao')
    .where('id_usuario', parseInt(id))
    .del()
    .then(result => {
      return knex('sessao')
        .insert({
          id_usuario: id,
          token: token,
        })
        .returning('token')
    })
}

module.exports.getSingleUsuarioCadastradoById = id => {
  return knex('usuario_cadastrado')
    .select('*')
    .join('usuario', 'usuario.id', 'usuario_cadastrado.id_usuario')
    .where('id', parseInt(id))
}

module.exports.getSingleUsuarioById = id => {
  return knex('usuario')
    .select('*')
    .join('usuario', 'usuario.id', 'usuario_cadastrado.id_usuario')
    .where('id', parseInt(id))
}

module.exports.getSingleUsuarioCadastradoByEmail = email => {
  return knex('usuario_cadastrado')
    .select('*')
    .join('usuario', 'usuario.id', 'usuario_cadastrado.id_usuario')
    .where({email: email})
}

module.exports.addUsuario = usuario => {
  return knex('usuario')
    .insert({
      id: usuario.id,
      nome: usuario.nome,
      fcmtoken: usuario.fcmtoken,
      telefone: usuario.telefone,
    })
    .returning('*')
}

module.exports.updateTokenUsuarioCadastrado = (id_usuario, fcmtoken) => {
  return knex('usuario')
    .where('id', parseInt(id_usuario))
    .update({fcmtoken: fcmtoken})
    .returning('*')
}

/**
 * Adiciona um novo usuario cadastrado ao banco de dados.
 * Como um usuario cadastrado requer um Usuario normal para existir, é
 * necessário adicionar um Usuario primeiro e depois criar o usuário cadastrado.
 * @param usuario_cadastrado Objeto contendo id, nome, telefone, email e senha
 */
module.exports.addUsuarioCadastrado = usuario_cadastrado => {
  return knex('usuario')
    .insert({
      id: usuario_cadastrado.id,
      nome: usuario_cadastrado.nome,
      fcmtoken: usuario_cadastrado.fcmtoken,
      telefone: usuario_cadastrado.telefone,
    })
    .returning('*')
    .then(([usuario_inserido]) => {
      return knex('usuario_cadastrado')
        .insert({
          id_usuario: usuario_inserido.id,
          email: usuario_cadastrado.email,
          senha: usuario_cadastrado.senha,
        })
        .returning('*')
    })
}

