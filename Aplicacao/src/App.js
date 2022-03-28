import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';


import Routers from '../src/Pages/Routers';
// import Header from '../src/Components/Header';
// import PathBar from '../src/Components/PathBar'
import store from './store'
// import Combo from '../src/Components/SelectDeviceCombo';
// import Auth from './WSO2/Auth';
import AuthProvider from './Components/Context/contextAuth';
// import Load from './Components/Loading';



function App() {
  return (
    //  <Auth>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Routers />

        </AuthProvider>
      </BrowserRouter>
    </Provider>
    //  </Auth>
  );
}

export default App


