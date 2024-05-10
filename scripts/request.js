export async function get(url, headers) {
	return await fetch("https://api.3dverse.com" + url, {
		method: "GET",
		headers: headers
	});
}

export async function post(url, headers, body) {
	return await fetch("https://api.3dverse.com" + url, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(body)
	});
}

export async function del(url, headers) {
	return await fetch("https://api.3dverse.com" + url, {
		method: "DELETE",
		headers: headers
	});
}

export async function put(url, headers, body) {
	return await fetch("https://api.3dverse.com" + url, {
		method: "PUT",
		headers: headers,
		body: JSON.stringify(body)
	});
}
