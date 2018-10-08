'use strict'

const co = use('co')
const ms = use('ms')
const CatLog = use('cat-log')

// const Redis = use('Redis')
const Database = use('Database')
const NotFoundException = use('App/Exceptions/NotFound')
const UnexpectedException = use('App/Exceptions/Unexpected')

class BaseRepository {

  constructor () {
    this._useCache = true
    this._criteria = null

    this.logger = new CatLog(this.name)
    this.forcePagination = false
    this.defaultOrder = '-updated_at'
  }

  /**
   * Cache helpers
   */
  skipCache () {
    this._useCache = false
  }

  /**
   * Criteria helpers
   */
  pushCriteria (criteria) {
    if (!this._criteria) {
      this._criteria = []
    }

    this._criteria.push(criteria)

    return this
  }

  applyCriteria () {
    if (this._criteria) {
      for (let c of this._criteria) {
        c.apply(this.model, this)
      }
    }
  }

  /**
   * Cache
   */
  getCacheKey (...args) {
    args.unshift(this.model.name.toLowerCase())

    return args.join(':')
  }

  getCacheLifetime () {
    return ms('30m')
  }

  getThreadExternalId (botId, externalId) {
    return `${botId}$${externalId}`
  }

  async list (payload, columns = '*') {
    if (payload.page && payload.page > 0) {
      return await this.paginate(payload, columns)
    }

    return await this.all(payload, columns)
  }

  async all (payload, columns = '*') {
    const tableName = this.model.table
    const builder = this.model.query()
      .select(columns)
      .performOrder(`-${tableName}.updated_at`, payload.order)

    const searchableFields = this.getSearchableFields()

    if (payload.search && typeof searchableFields === 'object') {
      const keys = Object.keys(searchableFields)

      if (keys.length === 1) {
        builder.where(
          keys[0],
          searchableFields[keys[0]] || '=',
          searchableFields[keys[0]] === 'ilike' ? `%${payload.search}%` : payload.search
        )
      }

      if (keys.length > 1) {
        builder.where(function () {
          for (let i of keys.keys()) {
            if (i === 0) {
              this.where(
                Database.raw(keys[i]),
                searchableFields[keys[0]] || '=',
                searchableFields[keys[0]] === 'ilike' ? `%${payload.search}%` : payload.search
              )
            } else {
              this.orWhere(
                Database.raw(keys[i]),
                searchableFields[keys[0]] || '=',
                searchableFields[keys[0]] === 'ilike' ? `%${payload.search}%` : payload.search
              )
            }
          }
        })
      }
    }

    if(payload.leftJoin) {
      builder.leftJoin(payload.leftJoin.foreignTable, payload.leftJoin.primaryKey, payload.leftJoin.foreignKey)
    }

    if (payload.filters instanceof Array) {
      for (let g of payload.filters) {
        if (g.constructor.name === 'Raw') {
          builder.whereRaw(g)
        } else {
          builder.where(g[0], g[2] ? g[1] : '=', g[2] ? g[2] : g[1])
        }
      }
    }

    const result = await co(builder.fetch())

    return { data: result }
  }

  async paginate (payload, columns = '*') {
    const tableName = this.model.table
    const builder = this.model.query()
      .performOrder(`-${tableName}.updated_at`, payload.order)

    const searchableFields = this.getSearchableFields()

    if (payload.search && typeof searchableFields === 'object') {
      const keys = Object.keys(searchableFields)

      if (keys.length === 1) {
        builder.where(
          keys[0],
          searchableFields[keys[0]] || '=',
          searchableFields[keys[0]] === 'ilike' ? `%${payload.search}%` : payload.search
        )
      }

      if (keys.length > 1) {
        builder.where(function () {
          for (let i of keys.keys()) {
            if (i === 0) {
              this.where(
                Database.raw(keys[i]),
                searchableFields[keys[0]] || '=',
                searchableFields[keys[0]] === 'ilike' ? `%${payload.search}%` : payload.search
              )
            } else {
              this.orWhere(
                Database.raw(keys[i]),
                searchableFields[keys[0]] || '=',
                searchableFields[keys[0]] === 'ilike' ? `%${payload.search}%` : payload.search
              )
            }
          }
        })
      }
    }

    if (payload.leftJoin) {
      builder.leftJoin(payload.leftJoin.foreignTable, payload.leftJoin.primaryKey, payload.leftJoin.foreignKey)
    }

    if (payload.filters instanceof Array) {
      for (let g of payload.filters) {
        if (g.constructor.name === 'Raw') {
          builder.whereRaw(g)
        } else {
          builder.where(g[0], g[2] ? g[1] : '=', g[2] ? g[2] : g[1])
        }
      }
    }

    const paginationClause = builder.clone()
      .select(Database.raw('COUNT(*) AS total'))

    if (builder.HostModel && builder.HostModel.deleteTimestamp) {
      paginationClause.whereNull(builder.HostModel.deleteTimestamp)
    }

    if (payload.includes) {
      builder.with(Object.keys(payload.includes))

      for (let icd in payload.includes) {
        builder.scope(icd, (builder) => {
          if (payload.includes[icd].select) {
            builder.select(payload.includes[icd].select)
          }
        })
      }
    }

    return await co(builder
      .select(columns)
      .paginate(
        payload.page && payload.page > 0 ? payload.page : 1,
        (payload.limit > 0 && payload.limit <= 50) ? payload.limit : 50,
        paginationClause
      ))
  }

