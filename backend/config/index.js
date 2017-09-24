const path = require("path")

const version = require("../../package.json").version
const root = path.dirname(__dirname)

const config = {
  env: process.env.NODE_ENV || "production",
  version: version,
  webPort: 3000,
  bindingHost: "127.0.0.1",
  debug: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test",
  logdir: path.join(root, "logs"),
  enableCompress: false,
}

module.exports = config
