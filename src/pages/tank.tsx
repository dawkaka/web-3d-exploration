import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Tank() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! })
        renderer.setClearColor(0xAAAAAA);
        renderer.shadowMap.enabled = true;
        renderer.setSize(canvasRef.current!.clientWidth, canvasRef.current!.clientHeight);


        function makeCamera(fov = 40) {
            const aspect = window.innerWidth / window.innerHeight;  // the canvas default
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

        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xCC8866 });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = Math.PI * -0.5
        groundMesh.receiveShadow = true;
        scene.add(groundMesh);

        const carHeight = 1
        const carWidth = carHeight * 4
        const carLength = carWidth * 2

        const tank = new THREE.Object3D()
        scene.add(tank)

        const carGeo = new THREE.BoxGeometry(carWidth, carHeight, carLength)
        const carMesh = new THREE.Mesh(carGeo, new THREE.MeshPhongMaterial({ color: 0x6688AA }))
        carMesh.castShadow = true
        carMesh.position.y = carHeight * 1.5
        tank.add(carMesh)


        const wheelRad = carHeight
        const wheelTickness = carHeight / 2
        const sphereGeo = new THREE.CylinderGeometry(wheelRad, wheelRad, wheelTickness, 6)

        let wheelsPositions = [
            { x: carWidth / 2 + wheelTickness / 2, z: carLength / 2 - wheelRad },
            { x: carWidth / 2 + wheelTickness / 2, z: 0 },
            { x: carWidth / 2 + wheelTickness / 2, z: -1 * (carLength / 2 - (wheelRad)) },
            { x: -1 * (carWidth / 2 + wheelTickness / 2), z: carLength / 2 - wheelRad },
            { x: -1 * (carWidth / 2 + wheelTickness / 2), z: 0 },
            { x: -1 * (carWidth / 2 + wheelTickness / 2), z: -1 * (carLength / 2 - (wheelRad)) },
        ]

        const wheels = wheelsPositions.map((p) => {
            const wheel = new THREE.Mesh(sphereGeo, new THREE.MeshPhongMaterial({ color: 0x6688AA }))
            wheel.rotation.z = 0.5 * Math.PI
            wheel.position.y = wheelRad
            wheel.position.x = p.x
            wheel.position.z = p.z
            wheel.castShadow = true
            tank.add(wheel)
            return wheel
        })

        const combRad = carWidth / 2
        const combMesh = new THREE.Mesh(new THREE.SphereGeometry(combRad, 12, 12, 0, Math.PI, 0, Math.PI), new THREE.MeshPhongMaterial({ color: 0x6688AA }))
        combMesh.position.y = combRad
        combMesh.rotation.x = -0.5 * Math.PI
        tank.add(combMesh)

        const pivot = new THREE.Object3D()
        tank.add(pivot)
        const turretHeight = carHeight * 0.5
        const turretLength = carLength * 0.75
        const turretY = carHeight * 1.5 + turretHeight
        const turretZ = ((turretLength) / 2)
        const turretRotation = 20
        const turret = new THREE.Mesh(new THREE.BoxGeometry(turretHeight, turretHeight, turretLength), new THREE.MeshPhongMaterial({ color: 0x6688AA }))
        turret.castShadow = true
        pivot.add(turret)

        pivot.position.y = turretY
        turret.position.z = turretZ

        const turretCamera = makeCamera();
        turretCamera.position.y = .5
        turret.add(turretCamera);


        const targetOrbit = new THREE.Object3D()
        const targetElevation = new THREE.Object3D();
        const targetBob = new THREE.Object3D();

        scene.add(targetOrbit);
        targetOrbit.add(targetElevation);
        targetElevation.position.z = turretZ + 20
        targetElevation.position.y = (turretZ + 20) / Math.tan(turretRotation) + turretHeight
        targetElevation.add(targetBob);

        const target = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 12, 0, 360, 0, 360), new THREE.MeshPhongMaterial({ color: 0xFFF000 }))
        targetElevation.add(target)
        target.castShadow = true

        targetBob.add(target);
        scene.add(targetOrbit)
        targetOrbit.add(targetElevation)

        const targetCamera = makeCamera();
        const targetCameraPivot = new THREE.Object3D();
        targetCamera.position.y = 1;
        targetCamera.position.z = -2;
        targetCamera.rotation.y = Math.PI;
        targetBob.add(targetCameraPivot);
        targetCameraPivot.add(targetCamera);

        const curve = new THREE.SplineCurve([
            new THREE.Vector2(-10, 0),
            new THREE.Vector2(-5, 5),
            new THREE.Vector2(0, 0),
            new THREE.Vector2(5, -5),
            new THREE.Vector2(10, 0),
            new THREE.Vector2(5, 10),
            new THREE.Vector2(-5, 10),
            new THREE.Vector2(-10, -10),
            new THREE.Vector2(-15, -8),
            new THREE.Vector2(-10, 0),
        ]);

        const points = curve.getPoints(50)
        const splineObject = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.MeshBasicMaterial({ color: 0xFF0000 }))
        splineObject.rotation.x = 0.5 * Math.PI
        splineObject.position.y = 0.05;

        scene.add(splineObject)

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

        const targetPosition = new THREE.Vector3();
        const tankPosition = new THREE.Vector2();
        const tankTarget = new THREE.Vector2();
        const cameras = [camera, turretCamera, targetCamera]


        function render(time: number) {

            time *= 0.001
            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            wheels.forEach((wheel) => {
                wheel.rotation.x = time * 3
            })

            targetBob.position.y = Math.sin(time * 2) * 4

            targetOrbit.rotation.y = time * .27
            target.rotation.y = time * 7
            target.rotation.x = time * 13
            target.rotation.z = time * 5

            const tankTime = time * .05;
            curve.getPointAt(tankTime % 1, tankPosition);
            curve.getPointAt((tankTime + 0.01) % 1, tankTarget);
            tank.position.set(tankPosition.x, 0, tankPosition.y);
            tank.lookAt(tankTarget.x, 0, tankTarget.y);


            tank.getWorldPosition(targetPosition);
            targetCameraPivot.lookAt(targetPosition);

            target.getWorldPosition(targetPosition);
            pivot.lookAt(targetPosition);
            turretCamera.lookAt(targetPosition)

            const cam = cameras[time % cameras.length | 0]
            renderer.render(scene, camera)
            requestAnimationFrame(render)

        }
        requestAnimationFrame(render)
    }, [])

    return (
        <canvas ref={canvasRef} style={{ height: "100vh", width: "100vw" }}></canvas>
    )
}