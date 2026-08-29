"use client";

import { useEffect, useMemo, useState } from "react";
import { ControlLibrary, CopilotTool, PromptStudio, RoiTool, ScoreTool } from "./InteractiveTools";
import FirstWin from "./FirstWin";
import { marketConfig } from "./marketConfig";

export type AccessTier = "preview" | "starter" | "pro";

export type View =
  | "dashboard"
  | "first-win"
  | "level-1"
  | "level-2"
  | "level-3"
  | "level-4"
  | "level-5"
  | "level-6"
  | "prompt-studio"
  | "library"
  | "copilot"
  | "score"
  | "roi";

type Level = {
  id: number;
  label: string;
  title: string;
  short: string;
  icon: string;
  principle: string;
  description: string;
};

export const levels: Level[] = [
  {
    id: 1,
    label: "Стратегия",
    title: "Открий възможността",
    short: "Стратегически контрол",
    icon: "◎",
    principle: "Без бизнес обосновка. Без AI проект.",
    description: "Започни с бизнес проблема, а не с поредния инструмент.",
  },
  {
    id: 2,
    label: "Prompt Control™",
    title: "Контролирай резултата",
    short: "Prompt Control™",
    icon: "◌",
    principle: "Контролирай входа. Подобри резултата.",
    description: "Превърни неясната заявка в структурирана инструкция.",
  },
  {
    id: 3,
    label: "Autopilot™",
    title: "Изгради процеса",
    short: "Autopilot™",
    icon: "⌘",
    principle: "Автоматизирай процеса. Не хаоса.",
    description: "Превърни повтаряемата работа в надежден работен поток.",
  },
  {
    id: 4,
    label: "Човешки контрол",
    title: "Запази човешката преценка",
    short: "Човешки контрол",
    icon: "◉",
    principle: "AI помага. Хората решават.",
    description: "Изгради правила, отговорност и задължителен човешки преглед.",
  },
  {
    id: 5,
    label: "Risk Control™",
    title: "Контролирай риска",
    short: "Risk Control™",
    icon: "◇",
    principle: "Движи се бързо. Запази контрола.",
    description: "Провери данните, въздействието, надзора и приложимите правила.",
  },
  {
    id: 6,
    label: "Резултати",
    title: "Измервай важното",
    short: "Резултати",
    icon: "↗",
    principle: "Ако не можеш да го измериш, не можеш да го управляваш.",
    description: "Следи времето, разхода, качеството и нетната бизнес стойност.",
  },
];

const checklistByLevel: Record<number, string[]> = {
  1: [
    "Имам конкретен бизнес проблем за решаване",
    "Мога да измеря сегашното време или разход",
    "Процесът се повтаря достатъчно често",
    "AI може да създаде реална, измерима стойност",
    "Не добавям AI само защото е модерно",
  ],
  2: [
    "Определих точната роля на AI",
    "Добавих достатъчно контекст",
    "Задачата има един ясен резултат",
    "Описах ограниченията и критериите",
    "Посочих желания формат на отговора",
  ],
  3: [
    "Процесът е ясно дефиниран",
    "Има повторяеми входове и изходи",
    "Резултатът може да бъде проверен",
    "Данните са подходящи за инструментите",
    "Определих къде е нужен човешки преглед",
  ],
  4: [
    "Имаме ясна вътрешна AI политика",
    "Екипът знае кои инструменти са разрешени",
    "Правилата за чувствителни данни са ясни",
    "Има случаи със задължителен човешки преглед",
    "Отговорността за финалното решение е определена",
  ],
  5: [
    "Проверих за лични и клиентски данни",
    "Оцених ефекта при грешен резултат",
    "Знам как се съхраняват и използват данните",
    "Определих необходимия човешки надзор",
    "Проверих приложимите договорни и правни изисквания",
  ],
  6: [
    "Имам базова стойност преди внедряването",
    "Следя спестеното човешко време",
    "Отчитам разхода за инструменти и внедряване",
    "Измервам качество, обем и грешки",
    "Имам дата за следващ преглед и оптимизация",
  ],
};

