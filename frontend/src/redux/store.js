import { configureStore } from "@reduxjs/toolkit";

import inventoryReducer from "./slices/inventorySlice";
import productReducer from "./slices/productSlice";

const store = configureStore({
  reducer: {
    inventory: inventoryReducer,

    products: productReducer,
  },
});

export default store;