  async find (id, columns = '*') {
    return await this.findBy('id', id, columns)
  }

  async findBy (key, value, columns = '*') {
    return await co(this.model.query()
      .select(columns)
      .where(key, value)
      .first())
  }

  async findOrFail (id, columns = '*') {
    return await this.findByOrFail('id', id, columns)
  }

  async findByOrFail (key, value, columns = '*') {
    const result = await this.findBy(key, value, columns)

    return result || this.notFound()
  }

  async findByUser (userId, objectId, columns = '*') {
    await this.validator.validateParams('find', { object_id: objectId }, this.notFound.bind(this))

    const object = await this.findByOrFail('id', objectId, columns)

    return (object.user_id === userId) ? object : this.notFound()
  }

  async findWhere (conditions = [], columns = '*') {
    const builder = this.model.query()
      .select(columns)

    if (conditions instanceof Array) {
      for (let g of conditions) {
        builder.where(g[0], g[2] ? g[1] : '=', g[2] ? g[2] : g[1])
      }
    }

    const result = await co(builder.first())

    if (!result) {
      throw this.notFound()
    }

    return result
  }

  async store (data, trx) {
    const instance = data instanceof this.model ? data : this.model.newInstance(data)

    if (trx) {
      instance.useTransaction(trx)
    }

    await instance.save()

    if (trx) {
      return instance
    } else {
      return await instance.fresh()
    }
  }

  async update (instance, data, trx) {
    if (trx) {
      instance.useTransaction(trx)
    }

    if (data) {
      instance.setJSON(data)
    }

    await co(instance.save())

    return instance
  }

  notFound (name) {
    throw NotFoundException.failed(name || `model.${this.model.name.toLowerCase()}`)
  }

  unexpectedError () {
    throw UnexpectedException.failed()
  }

  async getObjectsListByCursor (data = {}, options = {}) {
    const afterId = parseInt(data.after)
    const beforeId = parseInt(data.before)

    let limit = parseInt(data.limit)

    if (!limit || limit < 0 || limit > 50) {
      limit = 50
    }

    let order = 'DESC'
    let direction = '<'
    let objectId = beforeId

    if (afterId > 0) {
      order = 'ASC'
      direction = '>'
      objectId = afterId
    }

    const rows = await this.paginateByCursor(objectId, direction, order, limit + 1, options)

    if (rows.size() > limit) {
      const data = rows.dropRight()

      if (afterId) {
        return {
          data: data.value(),
          has_next: true
        }
      }

      return {
        data: data.sortBy('id').value(),
        has_prev: true
      }
    }

    if (afterId) {
      return {
        data: rows.value(),
        has_next: false
      }
    }

    return {
      data: rows.sortBy('id').value(),
      has_prev: false
    }
  }

  async paginateAfterCursor (afterId, limit, filters) {
    const builder = this.model.query()
      .where('id', '>', afterId)
      .orderBy('id')
      .limit(limit)

    if (filters instanceof Array) {
      for (let g of filters) {
        builder.where(g[0], g[2] ? g[1] : '=', g[2] ? g[2] : g[1])
      }
    }

    return await co(builder.fetch())
  }

  async paginateBeforeCursor (beforeId, limit, filters) {
    const builder = this.model.query()
      .where('id', '<', beforeId)
      .orderBy('id', 'desc')
      .limit(limit)

    if (filters instanceof Array) {
      for (let g of filters) {
        builder.where(g[0], g[2] ? g[1] : '=', g[2] ? g[2] : g[1])
      }
    }

    return await co(
      this.model.query()
        .from(Database.raw(`(${builder}) AS messages`))
        .orderBy('id')
        .fetch()
    )
  }

  async paginateByCursor (objectId, direction, order, limit, options) {
    const builder = this.model
      .query()
      .limit(limit)
      .orderBy('id', order)

    if (objectId) {
      builder.where('id', direction, objectId)
    }

    if (options.filters instanceof Array) {
      for (let g of options.filters) {
        builder.where(g[0], g[2] ? g[1] : '=', g[2] ? g[2] : g[1])
      }
    }

    if (options.with) {
      builder.with(options.with)
    }

    return await co(builder.fetch())
  }

}

module.exports = BaseRepository
