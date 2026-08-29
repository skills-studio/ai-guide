"use client";

import { useEffect, useMemo, useState } from "react";
import type { View } from "./GuideApp";

type PromptFields = {
  persona: string;
  context: string;
  task: string;
  constraints: string;
  output: string;
};

type LibraryTemplate = {
  id: number;
  title: string;
  category: string;
  description: string;
};

const categories = ["Всички", "Маркетинг", "Продажби", "HR и мениджмънт", "Технологии", "Стратегия", "Креативни"];

const libraryTemplates: LibraryTemplate[] = [
  { id: 1, title: "SEO meta генератор", category: "Маркетинг", description: "Създава ясни варианти за meta заглавия и описания." },
  { id: 2, title: "Архитект на съдържание", category: "Маркетинг", description: "Изгражда логична структура за статия или експертна страница." },
  { id: 3, title: "Планер за социални мрежи", category: "Маркетинг", description: "Подготвя месечен календар с формати, теми и цели." },
  { id: 4, title: "Meta Ads текстове", category: "Маркетинг", description: "Генерира рекламни концепции, куки и варианти за CTA." },
  { id: 5, title: "Имейл кампании", category: "Маркетинг", description: "Структурира серия от имейли с ясна логика и действие." },
  { id: 6, title: "Анализ на аудиторията", category: "Маркетинг", description: "Изгражда профил на клиент, мотиватори и бариери." },
  { id: 7, title: "Видео сценарии", category: "Маркетинг", description: "Създава сценарий с кука, развитие и финален призив." },
  { id: 8, title: "Cold email генератор", category: "Продажби", description: "Създава кратко персонализирано първо съобщение." },
  { id: 9, title: "LinkedIn покани", category: "Продажби", description: "Подготвя естествени покани без агресивна продажба." },
  { id: 10, title: "Отговори на възражения", category: "Продажби", description: "Структурира емпатични и доказуеми отговори." },
  { id: 11, title: "Follow-up генератор", category: "Продажби", description: "Планира последващи съобщения без натиск и повторение." },
  { id: 12, title: "Архитект на оферти", category: "Продажби", description: "Превръща стойността на продукта в ясна оферта." },
  { id: 13, title: "Начало на cold call", category: "Продажби", description: "Създава кратко, релевантно начало на разговор." },
  { id: 14, title: "Подготовка за преговори", category: "Продажби", description: "Подрежда цели, граници, сценарии и контрааргументи." },
  { id: 15, title: "Обяви за работа", category: "HR и мениджмънт", description: "Пише ясни и включващи обяви с реални очаквания." },
  { id: 16, title: "Въпроси за интервю", category: "HR и мениджмънт", description: "Генерира поведенчески въпроси по компетенции." },
  { id: 17, title: "Оценка на представянето", category: "HR и мениджмънт", description: "Структурира балансирана и конкретна обратна връзка." },
  { id: 18, title: "Onboarding архитект", category: "HR и мениджмънт", description: "Създава план за първите 30, 60 и 90 дни." },
  { id: 19, title: "Политика за дистанционна работа", category: "HR и мениджмънт", description: "Подготвя рамка за очаквания, комуникация и сигурност." },
  { id: 20, title: "Идеи за тиймбилдинг", category: "HR и мениджмънт", description: "Предлага формати според екип, бюджет и цел." },
  { id: 21, title: "Планер за 1:1 срещи", category: "HR и мениджмънт", description: "Създава дневен ред за фокусирани индивидуални срещи." },
  { id: 22, title: "Make.com архитект", category: "Технологии", description: "Проектира тригер, действия, проверки и обработка на грешки." },
  { id: 23, title: "Regex генератор", category: "Технологии", description: "Създава и обяснява регулярни изрази с тестови случаи." },
  { id: 24, title: "SQL асистент", category: "Технологии", description: "Формулира заявки и посочва допусканията за схемата." },
  { id: 25, title: "Преглед на код", category: "Технологии", description: "Открива дефекти, рискове и възможности за опростяване." },
  { id: 26, title: "Zapier CRM архитект", category: "Технологии", description: "Проектира надежден CRM поток с ясни условия." },
  { id: 27, title: "JSON структури", category: "Технологии", description: "Изгражда валидна структура и примерни данни." },
  { id: 28, title: "Sheets формули", category: "Технологии", description: "Създава формула и обяснява логиката стъпка по стъпка." },
  { id: 29, title: "SWOT анализ", category: "Стратегия", description: "Отделя вътрешните фактори от пазарните условия." },
  { id: 30, title: "AI промпт за изображение", category: "Креативни", description: "Създава визуална инструкция със сцена, стил и ограничения." },
  { id: 31, title: "Конкурентен анализ", category: "Стратегия", description: "Сравнява позициониране, оферта и доказуеми различия." },
  { id: 32, title: "OKR генератор", category: "Стратегия", description: "Превръща посоката в измерими цели и ключови резултати." },
  { id: 33, title: "Идеи за продукти", category: "Стратегия", description: "Генерира и оценява идеи според реален проблем и пазар." },
  { id: 34, title: "Управление на риска", category: "Стратегия", description: "Създава регистър с вероятност, ефект и мерки." },
  { id: 35, title: "Архитект на pitch deck", category: "Стратегия", description: "Подрежда убедителен разказ от проблем до доказателство." },
  { id: 36, title: "Идеи за Reels / TikTok", category: "Креативни", description: "Създава кратки формати с ясна кука и задържане." },
  { id: 37, title: "Визуални промптове", category: "Креативни", description: "Превежда концепцията в точна визуална спецификация." },
  { id: 38, title: "Brand voice", category: "Креативни", description: "Дефинира тон, речник, ритъм и забранени модели." },
  { id: 39, title: "Подкаст архитект", category: "Креативни", description: "Изгражда формат, рубрики, епизоди и въпроси." },
  { id: 40, title: "Визуални кампании", category: "Креативни", description: "Създава централна идея и система от адаптации." },
];

