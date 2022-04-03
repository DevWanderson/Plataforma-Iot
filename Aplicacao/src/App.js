import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Routes from './routes';


import Routers from '../src/Pages/Routers';
import store from './Store';
import AuthProvider from './Components/Context/contextAuth';



function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
            <Routers />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App


