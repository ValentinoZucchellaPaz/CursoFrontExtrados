import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface User {
    username: string;
    password: string;
    token: string;
}

export type UserState = User | null;

const initialState: UserState = null
// TODO que se extraiga del localstorage o buscar de cookie, preguntar como se hace!!!!!!!!!

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {}
});

// export const { login, logout } = userSlice.actions

export default userSlice.reducer;
