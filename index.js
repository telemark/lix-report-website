'use strict'

const http = require('http')
const lix = require('lix')
const xlsx = require('xlsx-writestream')
const smtaStream = require('sitemap-to-array').stream
const config = require('./config')
const xrayPage = require('./lib/xray-page')
const repackContent = require('./lib/repack-content')
var pages = []
var measures = []

function measurePages (pages) {
  var list = JSON.parse(JSON.stringify(pages))

  function next () {
    if (list.length > 0) {
      const page = list.pop()
      if (page) {
        console.log(list.length + ' pages remaining.')
        xrayPage(page, function (error, data) {
          if (error) {
            console.error(error)
          } else {
            var pageData = repackContent(data)
            pageData.url = page
            pageData.lix = lix(pageData.content)
            measures.push({
              url: pageData.url,
              title: pageData.title,
              lix: pageData.lix
            })
            next()
          }
        })
      } else {
        next()
      }
    } else {
      console.log('Finished measuring')
      xlsx.write(config.REPORT_FILE_PATH, measures, function (error) {
        if (error) {
          console.error(error)
        } else {
          console.log('Finished writing file')
        }
      })
    }
  }

  next()
}

smtaStream.on('data', function (data) {
  var json = JSON.parse(data.toString())
  pages.push(json.loc)
})

smtaStream.on('end', function () {
  console.log('Finished collecting pages')
  measurePages(pages)
})

http.get(config.SITEMAP_URL, function (response) {
  response
    .pipe(smtaStream)
})
