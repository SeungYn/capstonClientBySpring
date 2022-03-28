import React, { useEffect, useState } from 'react';
import styles from './login.module.css';

import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

const Login = ({ onSignUp, onLogin, idDuplicateVerification }) => {
  const [signup, setSignup] = useState(false);
  const [nickname, setNickname] = useState('');
  const [passwordVerification, setPasswordVerification] = useState('');
  const [loginId, setLoginId] = useState('');
  const [duplicateError, setduplicateError] = useState(false);
  const [loginIdError, setLoginIdError] = useState(false);
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
        if (signup) {
          const data = idDuplicateVerification(value);
          console.log(data);
        }
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
        setLoginId('');
        setPassword('');
        return setSignup(checked);
      default:
    }
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(1);
  };

  return (
    <section className={styles.container}>
      <form className={styles.authForm} onSubmit={submit}>
        <h2 className={styles.authTitle}>혼밥메이트</h2>
        <div className={styles.authForm__item}>
          <TextField
            name='loginId'
            required
            error={loginIdError ? true : duplicateError ? true : false}
            helperText={
              duplicateError
                ? '아이디가 중복 되었습니다.'
                : loginIdError
                ? '아이디 잘못'
                : ''
            }
            id='standard-required'
            label='아이디'
            variant='standard'
            value={loginId}
            onChange={onChange}
            type='text'
            fullWidth
          />
        </div>
        <div className={styles.authForm__item}>
          <TextField
            id='standard-password-input'
            name='password'
            value={password}
            label='비밀번호'
            onChange={onChange}
            variant='standard'
            type='password'
            fullWidth
            required
          />
        </div>

        {signup && (
          <div className={styles.authForm__item}>
            <TextField
              name='passwordVerification'
              required
              label='비밀번호확인'
              variant='standard'
              value={passwordVerification}
              onChange={onChange}
              fullWidth
            />
          </div>
        )}
        {signup && (
          <div className={styles.authForm__item}>
            <TextField
              name='nickname'
              required
              label='닉네임'
              variant='standard'
              value={nickname}
              onChange={onChange}
              fullWidth
            />
          </div>
        )}
        {signup && (
          <div className={styles.authForm__item}>
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
          </div>
        )}
        {signup && (
          <div className={styles.authForm__item}>
            <InputLabel id='university'>대학교</InputLabel>
            <Select
              labelId='university'
              name='university'
              value={university}
              onChange={onChange}
              fullWidth
              variant='standard'
            >
              <MenuItem value='한신대'>한신대</MenuItem>
            </Select>
          </div>
        )}
        {signup && (
          <div className={styles.gender__container}>
            <FormLabel id='demo-controlled-radio-buttons-group'>성별</FormLabel>
            <RadioGroup
              row
              aria-labelledby='demo-controlled-radio-buttons-group'
              name='sex'
              value={sex}
              onChange={onChange}
            >
              <FormControlLabel
                value='female'
                control={<Radio />}
                label='Female'
              />
              <FormControlLabel value='male' control={<Radio />} label='Male' />
            </RadioGroup>
          </div>
        )}
        <div className={styles.form_signup}>
          <input
            name='signup'
            id='signup'
            type='checkbox'
            onChange={onChange}
            checked={signup}
          />
          <label htmlFor='signup'> Create a new account?</label>
        </div>
        <button className={styles.auth_btn} type='submit'>
          {signup ? '회원가입' : '로그인'}
        </button>
      </form>
    </section>
  );
};

export default Login;
