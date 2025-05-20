import './App.css'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { AppRoutes } from './routes/AppRoutes'
import { links } from './utils/navLinks'

function App() {

  return (
    <>
      <header className='header-main'>
        <Navbar links={links} />
      </header>
      <AppRoutes />
      <Footer />
    </>
  )
}

export default App
