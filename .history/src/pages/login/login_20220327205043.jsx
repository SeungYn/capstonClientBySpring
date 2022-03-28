import React, { useState } from 'react';
import styles from './login.module.css';

import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';

const Login = ({ onSignUp, onLogin }) => {
  const [signup, setSignup] = useState(false);
  const [nickname, setNickname] = useState('');
  const [passwordVerification, setPasswordVerification] = useState('');
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
        return setNickname(value);
      case 'loginId':
        return setLoginId(value);
      case 'password':
        return setPassword(value);
      case 'passwordVerification':
        return setPasswordVerification(value);
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
        <TextField
          name='loginId'
          required
          id='standard-required'
          label='loginId'
          variant='standard'
          value={loginId}
          onChange={onChange}
          type='text'
          fullWidth
        />

        <TextField
          id='standard-password-input'
          name='password'
          value={password}
          label='password'
          onChange={onChange}
          variant='standard'
          type='password'
          fullWidth
          required
        />
        {signup && (
          <TextField
            name='passwordVerification'
            required
            label='passwordVerification'
            variant='standard'
            value={passwordVerification}
            onChange={onChange}
            fullWidth
          />
        )}
        {signup && (
          <TextField
            name='nickname'
            required
            label='닉네임'
            variant='standard'
            value={nickname}
            onChange={onChange}
            fullWidth
          />
        )}
        {signup && (
          <TextField
            name='email'
            required
            label='이메일'
            type='email'
            variant='standard'
            value={email}
            onChange={onChange}
            fullWidth
          />
        )}
        {signup && (
          <div className={styles.gender__container}>
            <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
      </RadioGroup>
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
