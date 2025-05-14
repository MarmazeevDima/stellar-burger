import {
	getUserApi,
	loginUserApi,
	logoutApi,
	registerUserApi,
	TLoginData,
	TRegisterData,
	updateUserApi,
} from "@api";
import {
	createAsyncThunk,
	createSlice,
	SerializedError,
} from "@reduxjs/toolkit";
import { TUser } from "@utils-types";
import { clearTokens, storeTokens } from "../../../utils/cookie";

type TUserState = {
	isAuthChecked: boolean;
	isAuthenticated: boolean;
	loginError?: SerializedError;
	registerError?: SerializedError;
	data: TUser;
};

export const initialState: TUserState = {
	isAuthChecked: false,
	isAuthenticated: false,
	data: {
		name: "",
		email: "",
	},
};

export const register = createAsyncThunk<TUser, TRegisterData>(
	"auth/register",
	async (data, { rejectWithValue }) => {
		const response = await registerUserApi(data);

		if (!response.success) {
			return rejectWithValue(response);
		}

		const { user, refreshToken, accessToken } = response;

		storeTokens(refreshToken, accessToken);

		return user;
	}
);

export const login = createAsyncThunk<TUser, TLoginData>(
	"auth/login",
	async (data, { rejectWithValue }) => {
		const response = await loginUserApi(data);

		if (!response.success) {
			return rejectWithValue(response);
		}

		const { user, refreshToken, accessToken } = response;

		storeTokens(refreshToken, accessToken);

		return user;
	}
);

export const logout = createAsyncThunk(
	"auth/logout",
	async (_, { rejectWithValue }) => {
		const response = await logoutApi();

		if (!response.success) {
			return rejectWithValue(response);
		}

		clearTokens();
	}
);

export const fetchUser = createAsyncThunk(
	"auth/fetch",
	async (_, { rejectWithValue }) => {
		const response = await getUserApi();

		if (!response?.success) {
			return rejectWithValue(response);
		}

		return response.user;
	}
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
	"auth/update",
	async (data, { rejectWithValue }) => {
		const response = await updateUserApi(data);

		if (!response?.success) {
			return rejectWithValue(response);
		}
        
		return response.user;
	}
);

export const checkUserAuth = createAsyncThunk(
	"auth/checkAuth",
	async (_, { dispatch }) => {
		if (localStorage.getItem("refreshToken")) {
			try {
				await dispatch(fetchUser());
			} catch (error) {
				clearTokens();
				return Promise.reject(error);
			}
		} else {
			return Promise.reject("No refresh token");
		}
	}
);

const slice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, (state) => {
				state.registerError = undefined;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.registerError = undefined;
				state.isAuthenticated = true;
				state.data = action.payload;
			})
			.addCase(register.rejected, (state, action) => {
				state.registerError = action.meta.rejectedWithValue
					? (action.payload as SerializedError)
					: action.error;
			})
			.addCase(login.pending, (state, action) => {
				state.loginError = undefined;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loginError = undefined;
				state.isAuthenticated = true;
				state.data = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.loginError = action.meta.rejectedWithValue
					? (action.payload as SerializedError)
					: action.error;
			})
			.addCase(logout.fulfilled, (state) => {
				state.isAuthenticated = false;
				state.data = {
					email: "",
					name: "",
				};
			})
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.isAuthenticated = true;
				state.isAuthChecked = true;
				state.data = action.payload;
			})
			.addCase(fetchUser.rejected, (state) => {
				state.isAuthChecked = true;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.data = action.payload;
			})
			.addCase(checkUserAuth.fulfilled, (state) => {
				state.isAuthChecked = true;
			})
			.addCase(checkUserAuth.rejected, (state) => {
				state.isAuthChecked = true;
				state.isAuthenticated = false;
			});
	},
});

export const reducer = slice.reducer;