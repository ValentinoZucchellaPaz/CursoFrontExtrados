import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../../services/request';
import axios from 'axios';

export interface Post {
    userId: string,
    id: number,
    title: string,
    body: string
}

export interface PostState {
    items: Post[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
}

const initialState: PostState = {
    items: [],
    status: 'idle',
    error: null,
}

// Thunk para obtener los posts
export const fetchPosts = createAsyncThunk<Post[]>('posts/fetchPosts', async () => {
    const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts'); // usando axios solo
    // const response = useAxios({ url: "/posts", method: "GET" }); // no puedo hacer esto (hook de useAxios) xq los hooks solo se llaman dentro del cuerpo de componentes
    // const response = await request<Post[]>({ url: "https://jsonplaceholder.typicode.com/posts", method: "GET" }); // llamado mediante funcion asincrona que usa apiClient.ts

    return response.data;
});

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Unknown error';
            });
    },
});

export default postsSlice.reducer;
