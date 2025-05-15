import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface User {
    username: string;
    password: string;
    token: string;
}

export type UserState = User | null;

const initialState: UserState = JSON.parse(localStorage.getItem("bootcamp-extrados-user") || "null")
// TODO que se extraiga del localstorage o buscar de cookie, preguntar como se hace!!!!!!!!!

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            localStorage.setItem("bootcamp-extrados-user", JSON.stringify(action.payload))
            console.log(action.payload);

            return action.payload
        },
        logout() {
            localStorage.removeItem('bootcamp-extrados-user');
            return null;
        },
    }
});

export const { login, logout } = userSlice.actions

export default userSlice.reducer;
