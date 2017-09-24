const onerror = require("koa-onerror")

const Logger = require("./logger.js")

module.exports = function (app) {
  onerror(app)
  Logger()
  app.on("error", function (err, ctx) {
    logger.error(err)
  })
}
