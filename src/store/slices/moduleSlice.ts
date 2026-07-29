import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ListResponse } from "@/types/api";
import { apiGet, type QueryParams } from "@/utils/api";
import { ModuleApiDaum } from "@/types/module";

interface ModuleState {
  data: ModuleApiDaum[];
  loading: boolean;
  error: string | null;
}

const initialState: ModuleState = {
  data: [],
  loading: false,
  error: null,
};

// Ambil daftar module dari API: GET /module
// Params dinamis & opsional — fetchModules() untuk ambil semua, atau kirim
// { search: "..." } dsb sesuai kebutuhan backend.
export const fetchModules = createAsyncThunk<
  ListResponse<ModuleApiDaum>,
  QueryParams | void,
  { rejectValue: string }
>("module/fetchModules", async (params, { rejectWithValue }) => {
  try {
    return await apiGet<ListResponse<ModuleApiDaum>>(
      "/module",
      params ?? undefined,
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil data module";
    return rejectWithValue(message);
  }
});

const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data ?? [];
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Terjadi kesalahan";
      });
  },
});

export default moduleSlice.reducer;
