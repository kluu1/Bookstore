import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { API_URL } from '../config';
import axios from 'axios';

const Signup = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false
  });

  const { name, email, password, success, error } = values;

  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = async event => {
    event.preventDefault();
    try {
      await signup({ name, email, password });
      setValues({
        ...values,
        name: '',
        email: '',
        password: '',
        error: '',
        success: true
      });
    } catch (err) {
      setValues({
        ...values,
        error: err.response.data.error,
        success: false
      });
    }
  };

  const signup = user => {
    return axios({
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      url: `${API_URL}/signup`,
      data: JSON.stringify(user)
    });
  };

  const signUpForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
      </div>
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

  const showSuccess = () => (
    <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
      Your account has been created. <Link to="/login">Click here</Link> to login.
    </div>
  );

  return (
    <Layout
      title="Signup Page"
      description="Signup to Node React E-commerce App"
      className="container col-md-8 offset-md-2"
    >
      {showSuccess()}
      {showError()}
      {signUpForm()}
      {JSON.stringify(values)}
    </Layout>
  );
};

export default Signup;
