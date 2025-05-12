import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

// Thunk para obtener los posts
export const fetchPokemons = createAsyncThunk('posts/fetchPokemons', async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    return response.data;
});

export const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState: {
        items: [],
        status: "idle",
        error: null
    },
    reducers: {
        increment: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPokemons.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPokemons.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPokemons.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = pokemonSlice.actions

export default pokemonSlice.reducer