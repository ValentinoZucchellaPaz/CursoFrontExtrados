import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../types';

const initialState: AuthState = {
    token: null,
    userId: null,
    userEmail: null,
    userRole: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<AuthState>) {
            state.token = action.payload.token;
            state.userRole = action.payload.userRole;
            state.userId = action.payload.userId
            state.userEmail = action.payload.userEmail
        },
        logout(state) {
            state.token = null;
            state.userRole = null;
            state.userId = null;
            state.userEmail = null;
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
