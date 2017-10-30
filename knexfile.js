const path = require('path')

const BASE_PATH = path.join(__dirname, 'backend', 'database')

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://postgres:postgres@localhost:5432/linr_db_test',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
  development: {
    client: 'pg',
    connection: 'postgres://postgres:postgres@localhost:5432/linr_db',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
}
