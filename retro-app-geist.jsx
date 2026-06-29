import React, { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════════
// 주간 회고 자동화 · Geist 라이트모드 · one page one thing
// 기능(모듈 1~5)은 유지, UI/UX/모션 전면 재구성
// ════════════════════════════════════════════════

const MOCK_SOURCES = {
  slack: {
    label: "Slack", sub: "#design · 내 메시지", logo: "slack",
    records: [
      "오늘 SP00N 핸드오프 가이드 문서 드디어 마무리함. 개발팀에 공유 완료",
      "외부 프로젝트(B사 랜딩) 리소스가 생각보다 많이 들어가서 일정이 밀림",
    ],
  },
  figma: {
    label: "Figma", sub: "작업 코멘트 · 멘션", logo: "figma",
    records: [
      "온보딩 플로우 3차 시안 — 로그인 단계 간소화 반영함",
      "아이콘 세트 export 작업 절반 진행",
    ],
  },
  notion: {
    label: "Notion", sub: "회의록 DB", logo: "notion",
    records: [
      "0312 위클리: 디자인 시스템 토큰 네이밍 컨벤션 논의, 다음 스프린트로 이월 결정",
    ],
  },
};

// 브랜드 로고 (인라인 SVG)
function BrandLogo({ name, size = 22 }) {
  if (name === "slack") {
    return (
      <svg width={size} height={size} viewBox="0 0 122.8 122.8" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9z" fill="#e01e5a"/>
        <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9z" fill="#36c5f0"/>
        <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9z" fill="#2eb67d"/>
        <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9z" fill="#ecb22e"/>
      </svg>
    );
  }
  if (name === "figma") {
    return (
      <svg width={size} height={size} viewBox="0 0 38 57" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1abcfe"/>
        <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0acf83"/>
        <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#ff7262"/>
        <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#f24e1e"/>
        <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#a259ff"/>
      </svg>
    );
  }
  if (name === "notion") {
    return (
      <svg width={size} height={size} viewBox="0 0 122 122" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.6 17.2L77.4 13c6.85-.59 8.61-.19 12.9 2.93l17.8 12.5c2.93 2.15 3.91 2.74 3.91 5.08v68.4c0 4.3-1.56 6.85-7.03 7.23l-64.8 3.91c-4.1.2-6.06-.39-8.2-3.13L18.9 95.8c-2.35-3.13-3.32-5.47-3.32-8.2V23.6c0-3.52 1.56-6.45 6.06-6.45z" fill="#fff"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M77.4 13L21.6 17.2c-4.5 0-6.06 2.93-6.06 6.45v63.9c0 2.74.98 5.08 3.32 8.2l13.1 17.2c2.15 2.74 4.1 3.32 8.2 3.13l64.8-3.91c5.47-.39 7.03-2.93 7.03-7.23V33.5c0-2.22-.88-2.86-3.46-4.76l-.45-.32L90.3 16c-4.3-3.13-6.06-3.52-12.9-2.93zm-33 21.7c-5.28.36-6.48.43-9.48-2L27.3 26.8c-.78-.78-.39-1.76 1.56-1.95l53.7-3.91c4.5-.39 6.84 1.17 8.6 2.54l9.18 6.65c.39.2 1.37 1.37.19 1.37l-55.5 3.34-.7.04zm-6.2 71.5V47.8c0-2.34.72-3.42 2.86-3.61l63.7-3.71c1.96-.16 2.86 1.08 2.86 3.42v57.7c0 2.35-.36 4.3-3.61 4.49l-60.9 3.52c-3.25.19-4.69-.88-4.69-3.91zm60-54.8c.36 1.96 0 3.91-1.96 4.14l-2.93.58v43c-2.54 1.37-4.88 2.15-6.84 2.15-3.13 0-3.91-.98-6.25-3.91l-19.1-30v29l6.06 1.37s0 3.52-4.89 3.52l-13.5.78c-.39-.78 0-2.74 1.37-3.13l3.52-.98V57.5l-4.89-.39c-.39-1.96.69-4.69 3.71-4.89l14.5-.97 19.9 30.4V55.6l-5.08-.58c-.39-2.4 1.37-4.15 3.52-4.34z" fill="#000"/>
      </svg>
    );
  }
  return null;
}

const DEFAULT_GOAL = `Q1 팀 목표
1. SP00N 신규 기능 정식 출시 (디자인-개발 핸드오프 완료)
2. 온보딩 전환율 개선 (이탈 구간 단순화)
3. 디자인 시스템 1.0 구축`;

async function callClaude(prompt, maxTokens = 1500) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await res.json();
  return data.content.filter((b) => b.type === "text").map((b) => b.text).join("").replace(/```json|```/g, "").trim();
}

