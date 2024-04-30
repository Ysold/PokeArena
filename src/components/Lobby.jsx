import { Box, CameraControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { usePlayersList } from "playroomkit";
import { useEffect, useRef } from "react";
import { Camera, Vector3 } from "three";

export const Lobby = () => {

    const controls = useRef();

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
                <group key={player.id} position={[index * 2, 27, 40]}>
                    <Box>
                        <meshBasicMaterial color={"white"} />
                    </Box>
            </group>
            ))}
            <primitive object={scene} />
        </>
    );
};

useGLTF.preload("models/lobby1.glb");