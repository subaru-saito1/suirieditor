/**
 * classes.js
 * 
 * 各種クラスの実装
 */


/**
 * Boardクラス
 * 
 * 盤面本体のクラス
 * 中身はサンプルのJSONファイル準拠
 */
class Board {

  /**
   * コンストラクタ
   * @param {int} numElems 要素数
   * @param {int} numItems 項目数
   */
  constructor(numElems=3, numItems=5) {
    this.numElems = numElems;
    this.numItems = numItems;
    this.maxCellSize = this.numItems * (this.numElems - 1);
    this.minItemSize = 3;
    this.maxItemSize = 3;
    this.initElements();
    this.initCells();
  }

  /**
   * 要素の初期化
   */
  initElements() {
    this.elements = [];
    for (let el = 0; el < this.numElems; el++) {
      let elobj = {};
      elobj.contents = '';
      elobj.subelements = [];
      elobj.items = [];
      for (let it = 0; it < this.numItems; it++) {
        elobj.items.push('');
      }
      this.elements.push(elobj);
    }
  }

  /**
   * セルの初期化
   * 
   * セルは bi, bj, i, j の四次元配列で管理
   */
  initCells() {
    this.cells = [];
    for (let bi = 0; bi < this.numElems - 1; bi++) {
      this.cells.push([]);
      for (let bj = 0; bj < this.numElems - 1 - bi; bj++) {
        this.cells[bi].push([]);
        for (let i = 0; i < this.numItems; i++) {
          this.cells[bi][bj].push([]);
          for (let j = 0; j < this.numItems; j++) {
            let cell_obj = {};
            cell_obj.contents = '';   // 空白、o, x
            cell_obj.textcolor = 3;   // メイン色
            cell_obj.bgcolor = 0;     // 背景色
            this.cells[bi][bj][i].push(cell_obj);
          }
        }
      }
    }
  }

  /**
   * JSON形式オブジェクトを読込
   */
  jsonRead(obj) {
    this.numElems = obj.numElems;
    this.numItems = obj.numItems;
    this.maxCellSize = this.numItems * (this.numElems - 1);
    // 各要素、項目をコピー
    this.elements = []
    for (let objel of obj.elements) {
      let el = {}
      el.contents = objel.contents;
      el.subelements = [];
      el.items = objel.items.slice();
      // サブ要素のコピー
      for (let objsubel of objel.subelements) {
        let subel = {}
        subel.type = objsubel.type;
        if (subel.type === 0) {
          subel.contents = objsubel.contents;
        } else {
          subel.contents1 = objsubel.contents1;
          subel.contents2 = objsubel.contents2;
        }
        subel.start = objsubel.start;
        subel.size = objsubel.size;
        el.subelements.push(subel);
      }
      this.elements.push(el);
    }
    // 最大項目長を計算
    this.calcItemSize();
    this.initCells();     // セルの初期化 (todo: jsonの中身を反映)
  }

  /**
   * 項目の最大長を計算
   */
  calcItemSize() {
    const fontratio = Suiripuz.drawer.fontratio;
    let maxitemsize = this.minItemSize;
    for (let el of this.elements) {
      let initsize = 0;
      // サブカテゴリ分の幅を考慮
      if (el.subelements.length > 0) {
        initsize = 1;
      }
      for (let it of el.items) {
        let itemsize = initsize + it.length * fontratio;
        if (itemsize > maxitemsize) {
          maxitemsize = itemsize;
        }
      }
    }
    this.maxItemSize = maxitemsize;
  }

  /**
   * 現在の盤面をJSON形式の文字列で返す 
   */
  jsonWrite() {
    let obj = {}
    obj.numElems = this.numElems;
    obj.numItems = this.numItems;
    obj.elements = this.elements;
    return JSON.stringify(obj, null, 2);
  }

  /**
   * 現在の解答盤面を消去する
   */
  ansClear() {
    for (let bi = 0; bi < this.numElems - 1; bi++) {
      for (let bj = 0; bj < this.numElems - bi - 1; bj++) {
        for (let i = 0; i < this.numItems; i++) {
          for (let j = 0; j < this.numItems; j++) {
            this.cells[bi][bj][i][j].contents = '';
            this.cells[bi][bj][i][j].textcolor = 0;
            this.cells[bi][bj][i][j].bgcolor = 0;
          }
        }
      }
    }
  }

