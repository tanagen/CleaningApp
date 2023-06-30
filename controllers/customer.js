const sql = require("./sql");
const connection = sql.connection;

// お客様登録画面の表示
const renderCustomerRegisterPage = (req, res) => {
  res.render("customerRegister.ejs", { errors: [] });
};


// お客様登録時の入力値チェック
const checkPostedCustomerRegister = (req, res, next) => {
  const nameKanji = req.body.nameKanji;
  const nameKana = req.body.nameKana;
  const email = req.body.email;
  const errors = [];

  if (nameKanji === "") {
    errors.push("氏名(漢字)が空です");
  }
  if (nameKana === "") {
    errors.push("氏名(カタカナ)が空です");
  }
  if (email === "") {
    errors.push("メールアドレスが空です");
  }

  if (errors.length > 0) {
    res.render("customerRegister.ejs", { errors: errors });
  } else {
    next();
  }
};

// 入力されたお客様情報のポスト
const postCustomerRegister = (req, res) => {
  console.log("call post");
  const nameKanji = req.body.nameKanji;
  const nameKana = req.body.nameKana;
  const email = req.body.email;

  connection.query(
    "INSERT INTO customers(name_kanji, name_kana, email) VALUES(?, ?, ?)",
    [nameKanji, nameKana, email],
    (error, results) => {
      res.redirect("/customer/list");
    }
  );
};

// お客様一覧の表示
const getCustomerList = (req, res) => {
  // IDを1から振り直す
  connection.query("SET @i := 0;", (error, results) => {
    connection.query(
      "UPDATE customers SET id=(@i := @i +1)",
      (error, results) => {
        // ここまで
        connection.query("SELECT * FROM customers", (error, results) => {
          res.render("customerList.ejs", { customers: results });
        });
      }
    );
  });
};

// お客様情報の削除
const delteCustomerInfo = (req, res) => {
  connection.query(
    "DELETE FROM customers WHERE id = ?",
    [req.params.id],
    (error, results) => {
      res.redirect("/customer/list");
    }
  );
};

// お客様情報の編集
const renderCustomerEditPage = (req, res) => {
  const id = req.params.id;

  connection.query(
    "SELECT * FROM customers WHERE id=?",
    [id],
    (error, results) => {
      res.render("editCustomerInfo.ejs", {
        customer: results[0],
        errors: [],
      });
    }
  );
};

// お客様情報更新時の入力値チェック
const checkUpdatedCustomerInfo = (req, res, next) => {
  const postedId = req.params.id;
  const postedNameKanji = req.body.nameKanji;
  const postedNameKana = req.body.nameKana;
  const postedEmail = req.body.email;
  const postedCustomer = {
    id: postedId,
    name_kanji: postedNameKanji,
    name_kana: postedNameKana,
    email: postedEmail,
  };
  const errors = [];

  if (postedNameKanji === "") {
    errors.push("氏名(漢字)が空です");
  }
  if (postedNameKana === "") {
    errors.push("氏名(カタカナ)が空です");
  }
  if (postedEmail === "") {
    errors.push("メールアドレスが空です");
  }

  if (errors.length > 0) {
    connection.query(
      "SELECT * FROM customers WHERE id=?",
      [postedId],
      (error, results) => {
        res.render("editCustomerInfo.ejs", {
          customer: postedCustomer,
          errors: errors,
        });
      }
    );
  } else {
    next();
  }
};

// お客様情報の更新
const UpdateCustomerInfo = (req, res) => {
  const postedId = req.params.id;
  const postedNameKanji = req.body.nameKanji;
  const postedNameKana = req.body.nameKana;
  const postedEmail = req.body.email;

  connection.query(
    "UPDATE customers SET name_kanji=?, name_kana=?, email=? WHERE id=?",
    [postedNameKanji, postedNameKana, postedEmail, postedId],
    (error, results) => {
      res.redirect("/customer/list");
    }
  );
};

module.exports = {
  renderCustomerRegisterPage,
  checkPostedCustomerRegister,
  postCustomerRegister,
  getCustomerList,
  delteCustomerInfo,
  renderCustomerEditPage,
  checkUpdatedCustomerInfo,
  UpdateCustomerInfo,
};

