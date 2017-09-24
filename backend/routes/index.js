const Router = require("koa-router")

const controllers = require("../controllers")

function routes(app) {
  const router = new Router()
  router.use("/", controllers.routes(), controllers.allowedMethods())
  app.use(router.routes())
  app.use(router.allowedMethods())
}

module.exports = routes