  /**
   * URL書き出し
   */
  urlWrite() {
    let url = 'https://subaru-saito1.github.io/suirieditor?';
    let splitchar = '_'
    url += (this.numElems);        // 要素数
    url += ('_' + this.numItems);  // 項目数
    for (let el of this.elements) {
      // 要素名エンコード
      url += ('_' + encodeURIComponent(el.contents));
      // サブ要素エンコード処理
      url += ('_' + el.subelements.length);
      for (let subel of el.subelements) {
        url += ('_' + subel.type);
        url += ('_' + subel.start);
        url += ('_' + subel.size);
        if (subel.type === 0) {
          url += ('_' + encodeURIComponent(subel.contents));
        } else {
          url += ('_' + encodeURIComponent(subel.contents1));
          url += ('_' + encodeURIComponent(subel.contents2));
        }
      } 
      // 項目エンコード
      for (let item of el.items) {
        url += ('_' + encodeURIComponent(item));
      }
    }
    return url;
  }

  /**
   * URL読込（クエリ部分を読み込み）
   */
  urlRead(query) {
    let tokens = query.split('_');
    let cnt = 0;
    this.numElems = parseInt(tokens[cnt++]);
    this.numItems = parseInt(tokens[cnt++]);
    this.maxCellSize = this.numItems * (this.numElems - 1);
    // 各要素、項目をコピー
    this.elements = []
    for (let e = 0; e < this.numElems; e++) {
      let el = {}
      // 要素
      el.contents = decodeURIComponent(tokens[cnt++]);
      // サブ要素
      el.subelements = [];
      let subelems = parseInt(tokens[cnt++]);
      for (let sb = 0; sb < subelems; sb++) {
        let subel = {}
        subel.type = parseInt(tokens[cnt++]);
        subel.start = parseInt(tokens[cnt++]);
        subel.size = parseInt(tokens[cnt++]);
        if (subel.type === 0) {
          subel.contents = decodeURIComponent(tokens[cnt++]);
        } else {
          subel.contents1 = decodeURIComponent(tokens[cnt++]);
          subel.contents2 = decodeURIComponent(tokens[cnt++]);
        }
        el.subelements.push(subel);
      }
      // 項目
      el.items = []
      for (let it = 0; it < this.numItems; it++) {
        el.items.push(decodeURIComponent(tokens[cnt++]));
      }
      this.elements.push(el);
    }
    // 最大項目長を計算
    this.calcItemSize();
    this.initCells();      // セルの初期化
  }
}



/**
 * Drawerクラス
 * 
 * 盤面描画関連
 */
class Drawer {

  /**
   * コンストラクタ
   * 描画初期値類の設定
   */
  constructor() {
    this.offset = 15;
    this.csize = $('#setsize').val() - 0;
    this.colors = {
      'bg': '#ffffff',
      'bd': '#333333',
    };
    this.colorid_in = 3;    // 現在のテキスト色ID
    this.colors_in_list = [
      [0  , 0  , 0.3 ],  // 0: gray
      [0  , 1.0, 0.5 ],  // 1: red
      [60 , 1.0, 0.35],  // 2: yellow
      [120, 1.0, 0.3 ],  // 3: green (def)
      [180, 1.0, 0.35],  // 4: cyan
      [240, 1.0, 0.5 ],  // 5: blue
      [300, 1.0, 0.5 ],  // 6: purple
    ];
    this.colorid_bg = 0;
    this.colors_bg_list = [
      [0  , 0  , 1.0 ],  // 0: gray
      [0  , 1.0, 0.75],  // 1: red
      [60 , 1.0, 0.75],  // 2: yellow
      [120, 1.0, 0.75],  // 3: green (def)
      [180, 1.0, 0.75],  // 4: cyan
      [240, 1.0, 0.75],  // 5: blue
      [300, 1.0, 0.75],  // 6: purple
    ]
    this.fontratio = 0.7;
    this.fontdivide = 1.6;
  }

  /**
   * 描画関数本体
   */
  drawCanvas(board) {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    // 背景描画
    let [maxwidth, maxheight] = this.getCanvasSize(Suiripuz.board);
    canvas.setAttribute('width', maxwidth);
    canvas.setAttribute('height', maxheight);
    ctx.fillStyle = this.colors.bg;
    ctx.fillRect(0, 0, maxwidth, maxheight);

    // 盤面描画
    this.drawCell(board, ctx);
    this.drawElements(board, ctx);
  }

  /**
   * キャンバスサイズの取得
   */
  getCanvasSize(board) {
    let canvassize = 0;
    canvassize += this.offset * 2;                      // 余白
    canvassize += (board.maxItemSize + 1) * this.csize;  // 端部分
    canvassize += board.maxCellSize * this.csize;       // セル部分
    return [canvassize, canvassize];
  }

