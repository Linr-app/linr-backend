exports.seed = (knex, Promise) => {
  return knex('categoria').del()
    .then(() => {
      return knex('categoria').insert([
        {
          nome: 'Categoria 1',
          descricao: 'Descricao Categoria 1',
        },
        {
          nome: 'Categoria 2',
          descricao: 'Descricao Categoria 2',
        },
        {
          nome: 'Categoria 3',
          descricao: 'Descricao Categoria 3',
        },
        {
          nome: 'Categoria 4',
          descricao: 'Descricao Categoria 4',
        },
      ])
    })
}
