// src/mocks/browser.js
import { setupWorker } from 'msw'
import handlers from './handlers'
import app from './app.mock'
// This configures a Service Worker with the given request handlers.
const worker = setupWorker(...handlers, ...app)
export default worker
