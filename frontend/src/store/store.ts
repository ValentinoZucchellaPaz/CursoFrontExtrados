import { configureStore } from '@reduxjs/toolkit'
import pokemonReducer from './slices/pokemon/pokemonSlice'
import authReducer from "./slices/authSlice"

export const store = configureStore({
    reducer: {
        pokemons: pokemonReducer,
        auth: authReducer
    },
})

// tipos inferidos para useSelector y useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;