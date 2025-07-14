import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const fazFetch = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/movies/searchall?title=Mat')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  return (
    <>
      <p>
        <button onClick={fazFetch}>Faz Fetch</button>
      </p>
    </>
  )
}

export default App
