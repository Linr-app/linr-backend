exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex("restaurante").del()
    .then(() => {
      // Inserts seed entries
      return knex("restaurante").insert([
        {
          id: 1,
          nome: "Restaurante 1",
          endereco: "Endereco 1",
          descricao: "Descricao 1",
          site: "www.site1.com",
          telefone: "111111111",
          hora_funcionamento_inicio: ["10:00", "10:00", "10:00", "10:00", "10:00", "10:00", "10:00"],
          hora_funcionamento_fim: ["20:00", "20:00", "20:00", "20:00", "20:00", "20:00", "20:00"],
          forma_pagamento: "{'VISA'}",
          informacao_adicional: "Informacao Adicional 1",
        },
        {
          id: 2,
          nome: "Restaurante 2",
          endereco: "Endereco 2",
          descricao: "Descricao 2",
          site: "www.site2.com",
          telefone: "222222222222222",
          hora_funcionamento_inicio: [null, "10:00", "10:00", "10:00", "10:00", "10:00", null],
          hora_funcionamento_fim: [null, "20:00", "20:00", "20:00", "20:00", "20:00", null],
          forma_pagamento: null,
          informacao_adicional: null,
        },
      ])
    })
}
