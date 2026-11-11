# React + TypeScript: основы — конспект к задаче #5

> Конспект для Rails-разработчика, который раньше не писал на React.
> Читай по порядку, примеры набирай руками в песочнице, не копируй.
> Подробнее по каждой теме: официальный русский перевод документации — **[ru.react.dev](https://ru.react.dev/learn)**.
> Время: ~3 ч на конспект с примерами, ~3–5 ч на упражнение (оно описано в `docs/sprints/sprint-01.md`, задача #5).

---

## 0. Песочница

Отдельная папка, **не в проекте**:

```bash
npm create vite@latest react-sandbox -- --template react-ts
cd react-sandbox
npm install
npm run dev          # http://localhost:5173, страница обновляется сама при сохранении файла
```

Что важно в созданном проекте:

| Файл | Что это |
|---|---|
| `index.html` | единственная HTML-страница, в ней пустой `<div id="root">` |
| `src/main.tsx` | точка входа: «нарисуй компонент `App` внутри `#root`» |
| `src/App.tsx` | корневой компонент, отсюда и начинай |
| `tsconfig*.json` | настройки TypeScript |

Удали содержимое `App.tsx` и `App.css` и пиши с нуля.

---

## 1. Главная идея: интерфейс — это функция от данных

**В Rails:** запрос → контроллер собирает данные → шаблон рендерится в HTML **один раз** → браузер его показывает. Чтобы что-то изменилось, нужен новый запрос (или Turbo/JS).

**В React:** ты **не меняешь страницу руками** (никаких `document.querySelector(...).classList.add(...)`). Ты описываешь, *как должен выглядеть* интерфейс при данных X. Когда данные меняются, React сам вызывает твою функцию заново и сам вносит в DOM только нужные изменения.

```
данные (state + props)  →  компонент (функция)  →  JSX (описание UI)  →  React обновляет DOM
        ↑                                                                      │
        └──────────────── пользователь кликнул → ты меняешь state ─────────────┘
```

Если запомнишь только одно: **`UI = f(state)`**. Всё остальное следует из этого.

---

## 2. TypeScript: минимум, который нужен

TypeScript — это JavaScript плюс **типы, которые проверяются до запуска** (в редакторе и командой `tsc`). В браузер попадает обычный JS, типы стираются при сборке.

> Rails ↔ TS: ближайшая аналогия — RBS/Sorbet, но в TS-мире типы используют все, и редактор подсказывает по ним всё.

```ts
// примитивы
let title: string = "Классический массаж";
let minutes: number = 60;
let isActive: boolean = true;

// обычно тип выводится сам — писать его не нужно
let price = 2500; // TS уже знает: number

// описание формы объекта
type Master = {
  id: number;
  name: string;
  phone?: string;            // ? — необязательное поле (может быть undefined)
};

// массив объектов
const masters: Master[] = [
  { id: 1, name: "Анна" },
  { id: 2, name: "Олег", phone: "+7 900 000-00-00" },
];

// union: значение — одно из перечисленных
type Status = "pending" | "confirmed" | "cancelled";
let status: Status = "pending";
status = "done"; // ❌ ошибка компиляции: такого варианта нет

// «число или ничего»
let selectedId: number | null = null;

// функция с типами аргументов и результата
function formatPrice(rubles: number): string {
  return `${rubles} ₽`;
}
```

`type` и `interface` для описания объектов почти взаимозаменяемы. В проекте используй `type`, чтобы не путаться.

**Правило проекта:** никакого `any`. `any` выключает проверку типов, и TypeScript перестаёт от чего-либо защищать.

📖 [TypeScript за 5 минут (англ.)](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) · [React + TypeScript](https://ru.react.dev/learn/typescript)

---

## 3. Компоненты и JSX

**Компонент — это функция, которая возвращает разметку.** Имя с большой буквы, иначе React примет его за HTML-тег.

```tsx
function Greeting() {
  return <h1>Добро пожаловать в «Возрождение»</h1>;
}

export default function App() {
  return (
    <main>
      <Greeting />
      <Greeting />
    </main>
  );
}
```

Разметка внутри JS называется **JSX**. Выглядит как HTML, но это JavaScript, поэтому есть отличия:

| HTML | JSX | Почему |
|---|---|---|
| `class="card"` | `className="card"` | `class` — зарезервированное слово в JS |
| `<br>`, `<img ...>` | `<br />`, `<img ... />` | все теги закрываются |
| `onclick="..."` | `onClick={...}` | события в camelCase, передаётся функция, а не строка |
| `style="color: red"` | `style={{ color: "red" }}` | стиль задаётся объектом |
| несколько корневых тегов | один корень или `<>...</>` | функция возвращает одно значение |

**Фигурные скобки `{}`** — «окно в JavaScript» внутри JSX. В них можно поставить любое *выражение* (но не `if` и не `for`):

```tsx
const master = { name: "Анна", experience: 8 };

function MasterInfo() {
  return (
    <p>
      Мастер: {master.name}, стаж {master.experience} лет
      {master.experience > 5 ? " — опытный специалист" : ""}
    </p>
  );
}
```

> Rails ↔ React: `{ ... }` в JSX ≈ `<%= ... %>` в ERB. Компонент ≈ partial, только написанный на JS.

📖 [Описание интерфейса](https://ru.react.dev/learn/describing-the-ui) · [Ваш первый компонент](https://ru.react.dev/learn/your-first-component) · [Разметка с JSX](https://ru.react.dev/learn/writing-markup-with-jsx)

---

## 4. Props — входные данные компонента

**Props** — это аргументы компонента. Родитель передаёт их как атрибуты, компонент получает их одним объектом.

```tsx
type MasterCardProps = {
  name: string;
  experience: number;
  isOnline?: boolean;
};

function MasterCard({ name, experience, isOnline = false }: MasterCardProps) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Стаж: {experience} лет</p>
      {isOnline && <span>Сейчас на связи</span>}
    </div>
  );
}

// использование
<MasterCard name="Анна" experience={8} isOnline />
<MasterCard name="Олег" experience={3} />
```

Что важно:
- `{ name, experience }` в аргументах — это деструктуризация, то есть просто удобная запись для `props.name`, `props.experience`.
- Строки передаются в кавычках, всё остальное (числа, булевы значения, объекты, функции) — в `{}`.
- Если забыть обязательный prop или передать строку вместо числа, **TypeScript подсветит ошибку сразу**. Это главная польза типизации пропсов.
- **Props только для чтения.** Компонент не меняет свои props, как функция не должна менять переданные ей аргументы.

**`children`** — содержимое между открывающим и закрывающим тегом:

```tsx
import type { ReactNode } from "react";

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

<Panel title="Контакты">
  <p>Телефон: ...</p>
</Panel>
```

> Rails ↔ React: `<MasterCard name="Анна" />` ≈ `render "master_card", name: "Анна"`. `children` ≈ `yield` в layout.

📖 [Передача пропсов компоненту](https://ru.react.dev/learn/passing-props-to-a-component)

---

## 5. Условия и списки

### Условный рендер

```tsx
{isOnline && <span>На связи</span>}                  // показать или ничего
{isOnline ? <span>На связи</span> : <span>Офлайн</span>}  // одно из двух
```

Если ветвление сложное, вычисли значение **до** `return` обычным `if`:

```tsx
let badge;
if (experience > 10) badge = "Эксперт";
else if (experience > 3) badge = "Опытный";
else badge = "Новичок";

return <span>{badge}</span>;
```

⚠️ Ловушка: `{count && <p>...</p>}` при `count = 0` выведет на страницу **«0»**. Пиши `{count > 0 && ...}`.

### Списки: `map` + `key`

```tsx
const reviews = [
  { id: 1, author: "Ирина", text: "Отлично!" },
  { id: 2, author: "Пётр", text: "Спина больше не болит" },
];

function ReviewList() {
  return (
    <ul>
      {reviews.map((review) => (
        <li key={review.id}>
          <b>{review.author}:</b> {review.text}
        </li>
      ))}
    </ul>
  );
}
```

**`key` обязателен** для элементов списка. По нему React понимает, какой элемент какой, когда список меняется (фильтр, сортировка, удаление). Используй **стабильный id из данных**. Индекс массива (`index`) не подходит: после фильтрации индексы сдвигаются, и React перепутает элементы.

Фильтр — это обычный JS перед `map`:

```tsx
const positive = reviews.filter((r) => r.rating >= 4);
```

> Rails ↔ React: `reviews.map(...)` ≈ `<% @reviews.each do |r| %>`. `key` ≈ `dom_id(review)`, уникальный идентификатор элемента.

📖 [Условный рендеринг](https://ru.react.dev/learn/conditional-rendering) · [Рендеринг списков](https://ru.react.dev/learn/rendering-lists)

---

## 6. События

```tsx
function BookButton() {
  function handleClick() {
    alert("Скоро здесь будет запись");
  }

  return <button onClick={handleClick}>Записаться</button>;
}
```

⚠️ Самая частая ошибка новичков:

```tsx
<button onClick={handleClick}>    ✅ передаём функцию: React вызовет её при клике
<button onClick={handleClick()}>  ❌ вызываем функцию сразу при рендере
<button onClick={() => select(id)}>  ✅ нужен аргумент — оборачиваем в стрелочную функцию
```

**Передача обработчика ребёнку.** Ребёнок не знает, что делать при клике, он только сообщает родителю: «на меня нажали».

```tsx
type MasterCardProps = {
  name: string;
  onSelect: () => void;   // функция без аргументов, ничего не возвращает
};

function MasterCard({ name, onSelect }: MasterCardProps) {
  return <button onClick={onSelect}>{name}</button>;
}

// у родителя
<MasterCard name="Анна" onSelect={() => console.log("выбрана Анна")} />
```

По соглашению prop называется `onЧтоТо`, а функция у родителя — `handleЧтоТо`.

📖 [Обработка событий](https://ru.react.dev/learn/responding-to-events)

---

## 7. State — память компонента

Обычная переменная внутри компонента **не работает** как память:

```tsx
function Counter() {
  let count = 0;
  return <button onClick={() => { count++; }}>Нажато {count} раз</button>;
  // ❌ число на экране не меняется: React не знает, что надо перерисовать,
  //    а при следующем рендере count снова будет 0
}
```

Для этого есть **state** — хук `useState`:

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  //     ↑ текущее значение  ↑ функция-сеттер    ↑ начальное значение

  return <button onClick={() => setCount(count + 1)}>Нажато {count} раз</button>;
}
```

Вызов `setCount(...)` делает две вещи: сохраняет новое значение **и просит React перерисовать компонент**.

Типизация: обычно тип выводится из начального значения. Если начальное значение `null`, тип указывают явно:

```tsx
const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
```

**Правила хуков** (функций, которые начинаются с `use`):
- вызывать только на верхнем уровне компонента, не внутри `if`, циклов и обработчиков;
- вызывать только внутри компонентов (или других хуков).

**State — это снимок.** Внутри одного рендера `count` — константа. После `setCount(count + 1)` переменная `count` *в этом же обработчике* остаётся старой; новое значение появится при следующем рендере.

```tsx
function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
  // итог: +1, а не +3: все три раза count был одинаковый
}
// если новое значение зависит от предыдущего, передай функцию:
setCount((c) => c + 1); // три таких вызова дадут +3
```

> Rails ↔ React: ближайшая аналогия — данные в `session` для конкретного пользователя: живут между запросами, а у контроллера нет своей памяти между вызовами. Но state живёт в браузере и принадлежит **конкретному экземпляру компонента**: два `<Counter />` на странице считают независимо.

📖 [Добавление интерактивности](https://ru.react.dev/learn/adding-interactivity) · [Состояние: память компонента](https://ru.react.dev/learn/state-a-components-memory) · [Состояние как снимок](https://ru.react.dev/learn/state-as-a-snapshot)

---

## 8. Не мутируй state

React решает «изменилось ли что-то» **по ссылке**: тот же объект или новый (`Object.is(old, new)`). Если поменять объект изнутри, ссылка останется прежней, и React решит, что ничего не изменилось. Экран не обновится, или обновится непредсказуемо.

```tsx
const [masters, setMasters] = useState<Master[]>([]);

// ❌ мутация: тот же массив, React не заметит изменений
masters.push(newMaster);
setMasters(masters);

// ✅ новый массив
setMasters([...masters, newMaster]);
```

Шпаргалка «как сделать то же самое без мутации»:

| Нужно | ❌ мутирует | ✅ создаёт новое |
|---|---|---|
| добавить в массив | `push`, `unshift` | `[...arr, item]` |
| удалить из массива | `splice` | `arr.filter(x => x.id !== id)` |
| заменить элемент | `arr[i] = x` | `arr.map(x => x.id === id ? { ...x, name } : x)` |
| отсортировать | `arr.sort()` | `[...arr].sort(...)` |
| поменять поле объекта | `obj.name = "..."` | `{ ...obj, name: "..." }` |

`...` (spread) копирует содержимое в **новый** массив или объект.

> Rails ↔ React: похоже на Ruby `freeze`. Считай state замороженным и вместо `push` всегда пиши аналог `arr + [item]`.

📖 [Обновление объектов в состоянии](https://ru.react.dev/learn/updating-objects-in-state) · [Обновление массивов в состоянии](https://ru.react.dev/learn/updating-arrays-in-state)

---

## 9. Что такое рендер и когда он происходит

**Рендер** — это React вызывает функцию твоего компонента, чтобы получить свежий JSX. Затем React сравнивает его с предыдущим и меняет в DOM **только разницу**.

Компонент перерисовывается, когда:
1. **изменился его собственный state** (вызван сеттер с новым значением);
2. **перерисовался его родитель**: тогда по умолчанию перерисовываются и все дети, даже если их props не изменились;
3. (позже узнаешь) изменился контекст, на который он подписан.

Изменение обычной переменной, мутация объекта или изменение props «снаружи» без рендера родителя рендер **не** вызывают.

Отсюда правило: **рендер должен быть «чистым»**. Функция компонента только вычисляет JSX из props и state: не меняет внешние переменные, не делает запросов и не трогает DOM. Побочные эффекты делаются в обработчиках событий (или в `useEffect`, но это тема следующих задач).

> В режиме разработки React специально вызывает компоненты **дважды** (`StrictMode` в `main.tsx`), чтобы ловить «грязные» компоненты. Двойной `console.log` — не баг.

📖 [Рендер и фиксация](https://ru.react.dev/learn/render-and-commit) · [Поддержание чистоты компонентов](https://ru.react.dev/learn/keeping-components-pure)

---

## 10. Где хранить state и сколько его нужно

Это самая важная тема для упражнения.

### Храни минимум, остальное вычисляй

Если значение можно **вычислить** из props и state, в state его не кладут.

```tsx
const [reviews] = useState(allReviews);
const [minRating, setMinRating] = useState(0);

// ❌ лишний state: его придётся вручную синхронизировать
const [filteredReviews, setFilteredReviews] = useState(allReviews);

// ✅ вычисляем на каждом рендере, это дёшево
const filteredReviews = reviews.filter((r) => r.rating >= minRating);
```

> Rails ↔ React: как с колонкой в БД — не хранишь `full_name`, если есть `first_name` и `last_name`, а делаешь метод.

### Храни id, а не копию объекта

```tsx
// ❌ копия: если объект в списке изменится, копия устареет
const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);

// ✅ ссылка по id, сам объект находим в списке
const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
const selectedMaster = masters.find((m) => m.id === selectedMasterId);
```

### Подъём состояния (lifting state up)

Если **двум компонентам** нужны одни и те же данные (например, список подсвечивает выбранного мастера, а панель внизу пишет «Вы выбрали: Анна»), state хранится в их **ближайшем общем родителе**. Вниз уходят данные через props, а наверх события через колбэки.

```
            App  ← state: selectedMasterId
          /     \
   MasterList    Summary
   props: masters,        props: master (найденный по id)
          selectedId,
          onSelect(id)
      |
   MasterCard (props: master, isSelected, onSelect)
```

Данные идут **сверху вниз**, события **снизу вверх**. В React нет двусторонней связи: это сделано специально, чтобы всегда было понятно, кто владеет данными.

### Как думать о новом экране («Мыслим как React», 5 шагов)

1. Разбей макет на компоненты (рамкой вокруг каждого блока).
2. Сделай **статичную** версию на props, без state.
3. Найди **минимальный** набор state.
4. Реши, **где** живёт каждый кусок state (ближайший общий родитель).
5. Добавь обратный поток: колбэки, которые меняют state.

Упражнение ниже построено ровно по этим шагам.

📖 [Мыслим как React](https://ru.react.dev/learn/thinking-in-react) · [Выбор структуры состояния](https://ru.react.dev/learn/choosing-the-state-structure) · [Совместное использование состояния](https://ru.react.dev/learn/sharing-state-between-components)

---

## 11. Шпаргалка Rails ↔ React

| Rails | React | Отличие |
|---|---|---|
| partial | компонент | рендерится в браузере многократно, а не один раз на сервере |
| locals partial-а | props | типизированы, только для чтения |
| `<%= %>` | `{ }` в JSX | внутри — JS-выражение |
| `each` в шаблоне | `array.map(...)` | нужен `key` |
| `dom_id(record)` | `key={item.id}` | |
| `yield` в layout | `children` | |
| `session` / инстанс-переменные | state (`useState`) | живёт в браузере, у каждого экземпляра компонента свой |
| метод модели вместо колонки | вычисляемое значение вместо state | |
| форма → POST → redirect | событие → `setState` → перерисовка | без запроса на сервер |

---

## 12. Частые ошибки

| Симптом | Причина |
|---|---|
| Экран не обновляется после клика | мутация state (`push`, `obj.x = ...`) или изменение обычной переменной вместо state |
| Функция срабатывает сразу при загрузке | `onClick={fn()}` вместо `onClick={fn}` |
| Warning: Each child in a list should have a unique "key" | нет `key` в `map` |
| «Too many re-renders» | сеттер вызывается прямо в теле компонента (например, `onClick={setX(1)}`) |
| На странице появился «0» | `{count && ...}` при `count = 0` |
| Значение после `setX` в том же обработчике старое | state — снимок, новое значение будет при следующем рендере |

---

## 13. Вопросы для самопроверки

Ответь своими словами, прежде чем браться за упражнение. Первые пять входят в критерии приёмки задачи #5.

1. Чем props отличаются от state?
2. Почему нельзя мутировать state напрямую?
3. Что вызывает повторный рендер компонента?
4. Почему отфильтрованный список не нужно хранить в state?
5. Почему выбранную услугу лучше хранить как `id`, а не как объект?
6. Почему `key={index}` — плохая идея для списка с фильтром?
7. Чем `onClick={handle}` отличается от `onClick={handle()}`?
