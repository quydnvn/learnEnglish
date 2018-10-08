'use strict'

const Antl = use('Antl')
const NE = use('node-exceptions')

class NotFoundException extends NE.LogicalException {

  static failed (name) {
    return new this(Antl.formatMessage('common.errors.not_found', { name: name ? Antl.get(name) : '' }), 404)
  }

}

module.exports = NotFoundException
