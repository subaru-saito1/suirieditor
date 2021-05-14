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
            this.cells[bi][bj][i].push('');
          }
        }
      }
    }
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
      'in': '#008000',
    };
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
    let ofsx = this.offset + (board.maxItemSize + 1) * this.csize;
    let ofsy = this.offset + (board.maxItemSize + 1) * this.csize;
    for (let bi = 0; bi < board.numElems - 1; bi++) {
      for (let bj = 0; bj < board.numElems - 1 - bi; bj++) {
        // 境界オフセット値計算
        let bdofsx = ofsx + bj * board.numItems * this.csize;
        let bdofsy = ofsy + bi * board.numItems * this.csize;
        let bdsize = board.numItems * this.csize;
        for (let i = 0; i < board.numItems; i++) {
          for (let j = 0; j < board.numItems; j++) {
            // オフセット値計算
            let cofsx = bdofsx + j * this.csize;
            let cofsy = bdofsy + i * this.csize;
            this.drawRect(ctx, cofsx, cofsy, this.csize, this.csize);
            this.drawCellText(board, ctx, cofsx, cofsy);
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
    // to do: 項目テキスト描画
    let elidx;
    if (mode === 'yoko') {
      elidx = parseInt(index / board.numItems);
    } else {
      elidx = board.numElems - parseInt(index / board.numItems) - 1;
    }
    let contents = board.elements[elidx].items[index % board.numItems]
    console.log(contents);
  }
  /**
   * 要素の中身描画関数
   */
  drawContents(board, ctx, index, ofsx, ofsy, mode) {
    // todo: 要素テキスト描画
    console.log(board.elements[index].contents)
  }

  /**
   * サブ要素描画関数（左側）
   */
  drawSubElementsTate(board, ctx, ofsx, ofsy, elidx) {
    for (let subel of board.elements[elidx].subelements) {
      // 矩形領域描画
      let sbofsx = ofsx + this.csize;
      let sbofsy = ofsy + subel.start * this.csize;
      let width = this.csize;
      let height = subel.size * this.csize;
      this.drawRect(ctx, sbofsx, sbofsy, width, height);
      // todo: サブカテゴリ左テキスト描画
      if (subel.type === 0) {
        console.log(subel.contents);
      } else {
        console.log(subel.contents1, subel.content2);
      }
    }
  }
  /**
   * サブ要素描画関数（上側）
   */
  drawSubElementsYoko(board, ctx, ofsx, ofsy, elidx) {
    for (let subel of board.elements[elidx].subelements) {
      // 矩形領域描画
      let sbofsx = ofsx + subel.start * this.csize;
      let sbofsy = ofsy + this.csize;
      let width = subel.size * this.csize;
      let height = this.csize;
      this.drawRect(ctx, sbofsx, sbofsy, width, height);
      // todo: サブカテゴリ上テキスト描画
      if (subel.type === 0) {
        console.log(subel.contents);
      } else {
        console.log(subel.contents1, subel.content2);
      }
    }
  }

  /**
   * セル描画関数：テキスト部分
   */
  drawCellText(board, ctx, ofsx, ofsy) {
    // todo: セルテキスト描画 
    ctx.lineWidth = 1;
    ctx.fillStyle = this.colors.in;
  }
}