// Geist 토큰
const C = {
  bg: "#ffffff", surface: "#fafafa", surface2: "#f2f2f2",
  border: "#eaeaea", border2: "#ededed",
  fg: "#000000", fg2: "#666666", fg3: "#999999",
  blue: "#0070f3", blueBg: "#f0f7ff",
  green: "#0a7c3e", greenBg: "#f0faf4", greenBd: "#c3e9d2",
  red: "#c5221f", redBg: "#fdf3f3", redBd: "#f3cfcf",
  amber: "#9a6700", amberBg: "#fdfaf0", amberBd: "#f0e3bf",
};

const REL = {
  "상": { fg: C.green, bg: C.greenBg, bd: C.greenBd },
  "중": { fg: C.amber, bg: C.amberBg, bd: C.amberBd },
  "하": { fg: C.fg3, bg: C.surface, bd: C.border },
};

const STEPS = ["소스", "목표", "처리", "회고표"];

export default function RetroApp() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [owner, setOwner] = useState("병현");
  const [pulled, setPulled] = useState({});
  const [pulling, setPulling] = useState(null);

  const [items, setItems] = useState([]);
  const [keyResults, setKeyResults] = useState([]);
  const [rels, setRels] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [finalRows, setFinalRows] = useState([]);

  const [proc, setProc] = useState(""); // 현재 처리 중 모듈 라벨
  const [procDone, setProcDone] = useState([]); // 끝난 모듈
  const [error, setError] = useState("");

  function go(next) { setDir(next > step ? 1 : -1); setStep(next); }

  function pull(key) {
    setPulling(key);
    setTimeout(() => { setPulled((p) => ({ ...p, [key]: true })); setPulling(null); }, 650);
  }
  function collectedText() {
    return Object.keys(MOCK_SOURCES).filter((k) => pulled[k]).map((k) => {
      const s = MOCK_SOURCES[k]; return `[${s.label}]\n` + s.records.join("\n");
    }).join("\n\n");
  }
  const anyPulled = Object.keys(pulled).some((k) => pulled[k]);

  // ── 전체 파이프라인 순차 실행 (처리 스텝에서 자동) ──
  async function runPipeline() {
    setError(""); setProcDone([]);
    setItems([]); setKeyResults([]); setRels([]); setReflections([]); setFinalRows([]);
    try {
      setProc("액션아이템 추출");
      const t1 = await callClaude(`다음은 한 주 동안 슬랙, 피그마, 노션에 흩어진 업무 기록이다. 주간 회고용 "액션아이템" 단위로 묶어라.
규칙: "이번 주에 수행한 하나의 일" 단위. 같은 일의 여러 기록은 하나로 합침.
아래 JSON만 출력: [ { "title": "...", "evidence": "근거 요약" } ]

원본 기록:
${collectedText()}`);
      const it = JSON.parse(t1); setItems(it); setProcDone((d) => [...d, "액션아이템 추출"]);

      setProc("핵심 결과 간추리기");
      const t2 = await callClaude(`다음 액션아이템들을 관통하는 "핵심 결과"를 2~3개로 간추려라.
규칙: 1:1 변환 금지. 여러 액션아이템을 묶어 압축. 성과 중심 한 문장.
아래 JSON만 출력: [ { "result": "...", "from": ["관련 액션아이템 제목", ...] } ]

액션아이템 목록:
${JSON.stringify(it.map((x) => x.title), null, 2)}`);
      const kr = JSON.parse(t2); setKeyResults(kr); setProcDone((d) => [...d, "핵심 결과 간추리기"]);

      setProc("목표 관련성 분류");
      const t3 = await callClaude(`아래 "팀 목표"를 기준으로 각 "핵심 결과"의 관련성을 상/중/하로 분류하라.
기준: 상 = 직접 기여 / 중 = 간접 도움 / 하 = 거의 무관.
아래 JSON만 출력: [ { "result": "핵심 결과 그대로", "relevance": "상|중|하", "reason": "한 줄 근거" } ]

[팀 목표]
${goal}

[핵심 결과 목록]
${JSON.stringify(kr.map((k) => k.result), null, 2)}`);
      const rl = JSON.parse(t3); setRels(rl); setProcDone((d) => [...d, "목표 관련성 분류"]);

      setProc("잘된 점 / 보완점 도출");
      const enriched = kr.map((k) => ({
        result: k.result,
        context: (k.from || []).map((t) => { const i = it.find((x) => x.title === t); return i ? `${i.title}: ${i.evidence}` : t; }),
      }));
      const t4 = await callClaude(`다음은 이번 주 핵심 결과와 각 결과의 근거가 된 원본 업무 맥락이다.
각 핵심 결과에 대해 "잘된 점"과 "보완할 점/아쉬운 점"을 도출하라.
규칙: 실제 맥락 기반. 원본에 드러난 어려움 반영. 보완점 없으면 "특이사항 없음".
아래 JSON만 출력: [ { "result": "핵심 결과 그대로", "good": "잘된 점", "improve": "보완할 점" } ]

핵심 결과 + 원본 맥락:
${JSON.stringify(enriched, null, 2)}`);
      const rf = JSON.parse(t4); setReflections(rf); setProcDone((d) => [...d, "잘된 점 / 보완점 도출"]);

      setProc("담당자 매핑 · 표 조립");
      const merged = kr.map((k) => {
        const r = rl.find((x) => x.result === k.result);
        const ref = rf.find((x) => x.result === k.result);
        const ctx = (k.from || []).map((t) => { const i = it.find((x) => x.title === t); return i ? i.evidence : t; });
        return { keyResult: k.result, actionItems: k.from || [], relevance: r ? r.relevance : "", good: ref ? ref.good : "", improve: ref ? ref.improve : "", context: ctx.join(" / ") };
      });
      const t5 = await callClaude(`다음 각 회고 항목의 "담당자"를 추론하라.
규칙: 원본 맥락에 특정 인물이 드러나면 그 사람. 불명확하면 기본 담당자 "${owner}"로.
아래 JSON만 출력: [ { "keyResult": "핵심 결과 그대로", "owner": "담당자명" } ]

회고 항목:
${JSON.stringify(merged.map((m) => ({ keyResult: m.keyResult, context: m.context })), null, 2)}`, 800);
      const ow = JSON.parse(t5);
      const rows = merged.map((m) => { const o = ow.find((x) => x.keyResult === m.keyResult); return { ...m, owner: o ? o.owner : owner }; });
      setProcDone((d) => [...d, "담당자 매핑 · 표 조립"]);
      setFinalRows(rows);
      setProc("");
      setTimeout(() => go(3), 600);
    } catch (e) {
      setError("처리 중 오류: " + e.message); setProc("");
    }
  }

  return (
    <div style={{ background: C.bg, minHeight: "100%", color: C.fg, fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform: translateX(${dir > 0 ? 24 : -24}px); } to { opacity:1; transform:none; } }
        @keyframes rise { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes check { from { stroke-dashoffset: 20; } to { stroke-dashoffset: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 24px 48px" }}>
        {/* 헤더 + 스테퍼 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}>주간 회고</div>
          <div style={{ fontSize: 12, color: C.fg3, fontFamily: "'Geist Mono', monospace" }}>{String(step + 1).padStart(2, "0")} / 04</div>
        </div>
        <Stepper step={step} />

        {/* 스텝 본문 */}
        <div key={step} style={{ animation: "slideIn .35s cubic-bezier(.2,.7,.2,1)", marginTop: 28 }}>
          {step === 0 && (
            <StepSources pulled={pulled} pulling={pulling} pull={pull} anyPulled={anyPulled} onNext={() => go(1)} />
          )}
          {step === 1 && (
            <StepGoal goal={goal} setGoal={setGoal} owner={owner} setOwner={setOwner} onBack={() => go(0)} onNext={() => { go(2); }} />
          )}
          {step === 2 && (
            <StepProcess proc={proc} procDone={procDone} error={error} onRun={runPipeline} started={proc !== "" || procDone.length > 0} onBack={() => go(1)} />
          )}
          {step === 3 && (
            <StepResult rows={finalRows} onRestart={() => { go(0); }} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── 스테퍼 ──
function Stepper({ step }) {
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ flex: 1 }}>
          <div style={{ height: 3, borderRadius: 2, background: i <= step ? C.fg : C.border, transition: "background .4s ease" }} />
          <div style={{ fontSize: 11, marginTop: 7, color: i === step ? C.fg : C.fg3, fontWeight: i === step ? 600 : 400, transition: "color .3s" }}>{s}</div>
        </div>
      ))}
    </div>
  );
}

