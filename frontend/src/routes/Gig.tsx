import { Fragment, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { SettingsContext } from "../settings"
import { Gig } from "../types"

function GigPage() {
  const params = useParams()
  const settings = useContext(SettingsContext)
  const [loading, setLoading] = useState(true)
  const [gig, setGig] = useState<Gig>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    (async () => {
      try {
        let url = `${settings.apiBaseUrl}/gigs/${params.id}`
        if (!settings.apiBaseUrl) {
          console.warn('USING MOCK DATA, configure your apiBaseUrl')
          url = `http://localhost:3000/mock/gigs/${params.id}.json`
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
    return <div><pre>{JSON.stringify(gig, null, 2)}</pre></div>
  }

  return <Fragment />
}

export default GigPage