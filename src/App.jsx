import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  return (
    <Canvas shadows camera={{ position: [2, 50, 60], fov: 75 }}>
      <color attach="background" args={["#87CEEB"]} />
      <Experience />
    </Canvas>
  );
}

export default App;
