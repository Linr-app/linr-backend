const Router = require("koa-router")

const Restaurante = require("./restaurante")

const router = new Router()

router.all("/", async ctx => {
  ctx.body = {
    message: "Hello!",
  }
})
router.use("/restaurante", Restaurante.routes(), Restaurante.allowedMethods())


module.exports = router
