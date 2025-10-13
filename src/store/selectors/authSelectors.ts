
import { AppState } from '../store';


export const selectIsLoggedIn = (state: AppState) => state.auth.isLoggedIn;

export const selectUser = (state: AppState) => state.auth.user;

export const selectToken = (state: AppState) => state.auth.token;