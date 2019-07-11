import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import Home from './core/Home';
import Signup from './user/Signup';
import Login from './user/Login';
import Dashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/signup' exact component={Signup} />
        <Route path='/login' exact component={Login} />
        <PrivateRoute
          path="/user/dashboard"
          exact
          component={Dashboard}
        />
        <AdminRoute
          path="/admin/dashboard"
          exact
          component={AdminDashboard}
        />
        <AdminRoute
          path="/create/category"
          exact
          component={AddCategory}
        />
        <AdminRoute
          path="/create/product"
          exact
          component={AddProduct}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
