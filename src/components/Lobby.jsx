import { Box, CameraControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { myPlayer, usePlayersList } from "playroomkit";
import { useEffect, useRef } from "react";
import { Camera, Vector3 } from "three";
import { Pokemon } from "./Pokemon";
import { degToRad } from "three/src/math/MathUtils.js";

export const Lobby = () => {

    const controls = useRef();
    const me = myPlayer();
    const players = usePlayersList(true);
    const { scene } = useGLTF("models/lobby1.glb");

    const viewport = useThree((state) => state.viewport);
    const cameraReference = useRef();
    const adjustCamera = () => {
        const distFactor = 200 / viewport.getCurrentViewport(cameraReference.current, new Vector3(0, 0, 0)).width;
        controls.current.setLookAt(
            2 * distFactor, 
            50 * distFactor, 
            60 * distFactor, 
            0, 
            0.15, 
            0, 
            true
        );
    };

    useEffect(() => {
        const onResize = () => {
          console.log("on resize");
          console.log(viewport.getCurrentViewport(cameraReference.current, new Vector3(0, 0, 0)).width);
          adjustCamera();
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      }, []);

    useEffect(() => {
        scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }, [scene]);

    return (
        <>
            <PerspectiveCamera ref={cameraReference} position={[2, 50, 60]} fov={75} />
            <CameraControls ref={controls} />
            <directionalLight position={[11, 81, 81]} intensity={1} castShadow />
            {players.map((player, index) => (
                <group key={player.id} position={[index * 2, 27.6, 40]}>
                    <Pokemon model={player.getState("pokemon")} />
                    {player.id === "me" && (
                      <>
                        <pointLight
                            position-x={1}
                            position-y={29.6}
                            position-z={40}
                            intensity={2}
                            distance={3}
                        />
                        <group rotation-x={degToRad(-90)} position-y={0.01}>
                          <mesh receiveShadow>
                            <circleGeometry args={[2.2, 64]} />
                            <meshStandardMaterial
                              color="pink"
                              toneMapped={false}
                              emissive={"pink"}
                              emissiveIntensity={1.2}
                            />
                          </mesh>
                        </group>
                        <mesh position-y={0.1} receiveShadow>
                          <circleGeometry args={[2, 29.6, 40.2, 64]} />
                          <meshStandardMaterial color="#8572af" />
                        </mesh>
                        </>
                    )}
            </group>
            ))}
            <primitive object={scene} />
        </>
    );
};

useGLTF.preload("models/lobby1.glb");