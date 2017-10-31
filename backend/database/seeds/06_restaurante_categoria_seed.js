exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('restaurante_categoria').del()
    .then(() => {
      // Inserts seed entries
      return knex('restaurante_categoria').insert([
        {
          id_restaurante: 1,
          id_categoria: 1,
        },
        {
          id_restaurante: 1,
          id_categoria: 2,
        },
        {
          id_restaurante: 1,
          id_categoria: 3,
        },
        {
          id_restaurante: 2,
          id_categoria: 4,
        },
        {
          id_restaurante: 2,
          id_categoria: 1,
        },
      ])
    })
}
