const Koa = require("koa")
const bodyParser = require('koa-bodyparser');
const logging = require("koa-logger")


const routes = require("./routes")
const config = require("./config")
const init = require("./common/init.js")

const app = new Koa()

init(app)
app.use(logging())
app.use(bodyParser());
app.use(routes.routes())
app.use(routes.allowedMethods())

const server = app.listen(config.webPort, () => {
  logger.info("listening on port %s, the env is %s", config.webPort, config.env)
  logger.debug("You can debug your app with http://127.0.0.1:%s", config.webPort)
})


module.exports = server
