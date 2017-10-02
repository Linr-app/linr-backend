exports.up = function (knex, Promise) {
  return knex.schema
    .withSchema("public")
    .createTableIfNotExists("restaurante", table => {
      table.bigincrements()
      table.text("nome").notNullable()
      table.text("endereco").notNullable()
      table.text("descricao").notNullable()
      table.text("site").notNullable()
      table.string("telefone", 15).notNullable()
      table.specificType("hora_funcionamento_inicio", "TIME[7]")
      table.specificType("hora_funcionamento_fim", "TIME[7]")
      table.specificType("forma_pagamento", "TEXT[]")
      table.text("informacao_adicional")
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.withSchema("public").dropTable("restaurante")
}
