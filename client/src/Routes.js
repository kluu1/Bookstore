import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './core/Home';
import Signup from './user/Signup';
import Login from './user/Login';
import PrivateRoute from './auth/PrivateRoutes';
import Dashboard from './user/UserDashboard';


const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/signup' exact component={Signup} />
        <Route path='/login' exact component={Login} />
        <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
