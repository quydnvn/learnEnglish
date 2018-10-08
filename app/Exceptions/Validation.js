'use strict'

const Antl = use('Antl')
const NE = use('node-exceptions')

class ValidationException extends NE.LogicalException {

  static failed (message, status = 400) {
    return new this(Antl.get(message), status)
  }

}

module.exports = ValidationException
