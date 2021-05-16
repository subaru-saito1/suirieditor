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

/**
 * 盤面クリック
 */
function clickBoard(evt) {
  evt.preventDefault();   // 右クリックでメニューが開かないようにする
  // objinfo概要
  // type:cell => bi, bj, i, j の四つ組
  // type:item => elidx, idx
  // type:subel => elidx, subelidx 
  // type:elem => elidx
  let objinfo = identifyClickPos(evt.offsetX, evt.offsetY)
  if (objinfo.type === 'cell') {
    console.log(objinfo);
  } else if (objinfo.type === 'item') {
    console.log(objinfo);
  } else if (objinfo.type === 'subel') {
    console.log(objinfo);
  } else if (objinfo.type === 'elem') {
    console.log(objinfo);
  } else {
    console.log(objinfo, '(空白)');
  }
  Suiripuz.drawer.drawCanvas(Suiripuz.board);
}

/**
 * マウス座標から盤面オブジェクトを特定する関数（大枠）
 */
function identifyClickPos(mx, my) {
  let retobj = {}
  mx -= Suiripuz.drawer.offset;
  my -= Suiripuz.drawer.offset;
  mainofsx = (Suiripuz.board.maxItemSize + 1) * Suiripuz.drawer.csize;
  mainofsy = (Suiripuz.board.maxItemSize + 1) * Suiripuz.drawer.csize;
  if (mx >= mainofsx && my >= mainofsy) {
    // セル or 範囲外
    retobj = identifyClickPosCell(mx - mainofsx, my - mainofsy);
  } else if (mx >= mainofsx && my < mainofsy) {
    // 上側要素枠 or 範囲外
    retobj = identifyClickPosElYoko(mx - mainofsx, my);
  } else if (mx < mainofsx && my >= mainofsy) {
    // 左側要素枠 or 範囲外
    retobj = identifyClickPosElTate(mx, my - mainofsy);
  } else {
    // 左上の枠外
    retobj.type === 'none';
  }
  return retobj;
}

/**
 * 補正済みマウス座標からセル位置を特定
 */
function identifyClickPosCell(mx, my) {
  let obj = {}
  // 変数名が長いのでエイリアス
  let csize = Suiripuz.drawer.csize;
  let elems = Suiripuz.board.numElems;
  let items = Suiripuz.board.numItems;
  // 座標値計算
  let x = parseInt(mx / csize);
  let y = parseInt(my / csize);
  let bx = parseInt(x / items);
  let by = parseInt(y / items);
  let cx = parseInt(x % items);
  let cy = parseInt(y % items);
  // 範囲外バリデーション
  if (bx + by >= elems - 1) {
    obj = {'type': 'none'};
  } else {
    obj = {'type': 'cell', 'bi': bx, 'bj': by, 'i': cx, 'j': cy};
  }
  return obj;
}

/**
 * 補正済みマウス座標から上要素オブジェクトを特定
 */
function identifyClickPosElYoko(mx, my) {
  let obj = {}
  // 例によってエイリアス
  let csize = Suiripuz.drawer.csize;
  let elems = Suiripuz.board.numElems;
  let items = Suiripuz.board.numItems;
  // 座標値計算
  let x = Math.floor(mx / csize);
  let y = Math.floor(my / csize);
  // 範囲外バリデーション
  if ((y < 0) || (x >= Suiripuz.board.maxCellSize)) {
    obj = {'type': 'none'};
  } else {
    let bx = Math.floor(x / items);
    let cx = parseInt(x % items);
    let elidx = elems - bx - 1;
    if (y === 0) {
      // 要素
      obj = {'type': 'elem', 'elidx': elidx};
    } else if (y > 1) {
      // 項目
      obj = {'type': 'elem', 'elidx': elidx, 'idx': cx};
    } else if (y === 1){
      // サブ要素
      let sbidx = identifySubelems(elidx, cx);
      if (sbidx < 0) {
        obj = {'type': 'elem', 'elidx': elidx, 'idx': cx};
      } else {
        obj = {'type': 'subel', 'elidx': elidx, 'subelidx': sbidx};
      }
    }
  }
  return obj;
}

/**
 * 補正済みマウス座標から左要素オブジェクトを特定 
 */
function identifyClickPosElTate(mx, my) {
  let obj = {}
  // 例によってエイリアス
  let csize = Suiripuz.drawer.csize;
  let elems = Suiripuz.board.numElems;
  let items = Suiripuz.board.numItems;
  // 座標値計算
  let x = Math.floor(mx / csize);
  let y = Math.floor(my / csize);
  // 範囲外バリデーション
  if ((x < 0) || (y >= Suiripuz.board.maxCellSize)) {
    obj = {'type': 'none'};
  } else {
    let by = Math.floor(y / items);
    let cy = parseInt(y % items);
    let elidx = by;
    if (x === 0) {
      // 要素
      obj = {'type': 'elem', 'elidx': elidx};
    } else if (x > 1) {
      // 項目
      obj = {'type': 'elem', 'elidx': elidx, 'idx': cy};
    } else if (x === 1){
      // サブ要素
      let sbidx = identifySubelems(elidx, cy);
      if (sbidx < 0) {
        obj = {'type': 'elem', 'elidx': elidx, 'idx': cy};
      } else {
        obj = {'type': 'subel', 'elidx': elidx, 'subelidx': sbidx};
      }
    }
  }
  return obj;
}

/**
 * 離散化座標からどのサブ要素に属するかを判定
 * サブ要素に属さない場合は-1を返すものとする
 */
function identifySubelems(elidx, n) {
  let i = 0; 
  for (let subel of Suiripuz.board.elements[elidx].subelements) {
    if (n >= subel.start && n < subel.start + subel.size) {
      return i;
    }
    i++;
  }
  return -1;
}
