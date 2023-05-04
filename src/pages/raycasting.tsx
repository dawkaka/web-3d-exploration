import { useEffect, useRef } from "react"
import * as THREE from "three"
import { addjust } from "./newton-craddle"

export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! })
        const scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 7
        camera.position.y = 2

        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(1, 2, 4);
            scene.add(light);
        }

        const b1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({ color: "red" }))
        scene.add(b1)
        const b2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({ color: "red" }))
        b2.position.x = -2
        const b3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({ color: "red" }))
        b3.position.x = 2
        scene.add(b2, b3)

        const mouse = new THREE.Vector2()

        window.addEventListener("mousemove", (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        })

        const raycast = new THREE.Raycaster()

        function render() {
            if (addjust(renderer)) {
                const canvas = canvasRef.current!
                camera.aspect = canvas.width / canvas.height
                camera.updateProjectionMatrix()
            }
            raycast.setFromCamera(mouse, camera)
            const intersects = raycast.intersectObjects([b1, b2, b3])

            if (intersects.length > 0) {

                const target = intersects[0]
                if (target.object instanceof THREE.Mesh) {
                    target.object.material.color.set("blue")
                }
            } else {
                b1.material.color.set("red")
                b2.material.color.set("red")
                b3.material.color.set("red")

            }

            renderer.render(scene, camera)
            requestAnimationFrame(render)

        }

        requestAnimationFrame(render)

    }, [])

    return (
        <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh" }}></canvas>
    )
}