  /**
   * セル描画関数メイン
   */
  drawCell(board, ctx) {
    // オフセットの計算
    const ofsx = this.offset + (board.maxItemSize + 1) * this.csize;
    const ofsy = this.offset + (board.maxItemSize + 1) * this.csize;
    for (let bi = 0; bi < board.numElems - 1; bi++) {
      for (let bj = 0; bj < board.numElems - 1 - bi; bj++) {
        // 境界オフセット値計算
        const bdofsx = ofsx + bj * board.numItems * this.csize;
        const bdofsy = ofsy + bi * board.numItems * this.csize;
        const bdsize = board.numItems * this.csize;
        for (let i = 0; i < board.numItems; i++) {
          for (let j = 0; j < board.numItems; j++) {
            // オフセット値計算
            const cofsx = bdofsx + j * this.csize;
            const cofsy = bdofsy + i * this.csize;
            const cval = board.cells[bi][bj][i][j].contents;
            const ccolor = board.cells[bi][bj][i][j].textcolor;
            this.drawRect(ctx, cofsx, cofsy, this.csize, this.csize);
            this.drawCellText(ctx, cofsx, cofsy, cval, ccolor);
          }
        }
        this.drawBorder(board, ctx, bdofsx, bdofsy, bdsize, bdsize)
      }
    }
  }

  /**
   * 矩形領域描画（汎用）
   */
  drawRect(ctx, ofsx, ofsy, width, height) {
    ctx.strokeStyle = this.colors.bd;
    ctx.lineWidth = 1.5;
    ctx.fillStyle = this.colors.bg;
    ctx.strokeRect(ofsx, ofsy, width, height);
    ctx.fillRect(ofsx, ofsy, width, height);
  }
  /**
   * 境界部分描画（セル部分）
   */
  drawBorder(board, ctx, ofsx, ofsy, width, height) {
    ctx.strokeStyle = this.colors.bd;
    ctx.lineWidth = 3;
    ctx.strokeRect(ofsx, ofsy, width, height);
  }
  /**
   * 境界部分描画（要素、項目部分）
   */
  drawBorderLine(board, ctx, sx, sy, gx, gy) {
    ctx.strokeStyle = this.colors.bd;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(gx, gy);
    ctx.stroke();
  }

  /**
   * 要素描画関数本体
   */
  drawElements(board, ctx) {
    this.drawElementsTate(board, ctx);
    this.drawElementsYoko(board, ctx);
  }

  /**
   * 要素描画関数（左側）
   */
  drawElementsTate(board, ctx) {
    let ofsx = this.offset;
    let ofsy = this.offset + (board.maxItemSize + 1) * this.csize;
    // 項目描画
    for (let j = 0; j < board.numItems * (board.numElems - 1); j++) {
      let iofsx = ofsx + this.csize;
      let iofsy = ofsy + j * this.csize;
      let width = board.maxItemSize * this.csize;
      let height = this.csize;
      this.drawItem(board, ctx, iofsx, iofsy, width, height, j, 'yoko');
    }
    // サブ要素と要素の描画
    for (let ej = 0; ej < board.numElems - 1; ej++) {
      let eofsy = ofsy + ej * board.numItems * this.csize
      this.drawSubElementsTate(board, ctx, ofsx, eofsy, ej);
      this.drawContents(board, ctx, ej, ofsx, eofsy, 'tate');
    }
    // 境界描画
    for (let ej = 0; ej < board.numElems; ej++) {
      let sx = ofsx;
      let sy = ofsy + ej * board.numItems * this.csize;
      let gx = ofsx + (board.maxItemSize + 1) * this.csize;
      this.drawBorderLine(board, ctx, sx, sy, gx, sy)
    }
    // セル接面との境界上書き
    let sgx = ofsx + (board.maxItemSize + 1) * this.csize;
    let gy = ofsy + board.maxCellSize * this.csize;
    this.drawBorderLine(board, ctx, sgx, ofsy, sgx, gy);
  }

