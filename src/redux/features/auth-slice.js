import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isAuth: false,
    user: null
};


export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn: (state, action) => {
            console.log(action.payload);
            state.isAuth = true;
            state.user = action.payload;
        },
        logOut: (state) => {
            console.log("logout");
            state.isAuth = false;
            state.user = null;
        }
    }
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;
