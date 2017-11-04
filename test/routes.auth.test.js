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
    it('should create a new user in the database', function (done) {
      knex('usuario')
        .count('*')
        .then(function ([old_row]) {
          const old_count = parseInt(old_row.count)
          chai.request(server)
            .post('/auth/new')
            .send({
              id: 10,
              nome: 'Usuario 10',
              telefone: 'Telefone 10',
              email: 'Email 10',
              senha: 'hunter10',
            })
            .end(function (err, res) {
              should.not.exist(err)
              res.status.should.equal(201)
              res.type.should.equal('application/json')
              res.body.status.should.eql('ok')
              res.body.data.should.include.keys('id_usuario')
              knex('usuario')
                .count('*')
                .then(function ([new_row]) {
                  const new_count = parseInt(new_row.count)
                  should.equal(new_count, old_count + 1)
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

  describe('POST /auth/new/temp', () => {
    it('should create a new temporary user in the database', function (done) {
      knex('usuario')
        .count('*')
        .then(function ([old_row]) {
          const old_count = parseInt(old_row.count)
          chai.request(server)
            .post('/auth/new/temp')
            .send({
              id: 10,
              nome: 'Usuario 10',
              telefone: 'Telefone 10',
            })
            .end(function (err, res) {
              should.not.exist(err)
              res.status.should.equal(201)
              res.type.should.equal('application/json')
              res.body.status.should.eql('ok')
              res.body.data.should.include.keys('id_usuario')
              knex('usuario')
                .count('*')
                .then(function ([new_row]) {
                  const new_count = parseInt(new_row.count)
                  should.equal(new_count, old_count + 1)
                  done()
                })
            })
        })
    })
  })
})

