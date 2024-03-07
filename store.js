import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "./src/reducers";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
};

const pReducer = persistReducer(persistConfig, rootReducer);

const initialState = {};

export const store = createStore(
  pReducer,
  initialState,
  compose(
    // applyMiddleware(thunk, logger)
    applyMiddleware(thunk)
  )
);
export const persistor = persistStore(store);
