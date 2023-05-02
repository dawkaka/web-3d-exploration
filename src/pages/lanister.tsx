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

        canvasRef.current?.addEventListener('mousemove', (event) => {
            // Calculate the mouse position in the scene
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / canvasRef.current!.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / canvasRef.current!.clientHeight) * 2 + 1;
            let degrees = getMouseDegrees(event.clientX, event.clientY, 25);
            plane.rotation.y = degrees.x * Math.PI / 180
            plane.rotation.x = degrees.y * Math.PI / 180

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

function getMouseDegrees(x: number, y: number, degreeLimit: number) {
    let dx = 0,
        dy = 0,
        xdiff,
        xPercentage,
        ydiff,
        yPercentage;

    let w = { x: window.innerWidth, y: window.innerHeight };
    if (x <= w.x / 2) {
        xdiff = w.x / 2 - x;
        xPercentage = (xdiff / (w.x / 2)) * 100;
        dx = ((degreeLimit * xPercentage) / 100) * -1;
    }
    if (x >= w.x / 2) {
        xdiff = x - w.x / 2;
        xPercentage = (xdiff / (w.x / 2)) * 100;
        dx = (degreeLimit * xPercentage) / 100;
    }
    if (y <= w.y / 2) {
        ydiff = w.y / 2 - y;
        yPercentage = (ydiff / (w.y / 2)) * 100;
        dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
    }
    if (y >= w.y / 2) {
        ydiff = y - w.y / 2;
        yPercentage = (ydiff / (w.y / 2)) * 100;
        dy = (degreeLimit * yPercentage) / 100;
    }
    return { x: dx, y: dy };
}