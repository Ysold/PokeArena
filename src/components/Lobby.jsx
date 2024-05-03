import {
  Billboard,
  Box,
  CameraControls,
  Image,
  PerspectiveCamera,
  Text,
  useGLTF,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { myPlayer, usePlayersList } from "playroomkit";
import { useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import { audios, playAudio } from "../utils/AudioManager";
import { Pokemon } from "./Pokemon";
import { NameEditingAtom } from "./UI";


const POKEMON_SPACING = 2.5;

export const Lobby = () => {

    const controls = useRef();
    const me = myPlayer();
    const players = usePlayersList(true);
    const { scene } = useGLTF("models/lobby1.glb");
    const [_nameEditing, setNameEditing] = useAtom(NameEditingAtom);

    const viewport = useThree((state) => state.viewport);
    const cameraReference = useRef();
    const adjustCamera = () => {
        const distFactor = 150 / viewport.getCurrentViewport(cameraReference.current, new Vector3(0, 0, 0)).width;
        controls.current.setLookAt(
            2 * distFactor, 
            30 * distFactor, 
            50 * distFactor, 
            0, 
            0.15, 
            0, 
            true
        );
    };

    useFrame(({clock}) => {
      controls.current.camera.position.x +=
        Math.sin(clock.getElapsedTime() * 0.5) * 2;
      controls.current.camera.position.y += 
        Math.sin(clock.getElapsedTime() * 1) * 0.125;
    });

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
            <PerspectiveCamera ref={cameraReference} position={[2, 30, 50]} fov={75} />
            <CameraControls ref={controls} />
            <directionalLight position={[11, 81, 81]} intensity={1} castShadow />
            {players.map((player, index) => (
                <group key={player.id} position={[
                  index * POKEMON_SPACING - ((players.length -  1) * POKEMON_SPACING) / 2, 
                  27.6, 
                  40
                  ]}
                    scale={0.8}
                  >
                    <Billboard position-y={2.1} position-x={0.5}>
                      <Text fontSize={0.34} anchorX={"right"}>
                        {player.state.name || player.state.profile.name}
                        <meshBasicMaterial color="white" />
                      </Text>
                      <Text
                        fontSize={0.34}
                        anchorX={"right"}
                        position-x={0.02}
                        position-y={-0.02}
                        position-z={-0.01}
                        >
                          {player.state.name || player.state.profile.name}
                          <meshBasicMaterial color="black" transparent opacity={0.8} />
                      </Text>
                      <Image
                        position-x={0.2}
                        scale={0.3}
                        url="\images\edit.png"
                        transparent
                        onClick={() => setNameEditing(true)}
                      />
                      <Image
                        position-x={0.2 + 0.02}
                        position-y={-0.02}
                        position-z={-0.01}
                        scale={0.3}
                        url="\images\edit.png"
                        transparent
                        color="black"
                      />
                    </Billboard>
                    <group position-y={player.id === "me" ? 0.15 : 0}>
                      <PokemonSwitcher player={player} />
                    </group>
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

const SWITCH_DURATION = 600;

const PokemonSwitcher = ({ player }) => {
  const changedPokemonAt = useRef(0);
  const container = useRef();
  const [pokemonModel, setCurrentPokemonModel] = useState(player.getState("pokemon"));
  useFrame(() => {
    const timeSinceChange = Date.now() - changedPokemonAt.current;
    if (timeSinceChange < SWITCH_DURATION / 2) {
      container.current.rotation.y +=
        2 * (timeSinceChange / SWITCH_DURATION / 2);
      container.current.scale.x =
        container.current.scale.y =
        container.current.scale.z =
          1 - timeSinceChange / SWITCH_DURATION / 2;
    } else if (timeSinceChange < SWITCH_DURATION) {
      container.current.rotation.y +=
        4 * (1 - timeSinceChange / SWITCH_DURATION);
      container.current.scale.x =
        container.current.scale.y =
        container.current.scale.z =
          timeSinceChange / SWITCH_DURATION;
      if (container.current.rotation.y > Math.PI * 2) {
        container.current.rotation.y -= Math.PI * 2;
      }
    }
    if (timeSinceChange >= SWITCH_DURATION) {
      container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        Math.PI * 2,
        0.1
      );
    }
  }, []);
  const newPokemon = player.getState("pokemon");
  if (newPokemon !== pokemonModel) {
    playAudio(audios.pokemon_selected);
    changedPokemonAt.current = Date.now();
    setTimeout(() => {
      setCurrentPokemonModel(newPokemon);
    }, SWITCH_DURATION / 2);
  }
  return (
    <group ref={container}>
      <Pokemon model={pokemonModel} />
    </group>
  );
};

useGLTF.preload("models/lobby1.glb");