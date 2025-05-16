import { createSlice } from '@reduxjs/toolkit';
import { PostState } from '../types';
import { fetchPosts } from '../thunks/postsThunks';


const initialState: PostState = {
    items: [],
    status: 'idle',
    error: null,
}


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
