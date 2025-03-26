import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';  

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useSelector, useDispatch } from 'react-redux';
import { logout, SelectIsAuth } from '../../redux/slices/auth';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(SelectIsAuth);

  const onClickLogout = () => {
      if(window.confirm("Ви впевнені, що хочете вийти?")) {
        window.localStorage.removeItem('token');
        dispatch(logout());
      }
  };
 
  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>Толковий блог</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to ="/posts/create">
                  <Button variant="contained">Створити статтю</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Вийти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Увійти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Створити акаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
