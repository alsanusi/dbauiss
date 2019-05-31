module.exports = MiddlewareBase => class Range extends MiddlewareBase {
  description () {
    return 'Support for HTTP Range Requests.'
  }
  
  middleware () {
    return require('koa-range')
  }
}
