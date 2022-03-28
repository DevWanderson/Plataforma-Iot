import React, { useContext } from 'react'
import { AuthContext } from '../../Components/Context/contextAuth';




import RoutersAuth from './routersAuth';
import AppRouter from './appRouter';
import Load from '../../Components/Loading';



function Router() {

    const { signed, loading } = useContext(AuthContext)

    if(loading){
      return <Load/>
    }

    return  signed ? <AppRouter /> : <RoutersAuth />
  
}

export default Router;