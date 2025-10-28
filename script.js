let poems = [];
let currentIndex = -1;
let fadeDuration = 1500;
let intervalTime = 20000;
let filteredPoems = [];

const poemCard = document.getElementById("poem-card");
const title = document.getElementById("title");
const author = document.getElementById("author");
const content = document.getElementById("content");
const extra = document.getElementById("extra");

const searchInput = document.getElementById("search-input");
const categoryBtn = document.getElementById("category-btn");
const categoryList = document.getElementById("category-list");

async function loadPoems() {
  const res = await fetch('poems.json');
  poems = await res.json();
  filteredPoems = poems;
  populateCategories();
  showRandomPoem();
  setInterval(() => showRandomPoem(), intervalTime);
}

// 填充分类菜单
function populateCategories() {
  const categories = [...new Set(poems.map(p => p.dynasty))];
  categoryList.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat;
    li.onclick = () => filterByCategory(cat);
    categoryList.appendChild(li);
  });
}

// 分类过滤
function filterByCategory(category) {
  filteredPoems = poems.filter(p => p.dynasty === category);
  currentIndex = -1;
  showRandomPoem();
  categoryList.style.display = "none";
}

// 搜索功能
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim();
  if (!keyword) {
    filteredPoems = poems;
  } else {
    filteredPoems = poems.filter(p =>
      p.title.includes(keyword) ||
      p.author.includes(keyword) ||
      p.content.includes(keyword)
    );
  }
  currentIndex = -1;
  showRandomPoem();
});

// 随机展示诗词
function showRandomPoem() {
  if (filteredPoems.length === 0) return;

  [title, author, content, extra].forEach(el => el.classList.remove('fade-ink'));
  poemCard.style.opacity = 0;

  setTimeout(() => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * filteredPoems.length);
    } while (nextIndex === currentIndex && filteredPoems.length > 1);
    currentIndex = nextIndex;

    const poem = filteredPoems[currentIndex];
    title.textContent = poem.title;
    author.textContent = `${poem.dynasty} · ${poem.author}`;
    content.textContent = poem.content;
    extra.innerHTML = `<b>译文：</b>${poem.translation}<br><br><b>赏析：</b>${poem.comment}`;
    extra.style.display = "none";

    poemCard.style.opacity = 1;
    [title, author, content].forEach(el => el.classList.add('fade-ink'));
  }, fadeDuration);
}

// 点击显示详情
poemCard.addEventListener("click", (e) => {
  if (e.target.id === "extra") return;
  extra.classList.toggle("show");
});

// 分类菜单切换
categoryBtn.addEventListener("click", () => {
  categoryList.style.display = categoryList.style.display === "none" ? "block" : "block";
});

window.onload = loadPoems;