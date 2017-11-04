const onerror = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const logging = require('koa-logger')
const session = require('koa-session')
const passport = require('koa-passport')
const cors = require('koa2-cors')

const Logger = require('./logger.js')
const routes = require('../routes')
const Usuario = require('../database/queries/usuarios')

module.exports = app => {
  onerror(app)
  Logger()
  app.on('error', (err, ctx) => {
    logger.error(err)
  })

  app.use(logging())
  app.use(bodyParser())
  app.use(cors({credentials: true, origin: '*'}))

  // Setup session
  app.keys = ['VERY SECRET KEY GOES HERE EVENTUALLY']
  app.use(session(app))

  // Initialize passport
  configure_passport()
  app.use(passport.initialize())
  app.use(passport.session())

  // Mount routes
  app.use(routes.routes())
  app.use(routes.allowedMethods())
}

function configure_passport () {
  const LocalStrategy = require('passport-local').Strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'senha',
    },
    (email, password, done) => {
      Usuario.getSingleUsuarioCadastradoByEmail(email)
        .then(user => {
          if (email === user.email && password === user.password) {
            done(null, user)
          } else {
            done(null, false)
          }
        })
        .catch(err => done(err))
    }))
}
