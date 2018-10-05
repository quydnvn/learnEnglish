'use strict'

const co = use('co')
const _ = use('lodash')
const metrohash64 = require('metrohash').metrohash64

const Lucid = use('Lucid')
const StorageService = make('App/Services/Storage')

class Base extends Lucid {

  get $dirty () {
    return _.pickBy(this.attributes, (value, key) => {
      return (typeof (this.original[key]) === 'undefined' || !_.isEqual(this.original[key], value)) && !key.startsWith('_pivot_')
    })
  }

  static boot () {
    super.boot()

    this.use('App/Model/Traits/Orderable')
  }

  static bootIfNotBooted () {
    if (this.name !== 'Base') {
      super.bootIfNotBooted()
    }
  }

  static newInstance (attrs) {
    return new this(attrs)
  }

  static get dateFormat () {
    return 'X'
  }

  static _generateHash (str) {
    return metrohash64(`${str}`)
  }

  static genenatePath (prefix) {
    const current = new Date()
    const name = this._generateHash(current.getMilliseconds())

    return [
      this._generateHash(prefix),
      this._generateHash(current.getFullYear()),
      this._generateHash(current.getMonth()),
      name, // this name is used for grouping image's sizes
      name
    ].join('/')
  }

  getPublicUrl (path) {
    return path ? StorageService.getHttpsUrl(path, false) : null
  }

  getSignedUrl (path, options) {
    (typeof options === 'object') || (options = {})
    options.Key = path

    return StorageService.getSignedUrl('getObject', options)
  }

  getId (id) {
    return parseInt(id)
  }

  getCreateTimestamp (date) {
    return parseInt(date)
  }

  getUpdateTimestamp (date) {
    return parseInt(date)
  }

  getDeleteTimestamp (date) {
    return parseInt(date)
  }

  async save (...args) {
    return await co(super.save(...args))
      .catch(e => {
        throw e
      })
  }

  async fresh (...args) {
    return await co(super.fresh(...args))
      .catch(e => {
        throw e
      })
  }

  async first (...args) {
    return await co(super.first(...args))
      .catch(e => {
        throw e
      })
  }

  async delete (...args) {
    return await co(super.delete(...args))
  }

}

module.exports = Base
