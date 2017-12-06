exports.seed = (knex, Promise) => {
  return knex('usuario_fila').del()
    .then(() => {
      return knex('fila')
        .select('id')
        .then(filas => {
          return knex('usuario')
            .select('id')
            .then(usuarios => {
              return knex('usuario_fila').insert([
                {
                  id_fila: filas[2].id,
                  id_usuario: usuarios[2].id,
                  hora_entrada_fila: '2017-10-31 10:00',
                  hora_entrada_atendimento: '2017-10-31 10:30',
                  hora_saida_restaurante: '2017-10-31 12:00',
                  qtd_pessoas: 4,
                  posicao_qdo_entrou: 1,
                  tem_reserva: false,
                  desistiu_da_fila: false,
                },
                {
                  id_fila: filas[0].id,
                  id_usuario: usuarios[0].id,
                  hora_entrada_fila: '2017-10-31 10:00',
                  hora_entrada_atendimento: '2017-10-31 10:30',
                  hora_saida_restaurante: '2017-10-31 12:00',
                  qtd_pessoas: 5,
                  tem_reserva: false,
                  posicao_qdo_entrou: 10,
                  desistiu_da_fila: false,
                },
              ])
            })
        })
    })
}
