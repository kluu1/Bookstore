import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import { login, authenticate, isAuthenticated } from '../auth';

const Login = () => {
  const [values, setValues] = useState({
    email: 'joe@gmail.com',
    password: 'password123',
    error: '',
    loading: false,
    redirectToReferrer: false
  });

  const { email, password, error, loading, redirectToReferrer } = values;
  const { user } = isAuthenticated();

  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = async event => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    try {
      const user = await login({ email, password });
      authenticate(user.data, () => {
        setValues({
          ...values,
          redirectToReferrer: true
        });
      });
    } catch (err) {
      setValues({
        ...values,
        error: err.response.data.error,
        loading: false
      });
    }
  };

  const loginForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange('email')}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange('password')}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={clickSubmit} className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-info">
        <h2>Loading...</h2>
      </div>
    );

  const redirectUser = () => {
    if (redirectToReferrer) {
      if (user && user.role ===1) {
        return <Redirect to="/admin/dashboard" />
      } else {
        return <Redirect to="/user/dashboard" />
      }
    }
  };

  return (
    <Layout
      title="Login"
      description="Login to Node React E-commerce App"
      className="container col-md-8 offset-md-2"
    >
      {showLoading()}
      {showError()}
      {loginForm()}
      {redirectUser()}
    </Layout>
  );
};

export default Login;
