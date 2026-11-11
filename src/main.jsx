import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from 'antd'
import Rotas from './routes/Rotas'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClintProvider client={QUERYCLIENT}>
    <App>
      <Rotas />
    </App>
    </QueryClintProvider>
  </StrictMode>,
)
