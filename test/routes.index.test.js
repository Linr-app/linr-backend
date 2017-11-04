process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const server = require('../backend')

describe('routes : Index', () => {

  describe('GET /', () => {
    it('should return json', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          chai.should().not.exist(err)
          res.status.should.eql(200)
          res.type.should.eql('application/json')
          res.body.message.should.eql('Hello!')
          done()
        })
    })
  })
})
