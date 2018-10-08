'use strict'

const Antl = use('Antl')
const NE = use('node-exceptions')

class ApplicationException extends NE.LogicalException {

  static failed (message, status = 400, errors = {}) {
    return new this({
      message: Antl.get(message),
      errors: errors
    }, status)
  }

}

module.exports = ApplicationException
