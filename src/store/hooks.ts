import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";

// Gunakan hook ber-tipe ini di seluruh aplikasi, jangan pakai `useDispatch`
// dan `useSelector` bawaan agar dapat type-safety.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
