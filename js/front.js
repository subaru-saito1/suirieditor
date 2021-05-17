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
  Suiripuz.config.qamode = 'question';
  Suiripuz.drawer.drawCanvas(Suiripuz.board);
}

/**
 * 解答入力モード変更
 */
function setAmode(evt) {
  Suiripuz.config.qamode = 'answer';
  Suiripuz.drawer.drawCanvas(Suiripuz.board);
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
  Suiripuz.board.ansClear();
  Suiripuz.drawer.drawCanvas(Suiripuz.board);
}


// ==================================================================================

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
    clickCell(objinfo, evt.button);
  } else if (objinfo.type === 'item') {
    clickItem(objinfo);
  } else if (objinfo.type === 'subel') {
    clickSubel(objinfo);
  } else if (objinfo.type === 'elem') {
    clickElem(objinfo);
  } else {
    // 空白クリック時：何もしない
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
    obj = {'type': 'cell', 'bi': by, 'bj': bx, 'i': cy, 'j': cx};
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
      obj = {'type': 'elem', 'elidx': elidx, 'mode': 'yoko'};
    } else if (y > 1) {
      // 項目
      obj = {'type': 'item', 'elidx': elidx, 'idx': cx, 'mode': 'tate'};
    } else if (y === 1){
      // サブ要素
      let sbidx = identifySubelems(elidx, cx);
      if (sbidx < 0) {
        obj = {'type': 'item', 'elidx': elidx, 'idx': cx, 'mode': 'tate'};
      } else {
        obj = {'type': 'subel', 'elidx': elidx, 'subelidx': sbidx, 'mode': 'yoko'};
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
      obj = {'type': 'elem', 'elidx': elidx, 'mode': 'tate'};
    } else if (x > 1) {
      // 項目
      obj = {'type': 'item', 'elidx': elidx, 'idx': cy, 'mode': 'yoko'};
    } else if (x === 1){
      // サブ要素
      let sbidx = identifySubelems(elidx, cy);
      if (sbidx < 0) {
        obj = {'type': 'item', 'elidx': elidx, 'idx': cy, 'mode': 'yoko'};
      } else {
        obj = {'type': 'subel', 'elidx': elidx, 'subelidx': sbidx, 'mode': 'tate'};
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
  let ret = -1;
  for (let subel of Suiripuz.board.elements[elidx].subelements) {
    if (n >= subel.start && n < subel.start + subel.size) {
      ret = i;
    }
    i++;
  }
  return ret;
}


/**
 * セルクリック時の処理
 * button: 0で左、2で右
 */
function clickCell(obj, button) {
  let cellval = Suiripuz.board.cells[obj.bi][obj.bj][obj.i][obj.j];
  if (button === 0) {
    if (cellval === '') {
      Suiripuz.board.cells[obj.bi][obj.bj][obj.i][obj.j] = 'o';
    } else if (cellval === 'o') {
      Suiripuz.board.cells[obj.bi][obj.bj][obj.i][obj.j] = 'x';
    } else {
      Suiripuz.board.cells[obj.bi][obj.bj][obj.i][obj.j] = '';
    }
  } else if (button === 2) {
    if (cellval === '') {
      Suiripuz.board.cells[obj.bi][obj.bj][obj.i][obj.j] = 'x';
    } else if (cellval === 'x') {
      Suiripuz.board.cells[obj.bi][obj.bj][obj.i][obj.j] = 'o';
    } else {
      Suiripuz.board.cells[obj.bi][obj.bj][obj.i][obj.j] = '';
    }
  }
}


// ===================================================================================
// キーボード入力インタフェース

/**
 * 項目名ポップアップ表示
 */
function clickItem(obj) {
  // 一旦すべてのポップアップを閉じる
  $('.popup_overlay').removeClass('active');
  // 必要な要素類を取得してポップアップ表示
  let contents = Suiripuz.board.elements[obj.elidx].items[obj.idx];
  $('#itemform_elidx').val(obj.elidx);
  $('#itemform_itemidx').val(obj.idx);
  $('#itemform').val(contents);
  $('#itemform_label').text('項目名入力 (要素' + (obj.elidx+1) + ', 項目' + (obj.idx+1) + ')');
  // ポップアップ表示とフォーカス
  $('#popup_itemform').addClass('active');
  $('#itemform').focus();
}

/**
 * 項目名入力処理
 */
function inputItem() {
  // OK時の処理：項目名追加
  let elidx = parseInt($('#itemform_elidx').val());
  let itemidx = parseInt($('#itemform_itemidx').val());
  let contents = $('#itemform').val();
  Suiripuz.board.elements[elidx].items[itemidx] = contents;
  Suiripuz.board.calcItemSize();  // 最大長さの調整
  // ポップアップを閉じて再描画
  $('#popup_itemform').removeClass('active');
  Suiripuz.drawer.drawCanvas(Suiripuz.board);
}

/**
 * 要素名ポップアップ表示
 */
function clickElem(obj) {
  // 一旦すべてのポップアップを閉じる
  $('.popup_overlay').removeClass('active');
  // 必要な要素類を取得してポップアップ表示
  let contents = Suiripuz.board.elements[obj.elidx].contents;
  let numitems = Suiripuz.board.numItems;
  $('#elemform_elidx').val(obj.elidx);
  $('#elemform').val(contents);
  $('#elemform_label').text('要素名入力 (要素' + (obj.elidx+1) + ')');
  // サブ要素生成時のサイズ範囲を動的設定
  $('#elemform_checkbox').prop('checked', false);
  $('#elemform_substart').attr('min', 1);
  $('#elemform_substart').attr('max', numitems);
  $('#elemform_substart').val(1);
  $('#elemform_subsize').attr('min', 1);
  $('#elemform_subsize').attr('max', numitems);
  $('#elemform_subsize').val(numitems);
  // ポップアップ表示とフォーカス
  $('#popup_elemform').addClass('active');
  $('#elemform').focus();
}

/**
 * 要素名入力
 */
function inputElement() {
  // OK時の処理：要素名追加
  let elidx = parseInt($('#elemform_elidx').val());
  let contents = $('#elemform').val();
  Suiripuz.board.elements[elidx].contents = contents;
  // サブ要素の追加処理
  if ($('#elemform_checkbox').prop('checked')) {
    let substart = parseInt($('#elemform_substart').val()) - 1;
    let subsize = parseInt($('#elemform_subsize').val());
    // サブ要素作成（バリデーション付き）
    if (createSubelValidation(elidx, substart, subsize)) {
      subel = {};
      subel.type = 0;
      subel.contents = '';
      subel.start = substart;
      subel.size = subsize;
      Suiripuz.board.elements[elidx].subelements.push(subel);
      Suiripuz.board.calcItemSize();  // 最大長さの調整
    } else {
      alert('サブ要素の範囲が重複しています。')
    }
  }
  // ポップアップを閉じる
  $('#popup_elemform').removeClass('active');
  Suiripuz.drawer.drawCanvas(Suiripuz.board);
}

/**
 * サブ要素を作成可能かどうかバリデーション
 * 指定したstart, sizeが既存のサブ要素と重ならないか判定
 */
function createSubelValidation(elidx, start, size) {
  // 範囲バリデーション
  let items = Suiripuz.board.numItems;
  if (start < 0 || start >= items) {
    return false;
  } else if (size < 1 || start + size > items) {
    return false;
  }
  // 重複チェック
  for (let subel of Suiripuz.board.elements[elidx].subelements) {
    if (subel.start <= start) {
      if (subel.start + subel.size > start) {
        return false;
      }
    } else {
      if (start + size > subel.start) {
        return false;
      }
    }
  }
  return true;
}

/**
 * サブ要素名ポップアップ表示
 */
function clickSubel(obj) {
  // 一旦すべてのポップアップを閉じる
  $('.popup_overlay').removeClass('active');
  // 必要な要素類を取得してポップアップ表示
  let subtype = Suiripuz.board.elements[obj.elidx].subelements[obj.subelidx].type;
  if (subtype === 0) {
    let contents = Suiripuz.board.elements[obj.elidx].subelements[obj.subelidx].contents;
    $('#subelform_radio0').prop('checked', true);
    $('#subelform').val(contents);
    $('#subelform1').val('');
    $('#subelform2').val('');
  } else {
    let contents1 = Suiripuz.board.elements[obj.elidx].subelements[obj.subelidx].contents1;
    let contents2 = Suiripuz.board.elements[obj.elidx].subelements[obj.subelidx].contents2;
    $('#subelform_radio1').prop('checked', true);
    $('#subelform').val('');
    $('#subelform1').val(contents1);
    $('#subelform2').val(contents2);
  }
  $('#subelform_elidx').val(obj.elidx);
  $('#subelform_subelidx').val(obj.subelidx);
  $('#subelform_label').text('サブ要素名入力 (要素' + (obj.elidx+1) + ', 番号' + (obj.subelidx+1) + ')');
  // ポップアップ表示とフォーカス
  $('#popup_subelform').addClass('active');
  if (subtype === 0) {
    $('#subelform').focus();
  } else {
    $('#subelform1').focus();
  }
}

/**
 * サブ要素名入力
 */
function inputSubel() {
  // OK時の処理：サブ要素名変更
  let elidx = parseInt($('#subelform_elidx').val());
  let subelidx = parseInt($('#subelform_subelidx').val());
  if ($('#subelform_radio0').prop('checked')) {
    let contents = $('#subelform').val();
    Suiripuz.board.elements[elidx].subelements[subelidx].type = 0;
    Suiripuz.board.elements[elidx].subelements[subelidx].contents = contents;
  } else {
    let contents1 = $('#subelform1').val();
    let contents2 = $('#subelform2').val();
    Suiripuz.board.elements[elidx].subelements[subelidx].type = 1;
    Suiripuz.board.elements[elidx].subelements[subelidx].contents1 = contents1;
    Suiripuz.board.elements[elidx].subelements[subelidx].contents2 = contents2;
  }
  // ポップアップを閉じる
  $('#popup_subelform').removeClass('active');
  Suiripuz.drawer.drawCanvas(Suiripuz.board);
}

/**
 * サブ要素削除
 */
function deleteSubel() {
  // 削除時に処理：サブ要素削除
  let elidx = parseInt($('#subelform_elidx').val());
  let subelidx = parseInt($('#subelform_subelidx').val());
  Suiripuz.board.elements[elidx].subelements.splice(subelidx, 1);
  // ポップアップを閉じる
  $('#popup_subelform').removeClass('active');
  Suiripuz.drawer.drawCanvas(Suiripuz.board);
}