  /**
   * 要素描画関数（上側）
   */
  drawElementsYoko(board, ctx) {
    let ofsx = this.offset + (board.maxItemSize + 1) * this.csize;
    let ofsy = this.offset;
    // 項目描画
    for (let i = 0; i < board.numItems * (board.numElems - 1); i++) {
      let iofsx = ofsx + i * this.csize;
      let iofsy = ofsy + this.csize;
      let width = this.csize;
      let height = board.maxItemSize * this.csize;
      this.drawItem(board, ctx, iofsx, iofsy, width, height, i, 'tate');
    }
    // サブ要素と要素の描画
    for (let ei = 0; ei < board.numElems - 1; ei++) {
      let eofsx = ofsx + ei * board.numItems * this.csize;
      this.drawSubElementsYoko(board, ctx, eofsx, ofsy, board.numElems - ei - 1);
      this.drawContents(board, ctx, board.numElems - ei - 1, eofsx, ofsy, 'yoko');
    }
    // 境界描画
    for (let ei = 0; ei < board.numElems; ei++) {
      let sx = ofsx + ei * board.numItems * this.csize;
      let sy = ofsy
      let gy = ofsy + (board.maxItemSize + 1) * this.csize;
      this.drawBorderLine(board, ctx, sx, sy, sx, gy)
    }
    // セル接面との境界上書き
    let sgy = ofsy + (board.maxItemSize + 1) * this.csize;
    let gx = ofsx + board.maxCellSize * this.csize;
    this.drawBorderLine(board, ctx, ofsx, sgy, gx, sgy);
  }

  /**
   * 項目描画関数
   */
  drawItem(board, ctx, ofsx, ofsy, width, height, index, mode) {
    this.drawRect(ctx, ofsx, ofsy, width, height);
    // 項目の取得
    let elidx;
    if (mode === 'yoko') {
      elidx = parseInt(index / board.numItems);
    } else {
      elidx = board.numElems - parseInt(index / board.numItems) - 1;
    }
    // 項目テキスト描画（右揃え、下揃え）
    let contents = board.elements[elidx].items[index % board.numItems]
    if (mode === 'yoko') {
      let cx = ofsx + (board.maxItemSize - (contents.length - 0.5) * this.fontratio) * this.csize;
      let cy = ofsy + this.csize / 2;
      for (let c of contents) {
        this.drawChar(ctx, cx, cy, c);
        cx += this.csize * this.fontratio;
      }
    } else {
      let cx = ofsx + this.csize / 2;
      let cy = ofsy + (board.maxItemSize - (contents.length - 0.5) * this.fontratio) * this.csize;
      for (let c of contents) {
        this.drawContentsTate(ctx, cx, cy, c);
        cy += this.csize * this.fontratio;
      }
    }
  }
  /**
   * 要素の中身描画関数
   */
  drawContents(board, ctx, index, ofsx, ofsy, mode) {
    // 項目テキスト描画（中央寄せ）
    let contents = board.elements[index].contents;
    if (mode === 'yoko') {
      let cx = ofsx + (board.numItems * this.csize) / 2;
      cx -= (contents.length / 2 - 0.5) * this.csize * this.fontratio;
      let cy = ofsy + this.csize / 2;
      for (let c of contents) {
        this.drawChar(ctx, cx, cy, c); 
        cx += this.csize * this.fontratio;
      }
    } else {
      let cx = ofsx + this.csize / 2;
      let cy = ofsy + (board.numItems * this.csize) / 2;
      cy -= (contents.length / 2 - 0.5) * this.csize * this.fontratio;
      for (let c of contents) {
        this.drawContentsTate(ctx, cx, cy, c);
        cy += this.csize * this.fontratio;
      }
    }
  }

  /**
   * サブ要素描画関数（左側）
   */
  drawSubElementsTate(board, ctx, ofsx, ofsy, elidx) {
    for (let subel of board.elements[elidx].subelements) {
      // 矩形領域描画
      let sbofsx = ofsx + this.csize;
      let sbofsy = ofsy + subel.start * this.csize;
      let width = this.csize - 1;
      let height = subel.size * this.csize - 1;
      this.drawRect(ctx, sbofsx, sbofsy, width, height);
      // サブカテゴリ左テキスト描画（中央寄せ）
      if (subel.type === 0) {
        let cx = sbofsx + this.csize / 2;
        let cy = sbofsy + height / 2;
        cy -= (subel.contents.length / 2 - 0.5) * this.csize * this.fontratio;
        for (let c of subel.contents) {
          this.drawContentsTate(ctx, cx, cy, c);
          cy += this.csize * this.fontratio;
        }
      // サブカテゴリ左テキスト描画（上下寄せ）
      } else {
        let cx = sbofsx + this.csize / 2;
        let cy = sbofsy + this.csize / 2;
        // 前半
        this.drawChar(ctx, cx, cy, '↑');
        cy += this.csize * this.fontratio;
        for (let c of subel.contents1) {
          this.drawContentsTate(ctx, cx, cy, c);
          cy += this.csize * this.fontratio;
        }
        // 後半
        cy = sbofsy + height - (subel.contents2.length + 1 - 0.5) * this.csize * this.fontratio;
        for (let c of subel.contents2) {
          this.drawContentsTate(ctx, cx, cy, c);
          cy += this.csize * this.fontratio;
        }
        cy = sbofsy + height - 0.5 * this.csize * this.fontratio;
        this.drawChar(ctx, cx, cy, '↓');
      }
    }
  }
  /**
   * 縦書き用補助関数
   */
  drawContentsTate(ctx, cx, cy, c) {
    // 漢数字に変換
    if (this.isDigit(c)) {
      c = this.convertNum2Kanji(c);
    } else if (c === 'ー' || c === '-') {
      c = '|'
    }
    this.drawChar(ctx, cx, cy, c);
  }
  
