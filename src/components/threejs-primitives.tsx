import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


export default function Primitives() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current! })
        renderer.setPixelRatio(window.devicePixelRatio);
        const fov = 40;
        const far = 1000;
        const aspect = 2;
        const near = 0.1;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

        new OrbitControls(camera, renderer.domElement)
        camera.position.z = 120;
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xAAAAAA);

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            scene.add(light);
        }

        const objects: THREE.Object3D[] = [];
        const spread = 15;


        function addObject(x: number, y: number, obj: THREE.Object3D) {
            obj.position.x = x * spread;
            obj.position.y = y * spread;

            scene.add(obj);
            objects.push(obj);
        }

        function createMaterial() {
            const material = new THREE.MeshPhongMaterial({
                side: THREE.DoubleSide,

            });

            const hue = Math.random();
            const saturation = 1;
            const luminance = .5;
            material.color.setHSL(hue, saturation, luminance);

            //remove this for dark lightning effect
            material.emissive.setHSL(hue, saturation, luminance)

            return material;
        }

        function addSolidGeometry(x: number, y: number, geometry: any) {
            const mesh = new THREE.Mesh(geometry, createMaterial());
            addObject(x, y, mesh);
        }

        {
            const width = 8;
            const height = 8;
            const depth = 8;
            addSolidGeometry(-2, 2, new THREE.BoxGeometry(width, height, depth));

            addSolidGeometry(-1, 2, new THREE.CircleGeometry(6, 1000, 0, 360))

            addSolidGeometry(0, 2, new THREE.ConeGeometry(6, 8, 200, 200, false, 0, 360))

            addSolidGeometry(1, 2, new THREE.CylinderGeometry(6, 6, 8, 10, 5))

            addSolidGeometry(2, 2, new THREE.DodecahedronGeometry(6));


        }

        {
            const shape = new THREE.Shape();
            const x = -2.5;
            const y = -5;
            shape.moveTo(x + 2.5, y + 2.5);
            shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
            shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
            shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, 0, y + 9.5);
            shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
            shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
            shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

            const extrudeSettings = {
                steps: 2,
                depth: 2,
                bevelEnabled: true,
                bevelThickness: 1,
                bevelSize: 1,
                bevelSegments: 10,
            };

            addSolidGeometry(-2, 1, new THREE.ExtrudeGeometry(shape, extrudeSettings));
        }

        const loader = new FontLoader();
        // promisify font loading
        function loadFont(url: string) {
            return new Promise((resolve, reject) => {
                loader.load(url, resolve, undefined, reject);
            });
        }

        async function doit() {
            const font = await loadFont("./helvetiker_regular.typeface.json") as Font  /* threejs.org: url */
            const geometry = new TextGeometry('GHANA', {
                font: font,
                size: 3.0,
                height: 1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.15,
                bevelSize: .2,
                bevelSegments: 1,
            });
            const mesh = new THREE.Mesh(geometry, createMaterial());
            geometry.computeBoundingBox();
            geometry.boundingBox?.getCenter(mesh.position).multiplyScalar(-1);

            const parent = new THREE.Object3D();
            parent.add(mesh);

            addObject(-1, 1, parent);
        }
        doit();


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
            objects.forEach((cube, ind) => {
                let spd = 0.1 + ind * 0.1
                cube.rotation.x = spd * time
                cube.rotation.y = spd * time
                cube.rotation.z = spd * time
            })
            renderer.render(scene, camera)
            requestAnimationFrame(render)
        }
        requestAnimationFrame(render)
    })

    return (
        <canvas ref={canvasRef} style={{
            height: "300px",
            width: "600px",
        }}></canvas>
    )
}

