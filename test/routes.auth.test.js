process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const server = require('../backend')
const knex = require('../backend/database/connection')

describe('routes : auth', () => {
  beforeEach(() => {
    return knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
  })

  afterEach(() => knex.migrate.rollback())

  describe('POST /auth/new', () => {
    it('should create a new user in the database', done => {
      knex('usuario_cadastrado')
        .select('*')
        .then(usuarios_cadastrados => {
          const lengthBeforeAdd = usuarios_cadastrados.length
          chai.request(server)
            .post('/auth/new')
            .send({
              id: 10,
              nome: 'Usuario 10',
              telefone: 'Telefone 10',
              email: 'Email 10',
              senha: 'hunter10',
            })
            .end((err, res) => {
              // there should be no errors
              should.not.exist(err)
              // there should be a 201 status code
              // (indicating that something was "created")
              res.status.should.equal(201)
              // the response should be JSON
              res.type.should.equal('application/json')
              // the JSON response body should have a
              // key-value pair of {"status": "success"}
              res.body.status.should.eql('ok')
              // the JSON response body should not exist
              should.not.exist(res.body.data)
              // ensure the restaurante was in fact deleted
              knex('usuario_cadastrado')
                .select('*')
                .then(updated_usuarios => {
                  updated_usuarios.length.should.eql(lengthBeforeAdd + 1)
                  done()
                })
            })
        })
    })
    /*
    it('should throw an error if the payload is malformed', done => {
      chai.request(server)
        .post('/fila')
        .send({
          hora_funcionamento_inicio: '01:00',
        })
        .end((err, res) => {
          // there should an error
          should.exist(err)
          // there should be a 400 status code
          res.status.should.equal(400)
          // the response should be JSON
          res.type.should.equal('application/json')
          // the JSON response body should have a
          // key-value pair of {"status": "error"}
          res.body.status.should.eql('error')
          // the JSON response body should have a message key
          should.exist(res.body.message)
          done()
        })
    })
    */
  })
})

