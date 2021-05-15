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
  // 盤面新規作成
  Suiripuz.board = new Board(numElems, numItems);
  // to do: アクションスタック初期化
  // 盤面再描画
  Suiripuz.drawer.drawCanvas(Suiripuz.board);
}


/**
 * メニュー実行
 */
function fileMenu(evt) {
  const menu = $('#filemenu').val();
  if (menu === 'writeimg') {
    $('#popup_writeimg').addClass('active');
  } else if (menu === 'writeurl') {
    $('#popup_writeurl').addClass('active');
  } else if (menu === 'readurl') {
    $('#popup_readurl').addClass('active');
  } else if (menu === 'writejson') {
    $('#popup_writejson').addClass('active');
  } else if (menu === 'readjson') {
    $('#popup_readjson').addClass('active');
  }
}

/**
 * 画像出力 
 */
function imgWrite() {
  console.log('画像出力');
  $('#popup_writeimg').removeClass('active');
}
/**
 * URL出力
 */
function urlWrite() {
  console.log('URL出力')
  $('#popup_writeurl').removeClass('active');
}
/**
 * URL読込
 */
function urlRead() {
  console.log('URL読込')
  $('#popup_readurl').removeClass('active');
}
/**
 * JSON出力
 */
function jsonWrite() {
  console.log('JSON出力')
  $('#popup_writejson').removeClass('active');
}
/**
 * JSON読込
 */
function jsonRead() {
  console.log('JSON読込')
  $('#popup_readjson').removeClass('active');
}
/**
 * キャンセル
 */
function closePopup() {
  $('.popup_overlay').removeClass('active');
}


/**
 * サイズ変更
 */
function setSize(evt) {
  let csize = $('#setsize').val() - 0;
  const mincsize = $('#setsize').attr('min') - 0;
  const maxcsize = $('#setsize').attr('max') - 0;
  // 範囲バリデーション
  if (csize < mincsize) {
    csize = mincsize;
  } else if (csize > maxcsize) {
    csize = maxcsize;
  }
  // サイズ変更と再描画
  Suiripuz.drawer.csize = csize;
  Suiripuz.drawer.drawCanvas(Suiripuz.board);
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