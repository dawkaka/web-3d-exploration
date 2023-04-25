import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Primitives() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current! })
        renderer.setPixelRatio(window.devicePixelRatio);
        const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5)

        new OrbitControls(camera, renderer.domElement)
        camera.position.z = 2;
        const scene = new THREE.Scene()

        const geo = new THREE.CylinderGeometry(.1, .1, .5, 12) //There are many other primitives you can use: Box, Circle, Cone, Shape, Extrude, Text etc
        const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 })
        const cube = new THREE.Mesh(geo, material)
        // scene.add(cube)

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            scene.add(light);
        }

        function makeInstance(color: THREE.ColorRepresentation, x: number): THREE.Mesh<THREE.CylinderGeometry, THREE.MeshPhongMaterial> {
            const m = new THREE.MeshPhongMaterial({ color: color })
            const cube = new THREE.Mesh(geo, m)
            cube.position.x = x
            return cube
        }

        const cubes = [makeInstance("red", -2), makeInstance("yellow", 0), makeInstance("green", 2)]
        cubes.forEach(cube => {
            scene.add(cube)
        })

        function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            return needResize;
        }

        function render(time: number) {
            time *= 0.001
            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }
            cubes.forEach((cube, ind) => {
                let spd = ind + 1
                cube.rotation.x = spd * time
                cube.rotation.y = spd * time
            })
            renderer.render(scene, camera)
            requestAnimationFrame(render)
        }
        requestAnimationFrame(render)
    })

    return (
        <div>
            <canvas ref={canvasRef} style={{
                height: "100%",
                width: "100%",
                display: "block"
            }}></canvas>
        </div>
    )
}

