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
    this.maxItemSize = 4;
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
      elobj.subindex = [];
      elobj.items = [];
      for (let it = 0; it < this.numItems; it++) {
        elobj.subindex.push(null);
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



/* 仮：キャンバス描画 */
function drawCanvasKari() {
  // 描画コンテキスト取得
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  // 背景描画
  canvas.setAttribute('width', 400);
  canvas.setAttribute('height', 400);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 400, 400);
}