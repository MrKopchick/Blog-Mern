import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

import { useSelector } from 'react-redux';
import { SelectIsAuth } from '../../redux/slices/auth';
import { useNavigate ,Navigate } from 'react-router-dom';

import axios from '../../axios';
export const AddPost = () => {

  const navigate = useNavigate();
  const isAuth = useSelector(SelectIsAuth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [text, setText] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);

  const handleChangeFile = async (event) => {
    try{
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const {data} = await axios.post("/upload", formData);
      setImageUrl(data.url);
    }catch(error){
      console.warning(error);
      window.alert("помилка завантаження");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try{
      setIsLoading(true);
      const fields = {
        title,
        text,
        tags,
        imageUrl,
      };

      const {data} = await axios.post('/posts', {...fields});
      
      const id = data._id;
      
      navigate(`/posts/${id}`);

    }catch(error){
      console.warn(error);
      window.alert("помилка додавання");
    }finally{
      setIsLoading(false);
    }
  };

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введіть текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if(!window.localStorage.getItem('token') && !isAuth) {
    <Navigate to='/'></Navigate>
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick = {() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить картинку
      </Button>
      <input ref = {inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:3002${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок поста..."
        fullWidth
        value = {title}
        onChange = {(e) => setTitle(e.target.value)}
      />

      <TextField 
        classes={{ root: styles.tags }}
        variant="standard" 
        placeholder="Тегі"
        value = {tags}
        onChange = {(e) => setTags(e.target.value)}
        fullWidth 
      />


      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick = {onSubmit} size="large" variant="contained">
          Опубликовать
        </Button>
        <a href="/">
          <Button size="large">скасувати</Button>
        </a>
      </div>
    </Paper>
  );
};
