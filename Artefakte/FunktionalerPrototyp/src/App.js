/*
- Nützliche Links -

// https://www.youtube.com/watch?v=kxXaIHi1j4w
// https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models
//https://onion2k.github.io/r3f-by-example/examples/hooks/rotating-cube/
//https://codesandbox.io/s/splines-3k4g6?file=/src/Nodes.js:148-265
//https://codesandbox.io/s/basic-clerping-example-qh8vhf?file=/src/Scene.js
// https://www.youtube.com/watch?v=LNvn66zJyKs https://onion2k.github.io/r3f-by-example/

// https://codesandbox.io/s/example-f8t3w?file=/src/App.js:4177-4370 // GUI Example

*/

import './App.css';
import { Canvas, extend, useThree } from '@react-three/fiber';
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { PerspectiveCamera } from "@react-three/drei";
import React, { useState, useRef, useLayoutEffect, useReducer, Suspense, useEffect  } from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'

// Eigene Scripts //

import {findPath, findPathSimple} from "./test/FindPath";
import {importPathMesh} from "./test/ImportPathMesh";
import {RenderChild, Thing, AddNewPointRandom, BadCode} from "./buildingGen"
import {MeshClickable, MeshNOTClickable, ImportMeshesFromOBJ, meshcollection} from "./test/MeshFunctions";
import { hover } from '@testing-library/user-event/dist/hover';

import {EffectComposer, DepthOfField, Bloom, Noise, Vignette, Outline, Selection, Select} from '@react-three/postprocessing'

/*
!- Hooks -!
- Hooks starten immer mit use (useState, useEffekt, useReducer...)
- Hooks sind immer am start einer funktion

useState: wenn sich etwas ändert -> Re-render UI | Aufbau const [value/var, setter] = useState() 
useEffekt: wird immer aufberufen im fall dass sich eins state ändert
useRef: ähnlich wie useState, nur dass es die UI nicht neu rendert
useReducer: Komplexe version von useState das eine funktion aufrufen kann


Bieten die Möglichkeit, State in Functional Components zu nutzen, was bisher nur in Class Components möglich war.
*/ 

