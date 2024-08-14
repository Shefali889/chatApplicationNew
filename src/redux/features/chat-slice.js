import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    currentChat: null,
    contacts: [],
};

export const chat = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatRedux: (state, action) => {
            console.log("setChatRedux payload", action.payload);
            // Assuming payload is the full chat object to replace the current chat state
            state.currentChat = action.payload;
        },
        addMessageRedux: (state, action) => {
            console.log("addMessageRedux payload", action.payload);
            // Assuming payload is a new message to be added
            state.messages.push(action.payload);
        },
        setContacts: (state, action) => {
            console.log("setContacts payload", action.payload);
            state.contacts = action.payload;
        }
    }
});

export const { setChatRedux, addMessageRedux, setContacts } = chat.actions;
export default chat.reducer;
