import { Server } from "socket.io";

// Vercelのサーバーレス関数としてエクスポート
export default function handler(req, res) {
  // サーバーが初期化されていなければ初期化する
  if (!res.socket.server.io) {
    console.log("Socket.ioサーバーを初期化中...");
    const io = new Server(res.socket.server, {
      cors: {
        origin: "*", // どこからでもアクセスを許可（必要なら制限をかける）
      },
    });

    res.socket.server.io = io;

    // Socket.ioイベントの定義
    io.on("connection", (socket) => {
      console.log("クライアントが接続しました:", socket.id);

      // フォームのデータを受信
      socket.on("message", (data) => {
        console.log("フォームから受信したデータ:", data); // ログ出力
        // 他のクライアントにデータをブロードキャスト
        socket.broadcast.emit("p5data", data);
      });

      // クライアントが切断
      socket.on("disconnect", () => {
        console.log("クライアントが切断されました:", socket.id);
      });
    });
  }

  res.end(); // エンドポイントのレスポンスを終了
}
