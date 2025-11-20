import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("isAuthenticated"), // читаем из localStorage при загрузке
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", "true"); // сохраняем в localStorage
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("isAuthenticated"); // очищаем при выходе
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
