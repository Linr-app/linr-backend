exports.seed = (knex, Promise) => {
  return knex('sessao').del()
}
