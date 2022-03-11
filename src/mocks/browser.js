// src/mocks/browser.js
import { setupWorker } from 'msw'
import handlers from './handlers'
import app from './app.mock'
import auth from './authentication_mock'
// This configures a Service Worker with the given request handlers.
const worker = setupWorker(...handlers, ...app, ...auth)
export default worker
