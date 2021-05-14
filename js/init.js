
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

Suiripuz.board = new Board();
Suiripuz.drawer = new Drawer();
/*
Suiripuz.astack = new ActionStack();   // アクションスタック作成
Suiripuz.board  = new Board();         // 初期盤面の作成
Suiripuz.config = initConfig();        // 全般設定類
Suiripuz.drawer = new Drawer();        // 描画クラス
*/

// イベントハンドラ設定
setEventHundler();
// 初回描画
Suiripuz.drawer.drawCanvas(Suiripuz.board);


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
  $('canvas').keydown(keyDownBoard);
  $('canvas').blur(blurBoard);

  // ページ離脱時の警告
  window.addEventListener('beforeunload', function(evt) {
    let msg = '変更が失われますが、よろしいですか？';
    evt.returnValue = msg;
    return msg;
  })
}