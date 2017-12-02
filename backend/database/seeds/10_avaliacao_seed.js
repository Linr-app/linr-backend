exports.seed = (knex, Promise) => {
  return knex('avaliacao').del()
    .then(() => {
      return knex('restaurante')
        .select('id')
        .then(restaurantes => {
          return knex('usuario_cadastrado')
            .select('id_usuario')
            .then(usuarios_cadastrados => {
              return knex('avaliacao').insert([
                {
                  id_restaurante: restaurantes[0].id,
                  id_usuario: usuarios_cadastrados[0].id_usuario,
                  valor: 0,
                },
                {
                  id_restaurante: restaurantes[0].id,
                  id_usuario: usuarios_cadastrados[1].id_usuario,
                  valor: 1,
                },
                {
                  id_restaurante: restaurantes[1].id,
                  id_usuario: usuarios_cadastrados[0].id_usuario,
                  valor: 3,
                },
                {
                  id_restaurante: restaurantes[1].id,
                  id_usuario: usuarios_cadastrados[1].id_usuario,
                  valor: 5,
                },
              ])
            })
        })
    })
}
