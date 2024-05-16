
export const apiToken = "";

// Replace asset UUIDs:
// - Go to the Asset Browser page.
// - Double click on the Public folder to open it.
// - Select an asset and copy the Asset UUID to replace it below.

export const materialUserName = "material-matrix-generator";
export const workingDirUUID = "680ca3a8-f39a-488f-9a57-84c56c58e338";
export const matrixMeshUUID = "9b3910bc-1b6a-4285-8f71-8656bd507ffc";

// (For development tests) Use an existing scene to create the material matrices.
export const devSceneUUID = undefined;//"77c5df58-d092-4f22-a737-73312b5de913";

// Use this parameter to split material matrices into multiple scenes.
export const oneMatrixPerScene = true;

// Side size of one matrix (number of entities will be matrixSize^2).
export const matrixSize = 5;

// Spacing between each entity within one matrix.
export const matrixSpacing = 2.0;

// Distance between two matrices.
export const matrixDistance = 1.0;

// List of all shaders in their textured and non-textured variants.
// Triplanar variants are generated automatically.
// You can add yours below.
export const shaders = [
	{ shaderUUID: "744556b0-67b5-4329-ba4f-a04c04f92b1c", sceneName: "Standard Untextured" },
	{ shaderUUID: "723b3aa5-cc92-4897-9830-92eb89dbae03", sceneName: "Standard Textured" },
	/*{ shaderUUID: "9d07f1f4-5442-4a65-b58c-509528f33ab3", sceneName: "Sheen Untextured" },
	{ shaderUUID: "1dfc716d-9df7-438d-8290-0ebccc3927af", sceneName: "Sheen Textured" },
	{ shaderUUID: "b2793b09-8ba7-4667-8e4d-4730caf62b36", sceneName: "Anisotropy Untextured" },
	{ shaderUUID: "8e4a2dda-84e7-43f7-b868-bd71a32f590b", sceneName: "Anisotropy Textured" },
	{ shaderUUID: "b3df43be-3a64-44e5-a665-327e5e572c10", sceneName: "ClearCoat Untextured" },
	{ shaderUUID: "28fa4cca-a9f0-4f29-9f01-048c29611da6", sceneName: "ClearCoat Textured" },*/
];
