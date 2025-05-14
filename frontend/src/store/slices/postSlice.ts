import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
    const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
    // const response = useAxios({ url: "/posts", method: "GET" }); // no puedo hacer esto xq los hooks solo se llaman dentro del cuerpo de componentes
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
