const utils = require('utility')
const Logger = require('egg-logger').Logger
const FileTransport = require('egg-logger').FileTransport
const ConsoleTransport = require('egg-logger').ConsoleTransport

const config = require('../config')

const logger = new Logger()

function fileFormatter (meta) {
  return meta.date + ' ' + meta.level + ' ' + meta.pid + ' ' + meta.message
}

logger.set('file.info', new FileTransport({
  file: 'logs/info.' + utils.YYYYMMDD() + '.log',
  level: 'INFO',
  formatter: fileFormatter,
}))

logger.set('file.error', new FileTransport({
  file: 'logs/error.' + utils.YYYYMMDD() + '.log',
  level: 'ERROR',
  formatter: fileFormatter,
}))

logger.set('console', new ConsoleTransport({
  level: config.debug ? 'ALL' : 'INFO',
}))

module.exports = function () {
  global.logger = logger
}
