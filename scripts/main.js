import {
	materialUserName,
	oneMatrixPerScene,
	shaders,
	workingDirUUID,
	matrixMeshUUID,
	devSceneUUID,
	matrixSize,
	matrixSpacing,
	matrixDistance
} from "../config.js";

import {
	listUsers,
	registerUser,
	generateUserToken,
	grantAccessToFolder,
	createAsset
} from "./api_calls.js";


const delay = ms => new Promise(res => setTimeout(res, ms));


window.addEventListener("load", initApp);

async function initApp() {
	let userID = null;
	let userToken = null;

	try {
		// Find material generator user, or create one if there's none yet.
		const users = await (await listUsers()).json();

		let materialUser = users.find((e) => e.username == materialUserName);
		if (materialUser === undefined) {
			materialUser = await (await registerUser(materialUserName)).json();
		}
		userID = materialUser.user_id;

		// Create a user token and grant access to working folder.
		let token = await (await generateUserToken(userID, "5m")).json();
		userToken = token.user_token;

		await grantAccessToFolder(workingDirUUID, "users", userID, "manage");

		// Development scene (script testing).
		if (devSceneUUID !== undefined) {
			await withSession(userToken, devSceneUUID, async () => {
				await createMatrix(shaders[0].shaderUUID, [0, 0, 0], false);
			}, true);
		}
		// Generate all matrices in one scene.
		else if (!oneMatrixPerScene) {
			const scene = await (await createAsset(workingDirUUID, "scene", "All Materials")).json();

			await delay(8000);

			await SDK3DVerse.joinOrStartSession({
				userToken: userToken,
				sceneUUID: scene.asset_id,
				canvas: document.getElementById("display-canvas"),
				viewportProperties: {
					defaultControllerType: SDK3DVerse.controller_type.orbit,
				},
			});
			//await withSession(userToken, scene.asset_id, async () => {
				const positionOffset = [0, 0, 0];
				shaders.forEach(async (shader) => {
					await createMatrix(shader.shaderUUID, positionOffset, false);
					positionOffset[0] += matrixSize * matrixSpacing + matrixDistance;
					await createMatrix(shader.shaderUUID, positionOffset, true);
					positionOffset[0] += matrixSize * matrixSpacing + matrixDistance;
				});
			//});

			await SDK3DVerse.disconnectFromSession();
		}
		// Generate one scene per matrix.
		else {
			console.log("Starting one matrix per scene generation...");

			for (const shader of shaders) {
				console.log(`Shader \"${shader.sceneName}\"`);

				const sceneNormal = await (await createAsset(workingDirUUID, "scene", shader.sceneName)).json();
				//const sceneTriplanar = await (await createAsset(workingDirUUID, "scene", shader.sceneName + " Triplanar")).json();

				// Wait before joining the new scene.
				await delay(3000);

				await SDK3DVerse.joinOrStartSession({
					userToken: userToken,
					sceneUUID: sceneNormal.asset_id,
					canvas: document.getElementById("display-canvas"),
					viewportProperties: {
						defaultControllerType: SDK3DVerse.controller_type.orbit,
					},
				});
				//await withSession(userToken, sceneNormal.asset_id, async () => {
					await createMatrix(shader.shaderUUID, [0, 0, 0], false);
				//});

				await SDK3DVerse.disconnectFromSession();

				/*await delay(2000);
				await withSession(userToken, sceneTriplanar.asset_id, async () => {
					await createMatrix(shader.shaderUUID, [0, 0, 0], true);
				});*/
			}
		}

	} catch (err) {
		console.log(err);
		return;
	}
}


async function withSession(userToken, sceneUUID, callback, noDisconnect=false)
{
	await SDK3DVerse.joinOrStartSession({
		userToken: userToken,
		sceneUUID: sceneUUID,
		canvas: document.getElementById("display-canvas"),
		viewportProperties: {
			defaultControllerType: SDK3DVerse.controller_type.orbit,
		},
	});

	await callback();

	if (!noDisconnect) {
		await SDK3DVerse.disconnectFromSession();
	}
}

// Generates a matrix of meshes in the current open scene.
async function createMatrix(shaderUUID, positionOffset, triplanar)
{
	let templates = [];
	for (let i = 0; i < matrixSize; i++) {
		let roughness = i / (matrixSize - 1);

		for (let j = 0; j < matrixSize; j++) {
			let metallic = j / (matrixSize - 1);

			const template = new SDK3DVerse.EntityTemplate();

			template.attachComponent('debug_name', {value: `mat_${i}_${j}`});
			template.attachComponent('mesh_ref', {value: matrixMeshUUID});
			template.attachComponent('material', {shaderRef: shaderUUID, dataJSON: {albedo: [1,0,0], roughness: roughness, metallic: metallic}, constantsJSON: {"MATERIAL_TRIPLANAR": triplanar}});
			template.attachComponent('local_transform', {
				position: [
					positionOffset[0] + (j - (matrixSize * 0.5) + 0.5) * matrixSpacing,
					positionOffset[1],
					positionOffset[2] + (i - (matrixSize * 0.5) + 0.5) * matrixSpacing],
				orientation: [0, 0, 0, 1],
				scale: [1, 1, 1]
			});

			templates.push(template);
		}
	}

	await SDK3DVerse.EntityTemplate.instantiateEntities(null, templates);
}
