import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.js'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import '@fontsource/inter'
import { CssVarsProvider } from '@mui/joy';
import { ThemeSyncer } from './components/ThemeSyncer';

const rootElement = document.getElementById('root')

// tema oscuro css
const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute("data-theme", userPrefersDark ? "dark" : "light");

ReactDOM.createRoot(rootElement as HTMLElement).render(
  // <StrictMode>

  <BrowserRouter>
    <Provider store={store}>
      <CssVarsProvider defaultColorScheme={'dark'}>
        <ThemeSyncer>
          <App />
        </ThemeSyncer>
      </CssVarsProvider>
    </Provider>
  </BrowserRouter>
  // </StrictMode>,
)
