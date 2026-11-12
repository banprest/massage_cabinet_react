# Возрождение

Сайт массажного кабинета для записи и личного кабинета клиента и удобство мастера

## Возможности (план)

- Онлайн-запись на свободное время мастера
- Личный кабинет клиента: мои записи, отмена, история визитов
- Кабинет мастера: расписание, база клиентов, подтверждение записей
- Напоминания о записи в Telegram и по email
- Отзывы клиентов

## Стек

Ruby 4.0+, Rails 8 в режиме API, PostgreSQL / React + TypeScript, React Router, Vitest / Docker Compose (Postgres) + нативный запуск Rails и Vite, GitHub Actions, Kamal 2

## Документация

[CLAUDE.md](CLAUDE.md), [docs/roadmap.md](docs/roadmap.md)

## Запуск для разработки

### Требования

- Ruby (версия — `backend/.ruby-version`)
- Node.js (версия — `frontend/.nvmrc`, удобно через nvm: `nvm use`)
- Docker (для PostgreSQL)

### Бэкенд

```bash
cd ~/massage_cabinet_react
docker compose up -d # PostgreSQL
cd backend
bundle install
bin/rails db:prepare
bin/rails server
```

### Фронтенд

```bash
cd ~/massage_cabinet_react/frontend
nvm use
npm install
npm run dev
```

запросы /api проксируются в Rails на :3000, поэтому бэкенд должен быть запущен

### Проверки фронтенда

| Команда                | Что делает                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `npm run lint`         | проверка линтера и поиск подозрительного кода                                        |
| `npm run typecheck`    | проверка типов                                                                       |
| `npm test`             | запуск тестов                                                                        |
| `npm run format`       | команда для поддержки единого стиля в проекте выравнивает отступы правит стиль и т.д |
| `npm run build`        | проверяет типы и собирает приложение в dist/                                         |
| `npm run format:check` | проверка которая показывает расхожение в стиле                                       |
