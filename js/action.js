/**
 * action.js
 * 
 * Undo/Redo用の操作履歴を管理するクラス群
 */


/**
 * ActionStack クラス
 * 
 * Actionをスタック構造で管理、Undo/Redoボタンが触れる場所
 */
 class ActionStack {

  /**
   * コンストラクタ
   */
  constructor() {
    this.stack = ["dummy"];  // スタック本体
    this.sp = 0;      // スタックポインタ
    this.spmax = 0;   // 現在の最新位置
    this.syncFrontUI();
  }

  /**
   * Actionをプッシュ
   */
  push(newaction) {
    if (this.sp > 0 && this.stack[this.sp].isSquashable(newaction)) {
      this.stack[this.sp].squash(newaction);
    } else {
      this.sp++;
      this.spmax = this.sp;  // 現在以降のアクションを無効化
      if (this.spmax > this.stack.length) {
        this.stack.push(newaction)
      } else {
        this.stack[this.sp] = newaction;
      }
    }
    this.syncFrontUI();
  }

  /**
   * 操作を一つ元に戻す
   */
  undo() {
    if (this.sp > 0) {
      this.stack[this.sp].revert();
      this.sp--;
    }
    this.syncFrontUI();
  }

  /**
   * 操作を一つ進める
   */
  redo() {
    if (this.sp < this.spmax) {
      this.sp++;
      this.stack[this.sp].commit();
    }
    this.syncFrontUI();
  }

  /**
   * スタックの状態に応じて Undo, Redoボタンの状態同期
   */
  syncFrontUI() {
    if (this.sp === 0) {
      $('#opform_undo').prop('disabled', true);
    } else {
      $('#opform_undo').prop('disabled', false);
    }
    // Redo: スタックが最新 (sp = spmax) のとき
    if (this.sp === this.spmax) {
      $('#opform_redo').prop('disabled', true);
    } else {
      $('#opform_redo').prop('disabled', false);
    }

    // 他のメソッド全部から呼ばれるので、ここにデバッグを仕込む
    console.log(this.stack, this.sp, this.spmax);
  }
}


/**
 * Action クラス
 * 
 * Undo/Redoによる操作の一単位となるクラス
 */
class Action {

  /**
   * コンストラクタ
   * oplist: 基本操作単位（AtomicAction）のリスト
   */
  constructor(oplist=[]) {
    this.oplist = oplist;
  }

  /**
   * 現在のアクションをグローバル盤面に再適用
   */
  commit() {
    for (let op of this.oplist) {
      op.commit(Suiripuz.board);
    }
  }
  /**
   * 現在のアクションをグローバル盤面に逆適用
   */
  revert() {
    for (let op of this.oplist) {
      op.revert(Suiripuz.board);
    }
  }

  /**
   * 2つのアクション(最近のアクション vs 新規アクション）同士が統合可能か判定
   */
  isSquashable(newaction) {
    // 条件1: どちらも単一セルに対する操作であること
    if (this.oplist.length != 1 ||  newaction.oplist.length != 1) {
      return false;
    }
    const a1 = this.oplist[0];
    const a2 = newaction.oplist[0];
    // 条件2: 同一セルに対する操作であること
    if (a1.bi == a2.bi && a1.bj == a2.bj && a1.i == a2.i && a1.j == a2.j) {
      // 条件3: 推移条件が成り立つこと
      return a1.next_val == a2.prev_val && a1.next_color == a2.prev_color;
    } else {
      return false;
    }
  }

  /**
   * 2つのアクションを統合
   * isSquashableメソッドを通している前提
   */
  squash(newaction) {
    this.oplist[0].next_val = newaction.oplist[0].next_val;
    this.oplist[0].next_color = newaction.oplist[0].next_color;
  }
}

/**
 * AtomicAction クラス
 * 
 * Action型オブジェクトの構成要素となる、基本操作を管理するクラス
 */
class AtomicAction {
  /**
   * コンストラクタ
   * セル座標 (4つ組), 移行前セル状態, 移行後セル状態
   */
  constructor(bi, bj, i, j, pv, pc, nv, nc) {
    this.bi = bi;
    this.bj = bj;
    this.i = i;
    this.j = j;
    this.prev_val = pv;
    this.prev_color = pc;
    this.next_val = nv;
    this.next_color = nc;
  }

  /**
   * 与えられた盤面に適用
   */
  commit(board) {
    const current_cell = board.cells[this.bi][this.bj][this.i][this.j];
    if (current_cell.contents == this.prev_val && current_cell.textcolor == this.prev_color) {
      board.cells[this.bi][this.bj][this.i][this.j].contents = this.next_val;
      board.cells[this.bi][this.bj][this.i][this.j].textcolor = this.next_color;
    } else {
      console.log(this);
      throw 'Commit Error!';
    }
  }

  /**
   * 与えられた盤面に逆適用
   */
  revert(board) {
    const current_cell = board.cells[this.bi][this.bj][this.i][this.j];
    if (current_cell.contents == this.next_val && current_cell.textcolor == this.next_color) {
      board.cells[this.bi][this.bj][this.i][this.j].contents = this.prev_val;
      board.cells[this.bi][this.bj][this.i][this.j].textcolor = this.prev_color;
    } else {
      console.log(this);
      throw 'Revert Error!';
    }
  }
}