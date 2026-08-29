"use client";

import { useEffect, useMemo, useState } from "react";

type FirstWinState = {
  process: string;
  frequency: string;
  baseline: string;
  success: string;
  promptBuilt: boolean;
  safeData: boolean;
  humanReview: boolean;
  measured: boolean;
};

const emptyState: FirstWinState = {
  process: "",
  frequency: "",
  baseline: "",
  success: "",
  promptBuilt: false,
  safeData: false,
  humanReview: false,
  measured: false,
};

const steps = [
  ["01", "Избери един процес", "Повтаряема задача с ясен вход и проверим резултат."],
  ["02", "Запиши базовата стойност", "Колко време или пари струва процесът сега?"],
  ["03", "Създай контролирана инструкция", "Превърни задачата в PCTCO промпт."],
  ["04", "Добави човешка проверка", "Определи кой одобрява резултата и какво проверява."],
  ["05", "Измери след пилота", "Сравни време, качество и разход със стартовата стойност."],
];

export default function FirstWin({ onOpenPromptStudio, onOpenRoi }: { onOpenPromptStudio: () => void; onOpenRoi: () => void }) {
  const [state, setState] = useState<FirstWinState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("ai-control-first-win");
      // Restoring the device-local working brief is intentional on first mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setState({ ...emptyState, ...JSON.parse(saved) });
    } catch { /* device storage is optional */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem("ai-control-first-win", JSON.stringify(state)); } catch { /* device storage is optional */ }
  }, [hydrated, state]);

  const completed = useMemo(() => [
    Boolean(state.process.trim()),
    Boolean(state.baseline.trim()),
    state.promptBuilt,
    state.safeData && state.humanReview,
    state.measured,
  ], [state]);

  const update = <K extends keyof FirstWinState>(key: K, value: FirstWinState[K]) => setState(current => ({ ...current, [key]: value }));

  const openPrompt = () => {
    const seed = {
      persona: "Опитен бизнес специалист, който работи прецизно и не измисля липсващи факти",
      context: `Бизнес процес: ${state.process || "[опиши процеса]"}. Честота: ${state.frequency || "[посочи честота]"}. Сегашна базова стойност: ${state.baseline || "[време или разход]"}.`,
      task: `Подготви надежден първи работен резултат за процеса „${state.process || "[процес]"}“`,
      constraints: "Не използвай чувствителни или клиентски данни. Маркирай допусканията. Не вземай финално решение вместо човека. Предложи малък пилот и критерии за проверка.",
      output: `Структуриран резултат, контролен checklist и критерий за успех: ${state.success || "[опиши как ще разбереш, че пилотът работи]"}.`,
    };
    try { window.localStorage.setItem("ai-control-prompt-seed", JSON.stringify(seed)); } catch { /* device storage is optional */ }
    update("promptBuilt", true);
    onOpenPromptStudio();
  };

  const readyForPrompt = Boolean(state.process.trim() && state.baseline.trim());

  return (
    <main className="tool-page page-pad first-win-page">
      <header className="tool-page-head first-win-head">
        <div>
          <p className="eyebrow">Старт тук • първи измерим процес</p>
          <h1>Първи AI процес</h1>
          <p>За около 30 минути подготви един реален процес за безопасен AI пилот. Целта не е повече теория, а проверим резултат.</p>
          <div className="first-win-badges"><span>1 процес</span><span>1 промпт</span><span>1 човешка проверка</span><span>1 измерване</span></div>
        </div>
        <span>01</span>
      </header>

      <section className="first-win-progress" aria-label="Пет стъпки към първи контролиран AI процес">
        {steps.map(([number, title, copy], index) => (
          <article key={number} className={completed[index] ? "is-complete" : ""}>
            <span>{completed[index] ? "✓" : number}</span><div><b>{title}</b><p>{copy}</p></div>
          </article>
        ))}
      </section>

      <div className="first-win-grid">
        <section className="first-win-form">
          <div className="first-win-form-title"><span>01/02</span><div><h2>Определи пилота</h2><p>Запиши фактите преди да отвориш AI инструмент.</p></div></div>
          <label><span>Кой повтаряем процес искаш да подобриш?</span><textarea value={state.process} onChange={event => update("process", event.target.value)} placeholder="Напр. първа чернова на оферта след клиентско запитване" /></label>
          <div className="first-win-fields">
            <label><span>Колко често се случва?</span><input value={state.frequency} onChange={event => update("frequency", event.target.value)} placeholder="Напр. 8 пъти месечно" /></label>
            <label><span>Сегашно време или разход</span><input value={state.baseline} onChange={event => update("baseline", event.target.value)} placeholder="Напр. 75 минути на оферта" /></label>
          </div>
          <label><span>Как ще разбереш, че пилотът работи?</span><textarea value={state.success} onChange={event => update("success", event.target.value)} placeholder="Напр. чернова до 30 минути, без пропуснати изисквания, одобрена от човек" /></label>
        </section>

        <aside className="first-win-control">
          <div><span>03/05</span><h2>Контрол преди действие</h2><p>Отбележи само това, което действително си проверил.</p></div>
          <label className={state.safeData ? "is-checked" : ""}><input type="checkbox" checked={state.safeData} onChange={event => update("safeData", event.target.checked)} /><span>{state.safeData ? "✓" : ""}</span><b>Ще използвам тестови, анонимизирани или разрешени данни.</b></label>
          <label className={state.humanReview ? "is-checked" : ""}><input type="checkbox" checked={state.humanReview} onChange={event => update("humanReview", event.target.checked)} /><span>{state.humanReview ? "✓" : ""}</span><b>Определих човек и критерии за финална проверка.</b></label>
          <label className={state.measured ? "is-checked" : ""}><input type="checkbox" checked={state.measured} onChange={event => update("measured", event.target.checked)} /><span>{state.measured ? "✓" : ""}</span><b>Проведох пилота и записах реалния резултат.</b></label>
          <button className="button button--primary" disabled={!readyForPrompt} onClick={openPrompt}>Създай първия PCTCO промпт <span>→</span></button>
          <button className="button button--ghost" onClick={onOpenRoi}>Измери резултата в ROI Monitor</button>
          {!readyForPrompt && <small>Попълни процеса и базовата стойност, за да продължиш.</small>}
        </aside>
      </div>

      <aside className="legal-note"><span>i</span><p><b>Работи с малък и обратим пилот.</b> Не въвеждай лични, клиентски, договорно защитени или други чувствителни данни в AI инструмент без основание, разрешение и подходящ контрол.</p></aside>
    </main>
  );
}
