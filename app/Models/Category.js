'use strict'

const Base = use('App/Model/Base')

class Category extends Base {

  static get table () {
    return 'categories'
  }
}

module.exports = Category
