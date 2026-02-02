
import type { JournalEntry } from "./types.js";
import { Mood } from "./types.js";

type Elements = {
  form: HTMLFormElement;
  titleInput: HTMLInputElement;
  contentInput: HTMLTextAreaElement;
  moodSelect: HTMLSelectElement;
  submitBtn: HTMLButtonElement;
  cancelEditBtn: HTMLButtonElement;
  editingIdInput: HTMLInputElement;

  entriesList: HTMLUListElement;
  filterMoodSelect: HTMLSelectElement;
  searchInput: HTMLInputElement;
  sortOrderSelect: HTMLSelectElement;
  exportBtn: HTMLButtonElement;
  importFileInput: HTMLInputElement;

  counter: HTMLElement;
  emptyState: HTMLElement;
  formTitle: HTMLElement;
};

function qs<T extends Element>(selector: string, parent: Document | Element = document): T {
  const element = parent.querySelector<T>(selector);
  if (!element) throw new Error(`Element not found: ${selector}`);
  return element;
}

export const elements: Elements = {
  form: qs<HTMLFormElement>("#entry-form"),
  titleInput: qs<HTMLInputElement>("#title"),
  contentInput: qs<HTMLTextAreaElement>("#content"),
  moodSelect: qs<HTMLSelectElement>("#mood"),
  submitBtn: qs<HTMLButtonElement>("#submitBtn"),
  cancelEditBtn: qs<HTMLButtonElement>("#cancelEditBtn"),
  editingIdInput: qs<HTMLInputElement>("#editingId"),

  entriesList: qs<HTMLUListElement>("#entries"),
  filterMoodSelect: qs<HTMLSelectElement>("#filterMood"),
  searchInput: qs<HTMLInputElement>("#search"),
  sortOrderSelect: qs<HTMLSelectElement>("#sortOrder"),
  exportBtn: qs<HTMLButtonElement>("#exportBtn"),
  importFileInput: qs<HTMLInputElement>("#importFile"),

  counter: qs<HTMLElement>("#counter"),
  emptyState: qs<HTMLElement>("#emptyState"),
  formTitle: qs<HTMLElement>("#form-title"),
};

export function renderMoodOptions(moods: Mood[]): void {
  
  const optionsHtml = moods
    .map(m => `<option value="${m}">${m}</option>`)
    .join("");


  elements.moodSelect.innerHTML = optionsHtml;

  
  
  elements.filterMoodSelect.innerHTML = `
    <option value="ALL">All Moods</option>
    ${optionsHtml}
  `;
}

export function renderEntries(entries: JournalEntry[]): void {
  elements.entriesList.innerHTML = entries.map(entry => {
    const dt = new Date(entry.timestamp);
    const timeFmt = `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`;

    return `
      <li class="entry" data-id="${entry.id}">
        <div class="entry-header">
          <h3 class="entry-title">${escapeHtml(entry.title)}</h3>
          <div class="entry-meta">
            <span class="badge" data-mood="${entry.mood}">${entry.mood}</span>
            <span>•</span>
            <time datetime="${dt.toISOString()}">${timeFmt}</time>
          </div>
        </div>
        <p class="entry-content">${escapeHtml(entry.content)}</p>
        <div class="entry-actions">
          <button class="ghost" type="button" data-action="edit">Edit</button>
          <button class="danger" type="button" data-action="delete">Delete</button>
        </div>
      </li>
    `;
  }).join("");
}

export function updateCounter(filtered: number, total: number): void {
  elements.counter.textContent = filtered === total
    ? `${total} entr${total === 1 ? "y" : "ies"}`
    : `${filtered} / ${total} entr${total === 1 ? "y" : "ies"} shown`;
}

export function showEmptyState(show: boolean): void {
  elements.emptyState.hidden = !show;
}

export function clearForm(): void {
  elements.form.reset();
  elements.editingIdInput.value = "";
  elements.submitBtn.textContent = "Add Entry";
  elements.cancelEditBtn.hidden = true;
  elements.formTitle.textContent = "New Entry";
}

export function setFormForEdit(entry: JournalEntry | undefined): void {
  if (!entry) {
    clearForm();
    return;
  }
  elements.editingIdInput.value = entry.id;
  elements.titleInput.value = entry.title;
  elements.contentInput.value = entry.content;
  elements.moodSelect.value = entry.mood;
  elements.submitBtn.textContent = "Update Entry";
  elements.cancelEditBtn.hidden = false;
  elements.formTitle.textContent = "Edit Entry";
}


function escapeHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
export function showToast(message: string, type: 'success' | 'danger' = 'success'): void {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  
  
  const icon = type === 'success' ? '✅' : '🗑️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);


  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}