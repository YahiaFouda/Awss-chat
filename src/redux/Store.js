import { createStore } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authorizationReducer from "./Authorization";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const persistConfig = {
  key: "AWSSChat",
  version: 1,
  storage,
};

const RootReducers = combineReducers({
  authorization: authorizationReducer
});
export const store = createStore(RootReducers);
// export const store = RootReducers;
const persistedReducer = persistReducer(persistConfig, RootReducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
