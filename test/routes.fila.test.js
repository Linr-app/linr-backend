process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const server = require('../backend')
const knex = require('../backend/database/connection')

describe('routes : fila', () => {
  beforeEach(() => {
    return knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
  })

  afterEach(() => knex.migrate.rollback())

  describe('GET /filas', () => {
    it('should return all fila', done => {
      chai.request(server)
        .get('/filas')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.type.should.equal('application/json')
          res.body.status.should.eql('ok')
          res.body.data.length.should.eql(3)
          res.body.data[0].should.include.keys(
            'id', 'id_restaurante',
            'hora_funcionamento_inicio', 'hora_funcionamento_fim',
            'tempo_medio_inicial', 'descricao',
          )
          done()
        })
    })
  })

  describe('GET /filas/:id', () => {
    it('should respond with a single fila', done => {
      chai.request(server)
        .get('/filas/1')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.type.should.equal('application/json')
          res.body.status.should.eql('ok')
          res.body.data.should.include.keys(
            'id', 'id_restaurante',
            'hora_funcionamento_inicio', 'hora_funcionamento_fim',
            'tempo_medio_inicial', 'descricao', 'usuarios_na_fila',
          )
          logger.debug(res.body.data)
          done()
        })
    })
    it('should throw an error if the fila does not exist', done => {
      chai.request(server)
        .get('/filas/9999999')
        .end((err, res) => {
          should.exist(err)
          res.status.should.equal(404)
          res.type.should.equal('application/json')
          res.body.status.should.eql('error')
          res.body.message.should.eql('Este fila nao existe')
          done()
        })
    })
  })

  describe('POST /filas', () => {
    it('should return the fila that was added', done => {
      chai.request(server)
        .post('/filas')
        .send({
          id_restaurante: 1,
          hora_funcionamento_inicio: '00:00',
          hora_funcionamento_fim: '00:00',
          tempo_medio_inicial: 42,
          descricao: 'Eu gosto de pudim',
        })
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(201)
          res.type.should.equal('application/json')
          res.body.status.should.eql('ok')
          res.body.data[0].should.include.keys(
            'id', 'id_restaurante',
            'hora_funcionamento_inicio', 'hora_funcionamento_fim',
            'tempo_medio_inicial', 'descricao',
          )
          done()
        })
    })
    it('should throw an error if the payload is malformed', done => {
      chai.request(server)
        .post('/filas')
        .send({
          hora_funcionamento_inicio: '01:00',
        })
        .end((err, res) => {
          should.exist(err)
          res.status.should.equal(400)
          res.type.should.equal('application/json')
          res.body.status.should.eql('error')
          should.exist(res.body.message)
          done()
        })
    })
  })

  describe('PUT /filas/:id', () => {
    it('should return the fila that was updated', done => {
      knex('fila')
        .select('*')
        .then(([fila]) => {
          chai.request(server)
            .put(`/filas/${fila.id}`)
            .send({
              hora_funcionamento_inicio: '01:00',
            })
            .end((err, res) => {
              should.not.exist(err)
              res.status.should.equal(200)
              res.type.should.equal('application/json')
              res.body.status.should.eql('ok')
              res.body.data[0].should.include.keys(
                'id', 'id_restaurante',
                'hora_funcionamento_inicio', 'hora_funcionamento_fim',
                'tempo_medio_inicial', 'descricao',
              )
              const newfila = res.body.data[0]
              newfila.hora_funcionamento_inicio.should.not.eql(fila.hora_funcionamento_inicio)
              done()
            })
        })
        .catch(done)
    })
    it('should throw an error if the fila does not exist', done => {
      chai.request(server)
        .put('/filas/9999999')
        .send({
          hora_funcionamento_inicio: '11:00',
        })
        .end((err, res) => {
          should.exist(err)
          res.status.should.equal(404)
          res.type.should.equal('application/json')
          res.body.status.should.eql('error')
          res.body.message.should.eql('Este fila nao existe')
          done()
        })
    })
  })

  describe('PUT /filas/:id/enter', () => {
    it('should create a new usuario_fila', function (done) {
      knex('usuario_fila')
        .count('*')
        .then(function ([old_row]) {
          const old_count = parseInt(old_row.count)
          knex('fila')
            .select('id')
            .limit(1)
            .then(function ([{id: fila_id}]) {
              logger.debug(fila_id)
              chai.request(server)
                .put(`/filas/${fila_id}/enter`)
                .send({
                  id_usuario: 1,
                  qtd_pessoas: 2,
                })
                .end(function (err, res) {
                  if (err) {
                    logger.error(err)
                  }
                  should.not.exist(err)
                  res.status.should.equal(200)
                  res.type.should.equal('application/json')
                  res.body.status.should.eql('ok')
                  knex('usuario_fila')
                    .count('*')
                    .then(function ([new_row]) {
                      const new_count = parseInt(new_row.count)
                      should.equal(new_count, old_count + 1)
                      done()
                    })
                    .catch(done)
                })
            })
            .catch(done)
        })
        .catch(done)
    })
  })

  describe('PUT /filas/:id/desistir', () => {
    it('should mark a user as given up', function (done) {
      knex('usuario_fila')
        .select('id')
        .then(function ([{id: id_usuario_fila}]) {
          knex('fila')
            .select('id')
            .limit(1)
            .then(function ([{id: fila_id}]) {
              chai.request(server)
                .put(`/filas/${fila_id}/remove`)
                .send({
                  id_usuario_fila: id_usuario_fila,
                })
                .end(function (err, res) {
                  if (err) {
                    logger.error(err)
                  }
                  should.not.exist(err)
                  res.status.should.equal(200)
                  res.type.should.equal('application/json')
                  res.body.status.should.eql('ok')
                  done()
                })
            })
            .catch(done)
        })
        .catch(done)
    })
  })
})
