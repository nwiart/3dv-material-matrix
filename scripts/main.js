import {
	apiToken,
	MATERIAL_USER_NAME,
	oneMatrixPerScene,
	WORKING_DIR_UUID,
	devSceneUUID
} from "../config.js";

import {
	get,
	post,
	del,
	put
} from "./request.js";


async function listUsers() {
	return await get(
		"/app/v1/users",
		{"api_key": apiToken});
}

async function registerUser(name) {
	return await post(
		"/app/v1/users",
		{"Content-type": "application/json", "api_key": apiToken},
		{"username": name});
}

async function generateUserToken(user_id, ttl) {
	return await post(
		`/app/v1/users/${user_id}/tokens`,
		{"Content-type": "application/json", "api_key": apiToken},
		{"scope": "manage", "ttl": ttl});
}

async function deleteUser(user_id) {
	return await del(
		`/app/v1/users/${user_id}`,
		{"api_key": apiToken});
}

async function grantAccessToFolder(folder_id, member_type, member_id, access) {
	return await put(
		`/app/v1/folders/${folder_id}/access/${member_type}/${member_id}`,
		{"Content-type": "application/json", "api_key": apiToken},
		{"access": access});
}

async function createAsset(folder_id, asset_type, asset_name) {
	return await post(
		`/app/v1/folders/${folder_id}/assets`,
		{"Content-type": "application/json", "api_key": apiToken},
		{"asset_type": asset_type, "name": asset_name});
}


// List of all four shaders (standard, sheen, anisotropic, clearcoat) in their textured and non-textured variants.
// Triplanar variants are generated via code below.
const shaders = [
	{ shaderUUID: "744556b0-67b5-4329-ba4f-a04c04f92b1c", sceneName: "Standard Untextured" },
	{ shaderUUID: "723b3aa5-cc92-4897-9830-92eb89dbae03", sceneName: "Standard Textured" },
	{ shaderUUID: "9d07f1f4-5442-4a65-b58c-509528f33ab3", sceneName: "Sheen Untextured" },
	{ shaderUUID: "1dfc716d-9df7-438d-8290-0ebccc3927af", sceneName: "Sheen Textured" },
	{ shaderUUID: "b2793b09-8ba7-4667-8e4d-4730caf62b36", sceneName: "Anisotropy Untextured" },
	{ shaderUUID: "8e4a2dda-84e7-43f7-b868-bd71a32f590b", sceneName: "Anisotropy Textured" },
	{ shaderUUID: "b3df43be-3a64-44e5-a665-327e5e572c10", sceneName: "ClearCoat Untextured" },
	{ shaderUUID: "28fa4cca-a9f0-4f29-9f01-048c29611da6", sceneName: "ClearCoat Textured" },
];


window.addEventListener("load", initApp);

async function initApp() {
	let userID = null;
	let userToken = null;
	let sceneUUID = null;

	try {
		const usersResponse = await listUsers();
		const users = await usersResponse.json();

		let materialUser = users.find((e) => e.username == MATERIAL_USER_NAME);
		if (materialUser === undefined) {
			const registerResponse = await registerUser(MATERIAL_USER_NAME);
			materialUser = await registerResponse.json();
		}

		userID = materialUser.user_id;

		let token = await (await generateUserToken(userID, "5m")).json();

		userToken = token.user_token;

		await grantAccessToFolder(WORKING_DIR_UUID, "users", userID, "manage");

		if (devSceneUUID !== undefined) {
			sceneUUID = devSceneUUID;
		}
		else if (oneMatrixPerScene) {
			const scene = await (await createAsset(WORKING_DIR_UUID, "scene", "DummyScene")).json();
			sceneUUID = scene.asset_id;
		}
		else {
			const scene = await (await createAsset(WORKING_DIR_UUID, "scene", "DummyScene")).json();
			sceneUUID = scene.asset_id;
		}

	} catch (err) {
		console.log(err);
		return;
	}

	await SDK3DVerse.joinOrStartSession({
		userToken: userToken,
		sceneUUID: sceneUUID,
		canvas: document.getElementById("display-canvas"),
		viewportProperties: {
			defaultControllerType: SDK3DVerse.controller_type.orbit,
		},
	});


	createMatrix(shaders[0].shaderUUID);
}


// Generates a matrix of meshes in the current open scene.
async function createMatrix(shaderUUID)
{
	const entityTemplate = new SDK3DVerse.EntityTemplate();

	// Sphere mesh.
	const previewMeshUUID = "9b3910bc-1b6a-4285-8f71-8656bd507ffc";

	entityTemplate.attachComponent('mesh_ref', {value: previewMeshUUID});
	entityTemplate.attachComponent('material', {shaderRef: shaderUUID, dataJSON: {albedo: [1,0,0], roughness:0.5, metallic:0.5}});

	const size = 5;
	const distance = 2.0;

	/*
	let templates = new Array(size * size).fill(entityTemplate);
	let entities = await SDK3DVerse.engineAPI.instantiateEntities(null, templates);
	*/

	for (let i = 0; i < size; i++) {
		let roughness = i / (size - 1);

		for (let j = 0; j < size; j++) {
			let metalness = j / (size - 1);

			let entity = await entityTemplate.instantiateTransientEntity(`mat_${i}_${j}`, null, true);

			entity.setGlobalTransform({
				position: [(j - (size * 0.5) + 0.5) * distance, 0, (i - (size * 0.5) + 0.5) * distance],
				orientation: [0, 0, 0, 1],
				scale: [1, 1, 1]
			});

			const material = entity.getComponent('material');
			material.dataJSON.roughness = roughness;
			material.dataJSON.metallic = metalness;
			entity.setComponent('material', material);
		}
	}
}
