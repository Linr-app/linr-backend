const knex = require("../connection")

module.exports.getAllRestaurantes = () => {
  return knex("restaurante")
    .select("*")
}

module.exports.getSingleRestaurante = id => {
  return knex("restaurante")
    .select("*")
    .where({id: parseInt(id)})
}

module.exports.addRestaurante = restaurante => {
  return knex("restaurante")
    .insert(restaurante)
    .returning("*")
}

module.exports.updateRestaurante = (id, restaurante) => {
  return knex("restaurante")
    .update(restaurante)
    .where({id: parseInt(id)})
    .returning("*")
}

module.exports.deleteRestaurante = id => {
  return knex("restaurante")
    .del()
    .where({id: parseInt(id)})
    .returning("*")
}
