const e = require('express');
const express = require('express');
const mysql = require('mysql');

const app = express();

// cssや画像ファイルを読み込めるようにするための定型文
app.use(express.static('public'));
// フォームの値を受け取るための定型文
app.use(express.urlencoded({extended:false}));

// mysqlの接続情報
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Genya6313!',
  database: 'cleaning'
});

// sql接続エラー時の表示
connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  } else {
    console.log('sql_connection:success');
  }
});


// urlごとにheaderを変更するためにpathNameを取得
app.use((req, res, next) => {
  // const protocol = req.protocol; // http
  // const host = req.get('host'); // localhost:3000
  const pathName = req.originalUrl; // リクエストurl
  // const fullUrl = `${protocol}://${host + pathName}`;
  
  res.locals.pathName = pathName;

  next();
});


// ここからルーティング処理
app.get('/', (req, res) => {
  res.render('top.ejs');  
});

app.get('/register', (req, res) => {
  res.render('register.ejs', {errors: []});
});

app.post('/register', 
  // 入力値の空チェックのミドルウェア関数
  (req, res, next) => {
    const nameKanji = req.body.nameKanji;
    const nameKana = req.body.nameKana;
    const email = req.body.email;
    const errors = [];

    if (nameKanji === '') {
      errors.push('氏名(漢字)が空です');
    }
    if (nameKana === '') {
      errors.push('氏名(カタカナ)が空です');
    }
    if (email === '') {
      errors.push('メールアドレスが空です');
    }

    if (errors.length > 0) {
      res.render('register.ejs', {errors: errors});
    } else {
      next();
    }
  },

  // お客様登録のミドルウェア関数
  (req, res) => {
    const nameKanji = req.body.nameKanji;
    const nameKana = req.body.nameKana;
    const email = req.body.email;

    connection.query(
      'INSERT INTO customers(name_kanji, name_kana, email) VALUES(?, ?, ?)',
      [nameKanji, nameKana, email],
      (error, results) => {
        res.redirect("/customer-list");    
      }
    );
  }
);


app.get('/reception', (req, res) => {
  connection.query(
    'SELECT * FROM customers',
    (errorCustomers, results_customers) => {
      connection.query(
        'SELECT * FROM finish_days',
        (errorFinishDays, resultFinishDays) => {
          res.render('reception.ejs', {customers: results_customers, cleaningItems: resultFinishDays, errors: []})
        }
      );
    }
  );
});


app.post('/reception', 
  // 入力値の空チェックのミドルウェア関数
  (req, res, next) => {
    const nameKana = req.body.nameKana;
    const cleaningItem = req.body.cleaningItem;
    const errors = [];

    if (nameKana === '') {
      errors.push('氏名(カタカナ)を選択してください');
    }
    if (cleaningItem === '') {
      errors.push('クリーニングアイテムを選択してください');
    }

    if (errors.length > 0) {
      connection.query(
        'SELECT * FROM customers',
        (errorCustomers, resultCustomers) => {
          connection.query(
            'SELECT * FROM finish_days',
            (errorFinishDays, resultFinishDays) => {
              res.render('reception.ejs', {customers: resultCustomers, cleaningItems: resultFinishDays, errors: errors})
            }
          );
        }
      );
    } else {
      next();
    }
  },

  // クリーニング受付のミドルウェア関数
  (req, res) => {
    const nameKana = req.body.nameKana;
    const cleaningItem = req.body.cleaningItem;

    connection.query(
      'INSERT INTO receptions(name_kana, cleaning_item) VALUES(?, ?)',
      [nameKana, cleaningItem],
      (error, results) => {
        res.redirect("/cleaning-list");    
      }
    );
  }
);

app.get('/add', (req, res) => {
  res.render('add.ejs', {errors: []});
});

