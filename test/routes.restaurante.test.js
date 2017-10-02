process.env.NODE_ENV = "test"

const chai = require("chai")
const should = chai.should()
const chaiHttp = require("chai-http")
chai.use(chaiHttp)

const server = require("../backend")
const knex = require("../backend/database/connection")

describe("routes : restaurantes", () => {
  beforeEach(() => {
    return knex.migrate.rollback()
      .then(() => {
        return knex.migrate.latest()
      })
      .then(() => {
        return knex.seed.run()
      })
  })

  afterEach(() => {
    return knex.migrate.rollback()
  })

  describe("GET /restaurante", () => {
    it("should return all restaurante", done => {
      chai.request(server)
        .get("/restaurante")
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err)
          // there should be a 200 status code
          res.status.should.equal(200)
          // the response should be JSON
          res.type.should.equal("application/json")
          // the JSON response body should have a
          // key-value pair of {"status": "error"}
          res.body.status.should.eql("ok")
          // the JSON response body should have a
          // key-value pair of {"data": [3 restaurante objects]}
          res.body.data.length.should.eql(2)
          // the first object in the data array should
          // have the right keys
          res.body.data[0].should.include.keys(
            "id", "nome", "endereco", "descricao", "site", "telefone",
            "hora_funcionamento_inicio", "hora_funcionamento_fim",
            "forma_pagamento", "informacao_adicional",
          )
          done()
        })
    })
  })

  describe("GET /restaurante/:id", () => {
    it("should respond with a single restaurante", done => {
      chai.request(server)
        .get("/restaurante/1")
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err)
          // there should be a 200 status code
          res.status.should.equal(200)
          // the response should be JSON
          res.type.should.equal("application/json")
          // the JSON response body should have a
          // key-value pair of {"status": "error"}
          res.body.status.should.eql("ok")
          // the JSON response body should have a
          // key-value pair of {"data": 1 restaurante object}
          res.body.data[0].should.include.keys(
            "id", "nome", "endereco", "descricao", "site", "telefone",
            "hora_funcionamento_inicio", "hora_funcionamento_fim",
            "forma_pagamento", "informacao_adicional",
          )
          done()
        })
    })
    it("should throw an error if the restaurante does not exist", done => {
      chai.request(server)
        .get("/restaurante/9999999")
        .end((err, res) => {
          // there should an error
          should.exist(err)
          // there should be a 404 status code
          res.status.should.equal(404)
          // the response should be JSON
          res.type.should.equal("application/json")
          // the JSON response body should have a
          // key-value pair of {"status": "error"}
          res.body.status.should.eql("error")
          // the JSON response body should have a
          // key-value pair of {"message": "Este restaurante nao existe"}
          res.body.message.should.eql("Este restaurante nao existe")
          done()
        })
    })
  })

  describe("POST /restaurante", () => {
    it("should return the restaurante that was added", done => {
      chai.request(server)
        .post("/restaurante")
        .send({
          id: 3, // TODO FIX THIS
          nome: "Restaurante Teste",
          endereco: "Endereco Teste",
          descricao: "Descricao Teste",
          site: "www.siteteste.com",
          telefone: "123456789",
          hora_funcionamento_inicio: [null, null, null, null, null, null, null],
          hora_funcionamento_fim: [null, null, null, null, null, null, null],
          forma_pagamento: ["VISA", "MASTERCARD", "DINHEIRO"],
          informacao_adicional: "Informacao Adicional Teste",
        })
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err)
          // there should be a 201 status code
          // (indicating that something was "created")
          res.status.should.equal(201)
          // the response should be JSON
          res.type.should.equal("application/json")
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          res.body.status.should.eql("ok")
          // the JSON response body should have a
          // key-value pair of {"data": 1 restaurante object}
          res.body.data[0].should.include.keys(
            "id", "nome", "endereco", "descricao", "site", "telefone",
            "hora_funcionamento_inicio", "hora_funcionamento_fim",
            "forma_pagamento", "informacao_adicional",
          )
          done()
        })
    })
    it("should throw an error if the payload is malformed", done => {
      chai.request(server)
        .post("/restaurante")
        .send({
          nome: "Restaurante Teste",
          endereco: "Endereco Teste",
          descricao: "Descricao Teste",
          site: "www.siteteste.com",
          telefone: "123456789",
          forma_pagamento: ["VISA", "MASTERCARD", "DINHEIRO"],
          informacao_adicional: "Informacao Adicional Teste",
        })
        .end((err, res) => {
          // there should an error
          should.exist(err)
          // there should be a 400 status code
          res.status.should.equal(400)
          // the response should be JSON
          res.type.should.equal("application/json")
          // the JSON response body should have a
          // key-value pair of {"status": "error"}
          res.body.status.should.eql("error")
          // the JSON response body should have a message key
          should.exist(res.body.message)
          done()
        })
    })
  })

  describe("PUT /restaurante", () => {
    it("should return the restaurante that was updated", done => {
      knex("restaurante")
        .select("*")
        .then(restaurante_db => {
          const restaurante = restaurante_db[0]
          chai.request(server)
            .put(`/restaurante/${restaurante.id}`)
            .send({
              descricao: "Descricao nova",
            })
            .end((err, res) => {
              // there should be no errors
              should.not.exist(err)
              // there should be a 200 status code
              res.status.should.equal(200)
              // the response should be JSON
              res.type.should.equal("application/json")
              // the JSON response body should have a
              // key-value pair of {"status": "success"}
              res.body.status.should.eql("ok")
              // the JSON response body should have a
              // key-value pair of {"data": 1 restaurante object}
              res.body.data[0].should.include.keys(
                "id", "nome", "endereco", "descricao", "site", "telefone",
                "hora_funcionamento_inicio", "hora_funcionamento_fim",
                "forma_pagamento", "informacao_adicional",
              )
              // ensure the restaurante was in fact updated
              const newRestaurante = res.body.data[0]
              newRestaurante.descricao.should.not.eql(restaurante.descricao)
              done()
            })
        })
    })
    it("should throw an error if the restaurante does not exist", done => {
      chai.request(server)
        .put("/restaurante/9999999")
        .send({
          descricao: "Descricao nova",
        })
        .end((err, res) => {
          // there should an error
          should.exist(err)
          // there should be a 404 status code
          res.status.should.equal(404)
          // the response should be JSON
          res.type.should.equal("application/json")
          // the JSON response body should have a
          // key-value pair of {"status": "error"}
          res.body.status.should.eql("error")
          // the JSON response body should have a
          // key-value pair of {"message": "Este restaurante nao existe"}
          res.body.message.should.eql("Este restaurante nao existe")
          done()
        })
    })
  })

  describe("DELETE /restaurante/:id", () => {
    it("should return the restaurante that was deleted", done => {
      knex("restaurante")
        .select("*")
        .then(restaurante_db => {
          const restaurante = restaurante_db[0]
          const lengthBeforeDelete = restaurante_db.length
          chai.request(server)
            .delete(`/restaurante/${restaurante.id}`)
            .end((err, res) => {
              // there should be no errors
              should.not.exist(err)
              // there should be a 200 status code
              res.status.should.equal(200)
              // the response should be JSON
              res.type.should.equal("application/json")
              // the JSON response body should have a
              // key-value pair of {"status": "success"}
              res.body.status.should.eql("ok")
              // the JSON response body should have a
              // key-value pair of {"data": 1 restaurante object}
              res.body.data[0].should.include.keys(
                "id", "nome", "endereco", "descricao", "site", "telefone",
                "hora_funcionamento_inicio", "hora_funcionamento_fim",
                "forma_pagamento", "informacao_adicional",
              )
              // ensure the restaurante was in fact deleted
              knex("restaurante")
                .select("*")
                .then(updatedrestaurantes => {
                  updatedrestaurantes.length.should.eql(lengthBeforeDelete - 1)
                  done()
                })
            })
        })
    })
    it("should throw an error if the restaurante does not exist", (done) => {
      chai.request(server)
        .delete("/restaurante/9999999")
        .end((err, res) => {
          // there should an error
          should.exist(err)
          // there should be a 404 status code
          res.status.should.equal(404)
          // the response should be JSON
          res.type.should.equal("application/json")
          // the JSON response body should have a
          // key-value pair of {"status": "error"}
          res.body.status.should.eql("error")
          // the JSON response body should have a
          // key-value pair of {"message": "That restaurante does not exist."}
          res.body.message.should.eql("Este restaurante nao existe")
          done()
        })
    })
  })
})


