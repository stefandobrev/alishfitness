import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { initializeStore } from '../utils/api';

// Import reducers first
import { authReducer, loadingReducer, userReducer } from './slices';

// Then configure persist
const persistConfigAuth = {
  key: 'auth',
  storage,
};

const persistConfigUser = {
  key: 'user',
  storage,
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);
const persistedUserReducer = persistReducer(persistConfigUser, userReducer);

// Finally, create store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    loading: loadingReducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

initializeStore(store);
export const persistor = persistStore(store);

export { store };
