import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { APICard } from '../../types';
import apiClient from '../../../services/apiClient';
import { Pokemon } from './types';

// const url = 'https://pokeapi.co/api/v2/pokemon?limit=151'
const url = 'http://localhost:5125/info/cartas'

// Thunk para obtener los posts
export const fetchPokemons = createAsyncThunk<APICard[]>('posts/fetchPokemons', async () => {
    const response = await apiClient.get<APICard[]>(url);
    return response.data;
});

interface PokemonState {
    items: APICard[] | null,
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