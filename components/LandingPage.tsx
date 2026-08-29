"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { BrandMark, levels, type View } from "./GuideApp";
import { marketConfig, type CheckoutKind } from "./marketConfig";

const productModules = [
  {
    number: "01",
    eyebrow: "Система за контрол",
    title: "6 нива",
    icon: "◎",
    lead: "Премини стъпка по стъпка от AI хаос към структурирана AI система.",
    items: ["Стратегическа рамка", "PCTCO система", "Рамка за автоматизация", "Човешки контрол", "Risk Control™", "ROI рамка"],
    status: "Система: готова",
    view: "dashboard" as View,
  },
  {
    number: "02",
    eyebrow: "Prompt Control™",
    title: "Не питай AI. Инструктирай го.",
    icon: "◌",
    lead: "Превърни идеята си в структурирана инструкция чрез PCTCO рамката.",
    items: ["P: Persona / роля", "C: Context / контекст", "T: Task / задача", "C: Constraints / ограничения", "O: Output / формат", "40 готови бизнес промпта"],
    status: "Prompt Control: активен",
    view: "prompt-studio" as View,
  },
  {
    number: "03",
    eyebrow: "AI Консултант™",
    title: "Подготви казуса за избрания AI.",
    icon: "◇",
    lead: "Локално превърни конкретна бизнес ситуация в структуриран бриф, който копираш в избрания AI.",
    items: ["AI стратегия", "Автоматизация", "Оптимизация на процеси", "Подобряване на промптове", "Риск и човешки контрол", "KPI за пилота"],
    status: "Brief Builder: локален, без API",
    view: "copilot" as View,
  },
];

const bonuses = [
  {
    number: "01",
    icon: "↗",
    title: "AI Daily Control™",
    subtitle: "Върни контрола върху работния си ден.",
    copy: "Практическа система за фокус, AI инструкции, делегиране на рутина и проследяване на спестеното време.",
    result: "По-малко рутина. Повече време за важните решения.",
  },
  {
    number: "02",
    icon: "⌘",
    title: "Autopilot Blueprint™",
    subtitle: "Свържи AI с бизнеса си.",
    copy: "Готова Make.com схема: Gmail → AI анализ → човешка проверка → готова чернова.",
    result: "От ръчна работа към контролиран Autopilot.",
  },
  {
    number: "03",
    icon: "◇",
    title: "Risk Control™",
    subtitle: "Иновирай, без да губиш контрол.",
    copy: "Практически checklist за риск, прозрачност, човешки надзор, сигурност на данните, GDPR и EU AI Act.",
    result: "Спри → провери → контролирай.",
  },
];

const levelDetails = [
  {
    number: "01",
    label: "Стратегия",
    title: "Открий възможността",
    copy: "Преди да автоматизираш, трябва да знаеш какво си струва да автоматизираш. Открий процесите, в които AI може да спести време, намали ръчната работа и създаде измерима стойност.",
    principle: "Без проблем. Без инструмент.",
  },
  {
    number: "02",
    label: "Prompt Control™",
    title: "Контролирай резултата",
    copy: "AI не чете мисли. Той следва инструкции. Овладей PCTCO рамката и превръщай неясните заявки в структурирани промптове.",
    principle: "По-добър вход. По-добър контрол.",
  },
  {
    number: "03",
    label: "Autopilot™",
    title: "Автоматизирай процеса",
    copy: "Накарай AI да работи като част от процеса. Свържи го с Make, Zapier и други инструменти: тригер → AI → действие → готово.",
    principle: "Автоматизирай процеса. Не хаоса.",
  },
  {
    number: "04",
    label: "Човешки контрол",
    title: "AI помага. Хората решават.",
    copy: "Изгради ясни правила, обучи екипа и определи кога AI помага и кога решението трябва да остане човешко.",
    principle: "AI помага. Хората носят преценката.",
  },
  {
    number: "05",
    label: "Risk Control™",
    title: "Контролирай риска",
    copy: "Провери данните, целта, потенциалния ефект при грешка, нужния човешки надзор и приложимите правила.",
    principle: "Иновирай. Без да губиш контрол.",
  },
  {
    number: "06",
    label: "Резултати",
    title: "Измервай важното",
    copy: "„Използваме AI“ не е бизнес резултат. Измервай спестеното време, намалената ръчна работа, разхода, стойността и ROI.",
    principle: "Ако не го измерваш, не можеш да го подобриш.",
  },
];

