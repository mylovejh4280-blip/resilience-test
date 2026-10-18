// Supabase 공개(publishable) 키 — RLS로 insert만 허용되어 있어 클라이언트 노출이 안전함
const SUPABASE_URL = "https://abnsblsmnqmuubcoxiwa.supabase.co";
const SUPABASE_KEY = "sb_publishable_jPbih_yicM6F102gGNOMTg__HXov1-E";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const FACTORS = {
  emotion: {
    name: "감정조절력",
    desc: "스트레스 상황에서 감정을 알아차리고 가라앉히는 힘",
    tips: ["화가 날 때 6초 동안 천천히 숨을 내쉬어 보세요.", "감정에 이름 붙이기(\"지금 나는 서운하다\")를 연습해 보세요.", "하루 10분 걷기·명상처럼 몸을 이완하는 루틴을 만드세요."],
  },
  persist: {
    name: "충동통제·끈기",
    desc: "당장의 충동을 미루고 목표를 향해 꾸준히 나아가는 힘",
    tips: ["큰 목표를 하루 단위의 작은 행동으로 쪼개 보세요.", "반응하기 전 '잠깐 멈춤' 신호를 정해 두세요.", "작게라도 끝까지 해낸 경험을 기록해 보세요."],
  },
  solve: {
    name: "원인분석·문제해결",
    desc: "문제의 원인을 정확히 파악하고 해결할 수 있다고 믿는 힘",
    tips: ["'통제할 수 있는 것 / 없는 것'을 종이에 나눠 적어 보세요.", "실패 후 '배운 점 한 가지'를 꼭 남기세요.", "문제를 친구의 일이라고 가정하고 조언을 적어 보세요."],
  },
  relation: {
    name: "관계·공감",
    desc: "타인의 마음을 읽고, 도움을 주고받는 관계를 맺는 힘",
    tips: ["이번 주에 고마운 사람 한 명에게 먼저 연락해 보세요.", "대화할 때 상대의 말을 한 번 요약해 되돌려 주세요.", "힘들 때 기댈 수 있는 사람 3명을 떠올려 적어 보세요."],
  },
  positive: {
    name: "긍정성·의미",
    desc: "어려움 속에서도 희망과 감사, 삶의 의미를 찾는 힘",
    tips: ["자기 전 감사한 일 3가지를 적는 '감사일기'를 써 보세요.", "나의 강점 한 가지를 오늘 의식적으로 사용해 보세요.", "과거에 이겨낸 어려움과 그때의 나를 떠올려 보세요."],
  },
};

// reverse: true 인 문항은 역채점(6 - 응답)
const ITEMS = [
  { f: "emotion", t: "화가 나거나 속상한 일이 있어도 비교적 빨리 마음을 가라앉힐 수 있다." },
  { f: "persist", t: "하고 싶은 일이 있어도 더 중요한 일을 먼저 끝내는 편이다." },
  { f: "solve", t: "문제가 생기면 원인을 차근차근 따져 본 뒤 해결책을 찾는다." },
  { f: "relation", t: "다른 사람의 표정이나 말투만으로도 그 사람의 기분을 잘 알아챈다." },
  { f: "positive", t: "힘든 일을 겪어도 결국은 좋은 방향으로 풀릴 것이라고 생각한다." },
  { f: "emotion", t: "스트레스를 받으면 감정을 주체하지 못해 하루를 망치곤 한다.", reverse: true },
  { f: "persist", t: "일이 뜻대로 되지 않으면 쉽게 포기하는 편이다.", reverse: true },
  { f: "solve", t: "어려운 상황에서도 내가 바꿀 수 있는 것과 없는 것을 구분할 수 있다." },
  { f: "relation", t: "힘들 때 마음을 터놓고 도움을 청할 수 있는 사람이 있다." },
  { f: "positive", t: "평범한 일상 속에서도 감사할 만한 일을 자주 발견한다." },
  { f: "emotion", t: "중요한 일을 앞두고 긴장될 때, 나만의 방법으로 마음을 진정시킨다." },
  { f: "persist", t: "장기적인 목표를 위해서라면 지금의 불편함을 견딜 수 있다." },
  { f: "solve", t: "실패를 겪으면 그 경험에서 무엇을 배울 수 있는지 돌아본다." },
  { f: "relation", t: "내 생각과 감정을 상대가 오해하지 않도록 잘 전달하는 편이다." },
  { f: "positive", t: "나의 삶에는 분명한 의미와 목적이 있다고 느낀다." },
  { f: "emotion", t: "기분이 좋지 않을 때에도 해야 할 일에는 집중할 수 있다." },
  { f: "persist", t: "감정이 격해졌을 때 충동적으로 말하거나 행동해서 후회한 적이 많다.", reverse: true },
  { f: "solve", t: "나는 대부분의 어려움을 결국 스스로 해결해 낼 수 있다고 믿는다." },
  { f: "relation", t: "사람들과 갈등이 생기면 관계를 피하거나 끊어 버리는 편이다.", reverse: true },
  { f: "positive", t: "어려운 시기를 지나고 나면 내가 더 단단해졌다고 느낀다." },
];

const CHOICES = ["전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"];

