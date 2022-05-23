import React from 'react'

type Settings = {
  apiBaseUrl: string,
  mock: boolean,
}

export const defaultSettings : Settings = {
  apiBaseUrl: window.location.origin,
  mock: true
}

export const SettingsContext = React.createContext<Settings>(defaultSettings)
