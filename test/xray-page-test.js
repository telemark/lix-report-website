'use strict'

const fs = require('fs')
const tap = require('tap')
const xrayPage = require('../lib/xray-page')

tap.test('requires input', function (test) {
  const expectedErrorMessage = 'Missing required input'
  const inputData = false

  xrayPage(inputData, function (error, data) {
    tap.equal(error.message, expectedErrorMessage, expectedErrorMessage)
    test.done()
  })
})

tap.test('returns expected data', function (test) {
  const expectedData = require('./data/xray.data.json')
  const rawData = fs.readFileSync('test/data/data.html')

  xrayPage(rawData, function (error, data) {
    if (error) {
      throw error
    }
    tap.equal(JSON.stringify(data, null, 2), JSON.stringify(expectedData, null, 2), 'Expected data, OK')
    test.done()
  })
})

tap.test('returns error for nonexisting urls', function (test) {
  const nonExistentUrl = 'https://this.does.not.exist.hallibutrullensnurf.io'

  xrayPage(nonExistentUrl, function (error, data) {
    tap.ok(error, 'Expected error, OK')
    test.done()
  })
})