// ── 스텝 0: 소스 연결 ──
function StepSources({ pulled, pulling, pull, anyPulled, onNext }) {
  return (
    <div>
      <H title="이번 주 기록을 불러오세요" sub="흩어진 작업 기록을 한곳에 모읍니다. 한 곳 이상 연결하면 시작할 수 있어요." />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}>
        {Object.entries(MOCK_SOURCES).map(([key, s], i) => {
          const isPulled = pulled[key], isPulling = pulling === key;
          return (
            <div key={key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              border: `1px solid ${isPulled ? C.fg : C.border}`, borderRadius: 8, padding: "14px 16px",
              background: C.bg, animation: `rise .4s ${i * 0.06}s both ease`, transition: "border-color .3s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 36, height: 36, borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <BrandLogo name={s.logo} size={20} />
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 550 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: C.fg3 }}>{s.sub}</div>
                </div>
              </div>
              <button onClick={() => pull(key)} disabled={isPulling || isPulled}
                style={{
                  fontSize: 13, fontWeight: 500, padding: "7px 14px", borderRadius: 6, minWidth: 84,
                  border: `1px solid ${isPulled ? C.greenBd : C.border}`,
                  background: isPulled ? C.greenBg : C.bg, color: isPulled ? C.green : C.fg,
                  cursor: isPulled ? "default" : "pointer", transition: "all .2s",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                {isPulled ? (<><Check /> 연결됨</>) : isPulling ? <Spinner /> : "불러오기"}
              </button>
            </div>
          );
        })}
      </div>
      <NextBar disabled={!anyPulled} onNext={onNext} hint={!anyPulled ? "한 곳 이상 연결해 주세요" : null} label="목표 설정" />
    </div>
  );
}

