const onerror = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const logging = require('koa-logger')
const cors = require('koa2-cors')

const Logger = require('./logger.js')
const routes = require('../routes')

module.exports = app => {
  onerror(app)
  Logger()
  app.on('error', (err, ctx) => {
    logger.error(err)
  })

  app.use(logging())
  app.use(bodyParser())
  app.use(cors({credentials: true, origin: '*'}))

  // Mount routes
  app.use(routes.routes())
  app.use(routes.allowedMethods())
}
