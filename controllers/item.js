const sql = require("./sql");
const connection = sql.connection;

// クリーニングアイテム追加の画面表示
const renderItemAddPage = (req, res) => {
  res.render("addCleaningItem.ejs", { errors: [] });
};

// クリーニングアイテム追加の入力値の空チェック
const checkPostedItemAdd = (req, res, next) => {
  const cleaningItem = req.body.cleaningItem;
  const finishDay = req.body.finishDay;
  const errors = [];

  if (cleaningItem === "") {
    errors.push("アイテムが空です");
  }
  if (finishDay <= 0) {
    errors.push("仕上がり日数がおかしいです");
  }

  if (errors.length > 0) {
    res.render("addCleaningItem.ejs", { errors: errors });
  } else {
    next();
  }
};

// クリーニングアイテム追加のポスト
const postItemAdd = (req, res) => {
  const cleaningItem = req.body.cleaningItem;
  const finishDay = req.body.finishDay;

  connection.query(
    "INSERT INTO finish_days(cleaning_item, finish_day) VALUES(?, ?)",
    [cleaningItem, finishDay],
    (error, results) => {
      res.redirect("/item/list");
    }
  );
};

//  仕上がり日数の表示
const getItemList = (req, res) => {
  // IDを1から振り直す
  connection.query("SET @i := 0;", (error, results) => {
    connection.query(
      "UPDATE finish_days SET id=(@i := @i +1)",
      (error, results) => {
        // ここまで
        connection.query("SELECT * FROM finish_days", (error, results) => {
          res.render("finishDayList.ejs", { finishDays: results });
        });
      }
    );
  });
};

//  クリーニングアイテム情報の削除
const deleteItemInfo = (req, res) => {
  const id = req.params.id;

  connection.query(
    "DELETE FROM finish_days WHERE id = ?",
    [id],
    (error, results) => {
      res.redirect("/item/list");
    }
  );
};

// クリーニングアイテムの編集画面表示
const renderItemEditPage = (req, res) => {
  const id = req.params.id;

  connection.query(
    "SELECT * FROM finish_days WHERE id=?",
    [id],
    (error, results) => {
      res.render("editCleaningItemInfo.ejs", {
        finishDay: results[0],
        errors: [],
      });
    }
  );
};

// クリーニングアイテム情報更新時の入力値の空チェック
const checkUpdatedItemInfo = (req, res, next) => {
  const postedId = req.params.id;
  const postedCleaningItem = req.body.cleaningItem;
  const postedFinishDay = req.body.finishDay;
  const errors = [];
  const postedContent = {
    id: postedId,
    cleaning_item: postedCleaningItem,
    finish_day: postedFinishDay,
  };

  if (postedCleaningItem === "") {
    errors.push("アイテムが空です");
  }
  if (postedFinishDay <= 0) {
    errors.push("仕上がり日数がおかしいです");
  }

  if (errors.length > 0) {
    connection.query(
      "SELECT * FROM finish_days WHERE id=?",
      [postedId],
      (error, results) => {
        res.render("editCleaningItemInfo.ejs", {
          finishDay: postedContent,
          errors: errors,
        });
      }
    );
  } else {
    next();
  }
};

// クリーニングアイテム情報の更新
const updateItemInfo = (req, res) => {
  const postedId = req.params.id;
  const postedCleaningItem = req.body.cleaningItem;
  const postedFinishDay = req.body.finishDay;

  connection.query(
    "UPDATE finish_days SET cleaning_item=?, finish_day=? WHERE id=?",
    [postedCleaningItem, postedFinishDay, postedId],
    (error, results) => {
      res.redirect("/item/list");
    }
  );
};

module.exports = {
  renderItemAddPage,
  checkPostedItemAdd,
  postItemAdd,
  getItemList,
  deleteItemInfo,
  renderItemEditPage,
  checkUpdatedItemInfo,
  updateItemInfo,
};
