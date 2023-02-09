import './App.css'
import * as THREE from 'three'
import { useEffect } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function App() {
  let model:THREE.Group;
  let mixer: THREE.AnimationMixer;

  useEffect(() => {
    const sizes = {
      width: innerWidth,
      height: innerHeight,
    };

    const canvas = document.getElementById("canvas")! as HTMLCanvasElement;

    //THREE 場景
    const scene: THREE.Scene = new THREE.Scene();
    //THREE 鏡頭 (鏡頭垂直度, 影像的比例, 影像的最近點, 影像的最遠點) 
    //PS: 影像的範圍 在 遠鏡及近鏡的中間, 並依照比例
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(-10, 5, 15.2);

    //THREE 宣染設定 (指定畫布, 去鋸齒, alpha(更改黑布))
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });

    renderer.setSize(sizes.width, sizes.height);
    //設定在高DPI 顯示器下保持清晰
    renderer.setPixelRatio(window.devicePixelRatio);

    //正方體
    // const geometry: THREE.BoxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    // const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // const cube: THREE.Mesh = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    //import 外來3D model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./models/dog/scene.gltf', (gltf) => {
      model = gltf.scene;
      // model.scale.set(0.7, 0.7, 0.7);
      model.scale.set(0.001, 0.001, 0.0001);
      model.rotation.y = -Math.PI / 3;
      scene.add(model);

      //動畫
      mixer = new THREE.AnimationMixer(model);
      const clips = gltf.animations;
      clips.forEach(function( clip ) {
        const action = mixer.clipAction(clip);
        action.play();
      });
    })

    //燈光及其強度, 沒有燈光, 而素材受燈光影響會變成全黑
    const light = new THREE.AmbientLight( 0x404040, 4 ); // soft white light
    scene.add( light );

    //動畫每秒都要有, 要求Frame
    const Frame = () => {
      renderer.render(scene, camera)
      //如有動畫
      if(mixer) {
        mixer.update(0.002);
      }
      requestAnimationFrame(Frame);
    }

    Frame();
  },[]);
  return (
    <>
      <canvas id='canvas'></canvas>
      <div className="mainContainer">
        <h3>James Yan</h3>
        <p>Web Developer網頁開發</p>
      </div>
    </>
  )
}

export default App
