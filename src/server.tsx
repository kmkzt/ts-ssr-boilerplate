import React from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import { StaticRouter } from 'react-router-dom'
import App from './app'

export function startServer() {
  const app = express()
  const port = process.env.PORT || 3000

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  // compression
  app.use(compression({ level: 5 }))

  // DEVELOPMENT CLIENT APP
  if (process.env.NODE_ENV !== 'production') {
    const webpack: typeof import('webpack') = require('webpack')
    const webpackHotMiddleware: typeof import('webpack-hot-middleware') = require('webpack-hot-middleware')
    const webpackDevMiddleware: typeof import('webpack-dev-middleware') = require('webpack-dev-middleware')
    const config: import('webpack').Configuration = require('../webpack.config')
    const compiler = webpack(config)
    app.use(webpackHotMiddleware(compiler))
    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: (config.output && config.output.publicPath) || '',
        writeToDisk: true
      })
    )
  }

  // Routing
  app.use('/public', express.static('dist'))
  app.get('*', (req, res) => {
    const ServerApp = () => (
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    )
    // TODO: replace renderToNodeStream
    const contents = renderToString(<ServerApp />)
    // TODO: replce manifest.json when development
    const manifest =
      process.env.NODE_ENV === 'production'
        ? require('./dist/manifest.json')
        : require('../dist/manifest.json')

    res.send(`<!DOCTYPE html>
      <html lang="en">
        <head>
        </head>
        <body>
        <div id="app">
          ${contents}
        </div>
        <script src="${manifest['client.js']}"></script>
        </body>
      </html>
    `)
  })

  const server = createServer(app)

  server.listen(port, () => {
    console.log(`Listening on ${port}`)
  })
}

startServer()
