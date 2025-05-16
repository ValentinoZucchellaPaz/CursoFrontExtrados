import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../types';

const initialState: AuthState = {
    token: null,
    userId: null,
    userMail: null,
    role: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<AuthState>) {
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.userId = action.payload.userId
            state.userMail = action.payload.userMail
        },
        logout(state) {
            state.token = null;
            state.role = null;
            state.userId = null;
            state.userMail = null;
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