const pctco = [
  ["P", "Persona / Роля", "Коя перспектива трябва да използва AI?", "Старши стратег по performance marketing"],
  ["C", "Context / Контекст", "Какво трябва да знае?", "B2B SaaS за малки компании в България"],
  ["T", "Task / Задача", "Какъв конкретен резултат искаш?", "Създай 5 концепции за Meta Ads"],
  ["C", "Constraints / Ограничения", "Какви правила трябва да спази?", "Без клишета, до 80 думи, реалистични обещания"],
  ["O", "Output / Формат", "Как да представи резултата?", "Таблица: кука / текст / CTA"],
];

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const proOnlyViews: View[] = ["library", "copilot"];
const previewLockedViews: View[] = ["prompt-studio", ...proOnlyViews];

function isLockedView(view: View, accessTier: AccessTier) {
  if (accessTier === "pro") return false;
  return (accessTier === "preview" ? previewLockedViews : proOnlyViews).includes(view);
}

function AccessGate({ accessTier, view }: { accessTier: AccessTier; view: View }) {
  const labels: Partial<Record<View, string>> = {
    "prompt-studio": "Prompt Studio",
    library: "Control Library™",
    copilot: "AI Консултант™",
  };
  const label = labels[view] ?? "Този инструмент";

  return (
    <main className="tool-page page-pad access-gate">
      <div className="access-gate-mark"><BrandMark compact /></div>
      <p className="eyebrow">{accessTier === "starter" ? "Starter → Pro" : "Продуктово превю"}</p>
      <h1>{label}</h1>
      <p>{accessTier === "starter"
        ? "Инструментът е част от Pro. Надгради с еднократно доплащане и запази локалния прогрес на това устройство."
        : "Инструментът е заключен в публичното превю. Избери Starter за основната система или Pro за пълния инструментариум."}</p>
      {accessTier === "starter" ? (
        <div className="access-gate-actions">
          <a className="button button--gold" href={marketConfig.checkout.upgrade} rel="noreferrer">Надгради за {marketConfig.prices.upgrade} <span>→</span></a>
          <small>Stripe Checkout • еднократно • след плащане се отваря Pro версията</small>
        </div>
      ) : (
        <div className="access-gate-actions access-gate-actions--choice">
          <a className="button button--ghost" href={marketConfig.checkout.starter} rel="noreferrer">Starter {marketConfig.prices.starter}</a>
          <a className="button button--gold" href={marketConfig.checkout.pro} rel="noreferrer">Pro {marketConfig.prices.pro} <span>→</span></a>
        </div>
      )}
      <aside className="legal-note"><span>i</span><p><b>Достъпът е чрез отделен GitHub Pages линк, без профил и парола.</b> Линкът не е персонален и не трябва да се споделя.</p></aside>
    </main>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("brand-mark", compact && "brand-mark--compact")} aria-label="AI CONTROL, практическа бизнес система">
      {/* A plain relative image keeps the shared component portable to GitHub Pages. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand-glyph" src="./brand/ai-control-mark.png" width="154" height="138" alt="" aria-hidden="true" />
      {!compact && <span className="brand-lockup"><span className="brand-word">AI CONTROL<sup>™</sup></span><small>Практическа бизнес система</small></span>}
    </div>
  );
}

function OrbitCore({ completed }: { completed: number }) {
  return (
    <div className="orbit" aria-label={`Контролен център: ${completed} от 6 нива завършени`}>
      <div className="orbit-ring orbit-ring--outer" />
      <div className="orbit-ring orbit-ring--inner" />
      <div className="orbit-core"><BrandMark compact /></div>
      {levels.map((level, index) => (
        <div
          className={cn("orbit-node", index < completed && "orbit-node--done")}
          style={{ "--i": index } as React.CSSProperties}
          key={level.id}
          title={level.label}
        ><span>{level.icon}</span></div>
      ))}
    </div>
  );
}

function Sidebar({
  view,
  completed,
  accessTier,
  onNavigate,
  open,
  onClose,
}: {
  view: View;
  completed: number[];
  accessTier: AccessTier;
  onNavigate: (view: View) => void;
  open: boolean;
  onClose: () => void;
}) {
  const nav = (next: View) => { onNavigate(next); onClose(); };
  return (
    <>
      <button className={cn("drawer-scrim", open && "is-open")} onClick={onClose} aria-label="Затвори менюто" />
      <aside className={cn("sidebar", open && "is-open")}>
        <div className="sidebar-brand"><BrandMark /><p>Пълен контрол<br />над вашия AI</p></div>
        <nav aria-label="Основна навигация">
          <p className="nav-caption"><span>✣</span> Център за управление</p>
          <button className={cn("nav-start", view === "dashboard" && "is-active")} onClick={() => nav("dashboard")}>
            <span className="nav-home">◆</span><span><b>Старт</b><small>Център за управление</small></span>
          </button>
          <button className={cn("tool-nav", "first-win-nav", view === "first-win" && "is-active")} onClick={() => nav("first-win")}><span>01</span><b>Първи AI процес</b><em>START</em></button>
          <div className="level-nav">
            {levels.map((level) => (
              <button key={level.id} className={cn(view === `level-${level.id}` && "is-active", completed.includes(level.id) && "is-complete")} onClick={() => nav(`level-${level.id}` as View)}>
                <span>{String(level.id).padStart(2, "0")}</span><b>{level.label}</b><i>{completed.includes(level.id) ? "✓" : ""}</i>
              </button>
            ))}
          </div>
          <p className="nav-caption nav-caption--tools"><span>⌘</span> Инструменти</p>
          <button className={cn("tool-nav", view === "prompt-studio" && "is-active")} onClick={() => nav("prompt-studio")}><span>◌</span><b>Prompt Studio</b><em>{accessTier === "starter" ? "2×" : accessTier === "pro" ? "PRO" : "LOCK"}</em></button>
          <button className={cn("tool-nav", view === "library" && "is-active")} onClick={() => nav("library")}><span>▦</span><b>Control Library™</b><em>{accessTier === "pro" ? "40" : "LOCK"}</em></button>
          <button className={cn("tool-nav", view === "copilot" && "is-active")} onClick={() => nav("copilot")}><span>✣</span><b>AI Консултант™</b><em>{accessTier === "pro" ? "LOCAL" : "LOCK"}</em></button>
          <button className={cn("tool-nav", view === "score" && "is-active")} onClick={() => nav("score")}><span>◎</span><b>AI Control Score</b></button>
          <button className={cn("tool-nav", view === "roi" && "is-active")} onClick={() => nav("roi")}><span>↗</span><b>ROI калкулатор</b></button>
        </nav>
        <div className="sidebar-progress">
          <div className="progress-top"><span>Прогрес на контрола</span><b>{completed.length}/6</b></div>
          <div className="progress-track"><i style={{ width: `${(completed.length / 6) * 100}%` }} /></div>
          <div className="progress-dots">{levels.map(level => <span key={level.id} className={completed.includes(level.id) ? "is-done" : ""}>{completed.includes(level.id) ? "✓" : ""}</span>)}</div>
          <p>{completed.length === 6 ? "Системата е завършена. Приложи я към реален процес." : "Прогресът се пази локално на това устройство."}</p>
        </div>
        {accessTier === "starter" && <a className="sidebar-upgrade" href={marketConfig.checkout.upgrade} rel="noreferrer"><span>Starter → Pro</span><b>Надгради за {marketConfig.prices.upgrade}</b><em>Stripe Checkout →</em></a>}
        <div className="edition-stamp">AI CONTROL™<small>BG EDITION • v1.0 • 2026</small></div>
      </aside>
    </>
  );
}

function Topbar({ onMenu, accessTier, onExit }: { onMenu: () => void; accessTier: AccessTier; onExit?: () => void }) {
  return (
    <header className="topbar">
      <button className="menu-button" onClick={onMenu} aria-label="Отвори менюто"><span /><span /><span /></button>
      <BrandMark />
      {onExit && <button className="guide-exit" onClick={onExit}>← Към продукта</button>}
      <div className="system-status"><span>Достъп</span><b><i /> {accessTier === "pro" ? "Pro активен" : accessTier === "starter" ? "Starter активен" : "Превю"}</b></div>
    </header>
  );
}

function Dashboard({ completed, onNavigate }: { completed: number[]; onNavigate: (view: View) => void }) {
  return (
    <>
      <section className="hero page-pad">
        <div className="hero-copy">
          <p className="eyebrow">Българско издание • v1.0 • 2026</p>
          <h1>От AI хаос<br /><span>до работещ процес.</span></h1>
          <h2>Превърни AI експериментите в контролиран бизнес процес.</h2>
          <p className="hero-lead">Практическа система за фрийлансъри, соло експерти и малки бизнеси, които вече използват AI, но искат повторяем процес, човешки контрол и реален резултат.</p>
          <div className="hero-actions">
            <button className="button button--primary" onClick={() => onNavigate(completed.length ? `level-${Math.min(completed.length + 1, 6)}` as View : "first-win")}>{completed.length ? "Продължи системата" : "Създай първия AI процес"}<span>→</span></button>
            <button className="button button--ghost" onClick={() => onNavigate("score")}>Провери AI Score</button>
          </div>
          <p className="trust-line"><span>◇</span> Локални инструменти. Без API. Без изпращане на въведените данни.</p>
        </div>
        <div className="hero-visual"><OrbitCore completed={completed.length} /></div>
      </section>

      <section className="first-win-launch page-pad">
        <div><span>СТАРТ ТУК</span><h2>Първи контролиран процес за около 30 минути.</h2><p>Избери задача, запиши базовата стойност, създай PCTCO промпт, добави човешка проверка и измери резултата след пилота.</p></div>
        <div className="first-win-mini-flow"><b>Процес</b><i>→</i><b>Промпт</b><i>→</i><b>Контрол</b><i>→</i><b>Резултат</b></div>
        <button className="button button--gold" onClick={() => onNavigate("first-win")}>Отвори първия AI процес <span>→</span></button>
      </section>

      <section className="section page-pad control-path">
        <div className="section-heading"><span /><h2>Шестте ключови области за пълен контрол</h2><span /></div>
        <div className="level-grid">
          {levels.map(level => (
            <button key={level.id} className={cn("level-card", completed.includes(level.id) && "is-complete")} onClick={() => onNavigate(`level-${level.id}` as View)}>
              <div className="level-card-top"><span>{String(level.id).padStart(2, "0")}</span>{completed.includes(level.id) && <b>Завършено ✓</b>}</div>
              <i>{level.icon}</i><h3>{level.short}</h3><p>{level.description}</p><em>Отвори нивото <span>→</span></em>
            </button>
          ))}
        </div>
      </section>

      <section className="section page-pad why-section">
        <div className="section-heading"><span /><h2>Защо AI CONTROL™?</h2><span /></div>
        <div className="benefit-grid">
          {[
            ["◷", "Спестяваш време", "По-малко повтаряема работа, повече фокус върху важните решения."],
            ["◎", "По-добри резултати", "Ясна система означава по-предвидими и измерими резултати."],
            ["◇", "По-малко рискове", "Практики за данни, човешки надзор и отговорна употреба."],
            ["↗", "Реална възвръщаемост", "AI е инвестиция само когато носи измерима бизнес стойност."],
          ].map(([icon, title, copy]) => <article key={title}><i>{icon}</i><div><h3>{title}</h3><p>{copy}</p></div></article>)}
        </div>
      </section>

      <section className="section page-pad toolkit">
        <div className="toolkit-intro"><p className="eyebrow">PRO инструментариум</p><h2>От знание към изпълнение.</h2><p>Не просто разбирай AI. Изгради инструкция, избери готова структура и измери ефекта.</p></div>
        <div className="toolkit-cards toolkit-cards--four">
          <button onClick={() => onNavigate("prompt-studio")}><span>01</span><i>◌</i><h3>Prompt Studio</h3><p>PCTCO генератор за ясни, контролирани инструкции.</p><em>Създай промпт →</em></button>
          <button onClick={() => onNavigate("library")}><span>02</span><i>▦</i><h3>Control Library™</h3><p>40 структури за маркетинг, продажби, HR и още.</p><em>Отвори библиотеката →</em></button>
          <button onClick={() => onNavigate("copilot")}><span>03</span><i>✣</i><h3>AI Консултант™</h3><p>Локален Brief Builder за контролиран бриф към избрания AI.</p><em>Подготви бриф →</em></button>
          <button onClick={() => onNavigate("roi")}><span>04</span><i>↗</i><h3>ROI Monitor</h3><p>Изчисли създадената стойност и реалната възвръщаемост.</p><em>Измери резултата →</em></button>
        </div>
      </section>

      <section className="final-cta page-pad">
        <div><span>ϟ</span><p><b>Спри да изпитваш. Започни да контролираш.</b><small>AI CONTROL™ ти дава системата. Ти създаваш резултатите.</small></p></div>
        <button className="button button--gold" onClick={() => onNavigate(completed.length < 6 ? `level-${completed.length + 1}` as View : "prompt-studio")}>{completed.length < 6 ? "Продължи сега" : "Приложи системата"}<span>→</span></button>
      </section>
    </>
  );
}

function CheckPanel({ levelId }: { levelId: number }) {
  const [checked, setChecked] = useState<boolean[]>(() => checklistByLevel[levelId].map(() => false));
  const count = checked.filter(Boolean).length;
  return (
    <section className="lesson-check">
      <div className="lesson-check-head"><div><p className="eyebrow">Практическа проверка</p><h3>Готов ли е процесът?</h3></div><span>{count}/{checked.length}</span></div>
      <div className="mini-progress"><i style={{ width: `${(count / checked.length) * 100}%` }} /></div>
      <div className="check-list">
        {checklistByLevel[levelId].map((item, index) => (
          <label key={item} className={checked[index] ? "is-checked" : ""}>
            <input type="checkbox" checked={checked[index]} onChange={() => setChecked(current => current.map((value, i) => i === index ? !value : value))} />
            <span>{checked[index] ? "✓" : ""}</span><b>{item}</b>
          </label>
        ))}
      </div>
    </section>
  );
}

function LevelSpecific({ id, onNavigate }: { id: number; onNavigate: (view: View) => void }) {
  if (id === 1) return (
    <>
      <section className="lesson-split">
        <div><p className="eyebrow">Правилният начален въпрос</p><h3>Не „Кой AI инструмент?“</h3><p>Инструментът е последната стъпка. Първо определи къде бизнесът губи време, пари или качество.</p></div>
        <div className="question-card"><span>По-добрият въпрос</span><blockquote>„Кой проблем искам да реша и как ще измеря подобрението?“</blockquote></div>
      </section>
      <section className="opportunity-grid">{[["Честота", "Колко често се повтаря задачата?"], ["Време", "Колко човешки часа изисква?"], ["Стандарт", "Има ли ясни правила и резултат?"], ["Стойност", "Каква полза носи подобрението?"]].map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</section>
      <section className="role-grid"><article><span>АНАЛИЗ</span><h3>Традиционен AI</h3><p>Прогнозиране, класификация и откриване на модели в данни.</p></article><article><span>СЪЗДАВАНЕ</span><h3>Генеративен AI</h3><p>Съдържание, код, идеи и взаимодействие чрез естествен език.</p></article></section>
    </>
  );
  if (id === 2) return (
    <>
      <section className="pctco-grid">{pctco.map(([letter, title, question, example], index) => <article key={`${letter}-${title}`}><i>{letter}</i><span>Параметър 0{index + 1}</span><h3>{title}</h3><p>{question}</p><blockquote>„{example}“</blockquote></article>)}</section>
      <section className="control-flow"><span>РОЛЯ</span><b>+</b><span>КОНТЕКСТ</span><b>+</b><span>ЗАДАЧА</span><b>+</b><span>ПРАВИЛА</span><b>+</b><span>ФОРМАТ</span><em>↓</em><strong>КОНТРОЛИРАН РЕЗУЛТАТ</strong></section>
      <button className="inline-tool-link" onClick={() => onNavigate("prompt-studio")}><span>◌</span><div><b>Приложи PCTCO в Prompt Studio</b><small>Създай готова инструкция стъпка по стъпка.</small></div><em>→</em></button>
    </>
  );
  if (id === 3) return (
    <>
      <section className="before-after"><div><span>Преди Autopilot</span><h3>Ръчен процес</h3>{["Ново запитване", "Копирай данните", "Отвори AI", "Постави отговора", "Обнови CRM"].map(x => <p key={x}>{x}</p>)}</div><i>→</i><div className="is-control"><span>След Autopilot</span><h3>Контролиран процес</h3>{["Тригер", "Вземи данните", "AI анализ", "Човешка проверка", "Готово ✓"].map(x => <p key={x}>{x}</p>)}</div></section>
      <section className="three-cards">{[["Make", "Визуални процеси с повече стъпки и разклонения."], ["Zapier", "Бързо свързване на приложения и стандартни автоматизации."], ["API", "Персонализирани интеграции и максимален контрол."]].map(([title, copy]) => <article key={title}><span>TOOL</span><h3>{title}</h3><p>{copy}</p></article>)}</section>
    </>
  );
  if (id === 4) return (
    <>
      <section className="human-framework">{[["01", "Комуникирай", "Обясни защо организацията използва AI."], ["02", "Определи", "Създай ясни правила, роли и граници."], ["03", "Обучи", "Покажи възможностите и ограниченията."], ["04", "Подкрепи", "Осигури хора, които помагат на екипа."], ["05", "Прегледай", "Определи решенията с човешка проверка."]].map(([num, title, copy]) => <article key={num}><span>{num}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</section>
      <section className="human-equation"><div>ЧОВЕК <span>vs</span> AI</div><i>→</i><strong>ЧОВЕК <span>×</span> AI</strong><p>AI подпомага. Човекът носи преценката и отговорността.</p></section>
    </>
  );
  if (id === 5) return (
    <>
      <section className="risk-command"><span>Ако има чувствителни данни</span><div><b>СПРИ</b><i>→</i><b>ПРОВЕРИ</b><i>→</i><b>КОНТРОЛИРАЙ</b></div></section>
      <section className="risk-grid">{[["Забранени практики", "Определени употреби не трябва да продължават.", "critical"], ["Високорискови системи", "Възможни са по-строги задължения и документация.", "high"], ["Прозрачност", "Провери дали потребителят трябва да бъде информиран.", "medium"], ["Други приложения", "Използвай отговорно и проверявай другите приложими правила.", "low"]].map(([title, copy, risk]) => <article key={title} className={`risk-${risk}`}><span>{risk === "critical" ? "СТОП" : risk === "high" ? "ВИСОК" : risk === "medium" ? "ПРОВЕРИ" : "КОНТРОЛ"}</span><h3>{title}</h3><p>{copy}</p></article>)}</section>
      <aside className="legal-note"><span>i</span><p><b>Практическа ориентация, не правен съвет.</b> Класифицирай риска според системата, целта, данните и въздействието. При чувствителни или регулирани приложения потърси квалифициран специалист. <a href="https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" target="_blank" rel="noreferrer">Официална информация за EU AI Act →</a></p></aside>
    </>
  );
  return (
    <>
      <section className="metric-grid">{[["Време", "↓", "Колко време спестява процесът?"], ["Разход", "↓", "Как се променя цената на задача?"], ["Обем", "↑", "Колко повече работа се извършва?"], ["Грешки", "↓", "Намалява ли процентът грешки?"], ["Качество", "↑", "Подобрява ли се стандартът?"], ["ROI", "↗", "По-голяма ли е стойността от инвестицията?"]].map(([title, icon, copy]) => <article key={title}><i>{icon}</i><h3>{title}</h3><p>{copy}</p></article>)}</section>
      <section className="roi-example"><div><span>Спестено време</span><b>20 ч / месец</b></div><i>×</i><div><span>Стойност на час</span><b>€15</b></div><i>−</i><div><span>AI инструменти</span><b>€20</b></div><em>=</em><strong><span>Нетна стойност</span>€280 / месец</strong></section>
      <button className="inline-tool-link" onClick={() => onNavigate("roi")}><span>↗</span><div><b>Изчисли твоя реален AI ROI</b><small>Въведи собствените си стойности.</small></div><em>→</em></button>
    </>
  );
}

function LevelView({ level, completed, onComplete, onNavigate }: { level: Level; completed: boolean; onComplete: () => void; onNavigate: (view: View) => void }) {
  const next = level.id < 6 ? `level-${level.id + 1}` as View : "prompt-studio";
  return (
    <main className="lesson-page page-pad">
      <div className="lesson-hero"><div><p className="eyebrow">Ниво {String(level.id).padStart(2, "0")} / 06 • {level.label}</p><h1>{level.title}</h1><p>{level.description}</p></div><span className="lesson-icon">{level.icon}</span></div>
      <div className="lesson-body">
        <LevelSpecific id={level.id} onNavigate={onNavigate} />
        <CheckPanel levelId={level.id} />
        <section className="principle"><span>Принцип #{String(level.id).padStart(2, "0")}</span><h2>{level.principle}</h2></section>
        <div className="lesson-actions">
          <button className={cn("button button--complete", completed && "is-complete")} onClick={onComplete}>{completed ? "Нивото е завършено ✓" : `Завърши ниво ${String(level.id).padStart(2, "0")} ✓`}</button>
          <button className="button button--primary" onClick={() => onNavigate(next)}>{level.id < 6 ? "Следващо ниво" : "Отвори Prompt Studio"}<span>→</span></button>
        </div>
      </div>
    </main>
  );
}

export default function GuideApp({ initialView = "dashboard", accessTier = "preview", onExit }: { initialView?: View; accessTier?: AccessTier; onExit?: () => void } = {}) {
  const [view, setView] = useState<View>(initialView);
  const [completed, setCompleted] = useState<number[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("ai-control-progress");
      // Restoring device-local progress is an intentional one-time synchronization.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setCompleted(JSON.parse(saved));
    } catch { /* storage can be unavailable */ }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) window.localStorage.setItem("ai-control-progress", JSON.stringify(completed)); }, [completed, hydrated]);

  const currentLevel = useMemo(() => view.startsWith("level-") ? levels.find(level => level.id === Number(view.split("-")[1])) ?? null : null, [view]);
  const locked = isLockedView(view, accessTier);
  const navigate = (next: View) => { setView(next); window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0); };
  const toggleComplete = (id: number) => setCompleted(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id].sort());

  return (
    <div className="app-shell">
      <Sidebar view={view} completed={completed} accessTier={accessTier} onNavigate={navigate} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="app-main">
        <Topbar onMenu={() => setDrawerOpen(true)} accessTier={accessTier} onExit={onExit} />
        {locked ? <AccessGate accessTier={accessTier} view={view} /> : <>
          {view === "dashboard" && <Dashboard completed={completed} onNavigate={navigate} />}
          {currentLevel && <LevelView level={currentLevel} completed={completed.includes(currentLevel.id)} onComplete={() => toggleComplete(currentLevel.id)} onNavigate={navigate} />}
          {view === "first-win" && <FirstWin onOpenPromptStudio={() => navigate("prompt-studio")} onOpenRoi={() => navigate("roi")} />}
          {view === "prompt-studio" && <PromptStudio generationLimit={accessTier === "starter" ? 2 : undefined} upgradeUrl={accessTier === "starter" ? marketConfig.checkout.upgrade : undefined} />}
          {view === "library" && <ControlLibrary onNavigate={navigate} />}
          {view === "copilot" && <CopilotTool />}
          {view === "score" && <ScoreTool onNavigate={navigate} />}
          {view === "roi" && <RoiTool />}
        </>}
        <footer><BrandMark /><p>Практическа бизнес система • BG издание v1.0 • 2026</p><span>© 2026 AI CONTROL™</span></footer>
      </div>
    </div>
  );
}
