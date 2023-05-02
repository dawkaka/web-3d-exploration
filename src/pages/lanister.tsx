import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
        renderer.shadowMap.enabled = true;
        renderer.setSize(canvasRef.current!.clientWidth, canvasRef.current!.clientHeight);

        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 100;
        const loader = new FBXLoader()

        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(50, 50, 100);
            scene.add(light);
        }


        const plane = new THREE.Object3D();
        plane.scale.set(2, 2, 2)
        scene.add(plane);

        // Load the model and add it to the plane
        let model: THREE.Object3D
        loader.load('./lanister.fbx', (object) => {
            // Set the color of the model's material
            setLoading(false)
            object.traverse((child) => {
                console.log(child.name)
                if (child.name === "TyrionHair" && child instanceof THREE.Mesh) {
                    model = child
                    child.material.color.set("yellow")
                } else if (child instanceof THREE.Mesh) {
                    child.material.color.set(0xffffff);
                }
            });
            plane.add(object);
        }, () => {
            setLoading(true)

        }, (error) => {
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


        function render() {
            if (addjust(renderer)) {
                const canvas = canvasRef.current!
                camera.aspect = canvas.width / canvas.height
                camera.updateProjectionMatrix()
            }
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }, []);


    return (
        <div>
            {loading && <p style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 10, color: "white" }}>Loading...</p>}
            <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh" }}></canvas>
        </div>
    )
}

function addjust(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement
    let needs = false
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    needs = canvas.width !== width || canvas.height !== height
    if (needs) {
        renderer.setSize(width, height, false);
    }
    return needs
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