const faqItems = [
  {
    question: "Как получавам AI CONTROL™?",
    answer: "След успешно плащане Stripe те пренасочва директно към правилната GitHub Pages версия: Starter или Pro. Stripe изпраща платежното потвърждение на имейл; запази и линка за достъп до закупеното издание.",
    status: "Stripe → незабавен достъп",
  },
  {
    question: "Трябват ли ми технически умения?",
    answer: "Не. Системата е за български фрийлансъри, соло експерти и малки бизнеси, които вече използват ChatGPT, Gemini или друг AI, но искат ясен и повторяем процес.",
    status: "Технически умения → не са задължителни",
  },
  {
    question: "Това курс ли е или електронна книга?",
    answer: "Не. AI CONTROL™ е практическа бизнес система с 6 контролни нива, Prompt Studio, Control Library, AI Консултант, чеклисти, AI Score и ROI Monitor.",
    status: "Формат → практическа система + инструменти",
  },
  {
    question: "Има ли месечен абонамент?",
    answer: "Не. Плащаш веднъж и получаваш доживотен достъп до закупеното издание. Малки актуализации на текущото издание са включени; бъдещи отделни продукти или специализирани пакети не са обещани като безплатни.",
    status: "Абонамент → няма",
  },
  {
    question: "Мога ли да премина от Starter към Pro?",
    answer: "Да. Можеш да започнеш със Starter и по-късно да отключиш пълния Pro инструментариум с еднократно доплащане от €20.00. Не плащаш Starter повторно; локалният прогрес на същото устройство не се изтрива.",
    status: "Starter → +€20.00 → Pro",
  },
  {
    question: "Каква е разликата между Starter и Pro?",
    answer: "Starter изгражда AI основата: първи контролиран AI процес, 6 нива, практическата система, 3 бонуса и 2 Prompt Control генерации. Pro добавя Prompt Control без лимит, 40 готови промпта, Control Library™ и AI Консултант™.",
    status: "Система или система + инструменти",
  },
  {
    question: "Какво прави AI Консултант™?",
    answer: "AI Консултант™ е локален Brief Builder: подготвя структуриран консултантски бриф, който копираш в избрания от теб AI. Не прави API заявка и не връща AI отговор в сайта.",
    status: "Локален инструмент → без API",
  },
  {
    question: "Къде се пазят данните и прогресът ми?",
    answer: "Работните полета, историята, AI Score и прогресът се пазят само в браузъра на текущото устройство. Не се изпращат към външен AI и не се синхронизират между устройства.",
    status: "Данни → само на устройството",
  },
  {
    question: "Има ли профил и парола?",
    answer: "Не. Това издание използва лек статичен модел с GitHub Pages и Stripe: достъпът е чрез отделен линк, без потребителски профил. Линкът не е персонален и не трябва да се споделя; при нужда от възстановяване използвай имейла от плащането.",
    status: "Достъп → чрез линк, без акаунт",
  },
];

function LandingCore() {
  return (
    <figure className="reference-control-graphic">
      <svg viewBox="0 0 645 645" role="img" aria-labelledby="hero-map-title">
        <title id="hero-map-title">AI CONTROL карта на шестте контролни области: стратегия, промптове, автоматизации, екип и хора, рискове и резултати</title>
        <defs>
          <mask id="hero-map-copy-mask" maskUnits="userSpaceOnUse">
            <rect width="645" height="645" fill="white" />
            <rect x="250" y="0" width="395" height="78" fill="black" />
            <rect x="518" y="219" width="127" height="68" fill="black" />
          </mask>
        </defs>
        <image href="./brand/ai-control-hero-map.png" width="645" height="645" mask="url(#hero-map-copy-mask)" />
        <text x="526" y="259" textLength="111" lengthAdjust="spacingAndGlyphs">ПРОМПТОВЕ</text>
      </svg>
      <figcaption>Шест области. Един център за пълен AI контрол.</figcaption>
    </figure>
  );
}