// ── 스텝 1: 목표 ──
function StepGoal({ goal, setGoal, owner, setOwner, onBack, onNext }) {
  return (
    <div>
      <H title="무엇을 기준으로 돌아볼까요" sub="팀 목표는 각 성과의 관련성을 판단하는 기준이 됩니다. 자주 바뀌지 않으니 한 번만 적어두면 돼요." />
      <div style={{ marginTop: 20 }}>
        <Label>팀 목표 / OKR</Label>
        <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={5}
          style={inputStyle(true)} />
        <div style={{ height: 14 }} />
        <Label>기본 담당자</Label>
        <input value={owner} onChange={(e) => setOwner(e.target.value)} style={inputStyle(false)} />
      </div>
      <NextBar onBack={onBack} onNext={onNext} label="기록 처리" />
    </div>
  );
}

// ── 스텝 2: 처리 ──
function StepProcess({ proc, procDone, error, onRun, started, onBack }) {
  const MODS = ["액션아이템 추출", "핵심 결과 간추리기", "목표 관련성 분류", "잘된 점 / 보완점 도출", "담당자 매핑 · 표 조립"];
  return (
    <div>
      <H title="기록을 회고로 바꾸는 중" sub="5개의 공정을 차례로 통과하며 흩어진 기록이 한 장의 회고표로 정리됩니다." />
      {!started ? (
        <div style={{ marginTop: 24 }}>
          <button onClick={onRun} style={primaryBtn()}>처리 시작</button>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 2 }}>
            {MODS.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", color: C.fg3, fontSize: 13 }}>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, width: 20 }}>{String(i + 1).padStart(2, "0")}</span>
                {m}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 2 }}>
          {MODS.map((m, i) => {
            const done = procDone.includes(m);
            const active = proc === m;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 8,
                background: active ? C.surface : "transparent", transition: "background .3s",
                color: done ? C.fg : active ? C.fg : C.fg3,
              }}>
                <span style={{ width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  {done ? <Check /> : active ? <Spinner /> : <span style={{ width: 6, height: 6, borderRadius: 9, background: C.border }} />}
                </span>
                <span style={{ fontSize: 14, fontWeight: active || done ? 550 : 400 }}>{m}</span>
              </div>
            );
          })}
          {error && <div style={{ marginTop: 12, color: C.red, fontSize: 13, background: C.redBg, border: `1px solid ${C.redBd}`, borderRadius: 6, padding: "10px 12px" }}>{error}</div>}
        </div>
      )}
      {!started && <NextBar onBack={onBack} hideNext />}
    </div>
  );
}

