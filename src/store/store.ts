import { configureStore } from "@reduxjs/toolkit";
import iamReducer from "./slices/iamSlice";

// Buat store baru per-request (pola resmi Next.js App Router untuk hindari
// state bocor antar request saat SSR).
export const makeStore = () => {
  return configureStore({
    reducer: {
      iam: iamReducer,
    },
  });
};

// Tipe-tipe turunan store
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
