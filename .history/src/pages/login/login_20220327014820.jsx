import React, { useState } from 'react';
import styles from './login.module.css';
const Login = ({ onSignUp, onLogin }) => {
  const [signup, setSignup] = useState(false);
  const [nickname, setUsername] = useState('');
  const [loginId, setLoginId] = useState('');
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
      case 'loginId':
        return setLoginId(value);
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
      case 'sno':
        return setSno(value);
      case 'signup':
        return setSignup(checked);
      default:
    }
  };

  return (
    <section className={styles.container}>
      <form className={styles.authForm}>
        <input
          name='loginId'
          type='text'
          placeholder='Id'
          value={loginId}
          className='form-input'
          onChange={onChange}
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
            name='nickname'
            type='text'
            placeholder='닉네임'
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
          <div className={styles.gender__container}>
            <div className={styles.gender__group}>
              <input type='radio' name='sex' id='male' className='form-input' />
              <label htmlFor='male'> 남자</label>
            </div>
          </div>
        )}
        <div className='form-signup'>
          <input
            name='signup'
            id='signup'
            type='checkbox'
            onChange={onChange}
            checked={signup}
          />
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