app.post('/add', 
  // 入力値の空チェックのミドルウェア関数
  (req, res, next) => {
    const cleaningItem = req.body.cleaningItem;
    const finishDay = req.body.finishDay;
    const errors = [];

    if (cleaningItem === '') {
      errors.push('アイテムが空です');
    }
    if (finishDay <= 0) {
      errors.push('仕上がり日数がおかしいです');
    }

    if (errors.length > 0) {
      res.render('add.ejs', {errors: errors});
    } else {
      next();
    }
  },

  // 仕上がり日数登録のミドルウェア関数
  (req, res) => {
    const cleaningItem = req.body.cleaningItem;
    const finishDay = req.body.finishDay;

    connection.query(
      'INSERT INTO finish_days(cleaning_item, finish_day) VALUES(?, ?)',
      [cleaningItem, finishDay],
      (error, results) => {
        res.redirect("/finish-day-list");    
      }
    );
  }
);


app.get('/customer-list', (req, res) => {
  // IDを1から振り直す
  connection.query(
    'SET @i := 0;',
    (error, results) => {
      connection.query(
        'UPDATE customers SET id=(@i := @i +1)',
        (error, results) => {
          // ここまで
          connection.query(
            'SELECT * FROM customers',
            (error, results) => {
              res.render('customer-list.ejs', {customers: results})
            }
          );
        }
      );
    }
  );
});

