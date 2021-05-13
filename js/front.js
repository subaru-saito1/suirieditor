/**
 * front.js
 * 
 * 各種イベントハンドラの実装等
 */


/**
 * 新規盤面作成
 */
function newFile(evt) {
  const numElems = $('#newfile_elems').val();
  const numItems = $('#newfile_items').val();
  Suiripuz.board = new Board(numElems, numItems);
  console.log(Suiripuz.board);
  // to do: アクションスタック初期化
  // to do: 再描画処理
}


/**
 * メニュー実行
 */
function fileMenu(evt) {
  const menu = $('#filemenu').val();
  if (menu === 'writeimg') {
    imgWrite();
  } else if (menu === 'writeurl') {
    urlWrite();
  } else if (menu === 'readurl') {
    urlRead();
  } else if (menu === 'writejson') {
    jsonWrite();
  } else if (menu === 'readjson') {
    jsonRead();
  }
}

/**
 * 画像出力 
 */
function imgWrite() {
  console.log('画像出力');
}
/**
 * URL出力
 */
function urlWrite() {
  console.log('URL出力')
}
/**
 * URL読込
 */
 function urlRead() {
  console.log('URL読込')
}
/**
 * JSON出力
 */
 function jsonWrite() {
  console.log('JSON出力')
}
/**
 * JSON読込
 */
 function jsonRead() {
  console.log('JSON読込')
}



/**
 * サイズ変更
 */
function setSize(evt) {
  console.log('サイズ変更');
}


/**
 * 問題入力モード変更
 */
function setQmode(evt) {
  console.log('問題モードに変更');
}

/**
 * 解答入力モード変更
 */
function setAmode(evt) {
  console.log('解答モードに変更');
}


/**
 * 戻る
 */
function actionUndo(evt) {
  console.log('戻る');
}

/**
 * 進む
 */
function actionRedo(evt) {
  console.log('進む');
}

/**
 * 解答消去
 */
function answerClear(evt) {
  console.log('解答消去');
}


/**
 * 盤面クリック
 */
function clickBoard(evt) {
  console.log('クリック');
}

/**
 * 盤面キーボード押下
 */
function keyDownBoard(evt) {
  console.log('キーボード押下');
}

/**
 * 盤面ブラー
 */
function blurBoard(evt) {
  console.log('盤面フォーカス外れ');
}