import { configureStore } from '@reduxjs/toolkit'
import pokemonReducer from './slices/pokemonSlice'
import postsReducer from './slices/postSlice'
import userReducer from "./slices/userSlice"

export const store = configureStore({
    reducer: {
        pokemons: pokemonReducer,
        posts: postsReducer,
        user: userReducer
    },
})