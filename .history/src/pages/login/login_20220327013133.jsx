import React from 'react';
import styles from 
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

  return (
    <section className={styles.container}>
      <form className={styles.authForm}>
      <input
          name='username'
          type='text'
          placeholder='Id'
          value={username}
          onChange={onChange}
          className='form-input'
          required
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          value={password}
          className='form-input'
          onChange={onChange}
        />
        {signup && (
          <input
            name='name'
            type='text'
            placeholder='Name'
            value={name}
            onChange={onChange}
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
            onChange={onChange}
            className='form-input'
            required
          />
        )}
        {signup && (
          <input
            name='url'
            type='url'
            placeholder='Profile Image URL'
            value={url}
            onChange={onChange}
            className='form-input'
          />
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
