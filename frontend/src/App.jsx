import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        const sessionRes = await fetch('/api/session/', {
          method: 'POST',
          credentials: 'include',
        })
        if (!sessionRes.ok) {
          throw new Error(`Session request failed (${sessionRes.status})`)
        }
        const session = await sessionRes.json()

        const stateRes = await fetch('/api/state/', {
          credentials: 'include',
        })
        if (!stateRes.ok) {
          throw new Error(`State request failed (${stateRes.status})`)
        }
        const state = await stateRes.json()

        setData({ session, state })
      } catch (err) {
        setError(err?.message || 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  return (
    <main className="app">
      <h1>Session Cookie Test</h1>
      {loading && <p>Loading...</p>}
      {error && !loading && (
        <p className="error">Error: {error}</p>
      )}
      {!loading && !error && (
        <pre className="result">{JSON.stringify(data, null, 2)}</pre>
      )}
    </main>
  )
}

export default App