function LandingHeader({ onOpenGuide }: { onOpenGuide: (view?: View) => void }) {
  return (
    <>
      <div className="promo-strip"><span>БЪЛГАРСКО ИЗДАНИЕ • v1.0</span><p>Starter {marketConfig.prices.starter} • Pro <b>{marketConfig.prices.pro}</b> • без абонамент</p><a href="#pricing">Сравни пакетите →</a></div>
      <header className="landing-header">
        <a className="landing-logo" href="#top" aria-label="AI CONTROL начало"><BrandMark /></a>
        <nav aria-label="Навигация на продуктовата страница">
          <a href="#system">Системата</a><a href="#fit">За кого е</a><a href="#tools">Инструменти</a><a href="#truth">Какво получаваш</a><a href="#pricing">Цени</a><a href="#faq">FAQ</a>
        </nav>
        <button onClick={() => onOpenGuide("dashboard")}>Разгледай системата <span>→</span></button>
      </header>
    </>
  );
}

function CheckList({ items }: { items: string[] }) {
  return <div className="landing-check-list">{items.map((item) => <p key={item}><i>✓</i><span>{item}</span></p>)}</div>;
}

function PurchaseAction({ kind, className, onPreview, children }: { kind: CheckoutKind; className: string; onPreview: () => void; children: ReactNode }) {
  const url = marketConfig.checkout[kind];
  if (url) return <a className={className} href={url} rel="noreferrer">{children}</a>;
  return <button className={className} onClick={onPreview}>Виж пакета отвътре <span>→</span></button>;
}

