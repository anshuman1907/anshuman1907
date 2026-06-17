import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { decryptFile } from "./decrypt";

const basePath = import.meta.env.BASE_URL || "./";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(`${basePath}draco/`);
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async () => {
    try {
      const encryptedBlob = await decryptFile(
        `${basePath}models/character.enc?v=2`,
        "MyCharacter12"
      );
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

      return new Promise<GLTF | null>((resolve, reject) => {
        loader.load(
          blobUrl,
          async (gltf) => {
            const character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child) => {
              const mesh = child as THREE.Mesh;
              if (!mesh.isMesh) return;

              if (mesh.material) {
                if (mesh.name === "BODY.SHIRT") {
                  const newMat = (
                    mesh.material as THREE.Material
                  ).clone() as THREE.MeshStandardMaterial;
                  newMat.color = new THREE.Color("#8B4513");
                  mesh.material = newMat;
                } else if (mesh.name === "Pant") {
                  const newMat = (
                    mesh.material as THREE.Material
                  ).clone() as THREE.MeshStandardMaterial;
                  newMat.color = new THREE.Color("#000000");
                  mesh.material = newMat;
                }
              }

              child.castShadow = true;
              child.receiveShadow = true;
              mesh.frustumCulled = true;
            });
            resolve(gltf);
            const footR = character.getObjectByName("footR");
            const footL = character.getObjectByName("footL");
            if (footR) footR.position.y = 3.36;
            if (footL) footL.position.y = 3.36;

            URL.revokeObjectURL(blobUrl);
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            URL.revokeObjectURL(blobUrl);
            reject(error);
          }
        );
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return { loadCharacter };
};

export default setCharacter;
