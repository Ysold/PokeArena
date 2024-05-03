import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { UI } from "./components/UI";

function App() {
  return (
    <>
      <Canvas shadows camera={{ position: [2, 30, 50], fov: 75, near: 0.5 }}>
        <color attach="background" args={["#87CEEB"]} />
        <Experience />
        <EffectComposer>
          <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} height={100} intensity={1.22}/>
        </EffectComposer>
      </Canvas>
      <UI />
    </>
  );
}

export default App;
