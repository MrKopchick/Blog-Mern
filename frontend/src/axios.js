import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://localhost:3002',
});

axios.get('/posts');

export default instance;