const categoryPersona: Record<string, string> = {
  "Маркетинг": "Ти си старши маркетинг стратег с опит в позициониране и performance кампании.",
  "Продажби": "Ти си B2B sales strategist, който работи с консултативен и ненатрапчив подход.",
  "HR и мениджмънт": "Ти си опитен HR и people operations консултант.",
  "Технологии": "Ти си senior solutions architect, който предпочита надеждни и ясни решения.",
  "Стратегия": "Ти си старши бизнес стратег, който отделя фактите от допусканията.",
  "Креативни": "Ти си senior creative director с усет към отличима, но приложима концепция.",
};

const categoryOutput: Record<string, string> = {
  "Маркетинг": "Таблица: концепция / ключово послание / пример / CTA / критерий за тест.",
  "Продажби": "Дай 3 варианта, обосновка и кратък списък за персонализация.",
  "HR и мениджмънт": "Структуриран документ с секции, критерии и конкретни примери.",
  "Технологии": "Стъпки, пример, допускания, проверки и рискове.",
  "Стратегия": "Таблица с доказателства, допускания, приоритет и следващо действие.",
  "Креативни": "3 различими концепции с идея, изпълнение и критерии за избор.",
};

function seedFromTemplate(template: LibraryTemplate): PromptFields {
  return {
    persona: categoryPersona[template.category],
    context: "Работя по [ПРОДУКТ/КОМПАНИЯ] за [ЦЕЛЕВА АУДИТОРИЯ]. Целта е [ЦЕЛ]. Известни данни: [ДОБАВИ ФАКТИ].",
    task: `${template.title}: ${template.description} Изпълни задачата за описания контекст.`,
    constraints: "Не измисляй факти. Маркирай допусканията. Без клишета и недоказуеми обещания. Пиши ясно на български.",
    output: categoryOutput[template.category],
  };
}

function ToolHeader({ eyebrow, title, copy, icon, note }: { eyebrow: string; title: string; copy: string; icon: string; note?: string }) {
  return (
    <div className="tool-page-head">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p>{note && <span className="privacy-chip">◇ {note}</span>}</div>
      <span>{icon}</span>
    </div>
  );
}

function Field({ label, hint, value, onChange, tall = false }: { label: string; hint: string; value: string; onChange: (value: string) => void; tall?: boolean }) {
  return (
    <label className="studio-field"><span>{label}</span><small>{hint}</small><textarea className={tall ? "is-tall" : ""} value={value} onChange={event => onChange(event.target.value)} /></label>
  );
}

