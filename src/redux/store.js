import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth-slice';
import chatReducer from './features/chat-slice';
import { useSelector } from 'react-redux';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
    },
});

// Custom hook to use App's state
export const useAppSelector = useSelector;
