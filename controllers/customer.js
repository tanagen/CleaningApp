exports.getCustomerRegister = (req, res) => {
  res.render("customerRegister.ejs", { errors: [] });
};
//
// exports.postCustomerRegister =
//   ((req, res, next) => {
//     const nameKanji = req.body.nameKanji;
//     const nameKana = req.body.nameKana;
//     const email = req.body.email;
//     const errors = [];

//     if (nameKanji === "") {
//       errors.push("氏名(漢字)が空です");
//     }
//     if (nameKana === "") {
//       errors.push("氏名(カタカナ)が空です");
//     }
//     if (email === "") {
//       errors.push("メールアドレスが空です");
//     }

//     if (errors.length > 0) {
//       res.render("customerRegister.ejs", { errors: errors });
//     } else {
//       next();
//     }
//   },
//   // お客様登録のミドルウェア関数
//   (req, res) => {
//     const nameKanji = req.body.nameKanji;
//     const nameKana = req.body.nameKana;
//     const email = req.body.email;

//     connection.query(
//       "INSERT INTO customers(name_kanji, name_kana, email) VALUES(?, ?, ?)",
//       [nameKanji, nameKana, email],
//       (error, results) => {
//         res.redirect("/customer-list");
//       }
//     );
//   });
