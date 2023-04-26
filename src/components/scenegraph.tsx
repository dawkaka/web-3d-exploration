import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function SceneGraph() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const objects: THREE.Object3D[] = []
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! })
        const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 1000)
        renderer.setClearColor(0xAAAAAA);
        renderer.shadowMap.enabled = true

        camera.position.set(0, 50, 0);
        camera.up.set(0, 0, 1);
        camera.lookAt(0, 0, 0);

        new OrbitControls(camera, renderer.domElement)

        const scene = new THREE.Scene()

        {
            const color = 0xFFFFFF;
            const intensity = 3;
            const light = new THREE.PointLight(color, intensity);
            scene.add(light)
        }

        const SolarSystem = new THREE.Object3D()
        objects.push(SolarSystem)

        const sphere = new THREE.SphereGeometry(1, 20, 20)

        const SunMesh = new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({ emissive: 0xFFFF00 }))
        SunMesh.scale.set(5, 5, 5)
        SolarSystem.add(SunMesh)
        objects.push(SunMesh)

        const EarthOrbit = new THREE.Object3D()
        EarthOrbit.position.set(13, 0, 0)

        SolarSystem.add(EarthOrbit)
        objects.push(EarthOrbit)

        const EarthMesh = new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 }))
        EarthOrbit.add(EarthMesh)
        objects.push(EarthMesh)

        const MoonMesh = new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 }))
        MoonMesh.scale.set(.5, .5, .5)
        MoonMesh.position.x = 2
        EarthOrbit.add(MoonMesh)
        objects.push(MoonMesh)


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
        scene.add(SolarSystem)


        function render(time: number) {
            time *= 0.001
            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }
            objects.forEach((object, ind) => {
                object.rotation.y = time
            })
            renderer.render(scene, camera)
            requestAnimationFrame(render)
        }

        requestAnimationFrame(render)
    }, [])

    return (
        <canvas ref={canvasRef} style={{
            height: "300px",
            width: "600px",
        }}></canvas>
    )
}

