import React, { useContext, useEffect, useState } from 'react'
import { SettingsContext } from '../settings'
import { Gig } from '../types'
import GigsList from '../components/GigsList'

function Home () {
  const settings = useContext(SettingsContext)
  const [loading, setLoading] = useState(true)
  const [gigs, setGigs] = useState<Gig[]>([])
  const [error, setError] = useState<Error>()

  useEffect(() => {
    (async () => {
      try {
        let url = `${settings.apiBaseUrl}/gigs`
        if (!settings.apiBaseUrl) {
          console.warn('Running in MOCK mode (using mock data)')
          url = `${window.location.origin}/mock/gigs.json`
        }
        const response = await fetch(url, { mode: 'cors' })
        const loadedGigs = (await response.json()) as Gig[]
        setLoading(false)
        setGigs(loadedGigs)
      } catch (err) {
        setLoading(false)
        setError(err as Error)
      }
    })()
  }, [])

  if (loading) {
    return <div style={{ textAlign: 'center' }}>Loading...</div>
  }

  if (error) {
    return <div style={{ color: 'red' }}><pre>{JSON.stringify(error)}</pre></div>
  }

  return <GigsList gigs={gigs} />
}

export default Home
