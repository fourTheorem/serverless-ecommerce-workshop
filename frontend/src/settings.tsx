import React, { useEffect, useState } from 'react'

type Settings = {
  apiBaseUrl?: string,
}

export const defaultSettings : Settings = {
  apiBaseUrl: undefined
}

export const SettingsContext = React.createContext<Settings>(defaultSettings)

type Props = {
  children: React.ReactNode
}

export default function SettingsProvider (props: Props) {
  const { children } = props

  const [initialized, setInitialized] = useState(false)
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  const settingsUrl = `${window.location.origin}/.well-known/settings.json`

  useEffect(() => {
    (async () => {
      const response = await fetch(settingsUrl)
      if (response.ok) {
        // the file does exist, override the default settings
        const settingsOverride = (await response.json()) as Settings
        setSettings(settingsOverride)
      } else {
        console.warn(`Couldn't load "${settingsUrl}", loading default settings`)
      }
      setInitialized(true)
    })()
  }, [])

  if (!initialized) {
    return <div>Loading ...</div>
  }

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}
