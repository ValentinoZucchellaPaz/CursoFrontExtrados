import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Footer } from './components/Footer'
import NavBar from './components/NavBar/NavBar'
import NotFound from './components/NotFound/NotFound'

const links = [
  { url: "/", title: "Home", external: false },
  { url: "/contacts", title: "Contacts", external: false },
  { url: "/mongo", title: "Mondongo", external: false },
  { url: "https://www.linkedin.com/in/valentino-zucchella-paz-7230b0243", title: "Linkedn", external: true },
]

function App() {

  return (
    <>
      <header className='header-main'>
        <NavBar links={links} />
      </header>

      <Routes>
        <Route path="/" element={<p>buen dia grupo</p>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
