process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const server = require('../backend')
const knex = require('../backend/database/connection')

/**
 GET    /restaurantes        Return ALL restaurants
 GET    /restaurantes/:id    Return a SINGLE restaurant
 POST   /restaurantes        Add a restaurant
 PUT    /restaurantes/:id    Update a restaurant
 DELETE /restaurantes/:id    Delete a restaurant
 */

describe('routes : restaurantes', () => {
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

  describe('GET /restaurantes', () => {
    it('should return all restaurante', done => {
      chai.request(server)
        .get('/restaurantes')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.type.should.equal('application/json')
          res.body.status.should.eql('ok')
          res.body.data.length.should.eql(2)
          res.body.data[0].should.include.keys(
            'id', 'nome', 'endereco', 'descricao', 'site', 'telefone',
            'hora_funcionamento_inicio', 'hora_funcionamento_fim',
            'forma_pagamento', 'informacao_adicional', 'filas',
          )
          done()
        })
    })
  })

  describe('GET /restaurantes/:id', () => {
    it('should respond with a single restaurante', done => {
      chai.request(server)
        .get('/restaurantes/1')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.type.should.equal('application/json')
          res.body.status.should.eql('ok')
          res.body.data.should.include.keys(
            'id', 'nome', 'endereco', 'descricao', 'site', 'telefone',
            'hora_funcionamento_inicio', 'hora_funcionamento_fim',
            'forma_pagamento', 'informacao_adicional', 'filas', 'mesas',
          )
          done()
        })
    })
    it('should throw an error if the restaurante does not exist', done => {
      chai.request(server)
        .get('/restaurantes/9999999')
        .end((err, res) => {
          should.exist(err)
          res.status.should.equal(404)
          res.type.should.equal('application/json')
          res.body.status.should.eql('error')
          res.body.message.should.eql('Este restaurante nao existe')
          done()
        })
    })
  })

  describe('POST /restaurantes', () => {
    it('should return the restaurante that was added', done => {
      chai.request(server)
        .post('/restaurantes')
        .send({
          nome: 'Restaurante Teste',
          endereco: 'Endereco Teste',
          descricao: 'Descricao Teste',
          site: 'www.siteteste.com',
          telefone: '123456789',
          hora_funcionamento_inicio: [null, null, null, null, null, null, null],
          hora_funcionamento_fim: [null, null, null, null, null, null, null],
          forma_pagamento: ['VISA', 'MASTERCARD', 'DINHEIRO'],
          informacao_adicional: 'Informacao Adicional Teste',
        })
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(201)
          res.type.should.equal('application/json')
          res.body.status.should.eql('ok')
          res.body.data[0].should.include.keys(
            'id', 'nome', 'endereco', 'descricao', 'site', 'telefone',
            'hora_funcionamento_inicio', 'hora_funcionamento_fim',
            'forma_pagamento', 'informacao_adicional',
          )
          done()
        })
    })
    it('should throw an error if the payload is malformed', done => {
      chai.request(server)
        .post('/restaurantes')
        .send({
          nome: 'Restaurante Teste',
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

  describe('PUT /restaurantes', () => {
    it('should return the restaurante that was updated', done => {
      knex('restaurante')
        .select('*')
        .then(restaurante_db => {
          const restaurante = restaurante_db[0]
          chai.request(server)
            .put(`/restaurantes/${restaurante.id}`)
            .send({
              descricao: 'Descricao nova',
            })
            .end((err, res) => {
              if (err) {
                logger.error(err)
              }
              should.not.exist(err)
              res.status.should.equal(200)
              res.type.should.equal('application/json')
              res.body.status.should.eql('ok')
              res.body.data.should.include.keys(
                'id', 'nome', 'endereco', 'descricao', 'site', 'telefone',
                'hora_funcionamento_inicio', 'hora_funcionamento_fim',
                'forma_pagamento', 'informacao_adicional',
              )
              const newRestaurante = res.body.data
              newRestaurante.descricao.should.not.eql(restaurante.descricao)
              done()
            })
        })
        .catch(done)
    })
    it('should throw an error if the restaurante does not exist', done => {
      chai.request(server)
        .put('/restaurantes/9999999')
        .send({
          descricao: 'Descricao nova',
        })
        .end((err, res) => {
          should.exist(err)
          res.status.should.equal(404)
          res.type.should.equal('application/json')
          res.body.status.should.eql('error')
          res.body.message.should.eql('Este restaurante nao existe')
          done()
        })
    })
  })

  describe('POST /restaurantes/:id/mesas', () => {
    it('should create a mesa', done => {
      chai.request(server)
        .post('/restaurantes/1/mesas')
        .send({
          id_mesa: 4,
          capacidade: 4,
        })
        .end((err, res) => {
          if (err) {
            logger.error(err)
          }
          should.not.exist(err)
          res.status.should.equal(200)
          res.type.should.equal('application/json')
          res.body.status.should.eql('ok')
          res.body.data.should.include.keys(
            'id_mesa', 'id_restaurante', 'capacidade', 'ocupada',
          )
          done()
        })
    })
  })
})
