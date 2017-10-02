process.env.NODE_ENV = "test"

const chai = require("chai")
const should = chai.should()
const chaiHttp = require("chai-http")
chai.use(chaiHttp)

const server = require("../backend")

/**
 GET    /restaurante        Return ALL restaurants
 GET    /restaurante/:id    Return a SINGLE restaurant
 POST   /restaurante        Add a restaurant
 PUT    /restaurante/:id    Update a restaurant
 DELETE /restaurante/:id    Delete a restaurant
 */

describe("routes : Index", () => {

  describe("GET /", () => {
    it("should return json", (done) => {
      chai.request(server)
        .get("/")
        .end((err, res) => {
          chai.should().not.exist(err)
          res.status.should.eql(200)
          res.type.should.eql("application/json")
          res.body.message.should.eql("Hello!")
          done()
        })
    })
  })

})

