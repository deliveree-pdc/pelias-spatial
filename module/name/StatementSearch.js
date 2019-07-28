const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementSearch extends SqliteStatement {
  // rewrite query for prefix search
  _selectStatement (params) {
    // trim text
    params.text = (params.text || '').trim()

    // add postfix wildcard
    if (params.prefix === true && !!params.text.length) {
      params.text += '%'
      delete params.prefix
    }

    return this.statement
  }
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT source, id, name
        FROM ${dbname}.name
        WHERE name LIKE @text
        GROUP BY source, id
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
}

module.exports = StatementSearch