  /**
   * サブ要素描画関数（上側）
   */
  drawSubElementsYoko(board, ctx, ofsx, ofsy, elidx) {
    for (let subel of board.elements[elidx].subelements) {
      // 矩形領域描画
      let sbofsx = ofsx + subel.start * this.csize;
      let sbofsy = ofsy + this.csize;
      let width = subel.size * this.csize - 1;
      let height = this.csize - 1;
      this.drawRect(ctx, sbofsx, sbofsy, width, height);
      // todo: サブカテゴリ上テキスト描画
      if (subel.type === 0) {
        let cx = sbofsx + width / 2 - (subel.contents.length / 2 - 0.5) * this.csize * this.fontratio;
        let cy = sbofsy + this.csize / 2;
        for (let c of subel.contents) {
          this.drawChar(ctx, cx, cy, c);
          cx += this.csize * this.fontratio;
        }
      } else {
        let cy = sbofsy + this.csize / 2;
        // 前半
        let cx = sbofsx + this.csize / 2;
        this.drawChar(ctx, cx, cy, '←');
        cx += this.csize * this.fontratio;
        for (let c of subel.contents1) {
          this.drawChar(ctx, cx, cy, c);
          cx += this.csize * this.fontratio;
        }
        // 後半
        cx = sbofsx + width - (subel.contents2.length + 0.5) * this.csize * this.fontratio;
        for (let c of subel.contents2) {
          this.drawChar(ctx, cx, cy, c); 
          cx += this.csize * this.fontratio;
        }
        this.drawChar(ctx, cx, cy, '→');
      }
    }
  }

  /**
   * セル描画関数：テキスト部分
   */
  drawCellText(ctx, ofsx, ofsy, c, ccolor) {
    ctx.strokeStyle = this.strHsl(this.colors_in_list[ccolor]);
    if (c === 'o') {
      ctx.lineWidth = 2;
      let cx = ofsx + this.csize / 2;
      let cy = ofsy + this.csize / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, this.csize/2.5, 0, 2*Math.PI);
      ctx.closePath();
      ctx.stroke();
    } else if (c === 'x') {
      let p = 0.1 * this.csize;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ofsx + p, ofsy + p);
      ctx.lineTo(ofsx + this.csize - p, ofsy + this.csize - p);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ofsx + this.csize - p, ofsy + p);
      ctx.lineTo(ofsx + p, ofsy + this.csize - p);
      ctx.closePath();
      ctx.stroke();
    }
  }

  /**
   * 指定された座標を中心に文字を書く
   */
  drawChar(ctx, x, y, ch) {
    ctx.lineWidth = 1;
    ctx.fillStyle = this.colors.bd;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let fontsize = this.csize / this.fontdivide;
    ctx.font = fontsize + 'px sans-serif';
    ctx.fillText(ch, x, y);
  }

  /* ====================== ユーティリティ系 ============================== */
  // 関数の名前空間がほしいのでクラスメソッドとして実装

  /**
   * 文字が数字かどうかチェック。下の関数を併用
   */
  isDigit(ch) {
    return ((ch >= '0') && ch <= '9');
  }
  /**
   * 縦書きの場合、数字を漢数字に直す
   */
  convertNum2Kanji(ch) {
    const kanji = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    return kanji[parseInt(ch)];
  }

  /**
   * HSLの配列の値から Canvas, CSSで使用するHSL文字列を生成
   */
  strHsl(hsl_list) {
    let ret = "hsl(" + hsl_list[0] + ", ";
    ret += (hsl_list[1] * 100) + "%, ";
    ret += (hsl_list[2] * 100) + "%)";
    return ret;
  }
}