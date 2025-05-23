import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './components/App'
import store from './store/store'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/style.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
