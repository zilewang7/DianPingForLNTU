import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 使用 AsyncStorage 作为存储引擎
import rootReducer from './reducers';

// 配置 Redux Persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // 可以在这里配置哪些 reducer 需要持久化
  // whitelist: ['user'], 
};

// 创建持久化的 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建 Redux store
const store = configureStore({
  reducer: persistedReducer,
});

// 创建 Redux Persist 的持久化 store
const persistor = persistStore(store);

export { store, persistor };
