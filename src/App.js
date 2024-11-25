import React, { useState } from "react";
import "./App.css";
import io from "socket.io-client";

// サーバーとのSocket.IO接続を設定
const socket = io("http://192.168.1.8:8010"); // サーバーのIPアドレスを指定

function App() {
  // ステート管理
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState("");
  const [time, setTime] = useState(1);
  const [difficulty, setDifficulty] = useState(1);
  const [mentalStress, setMentalStress] = useState(1);
  const [physicalEffort, setPhysicalEffort] = useState(1);
  const [goalAchievement, setGoalAchievement] =useState(1);
  const [feedbackQuality, setFeedbackQuality] = useState(1);
  const [selfSatisfaction, setSelfSatisfaction] = useState(1);
  const [mudScore, setMudScore] = useState(null);

  // サーバーにデータを送信する関数
  const sendMessage = (args) => {
    socket.emit("message", args, (response) => {
      if (response && response.success) {
        console.log("Socket.IOメッセージが送信されました:", args);
      } else {
        console.error("Socket.IOメッセージの送信に失敗しました");
      }
    });
  };

  // 無駄度（M）を計算し、サーバーに送信する関数
  const calculateMudScore = () => {
    const T = parseFloat(time);
    const E =
      parseFloat(difficulty) +
      parseFloat(mentalStress) +
      parseFloat(physicalEffort);
    const R =
      parseFloat(goalAchievement) +
      parseFloat(feedbackQuality) +
      parseFloat(selfSatisfaction);

    let M;
    if (R === 0) {
      M = Infinity; // 成果がゼロの場合、無駄度は無限大
    } else {
      M = Math.max(1, (T * E) / R); // 無駄度の最低数値を1に設定
    }

    const roundedMudScore = Math.round(M);
    setMudScore(roundedMudScore);

    // 無駄スコアと体験内容をサーバーに送信
    sendMessage({ experience, score: roundedMudScore });
  };

  // ページを進める処理
  const nextStep = () => {
    if (step === 4) {
      calculateMudScore(); // ステップ4で無駄スコアを計算
    }
    setStep(step + 1);
  };

  // 最初のページに戻る処理
  const resetForm = () => {
    setStep(1);
    setExperience("");
    setTime(1);
    setDifficulty(1);
    setMentalStress(1);
    setPhysicalEffort(1);
    setGoalAchievement(1);
    setFeedbackQuality(1);
    setSelfSatisfaction(1);
    setMudScore(null);
  };

  return (
    <div className="App">
      {/* ステップ1: 無駄な体験の入力 */}
      {step === 1 && (
        <div>
          <h1>あなたの無駄だった体験を教えてください</h1>
          <input
            type="text"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="例: 頑張った勉強がテストに出なかった"
          />
          <button onClick={nextStep}>次へ</button>
        </div>
      )}

      {/* ステップ2: 時間の入力 */}
      {step === 2 && (
        <div>
          <h1>その「{experience}」は、どのくらいの時間がかかりましたか？</h1>
          <input
            type="range"
            min="1"
            max="10"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <p>時間: {time}</p>
          <button onClick={nextStep}>次へ</button>
        </div>
      )}

      {/* ステップ3: 難易度とストレスの入力 */}
      {step === 3 && (
        <div>
          <h1>その「{experience}」は、どのくらい大変でしたか？</h1>
          <label>
            作業の難易度:
            <input
              type="range"
              min="1"
              max="10"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
          </label>
          <p>作業の難易度: {difficulty}</p>
          <label>
            精神的ストレス:
            <input
              type="range"
              min="1"
              max="10"
              value={mentalStress}
              onChange={(e) => setMentalStress(e.target.value)}
            />
          </label>
          <p>精神的ストレス: {mentalStress}</p>
          <label>
            肉体的労力:
            <input
              type="range"
              min="1"
              max="10"
              value={physicalEffort}
              onChange={(e) => setPhysicalEffort(e.target.value)}
            />
          </label>
          <p>肉体的労力: {physicalEffort}</p>
          <button onClick={nextStep}>次へ</button>
        </div>
      )}

      {/* ステップ4: 成果の入力 */}
      {step === 4 && (
        <div>
          <h1>その「{experience}」は、どのくらいの成果を得られましたか？</h1>
          <label>
            目標達成度:
            <input
              type="range"
              min="1"
              max="10"
              value={goalAchievement}
              onChange={(e) => setGoalAchievement(e.target.value)}
            />
          </label>
          <p>目標達成度: {goalAchievement}</p>
          <label>
            得られたフィードバックの質:
            <input
              type="range"
              min="1"
              max="10"
              value={feedbackQuality}
              onChange={(e) => setFeedbackQuality(e.target.value)}
            />
          </label>
          <p>得られたフィードバックの質: {feedbackQuality}</p>
          <label>
            自己満足度:
            <input
              type="range"
              min="1"
              max="10"
              value={selfSatisfaction}
              onChange={(e) => setSelfSatisfaction(e.target.value)}
            />
          </label>
          <p>自己満足度: {selfSatisfaction}</p>
          <button onClick={nextStep}>次へ</button>
        </div>
      )}

      {/* ステップ5: 無駄スコアの表示 */}
      {step === 5 && (
        <div>
          <h1>
            あなたの「{experience}」は、{mudScore === Infinity ? "∞" : mudScore}{" "}
            mudです
          </h1>
          <button onClick={resetForm}>終わる</button>
        </div>
      )}
    </div>
  );
}

export default App;
