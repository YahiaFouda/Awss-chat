import { PostResource } from "./Services";

export const loginApi = (body, onSuccess, onFail, reqAuth = true) => {
	const path = "api/Admin/Login";
	PostResource(path, body, onSuccess, onFail, reqAuth);
};


