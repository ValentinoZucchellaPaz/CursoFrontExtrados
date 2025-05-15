import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decodeToken } from '../../utils/decodeToken';

interface AuthState {
    token: string | null;
    role: string | null;
    userId: string | null;
    userMail: string | null;
    isAuthenticated: boolean;
}


const initialState: AuthState = {
    token: localStorage.getItem('token'), // persistencia básica
    userId: null,
    userMail: null,
    role: null,
    isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<Omit<AuthState, 'isAuthenticated'>>) {
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.isAuthenticated = true;
            action.payload.token && localStorage.setItem('token', action.payload.token);
        },
        logout(state) {
            state.token = null;
            state.role = null;
            state.userId = null;
            state.userMail = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
