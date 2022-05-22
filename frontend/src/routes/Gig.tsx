import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import BuyTicketForm from '../components/BuyTicketForm'
import { SettingsContext } from '../settings'
import { Gig } from '../types'

function mapUrl (address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

function GigPage () {
  const params = useParams()
  const settings = useContext(SettingsContext)
  const [loading, setLoading] = useState(true)
  const [gig, setGig] = useState<Gig>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    (async () => {
      try {
        let url = `${settings.apiBaseUrl}/gigs/${params.id}`
        if (settings.mock) {
          console.warn('USING MOCK DATA, configure your apiBaseUrl')
          url = `${settings.apiBaseUrl}/mock/gigs/${params.id}.json`
        }
        const response = await fetch(url)
        const loadedGig = (await response.json()) as Gig
        setLoading(false)
        setGig(loadedGig)
      } catch (err) {
        setLoading(false)
        setError(err as Error)
      }
    })()
  }, [params])

  if (loading) {
    return <div style={{ textAlign: 'center' }}>Loading...</div>
  }

  if (error) {
    return <div style={{ color: 'red' }}><pre>{JSON.stringify(error)}</pre></div>
  }

  if (gig) {
    return (
      <div className="container">
        <div v-if="gig">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><Link to="/">Gigs</Link></li>
              <li className="is-active">
                <Link to={`/gig/${gig.id}`}>{gig.bandName} ({gig.year})</Link>
              </li>
            </ul>
          </nav>
          <section className="section" style={{ border: '1px solid #ccc' }}>
            <h1 className="title">
              {gig.bandName} ({gig.year})
            </h1>
            <div className="columns">
              <div className="column is-7">
                <div className="content">
                  <p>
                    <img src={`/images/${gig.image}`} alt={`${gig.bandName}'s picture`} />
                  </p>
                  <p>
                    {gig.description}
                  </p>
                </div>
              </div>
              <div className="column is-5">
                <div className="panel">
                  <p className="panel-heading">
                    {gig.city}
                  </p>
                  <div className="panel-block">
                    {gig.venue}
                  </div>
                  <div className="panel-block">
                    {gig.originalDate}
                  </div>
                  <div className="panel-block">
                    <strong>{gig.price} USD</strong>
                  </div>
                </div>
                <div className="panel">
                  <p className="panel-heading">
                    Time travel collection point
                  </p>
                  <div className="panel-block">
                    <a href={mapUrl(gig.collectionPoint)} target="_blank" rel="noreferrer">
                      <img src={`/images/${gig.collectionPointMap}`} alt="Collection point map" />
                    </a>
                  </div>
                  <div className="panel-block">
                    <a href={mapUrl(gig.collectionPoint)} target="_blank" rel="noreferrer">
                      {gig.collectionPoint}
                    </a>
                  </div>
                  <div className="panel-block">
                    {gig.date}, {gig.collectionTime}&nbsp;<small>Local time</small>
                  </div>
                </div>
                <a href="#buy" className="button is-outlined is-link">Buy ticket</a>
              </div>
            </div >
          </section >
          <hr />
          <section id="buy" className="section">
            <BuyTicketForm gig={gig} />
          </section>
        </div >
      </div >
    )
  }

  // This should not happen because we either have a gig or an error
  return <Fragment />
}

export default GigPage
