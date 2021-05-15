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
  $('.popup_overlay').removeClass('active');
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
  const filename = $('#writeimg_filename').val();
  const canvas = document.querySelector('canvas');
  // todo: カーソルを表示しないで描画
  // 画像保存（一時的にダウンロード用リンクを生成）
  canvas.toBlob((blob) => {
    let dlanchor = document.createElement('a');
    dlanchor.href = window.URL.createObjectURL(blob);
    dlanchor.download = filename;
    dlanchor.click();
    dlanchor.remove();
  });
  // todo: カーソルを表示して再描画
  // ポップアップを閉じる
  $('#popup_writeimg').removeClass('active');
}

/**
 * URL出力
 */
function urlWrite() {
  $('#popup_writeurl').removeClass('active');
}
/**
 * URL読込
 */
function urlRead() {
  $('#popup_readurl').removeClass('active');
}

/**
 * JSON出力
 */
function jsonWrite() {
  const filename = $('#writejson_filename').val();
  const jsonstr = Suiripuz.board.jsonWrite();
  const blob = new Blob([jsonstr], {type:"text/json"});
  let dlanchor = document.createElement('a');
  dlanchor.href = window.URL.createObjectURL(blob);
  dlanchor.download = filename;
  dlanchor.click();
  dlanchor.remove();
  $('#popup_writejson').removeClass('active');
}
/**
 * JSON読込
 */
function jsonRead() {
  let file = $('#readjson_filename').prop('files')[0];
  let reader = new FileReader();
  reader.readAsText(file, 'UTF-8');
  // 読み込み完了時のコールバック処理
  reader.onload = function() {
    let jsonobj = JSON.parse(reader.result);
    Suiripuz.board.jsonRead(jsonobj);
    Suiripuz.drawer.drawCanvas(Suiripuz.board);
  }
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