import axios from "axios";

export const baseUrl = process.env.REACT_APP_BASE_URL;

var token;
export function getToken(newToken = null) {
	token = newToken;
}


export function PostResource(path, data, onSuccess, onFail, reqAuth, formData) {
	const requestData = {
		method: "post",
		url: baseUrl + path,
		headers: {},
		data,
	};

	if (formData) {
		requestData.headers = {
			"content-type": "multipart/form-data",
		};
	}

	if (reqAuth && token) {
		requestData.headers = {
			Authorization: "Bearer " + token,
		};
	}

	axios(requestData)
		.then((res) => {
			onSuccess(res.data);
		})
		.catch((err) => {
			onFail(err.response);
			// onFailStatus(err.response);
			console.log(err);
		});
}

export function GetResource(path, onSuccess, onFail, reqAuth) {
	const requestData = {
		method: "get",
		url: baseUrl + path,
		headers: {},
	};

	if (reqAuth && token) {
		requestData.headers = {
			Authorization: "Bearer " + token,
		};
	}

	axios(requestData)
		.then((res) => {
			onSuccess(res.data);
		})
		.catch((err) => {
			onFail(err.response);
			// onFailStatus(err.response);
		});
}

export function deleteResource(path, onSuccess, onFail, reqAuth) {
	const requestData = {
		method: "delete",
		url: baseUrl + path,
		headers: {},
	};

	if (reqAuth && token) {
		requestData.headers = {
			Authorization: "Bearer " + token,
		};
	}

	axios(requestData)
		.then((res) => {
			onSuccess(res.data);
		})
		.catch((err) => {
			onFail(err.response);
			// onFailStatus(err.response);
			console.log(err);
		});
}

export function PatchResource(
	path,
	data,
	onSuccess,
	onFail,
	reqAuth,
	formData
) {
	const requestData = {
		method: "patch",
		url: baseUrl + path,
		headers: {},
		data,
	};
	if (formData) {
		requestData.headers = {
			"content-type": "multipart/form-data",
		};
	}

	if (reqAuth && token) {
		requestData.headers = {
			Authorization: "Bearer " + token,
		};
	}
	axios(requestData)
		.then((res) => {
			onSuccess(res.data);
		})
		.catch((err) => {
			onFail(err.response);
			console.log(err);
			// onFailStatus(err.response);
		});
}

export function PutResource(path, data, onSuccess, onFail, reqAuth, formData) {
	const requestData = {
		method: "put",
		url: baseUrl + path,
		headers: {},
		data,
	};
	if (formData) {
		requestData.headers = {
			"content-type": "multipart/form-data",
		};
	}

	if (reqAuth && token) {
		requestData.headers = {
			Authorization: "Bearer " + token,
		};
	}
	axios(requestData)
		.then((res) => {
			onSuccess(res.data);
		})
		.catch((err) => {
			onFail(err.response);
			console.log(err);
			// onFailStatus(err.response);
		});
}
