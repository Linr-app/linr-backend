exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('fila').del()
    .then(() => {
      // Inserts seed entries
      return knex('fila').insert([
        {
          id: 1,
          restaurante_id: 1,
          hora_funcionamento_inicio: '10:00',
          hora_funcionamento_fim: '20:00',
        },
        {
          id: 2,
          restaurante_id: 2,
          hora_funcionamento_inicio: '10:00',
          hora_funcionamento_fim: '20:00',
        },
        {
          id: 3,
          restaurante_id: 2,
          hora_funcionamento_inicio: '16:00',
          hora_funcionamento_fim: '18:00',
        },
      ])
    })
}
