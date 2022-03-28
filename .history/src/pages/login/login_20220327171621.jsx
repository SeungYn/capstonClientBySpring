import React, { useState } from 'react';
import styles from './login.module.css';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

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
  const [showPassword, setShowPassword] = useState(false);
  console.log(sex);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
        <TextField
          name='loginId'
          required
          id='input-with-icon-textfield'
          label='loginId'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          variant='standard'
          defaultValue={loginId}
          onChange={onChange}
        />
        <TextField
          id='standard-adornment-password'
          type={values.showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={onChange}
          endAdornment={
            <InputAdornment position='start'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          value={password}
          className='form-input'
          onChange={onChange}
          required
        />
        {signup && (
          <input
            name='nickname'
            type='text'
            placeholder='닉네임'
            className='form-input'
            onChange={onChange}
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
            onChange={onChange}
            required
          />
        )}
        {signup && (
          <div className={styles.gender__container}>
            <div className={styles.gender__group}>
              <input
                type='radio'
                name='sex'
                id='male'
                value='male'
                className='form-input'
                onChange={onChange}
              />
              <label htmlFor='male'> 남자</label>
            </div>
            <div className={styles.gender__group}>
              <input
                type='radio'
                name='sex'
                id='female'
                className='form-input'
                value='female'
                onChange={onChange}
              />
              <label htmlFor='female'> 여자</label>
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
