const $ = (id) => document.getElementById(id);
const imgOf = (topic, word) => `images/${topic}/${word.replace(/ /g, "-")}.png`;
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((p) => p[1]);
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const state = { topic: null, board: [], queue: [], target: null, misses: 0, score: 0, start: 0, timer: null, locked: false };

// ---- Speech ----
let voice = null;
function pickVoice() {
  const vs = speechSynthesis.getVoices();
  voice = vs.find((v) => v.lang === "en-US") || vs.find((v) => v.lang.startsWith("en")) || null;
}
if ("speechSynthesis" in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.8;
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}

// ---- Screens ----
function show(id) {
  for (const s of document.querySelectorAll(".screen")) s.classList.toggle("hidden", s.id !== id);
}

function renderTopics() {
  $("topics").innerHTML = "";
  for (const t of TOPICS) {
    const b = document.createElement("button");
    b.className = "topic";
    b.innerHTML = `<img src="${imgOf(t.id, t.words[0])}" alt=""><span>${t.name}</span>`;
    b.onclick = () => startGame(t);
    $("topics").append(b);
  }
}

// ---- Game ----
function startGame(topic) {
  Object.assign(state, { topic, score: 0, locked: false, board: shuffle(topic.words).slice(0, 9) });
  state.queue = shuffle(state.board);

  $("grid").innerHTML = "";
  for (const w of state.board) {
    const b = document.createElement("button");
    b.className = "tile";
    b.dataset.word = w;
    b.innerHTML = `<img src="${imgOf(topic.id, w)}" alt="">`;
    b.onclick = () => choose(b);
    $("grid").append(b);
  }

  $("score").textContent = 0;
  $("time").textContent = fmt(0);
  show("game");

  clearInterval(state.timer);
  state.start = Date.now();
  state.timer = setInterval(() => ($("time").textContent = fmt(elapsed())), 250);
  nextRound();
}

const elapsed = () => Math.floor((Date.now() - state.start) / 1000);

function nextRound() {
  state.target = state.queue.shift();
  state.misses = 0;
  $("round").textContent = 9 - state.queue.length;
  $("word").textContent = state.target;
  speak(state.target);
}

function choose(tile) {
  if (state.locked) return;

  if (tile.dataset.word !== state.target) {
    state.misses++;
    tile.classList.remove("wrong");
    void tile.offsetWidth; // restart animation
    tile.classList.add("wrong");
    setTimeout(() => tile.classList.remove("wrong"), 400);
    return;
  }

  state.locked = true;
  state.score += state.misses ? 5 : 10;
  $("score").textContent = state.score;
  tile.classList.add("correct");

  setTimeout(() => {
    tile.classList.replace("correct", "done");
    state.locked = false;
    state.queue.length ? nextRound() : endGame();
  }, 800);
}

function endGame() {
  clearInterval(state.timer);
  $("final-score").textContent = state.score;
  $("final-time").textContent = fmt(elapsed());
  show("result");
  speak("Well done!");
}

$("speak").onclick = () => speak(state.target);
$("again").onclick = () => startGame(state.topic);
$("change").onclick = () => show("start");

renderTopics();
