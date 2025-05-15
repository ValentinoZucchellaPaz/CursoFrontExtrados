import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { AllPokemons, Pokemon } from './types';
import { request } from '../../../services/request';

const url = 'https://pokeapi.co/api/v2/pokemon?limit=151'
// const url = `http://localhost:5125/info/cartas/${pokemonName}`

// Thunk para obtener los posts
export const fetchPokemons = createAsyncThunk<AllPokemons>('posts/fetchPokemons', async () => {
    // version con axios solo y llamado a api backend .net
    // export const fetchPokemons = createAsyncThunk<AllPokemons>('posts/fetchPokemons', async () => {
    // const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    // return response.data;
    const response = await request<AllPokemons>({ url, method: "GET" });
    return response;
});

interface PokemonState {
    // items: Pokemon[] | null,
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