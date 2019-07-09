import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { createCategory } from './apiAdmin';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // destructure user and token from local storage
  const { user, token } = isAuthenticated();

  const handleChange = e => {
    setError('');
    setName(e.target.value);
  };

  const clickSubmit = async event => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    // make request to api to create category
    try {
      await createCategory(user._id, token, { name });
      setError('');
      setSuccess(true);

    } catch (err) {
      setError(err);
    }
  };

  const newCategoryForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          autoFocus
        />
      </div>
      <button onClick={clickSubmit} className="btn btn-outline-primary" on>Create Category</button>
    </form>
  );

  const showSuccess = () => {
    if (success) {
      return <h3 className="text-success">{name} created successfully!</h3>
    }
  };

  const showError = () => {
    if (error) {
      return <h3 className="text-danger">Category must be unique!</h3>
    }
  };

  const goBack = () => (
    <div className="mt-5">
      <Link to="/admin/dashboard" className="text-warning">Back to Dashboard</Link>
    </div>
  );

  return (
    <Layout
      title="Add a new category"
      description={`Ready to add a new category`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showSuccess()}
          {showError()}
          {newCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
