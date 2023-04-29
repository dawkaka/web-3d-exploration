import Head from "next/head";
import { useEffect, useRef } from "react";
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Textures() {
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {/* <First /> */}
                <Lose />
            </main>
        </>
    )
}


function Lose() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! })
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(20, 2, 0.1, 1000)
        camera.position.set(-4, 4, 10).multiplyScalar(3);
        camera.lookAt(0, 0, 0);


        new OrbitControls(camera, renderer.domElement)

        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 20, 0);
            scene.add(light);
            light.castShadow = true;
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;

            const d = 100;
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

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.MeshPhongMaterial({ color: 0xCC8866 }))
        plane.rotation.x = -0.5 * Math.PI
        scene.add(plane)

        const board = new THREE.Object3D()
        scene.add(board)

        const boardHeight = .5
        const boardWidth = 3
        const boardLength = 8

        const baseGeo = new THREE.BoxGeometry(boardWidth, boardHeight, boardLength)
        const baseMesh = new THREE.Mesh(baseGeo, new THREE.MeshPhongMaterial({ color: "blue", emissive: "darkblue" }))
        baseMesh.position.y = .25
        board.add(baseMesh)

        const cylinderHeight = 5
        const cylinderRadius = .125

        const cylinderGeo = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight)
        const cylinerMat = new THREE.MeshPhongMaterial({ color: "brown" })

        const cylinderPositions = [
            { x: boardWidth / 2 - cylinderRadius * 2, z: boardLength / 2 - cylinderRadius * 2 },
            { x: -1 * (boardWidth / 2 - cylinderRadius * 2), z: (boardLength / 2 - cylinderRadius * 2) },
            { x: boardWidth / 2 - cylinderRadius * 2, z: -1 * (boardLength / 2 - cylinderRadius * 2) },
            { x: -1 * (boardWidth / 2 - cylinderRadius * 2), z: -1 * (boardLength / 2 - cylinderRadius * 2) },
        ]

        cylinderPositions.forEach(pos => {
            const cylinder = new THREE.Mesh(cylinderGeo, cylinerMat)
            cylinder.position.y = cylinderHeight / 2 + boardHeight
            cylinder.position.x = pos.x
            cylinder.position.z = pos.z
            board.add(cylinder)
        })


        {
            const barsGeo = new THREE.BoxGeometry(.25, .25, boardLength)
            const topLeftMesh = new THREE.Mesh(barsGeo, cylinerMat)
            topLeftMesh.position.y = cylinderHeight + boardHeight
            topLeftMesh.position.x = boardWidth / 2 - cylinderRadius * 2
            board.add(topLeftMesh)

            const topRightMesh = new THREE.Mesh(barsGeo, cylinerMat)
            topRightMesh.position.y = cylinderHeight + boardHeight
            topRightMesh.position.x = -1 * (boardWidth / 2 - cylinderRadius * 2)
            board.add(topRightMesh)

        }

        const ballRadius = (boardLength * 0.6) / 5 * .5
        const cent70 = boardLength * 0.6
        const ballPositions = [
            { z: cent70 / 2 - ballRadius },
            { z: cent70 / 2 - (ballRadius * 3) },
            { z: cent70 / 2 - (ballRadius * 5) },
            { z: cent70 / 2 - (ballRadius * 7) },
            { z: cent70 / 2 - (ballRadius * 9) },
        ]

        const balls = ballPositions.map(pos => {
            const ballGeo = new THREE.SphereGeometry(ballRadius, 12, 12)
            const ballMesh = new THREE.Mesh(ballGeo, new THREE.MeshPhongMaterial({ color: "grey" }))
            ballMesh.position.y = boardHeight + 1.5
            ballMesh.position.z = pos.z
            board.add(ballMesh)
            return ballMesh
        })
        const loc = new THREE.Vector3()

        const lines = ballPositions.map((pos, ind) => {
            const handle = new THREE.Object3D()
            handle.position.y = cylinderHeight + boardHeight
            handle.position.z = pos.z
            handle.position.x = -1 * (boardWidth / 2 - cylinderRadius * 2)
            const stringLength = cylinderHeight - 1.5
            const geo = new THREE.BoxGeometry(.025, .025, stringLength)
            const material = new THREE.MeshPhongMaterial({ color: "green" })
            const lineOne = new THREE.Mesh(geo, material)
            lineOne.position.z = stringLength / 2

            balls[ind].getWorldPosition(loc)
            handle.lookAt(loc)
            handle.add(lineOne)

            const handle2 = new THREE.Object3D()
            handle2.position.y = cylinderHeight + boardHeight
            handle2.position.z = pos.z
            handle2.position.x = (boardWidth / 2 - cylinderRadius * 2)
            const line2 = new THREE.Mesh(geo, material)
            line2.position.z = stringLength / 2

            handle2.add(line2)
            handle2.lookAt(loc)

            board.add(handle, handle2)
            return [handle, handle2]
        })

        function render(time: number) {
            time *= 0.001
            if (addjust(renderer)) {
                const canvas = canvasRef.current!
                camera.aspect = canvas.width / canvas.height
                camera.updateProjectionMatrix()
            }
            balls.forEach((ball, ind) => {
                if (ind === 0) {
                    ball.position.y = Math.sin(time * 2) * 2

                    ball.getWorldPosition(loc)
                    lines[0].forEach(handle => handle.lookAt(loc))
                }
            })
            renderer.render(scene, camera)
            requestAnimationFrame(render)
        }
        requestAnimationFrame(render)


    }, [])

    return (
        <canvas ref={canvasRef} style={{ height: "600px", width: "1200px" }}></canvas>
    )
}





function First() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! })
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000)
        camera.position.z = 2

        const light = new THREE.DirectionalLight(0xFFFFFF, 1)
        light.position.z = 10
        light.position.y = 1
        scene.add(light)

        new OrbitControls(camera, renderer.domElement)
        const loader = new THREE.TextureLoader()

        const materials = [
            new THREE.MeshPhongMaterial({ map: loader.load("./flower-1.jpg"), emissiveIntensity: 0 }),
            new THREE.MeshPhongMaterial({ map: loader.load("./flower-2.jpg"), emissiveIntensity: 0 }),
            new THREE.MeshPhongMaterial({ map: loader.load("./flower-3.jpg"), emissiveIntensity: 0 }),
            new THREE.MeshPhongMaterial({ map: loader.load("./flower-4.jpg"), emissiveIntensity: 0 }),
            new THREE.MeshPhongMaterial({ map: loader.load("./flower-5.jpg"), emissiveIntensity: 0 }),
            new THREE.MeshPhongMaterial({ map: loader.load("./flower-6.jpg"), emissiveIntensity: 0 }),
        ]

        const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials)

        scene.add(cube)

        function render(time: number) {
            time *= 0.001
            if (addjust(renderer)) {
                const canvas = canvasRef.current!
                camera.aspect = canvas.width / canvas.height
                camera.updateProjectionMatrix()
            }
            cube.rotation.x = time * 0.5
            cube.rotation.y = time * 0.5
            cube.rotation.z = time * 0.5

            renderer.render(scene, camera)
            requestAnimationFrame(render)
        }
        requestAnimationFrame(render)
    }, [])

    return (
        <canvas ref={canvasRef} style={{ width: "600px", height: "300px" }} />
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