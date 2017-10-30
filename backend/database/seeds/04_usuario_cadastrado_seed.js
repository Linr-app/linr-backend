exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('usuario_cadastrado').del()
    .then(() => {
      // Inserts seed entries
      return knex('usuario_cadastrado').insert([
        {
          id_usuario: 1,
          email: 'UsuarioCadastrado 1',
          senha: 'hunter1',
        },
        {
          id_usuario: 3,
          email: 'UsuarioCadastrado 3',
          senha: 'hunter3',
        },
      ])
    })
}
