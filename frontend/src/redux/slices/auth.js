import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios';

export const fetchAuth = createAsyncThunk('auth/fetchUserData', async (params) => {
    const {data} = await axios.get('/auth/login', params);
    return data;
})

const initialState = {
    data: null,
    status: "loading"
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        }
    },
    extraReducers:{
        [fetchAuth.pending]: (state, actions) =>{
            state.status = 'loading';
            state.data = null;
        },
        [fetchAuth.fulfilled]: (state, actions) => {
            state.status = 'loaded';
            state.data = actions.payload;
        },
        [fetchAuth.rejected]: (state) => {
            state.status = 'error';
            state.data = null;
        },
    }
});

export const SelectIsAuth = state => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const {logout} = authSlice.actions;