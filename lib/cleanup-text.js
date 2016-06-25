'use strict'

const normalizeWhitespace = require('normalize-html-whitespace')

module.exports = function cleanupText (text) {
  text = text.replace(/\n/g, ' ')
  text = normalizeWhitespace(text)
  text = text.trim()

  return text
}
