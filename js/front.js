/**
 * front.js
 * 
 * 各種イベントハンドラの実装等
 */


/**
 * 新規盤面作成
 */
function newFile(evt) {
  console.log('新規作成');
}

/**
 * メニュー実行
 */
function fileMenu(evt) {
  console.log('ファイルメニュー実行');
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