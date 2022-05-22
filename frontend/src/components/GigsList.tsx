import React from 'react'
import { Gig } from '../types'
import GigCard from './GigCard'

function GigsList (props: { gigs: Gig[] }) {
  const { gigs } = props

  return <div className="container">
    <div>
      <div>
        <div className="content">
          <h3>There are {gigs.length} gigs currently available</h3>
        </div>
      </div>

      <div className="columns is-multiline">
        {gigs.map(gig => (
          <div key={gig.id} className="column is-one-third">
            <GigCard gig={gig} />
          </div>
        ))}
      </div>
    </div>
  </div>
}

export default GigsList
