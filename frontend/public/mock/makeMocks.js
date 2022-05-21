// Convenience script that creates a file for every single entry in gigs.json
const path = require('path')
const { writeFileSync } = require('fs')
const gigs = require('./gigs.json')

for (const gig of gigs) {
  const filename = path.join(__dirname, 'gigs', `${gig.id}.json`)
  writeFileSync(filename, JSON.stringify(gig, null, 2))
}
