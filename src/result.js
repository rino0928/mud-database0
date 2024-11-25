import React, { useRef, useEffect } from "react";
import Matter from "matter-js";
import p5 from "p5";
import io from "socket.io-client";
import "./result.css";

function Result() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // p5.js スケッチを定義
    const sketch = (p) => {
      let Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Runner = Matter.Runner;

      let engine;
      let world;
      let ground;
      let shapes = [];
      let socket;
      let frameCount = 0;
      const colors = ["#69B831", "#DF4537", "#E9D34F", "#257AB6"];
      const shapeImages = [];
      let myFont, bgImg;

      // 画像とフォントのロード
      p.preload = () => {
        myFont = p.loadFont("public/fonts/myFont.otf");
        bgImg = p.loadImage("BG_text.jpeg");
        for (let i = 1; i <= 12; i++) { 
          shapeImages.push(p.loadImage(`images/0${i}.png`));
        }
      };

      p.setup = () => {
        p.createCanvas(1280, 720).parent(canvasRef.current);
        engine = Engine.create();
        world = engine.world;
        world.gravity.y = 0.3;

        ground = Bodies.rectangle(p.width / 2, p.height + 10, p.width, 20, {
          isStatic: true,
        });
        World.add(world, ground);

        // ソケット接続
        socket = io("http://localhost:8010");
        socket.on("message", (data) => addShape(data));
        socket.on("randomText", (data) => addShape(data));

        // Runnerを作成
        const runner = Runner.create();
        Runner.run(runner, engine);
      };

      p.draw = () => {
        p.background(bgImg);

        shapes = shapes.filter((shape) => {
          if (shape.body) {
            drawShape(shape);
            return shape.body.position.y < p.height + 100;
          }
          return false;
        });

        frameCount++;
      };

      const addShape = (data) => {
        const size = p.map(data.score || 50, 1, 100, 50, 400);
        const shapeType = p.random(["circle", "triangle", "square"]);
        const options = { restitution: 0.8 };

        const shape = {
          body:
            shapeType === "circle"
              ? Bodies.circle(p.random(p.width), -50, size / 2, options)
              : shapeType === "triangle"
              ? Bodies.polygon(p.random(p.width), -50, 3, size / 2, options)
              : Bodies.rectangle(p.random(p.width), -50, size, size, options),
          size,
          type: shapeType,
          text: `${data.experience || ""}\n${data.score || 0} mud`,
          color: p.random(colors),
          image: p.random(shapeImages),
        };

        World.add(world, shape.body);
        shapes.push(shape);
      };

      const drawShape = (shape) => {
        const pos = shape.body.position;
        const angle = shape.body.angle;
        p.push();
        p.translate(pos.x, pos.y);
        p.rotate(angle);

        // 画像描画
        p.imageMode(p.CENTER);
        p.image(shape.image, 0, 0, shape.size, shape.size);

        // テキスト描画
        p.fill(255);
        p.textFont(myFont);
        p.textAlign(p.CENTER, p.CENTER);
        drawTextInShape(shape.text, shape.size, shape.type);
        p.pop();
      };

      const drawTextInShape = (txt, maxSize, shapeType) => {
        let fontSize = maxSize / 10;
        p.textSize(fontSize);

        const lines = [];
        let currentLine = "";

        for (let i = 0; i < txt.length; i++) {
          const char = txt[i];
          const testLine = currentLine + char;

          if (p.textWidth(testLine) > maxSize * (shapeType === "triangle" ? 0.5 : 0.8)) {
            lines.push(currentLine);
            currentLine = char;
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);

        let lineHeight = fontSize * (shapeType === "triangle" ? 1.3 : 1.4);
        while (lines.length * lineHeight > maxSize * (shapeType === "triangle" ? 0.6 : 0.8)) {
          fontSize *= 0.9;
          p.textSize(fontSize);
          lineHeight = fontSize * (shapeType === "triangle" ? 1.3 : 1.4);
        }

        const startY = -((lines.length - 1) * lineHeight) / 2;
        lines.forEach((line, j) => p.text(line, 0, startY + j * lineHeight));
      };
    };

    // p5インスタンスを作成
    const p5Instance = new p5(sketch);

    // クリーンアップ
    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={canvasRef}></div>;
}

export default Result;
