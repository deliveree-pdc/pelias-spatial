const _ = require('lodash')
const SqliteStatement = require('../../sqlite/SqliteStatement')

class StatementMultipleFetch extends SqliteStatement {
  create (db, config) {
    try {
      let dbname = _.get(config, 'database', 'main')
      this.statement = db.prepare(`
        SELECT id,lang, tag, abbr, name
        FROM ${dbname}.name
        WHERE source = @source
        AND lang = @lang
        AND id IN (
          select value from json_each(@ids)
        )
        LIMIT @limit
      `)
    } catch (e) {
      this.error('PREPARE STATEMENT', e)
    }
  }
  _transform (res) {
    if (!res || res.length === 0) {
      return { id: {} }
    }

    return res.reduce((acc, row) => {
      acc[row.id] = { id: row.id, tag: row.tag, names: { [row.lang]: row.name } }
      return acc
    }, {})
  }
}

module.exports = StatementMultipleFetch
