import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, SelectIsAuth } from "../../redux/slices/auth";
import { Navigate } from 'react-router-dom';

import styles from './Login.module.scss';

export const Registration = () => {

  const isAuth = useSelector(SelectIsAuth);
  const dispatch = useDispatch(); 
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid}
  } = useForm({
      defaultValues: {
        fullName:"",
        email:"",
        password:""
      },
      mode: 'onChange'
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));
    
    if(!data.payload){
      return alert("Не вдалося створити акаунт");
    }

    if('token' in data.payload){  
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Створення акаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit = {handleSubmit(onSubmit)}>
        <TextField 
          error = {Boolean(errors.fullName?.message)}
          helperText = {errors.fullName?.message}
          {...register('fullName', { required: 'Вкажіть повне імя' })}
          className={styles.field} 
          label="Повне ім'я" 
          fullWidth 
        />

        <TextField
          error = {Boolean(errors.email?.message)}
          helperText = {errors.email?.message}
          {...register('email', { required: 'Вкажіть почту' })}
          className={styles.field} 
          label="E-Mail" 
          fullWidth 
        />
        
        <TextField
          error = {Boolean(errors.password?.message)}
          helperText = {errors.password?.message}
          {...register('password', { required: 'Вкажіть пароль' })}
          className={styles.field} 
          label="Пароль" 
          fullWidth 
        />

      <Button disabled = {!isValid} type = "submit" size="large" variant="contained" fullWidth>
        Зареєструватися
      </Button>
      </form>
    </Paper>
  );
};
