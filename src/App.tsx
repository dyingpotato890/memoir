import './App.css'
import LandingPage from './pages/landing/landing'
import { Analytics } from "@vercel/analytics/react"

function App() {

  return (
    <>
      <Analytics/>
      <LandingPage/>
    </>
  )
}

export default App
