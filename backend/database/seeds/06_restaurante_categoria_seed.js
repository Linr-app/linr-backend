exports.seed = (knex, Promise) => {
  return knex('restaurante_categoria').del()
    .then(() => {
      return knex('restaurante')
        .select('id')
        .then(restaurantes => {
          return knex('categoria')
            .select('id')
            .then(categorias => {
              return knex('restaurante_categoria').insert([
                {
                  id_restaurante: restaurantes[0].id,
                  id_categoria: categorias[0].id,
                },
                {
                  id_restaurante: restaurantes[0].id,
                  id_categoria: categorias[1].id,
                },
                {
                  id_restaurante: restaurantes[0].id,
                  id_categoria: categorias[2].id,
                },
                {
                  id_restaurante: restaurantes[1].id,
                  id_categoria: categorias[3].id,
                },
                {
                  id_restaurante: restaurantes[1].id,
                  id_categoria: categorias[0].id,
                },
              ])
            })
        })
    })
}
