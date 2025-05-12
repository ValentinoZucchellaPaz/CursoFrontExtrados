import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem("bootcamp-extrados-user"))

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            localStorage.setItem("bootcamp-extrados-user", JSON.stringify(action.payload))
            console.log(action.payload);

            return action.payload
        }
    }
});

export const { login } = userSlice.actions

export default userSlice.reducer;
