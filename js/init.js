
/**
 * init.js
 * 
 * ブラウザ読み込み時に実行されるスクリプト
 * - 各種初期化設定
 * - イベントハンドラの設定
 * - 描画呼び出し
 */


// グローバルオブジェクト設定
let Suiripuz = {}

// Suiripuz.astack = new ActionStack();
Suiripuz.board = new Board();
Suiripuz.config = {
  qamode: 'question',
}
Suiripuz.drawer = new Drawer();

// URL読込
let urlquery = location.href.split('?');
if (urlquery.length > 1) {
  Suiripuz.board.urlRead(urlquery[1]);
}
// イベントハンドラ設定
setEventHundler();
// 初回描画
Suiripuz.drawer.drawCanvas(Suiripuz.board);


/**
 * 初回盤面生成処理
 */
function initBoard() {
  new Board();
  let urlquery = location.href.split('?');
  if (urlquery.length > 1) {

  }
}


/**
 * イベントハンドラの設定
 */
function setEventHundler() {
  // 新規作成
  $('#newfile_ok').click(newFile);
  // ファイル処理
  $('#filemenu_go').click(fileMenu);
  // サイズ変更
  $('#setsize').change(setSize);
  // 問題入力モード
  $('#opform_qmode').change(setQmode);
  // 解答入力モード
  $('#opform_amode').change(setAmode);
  // 戻る
  $('#opform_undo').click(actionUndo);
  // 進む
  $('#opform_redo').click(actionRedo);
  // 解答消去
  $('#opform_clear').click(answerClear);

  // キャンバス
  $('canvas').click(clickBoard);
  $('canvas').on('contextmenu', clickBoard);  // 右クリック上書き
  /*
  $('canvas').keydown(keyDownBoard);
  $('canvas').blur(blurBoard);
  */
  
  // 各種ポップアップ
  $('#writeimg_ok').click(imgWrite);
  $('#writeurl_ok').click(urlWrite);
  $('#readurl_ok').click(urlRead);
  $('#writejson_ok').click(jsonWrite);
  $('#readjson_ok').click(jsonRead);
  // キャンセルボタン（ポップアップウィンドウを閉じる）
  $('#writeimg_ng, #readurl_ng, #writejson_ng, #readjson_ng').click(closePopup);
  // テキスト入力用インタフェース
  $('#itemform_ok').click(inputItem);
  $('#elemform_ok').click(inputElement);
  $('#subelform_ok').click(inputSubel);
  $('#subelform_del').click(deleteSubel);
  // キャンセルボタン
  $('#itemform_ng, #elementform_ng, #subelform_ng').click(closePopup);

  // ページ離脱時の警告
  window.addEventListener('beforeunload', function(evt) {
    let msg = '変更が失われますが、よろしいですか？';
    evt.returnValue = msg;
    return msg;
  })
}