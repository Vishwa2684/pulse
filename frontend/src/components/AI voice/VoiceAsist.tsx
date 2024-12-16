import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import io from "socket.io-client";

interface Model {
  model_file: string;
}

interface AIResponse {
  aiResponse: string;
}

const ARVisualizer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [aiResponse, setAiResponse] = useState<string>("");

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("modelUpdate", (data: { models: Model[] }) => {
      setModels(data.models);
      console.log("Real-time models received:", data.models);
    });

    socket.on("aiResponse", (response: AIResponse) => {
      setAiResponse(response.aiResponse);
      console.log("AI Response:", response);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return; // Ensure containerRef.current is defined

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Add AR button
    document.body.appendChild(ARButton.createButton(renderer));

    // Add lighting
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0, 1, 0);
    scene.add(light);

    // Load models into the scene
    const loader = new GLTFLoader();
    models.forEach((model) => {
      loader.load(model.model_file, (gltf) => {
        const object = gltf.scene;
        object.position.set(0, 0, -1); // Position in front of the user
        object.scale.set(0.5, 0.5, 0.5); // Adjust size
        scene.add(object);
      });
    });

    // Animation loop
    const animate = () => {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };
    animate();

    return () => {
      renderer.dispose();
      while (containerRef.current?.firstChild) {
        containerRef.current?.removeChild(containerRef.current.firstChild);
      }
    };
  }, [models]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh" }}>
      {aiResponse && <div className="ai-response">{aiResponse}</div>}
    </div>
  );
};

export default ARVisualizer;
