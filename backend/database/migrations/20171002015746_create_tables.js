/*
knex migrate:rollback
knex migrate:make create_tables
knex migrate:latest --env development
knex seed:make <table>_seed
knex seed:run --env development
 */

exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('restaurante', table => {
      table.bigincrements()
      table.text('nome').notNullable()
      table.text('endereco').notNullable()
      table.text('descricao').notNullable()
      table.text('site').notNullable()
      table.string('telefone', 15).notNullable()
      table.specificType('hora_funcionamento_inicio', 'TIME[7]')
      table.specificType('hora_funcionamento_fim', 'TIME[7]')
      table.specificType('forma_pagamento', 'TEXT[]')
      table.text('informacao_adicional')
    })
    .createTable('fila', table => {
      table.bigincrements()
      table.bigint('restaurante_id')
      table.foreign('restaurante_id')
        .references('restaurante.id')
        .onDelete('cascade')
        .onUpdate('restrict')
      table.time('hora_funcionamento_inicio')
      table.time('hora_funcionamento_fim')
    })
    .createTable('usuario', table => {
      table.bigint('id').primary()
      table.text('nome').notNullable()
      table.string('telefone', 15).notNullable().unique()
    })
    .createTable('usuario_cadastrado', table => {
      table.bigint('id_usuario')
      table.foreign('id_usuario')
        .references('usuario.id')
        .onDelete('restrict')
        .onUpdate('restrict')
      table.text('email').notNullable()
      table.text('senha').notNullable()
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('usuario_cadastrado')
    .dropTableIfExists('usuario')
    .dropTableIfExists('fila')
    .dropTableIfExists('restaurante')
}
