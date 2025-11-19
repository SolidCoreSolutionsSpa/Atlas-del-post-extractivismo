import { createContext, useContext, useState, useEffect } from 'react'
import { atlasContent as staticAtlasContent } from './newAtlasContent'

const AtlasDataContext = createContext(null)

export function AtlasDataProvider({ children }) {
  const [atlasData, setAtlasData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAtlasData() {
      try {
        const response = await fetch('/api/atlas-data')

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setAtlasData(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching atlas data:', err)
        setError(err.message)
        // Fall back to static data in development or if API fails
        setAtlasData(staticAtlasContent)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAtlasData()
  }, [])

  const value = {
    atlasData,
    isLoading,
    error,
    // Provide direct access to common data sections
    hero: atlasData?.hero || null,
    affectationTypes: atlasData?.affectationTypes || [],
    tags: atlasData?.tags || [],
    caseOfStudies: atlasData?.caseOfStudies || [],
  }

  return (
    <AtlasDataContext.Provider value={value}>
      {children}
    </AtlasDataContext.Provider>
  )
}

export function useAtlasData() {
  const context = useContext(AtlasDataContext)

  if (context === null) {
    throw new Error('useAtlasData must be used within an AtlasDataProvider')
  }

  return context
}
