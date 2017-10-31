exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('fila').del()
    .then(() => {
      // Inserts seed entries
      return knex('fila').insert([
        {
          id: 1,
          id_restaurante: 1,
          hora_funcionamento_inicio: '10:00',
          hora_funcionamento_fim: '20:00',
          tempo_medio_inicial: 15,
        },
        {
          id: 2,
          id_restaurante: 2,
          hora_funcionamento_inicio: '10:00',
          hora_funcionamento_fim: '20:00',
          tempo_medio_inicial: 30,
        },
        {
          id: 3,
          id_restaurante: 2,
          hora_funcionamento_inicio: '16:00',
          hora_funcionamento_fim: '18:00',
          tempo_medio_inicial: 20,
        },
      ])
    })
}
