const Router = require("koa-router")

const router = new Router()


router.all("/", async (ctx) => {
  ctx.body = {
    message: "Hello!",
  }
})

module.exports = router
