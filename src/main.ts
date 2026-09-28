type Task = { id: string; title: string; done: boolean; createdAt: number };
const STORAGE_KEY = "dayboard.tasks.v1";
function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error("DayBoard is missing page element " + selector + ".");
  return element;
}
const form = requiredElement<HTMLFormElement>("#task-form");
const input = requiredElement<HTMLInputElement>("#task-input");
const list = requiredElement<HTMLUListElement>("#task-list");
const filter = requiredElement<HTMLSelectElement>("#filter");
const emptyState = requiredElement<HTMLParagraphElement>("#empty-state");
const taskCount = requiredElement<HTMLParagraphElement>("#task-count");
function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is Task =>
      typeof item === "object" && item !== null && typeof item.id === "string" &&
      typeof item.title === "string" && typeof item.done === "boolean" && typeof item.createdAt === "number");
  } catch { return []; }
}
let tasks = loadTasks();
function saveTasks(): void { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
function render(): void {
  list.replaceChildren();
  const mode = filter.value;
  const visible = tasks.filter((task) =>
    mode === "all" || (mode === "open" && !task.done) || (mode === "done" && task.done));
  visible.forEach((task) => {
    const row = document.createElement("li");
    row.className = task.done ? "task done" : "task";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox"; checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Mark " + task.title + " as " + (task.done ? "to do" : "complete"));
    checkbox.addEventListener("change", () => { task.done = checkbox.checked; saveTasks(); render(); });
    const title = document.createElement("span");
    title.className = "task-title"; title.textContent = task.title;
    const remove = document.createElement("button");
    remove.type = "button"; remove.className = "delete"; remove.textContent = "Remove";
    remove.setAttribute("aria-label", "Remove " + task.title);
    remove.addEventListener("click", () => { tasks = tasks.filter((item) => item.id !== task.id); saveTasks(); render(); });
    row.append(checkbox, title, remove); list.append(row);
  });
  const openCount = tasks.filter((task) => !task.done).length;
  taskCount.textContent = openCount + " to do · " + tasks.length + " total";
  emptyState.hidden = visible.length > 0;
  if (visible.length === 0) emptyState.textContent =
    tasks.length === 0 ? "A clear page is a good place to start." : "No tasks in this view.";
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  tasks.unshift({ id: crypto.randomUUID(), title, done: false, createdAt: Date.now() });
  saveTasks(); input.value = ""; render(); input.focus();
});
filter.addEventListener("change", render);
render();
