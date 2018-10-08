'use strict'

const Antl = use('Antl')
const NE = use('node-exceptions')

class UnexpectedException extends NE.LogicalException {

  static failed () {
    return new this(Antl.get('common.errors.unexpected'), 400)
  }

}

module.exports = UnexpectedException
