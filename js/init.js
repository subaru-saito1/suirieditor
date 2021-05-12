

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

drawCanvasKari();