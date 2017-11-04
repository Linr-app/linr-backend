exports.seed = (knex, Promise) => {
  return knex('usuario_cadastrado').del()
    .then(() => {
      return knex('usuario')
        .select('id')
        .then(usuarios => {
          return knex('usuario_cadastrado').insert([
            {
              id_usuario: usuarios[0].id,
              email: 'UsuarioCadastrado 1',
              senha: 'hunter1',
            },
            {
              id_usuario: usuarios[2].id,
              email: 'UsuarioCadastrado 3',
              senha: 'hunter3',
            },
          ])
        })
    })
}
