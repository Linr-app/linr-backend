const Router = require("koa-router")

const Restaurante = require("./restaurante")
const Fila = require("./fila")

const router = new Router()

router.all("/", async ctx => {
  ctx.body = {
    message: "Hello!",
  }
})
router.use("/restaurante", Restaurante.routes(), Restaurante.allowedMethods())
router.use("/fila", Fila.routes(), Fila.allowedMethods())


module.exports = router