const Scene = () => {

  const[showEtage3, setshowEtage3] = useState(true)
  const[showEtage2, setshowEtage2] = useState(true)
  const[showEtage1, setshowEtage1] = useState(true)
  const[showEtage0, setshowEtage0] = useState(true)

  // Setting const
  const [wegpunkt1, setWegpunkt1] = useState();
  const [wegpunkt2, setWegpunkt2] = useState();

  const [treppeRadio, setTreppeRadio] = useState(true);
  const [aufzugRadio, setAufzugRadio] = useState(null);
  const [popupTrigger, setPopupTrigger] = useState(null);




 //kamera = true ist die normale kamera, false orthographisch
  const [kamera, set] = useState(true)
//  const rotierbarkeit = (kamera ? true : false)


  const [wegPunkte, setWegPunkte] = useState(null)

  const activeRooms = []

    // Fügt dem Array über uns den angeklickten vector hinzu
    function raumauswahl(state, action) {
    
      const vecToArray = action.payloade.slice(-3)
      // Increment = Raum ist Aktiv, Decrement = Raum ist inaktiv 
      switch (action.type) {
        case 'increment':
          
          // wenn unser arrayWithActiveRooms leer ist müssen wir nicht schauen ob es den ausgewählten draum im array doppelt gibt 
          if(activeRooms.length <= 0){
            activeRooms.push(vecToArray)
            } else {
              var inArray = false
              // Geht den array Durch und schaut nach doppelten einträgen
              activeRooms.forEach(element => {
                if(JSON.stringify(element) == JSON.stringify(vecToArray)){
                  inArray = true
                }
                });
                if(!inArray){
                  activeRooms.push(vecToArray)
                }
            }
  
          return
        case 'decrement':
          if(JSON.stringify(activeRooms[0]) == JSON.stringify(vecToArray)){
            activeRooms.splice(0, 1);
          }
          
          if (JSON.stringify(activeRooms[1]) == JSON.stringify(vecToArray)){
            activeRooms.splice(1, 1);
          } 
            return
        default:
          throw new Error();
      }
    }
  
  // Gebäude !-Pathfinding ist in der buildingGen.js-!

  const AddEtage03Raeume = () => { return ImportMeshesFromOBJ("obj/Main_Etage_03_Raeume.obj",true, "#ff0000", "yellow", "green", raumauswahl, activeRooms)}

  function AddEtage03Geo(){
    return ImportMeshesFromOBJ("obj/Main_Etage_03_Geo.obj",false, "#aaaaaa", "", "", raumauswahl, activeRooms)}
  function AddEtage02Raeume(){
    return ImportMeshesFromOBJ("obj/Main_Etage_02_Raeume.obj",true, "#cc0000", "yellow", "green", raumauswahl, activeRooms)}
  function AddEtage02Geo(){
    return ImportMeshesFromOBJ("obj/Main_Etage_02_Geo.obj",false, "#999999", "", "", raumauswahl, activeRooms)}
  function AddEtage01Raeume(){
    return ImportMeshesFromOBJ("obj/Main_Etage_01_Raeume.obj",true, "#880000", "yellow", "green", raumauswahl, activeRooms)}
  function AddEtage01Geo(){
    return ImportMeshesFromOBJ("obj/Main_Etage_01_Geo.obj",false, "#888888", "", "", raumauswahl, activeRooms)}
  function AddEtage00Raeume(){
    return ImportMeshesFromOBJ("obj/Main_Etage_00_Raeume.obj",true, "#440000", "yellow", "green", raumauswahl, activeRooms)}
  function AddEtage00Geo(){
    return ImportMeshesFromOBJ("obj/Main_Etage_00_Geo.obj",false, "#666666", "", "", raumauswahl, activeRooms)}
  function AddStairs(){
    return ImportMeshesFromOBJ("obj/Stairs.obj",false, "#66aa66", "", "", raumauswahl, activeRooms)}
  function AddElevators(){
    return ImportMeshesFromOBJ("obj/Elevators.obj",false, "#5566bb", "", "", raumauswahl, activeRooms)}
  function AddGround(){
    return ImportMeshesFromOBJ("obj/Ground.obj",false, "#222222", "", "", raumauswahl, activeRooms)}


  const meshcollectionZ = meshcollection[0]
 
  /* Kamera einstellung und erstellung */
  function SwitchCam() {
    return (
      <div className="SwitchCam">
        <button onClick={() => set(!kamera)}>Switch cam</button>
      </div>
    )
  }

  /* ALLES MIT LINIEN IST HIER*/
  /* Linien gen https://codesandbox.io/s/r3f-line-adding-points-workaround-11g9h?file=/src/index.js */

  async function meshImport(){
    const pathMesh = await importPathMesh("obj/pathMesh.obj")
    return pathMesh
  }

  async function wegBerechnung(start, ende){
    const pathMesh = await importPathMesh("obj/pathMesh.obj")
    //console.log(pathMesh[start])
    const pathtest = await findPathSimple(pathMesh[start],pathMesh[ende],pathMesh,true,false)
   return pathtest
  }

function routeBerechnen() {

    setWegPunkte(wegPunkte => [])

    const auswahl1 = Number(activeRooms[0])
    const auswahl2 = Number(activeRooms[1])

    //console.log(auswahl1, auswahl2, activeRooms)
    
    if (auswahl1 > 0 || auswahl2 > 0) {
      const weg =  wegBerechnung(auswahl1, auswahl2)
      weg.then((data) => {
        if(data != null){
          data.map((e) => {
            setWegPunkte((points) => [...(points || [[0, 0, 0]]), [e.x, e.y, e.z]])}
          )
        }
        console.log("--- ende der Berechnung ---")
      })

    } else if (wegpunkt1 != null || wegpunkt2 != null) {
      const testWeg = wegBerechnung(wegpunkt1, wegpunkt2)
      testWeg.then((data) => {
        if(data != null){
          data.map((e) => {
            /* angenommen man hat ein objekt=[ ob1: "a", ob2: "b",ob3: "c" ] dann ist {...objekt} das gleiche wie { ob1="a", ob2="b", ob3="c" } */
            setWegPunkte((points) => [...(points || [[0, 0, 0]]), [e.x, e.y, e.z]])}
          )
        }
      })
    } else {
      console.log("error keine wegpunkte ausgewählt")
    }    
  }

/*
  useEffect(() => {
    const timeoutId = setTimeout(() => console.log(`I can see you're not typing. I can use "${wegpunkt1}" now!`), 1000);
    return () => clearTimeout(timeoutId);
  }, [wegpunkt1]);*/

  const handleRadioButtons = (radioName) => {
      if(radioName === "aufzugRadio") {
        setAufzugRadio(true)
        setTreppeRadio(false)
      } else if(radioName === "treppeRadio") {
        setAufzugRadio(false)
        setTreppeRadio(true)
      }
  };
  
    const start = useRef();
    const ziel = useRef();

    const findID = (stringvonetwas) => {
      var returnThis;
      meshcollection.map((e) => {
        if (e.raumnummer == stringvonetwas) {
          returnThis = e.meshid
        }
      })
      return returnThis
    }

    const submitHandler = (e) => {
      var weg1
      var weg2

      if(start.current.value.length > 3){
        
        const startNeu = findID(start.current.value.replace(".", "")) ;
        const ende = findID(ziel.current.value.replace(".", "")) ;
        weg1 = Number(startNeu)
        weg2 = Number(ende) 
        console.log(weg1)
        console.log(weg2)
      } else {
        weg1 = Number(start.current.value)
        weg2 = Number(ziel.current.value) 
      }

      if (weg1 > 0 || weg2 > 0) {
        const testWeg = wegBerechnung(weg1, weg2)
        testWeg.then((data) => {
          if(data != null){
            data.map((e) => {
              console.log(e)
              /* angenommen man hat ein objekt=[ ob1: "a", ob2: "b",ob3: "c" ] dann ist {...objekt} das gleiche wie { ob1="a", ob2="b", ob3="c" } */
              setWegPunkte((points) => [...(points || [[0, 0, 0]]), [e.x, e.y, e.z]])}
            )
          }
        }) 
      } else {
        routeBerechnen()
      }
    }

 //Fügt das Burger Icon hinzu
 library.add(fas);
 const [isOpen, setOpen] = useState(false);
 // Weg genrieren im UI
  function UiRoute() {    
 
   return (
    <div className="uiRoute">
      <div className={`burgerMenu${isOpen ? " open" : ""}`} onClick={() => setOpen(!isOpen)}>
    </div>

      {isOpen && (
        <div className='background' >
          <div className='menuOpen'>
            <form>
              <input 
                ref={start} 
                placeholder="Start"
              />
              <button
                type="button"
                onClick={(e) => console.log("Element2 das angeklickt wird: ",e)}
                >auswählen
              </button>
            <br/>
              <input 
                ref={ziel} 
                placeholder="Ziel"
              />                  
              <button
                display= "inline-block"
                type="button"
                onClick={(e) => console.log("Element1 das angeklickt wird: ",e)}
              >auswählen
              </button>
            </form>
          </div>
          
          <div className="treppeAufzug">
            <button
              style={{ backgroundColor: treppeRadio ? "#00FA9A" : "#C60C0F" }}
              type="button"
              onClick={() => handleRadioButtons("treppeRadio")}
            >Treppe
            </button>
            <button
              style={{ backgroundColor: aufzugRadio ? "#00FA9A" : "#C60C0F" }}
              type="button"
              onClick={() => handleRadioButtons("aufzugRadio")}
             >Aufzug
             </button>
          </div>
          
          <div className="berechnenButton">
           <button onClick={submitHandler}>Route berechnen</button>
          </div>
        
        </div>
       )}
     </div>
   );
  }


  function LineRenderer({ points }){
    return (
      <>
        <line position={[0, 0, 0]}>
          <bufferGeometry
            onUpdate={(geom) => {
              geom.setFromPoints(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])))
            }}
          />
          <lineBasicMaterial color="green" linewidth={50}/>
        </line>
      </>
    )
  }


  // Kamera
  function CameraSelection(){
      if (kamera){
          return <PerspectiveCamera position={[-80, 60, 100]} fov={80} makeDefault={true} />
      }else{
          return <OrthographicCamera position={[-60,12, 0]} fov={0} makeDefault={true} rotation={[0,-90,0]} scale={[0.15,0.15,0.15]} />
      }
  }

  function CameraControls(){
      if (kamera){
          return <OrbitControls enableRotate={true} target={[-60,0,0]}/>
      }else{
          return <OrbitControls enableRotate={false} target={[-60,0, 0]}/>
      }
  }


  // Etagen auswahl

  function EtagenAuswahl(){
    return(
      <div className="etagen">
        <button style={{ backgroundColor: showEtage3 ? "#00FA9A" : "#C60C0F" }} onClick={() => setshowEtage3(!showEtage3)}>Etage 3</button>
        <button style={{ backgroundColor: showEtage2 ? "#00FA9A" : "#C60C0F" }} onClick={() => setshowEtage2(!showEtage2)}>Etage 2</button>
        <button style={{ backgroundColor: showEtage1 ? "#00FA9A" : "#C60C0F" }} onClick={() => setshowEtage1(!showEtage1)}>Etage 1</button>
        <button style={{ backgroundColor: showEtage0 ? "#00FA9A" : "#C60C0F" }} onClick={() => setshowEtage0(!showEtage0)}>Etage 0</button>
      </div>
    )
  }


  return ( 
    <>
    <Canvas>



        <CameraSelection />
        <CameraControls />

        <ambientLight 
        intensity={0.5}
        />

        <directionalLight
          castShadow
          shadow-mapSize-height={512}
          shadow-mapSize-width={512}
          intensity={0.5}
        />

        <Selection>
            <EffectComposer autoclear={false}>
                <Outline blur visibleEdgeColor={"white"} hiddenEdgeColor={"black"} edgeStrength={100} width={500} />
                <Vignette darkness={0.9} offset={0.22} eskil={false} />
            </EffectComposer>
            <Select enabled={true}>
                {showEtage3 && <AddEtage03Geo/>}
                {showEtage3 && <AddEtage03Raeume/>}
                {showEtage2 && <AddEtage02Geo/>}
                {showEtage2 && <AddEtage02Raeume/>}
                {showEtage1 &&<AddEtage01Geo/>}
                {showEtage1 &&<AddEtage01Raeume/>}
                {showEtage0 && <AddEtage00Geo/>}
                {showEtage0 && <AddEtage00Raeume/>}
                <AddStairs/>
                <AddElevators/>
                <AddGround/>
            </Select>
        </Selection>



        <LineRenderer points={wegPunkte || [ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0] ]} />

    </Canvas>

    <div className='main'>
      <SwitchCam/>
      <EtagenAuswahl/>
    </div>

    <div className='main2'>
      <UiRoute/>
    </div>

  </>
  );
};

// 
const App = () => {
  return <Scene />
};


export default App;


    // Array.from generiert einen array mit 3 random werten bzw einen array mit der länge 3 deren werte random sind
    //const next = Array.from({ length: 3 }).map(() => Math.random() * extent * 2 - extent)

    
  /*
  the useThree hook gives you access to the state model which contains
   the default renderer, the scene, your camera, and so on. 
   It also gives you the current size of the canvas in screen and viewport coordinates.
   https://docs.pmnd.rs/react-three-fiber/api/hooks
  */
/*

<input
            id= "startpunkt"
            onInput={(e) => setWegpunkt1(e.target.value)}
            value={wegpunkt1 ? wegpunkt1 : ""}
            type="number"
            placeholder="Start"
          />
          <input
            id= "zielpunkt"
            onChange={(e) => setWegpunkt2(e.target.value)}
            value={wegpunkt2 ? wegpunkt2 : ""}
            type="number"
            placeholder="Ziel"
          />

*/