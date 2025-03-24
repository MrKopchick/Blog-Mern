import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSelector } from "react-router-dom";
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
    setError,
    formState: { errors, isValid}
  } = useForm({
      defaultValues: {
        email:"",
        password:""
      },
      mode: 'onChange'
  });

  const onSubmit = (values) => {
    dispatch(fetchAuth(values));
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }
  console.log(isAuth);

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSudmit = {handleSubmit(onSubmit)}>
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
        <Button type = "sudmit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
