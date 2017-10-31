exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('categoria').del()
    .then(() => {
      // Inserts seed entries
      return knex('categoria').insert([
        {
          id: 1,
          nome: 'Categoria 1',
          descricao: 'Descricao Categoria 1',
        },
        {
          id: 2,
          nome: 'Categoria 2',
          descricao: 'Descricao Categoria 2',
        },
        {
          id: 3,
          nome: 'Categoria 3',
          descricao: 'Descricao Categoria 3',
        },
        {
          id: 4,
          nome: 'Categoria 4',
          descricao: 'Descricao Categoria 4',
        },
      ])
    })
}
