import type { Journal, JournalEntry} from "./types.js";

const STORAGE_KEY = "mood-journal";


function isJournalEntry(value: unknown): value is JournalEntry {
  if (typeof value !== "object" || value === null) return false;
  const val = value as Record<string, unknown>;
  return (
    typeof val.id === "string" &&
    typeof val.title === "string" &&
    typeof val.content === "string" &&
    typeof val.mood === "string" && 
    typeof val.timestamp === "number"
  );
}

function isJournal(value: unknown): value is Journal {
  return Array.isArray(value) && value.every(isJournalEntry);
}

function generateId(): string {
  return crypto.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function loadJournal(): Journal {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);

    return isJournal(parsed) ? (parsed as Journal) : [];
  } catch {
    return [];
  }
}

export function saveJournal(journal: Journal): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(journal));
}


export function addEntry(input: Pick<JournalEntry, 'title' | 'content' | 'mood'>): JournalEntry {
  return {
    id: generateId(),
    title: input.title,
    content: input.content,
    mood: input.mood,
    timestamp: Date.now(),
  };
}