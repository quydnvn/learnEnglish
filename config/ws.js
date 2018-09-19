'use strict'

const Env = use('Env')

module.exports = {

  useHttpServer: true,

  // @refer https://github.com/charlieduong94/uws-vs-ws-benchmark
  useUws: Env.get('WS_FORCE_UWS', false)

}
