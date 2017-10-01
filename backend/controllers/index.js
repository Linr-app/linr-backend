const Router = require("koa-router")

const router = new Router()


router.all("/", async (ctx) => {
  ctx.body = {
    message: (() => {
      const echo_str = ctx.request.query.echo
      if (echo_str === undefined) {
        return "hello!"
      }
      return echo_str.toUpperCase()
    })(),
  }
})

module.exports = router