export function PromptStudio({ generationLimit, upgradeUrl }: { generationLimit?: number; upgradeUrl?: string } = {}) {
  const [fields, setFields] = useState<PromptFields>({ persona: "", context: "", task: "", constraints: "", output: "" });
  const [generated, setGenerated] = useState("");
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState<Array<{ title: string; prompt: string; created: string }>>([]);
  const [generationCount, setGenerationCount] = useState(0);

  useEffect(() => {
    try {
      const seed = window.localStorage.getItem("ai-control-prompt-seed");
      // The selected Library template is consumed once when Studio opens.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (seed) { setFields(JSON.parse(seed)); window.localStorage.removeItem("ai-control-prompt-seed"); }
      const savedHistory = window.localStorage.getItem("ai-control-prompt-history");
      // Restoring local history is an intentional one-time synchronization.
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      const savedCount = window.localStorage.getItem("ai-control-starter-prompt-generations");
      if (savedCount) setGenerationCount(Math.max(0, Number(savedCount) || 0));
    } catch { /* local storage is optional */ }
  }, []);

  const filled = Object.values(fields).filter(value => value.trim().length > 3).length;
  const quality = filled * 20;
  const qualityLabel = quality < 40 ? "Начален" : quality < 80 ? "Развиващ се" : quality < 100 ? "Силен" : "Контролиран";

  const update = (key: keyof PromptFields, value: string) => setFields(current => ({ ...current, [key]: value }));
  const limitReached = generationLimit !== undefined && generationCount >= generationLimit;
  const remaining = generationLimit === undefined ? null : Math.max(0, generationLimit - generationCount);
  const buildPrompt = () => {
    if (limitReached) {
      setStatus("Starter лимитът е достигнат");
      return;
    }
    const prompt = `РОЛЯ\n${fields.persona || "[Определи роля]"}\n\nКОНТЕКСТ\n${fields.context || "[Добави контекст]"}\n\nЗАДАЧА\n${fields.task || "[Опиши задачата]"}\n\nОГРАНИЧЕНИЯ И КРИТЕРИИ\n${fields.constraints || "[Добави правила и критерии]"}\n\nЖЕЛАН ФОРМАТ\n${fields.output || "[Посочи формат]"}\n\nПреди финалния отговор:\n1. Посочи критичните допускания.\n2. Провери дали резултатът спазва всички ограничения.\n3. Ако липсва решаваща информация, задай до 3 конкретни въпроса.`;
    setGenerated(prompt);
    const item = { title: fields.task.slice(0, 55) || "Нов контролиран промпт", prompt, created: new Date().toISOString() };
    const nextHistory = [item, ...history].slice(0, 6);
    setHistory(nextHistory);
    try { window.localStorage.setItem("ai-control-prompt-history", JSON.stringify(nextHistory)); } catch { /* optional */ }
    if (generationLimit !== undefined) {
      const nextCount = generationCount + 1;
      setGenerationCount(nextCount);
      try { window.localStorage.setItem("ai-control-starter-prompt-generations", String(nextCount)); } catch { /* optional */ }
    }
  };
  const loadExample = () => setFields({
    persona: "Ти си старши performance marketing стратег с опит в DTC брандове.",
    context: "Лансираме премиум продукт за грижа за кожата в България. Аудитория: жени 28-45 г. Бюджетът за тест е €1 500.",
    task: "Създай 5 различими концепции за Meta Ads за първите две седмици на кампанията.",
    constraints: "Без медицински обещания, без клишета, до 80 думи на вариант. Маркирай допусканията и предложи измерим KPI.",
    output: "Таблица: кука / основен текст / визуална идея / CTA / хипотеза за тест.",
  });
  const copy = async () => {
    if (!generated) return;
    try { await navigator.clipboard.writeText(generated); setStatus("Копирано ✓"); } catch { setStatus("Маркирай и копирай текста ръчно"); }
    window.setTimeout(() => setStatus(""), 2200);
  };
  const clearAll = () => { setFields({ persona: "", context: "", task: "", constraints: "", output: "" }); setGenerated(""); };

  return (
    <main className="tool-page page-pad">
      <ToolHeader eyebrow={generationLimit === undefined ? "PRO инструмент 01 • PCTCO" : "STARTER инструмент • PCTCO"} title="Prompt Studio" copy="Превърни идеята си в ясна, проверима и контролирана AI инструкция." icon="◌" note="Данните остават само на това устройство" />
      {generationLimit !== undefined && <aside className={limitReached ? "starter-limit is-reached" : "starter-limit"}>
        <div><span>STARTER ДОСТЪП</span><b>{limitReached ? "2 от 2 генерации са използвани" : `${remaining} от ${generationLimit} генерации остават`}</b><p>Лимитът се пази локално на това устройство.</p></div>
        {upgradeUrl && <a className="starter-upgrade-inline" href={upgradeUrl} rel="noreferrer">Отключи Pro за 20 евро →</a>}
      </aside>}
      <div className="studio-layout">
        <section className="studio-form">
          <div className="studio-toolbar"><div><span>Качество на промпта</span><b>{quality}% • {qualityLabel}</b></div><div className="quality-track"><i style={{ width: `${quality}%` }} /></div><button onClick={loadExample}>Зареди пример</button></div>
          <Field label="01: Persona / Роля" hint="Коя перспектива и експертиза са нужни?" value={fields.persona} onChange={value => update("persona", value)} />
          <Field label="02: Context / Контекст" hint="Какви факти, аудитория и цели трябва да знае AI?" value={fields.context} onChange={value => update("context", value)} tall />
          <Field label="03: Task / Задача" hint="Какъв точно резултат очакваш?" value={fields.task} onChange={value => update("task", value)} />
          <Field label="04: Constraints / Ограничения" hint="Какви правила, граници и критерии трябва да спази?" value={fields.constraints} onChange={value => update("constraints", value)} tall />
          <Field label="05: Output / Формат" hint="Как трябва да изглежда финалният резултат?" value={fields.output} onChange={value => update("output", value)} />
          <div className="studio-actions"><button className="button button--ghost" onClick={clearAll}>Изчисти</button><button className="button button--primary" disabled={limitReached} onClick={buildPrompt}>{limitReached ? "Starter лимитът е достигнат" : "Генерирай промпт"} <span>→</span></button></div>
        </section>
        <aside className="prompt-output">
          <div className="prompt-output-head"><div><span>Генериран промпт</span><b>{generated ? "CONTROL STATUS • READY" : "ОЧАКВА ВХОД"}</b></div>{generated && <button onClick={copy}>{status || "Копирай"}</button>}</div>
          {generated ? <pre>{generated}</pre> : <div className="prompt-empty"><i>◌</i><h3>Попълни петте параметъра.</h3><p>Колкото по-конкретен е входът, толкова по-предвидим е резултатът.</p></div>}
          {history.length > 0 && <div className="prompt-history"><span>Последни промптове</span>{history.slice(0, 3).map((item, index) => <button key={`${item.created}-${index}`} onClick={() => setGenerated(item.prompt)}><b>{item.title}</b><small>{new Date(item.created).toLocaleDateString("bg-BG")}</small></button>)}</div>}
        </aside>
      </div>
    </main>
  );
}

