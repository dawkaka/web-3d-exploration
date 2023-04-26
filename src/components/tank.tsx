import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Tank() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! })
        renderer.setClearColor(0xAAAAAA);
        renderer.shadowMap.enabled = true;

        function makeCamera(fov = 40) {
            const aspect = 2;  // the canvas default
            const zNear = 0.1;
            const zFar = 1000;
            return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
        }

        const camera = makeCamera();
        camera.position.set(8, 4, 10).multiplyScalar(3);
        camera.lookAt(0, 0, 0);
        const scene = new THREE.Scene();

        new OrbitControls(camera, renderer.domElement)

        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 20, 0);
            scene.add(light);
            light.castShadow = true;
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;

            const d = 50;
            light.shadow.camera.left = -d;
            light.shadow.camera.right = d;
            light.shadow.camera.top = d;
            light.shadow.camera.bottom = -d;
            light.shadow.camera.near = 1;
            light.shadow.camera.far = 50;
            light.shadow.bias = 0.001;
        }

        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(1, 2, 4);
            scene.add(light);
        }

        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xCC8866 });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = Math.PI * -0.5
        groundMesh.receiveShadow = true;
        scene.add(groundMesh);

        const h = 1
        const w = 4
        const l = 8

        const tank = new THREE.Object3D()
        scene.add(tank)

        const carGeo = new THREE.BoxGeometry(w, h, l)
        const carMesh = new THREE.Mesh(carGeo, new THREE.MeshPhongMaterial({ color: 0x6688AA }))
        carMesh.scale.set(2, 2, 2)
        carMesh.castShadow = true
        carMesh.position.y = 2.3
        tank.add(carMesh)

        const sphereGeo = new THREE.CylinderGeometry(2, 2, 1, 6)

        const wheel1 = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0x6688AA }))
        wheel1.position.y = 1.7
        wheel1.position.z = 6
        wheel1.position.x = 4.5
        wheel1.rotation.z = 1.6
        wheel1.castShadow = true
        const wheel2 = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0x6688AA }))
        wheel2.position.y = 1.7
        wheel2.position.x = 4.5
        wheel2.rotation.z = 1.6
        wheel2.castShadow = true

        const wheel3 = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0x6688AA }))
        wheel3.position.y = 1.7
        wheel3.position.z = -6
        wheel3.position.x = 4.5
        wheel3.rotation.z = 1.6
        wheel3.castShadow = true

        const wheel4 = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0x6688AA }))
        wheel4.position.y = 1.7
        wheel4.position.z = -6
        wheel4.position.x = -4.5
        wheel4.rotation.z = 1.6
        wheel4.castShadow = true

        const wheel5 = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0x6688AA }))
        wheel5.position.y = 1.7
        wheel5.position.x = -4.5
        wheel5.rotation.z = 1.6
        wheel5.castShadow = true

        const wheel6 = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0x6688AA }))
        wheel6.position.y = 1.7
        wheel6.position.z = 6
        wheel6.position.x = -4.5
        wheel6.rotation.z = 1.6
        wheel6.castShadow = true
        const wheels = [wheel1, wheel2, wheel3, wheel4, wheel5, wheel6]

        tank.add(wheel1)
        tank.add(wheel2)
        tank.add(wheel3)
        tank.add(wheel4)
        tank.add(wheel5)
        tank.add(wheel6)

        function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            return needResize
        }

        function render(time: number) {
            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            wheels.forEach((wheel) => {
                wheel.rotation.x = time * 0.003
            })

            renderer.render(scene, camera)
            requestAnimationFrame(render)
        }
        requestAnimationFrame(render)
    }, [])

    return (
        <canvas ref={canvasRef}
            style={{
                height: "500px",
                width: "1000px",
            }}
        >
        </canvas>
    )
}