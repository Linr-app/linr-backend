exports.seed = (knex, Promise) => {
  return knex('fila').del()
    .then(() => {
      return knex('restaurante')
        .select('id')
        .then(restaurantes => {
          return knex('fila').insert([
            {
              id_restaurante: restaurantes[0].id,
              hora_funcionamento_inicio: '10:00',
              hora_funcionamento_fim: '20:00',
              tempo_medio_inicial: 15,
            },
            {
              id_restaurante: restaurantes[1].id,
              hora_funcionamento_inicio: '10:00',
              hora_funcionamento_fim: '20:00',
              tempo_medio_inicial: 30,
            },
            {
              id_restaurante: restaurantes[1].id,
              hora_funcionamento_inicio: '16:00',
              hora_funcionamento_fim: '18:00',
              tempo_medio_inicial: 20,
            },
          ])
        })
    })
}
