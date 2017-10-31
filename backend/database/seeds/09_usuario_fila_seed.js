exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('usuario_fila').del()
    .then(() => {
      // Inserts seed entries
      return knex('usuario_fila').insert([
        {
          id: 1,
          id_fila: 3,
          id_usuario: 3,
          hora_entrada_fila: '2017-10-31 10:00',
          hora_entrada_atendimento: '2017-10-31 10:30',
          hora_saida_restaurante: '2017-10-31 12:00',
          qtd_pessoas: 4,
          tem_reserva: false,
          desistiu_da_fila: false,
        },
      ])
    })
}
