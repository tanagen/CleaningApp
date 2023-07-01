const sql = require("./sql");
const connection = sql.connection;

// クリーニング受付画面の表示
const renderCleaningReceptionPage = (req, res) => {
  connection.query(
    "SELECT * FROM customers",
    (errorCustomers, results_customers) => {
      connection.query(
        "SELECT * FROM finish_days",
        (errorFinishDays, resultFinishDays) => {
          res.render("cleaningReception.ejs", {
            customers: results_customers,
            cleaningItems: resultFinishDays,
            errors: [],
          });
        }
      );
    }
  );
};

// クリーニング受付時の入力値の空チェック
const checkPostedCleaningReception = (req, res, next) => {
  const nameKana = req.body.nameKana;
  const cleaningItem = req.body.cleaningItem;
  const errors = [];

  if (nameKana === "") {
    errors.push("氏名(カタカナ)を選択してください");
  }
  if (cleaningItem === "") {
    errors.push("クリーニングアイテムを選択してください");
  }

  if (errors.length > 0) {
    connection.query(
      "SELECT * FROM customers",
      (errorCustomers, resultCustomers) => {
        connection.query(
          "SELECT * FROM finish_days",
          (errorFinishDays, resultFinishDays) => {
            res.render("cleaningReception.ejs", {
              customers: resultCustomers,
              cleaningItems: resultFinishDays,
              errors: errors,
            });
          }
        );
      }
    );
  } else {
    next();
  }
};

// クリーニング受付のポスト
const postCleaningReception = (req, res) => {
  const nameKana = req.body.nameKana;
  const cleaningItem = req.body.cleaningItem;

  connection.query(
    "INSERT INTO receptions(name_kana, cleaning_item) VALUES(?, ?)",
    [nameKana, cleaningItem],
    (error, results) => {
      res.redirect("/cleaning/list");
    }
  );
};

//  クリーニングリストの表示
const getCleaningList = (req, res) => {
  // receotionsのIDを1から振り直す
  connection.query("SET @i := 0;", (error, results) => {
    connection.query(
      "UPDATE receptions SET id=(@i := @i +1)",
      (error, results) => {
        // ここまで

        connection.query(
          "SELECT * FROM customers",
          (errorCustomers, resultCustomers) => {
            connection.query(
              "SELECT * FROM receptions",
              (errorReceptions, resultReceptions) => {
                connection.query(
                  "SELECT * FROM finish_days",
                  (errorFinishDays, resultFinishDays) => {
                    res.render("cleaningList.ejs", {
                      customers: resultCustomers,
                      cleanings: resultReceptions,
                      finish_days: resultFinishDays,
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};

// クリーニング情報の削除
const deleteCleaningInfo = (req, res) => {
  const id = req.params.id;

  connection.query(
    "DELETE FROM receptions WHERE id = ?",
    [id],
    (error, results) => {
      res.redirect("/cleaning/list");
    }
  );
};

// クリーニング情報の編集画面表示
const renderCleaningEditPage = (req, res) => {
  const id = req.params.id;

  connection.query(
    "SELECT * FROM receptions WHERE id=?",
    [id],
    (error, results) => {
      res.locals.nameKana = results[0].name_kana;
      res.locals.cleaningItem = results[0].cleaning_item;

      connection.query(
        "SELECT * FROM customers",
        (errorCustomers, resultCustomers) => {
          connection.query(
            "SELECT * FROM finish_days",
            (errorFinishDays, resultFinishDays) => {
              res.render("editCleaningInfo.ejs", {
                customers: resultCustomers,
                cleaningItems: resultFinishDays,
                id: id,
                errors: [],
              });
            }
          );
        }
      );
    }
  );
};

// クリーニング情報更新時の入力値の空チェック
const checkUpdatedCleaningInfo = (req, res, next) => {
  const postedId = req.params.id;
  const postedNameKana = req.body.nameKana;
  const postedCleaningItem = req.body.cleaningItem;
  const errors = [];
  res.locals.nameKana = postedNameKana;
  res.locals.cleaningItem = postedCleaningItem;

  if (postedNameKana === "") {
    errors.push("氏名(カタカナ)を選択してください");
  }
  if (postedCleaningItem === "") {
    errors.push("クリーニングアイテムを選択してください");
  }

  if (errors.length > 0) {
    connection.query(
      "SELECT * FROM customers",
      (errorCustomers, resultCustomers) => {
        connection.query(
          "SELECT * FROM finish_days",
          (errorFinishDays, resultFinishDays) => {
            res.render("editCleaningInfo.ejs", {
              customers: resultCustomers,
              cleaningItems: resultFinishDays,
              errors: errors,
              id: postedId,
            });
          }
        );
      }
    );
  } else {
    next();
  }
};

// クリーニング情報の更新
const updateCleaingInfo = (req, res) => {
  const postedId = req.params.id;
  const postedNameKana = req.body.nameKana;
  const postedCleaningItem = req.body.cleaningItem;

  connection.query(
    "UPDATE receptions SET name_kana=?, cleaning_item=? WHERE id=?",
    [postedNameKana, postedCleaningItem, postedId],
    (error, results) => {
      res.redirect("/cleaning/list");
    }
  );
};

module.exports = {
  renderCleaningReceptionPage,
  checkPostedCleaningReception,
  postCleaningReception,
  getCleaningList,
  deleteCleaningInfo,
  renderCleaningEditPage,
  checkUpdatedCleaningInfo,
  updateCleaingInfo,
};
