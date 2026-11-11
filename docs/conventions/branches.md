# Именование веток

## Формат

```
<тип>/<номер-issue>-<кратко-о-чём>
```

Пример: `feat/4-health-endpoint`

## Типы

Те же, что в Conventional Commits, чтобы ветка, коммиты и PR говорили на одном языке.

| Тип | Когда | Пример |
|---|---|---|
| `feat` | Новая функциональность | `feat/4-health-endpoint` |
| `fix` | Исправление бага | `fix/31-slot-timezone` |
| `docs` | Документация, README, ADR | `docs/2-adr-architecture` |
| `chore` | Настройка, зависимости, рутина | `chore/3-rails-api-setup` |
| `ci` | GitHub Actions, деплой | `ci/8-github-actions` |
| `refactor` | Переделка без изменения поведения | `refactor/40-booking-service` |
| `test` | Только тесты | `test/22-appointment-specs` |

## Правила

- **Номер issue обязателен.** Сразу видно, к какой задаче относится ветка.
- **Описание — 2–4 слова латиницей**, строчными буквами, через дефис.
- **Без кириллицы, пробелов и заглавных** — они ломаются в терминале, CI и URL.
- **Одна ветка — одна задача.** Захотелось поправить что-то постороннее — отдельная задача и ветка.
- **Ветка живёт до merge**, потом удаляется.

## Жизненный цикл ветки

```bash
# 1. Начать задачу — всегда от свежего main
git switch main
git pull
git switch -c feat/4-health-endpoint

# 2. Работать, коммитить
git add <файлы>
git commit -m "feat(backend): add health endpoint"

# 3. Отправить на GitHub и открыть PR
git push            # с push.autoSetupRemote=true флаг -u не нужен

# 4. После Squash and merge — уборка
git switch main
git pull
git fetch --prune
git branch -d feat/4-health-endpoint
```

## Ловушки

| Ситуация | Что делать |
|---|---|
| Кнопка **Create a branch** в Issue на GitHub | Предлагает имя из заголовка задачи — на кириллице. Исправь вручную в окне создания. |
| Забыл создать ветку, изменения **не закоммичены** | `git switch -c <ветка>` — изменения переедут с тобой. |
| Забыл создать ветку, **закоммитил в main** | `git switch -c <ветка>` → `git push` → `git branch -f main origin/main`. |
| `git branch -d` ругается `not fully merged` | После Squash and merge это нормально: коммиты в main другие. Проверь, что PR смёрджен, и удали через `git branch -D`. |
| `has no upstream branch` при push | `git push -u origin <ветка>` или один раз `git config --global push.autoSetupRemote true`. |

## Полезные настройки (один раз)

```bash
git config --global push.autoSetupRemote true   # первый push сам создаёт ветку на GitHub
git config --global init.defaultBranch main      # новые репозитории сразу с main
```

GitHub: **Settings → General → Automatically delete head branches** — удаляет ветку на GitHub после merge.