app.get('/cleaning-list', (req, res) => {
  // receotionsのIDを1から振り直す
  connection.query(
    'SET @i := 0;',
    (error, results) => {
      connection.query(
        'UPDATE receptions SET id=(@i := @i +1)',
        (error, results) => {
          // ここまで

          connection.query(
            'SELECT * FROM customers',
            (errorCustomers, resultCustomers) => {
              connection.query(
                'SELECT * FROM receptions',
                (errorReceptions, resultReceptions) => {
                  connection.query(
                    'SELECT * FROM finish_days',
                    (errorFinishDays, resultFinishDays) => {
                      res.render('cleaning-list.ejs', {customers:resultCustomers, cleanings: resultReceptions, finish_days: resultFinishDays})
                    }        
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

app.get('/finish-day-list', (req, res) => {
  // IDを1から振り直す
  connection.query(
    'SET @i := 0;',
    (error, results) => {
      connection.query(
        'UPDATE finish_days SET id=(@i := @i +1)',
        (error, results) => {
          // ここまで
          connection.query(
            'SELECT * FROM finish_days',
            (error, results) => {
              res.render('finish-day-list.ejs', {finishDays: results});
            }
          );
        }
      );
    }
  );
});


// 削除ルーティング
app.post('/customer-delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM customers WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect("/customer-list");
    }
  );
});

app.post('/cleaning-delete/:id', (req, res) => {
  const id = req.params.id;

  connection.query(
    'DELETE FROM receptions WHERE id = ?',
    [id],
    (error, results) => {
      res.redirect("/cleaning-list");
    }
  );
});

app.post('/finish-day-delete/:id', (req, res) => {
  const id = req.params.id;

  connection.query(
    'DELETE FROM finish_days WHERE id = ?',
    [id],
    (error, results) => {
      res.redirect("/finish-day-list");
    }
  );
});


//　編集画面ルーティング
app.get('/register-edit/:id', (req, res) => {
  const id = req.params.id;

  connection.query(
    'SELECT * FROM customers WHERE id=?',
    [id],
    (error, results) => {
      res.render('register-edit.ejs', {customer:results[0], errors:[]});
    }
  );
});

app.get('/reception-edit/:id', (req, res) => {
  const id = req.params.id;

  connection.query(
    'SELECT * FROM receptions WHERE id=?',
    [id],
    (error, results) => {
      res.locals.nameKana = results[0].name_kana;
      res.locals.cleaningItem = results[0].cleaning_item;

      connection.query(
        'SELECT * FROM customers',
        (errorCustomers, resultCustomers) => {
          connection.query(
            'SELECT * FROM finish_days',
            (errorFinishDays, resultFinishDays) => {
              res.render('reception-edit.ejs', {customers: resultCustomers, cleaningItems: resultFinishDays, id: id, errors:[]})
            }
          );
        }
      );
    }
  );
});

app.get('/add-edit/:id', (req, res) => {
  const id = req.params.id;

  connection.query(
    'SELECT * FROM finish_days WHERE id=?',
    [id],
    (error, results) => {
      res.render('add-edit.ejs', {finishDay:results[0], errors:[]});
    }
  );
});


// 更新ルーティング
app.post('/register-update/:id', 

  // 入力値の空チェックのミドルウェア関数
  (req, res, next) => {
    const postedId = req.params.id
    const postedNameKanji = req.body.nameKanji;
    const postedNameKana = req.body.nameKana;
    const postedEmail = req.body.email;
    const postedCustomer = {
      id: postedId,
      name_kanji: postedNameKanji,
      name_kana: postedNameKana,
      email: postedEmail 
    };
    const errors = [];

    if (postedNameKanji === '') {
      errors.push('氏名(漢字)が空です');
    }
    if (postedNameKana === '') {
      errors.push('氏名(カタカナ)が空です');
    }
    if (postedEmail === '') {
      errors.push('メールアドレスが空です');
    }

    if (errors.length > 0) {
      connection.query(
        'SELECT * FROM customers WHERE id=?',
        [postedId],
        (error, results) => {
          res.render('register-edit.ejs', {customer:postedCustomer, errors: errors});
        }
      );
    } else {
      next();
    }
  },    

  // 更新のミドルウェア関数
  (req, res) => {
  const postedId = req.params.id;
  const postedNameKanji = req.body.nameKanji;
  const postedNameKana = req.body.nameKana;
  const postedEmail = req.body.email;

  connection.query(
    'UPDATE customers SET name_kanji=?, name_kana=?, email=? WHERE id=?',
    [postedNameKanji, postedNameKana, postedEmail, postedId],
    (error, results) => {
      res.redirect("/customer-list");
    }
  );
});

app.post('/reception-update/:id',   
  // 入力値の空チェックのミドルウェア関数
  (req, res, next) => {
    const postedId = req.params.id;
    const postedNameKana = req.body.nameKana;
    const postedCleaningItem = req.body.cleaningItem;
    const errors = [];
    res.locals.nameKana = postedNameKana;
    res.locals.cleaningItem = postedCleaningItem;

    if (postedNameKana === '') {
      errors.push('氏名(カタカナ)を選択してください');
    }
    if (postedCleaningItem === '') {
      errors.push('クリーニングアイテムを選択してください');
    }

    if (errors.length > 0) {
      connection.query(
        'SELECT * FROM customers',
        (errorCustomers, resultCustomers) => {
          connection.query(
            'SELECT * FROM finish_days',
            (errorFinishDays, resultFinishDays) => {
              res.render('reception-edit.ejs', {customers: resultCustomers, cleaningItems: resultFinishDays, errors: errors, id: postedId})
            }
          );
        }
      );
    } else {
      next();
    }
  },  

  // 更新のミドルウェア関数
  (req, res) => {
  const postedId = req.params.id;
  const postedNameKana = req.body.nameKana;
  const postedCleaningItem = req.body.cleaningItem;

  connection.query(
    'UPDATE receptions SET name_kana=?, cleaning_item=? WHERE id=?',
    [postedNameKana, postedCleaningItem, postedId],
    (error, results) => {
      res.redirect("/cleaning-list");
    }
  );
});


app.post('/add-update/:id', 
  // 入力値の空チェックのミドルウェア関数
  (req, res, next) => {
    const postedId = req.params.id;
    const postedCleaningItem = req.body.cleaningItem;
    const postedFinishDay = req.body.finishDay;
    const errors = [];
    const postedContent = {
      id: postedId,
      cleaning_item: postedCleaningItem,
      finish_day: postedFinishDay
    };

    if (postedCleaningItem === '') {
      errors.push('アイテムが空です');
    }
    if (postedFinishDay <= 0) {
      errors.push('仕上がり日数がおかしいです');
    }

    if (errors.length > 0) {
      connection.query(
        'SELECT * FROM finish_days WHERE id=?',
        [postedId],
        (error, results) => {
          res.render('add-edit.ejs', {finishDay:postedContent, errors:errors});
        }
      );
    } else {
      next();
    }
  },

  // 更新のミドルウェア関数
  (req, res) => {
    const postedId = req.params.id;
    const postedCleaningItem = req.body.cleaningItem;
    const postedFinishDay = req.body.finishDay;

  connection.query(
    'UPDATE finish_days SET cleaning_item=?, finish_day=? WHERE id=?',
    [postedCleaningItem, postedFinishDay, postedId],
    (error, results) => {
      res.redirect("/finish-day-list");
    }
  );
});


app.listen(3000);