const LEVELS = [
  { min: 85, label: "매우 높음", title: "단단하고 유연한 마음의 소유자", desc: "역경을 성장의 계기로 바꾸는 힘이 매우 뛰어납니다. 지금의 강점을 주변 사람들과 나눠 보세요." },
  { min: 70, label: "높음", title: "회복의 힘이 잘 갖춰져 있어요", desc: "대부분의 스트레스 상황에서 스스로 균형을 되찾을 수 있습니다. 상대적으로 낮은 영역을 보완하면 더 단단해집니다." },
  { min: 55, label: "보통", title: "평균적인 회복탄력성이에요", desc: "평소엔 괜찮지만 큰 스트레스가 겹치면 흔들릴 수 있습니다. 아래 낮은 영역부터 작은 습관을 만들어 보세요." },
  { min: 0, label: "노력 필요", title: "마음 근육을 키울 시간이에요", desc: "요즘 많이 지쳐 있을 수 있습니다. 회복탄력성은 훈련으로 충분히 키울 수 있어요. 힘든 상태가 오래 지속된다면 전문가 상담도 꼭 고려해 주세요." },
];

const $ = (id) => document.getElementById(id);
let profile = {};
let answers = new Array(ITEMS.length).fill(null);
let idx = 0;

$("profile").addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  profile = {
    nickname: fd.get("nickname").trim() || null,
    age_group: fd.get("age_group") || null,
    gender: fd.get("gender") || null,
  };
  show("quiz");
  render();
});

function show(id) {
  for (const s of ["intro", "quiz", "result"]) $(s).hidden = s !== id;
  window.scrollTo({ top: 0 });
}

function render() {
  const item = ITEMS[idx];
  $("qnum").textContent = idx + 1;
  $("bar").style.width = `${(idx / ITEMS.length) * 100}%`;
  $("qfactor").textContent = FACTORS[item.f].name;
  $("qtext").textContent = item.t;
  $("prev").disabled = idx === 0;
  const box = $("choices");
  box.innerHTML = "";
  CHOICES.forEach((label, i) => {
    const v = i + 1;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "choice" + (answers[idx] === v ? " selected" : "");
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", answers[idx] === v);
    b.innerHTML = `<span class="n">${v}</span><span>${label}</span>`;
    b.addEventListener("click", () => choose(v));
    box.appendChild(b);
  });
}

function choose(v) {
  answers[idx] = v;
  render();
  setTimeout(() => {
    if (idx < ITEMS.length - 1) {
      idx++;
      render();
    } else {
      finish();
    }
  }, 180);
}

$("prev").addEventListener("click", () => {
  if (idx > 0) { idx--; render(); }
});

document.addEventListener("keydown", (e) => {
  if ($("quiz").hidden) return;
  const n = Number(e.key);
  if (n >= 1 && n <= 5) choose(n);
});

function score() {
  const factor = Object.fromEntries(Object.keys(FACTORS).map((k) => [k, 0]));
  ITEMS.forEach((item, i) => {
    factor[item.f] += item.reverse ? 6 - answers[i] : answers[i];
  });
  const total = Object.values(factor).reduce((a, b) => a + b, 0);
  const level = LEVELS.find((l) => total >= l.min);
  return { factor, total, level };
}

async function finish() {
  $("bar").style.width = "100%";
  const { factor, total, level } = score();

  $("rtitle").textContent = (profile.nickname ? `${profile.nickname}님, ` : "") + level.title;
  $("rtotal").textContent = total;
  $("rlevel").textContent = level.label;
  $("rlevel").classList.toggle("low", level.label === "노력 필요");
  $("rdesc").textContent = level.desc;

  // 영역별 점수 (각 4~20점)
  const ranked = Object.entries(factor).sort((a, b) => a[1] - b[1]);
  $("factors").innerHTML = Object.entries(factor).map(([k, v]) => {
    const pct = ((v - 4) / 16) * 100;
    const weak = v <= 12;
    return `<div class="factor${weak ? " weak" : ""}">
      <div class="top"><span>${FACTORS[k].name}</span><span>${v} / 20</span></div>
      <div class="track"><div class="fill" style="width:${pct}%"></div></div>
      <div class="fine">${FACTORS[k].desc}</div>
    </div>`;
  }).join("");

  const [weakKey] = ranked[0];
  $("tips").innerHTML = `<h3>가장 먼저 키워 볼 영역 · ${FACTORS[weakKey].name}</h3>
    <ul>${FACTORS[weakKey].tips.map((t) => `<li>${t}</li>`).join("")}</ul>`;

  show("result");

  $("saveStatus").textContent = "응답을 저장하는 중…";
  const { error } = await db.from("resilience_responses").insert({
    ...profile,
    answers,
    factor_scores: factor,
    total_score: total,
    level: level.label,
  });
  $("saveStatus").textContent = error ? "응답 저장에 실패했어요. 결과는 그대로 확인하실 수 있습니다." : "응답이 익명으로 저장되었습니다. 감사합니다!";

  const { data } = await db.rpc("get_resilience_stats");
  if (data && data[0] && data[0].respondents > 0) {
    $("stats").textContent = `지금까지 ${data[0].respondents}명이 참여했고, 평균 점수는 ${data[0].avg_total}점입니다.`;
  }
}

$("restart").addEventListener("click", () => {
  answers = new Array(ITEMS.length).fill(null);
  idx = 0;
  show("intro");
});
