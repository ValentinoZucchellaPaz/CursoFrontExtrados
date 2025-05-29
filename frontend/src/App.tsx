import './App.css'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { MainLayout } from './layouts/MainLayout'
import { AppRoutes } from './routes/AppRoutes'
import { links } from './utils/navLinks'

function App() {

  return (
    <>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </>
  )
}

export default App
