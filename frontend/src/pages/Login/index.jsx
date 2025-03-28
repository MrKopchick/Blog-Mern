import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";

import styles from "./Login.module.scss";
import { fetchAuth, SelectIsAuth } from "../../redux/slices/auth";
export const Login = () => {  
  const isAuth = useSelector(SelectIsAuth);
  const dispatch = useDispatch(); 
  
  const {
    register,
    handleSubmit,
    formState: { errors}
  } = useForm({
      defaultValues: {
        email:"",
        password:""
      },
      mode: 'onChange'
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));
    
    if(!data.payload){
      return alert("Не вдалося авторизуватися");
    }
    
    if('token' in data.payload){  
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  console.log(isAuth);

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вхід в аккаунт
      </Typography>
      <form onSubmit = {handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error = {Boolean(errors.email?.message)}
          helperText= {errors.email?.message}
          {...register("email", { required: 'вкажіть почту' })}  
          fullWidth
        />
        <TextField 
          className={styles.field} 
          label="Пароль"
          error = {Boolean(errors.password?.message)}
          helperText= {errors.password?.message}
          {...register("password", { required: 'вкажіть пароль' })}  
          fullWidth 
        />
        <Button type = "submit" size="large" variant="contained" fullWidth>
          Увійти
        </Button>
      </form>
    </Paper>
  );
};