// ── 스텝 3: 결과 ──
function StepResult({ rows, onRestart }) {
  return (
    <div>
      <H title="이번 주 회고가 정리됐어요" sub="담당자·핵심 결과·관련성·잘된 점·보완점이 한 장으로 모였습니다. 노션에 그대로 옮겨 적을 수 있어요." />
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((r, i) => {
          const rs = REL[r.relevance] || REL["하"];
          return (
            <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, animation: `rise .45s ${i * 0.1}s both ease` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: rs.fg, background: rs.bg, border: `1px solid ${rs.bd}`, borderRadius: 5, padding: "2px 8px" }}>관련성 {r.relevance}</span>
                <span style={{ fontSize: 12, color: C.fg3 }}>· {r.owner}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 10 }}>{r.keyResult}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {r.actionItems.map((a, j) => (
                  <span key={j} style={{ fontSize: 11, color: C.fg2, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 99, padding: "3px 9px" }}>{a}</span>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Cell tone="green" label="잘된 점" text={r.good} />
                <Cell tone="red" label="보완할 점" text={r.improve} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        <button onClick={() => copyTable(rows)} style={primaryBtn()}>표 복사</button>
        <button onClick={onRestart} style={ghostBtn()}>새로 시작</button>
      </div>
    </div>
  );
}

function Cell({ tone, label, text }) {
  const map = { green: { fg: C.green, bg: C.greenBg, bd: C.greenBd }, red: { fg: C.red, bg: C.redBg, bd: C.redBd } };
  const t = map[tone];
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.bd}`, borderRadius: 8, padding: 11 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: t.fg, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: C.fg, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}

function copyTable(rows) {
  const header = ["담당자", "액션아이템", "핵심 결과", "관련성", "잘된 점", "보완할 점"].join("\t");
  const body = rows.map((r) => [r.owner, r.actionItems.join(", "), r.keyResult, r.relevance, r.good, r.improve].join("\t")).join("\n");
  navigator.clipboard?.writeText(header + "\n" + body);
}

// ── 공용 UI ──
function H({ title, sub }) {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 650, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.25 }}>{title}</h1>
      <p style={{ fontSize: 14, color: C.fg2, margin: "8px 0 0", lineHeight: 1.55 }}>{sub}</p>
    </div>
  );
}
function Label({ children }) { return <div style={{ fontSize: 12, fontWeight: 600, color: C.fg2, marginBottom: 7 }}>{children}</div>; }
function inputStyle(area) {
  return {
    width: "100%", boxSizing: "border-box", padding: "10px 12px", fontSize: 13,
    border: `1px solid ${C.border}`, borderRadius: 8, background: C.bg, color: C.fg,
    fontFamily: area ? "'Geist Mono', ui-monospace, monospace" : "inherit", resize: "vertical", outline: "none",
    lineHeight: 1.5,
  };
}
function primaryBtn() { return { fontSize: 14, fontWeight: 550, padding: "10px 20px", borderRadius: 8, border: "1px solid #000", background: "#000", color: "#fff", cursor: "pointer", transition: "opacity .2s" }; }
function ghostBtn() { return { fontSize: 14, fontWeight: 550, padding: "10px 20px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.fg, cursor: "pointer", transition: "background .2s" }; }

function NextBar({ onBack, onNext, disabled, hint, label, hideNext }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28 }}>
      <div>{onBack && <button onClick={onBack} style={ghostBtn()}>이전</button>}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {hint && <span style={{ fontSize: 12, color: C.fg3 }}>{hint}</span>}
        {!hideNext && <button onClick={onNext} disabled={disabled}
          style={{ ...primaryBtn(), opacity: disabled ? 0.4 : 1, cursor: disabled ? "default" : "pointer" }}>{label || "다음"} →</button>}
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" style={{ strokeDasharray: 20, animation: "check .4s ease forwards" }} />
    </svg>
  );
}
function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "spin .7s linear infinite" }}>
      <circle cx="12" cy="12" r="9" stroke={C.border} strokeWidth="3" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke={C.fg} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
