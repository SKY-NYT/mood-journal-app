function qs(selector, parent = document) {
    const element = parent.querySelector(selector);
    if (!element)
        throw new Error(`Element not found: ${selector}`);
    return element;
}
export const elements = {
    form: qs("#entry-form"),
    titleInput: qs("#title"),
    contentInput: qs("#content"),
    moodSelect: qs("#mood"),
    submitBtn: qs("#submitBtn"),
    cancelEditBtn: qs("#cancelEditBtn"),
    editingIdInput: qs("#editingId"),
    entriesList: qs("#entries"),
    filterMoodSelect: qs("#filterMood"),
    searchInput: qs("#search"),
    sortOrderSelect: qs("#sortOrder"),
    exportBtn: qs("#exportBtn"),
    importFileInput: qs("#importFile"),
    counter: qs("#counter"),
    emptyState: qs("#emptyState"),
    formTitle: qs("#form-title"),
};
export function renderMoodOptions(moods) {
    const optionsHtml = moods
        .map(m => `<option value="${m}">${m}</option>`)
        .join("");
    elements.moodSelect.innerHTML = optionsHtml;
    elements.filterMoodSelect.innerHTML = `
    <option value="ALL">All Moods</option>
    ${optionsHtml}
  `;
}
export function renderEntries(entries) {
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
export function updateCounter(filtered, total) {
    elements.counter.textContent = filtered === total
        ? `${total} entr${total === 1 ? "y" : "ies"}`
        : `${filtered} / ${total} entr${total === 1 ? "y" : "ies"} shown`;
}
export function showEmptyState(show) {
    elements.emptyState.hidden = !show;
}
export function clearForm() {
    elements.form.reset();
    elements.editingIdInput.value = "";
    elements.submitBtn.textContent = "Add Entry";
    elements.cancelEditBtn.hidden = true;
    elements.formTitle.textContent = "New Entry";
}
export function setFormForEdit(entry) {
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
function escapeHtml(str) {
    return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container)
        return;
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
//# sourceMappingURL=ui.js.map