export default function LandingPage({ onOpenGuide }: { onOpenGuide: (view?: View) => void }) {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const activeLevel = levelDetails[selectedLevel];

  return (
    <div className="landing-page" id="top">
      <LandingHeader onOpenGuide={onOpenGuide} />

      <main>
        <section className="landing-hero">
          <div className="landing-container landing-hero-grid">
            <div className="landing-hero-copy">
              <p className="landing-kicker"><span /> AI CONTROL™ • Практическа бизнес система • Българско издание</p>
              <h1>От AI хаос<br /><em>до работещ процес.</em></h1>
              <h2>Превърни хаотичното използване на ChatGPT, Gemini, промптове и AI инструменти в ясна система за реален бизнес резултат.</h2>
              <p className="landing-lead">AI CONTROL™ събира на едно място стратегия, готови промптове, Prompt Control™, автоматизации, AI Консултант, ROI и практическа рамка за GDPR &amp; EU AI Act.</p>
              <div className="hero-includes"><span>Стратегия</span><span>Готови промптове</span><span>Prompt Control™</span><span>Автоматизации</span><span>AI Консултант</span><span>ROI</span><span>GDPR &amp; EU AI Act</span></div>
              <p className="landing-no-list"><b>Не е пореден курс.</b><b>Не е AI чат.</b><b>Не е готова automation услуга.</b></p>
              <div className="landing-hero-actions"><button className="landing-btn landing-btn--primary" onClick={() => onOpenGuide("dashboard")}>Разгледай системата <span>→</span></button><a className="landing-btn landing-btn--secondary" href="#pricing">Сравни Starter и Pro</a></div>
              <div className="landing-price-line"><b>от {marketConfig.prices.starter}</b><span>еднократно</span><i /><span>без месечен абонамент</span></div>
            </div>
            <div className="landing-hero-art"><LandingCore /></div>
          </div>
        </section>

        <section className="landing-status" aria-label="Основни компоненти на AI CONTROL">
          <div className="landing-container landing-status-grid">
            {[
              ["Стратегия", "Ясна AI посока", "Къде AI носи реална бизнес стойност.", "↗"],
              ["Prompt Control™", "40 готови промпта", "Маркетинг • Продажби • HR • Стратегия", "◌"],
              ["AI Консултант™", "Локален Brief Builder", "Без API • без изпращане на данни", "⌘"],
              ["GDPR & EU AI Act", "Практическа рамка", "Данни • риск • надзор • правила", "◇"],
            ].map(([label, value, copy, icon]) => <article key={label}><i>{icon}</i><div><span>{label}</span><h3>{value}</h3><p>{copy}</p></div></article>)}
          </div>
        </section>

        <section className="chaos-section" id="system">
          <div className="landing-container chaos-grid">
            <div className="chaos-heading"><p className="landing-kicker"><span /> От AI хаос към AI контрол</p><h2>Не ти трябва още един AI инструмент.<br /><em>Трябва ти система.</em></h2><p>ChatGPT. Gemini. Make. Zapier. AI агенти. Стотици промптове. Десетки абонаменти.</p><p>Инструментите стават повече. Но въпросът остава:</p><blockquote>Как точно AI прави бизнеса ти по-добър?</blockquote></div>
            <div className="chaos-checks">
              <span>AI CONTROL™ ти дава структурата, с която да решиш:</span>
              {["къде AI има реален смисъл", "какво си струва да автоматизираш", "как да получаваш по-добри резултати", "как да изграждаш работещи автоматизации", "как да измерваш реалната възвръщаемост", "как да използваш AI отговорно спрямо GDPR и EU AI Act"].map(item => <p key={item}><i>✓</i>{item}</p>)}
            </div>
          </div>
          <div className="chaos-statement"><span>Спри да използваш AI на случаен принцип.</span><b>Започни да го използваш системно.</b></div>
        </section>

        <section className="fit-section" id="fit">
          <div className="landing-container">
            <div className="landing-section-head"><p className="landing-kicker"><span /> Ясен фокус</p><h2>AI не е сложен -<br /><em>хаосът около него е.</em></h2><p>AI CONTROL™ започва от ежедневната работа, не от технологията. Най-полезен е, когато имаш реални клиентски или вътрешни задачи, но още нямаш общ начин да ги управляваш с AI.</p></div>
            <div className="fit-grid">
              {[
                ["Фрийлансъри", "Оферти, проучване, съдържание, клиентска комуникация и административна рутина."],
                ["Соло експерти", "Консултанти, обучители и специалисти, които превръщат експертизата си в повторяем процес."],
                ["Малки екипи", "Услугови бизнеси, които искат общи промптове, правила за проверка и измерим пилот."],
              ].map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><b>Подходящо ✓</b></article>)}
            </div>
            <aside className="not-for"><span>Не е подходящо, ако:</span><p>очакваш автономен AI агент, готова интеграция „до ключ“, индивидуален правен съвет или гарантиран финансов резултат без собствено внедряване и човешка проверка.</p></aside>
          </div>
        </section>

        <section className="control-preview" id="preview">
          <div className="landing-container">
            <div className="landing-section-head"><p className="landing-kicker"><span /> Твоят AI център за управление</p><h2>Не просто теория.<br /><em>Практическа система за твоя бизнес.</em></h2><p>Всичко необходимо, за да преминеш от експериментиране към системно използване на AI.</p></div>
            <div className="product-window">
              <aside><BrandMark /><p>Център за управление</p>{levels.map(level => <span key={level.id}><i>{String(level.id).padStart(2, "0")}</i>{level.label}</span>)}</aside>
              <div className="product-window-main"><div className="window-status"><span>Система</span><b><i /> Готова</b></div><h3>Твоят бизнес.<br /><em>Твоят AI.</em><br />Твоят контрол.</h3><div className="window-levels">{levels.map(level => <button key={level.id} onClick={() => onOpenGuide(`level-${level.id}` as View)}><i>{level.icon}</i><span>{level.label}</span></button>)}</div><button className="landing-btn landing-btn--primary" onClick={() => onOpenGuide("dashboard")}>Влез в Control Center <span>→</span></button></div>
            </div>
          </div>
        </section>

        <section className="first-win-section">
          <div className="landing-container first-win-landing-grid">
            <div>
              <p className="landing-kicker"><span /> Първи контролиран AI процес</p>
              <h2>От задача до измерим пилот<br /><em>за около 30 минути.</em></h2>
              <p>Не чакаш края на шестте нива. Започваш с един реален процес и преминаваш през целия контролен цикъл.</p>
              <div className="first-win-steps">
                {["Избери повтаряема задача", "Запиши сегашното време или разход", "Създай PCTCO промпт", "Добави човешка проверка", "Измери резултата след пилота"].map((item, index) => <span key={item}><i>{String(index + 1).padStart(2, "0")}</i><b>{item}</b></span>)}
              </div>
              <button className="landing-btn landing-btn--primary" onClick={() => onOpenGuide("first-win")}>Създай първия AI процес <span>→</span></button>
            </div>
            <aside className="first-win-proof">
              <span>Контролен цикъл</span>
              <div><b>BASELINE</b><i>→</i><b>PROMPT</b><i>→</i><b>REVIEW</b><i>→</i><b>RESULT</b></div>
              <blockquote>Не обещаваме магически резултат. Даваме ти процес, с който да го провериш.</blockquote>
              <small>Твоите реални данни са доказателството.</small>
            </aside>
          </div>
        </section>

        <section className="landing-modules" id="tools">
          <div className="landing-container">
            <div className="landing-section-head landing-section-head--center"><p className="landing-kicker"><span /> Системата отвътре</p><h2>Три слоя.<br /><em>Една работеща система.</em></h2><p>Бизнес рамката, локалните инструменти и AI Консултант работят заедно: от първата възможност до измеримия резултат.</p></div>
            <div className="module-grid">
              {productModules.map((module) => (
                <article className="module-card" key={module.number}>
                  <div className="module-card-top"><span>{module.number}</span><i>{module.icon}</i></div>
                  <p className="module-eyebrow">{module.eyebrow}</p><h3>{module.title}</h3><p className="module-lead">{module.lead}</p>
                  <CheckList items={module.items} />
                  <div className="module-status"><i /> {module.status}</div>
                  <button onClick={() => onOpenGuide(module.view)}>Отвори продуктовото превю <span>→</span></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bonus-section" id="bonuses">
          <div className="landing-container">
            <div className="bonus-heading"><div><p className="landing-kicker"><span /> Дигитален бонус пакет</p><h2><em>Включени</em><br />3 практически инструмента.</h2></div><p>Не искаме просто да разбереш AI.<br /><b>Искаме да можеш да започнеш да го прилагаш.</b></p></div>
            <div className="bonus-grid">
              {bonuses.map((bonus) => (
                <article key={bonus.number}>
                  <div className="bonus-number"><span>Бонус {bonus.number}</span><i>{bonus.icon}</i></div><h3>{bonus.title}</h3><h4>{bonus.subtitle}</h4><p>{bonus.copy}</p>
                  <div className="bonus-result"><span>Резултат</span><b>{bonus.result}</b></div><footer><i /> Включен</footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="levels-section" aria-label="Шест нива на AI CONTROL">
          <div className="landing-container">
            <div className="landing-section-head"><p className="landing-kicker"><span /> Системата AI CONTROL™</p><h2>6 нива. <em>Една цел.</em></h2><p>Да превърнеш AI в работещ бизнес процес. Избери ниво, за да видиш какво контролира.</p></div>
            <div className="level-selector" role="tablist" aria-label="Избери ниво">
              {levelDetails.map((level, index) => <button key={level.number} className={selectedLevel === index ? "is-active" : ""} onClick={() => setSelectedLevel(index)} role="tab" aria-selected={selectedLevel === index}><span>{level.number}</span><b>{level.label}</b><i>{levels[index]?.icon}</i></button>)}
            </div>
            <div className="level-detail" role="tabpanel">
              <div><span>Ниво {activeLevel.number} / {activeLevel.label}</span><h3>{activeLevel.title}</h3><p>{activeLevel.copy}</p><button className="landing-btn landing-btn--secondary" onClick={() => onOpenGuide(`level-${selectedLevel + 1}` as View)}>Отвори нивото <span>→</span></button></div>
              <aside><span>Принцип #{activeLevel.number}</span><b>{activeLevel.principle}</b><div><i /> Контрол активен</div></aside>
            </div>
          </div>
        </section>

        <section className="score-section">
          <div className="landing-container score-landing-grid">
            <div><p className="landing-kicker"><span /> AI Control Score</p><h2>Колко подготвен е бизнесът ти за AI?</h2><p>Оцени стратегията, качеството на промптовете, автоматизацията, готовността на екипа, управлението на риска и измерването на ROI.</p><button className="landing-btn landing-btn--primary" onClick={() => onOpenGuide("score")}>Провери моя AI Control Score <span>→</span></button></div>
            <div className="score-dial" aria-hidden="true"><div><span>AI зрелост</span><strong>?</strong><b>/ 100</b></div>{levels.map((level, index) => <i key={level.id} style={{ "--score-node": index } as CSSProperties}>{level.icon}</i>)}</div>
          </div>
        </section>

        <section className="work-statement">
          <div className="landing-container"><p className="landing-kicker"><span /> От знание към изпълнение</p><h2>Не учи AI.<br /><em>Накарай го да работи.</em></h2><p>Не ти трябват още 40 часа теория. Трябва да знаеш:</p><div className="control-formula"><span>Къде</span><i>→</i><span>Как</span><i>→</i><span>С какво</span><i>→</i><span>Защо</span><i>→</i><span>При какъв риск</span><i>→</i><span>С какъв резултат</span></div><b>Това е AI CONTROL™.</b></div>
        </section>

        <section className="truth-section" id="truth">
          <div className="landing-container">
            <div className="landing-section-head landing-section-head--center"><p className="landing-kicker"><span /> Продуктова яснота</p><h2>Знаеш точно<br /><em>какво купуваш.</em></h2><p>Без мъгляви AI обещания. AI CONTROL™ е практическа бизнес система с локални инструменти за самостоятелно внедряване.</p></div>
            <div className="truth-grid">
              <article className="truth-card truth-card--yes"><span>Получаваш</span><h3>Система за действие</h3><CheckList items={["Път за първи контролиран AI процес", "6 контролни нива и практически чеклисти", "PCTCO Prompt Studio", "40 бизнес промпта в Pro", "AI Консултант™: локален Brief Builder", "AI Control Score и ROI Monitor", "Прогрес и работни полета на текущото устройство"]} /></article>
              <article className="truth-card truth-card--no"><span>Не получаваш</span><h3>Фалшив „AI магьосник“</h3><div className="truth-no-list">{["AI чат или автономен агент в сайта", "Готова автоматизация, настроена вместо теб", "Индивидуална правна, данъчна или финансова консултация", "Гарантиран приход или спестено време", "Синхронизация между устройства и екипни профили", "Лиценз за препродажба или споделяне"].map(item => <p key={item}><i>×</i><span>{item}</span></p>)}</div></article>
            </div>
            <div className="data-promise"><span>Локален режим</span><p><b>Въведеното в инструментите не се изпраща към външен AI.</b> Данните и прогресът се пазят в браузъра на текущото устройство. Когато копираш готов промпт в друг AI инструмент, важат неговите условия и настройки за данни.</p></div>
          </div>
        </section>

        <section className="pricing-section" id="pricing">
          <div className="landing-container">
            <div className="landing-section-head landing-section-head--center"><p className="landing-kicker"><span /> Прозрачна оферта</p><h2>Два начина<br /><em>да започнеш.</em></h2><p>Еднократно плащане. Без месечен абонамент. Доживотен достъп до закупеното издание.</p></div>
            <div className="pricing-grid">
              <article className="price-card price-card--starter">
                <div className="price-card-head"><span>AI CONTROL™</span><b>Starter</b></div><h3>Изгради системата.</h3><p>За фрийлансъри и соло експерти, които искат един контролиран процес и ясна основа, преди да добавят библиотека с инструменти.</p>
                <div className="price"><strong>{marketConfig.prices.starter}</strong><span>еднократно</span></div><div className="price-shift"><span>AI хаос</span><i>→</i><b>AI процес</b></div>
                <CheckList items={["Първи контролиран AI процес", "6 практически контролни нива", "Стратегическа и PCTCO рамка", "Рамка за автоматизация", "Човешки и Risk Control™", "AI Control Score и ROI", "Локално запазване на прогреса", "3 дигитални бонуса", "2 Prompt Control™ генерации"]} />
                <div className="package-status"><span><i /> Бизнес система активна</span><span>Prompt Studio: 2 генерации</span><span>Control Library: PRO</span><span>AI Консултант: PRO</span></div>
                <PurchaseAction kind="starter" className="landing-btn landing-btn--secondary" onPreview={() => onOpenGuide("first-win")}>Купи Starter <span>→</span></PurchaseAction><small>{marketConfig.prices.starter} • еднократно • Pro по-късно: +{marketConfig.prices.upgrade}</small>
              </article>
              <article className="price-card price-card--pro">
                <div className="popular-label">Пълен инструментариум</div><div className="price-card-head"><span>AI CONTROL™</span><b>Pro</b></div><h3>Приложи системата.</h3><p>За соло експерти и малки екипи, които искат готови структури, неограничен Prompt Studio и локален brief builder за реални казуси.</p>
                <div className="price"><strong>{marketConfig.prices.pro}</strong><span>еднократно</span></div><div className="price-shift"><span>AI знание</span><i>→</i><b>AI изпълнение</b></div>
                <CheckList items={["Всичко от Starter", "Prompt Control™ без лимит", "40 готови бизнес промпта", "Control Library™", "AI Консултант™: локален Brief Builder", "Пълни ресурси за автоматизация", "3 дигитални бонуса", "Актуализации на текущото издание"]} />
                <div className="package-status package-status--pro"><span><i /> Бизнес система активна</span><span><i /> Prompt Studio без лимит</span><span><i /> Control Library: 40 готови</span><span><i /> AI Консултант: локален</span></div>
                <PurchaseAction kind="pro" className="landing-btn landing-btn--gold" onPreview={() => onOpenGuide("dashboard")}>Купи Pro <span>→</span></PurchaseAction><small>{marketConfig.prices.pro} • еднократно • Starter upgrade: {marketConfig.prices.upgrade}</small>
              </article>
            </div>
            <div className="upgrade-path" aria-label="Надграждане от Starter към Pro">
              <div className="upgrade-path-mark"><BrandMark compact /></div>
              <div><span>Вече имаш Starter?</span><h3>Премини към Pro. Доплащаш само разликата.</h3><p>На същото устройство запазваш локалния си прогрес и отключваш Prompt Studio без лимит, Control Library™ и AI Консултант™.</p></div>
              <div className="upgrade-path-price"><small>Starter → Pro</small><strong>{marketConfig.prices.upgrade}</strong><b>еднократно</b><span className="upgrade-buy">Линкът е в Starter версията</span></div>
            </div>
            {!marketConfig.checkout.starter && <p className="pricing-preview-note">Това е частната финална версия. Покупните бутони ще бъдат активирани след добавяне на трите checkout линка и данните на официалния продавач.</p>}
            <div className="choice-helper"><div><span>Избери Starter, ако:</span><b>„Искам първо да изградя системата.“</b></div><i>или</i><div><span>Избери Pro, ако:</span><b>„Искам системата + инструментите.“</b></div></div>
          </div>
        </section>

        <section className="value-section">
          <div className="landing-container value-grid">
            <div><p className="landing-kicker"><span /> Възвръщаемост</p><h2>Колко струва един твой работен ден?</h2><div className="day-values"><span>€50?</span><span>€100?</span><span>€300?</span></div></div>
            <div><p>А колко време губиш всяка седмица в задачи, които могат да бъдат оптимизирани или автоматизирани?</p><h3>AI CONTROL™ PRO: {marketConfig.prices.pro}</h3><p>Не приемай обещанията ни на доверие. Запиши базовото време, проведи малък пилот и сравни реалната стойност след човешкия преглед.</p><ul><li>Без месечна такса.</li><li>Измерване със собствени данни.</li></ul><button className="landing-btn landing-btn--primary" onClick={() => onOpenGuide("roi")}>Изчисли потенциалния ROI <span>→</span></button></div>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="landing-container faq-grid">
            <div className="faq-heading"><p className="landing-kicker"><span /> Ясно преди старта</p><h2>Често задавани<br /><em>въпроси.</em></h2><p>Всичко важно за достъпа, форматите и двата пакета.</p></div>
            <div className="faq-list">
              {faqItems.map((item, index) => { const isOpen = openFaq === index; return <article key={item.question} className={isOpen ? "is-open" : ""}><button aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : index)}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.question}</b><i>{isOpen ? "−" : "+"}</i></button>{isOpen && <div><p>{item.answer}</p><span><i /> {item.status}</span></div>}</article>; })}
            </div>
          </div>
        </section>

        <section className="final-landing-cta">
          <div className="landing-container"><p className="landing-kicker"><span /> Следващо действие</p><h2>AI хаосът не се решава<br /><em>с още един инструмент.</em></h2><p>Решава се с един процес, който можеш да повториш, провериш и измериш.</p><blockquote>Изгради първия си контролиран AI процес.</blockquote><div className="final-status-row"><span><i /> Процес: избран</span><span><i /> Промпт: контролиран</span><span><i /> AI Консултант: локален</span><span><i /> Човек: финален контрол</span><span><i /> ROI: измерим</span></div><h3>Твоят бизнес.<br />Твоят AI.<br /><em>Твоят контрол.</em></h3><button className="landing-btn landing-btn--gold" onClick={() => onOpenGuide("first-win")}>Създай първия AI процес <span>→</span></button><small>Starter {marketConfig.prices.starter} • Pro {marketConfig.prices.pro} • еднократно</small></div>
        </section>
      </main>

      <footer className="landing-footer"><BrandMark /><p>{marketConfig.edition}</p><span>Практическа бизнес система • данните остават на устройството</span><div><a href="#truth">Продуктова яснота</a><a href="#faq">FAQ</a><a href="#top">Към началото ↑</a></div></footer>
    </div>
  );
}
