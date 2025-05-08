import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Footer } from './components/Footer'
import { Navbar } from './components/NavBar'
import { NotFound } from './pages/NotFound'
import { Posts } from './pages/Posts'
import { Home } from './pages/Home'

const links = [
  { url: "/", title: "Home", external: false },
  { url: "/contacts", title: "Contacts", external: false },
  { url: "/posts", title: "Posts", external: false },
  { url: "/mongo", title: "Mondongo", external: false },
  { url: "https://www.linkedin.com/in/valentino-zucchella-paz-7230b0243", title: "Linkedn", external: true },
]

function App() {

  return (
    <>
      <header className='header-main'>
        <Navbar links={links} />
      </header>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/posts' element={<Posts />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
