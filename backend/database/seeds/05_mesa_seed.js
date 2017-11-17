exports.seed = (knex, Promise) => {
  return knex('mesa').del()
    .then(() => {
      return knex('restaurante')
        .select('id')
        .then(restaurantes => {
          return knex('mesa').insert([
            {
              id_mesa: 1,
              id_restaurante: restaurantes[0].id,
              capacidade: 4,
              ocupada: false,
            },
            {
              id_mesa: 2,
              id_restaurante: restaurantes[0].id,
              capacidade: 6,
              ocupada: true,
            },
            {
              id_mesa: 3,
              id_restaurante: restaurantes[0].id,
              capacidade: 2,
              ocupada: false,
            },
            {
              id_mesa: 1,
              id_restaurante: restaurantes[1].id,
              capacidade: 4,
              ocupada: false,
            },
            {
              id_mesa: 2,
              id_restaurante: restaurantes[1].id,
              capacidade: 4,
              ocupada: false,
            },
            {
              id_mesa: 3,
              id_restaurante: restaurantes[1].id,
              capacidade: 4,
              ocupada: true,
            },
          ])
        })
    })
}
