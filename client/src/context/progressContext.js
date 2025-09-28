import React, { createContext, useReducer, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './authContext';

const initialState = {
    progressItems: [],
    loading: true,
    error: null,
};

const progressReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'GET_PROGRESS_SUCCESS':
            return { ...state, progressItems: payload, loading: false, error: null };
        case 'PROGRESS_ERROR':
            return { ...state, error: payload, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: true };
        case 'CLEAR_PROGRESS':
            return { ...initialState, loading: false };
        default:
            return state;
    }
};

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
    const [state, dispatch] = useReducer(progressReducer, initialState);
    
    const { token } = useContext(AuthContext);

    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }


    const getMyProgress = useCallback(async () => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const res = await api.get('/progress/me');
            dispatch({ type: 'GET_PROGRESS_SUCCESS', payload: res.data.data });
        } catch (err) {
            dispatch({ type: 'PROGRESS_ERROR', payload: err.response?.data?.message });
        }
    }, []); 

    const getStudentProgress = useCallback(async (studentId) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const res = await api.get(`/progress/student/${studentId}`);
            dispatch({ type: 'GET_PROGRESS_SUCCESS', payload: res.data.data });
        } catch (err) {
            dispatch({ type: 'PROGRESS_ERROR', payload: err.response?.data?.message });
        }
    }, []); 

    const updateItemStatus = useCallback(async (itemId, status) => {
        try {
            await api.put(`/progress/item/${itemId}`, { status });
            await getMyProgress(); 
        } catch (err) {
            dispatch({ type: 'PROGRESS_ERROR', payload: err.response?.data?.message });
        }
    }, [getMyProgress]);

    const overrideItemStatus = useCallback(async (itemId, status, studentId) => {
        try {
            await api.put(`/progress/override/${itemId}`, { status });
            if (studentId) {
                await getStudentProgress(studentId);
            }
        } catch (err) {
            dispatch({ type: 'PROGRESS_ERROR', payload: err.response?.data?.message });
        }
    }, [getStudentProgress]); 

    const clearProgress = useCallback(() => {
        dispatch({ type: 'CLEAR_PROGRESS' });
    }, []);

    return (
        <ProgressContext.Provider
            value={{
                ...state,
                getMyProgress,
                getStudentProgress,
                updateItemStatus,
                overrideItemStatus,
                clearProgress,
            }}
        >
            {children}
        </ProgressContext.Provider>
    );
};

