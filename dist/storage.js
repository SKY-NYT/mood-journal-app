const STORAGE_KEY = "mood-journal";
function isJournalEntry(value) {
    if (typeof value !== "object" || value === null)
        return false;
    const val = value;
    return (typeof val.id === "string" &&
        typeof val.title === "string" &&
        typeof val.content === "string" &&
        typeof val.mood === "string" &&
        typeof val.timestamp === "number");
}
function isJournal(value) {
    return Array.isArray(value) && value.every(isJournalEntry);
}
function generateId() {
    return crypto.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
export function loadJournal() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
        return [];
    try {
        const parsed = JSON.parse(raw);
        return isJournal(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
}
export function saveJournal(journal) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journal));
}
export function addEntry(input) {
    return {
        id: generateId(),
        title: input.title,
        content: input.content,
        mood: input.mood,
        timestamp: Date.now(),
    };
}
//# sourceMappingURL=storage.js.map