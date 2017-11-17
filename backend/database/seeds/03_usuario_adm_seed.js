exports.seed = (knex, Promise) => {
  return knex('usuario_adm').del()
    .then(() => {
      return knex('restaurante')
        .select('id')
        .then(restaurantes => {
          return knex('usuario_adm').insert([
            {
              id_restaurante: restaurantes[0].id,
              nome: 'Adm 1',
              email: 'adm1@gmail.com',
              senha: 'hunteradm1',
              tipo: 'dono',
            },
            {
              id_restaurante: restaurantes[0].id,
              nome: 'Garcom 2',
              email: 'garcom2@gmail.com',
              senha: 'huntergarcom2',
              tipo: 'garcom',
            },
            {
              id_restaurante: restaurantes[0].id,
              nome: 'Garcom 3',
              email: 'garcom3@gmail.com',
              senha: 'huntergarcom3',
              tipo: 'garcom',
            },
            {
              id_restaurante: restaurantes[1].id,
              nome: 'Adm 4',
              email: 'adm4@gmail.com',
              senha: 'hunteradm4',
              tipo: 'dono',
            },
            {
              id_restaurante: restaurantes[1].id,
              nome: 'Garcom 5',
              email: 'garcom5@gmail.com',
              senha: 'huntergarcom5',
              tipo: 'garcom',
            },
            {
              id_restaurante: restaurantes[1].id,
              nome: 'Garcom 6',
              email: 'garcom6@gmail.com',
              senha: 'huntergarcom6',
              tipo: 'garcom',
            },
          ])
        })
    })
}
