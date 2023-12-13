import { createSlice } from "@reduxjs/toolkit";
import { getToken } from "../network/Services";

export const authorizationSlice = createSlice({
	name: "authorization",
	initialState: {
		authorization: JSON.parse(localStorage.getItem('authorization')),
		deviceToken: {},
		deviceId: {},
		reloadState: false,
	},
	reducers: {
		getDeviceId: (state, action) => {
			if (Object.keys(action.payload)[0] === "deviceId") {
				state.deviceId = action.payload;
			} else {
				state.authorization.deviceId = action.payload;
			}
		},
		login: (state, action) => {
		
			if (Object.keys(action.payload)[0] === "deviceToken") {
				state.deviceToken = action.payload;
			} else {
				state.authorization = action.payload;
			}
			localStorage.setItem("authorization", JSON.stringify(action.payload));
		},
		logout: (state, action) => {
			state.authorization = {};
			getToken(null);
			localStorage.removeItem("authorization")
		},
		rerenderAfterNotification: (state, action) => {
			state.reloadState = !state.reloadState;
		},
	},
});

export const {
	getDeviceId,
	rerenderAfterNotification,
	login,
	logout,
} = authorizationSlice.actions;

export default authorizationSlice.reducer;