export function ControlLibrary({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [category, setCategory] = useState("Всички");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LibraryTemplate | null>(null);
  const filtered = useMemo(() => libraryTemplates.filter(item => (category === "Всички" || item.category === category) && `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const applyTemplate = (template: LibraryTemplate) => {
    try { window.localStorage.setItem("ai-control-prompt-seed", JSON.stringify(seedFromTemplate(template))); } catch { /* optional */ }
    onNavigate("prompt-studio");
  };
  return (
    <main className="tool-page page-pad">
      <ToolHeader eyebrow="PRO инструмент 02 • 40 шаблона" title="Control Library™" copy="Не започвай всяка задача от нулата. Избери структура, добави своя контекст и активирай." icon="▦" />
      <section className="library-controls">
        <label><span className="sr-only">Търси в библиотеката</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Търси шаблон..." /><i>⌕</i></label>
        <div className="filter-row">{categories.map(item => <button key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <p><b>{filtered.length}</b> от 40 готови структури</p>
      </section>
      <section className="library-grid">
        {filtered.map(template => (
          <article key={template.id}>
            <div><span>{String(template.id).padStart(2, "0")}</span><em>{template.category}</em></div><i>▦</i><h3>{template.title}</h3><p>{template.description}</p>
            <div className="template-actions"><button onClick={() => setSelected(template)}>Преглед</button><button onClick={() => applyTemplate(template)}>Използвай <span>→</span></button></div>
          </article>
        ))}
      </section>
      {filtered.length === 0 && <div className="no-results"><i>⌕</i><h3>Няма намерен шаблон</h3><p>Промени търсенето или избери друга категория.</p></div>}
      {selected && <div className="template-modal" role="dialog" aria-modal="true" aria-labelledby="template-title"><button className="modal-scrim" onClick={() => setSelected(null)} aria-label="Затвори прегледа" /><div className="template-panel"><button className="modal-close" onClick={() => setSelected(null)} aria-label="Затвори">×</button><span>{String(selected.id).padStart(2, "0")} • {selected.category}</span><h2 id="template-title">{selected.title}</h2><p>{selected.description}</p><div className="template-preview">{Object.entries(seedFromTemplate(selected)).map(([key, value]) => <div key={key}><b>{({ persona: "Роля", context: "Контекст", task: "Задача", constraints: "Ограничения", output: "Формат" } as Record<string,string>)[key]}</b><p>{value}</p></div>)}</div><button className="button button--primary" onClick={() => applyTemplate(selected)}>Отвори в Prompt Studio <span>→</span></button></div></div>}
    </main>
  );
}

const scoreLabels = ["Стратегия", "Prompt Control", "Автоматизация", "Екип и хора", "Risk Control", "Резултати и ROI"];
const scoreStates = ["Няма процес", "Ad-hoc", "Развиващо се", "Системно", "Интегрирано"];
const scoreRecommendations = [
  "Избери един повтаряем процес и запиши базовото му време и разход.",
  "Създай един общ PCTCO шаблон за най-честата задача на екипа.",
  "Картографирай тригер, вход, AI стъпка, проверка и изход.",
  "Определи одобрени инструменти, забранени данни и отговорник.",
  "Въведи проверка на данни, въздействие и човешки надзор.",
  "Избери 2 или 3 KPI и определи дата за следващ преглед.",
];

export function ScoreTool({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [scores, setScores] = useState([1, 1, 1, 1, 1, 1]);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("ai-control-score");
      // Restoring the device-local assessment is intentional on first mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setScores(JSON.parse(saved));
    } catch { /* optional */ }
  }, []);
  useEffect(() => { try { window.localStorage.setItem("ai-control-score", JSON.stringify(scores)); } catch { /* optional */ } }, [scores]);
  const percent = Math.round((scores.reduce((sum, value) => sum + value, 0) / 24) * 100);
  const stage = percent < 21 ? ["AD-HOC", "AI се използва без общ процес."] : percent < 46 ? ["РАЗВИВАЩО СЕ", "Основата е видима, но практиките още не са стандарт."] : percent < 71 ? ["СИСТЕМНО", "Има повторяеми практики и ясни правила."] : percent < 91 ? ["ИНТЕГРИРАНО", "AI е свързан с ключови процеси и измерване."] : ["AI-NATIVE", "AI е системна част от начина на работа."];
  const lowest = scores.map((score, index) => ({ score, index })).sort((a,b) => a.score - b.score).slice(0, 2);
  return (
    <main className="tool-page page-pad">
      <ToolHeader eyebrow="Диагностика • 6 области" title="AI Control Score" copy="Оцени реалното състояние на бизнеса си: не броя инструменти, а нивото на контрол." icon="◎" note="Резултатът се пази локално" />
      <div className="score-layout">
        <section className="score-inputs">
          {scoreLabels.map((label, index) => <label key={label}><div><span>0{index + 1} • {label}</span><b>{scoreStates[scores[index]]}</b></div><input type="range" min="0" max="4" step="1" value={scores[index]} onChange={event => setScores(current => current.map((value, i) => i === index ? Number(event.target.value) : value))} aria-label={label} /><div className="range-points"><i /><i /><i /><i /><i /></div></label>)}
        </section>
        <aside className="score-result">
          <div className="score-ring" style={{ "--score": percent } as React.CSSProperties}><span><b>{percent}</b><small>/100</small></span></div>
          <p>Control status</p><h2>{stage[0]}</h2><p>{stage[1]}</p>
          <div className="score-bars">{scoreLabels.map((label, index) => <div key={label}><span>{label}</span><i><b style={{ width: `${scores[index] * 25}%` }} /></i><em>{scores[index]}/4</em></div>)}</div>
        </aside>
      </div>
      <section className="action-plan"><div><p className="eyebrow">Следващи най-силни действия</p><h2>Твоят контролен план</h2></div><div>{lowest.map(({ index }, order) => <article key={index}><span>0{order + 1}</span><div><h3>{scoreLabels[index]}</h3><p>{scoreRecommendations[index]}</p><button onClick={() => onNavigate(`level-${index + 1}` as View)}>Отвори ниво {String(index + 1).padStart(2,"0")} →</button></div></article>)}</div></section>
    </main>
  );
}

function MoneyInput({ label, hint, value, onChange, suffix }: { label: string; hint: string; value: number; onChange: (value: number) => void; suffix: string }) {
  return <label className="money-field"><span>{label}</span><small>{hint}</small><div><input type="number" min="0" step="1" value={value} onChange={event => onChange(Math.max(0, Number(event.target.value)))} /><b>{suffix}</b></div></label>;
}

export function RoiTool() {
  const [hours, setHours] = useState(20);
  const [hourly, setHourly] = useState(15);
  const [additional, setAdditional] = useState(0);
  const [tools, setTools] = useState(20);
  const [maintenance, setMaintenance] = useState(0);
  const [implementation, setImplementation] = useState(250);
  const grossMonthly = hours * hourly + additional;
  const monthlyCost = tools + maintenance;
  const netMonthly = grossMonthly - monthlyCost;
  const annualGross = grossMonthly * 12;
  const annualInvestment = monthlyCost * 12 + implementation;
  const annualNet = annualGross - annualInvestment;
  const roi = annualInvestment > 0 ? (annualNet / annualInvestment) * 100 : 0;
  const payback = netMonthly > 0 ? implementation / netMonthly : Infinity;
  const money = (value: number) => new Intl.NumberFormat("bg-BG", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  return (
    <main className="tool-page page-pad">
      <ToolHeader eyebrow="PRO инструмент • бизнес ефект" title="ROI Monitor" copy="„Използваме AI“ не е резултат. Превърни времето, разхода и стойността в измерим бизнес ефект." icon="↗" note="Примерна бизнес оценка, не финансова прогноза" />
      <div className="roi-layout">
        <section className="roi-form"><div className="input-group"><p>Създадена стойност</p><MoneyInput label="Спестени часове" hint="Средно на месец" value={hours} onChange={setHours} suffix="ч" /><MoneyInput label="Стойност на час" hint="Пълна стойност на човешкия час" value={hourly} onChange={setHourly} suffix="€" /><MoneyInput label="Допълнителна стойност" hint="Приход или избегнат разход на месец" value={additional} onChange={setAdditional} suffix="€" /></div><div className="input-group"><p>Инвестиция</p><MoneyInput label="AI инструменти" hint="Общ месечен разход" value={tools} onChange={setTools} suffix="€" /><MoneyInput label="Поддръжка" hint="Месечна човешка или външна поддръжка" value={maintenance} onChange={setMaintenance} suffix="€" /><MoneyInput label="Внедряване" hint="Еднократна начална инвестиция" value={implementation} onChange={setImplementation} suffix="€" /></div></section>
        <aside className="roi-results"><p>Резултати monitor</p><div className="net-value"><span>Нетна месечна стойност</span><b className={netMonthly < 0 ? "is-negative" : ""}>{money(netMonthly)}</b><small>{money(grossMonthly)} създадена стойност − {money(monthlyCost)} текущ разход</small></div><div className="result-grid"><article><span>Годишна нетна стойност</span><b>{money(annualNet)}</b></article><article><span>ROI за първата година</span><b>{Number.isFinite(roi) ? `${Math.round(roi)}%` : "Няма данни"}</b></article><article><span>Изплащане</span><b>{Number.isFinite(payback) ? `${payback.toFixed(1)} мес.` : "Няма"}</b></article><article><span>Спестено време</span><b>{hours * 12} ч / г.</b></article></div><div className="roi-formula"><span>Създадена стойност</span><i>−</i><span>Инструменти + внедряване</span><em>=</em><b>Нетна бизнес стойност</b></div></aside>
      </div>
      <aside className="legal-note"><span>i</span><p><b>Използвай консервативни числа.</b> Запиши базовото време преди внедряването, включи човешкия преглед и сравни реалните данни след пилотния период.</p></aside>
    </main>
  );
}

const copilotModes = [
  { id: "strategy", label: "Открий AI възможност", icon: "◎", instruction: "Анализирай процеса и предложи най-подходящата AI роля, без да започваш от конкретен инструмент." },
  { id: "prompt", label: "Подобри мой промпт", icon: "◌", instruction: "Оцени промпта по PCTCO и създай подобрена версия с ясно маркирани промени." },
  { id: "automation", label: "Проектирай автоматизация", icon: "⌘", instruction: "Картографирай тригер, вход, AI стъпка, човешка проверка, действие и обработка на грешки." },
  { id: "risk", label: "Провери потенциален риск", icon: "◇", instruction: "Провери вида данни, предназначението, въздействието, човешкия надзор и нуждата от експертна консултация." },
  { id: "roi", label: "Измери бизнес ефекта", icon: "↗", instruction: "Определи базова стойност, KPI, разходи и метод за пилотно измерване." },
];

export function CopilotTool() {
  const [mode, setMode] = useState(copilotModes[0].id);
  const [question, setQuestion] = useState("");
  const [brief, setBrief] = useState("");
  const [copied, setCopied] = useState(false);
  const selectedMode = copilotModes.find(item => item.id === mode)!;
  const generate = () => setBrief(`Ти си AI CONTROL™ бизнес консултант.\n\nКАЗУС\n${question || "[Опиши конкретния бизнес казус]"}\n\nЗАДАЧА\n${selectedMode.instruction}\n\nПРАВИЛА ЗА КОНТРОЛ\n- Не измисляй липсващи факти; маркирай допусканията.\n- При чувствителни данни или регулирана употреба посочи нуждата от квалифициран преглед.\n- Запази финалното решение и отговорността при човека.\n- Предложи първо малък, измерим пилот.\n\nФОРМАТ\n1. Кратка диагноза\n2. Липсващи критични данни\n3. Препоръчан процес стъпка по стъпка\n4. Рискове и човешки контрол\n5. KPI и 7-дневно следващо действие`);
  const copy = async () => { if (!brief) return; try { await navigator.clipboard.writeText(brief); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* manual copy remains available */ } };
  return (
    <main className="tool-page page-pad">
      <ToolHeader eyebrow="PRO инструмент 03 • локален режим" title="AI Консултант™" copy="Локален Brief Builder, който подготвя конкретния ти казус като контролиран консултантски бриф за избрания AI. Инструментът не е AI чат и не изпраща данни." icon="✣" note="Без API ключ • без AI отговор в сайта" />
      <div className="copilot-layout">
        <section className="copilot-input"><p className="eyebrow">01 • Избери цел</p><div className="quick-actions">{copilotModes.map(item => <button key={item.id} className={mode === item.id ? "is-active" : ""} onClick={() => setMode(item.id)}><i>{item.icon}</i><span>{item.label}</span></button>)}</div><label><span>02 • Какво искаш да подобриш?</span><textarea value={question} onChange={event => setQuestion(event.target.value)} placeholder="Опиши конкретен процес, промпт, риск или бизнес цел..." /></label><button className="button button--primary" onClick={generate}>Създай консултантски бриф <span>→</span></button></section>
        <aside className="copilot-output"><div><span>CONTROL BRIEF</span>{brief && <button onClick={copy}>{copied ? "Копирано ✓" : "Копирай"}</button>}</div>{brief ? <pre>{brief}</pre> : <div className="prompt-empty"><i>✣</i><h3>Избери цел и опиши казуса.</h3><p>Ще получиш структуриран бриф с процес, контрол, риск и измерване.</p></div>}</aside>
      </div>
      <aside className="legal-note"><span>i</span><p><b>Brief Builder подготвя инструкция, а не генерира AI консултация.</b> Постави брифа в избрания AI, провери отговора и запази финалното решение при човек.</p></aside>
    </main>
  );
}
