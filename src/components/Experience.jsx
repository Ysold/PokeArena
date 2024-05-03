import { OrbitControls } from "@react-three/drei";
import { Game } from "./Game";
import { Lobby } from "./Lobby";
import { useMultiplayerState } from "playroomkit";

export const Experience = () => {

  const [gameState] = useMultiplayerState("gameState", "lobby");
  return (
    <>
      {gameState === "lobby" && <Lobby />}
      {gameState === "game" && <Game />}
    </>
  );
};
