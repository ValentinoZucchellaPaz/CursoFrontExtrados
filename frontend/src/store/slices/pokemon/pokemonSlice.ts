import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { AllPokemons, Pokemon } from './types';



// Thunk para obtener los posts
export const fetchPokemons = createAsyncThunk<AllPokemons>('posts/fetchPokemons', async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    return response.data;
});

interface PokemonState {
    items: AllPokemons | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
}

const initialState: PokemonState = {
    items: null,
    status: "idle",
    error: null
}


export const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState,
    reducers: {},
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
                state.error = action.error.message ?? "Unknow error";
            });
    },
})

// Action creators are generated for each case reducer function
export const { } = pokemonSlice.actions

export default pokemonSlice.reducer