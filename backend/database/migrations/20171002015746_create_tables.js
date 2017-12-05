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
      table.bigint('id_restaurante').notNullable()
      table.foreign('id_restaurante')
        .references('restaurante.id')
        .onDelete('cascade')
        .onUpdate('restrict')
      table.time('hora_funcionamento_inicio')
      table.time('hora_funcionamento_fim')
      table.integer('tempo_medio_inicial').notNullable()
      table.text('descricao')
    })
    .createTable('usuario_adm', table => {
      table.bigincrements()
      table.bigint('id_restaurante').notNullable()
      table.foreign('id_restaurante')
        .references('restaurante.id')
        .onDelete('cascade')
        .onUpdate('cascade')
      table.text('nome').notNullable()
      table.text('email').notNullable()
      table.text('senha').notNullable()
      table.enu('tipo', ['gerente', 'funcionario']).notNullable()
    })
    .createTable('categoria', table => {
      table.bigincrements()
      table.text('nome').notNullable().unique()
      table.text('descricao').notNullable()
    })
    .createTable('mesa', table => {
      table.bigint('id_mesa')
      table.bigint('id_restaurante').notNullable()
      table.foreign('id_restaurante')
        .references('restaurante.id')
        .onDelete('cascade')
        .onUpdate('cascade')
      table.integer('capacidade').notNullable()
      table.boolean('ocupada').notNullable().defaultTo(false)
      table.primary(['id_mesa', 'id_restaurante'])
    })
    .createTable('restaurante_categoria', table => {
      table.bigint('id_restaurante').notNullable()
      table.foreign('id_restaurante')
        .references('restaurante.id')
      table.bigint('id_categoria').notNullable()
      table.foreign('id_categoria')
        .references('categoria.id')
      table.primary(['id_restaurante', 'id_categoria'])
    })
    .createTable('usuario', table => {
      table.bigint('id').primary()
      table.text('nome').notNullable()
      table.text('fcmtoken')
      table.string('telefone', 15).notNullable()
    })
    .createTable('usuario_cadastrado', table => {
      table.bigint('id_usuario').notNullable().unique()
      table.foreign('id_usuario')
        .references('usuario.id')
        .onDelete('restrict')
        .onUpdate('restrict')
      table.text('email').notNullable()
      table.text('senha').notNullable()
    })
    .createTable('usuario_fila', table => {
      table.bigincrements()
      table.bigint('id_fila').notNullable()
      table.foreign('id_fila')
        .references('fila.id')
        .onDelete('restrict')
        .onUpdate('restrict')
      table.bigint('id_usuario').notNullable()
      table.foreign('id_usuario')
        .references('usuario.id')
        .onDelete('restrict')
        .onUpdate('restrict')
      table.timestamp('hora_entrada_fila').notNullable().defaultTo(knex.fn.now())
      table.timestamp('hora_entrada_atendimento')
      table.timestamp('hora_saida_restaurante')
      table.integer('qtd_pessoas').notNullable()
      table.boolean('tem_reserva').notNullable().defaultTo(false)
      table.boolean('desistiu_da_fila').notNullable().defaultTo(false)
    })
    .createTable('avaliacao', table => {
      table.bigint('id_restaurante').notNullable()
      table.foreign('id_restaurante')
        .references('restaurante.id')
      table.bigint('id_usuario').notNullable()
      table.foreign('id_usuario')
        .references('usuario_cadastrado.id_usuario')
      table.integer('valor').notNullable() //Between [0,5]
      table.primary(['id_restaurante', 'id_usuario'])
    })
    .createTable('sessao', table => {
      table.bigint('id_usuario').primary()
      table.foreign('id_usuario')
        .references('usuario_cadastrado.id_usuario')
        .onDelete('cascade')
        .onUpdate('cascade')
      table.integer('token').notNullable()
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('sessao')
    .dropTableIfExists('avaliacao')
    .dropTableIfExists('usuario_fila')
    .dropTableIfExists('usuario_cadastrado')
    .dropTableIfExists('usuario')
    .dropTableIfExists('restaurante_categoria')
    .dropTableIfExists('mesa')
    .dropTableIfExists('categoria')
    .dropTableIfExists('usuario_adm')
    .dropTableIfExists('fila')
    .dropTableIfExists('restaurante')
}
