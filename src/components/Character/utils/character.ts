import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const prepareCharacter = async (gltf: GLTF) => {
    const character = gltf.scene;
    await renderer.compileAsync(character, camera, scene);
    character.traverse((child: any) => {
      if (child.isMesh) {
        const mesh = child as THREE.Mesh;
        child.castShadow = true;
        child.receiveShadow = true;
        mesh.frustumCulled = true;
      }
    });
    setCharTimeline(character, camera);
    setAllTimeline();
    const footR = character.getObjectByName("footR");
    const footL = character.getObjectByName("footL");
    if (footR) footR.position.y = 3.36;
    if (footL) footL.position.y = 3.36;
    return gltf;
  };

  const loadFromUrl = (url: string, revokeAfterLoad = false) =>
    new Promise<GLTF>((resolve, reject) => {
      loader.load(
        url,
        async (gltf) => {
          try {
            resolve(await prepareCharacter(gltf));
          } catch (error) {
            reject(error);
          } finally {
            if (revokeAfterLoad) URL.revokeObjectURL(url);
          }
        },
        undefined,
        (error) => {
          if (revokeAfterLoad) URL.revokeObjectURL(url);
          reject(error);
        }
      );
    });

  const loadEncryptedCharacter = async () => {
    const encryptedBlob = await decryptFile(
      "/models/character.enc",
      "Character3D#@"
    );
    const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));
    return loadFromUrl(blobUrl, true);
  };

  const loadCharacter = async () => {
    try {
      return await loadFromUrl("/models/character.glb");
    } catch (error) {
      console.warn(
        "Unable to load /models/character.glb, falling back to encrypted character.",
        error
      );
      return loadEncryptedCharacter();
    } finally {
      dracoLoader.dispose();
    }
  };

  return { loadCharacter };
};

export default setCharacter;
