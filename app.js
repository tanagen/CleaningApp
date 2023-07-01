// import
const express = require("express");
const topRoutes = require("./routes/topRouter");
const customerRoutes = require("./routes/customerRouter");
const cleaningRoutes = require("./routes/cleaningRouter");
const itemRoutes = require("./routes/itemRouter");
const sql = require("./controllers/sql");
const config = require("./config");

// 初期化
const app = express();

// cssや画像ファイルを読み込むための定型文
app.use(express.static("public"));
// フォームの値を受け取るための定型文
app.use(express.urlencoded({ extended: false }));

// sql接続エラーチェック
sql.connect;

// urlごとにheaderを変更するためにpathNameを取得
app.use((req, res, next) => {
  // const protocol = req.protocol; // http
  // const host = req.get('host'); // localhost:3000
  const pathName = req.originalUrl; // リクエストurl
  // const fullUrl = `${protocol}://${host + pathName}`;

  res.locals.pathName = pathName;

  next();
});

// topルーティング
app.use("/", topRoutes);
// お客様情報のルーティング
app.use("/customer", customerRoutes);
// クリーニング情報のルーティング
app.use("/cleaning", cleaningRoutes);
// クリーニングアイテムのルーティング
app.use("/item", itemRoutes);

app.listen(config.port);
