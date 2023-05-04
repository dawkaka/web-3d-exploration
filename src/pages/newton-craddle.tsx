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
    const intervalRef = useRef<NodeJS.Timer>()
    useEffect(() => {
        canvasRef.current?.click()
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! })
        const scene = new THREE.Scene()
        {
            const color = 0xFFFFFF;  // white
            const near = 20;
            const far = 100;
            scene.fog = new THREE.Fog(color, near, far);
        }
        const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set(8, 4, 10).multiplyScalar(3);
        camera.lookAt(0, 0, 0);
        const loader = new THREE.TextureLoader()
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

        const actualScene = new THREE.Object3D()
        actualScene.position.y = -1
        scene.add(actualScene)


        const plane = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.MeshPhongMaterial({ color: 0xCC8866 }))
        plane.rotation.x = -0.5 * Math.PI
        // actualScene.add(plane)

        const board = new THREE.Object3D()
        actualScene.add(board)


        const boardHeight = .5
        const boardWidth = 3
        const boardLength = 8

        const baseGeo = new THREE.BoxGeometry(boardWidth, boardHeight, boardLength)
        const baseMesh = new THREE.Mesh(baseGeo, new THREE.MeshPhongMaterial({ map: loader.load("./wood.jpg") }))
        baseMesh.position.y = boardHeight / 2
        board.add(baseMesh)

        const cylinderHeight = 5
        const cylinderRadius = .125

        const cylinderGeo = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 12, 12)
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

        const ballRadius = (boardLength * 0.5) / 5 * .5
        const cent70 = boardLength * 0.5
        const ballPositions = [
            { z: cent70 / 2 - ballRadius - 0.09 },
            { z: cent70 / 2 - (ballRadius * 3) },
            { z: cent70 / 2 - (ballRadius * 5) },
            { z: cent70 / 2 - (ballRadius * 7) },
            { z: cent70 / 2 - (ballRadius * 9) + 0.09 },
        ]

        const balls = ballPositions.map(pos => {
            const ballArea = new THREE.Object3D()
            ballArea.position.y = cylinderHeight + boardHeight
            ballArea.position.z = pos.z
            board.add(ballArea)

            const ballGeo = new THREE.SphereGeometry(ballRadius, 12, 12)
            const ballMesh = new THREE.Mesh(ballGeo, new THREE.MeshPhongMaterial({ color: "silver" }))
            ballMesh.position.y = 0 - cylinderHeight + boardHeight + 1.5
            ballArea.add(ballMesh)

            return [ballArea, ballMesh]
        })
        const loc = new THREE.Vector3()
        const stringLength = cylinderHeight - 1.5 - ballRadius / 2

        const lines = ballPositions.map((pos, ind) => {
            const handle = new THREE.Object3D()
            handle.position.y = cylinderHeight + boardHeight
            handle.position.z = pos.z
            handle.position.x = -1 * (boardWidth / 2 - cylinderRadius * 2)
            const geo = new THREE.BoxGeometry(.0125, .0125, stringLength)
            const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF })
            const lineOne = new THREE.Mesh(geo, material)
            lineOne.position.z = stringLength / 2

            balls[ind][1].getWorldPosition(loc)
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


        const arc = new THREE.ArcCurve(-0.025, ballRadius, stringLength + ballRadius * 0.25, -0.5 * Math.PI, 0.5 * Math.PI, false)

        // {
        //     let tt = balls[0]
        //     let t = tt[1]
        //     const points = arc.getPoints(50)
        //     const geo = new THREE.BufferGeometry().setFromPoints(points)
        //     const a = new THREE.Line(geo, new THREE.MeshBasicMaterial({ color: "white" }))
        //     a.rotation.y = - 0.5 * Math.PI
        //     tt[0].add(a)
        // }

        const listener = new THREE.AudioListener();
        camera.add(listener);

        // create a global audio source
        const sound = new THREE.Audio(listener);

        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('./fart.mp3', function (buffer) {
            sound.setBuffer(buffer);
            sound.setVolume(1);
        });

        let target = 0
        const ballPosition = new THREE.Vector2()
        function render(time: number) {
            time *= 0.001
            if (addjust(renderer)) {
                const canvas = canvasRef.current!
                camera.aspect = canvas.width / canvas.height
                camera.updateProjectionMatrix()
            }

            const speed = time * 1;
            let targetPoint = speed % 1
            if (targetPoint > 0.5) {
                targetPoint = 0.5 - (targetPoint - 0.5)
            }
            arc.getPointAt(targetPoint, ballPosition);
            const ball = balls[target][1]

            if (target === 0) {
                ball.position.set(ball.position.x, ballPosition.y, ballPosition.x);
            } else {
                ball.position.set(ball.position.x, ballPosition.y, -1 * ballPosition.x);
            }

            actualScene.rotation.y = time * 0.1

            balls.forEach((ball, ind) => {
                ball[1].getWorldPosition(loc)
                lines[ind].forEach(l => {
                    l.lookAt(loc)
                })
            })



            if (Math.floor(time) % 2 === 0) {
                if (target !== 0) {
                    sound.stop()
                    sound.play()
                }
                target = 0
            } else {
                if (target === 0) {
                    sound.stop()
                    sound.play()
                }
                target = balls.length - 1
            }

            renderer.render(scene, camera)
            requestAnimationFrame(render)
        }

        requestAnimationFrame(render)
        return () => {
            clearInterval(intervalRef.current)
        }

    }, [])

    return (
        <canvas ref={canvasRef} style={{ height: "100vh", width: "100vw" }}></canvas>
    )
}

export function addjust(renderer: THREE.WebGLRenderer) {
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