exports.seed = (knex, Promise) => {
  return knex('usuario_cadastrado').del()
    .then(() => {
      return knex('usuario')
        .select('id')
        .then(usuarios => {
          return knex('usuario_cadastrado').insert([
            {
              id_usuario: usuarios[0].id,
              email: 'usuario1@gmail.com',
              senha: 'hunter1',
            },
            {
              id_usuario: usuarios[2].id,
              email: 'usuario3@gmail.com',
              senha: 'hunter3',
            },
          ])
        })
    })
}
