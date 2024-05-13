import {
	apiToken
} from "../config.js"

import {
	get,
	post,
	del,
	put
} from "./request.js";


export async function listUsers() {
	return await get(
		"/app/v1/users",
		{"api_key": apiToken});
}

export async function registerUser(name) {
	return await post(
		"/app/v1/users",
		{"Content-type": "application/json", "api_key": apiToken},
		{"username": name});
}

export async function generateUserToken(user_id, ttl) {
	return await post(
		`/app/v1/users/${user_id}/tokens`,
		{"Content-type": "application/json", "api_key": apiToken},
		{"scope": "manage", "ttl": ttl});
}

export async function deleteUser(user_id) {
	return await del(
		`/app/v1/users/${user_id}`,
		{"api_key": apiToken});
}

export async function grantAccessToFolder(folder_id, member_type, member_id, access) {
	return await put(
		`/app/v1/folders/${folder_id}/access/${member_type}/${member_id}`,
		{"Content-type": "application/json", "api_key": apiToken},
		{"access": access});
}

export async function createAsset(folder_id, asset_type, asset_name) {
	return await post(
		`/app/v1/folders/${folder_id}/assets`,
		{"Content-type": "application/json", "api_key": apiToken},
		{"asset_type": asset_type, "name": asset_name});
}
