import Raven from 'raven-js'
Raven
  .config('https://0da70df78b6f428ea90d6c9373d557ec@sentry.io/1233980')
  .install();

export {Raven as logger}
