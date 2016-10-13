'use strict'

const tap = require('tap')
const cleanupText = require('../../lib/cleanup-text')

tap.test('returns expected data', function (test) {
  const inputFile = require('./../data/cleanup.data.json')
  const expectedData = inputFile.cleanedUpData
  const actualData = cleanupText(inputFile.rawData)

  tap.equal(expectedData, actualData, 'Expected data, OK')
  test.done()
})
