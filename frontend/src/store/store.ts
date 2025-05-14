import { configureStore } from '@reduxjs/toolkit'
import pokemonReducer from './slices/pokemon/pokemonSlice'
import postsReducer from './slices/postSlice'
import userReducer from "./slices/userSlice"

export const store = configureStore({
    reducer: {
        pokemons: pokemonReducer,
        posts: postsReducer,
        user: userReducer
    },
})

// tipos inferidos para useSelector y useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;