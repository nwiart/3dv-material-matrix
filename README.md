# Material Matrix Generator

## Description

Script used to generate matrices of objects to showcase PBR materials.
Each object has a varying roughness and metalness depending on its position.

This script generates, depending on the configuration, one or multiple scenes
where it will spawn grids of static meshes for each shader specified in `config.js`.


## Run it locally

Replace the following values in [config.js](./config.js) :

- `%YOUR_PUBLIC_TOKEN%` by the public token of your application found in the "API Access" section.
- `%WORKING_DIR_UUID%` by the UUID of the directory to create the scenes in.
- `%PREVIEW_MESH_UUID%` by the UUID of the mesh used for display. It should be something as simple as a sphere.

Then, open the [index.html](./index.html) file in your favorite browser.
