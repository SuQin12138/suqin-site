let poems = [];
let currentIndex = -1;
let fadeDuration = 1500;   // 对应 CSS 动画时间
let intervalTime = 20000;  // 诗词自动切换时间

// 加载诗词 JSON
async function loadPoems() {
  const res = await fetch('poems.json');
  poems = await res.json();
  showRandomPoem();
  setInterval(showRandomPoem, intervalTime);
}

// 基础淡入
function fadeIn(el) {
  requestAnimationFrame(() => {
    el.style.opacity = 1;
  });
}

// 基础淡出
function fadeOut(el) {
  el.style.opacity = 0;
}

// 显示随机诗词
function showRandomPoem() {
  if (poems.length === 0) return;

  const card = document.getElementById("poem-card");
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const content = document.getElementById("content");
  const extra = document.getElementById("extra");

  // 移除旧的墨迹动画类
  [title, author, content, extra].forEach(el => {
    el.classList.remove('fade-ink');
  });

  fadeOut(card);

  setTimeout(() => {
    // 随机选择下一首诗
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * poems.length);
    } while (nextIndex === currentIndex);

    currentIndex = nextIndex;
    const poem = poems[currentIndex];

    title.textContent = poem.title;
    author.textContent = `${poem.dynasty} · ${poem.author}`;
    content.textContent = poem.content;
    extra.innerHTML = `
      <b>译文：</b>${poem.translation}<br><br>
      <b>赏析：</b>${poem.comment}
    `;
    extra.style.display = "none";

    fadeIn(card);

    // 添加墨迹扩散动画
    [title, author, content].forEach(el => {
      el.classList.add('fade-ink');
    });
  }, fadeDuration);
}

// 点击诗词卡片显示/隐藏详细内容
document.getElementById("poem-card").addEventListener("click", () => {
  const extra = document.getElementById("extra");
  extra.style.display = extra.style.display === "none" ? "block" : "none";
});

// 页面加载后启动
window.onload = loadPoems;