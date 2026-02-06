import {
  renderEntries,
  renderMoodOptions,
  elements,
  setFormForEdit,
  clearForm,
  updateCounter,
  showEmptyState,
  showToast,
} from "./ui.js";
import {
  loadJournal,
  saveJournal,
  addEntry as storageAddEntry,
} from "./storage.js";
import { Mood, JournalEntry, Journal } from "./types.js";



export function findByProperty<T>(
  list: T[],
  key: keyof T,
  value: T[keyof T],
): T | undefined {
  return list.find((item) => item[key] === value);
}

let journal: Journal = loadJournal();

type MoodFilter = "ALL" | Mood;
type SortOrder = "NEWEST" | "OLDEST";
let currentMoodFilter: MoodFilter = "ALL";
let currentSearch = "";
let currentSortOrder: SortOrder = "NEWEST";

function init(): void {
  renderMoodOptions(Object.values(Mood));
  render();

  elements.form.addEventListener("submit", onSubmit);
  elements.cancelEditBtn.addEventListener("click", () =>
    setFormForEdit(undefined),
  );

  elements.entriesList.addEventListener("click", onEntryClick);

 
  elements.filterMoodSelect.addEventListener("change", () => {
    currentMoodFilter = elements.filterMoodSelect.value as MoodFilter;
    render();
  });
  elements.searchInput.addEventListener("input", () => {
    currentSearch = elements.searchInput.value.trim();
    render();
  });
  elements.sortOrderSelect.addEventListener("change", () => {
    currentSortOrder = elements.sortOrderSelect.value as SortOrder;
    render();
  });


  elements.exportBtn.addEventListener("click", () => {
    const data = JSON.stringify(journal, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mood-journal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

 
  elements.importFileInput.addEventListener("change", async () => {
    const file = elements.importFileInput.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = validateJournal(JSON.parse(text));
      if (imported.length === 0) {
        showToast("No valid entries found in the JSON file.");
        return;
      }

      const map = new Map<string, JournalEntry>();
      for (const e of journal) map.set(e.id, e);
      for (const e of imported) map.set(e.id, e);
      journal = Array.from(map.values());

      saveJournal(journal);
      render();
      elements.importFileInput.value = "";
      showToast(
        `Imported ${imported.length} entr${imported.length === 1 ? "y" : "ies"} successfully.`,
      );
    } catch (err) {
      console.error(err);
      showToast(
        "Failed to import JSON. Ensure it’s a valid exported journal file.",
      );
    }
  });
}


function onSubmit(e: SubmitEvent): void {
  e.preventDefault();

  const title = elements.titleInput.value.trim();
  const content = elements.contentInput.value.trim();
  const moodStr = elements.moodSelect.value;

  
  if (!isMood(moodStr)) {
    showToast("Please choose a valid mood.");
    return;
  }

  if (!title || !content) {
    showToast("Title and content are required.");
    return;
  }

  const editingId = elements.editingIdInput.value;

  if (editingId) {
   
    const entry = findByProperty(journal, "id", editingId);
    if (entry) {
      entry.title = title;
      entry.content = content;
      entry.mood = moodStr;
      entry.timestamp = Date.now();

      saveJournal(journal);
      setFormForEdit(undefined); 
      render();
    }
  } else {
    const newEntry = storageAddEntry({ title, content, mood: moodStr });
    journal.push(newEntry);
    saveJournal(journal);
    clearForm();
    render();
  }
}

function onEntryClick(e: MouseEvent): void {
  const t = e.target as HTMLElement;
  const action = t.getAttribute("data-action");
  if (!action) return;

  const li = t.closest<HTMLLIElement>("li.entry");
  if (!li) return;

  const id = li.dataset.id!;
  if (action === "edit") {
    const entry = findByProperty(journal, "id", id);
    if (!entry) return;
    setFormForEdit(entry);
  } else if (action === "delete") {
    if (!confirm("Delete this entry?")) return;
    journal = journal.filter((en) => en.id !== id);
    saveJournal(journal);
    render();
  }
}

function applyFilters(list: Journal): Journal {
  const byMood =
    currentMoodFilter === "ALL"
      ? list
      : list.filter((e) => e.mood === currentMoodFilter);

  const bySearch = currentSearch
    ? byMood.filter((e) => {
        const q = currentSearch.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q)
        );
      })
    : byMood;

  const sorted = [...bySearch].sort((a, b) => {
    return currentSortOrder === "NEWEST"
      ? b.timestamp - a.timestamp
      : a.timestamp - b.timestamp;
  });

  return sorted;
}

function render(): void {
  const filtered = applyFilters(journal);
  renderEntries(filtered);
  updateCounter(filtered.length, journal.length);
  showEmptyState(filtered.length === 0 && journal.length === 0);
}

function isMood(value: string): value is Mood {
  return (Object.values(Mood) as string[]).includes(value);
}

function validateJournal(raw: unknown): Journal {
  if (!Array.isArray(raw)) return [];
  const valid: Journal = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const v = item as Record<string, unknown>;
    const id = v.id;
    const title = v.title;
    const content = v.content;
    const mood = v.mood;
    const timestamp = v.timestamp;

    if (
      typeof id === "string" &&
      typeof title === "string" &&
      typeof content === "string" &&
      typeof mood === "string" &&
      isMood(mood) &&
      typeof timestamp === "number"
    ) {
      valid.push({ id, title, content, mood, timestamp });
    }
  }
  return valid;
}

init();
