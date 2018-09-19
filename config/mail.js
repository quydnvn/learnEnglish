'use strict'

const Helpers = use('Helpers')
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Driver
  |--------------------------------------------------------------------------
  |
  | driver defines the default driver to be used for sending emails. Adonis
  | has support for 'mandrill', 'mailgun', 'smtp', 'ses' and 'log' driver.
  |
  */
  driver: Env.get('MAIL_DRIVER', 'smtp'),

  /*
  |--------------------------------------------------------------------------
  | SMTP
  |--------------------------------------------------------------------------
  |
  | Here we define configuration for sending emails via SMTP.
  |
  */
  smtp: {
    pool: true,
    port: Env.get('MAIL_PORT', 2525),
    host: Env.get('MAIL_HOST'),
    secure: true,
    auth: {
      user: Env.get('MAIL_USERNAME'),
      pass: Env.get('MAIL_PASSWORD')
    },
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 10
  }
}
