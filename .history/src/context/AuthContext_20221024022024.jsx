import {
  createContext,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '../components/error/error';
import Header from '../components/header/header';

import Login from '../pages/login/login';

const AuthContext = createContext({});

const contextRef = createRef();

export function AuthProvider({ authService, authErrorEventBus, children }) {
  const [user, setUser] = useState('');
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [userNickName, setUserNickName] = useState(undefined);
  const nav = useNavigate();
  console.log('auth');
  useImperativeHandle(contextRef, () => (user ? user.token : undefined));

  useEffect(() => {
    authErrorEventBus.listen((err) => {
      console.log('err');
      console.log(err);
      setError(err);
      setUser(undefined);
      authService.logout();
    });
  }, [authErrorEventBus]);

  useEffect(() => {
    localStorage.setItem('userID', 1);
    if (localStorage.getItem('userID')) {
      console.log(localStorage.getItem('token'));
      console.log(localStorage.getItem('userID'));
      setUser(localStorage.getItem('userID'));
      setUserNickName(localStorage.getItem('userNickName'));
      //nav('/');
    }

    //setUser({ token: localStorage.getItem('TOKEN') });
  }, []);

  const signUp = useCallback(
    async (nickname, loginId, password, email, sex, university, dept, sno) =>
      authService.signup(
        nickname,
        loginId,
        password,
        email,
        sex,
        university,
        dept,
        sno
      ),
    //.then((user) => setUser(user))
    [authService]
  );

  const logIn = useCallback(
    async (nickname, password) => {
      authService
        .headerTokenLogin(nickname, password)
        .then((data) => {
          console.log(data);
          setUser(data.memberId);
          localStorage.setItem('userID', data.memberId);
          localStorage.setItem('userNickName', data.nickName);
          setUserNickName(data.nickName.toString());
          setUserId(data.memberId);
        })
        .catch((error) => setError(error));
    },
    [authService]
  );

  const logout = useCallback(
    async () =>
      authService.logout().then(() => {
        setUser(undefined);
        setUserNickName(undefined);
      }),
    [authService]
  );

  const emailVerification = useCallback(
    async (email) =>
      authService.emailVerification(email).then((result) => result),
    [authService]
  );

  const idDuplicateVerification = useCallback(
    async (loginId) =>
      authService.idDuplicateVerification(loginId).then((data) => data),
    [authService]
  );

  const authenticationNumberVerification = useCallback(
    async (number) =>
      authService.authenticationNumberVerification(number).then((data) => data),
    [authService]
  );

  const getMyInfo = async () => {
    const data = await authService
      .getMyInfo()
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        return null;
      });
    return data;
  };

  const context = useMemo(
    () => ({
      user,
      userId,
      signUp,
      logIn,
      logout,
      error,
      setError,
      userNickName,
      getMyInfo,
    }),
    [user, signUp, logIn, logout, error, userId, setError, userNickName]
  );

  const onError = (error) => setError();
  return (
    <AuthContext.Provider value={context}>
      {user ? (
        children
      ) : (
        <div className='app'>
          {error && <Error error={error} onError={setError} />}
          <Header />
          <Login
            onSignUp={signUp}
            onLogin={logIn}
            idDuplicateVerification={idDuplicateVerification}
            onEmailVerification={emailVerification}
            onAuthenticationNumberVerification={
              authenticationNumberVerification
            }
          />
        </div>
      )}
    </AuthContext.Provider>
  );
}

export class AuthErrorEventBus {
  listen(callback) {
    this.callback = callback;
  }
  notify(error) {
    this.callback(error);
  }
}

export default AuthContext;
export const fetchToken = () => contextRef.current;
export const useAuth = () => useContext(AuthContext);
