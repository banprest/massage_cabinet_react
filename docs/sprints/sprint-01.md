# Спринт 1 (этап 0) — Фундамент и walking skeleton

**Длительность:** 2 недели (~40 ч).
**Цель спринта:** открываешь `https://<домен>` — React-страница показывает «API: ok, DB: ok».
Ответ пришёл из Rails API, который сходил в PostgreSQL. Всё задеплоено через Kamal, CI зелёный.
Фич пока нет, но каждая следующая фича пойдёт по готовым рельсам.

```
Неделя 1: #1 → #2 → #3 → #4 → #5 (React-обучение можно параллельно)
Неделя 2: #6 → #7 → #8 → #9 → #10
```

Каждая задача — отдельный GitHub Issue, отдельная ветка и PR (кроме #1).

---

## #1 Репозиторий, доска и шаблоны
**Цель:** у проекта есть дом и процесс, по которому идёт вся дальнейшая работа.

**Что сделать**
- Создать репозиторий (можно приватный, перед портфолио откроешь), структура: `backend/`, `frontend/`, `docs/adr/`, `docs/sprints/`
- Положить `CLAUDE.md` в корень, `docs/roadmap.md`, этот файл
- `README.md`: что за проект, стек, как запустить (пока заглушка)
- GitHub Project (доска: Backlog → Ready → In Progress → Review → Done), заведи задачи этого спринта как Issues
- Шаблоны `.github/ISSUE_TEMPLATE/task.md` (по шаблону из CLAUDE.md) и `.github/pull_request_template.md` (что сделано, как проверить, чек-лист DoD)
- Защита ветки `main`: merge только через PR, обязательный зелёный CI (включишь после #8)

**Критерии приёмки:** доска с задачами спринта; новый Issue открывается с шаблоном.
**Чему научишься:** GitHub Projects, шаблоны, branch protection.
**Ссылки:** [GitHub Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects) · [Issue templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests)
**Оценка:** 2 ч

---

## #2 ADR-0001 и ADR-0002
**Цель:** зафиксировать ключевые решения, чтобы через полгода помнить, почему так.

**Что сделать**
- `docs/adr/0001-record-architecture-decisions.md` — почему ведём ADR и в каком формате
- `docs/adr/0002-rails-api-and-react-spa-monorepo.md` — Rails API + React SPA в монорепо. Опиши альтернативы (Rails + Inertia, Hotwire, два репозитория) и **последствия**: что становится сложнее (CORS/cookie, два тулчейна, контракт API)

**Критерии приёмки:** в обоих ADR есть разделы «Контекст / Решение / Альтернативы / Последствия». Пришли мне PR на ревью.
**Чему научишься:** аргументировать архитектурные решения — навык, который отличает сеньора.
**Ссылки:** [Michael Nygard — Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) · [adr.github.io](https://adr.github.io/)
**Оценка:** 2 ч

---

## #3 Rails 8 API-приложение и окружение разработки
**Цель:** бэкенд запускается одной командой, тестовая и линтерная инфраструктура на месте.

**Что сделать**
- `rails new backend --api -d postgresql -T` (Ruby 3.4+, Rails 8.x)
- `compose.yml` в корне: только PostgreSQL (версия как на проде, например 17) с volume. Rails запускаешь нативно
- RSpec + FactoryBot + shoulda-matchers; удалить остатки minitest
- Проверить, что сгенерировались `rubocop-rails-omakase` и `brakeman`; добавить `rubocop-rspec`, `bundler-audit`
- Разобраться, что Rails 8 сгенерировал «из коробки»: `Dockerfile`, `config/deploy.yml`, `.github/workflows/ci.yml`, `bin/` — запиши себе, что есть что
- Часовой пояс: `config.time_zone = "Europe/Moscow"`

**Критерии приёмки:** `docker compose up -d && bin/rails db:prepare && bundle exec rspec && bin/rubocop && bin/brakeman` — всё зелёное.
**Чему научишься:** чем API-режим Rails отличается от обычного (какие middleware выключены и почему).
**Ссылки:** [Rails API-only apps](https://guides.rubyonrails.org/api_app.html) · [rspec-rails](https://github.com/rspec/rspec-rails) · [Docker Compose](https://docs.docker.com/compose/)
**Оценка:** 4 ч

> 💡 Вопрос на подумать перед стартом: почему в API-режиме по умолчанию нет cookies и сессий, и что нам придётся вернуть для нашей схемы аутентификации? (Пригодится на этапе 1.)

---

## #4 Health-эндпоинт и OpenAPI через rswag
**Цель:** первый эндпоинт, документированный контрактом, из которого фронт получит типы.

**Что сделать**
- Неймспейс `Api::V1`, `GET /api/v1/health` → `{ status: "ok", db: "ok", version: "<git sha>" }`. Для `db` — реальная проверка соединения с БД
- rswag (`rswag-api`, `rswag-ui`, `rswag-specs`): request spec для health, генерация `swagger/v1/openapi.yaml`
- Swagger UI по `/api-docs` (только в development)
- Чем отличается от встроенного `/up` в Rails 8? Оставь оба и объясни в PR, зачем каждый

**Критерии приёмки:** spec проходит, `rake rswag:specs:swaggerize` генерирует YAML, UI открывается.
**Чему научишься:** API-first подход, OpenAPI как контракт между фронтом и бэком.
**Ссылки:** [rswag](https://github.com/rswag/rswag) · [OpenAPI Specification](https://swagger.io/specification/)
**Оценка:** 3 ч

---

## #5 📚 React: основы (обучающая задача)
**Цель:** прежде чем строить фронт проекта, понять ментальную модель React.

**Что сделать** — в отдельной песочнице, не в проекте:
- Пройти на react.dev: [Quick Start](https://react.dev/learn), [Tutorial: Tic-Tac-Toe](https://react.dev/learn/tutorial-tic-tac-toe), [Thinking in React](https://react.dev/learn/thinking-in-react)
- Прочитать разделы: [Describing the UI](https://react.dev/learn/describing-the-ui), [Adding Interactivity](https://react.dev/learn/adding-interactivity), [Managing State](https://react.dev/learn/managing-state)
- Пройти [TypeScript for JS programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) и [React + TypeScript](https://react.dev/learn/typescript)
- **Упражнение:** на React + TS сделай статичный прайс массажного кабинета — список услуг (название, длительность, цена) из массива, фильтр по длительности, «выбрать услугу» → выбранная подсвечивается. Без бэкенда

**Критерии приёмки:** код упражнения в gist или отдельном репо — пришли на ревью; ответь своими словами:
1. Чем props отличаются от state?
2. Почему нельзя мутировать state напрямую?
3. Что вызывает повторный рендер компонента?

**Чему научишься:** компоненты, JSX, props, state, рендер, типизация пропсов.
**Rails ↔ React:** компонент ≈ partial с локальными переменными (props), но partial рендерится один раз на сервере, а компонент перерисовывается в браузере при изменении state.
**Оценка:** 6–8 ч

---

## #6 React-приложение: каркас и инструменты
**Цель:** фронтенд с тем же уровнем инженерной культуры, что и бэкенд.

**Что сделать**
- `npm create vite@latest frontend -- --template react-ts`
- ESLint (flat config, уже от Vite) + Prettier, скрипты `lint`, `typecheck` (`tsc --noEmit`), `format`
- Vitest + Testing Library + один тест на компонент `App`
- Tailwind CSS (плагин `@tailwindcss/vite`)
- React Router: две страницы — `/` и `/status`
- Vite dev-proxy: запросы на `/api` → `http://localhost:3000` (почему proxy, а не CORS — объясни в PR)
- Абсолютные импорты `@/…`

**Критерии приёмки:** `npm run lint && npm run typecheck && npm test && npm run build` — зелёные.
**Чему научишься:** тулчейн фронтенда — что делают Vite, ESLint, TSC и чем они отличаются друг от друга.
**Ссылки:** [Vite](https://vite.dev/guide/) · [Vitest](https://vitest.dev/guide/) · [Tailwind + Vite](https://tailwindcss.com/docs/installation/using-vite) · [React Router](https://reactrouter.com/start/declarative/installation) · [Vite server.proxy](https://vite.dev/config/server-options#server-proxy)
**Оценка:** 4 ч

---

## #7 Фронт ↔ API: типы из OpenAPI и TanStack Query
**Цель:** замкнуть цепочку — страница `/status` показывает данные из Rails, типизированные по контракту.

**Что сделать**
- `openapi-typescript`: скрипт `npm run api:types` генерирует `src/api/schema.d.ts` из `backend/swagger/v1/openapi.yaml`
- HTTP-клиент: `openapi-fetch` (типизированный fetch по схеме)
- TanStack Query: `QueryClientProvider`, хук `useHealth()`
- `/status`: состояния loading / error / success
- Тест: компонент с замоканным ответом (MSW или мок клиента)

**Критерии приёмки:** при работающем Rails `/status` показывает «API: ok, DB: ok»; при остановленном — понятную ошибку. Если поменять поле в OpenAPI и перегенерировать типы, TypeScript ругается на старое использование.
**Чему научишься:** серверное состояние против клиентского, зачем нужен TanStack Query вместо `useEffect + fetch`.
**Rails ↔ React:** TanStack Query для фронта — примерно как кэш Rails (`Rails.cache.fetch`) + автоматическая инвалидация.
**Ссылки:** [openapi-typescript](https://openapi-ts.dev/introduction) · [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) · [TanStack Query — Overview](https://tanstack.com/query/latest/docs/framework/react/overview) · [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
**Оценка:** 4 ч

---

## #8 CI в GitHub Actions
**Цель:** ни один PR не сломает `main` незаметно.

**Что сделать**
- `.github/workflows/ci.yml` в **корне** (сгенерированный Rails-ом в `backend/` в монорепо не сработает — разберись почему)
- Job `backend`: сервис PostgreSQL, `rspec`, `rubocop`, `brakeman`, `bundler-audit`
- Job `frontend`: `npm ci`, `lint`, `typecheck`, `test`, `build`
- Фильтр по путям: изменения только во `frontend/` не гоняют backend-тесты (и наоборот)
- Проверка, что `openapi.yaml` актуален (сгенерировать заново и сравнить через `git diff --exit-code`)
- Включить обязательный CI в branch protection

**Критерии приёмки:** PR с упавшим тестом нельзя смёрджить.
**Чему научишься:** GitHub Actions — jobs, services, кэширование зависимостей, path filters.
**Ссылки:** [GitHub Actions — Quickstart](https://docs.github.com/en/actions/writing-workflows/quickstart) · [Service containers: PostgreSQL](https://docs.github.com/en/actions/use-cases-and-examples/using-containerized-services/creating-postgresql-service-containers) · [ruby/setup-ruby](https://github.com/ruby/setup-ruby) · [paths filter](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)
**Оценка:** 4 ч

---

## #9 Подготовка VPS и домен
**Цель:** безопасный сервер, готовый принять Kamal.

**Что сделать**
- **Купить домен** (нужен для SSL от Let's Encrypt). Придумать латинское написание «Возрождения». DNS: A-запись на IP сервера
- Ubuntu 24.04: обновления, пользователь с sudo, вход только по SSH-ключу, отключить вход root и пароли
- Firewall (ufw): открыть 22, 80, 443
- fail2ban, автоматические security-обновления (unattended-upgrades)
- Swap 2 ГБ, если RAM ≤ 2 ГБ
- Docker Kamal поставит сам при первом `kamal setup`, вручную не обязательно

**Критерии приёмки:** `ssh deploy@<домен>` работает по ключу; вход root и вход по паролю отклоняются; `ufw status` показывает только 22/80/443.
**Чему научишься:** базовый hardening Linux-сервера.
**Ссылки:** [Kamal — Installation](https://kamal-deploy.org/docs/installation/) · [DigitalOcean: Initial Server Setup with Ubuntu](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu) · [ufw](https://help.ubuntu.com/community/UFW)
**Оценка:** 3 ч

---

## #10 Деплой через Kamal + ADR-0003
**Цель:** walking skeleton живёт на проде по HTTPS. Главная задача спринта.

**Сначала решение (ADR-0003 «Как отдаём фронтенд»):**
- **A.** Multi-stage Dockerfile собирает фронт и кладёт `dist/` в `public/` Rails; Rails (через Thruster) отдаёт статику, все не-API пути → `index.html`. Один контейнер, один origin
- **B.** Фронт в отдельном контейнере (nginx), маршрутизация в kamal-proxy по пути
- **C.** Фронт на CDN/статическом хостинге, API на поддомене

Я рекомендую **A** для нашего масштаба: один origin — cookie и CSRF без CORS, один деплой. Но решение принимаешь ты, после сравнения в ADR.

**Что сделать (для варианта A)**
- Multi-stage `Dockerfile`: стадия Node собирает фронт → стадия Ruby собирает Rails → копируем `dist/` в `public/`
- SPA fallback: не-API GET-запросы, не найденные среди статики, отдают `index.html`
- `config/deploy.yml`: сервер, `proxy` с `host` и `ssl: true`, PostgreSQL как accessory (с volume!)
- Секреты: `.kamal/secrets` (без коммита значений), `RAILS_MASTER_KEY`, пароль БД
- Registry: GitHub Container Registry (ghcr.io)
- `kamal setup`, затем `kamal deploy`
- Опционально: деплой из GitHub Actions по merge в `main` (можно оставить на этап 1)

**Критерии приёмки:** `https://<домен>/status` → «API: ok, DB: ok»; `https://<домен>/up` → 200; после `kamal app boot`/рестарта сервера данные БД на месте; в README раздел «Деплой».
**Чему научишься:** контейнеризация, multi-stage сборка, Kamal 2 (proxy, accessories, secrets), и чем это отличается от Capistrano.
**Rails ↔ Capistrano:** Capistrano доставляет код на сервер, где уже стоит окружение (Ruby, gems). Kamal доставляет готовый образ, в котором окружение уже собрано. Сервер — просто Docker-хост.
**Ссылки:** [Kamal docs](https://kamal-deploy.org/docs/) · [Kamal proxy](https://kamal-deploy.org/docs/configuration/proxy/) · [Kamal accessories](https://kamal-deploy.org/docs/configuration/accessories/) · [Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/) · [Thruster](https://github.com/basecamp/thruster)
**Оценка:** 8 ч

---

## Итог спринта — демо и ретро
- Демо: открыть сайт с телефона, показать `/status`, сделать PR с изменением текста → CI → merge → деплой
- Ретро (письменно, 3 пункта): что получилось, что было сложно, что улучшить. Пришли мне — скорректируем план и оценки этапа 1
