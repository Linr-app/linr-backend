exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('usuario_adm').del()
    .then(() => {
      // Inserts seed entries
      return knex('usuario_adm').insert([
        {
          id: 1,
          id_restaurante: 1,
          nome: 'Adm 1',
          email: 'adm1@gmail.com',
          senha: 'hunteradm1',
          tipo: 'dono',
        },
        {
          id: 2,
          id_restaurante: 1,
          nome: 'Garcom 2',
          email: 'garcom2@gmail.com',
          senha: 'huntergarcom2',
          tipo: 'garcom',
        },
        {
          id: 3,
          id_restaurante: 1,
          nome: 'Garcom 3',
          email: 'garcom3@gmail.com',
          senha: 'huntergarcom3',
          tipo: 'garcom',
        },
        {
          id: 4,
          id_restaurante: 2,
          nome: 'Adm 4',
          email: 'adm4@gmail.com',
          senha: 'hunteradm4',
          tipo: 'dono',
        },
        {
          id: 5,
          id_restaurante: 2,
          nome: 'Garcom 5',
          email: 'garcom5@gmail.com',
          senha: 'huntergarcom5',
          tipo: 'garcom',
        },
        {
          id: 6,
          id_restaurante: 2,
          nome: 'Garcom 6',
          email: 'garcom6@gmail.com',
          senha: 'huntergarcom6',
          tipo: 'garcom',
        },
      ])
    })
}
