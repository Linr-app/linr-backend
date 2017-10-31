exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('mesa').del()
    .then(() => {
      // Inserts seed entries
      return knex('mesa').insert([
        {
          id_mesa: 1,
          id_restaurante: 1,
          capacidade: 4,
          ocupada: false,
        },
        {
          id_mesa: 2,
          id_restaurante: 1,
          capacidade: 6,
          ocupada: true,
        },
        {
          id_mesa: 3,
          id_restaurante: 1,
          capacidade: 2,
          ocupada: false,
        },
        {
          id_mesa: 1,
          id_restaurante: 2,
          capacidade: 4,
          ocupada: false,
        },
        {
          id_mesa: 2,
          id_restaurante: 2,
          capacidade: 4,
          ocupada: false,
        },
        {
          id_mesa: 3,
          id_restaurante: 2,
          capacidade: 4,
          ocupada: true,
        },
      ])
    })
}
