import React, { useState } from 'react';
import styles from './login.module.css';
const Login = ({ onSignUp, onLogin }) => {
  const [signup, setSignup] = useState(false);
  const [nickname, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sex, setSex] = useState('');
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [dept, setDept] = useState('');
  const [sno, setSno] = useState('');
  const [isAlert, setIsAlert] = useState(false);

  const onChange = (event) => {
    const {
      target: { name, value, checked },
    } = event;
    switch (name) {
      case 'nickname':
        return setUsername(value);
      case 'password':
        return setPassword(value);
      case 'sex':
        return setSex(value);
      case 'email':
        return setEmail(value);
      case 'university':
        return setUniversity(value);
      case 'dept':
        return setDept(value);
      case 'signup':
        return setSignup(checked);
      default:
    }
  };

  return (
    <section className={styles.container}>
      <form className={styles.authForm}>
        <input
          name='nickname'
          type='text'
          placeholder='Id'
          value={nickname}
          className='form-input'
          required
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          value={password}
          className='form-input'
        />
        {signup && (
          <input
            name='name'
            type='text'
            placeholder='Name'
            className='form-input'
            required
          />
        )}
        {signup && (
          <input
            name='email'
            type='email'
            placeholder='Email'
            value={email}
            className='form-input'
            required
          />
        )}
        {signup && (
          <input
            name='url'
            type='url'
            placeholder='Profile Image URL'
            className='form-input'
          />
        )}
        <div className='form-signup'>
          <input name='signup' id='signup' type='checkbox' checked={signup} />
          <label htmlFor='signup'> Create a new account?</label>
        </div>
        <button className='form-btn auth-form-btn' type='submit'>
          {signup ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
    </section>
  );
};

export default Login;
