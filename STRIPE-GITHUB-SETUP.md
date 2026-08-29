# Stripe + GitHub Pages | launch карта

Този проект използва само GitHub Pages за хостинг и Stripe Payment Links за плащане и пренасочване. Не са нужни API ключ, база данни или backend.

## 1. Публични и клиентски адреси

Замени `<github-user>` и `<repo>` с реалните стойности:

| Роля | URL |
|---|---|
| Публичен landing | `https://<github-user>.github.io/<repo>/landing_page.html` |
| Starter достъп | `https://<github-user>.github.io/<repo>/basic-guide.html` |
| Pro достъп | `https://<github-user>.github.io/<repo>/index.html` |

## 2. Stripe Payment Links

Линковете са централизирани в `components/marketConfig.ts`:

| Оферта | Цена | Success redirect |
|---|---:|---|
| Starter | €19.99 | `basic-guide.html` |
| Pro | €39.99 | `index.html` |
| Starter → Pro | €20.00 | `index.html` |

За всеки Payment Link в Stripe Dashboard:

1. Отвори Payment Links и избери продукта.
2. Отвори настройките за страницата след плащане.
3. Избери пренасочване към собствен сайт.
4. Въведи пълния Success URL от таблицата.
5. Активирай събирането на клиентски имейл и Stripe receipt.
6. Направи тестова покупка преди публичен launch.

## 3. Проверки преди launch

- Landing → Starter checkout отваря продукт за €19.99.
- Landing → Pro checkout отваря продукт за €39.99.
- Успешен Starter тест връща към `basic-guide.html`.
- Starter показва 2 локални Prompt Studio генерации.
- Control Library и Brief Builder са заключени в Starter.
- Upgrade линкът се вижда в Starter, но не и на публичния landing.
- Успешен Upgrade тест връща към `index.html`.
- Успешен Pro тест връща към `index.html`.
- Всички изображения и стилове работят под GitHub repository subpath.
- Mobile checkout и връщането от Stripe са проверени.

## 4. Ограничение на модела

Това е доставка чрез URL, а не удостоверен клиентски достъп. GitHub Pages не може да провери дали посетителят е платил, а Stripe Payment Link не заключва статичния файл. `noindex` само моли търсачките да не индексират страницата; не я прави частна.

Не публикувай Stripe secret key, webhook secret или други чувствителни данни в repository. Този build използва само публичните `buy.stripe.com` адреси.
