// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock fetch instead of importing node-fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
)

// Polyfill for URL
const { URL, URLSearchParams } = require('url')
global.URL = URL
global.URLSearchParams = URLSearchParams