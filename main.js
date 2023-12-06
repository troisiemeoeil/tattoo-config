import * as BABYLON from "@babylonjs/core"
import "@babylonjs/loaders/glTF";
import { Inspector } from '@babylonjs/inspector';
const canvas = document.getElementById('renderCanvas')
const engine = new BABYLON.Engine(canvas)

const createScene = function () {
  // Creates a basic Babylon Scene object
  const scene = new BABYLON.Scene(engine);
  // Creates and positions a free camera
  scene.createDefaultCameraOrLight(true, true, true);
 var camera = scene.activeCamera;
    camera.alpha +=   Math.PI;

 camera.wheelDeltaPercentage = 0.01
  scene.createDefaultLight()
  
let angle = 0
  
  BABYLON.SceneLoader.ImportMesh('', 'https://rfkdwkpnnalilegqqggx.supabase.co/storage/v1/object/public/troisiemeoeil-bucket/files/prodModelfinal4.glb', '', scene,  function (newMeshes) {
    var canvasRender = engine.getRenderingCanvas();
    var model = newMeshes[0]
    // const matModel = new BABYLON.StandardMaterial()
    // matModel = new BABYLON.Texture('/skinWhite.jpg')
    // matModel.diffuseTexture = matModel
    // newDecal.material = mat;


    const mat = new BABYLON.StandardMaterial()
    const texture = new BABYLON.Texture('/cat.png')
    mat.diffuseTexture = texture
    mat.diffuseTexture.hasAlpha = true
    mat.zOffset = -2
    const mesh = scene.getMeshByName('Object_4')
    // console.log(mesh);
    camera.attachControl(model)
    var lastDecal = null
    
  
   const decalSize = new BABYLON.Vector3(0.02,0.02,0.02)
		var onPointerDown = function () {
      
            if(lastDecal){
                lastDecal.dispose()
            }
          

			// check if we are under a mesh
			var pickInfo = scene.pick(scene.pointerX, scene.pointerY);
			if (pickInfo.hit) {
       
				var newDecal = BABYLON.MeshBuilder.CreateDecal("decal", 
        mesh, 
        {
          position: pickInfo.pickedPoint,
          normal: scene.activeCamera.getForwardRay().direction.negateInPlace().normalize(),
          angle: angle,
          size: decalSize
        });
               
         newDecal.material = mat;
         lastDecal = newDecal
			}
		}
    canvasRender.addEventListener("mousemove", onPointerDown, false);

scene.onDispose = function () {
  canvasRender.removeEventListener("mousemove", onPointerDown);
}
    var rotateMesh = function() {
      var pickInfo = scene.pick(scene.pointerX, scene.pointerY);
      if (pickInfo.hit) {
        window.addEventListener('auxclick', ()=> {
          angle += 0.1
        })
      }
   }
    canvasRender.addEventListener("pointerover", rotateMesh, false);

    scene.onDispose = function () {
      canvasRender.removeEventListener("pointerover", rotateMesh);
    }

    
   


    var shootDecal = function() {
      const hit = scene.pick(scene.pointerX, scene.pointerY)
      if (hit.pickedMesh && hit.pickedMesh.name === "Object_4") {
        var decal = BABYLON.MeshBuilder.CreateDecal("decal", 
        mesh, 
        {
          position: hit.pickedPoint,
          normal: scene.activeCamera.getForwardRay().direction.negateInPlace().normalize(),
          angle: angle,
          size: decalSize
        });
        decal.material = mat;
      }
    }
    canvasRender.addEventListener("click", shootDecal, false);

    scene.onDispose = function () {
      canvasRender.removeEventListener("click", shootDecal);
    }
  })

 
  return scene;
};

const scene = createScene()
engine.runRenderLoop(function(){
  scene.render()
})

window.addEventListener('resize', function(){
  engine.resize()
})


// Inspector.Show(scene, {})