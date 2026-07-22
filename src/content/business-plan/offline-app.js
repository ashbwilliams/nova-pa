(function () {
  const dialog = document.querySelector("[data-search-dialog]");
  const input = document.querySelector("[data-search-input]");
  const results = document.querySelector("[data-search-results]");
  const help = document.querySelector("[data-search-help]");
  const index = window.NOVA_SEARCH_INDEX || [];

  function escapeHtml(value) {
    return String(value).replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;" })[c]);
  }

  function openSearch() {
    if (!dialog) return;
    dialog.showModal();
    setTimeout(() => input && input.focus(), 30);
  }

  document.querySelectorAll("[data-search-open]").forEach((button) => button.addEventListener("click", openSearch));
  document.querySelectorAll("[data-search-close]").forEach((button) => button.addEventListener("click", () => dialog.close()));
  if (dialog) dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

  if (input) input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    if (query.length < 2) {
      results.innerHTML = "";
      help.textContent = "Type at least two characters. Search works without an internet connection.";
      return;
    }
    const terms = query.split(/\s+/).filter(Boolean);
    const found = index.map((item) => {
      const haystack = `${item.title} ${item.text}`.toLowerCase();
      const score = terms.reduce((total, term) => total + (item.title.toLowerCase().includes(term) ? 5 : 0) + (haystack.includes(term) ? 1 : 0), 0);
      return { item, score };
    }).filter(({ item, score }) => score > 0 && terms.every((term) => `${item.title} ${item.text}`.toLowerCase().includes(term))).sort((a, b) => b.score - a.score).slice(0, 18);

    help.textContent = `${found.length} result${found.length === 1 ? "" : "s"} shown`;
    results.innerHTML = found.length ? found.map(({ item }) => {
      const lower = item.text.toLowerCase();
      const at = Math.max(0, lower.indexOf(terms[0]) - 80);
      const snippet = item.text.slice(at, at + 220);
      return `<a class="search-result" href="${escapeHtml(item.url)}"><small>${escapeHtml(item.page)}</small><div><h3>${escapeHtml(item.title)}</h3><p>${at ? "…" : ""}${escapeHtml(snippet)}${item.text.length > at + 220 ? "…" : ""}</p></div></a>`;
    }).join("") : '<p class="search-empty">No matching section. Try a broader phrase.</p>';
  });

  document.querySelectorAll("[data-print]").forEach((button) => button.addEventListener("click", () => window.print()));
  document.querySelectorAll("[data-expand-all]").forEach((button) => button.addEventListener("click", () => document.querySelectorAll("details.chapter").forEach((details) => { details.open = true; })));
  document.querySelectorAll("[data-collapse-all]").forEach((button) => button.addEventListener("click", () => document.querySelectorAll("details.chapter").forEach((details) => { details.open = false; })));

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href*="#"]');
    if (!link) return;
    const destination = new URL(link.href, location.href);
    if (destination.pathname !== location.pathname || !destination.hash) return;
    const target = document.getElementById(destination.hash.slice(1));
    const chapter = target && target.closest("details.chapter");
    if (chapter) chapter.open = true;
  });

  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      const chapter = target.closest("details.chapter");
      if (chapter) chapter.open = true;
      setTimeout(() => target.scrollIntoView({ block: "start" }), 50);
    }
  }
})();
