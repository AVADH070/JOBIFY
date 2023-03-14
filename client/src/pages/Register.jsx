import React from 'react'
import { useState, useEffect } from 'react';
import { FormRow, Logo, Alert } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { useGlobleContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom'

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

const Register = () => {

  const [values, setValues] = useState(initialState);
  const { user, isLoading, showAlert, displayAlert, registerUser, loginUser } = useGlobleContext()

  const navigate = useNavigate();



  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember })
  }


  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!values.isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = { email, password, name };


    if (isMember) {
      loginUser(currentUser)
    } else {
      registerUser(currentUser)
    }

  }

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/')
      }, 3000);
    }
  }, [user, navigate])

  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <Logo />
        {showAlert && <Alert />}
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        {
          !values.isMember && (
            <FormRow
              name='name'
              type='text'
              handleChange={handleChange}
              value={values.name}
            />
          )
        }

        <FormRow
          name='email'
          type='email'
          handleChange={handleChange}
          value={values.email}
        />
        <FormRow
          name='password'
          type='password'
          handleChange={handleChange}
          value={values.password}
        />

        <button type='submit' className='btn btn-block' disabled={isLoading}>
          submit
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}

          <button type='button' onClick={toggleMember} className='member-btn'>
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}

export default Register

        // ===========================================================
        // const formData = new FormData();
        // formData.set('name', name)
        // formData.set('email', email)
        // formData.set('password', password)

        // const formDataObj = {};

        // formData.forEach(function (value, key) {
        //     formDataObj[key] = value;
        // });

        // console.log(formDataObj)
        // ===========================================================