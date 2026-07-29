import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IAMApiDaum } from "@/types/IAM";
import { apiGet, type QueryParams } from "@/utils/api";
import { SingleResponse } from "@/types/api";

interface IAMState {
  // /users/iam mengembalikan satu objek user, jadi bukan array.
  data: IAMApiDaum | null;
  loading: boolean;
  error: string | null;
}

const initialState: IAMState = {
  data: null,
  loading: false,
  error: null,
};

// Ambil data current user (IAM) dari API: GET /users/iam (satu objek user).
// Params dinamis & opsional.
export const fetchUsers = createAsyncThunk<
  SingleResponse<IAMApiDaum>,
  QueryParams | void,
  { rejectValue: string }
>("iam/fetchUsers", async (params, { rejectWithValue }) => {
  try {
    return await apiGet<SingleResponse<IAMApiDaum>>(
      "/users/iam",
      params ?? undefined,
      false,
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil data user";
    return rejectWithValue(message);
  }
});

const iamSlice = createSlice({
  name: "iam",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data ?? null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Terjadi kesalahan";
      });
  },
});

export default iamSlice.reducer;
