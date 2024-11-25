const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 静的ファイルを公開
app.use(express.static("public")); // "public" フォルダを静的ファイルのルートに設定

// Socket.ioイベント
io.on("connection", (socket) => {
  console.log("クライアントが接続しました");

  // フォーム送信内容を受信
  socket.on("message", (data) => {
    console.log("フォームから受信したデータ:", data); // 送信内容をログに表示
  });

  socket.on("disconnect", () => {
    console.log("クライアントが切断されました");
  });
});

// サーバーを起動
server.listen(8010, () => {
  console.log("サーバーが http://192.168.1.8:8010 で起動しています");
});




/*const socketIo = require("socket.io");

const PORT = 8010;
const io = require('socket.io')(8010, {
  cors: {
    origin: "*", // 必要に応じてセキュリティを緩和
  }
});

let recentTexts = []; // 最近のテキストを保存

io.on("connection", (socket) => {
  console.log("クライアントが接続しました");

  // クライアントからのメッセージを受信
  socket.on("message", (data) => {
    console.log("メッセージを受信:", data);

    // experience と score を保存し、タイムスタンプも追加
    const timestampedData = { text: data.experience, score: data.score, timestamp: Date.now() };
    recentTexts.push(timestampedData);

    // 24時間以上前のデータを削除
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    recentTexts = recentTexts.filter((entry) => entry.timestamp > twentyFourHoursAgo);

    // 他のクライアントにメッセージをブロードキャスト
    socket.broadcast.emit("message", data);
  });

  // 10秒ごとにランダムなテキストを全クライアントに送信
  setInterval(() => {
    if (recentTexts.length > 0) {
      const randomEntry = recentTexts[Math.floor(Math.random() * recentTexts.length)];
      console.log("ランダムテキストを送信:", randomEntry);  // ランダムテキストの送信内容を表示
      io.emit("randomText", { experience: randomEntry.text, score: randomEntry.score });  // experience と score を送信
    }
  }, 10000);  // 10秒間隔でランダムテキストを送信
});

console.log(`Socket.IOサーバーがポート${PORT}で起動しています`);
*/