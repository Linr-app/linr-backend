const knex = require('../connection')

module.exports.getSingleUsuarioCadastradoById = id => {
  return knex('usuario_cadastrado')
    .select('*')
    .where('id', parseInt(id))
}

module.exports.getSingleUsuarioById = id => {
  return knex('usuario')
    .select('*')
    .where('id', parseInt(id))
}

module.exports.getSingleUsuarioCadastradoByEmail = email => {
  return knex('usuario_cadastrado')
    .select('*')
    .where({email: parseInt(email)})
}

module.exports.addUsuario = usuario => {
  return knex('usuario')
    .insert({
      id: usuario.id,
      nome: usuario.nome,
      telefone: usuario.telefone,
    })
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

