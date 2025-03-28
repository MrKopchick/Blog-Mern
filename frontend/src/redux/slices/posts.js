import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const {data} = await axios.get('/posts');
    return data;
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const {data} = await axios.get('/tags');
    return data;
})

const initialState = {
    posts: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    }
};



const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: {    
        [fetchPosts.pending]: (state, actions) =>{
            state.posts.status = 'loading';
        },
        [fetchPosts.fulfilled]: (state, actions) => {
            state.posts.items = actions.payload;
            state.posts.status = 'loaded';
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items= [];
            state.posts.status = 'error';   
        },
        [fetchTags.pending]: (state, actions) =>{
            state.tags.status = 'loading';
        },
        [fetchTags.fulfilled]: (state, actions) => {
            state.tags.items = actions.payload;
            state.tags.status = 'loaded';
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items= [];
            state.tags.status = 'error';   
        }
    }
});

export const postReducer = postsSlice.reducer;