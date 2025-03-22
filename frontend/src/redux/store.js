import { red } from '@mui/material/colors';
import {configuration} from '@reduxjs/toolkit';
import { postReducer } from './slices/posts';
const store = configuration({
    reducer:{
        posts: postReducer
    }
})

export default store;