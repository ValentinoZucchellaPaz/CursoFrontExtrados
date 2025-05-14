import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.js'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement as HTMLElement).render(
  // <StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
  // </StrictMode>,
)
