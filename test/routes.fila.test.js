process.env.NODE_ENV = "test"

const chai = require("chai")
const should = chai.should()
const chaiHttp = require("chai-http")
chai.use(chaiHttp)

const server = require("../backend")
const knex = require("../backend/database/connection")

describe("routes : fila", () => {
  beforeEach(() => {
    return knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
  })

  afterEach(() => knex.migrate.rollback())

  describe("GET /fila", () => {
    it("should return all fila", done => {
      chai.request(server)
        .get("/fila")
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
          // key-value pair of {"data": [3 fila objects]}
          res.body.data.length.should.eql(3)
          // the first object in the data array should
          // have the right keys
          res.body.data[0].should.include.keys(
            "id", "restaurante_id",
            "hora_funcionamento_inicio", "hora_funcionamento_fim",
          )
          done()
        })
    })
  })

  describe("GET /fila/:id", () => {
    it("should respond with a single fila", done => {
      chai.request(server)
        .get("/fila/1")
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
          // key-value pair of {"data": 1 fila object}
          res.body.data[0].should.include.keys(
            "id", "restaurante_id",
            "hora_funcionamento_inicio", "hora_funcionamento_fim",
          )
          done()
        })
    })
    it("should throw an error if the fila does not exist", done => {
      chai.request(server)
        .get("/fila/9999999")
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
          // key-value pair of {"message": "Este fila nao existe"}
          res.body.message.should.eql("Este fila nao existe")
          done()
        })
    })
  })

  describe("POST /fila", () => {
    it("should return the fila that was added", done => {
      chai.request(server)
        .post("/fila")
        .send({
          id: 4,
          restaurante_id: 1,
          hora_funcionamento_inicio: "00:00",
          hora_funcionamento_fim: "00:00",
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
          // key-value pair of {"data": 1 fila object}
          res.body.data[0].should.include.keys(
            "id", "restaurante_id",
            "hora_funcionamento_inicio", "hora_funcionamento_fim",
          )
          done()
        })
    })
    it("should throw an error if the payload is malformed", done => {
      chai.request(server)
        .post("/fila")
        .send({
          hora_funcionamento_inicio: "01:00",
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

  describe("PUT /fila", () => {
    it("should return the fila that was updated", done => {
      knex("fila")
        .select("*")
        .then(fila_db => {
          const fila = fila_db[0]
          chai.request(server)
            .put(`/fila/${fila.id}`)
            .send({
              hora_funcionamento_inicio: "01:00",
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
              // key-value pair of {"data": 1 fila object}
              res.body.data[0].should.include.keys(
                "id", "restaurante_id",
                "hora_funcionamento_inicio", "hora_funcionamento_fim",
              )
              // ensure the fila was in fact updated
              const newfila = res.body.data[0]
              newfila.hora_funcionamento_inicio.should.not.eql(fila.hora_funcionamento_inicio)
              done()
            })
        })
    })
    it("should throw an error if the fila does not exist", done => {
      chai.request(server)
        .put("/fila/9999999")
        .send({
          hora_funcionamento_inicio: "11:00",
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
          // key-value pair of {"message": "Este fila nao existe"}
          res.body.message.should.eql("Este fila nao existe")
          done()
        })
    })
  })

  describe("DELETE /fila/:id", () => {
    it("should return the fila that was deleted", done => {
      knex("fila")
        .select("*")
        .then(fila_db => {
          const fila = fila_db[0]
          const lengthBeforeDelete = fila_db.length
          chai.request(server)
            .delete(`/fila/${fila.id}`)
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
              // key-value pair of {"data": 1 fila object}
              res.body.data[0].should.include.keys(
                "id", "restaurante_id",
                "hora_funcionamento_inicio", "hora_funcionamento_fim",
              )
              // ensure the fila was in fact deleted
              knex("fila")
                .select("*")
                .then(updatedfilas => {
                  updatedfilas.length.should.eql(lengthBeforeDelete - 1)
                  done()
                })
            })
        })
    })
    it("should throw an error if the fila does not exist", (done) => {
      chai.request(server)
        .delete("/fila/9999999")
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
          // key-value pair of {"message": "That fila does not exist."}
          res.body.message.should.eql("Este fila nao existe")
          done()
        })
    })
  })
})
