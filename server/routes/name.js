const util = require('./util')

module.exports = function (req, res) {
  var service = req.app.locals.service

  // inputs
  let query = {
    source: util.flatten(req.params.source),
    id: util.flatten(req.params.id),
    limit: 100
  }

  // perform query
  // console.time('took')
  let rows = service.module.name.statement.fetch.all(query)
  // console.timeEnd('took')

  // send json
  res.status(200).json(rows)
}

module.exports.multiple = function (req, res) {
  var service = req.app.locals.service
  let ids = req.query.ids || req.params.ids
  if (!ids) {
    res.status(400).json({ error: 'Missing required parameter: ids' })
    return
  }
  if (typeof ids === 'string') {
    ids = ids.split(',').map(id => id.trim())
  }
  let query = {
    source: util.flatten(req.params.source),
    lang: req.query.lang || req.params.lang || 'und',
    ids: JSON.stringify(ids),
    limit: parseInt(req.query.limit) || 100
  }
  let rows = service.module.name.statement.multipleFetch.all(query)
  res.status(200).json(rows)
}
