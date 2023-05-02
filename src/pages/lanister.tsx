import { useEffect, useRef } from "react"
import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
        renderer.shadowMap.enabled = true;
        renderer.setSize(canvasRef.current!.clientWidth, canvasRef.current!.clientHeight);

        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 100;
        const loader = new FBXLoader()
        new OrbitControls(camera, canvasRef.current!)

        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(50, 50, 100);
            scene.add(light);
        }


        const plane = new THREE.Object3D();
        plane.scale.set(1.75, 1.75, 1.75)
        scene.add(plane);

        // Load the model and add it to the plane
        let model: THREE.Group
        loader.load('./lanister.fbx', (object) => {
            // Set the color of the model's material
            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.color.set(0xffffff);
                }
            });
            model = object
            plane.add(object);
        }, undefined, (error) => {
            console.error(error);
        });



        function render(time: number) {
            time *= 0.001;
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }, []);



    return (
        <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh" }}>

        </canvas>
    )
}