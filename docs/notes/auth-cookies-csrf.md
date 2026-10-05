# Заметки: cookies, сессии и CSRF в Rails API + SPA

> Подготовка к ADR-0004 «Аутентификация: cookie-сессии или JWT» (этап 1).
> Источник: разбор вопросов из задачи #3, 2026-10-05.

## 1. Почему в API-режиме Rails нет cookies и сессий

`rails new --api` рассчитан на клиентов, которые **не являются браузером**: другие серверы,
мобильные приложения, CLI-утилиты. Они явно передают токен в каждом запросе
(`Authorization: Bearer ...`), а сервер не хранит состояние между запросами (stateless).
Cookies и сессии таким клиентам не нужны. Лишние middleware — это лишняя работа на каждый
запрос и лишняя поверхность для атак.

Наш главный клиент — **браузер** (React SPA), поэтому часть функциональности возвращаем.

Посмотреть список middleware: `bin/rails middleware`.
В API-режиме отсутствуют `ActionDispatch::Cookies`, `ActionDispatch::Session::CookieStore`,
`ActionDispatch::Flash`. Базовый класс контроллеров — `ActionController::API`
(в нём нет модулей `ActionController::Cookies` и `ActionController::RequestForgeryProtection`).

## 2. Что нужно вернуть для cookie-сессий

Одного middleware `Cookies` недостаточно — это разные слои:

| Слой | Что делает |
|---|---|
| `ActionDispatch::Cookies` | Читает и пишет cookies в HTTP-заголовках |
| `ActionDispatch::Session::CookieStore` | Превращает одну cookie в объект `session`: шифрует, подписывает, проверяет подпись |
| `include ActionController::Cookies` | Даёт метод `cookies` в контроллере |
| `include ActionController::RequestForgeryProtection` | CSRF-защита (см. п. 3) |

Аналогия: `Cookies` — почтовый ящик, `CookieStore` — сейф внутри ящика.

Набросок (реализуем на этапе 1):

```ruby
# config/application.rb
config.middleware.use ActionDispatch::Cookies
config.middleware.use ActionDispatch::Session::CookieStore, key: "_vozrozhdenie_session"
```

Параметры cookie сессии: `HttpOnly` (недоступна из JS), `Secure` (только HTTPS),
`SameSite=Lax` (не отправляется в большинстве межсайтовых запросов).

## 3. Почему cookies требуют CSRF-защиты

**Ключевой факт:** браузер прикладывает cookies к запросу на наш домен **автоматически**,
независимо от того, с какого сайта этот запрос инициирован.

**Сценарий атаки.** Клиентка залогинена на нашем сайте и открывает `evil.com`, где спрятано:

```html
<form action="https://vozrozhdenie.ru/api/v1/appointments/42/cancel" method="POST"></form>
<script>document.forms[0].submit()</script>
```

Браузер отправляет запрос с нашей cookie сессии → сервер видит валидную сессию →
запись отменена. Злоумышленнику не нужно знать cookie: браузер сделал всё сам.

**Как помогает CSRF-токен.** Это секрет, который наша страница получает от сервера и прикладывает
к запросу **явно** (заголовок `X-CSRF-Token`). `evil.com` не может его прочитать:
браузер запрещает одному сайту читать данные другого (Same-Origin Policy).
Запрос без токена или с неверным токеном → сервер отклоняет.

## 4. Сравнение: cookie-сессия против JWT в localStorage

| | Cookie-сессия (`HttpOnly`) | JWT в `localStorage` |
|---|---|---|
| Отправляется браузером автоматически | Да → риск **CSRF** | Нет → CSRF нет |
| Доступен из JavaScript | Нет | Да → кража при **XSS** |
| Чем защищаемся | CSRF-токен + `SameSite` — стандартно и надёжно | Только полным отсутствием XSS — сложно гарантировать |
| Отзыв доступа (logout, бан) | Просто: сессия на сервере / ротация ключа | Сложно: токен валиден до истечения срока |
| Настройка в Rails API | Больше: вернуть middleware, CSRF | Меньше |
| Подходит для мобильных клиентов | Хуже | Лучше |

**Вывод для проекта:** CSRF закрывается стандартным механизмом, а кражу токена при XSS
закрыть гораздо сложнее. Для браузерного SPA на одном домене с API выбираем cookie-сессии.

## 5. Заготовка для ADR-0004

- **Контекст:** главный клиент — браузерный SPA на том же домене, что и API
  (ADR-0002, ADR-0003); храним ПДн и данные о здоровье (152-ФЗ) — цена утечки высокая.
- **Альтернативы:** JWT в `localStorage`; JWT в `HttpOnly`-cookie; cookie-сессии Rails.
- **Последствия (+):** токен недоступен JS; простой logout; встроенные механизмы Rails.
- **Последствия (−):** вернуть middleware и CSRF вручную; для будущего мобильного приложения /
  Mini App понадобится отдельный механизм (токены) — отдельный ADR.

## Ссылки

- [Rails API-only — Choosing Middleware](https://guides.rubyonrails.org/api_app.html#choosing-middleware)
- [Rails Security Guide — CSRF](https://guides.rubyonrails.org/security.html#cross-site-request-forgery-csrf)
- [OWASP — Cross Site Request Forgery](https://owasp.org/www-community/attacks/csrf)
- [MDN — SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value)
