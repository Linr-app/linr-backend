/*
knex migrate:make create_tables
knex migrate:latest --env development
knex seed:make <table>_seed
knex seed:run --env development
 */

exports.up = function (knex, Promise) {
  return knex.schema
    .createTable("restaurante", table => {
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
    .createTable("fila", table => {
      table.bigincrements()
      table.bigint("restaurante_id")
      table.foreign("restaurante_id")
        .references("restaurante.id")
        .onDelete("cascade")
        .onUpdate("restrict")
      table.time("hora_funcionamento_inicio")
      table.time("hora_funcionamento_fim")
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTable("fila")
    .dropTable("restaurante")
}
