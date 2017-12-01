exports.seed = (knex, Promise) => {
  return knex('avaliacoes').del()
    .then(() => {
      return knex('restaurante')
        .select('id')
        .then(restaurantes => {
          return knex('usuario_cadastrado')
            .select('id_usuario')
            .then(usuario_cadastrado => {
              return knex('avaliacoes').insert([
                {
                  id_restaurante: restaurantes[0].id,
                  id_usuario: usuario_cadastrado[0].id,
                  avaliacao: 0,
                },
                {
                  id_restaurante: restaurantes[0].id,
                  id_usuario: usuario_cadastrado[1].id,
                  avaliacao: 1,
                },
                {
                  id_restaurante: restaurantes[1].id,
                  id_usuario: usuario_cadastrado[0].id,
                  avaliacao: 3,
                },
                {
                  id_restaurante: restaurantes[1].id,
                  id_usuario: usuario_cadastrado[1].id,
                  avaliacao: 5,
                },
              ])
            })
        })
    })
}
