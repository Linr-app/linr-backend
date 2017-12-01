const knex = require('../connection')


/**
 * Atualiza o valor de uma avaliação de um restaurante feita por um usuario. 
 * @param avaliacao Objeto contendo id_restaurante[int], id_usuario_cadastrado[int] e valor_avaliacao[int]
 */
module.exports.updateAvaliacao = avaliacao => {
  return knex('avaliacoes')
    .update({
      'avaliacao': parseInt(avaliacao.valor_avaliacao),
    })
    .where({
      'id_restaurante': parseInt(avaliacao.id_restaurante),
      'id_usuario': parseInt(avaliacao.id_usuario_cadastrado),
    })
    .returning('*')
}

/**
 * Pega a média da avaliação de um restaurante. 
 * @param ids Objeto contendo id_restaurante[int] e id_usuario_cadastrado[int]
 */
module.exports.getAvaliacao = ids => {
  return knex('avaliacoes')
    .select('avaliacao')
    .where({
      'id_restaurante': parseInt(ids.id_restaurante),
      'id_usuario': parseInt(ids.id_usuario_cadastrado),
    })
}

 /**
 * Pega a média da avaliação de um restaurante. 
 * @param id_restaurante 
 */
module.exports.getAverageAvaliacao = id_restaurante => {
  return knex('avaliacoes')
    .avg('avaliacao')
    .where({
      'id_restaurante': parseInt(id_restaurante),
    })
}

/**
 * Cria uma nova avaliacao com um objeto avaliacao.
 * @param avaliacao Objeto contendo id_restaurante[int], id_usuario_cadastrado[int] e valor_avaliacao[int]
 */
module.exports.createAvaliacao = avaliacao => {
  return knex('avaliacoes')
    .insert({
      id_restaurante: parseInt(avaliacao.id_restaurante),
      id_usuario: parseInt(avaliacao.id_usuario_cadastrado),
      avaliacao: parseInt(avaliacao.valor_avaliacao),
    })
    .returning('*')
}
