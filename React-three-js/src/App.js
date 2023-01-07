import './App.css';
// https://www.youtube.com/watch?v=kxXaIHi1j4w
import { Canvas, extend } from '@react-three/fiber';
import glsl from "babel-plugin-glsl/macro"
import { PositionPoint, shaderMaterial } from '@react-three/drei';
import * as THREE from "three";

// https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { Suspense } from "react";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";

//https://codesandbox.io/s/basic-clerping-example-qh8vhf?file=/src/Scene.js
import { PerspectiveCamera } from "@react-three/drei";
import { Box, Plane, Text } from "@react-three/drei";
import { useEffect, useState, useRef  } from "react";
import { useFrame, useThree } from "@react-three/fiber";

//https://onion2k.github.io/r3f-by-example/examples/hooks/rotating-cube/
import { render } from "react-dom";

const Scene = () => {
  const cube = useRef()

  var x = "green"

  //OBJ Loader
    const materials = useLoader(MTLLoader, "obj/testGeo.mtl");
    const obj = useLoader(OBJLoader, "obj/testGeo.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const [active, setActive] = useState(false)
  

  function Boxx(props) {
    
    const mesh = useRef()
    
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    
    useFrame((state, delta) => (mesh.current.rotation.x += delta))
    
    return (
      <mesh
        {...props}
        ref={mesh}
        scale={active ? 1.5 : 1}
        onClick={(event) => setActive(!active)}

        //Hover
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}>

        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'green' : 'red'} color={active ? 'green' : 'red'} />
      </mesh>

    )
  }

  var testBox1 = <Boxx position={active ? [26.5,13,39.5]  : [26.5,12,39.5]} />;
  var testBox2 = <Boxx position={active ? [-6,13,-6]  : [-6,12,-6]}/>;

  const tests = [testBox1,testBox2]

 
  return ( 
  <Canvas>
      
      <OrbitControls/>
      
      <ambientLight 
      intensity={0.5}
      />

      <directionalLight
        castShadow
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
        intensity={0.8}
      />
      
      <Suspense fallback={null}>
          <primitive 
            object={obj}
            position={[0, 0, 0]}
            onClick={(e) => {
              if(x == "green"){
                x = "blue"
              } else {
                x = "green"
              }
              console.log(obj)
            }}
            onWheel={(e) => console.log('wheel spins')}
          />
      </Suspense>  

    {tests.map((x) => (x))}
    

  </Canvas>
  );
};

// 
const App = () => {
  return <Scene />
};


export default App;