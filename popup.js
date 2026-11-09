const TIP_URL = ""; // paste your tip page URL (e.g. Buy Me a Coffee / Ko-fi) to show the link
const PRESETS_KEY = "presets";
const DEFAULTS = { enabled: true, reduction: 100, hiddenSelectors: [] };

const enabled = document.querySelector("#enabled");
const reduction = document.querySelector("#reduction");
const reductionValue = document.querySelector("#reductionValue");
const site = document.querySelector("#site");
const status = document.querySelector("#status");
const statusDot = document.querySelector("#statusDot");
const scan = document.querySelector("#scan");
const picker = document.querySelector("#picker");
const reset = document.querySelector("#reset");
const shortcutHint = document.querySelector("#shortcutHint");
const presetForm = document.querySelector("#presetForm");
const presetName = document.querySelector("#presetName");
const presetList = document.querySelector("#presetList");
const tip = document.querySelector("#tip");

let tab;
let host;
let settings;

async function activeTab() {
  const [current] = await chrome.tabs.query({ active: true, currentWindow: true });
  return current;
}

async function send(type, extra = {}) {
  if (!tab?.id) return null;
  try {
    return await chrome.tabs.sendMessage(tab.id, { type, ...extra });
  } catch {
    showStatus("Unavailable on this page", false);
    return null;
  }
}

function showStatus(message, ok = true) {
  status.textContent = message;
  statusDot.style.background = ok ? "#6bd49b" : "#f1ad5b";
}

async function save(patch) {
  settings = { ...settings, ...patch };
  await chrome.storage.local.set({ [`site:${host}`]: settings });
  const result = await send("apply-settings", { settings });
  showStatus(
    result ? `${result.detected} overlay${result.detected === 1 ? "" : "s"} adjusted` : "Settings saved",
  );
}

async function init() {
  tab = await activeTab();

  try {
    const url = new URL(tab.url);
    host = url.hostname;
    site.textContent = host || "Current page";
  } catch {
    host = "unsupported";
    site.textContent = "Restricted page";
  }

  const stored = await chrome.storage.local.get(`site:${host}`);
  settings = { ...DEFAULTS, ...(stored[`site:${host}`] || {}) };
  enabled.checked = settings.enabled;
  reduction.value = settings.reduction;
  reductionValue.value = `${settings.reduction}%`;

  const result = await send("get-status");
  if (result) showStatus(`${result.detected} overlay${result.detected === 1 ? "" : "s"} adjusted`);
}

enabled.addEventListener("change", () => save({ enabled: enabled.checked }));

reduction.addEventListener("input", () => {
  reductionValue.value = `${reduction.value}%`;
  send("preview-reduction", { reduction: Number(reduction.value) });
});

reduction.addEventListener("change", () => save({ reduction: Number(reduction.value) }));

scan.addEventListener("click", async () => {
  const result = await send("rescan");
  if (result) showStatus(`${result.detected} overlay${result.detected === 1 ? "" : "s"} adjusted`);
});

picker.addEventListener("click", async () => {
  const result = await send("start-picker");
  if (result) window.close();
});

reset.addEventListener("click", async () => {
  await save({ hiddenSelectors: [] });
  await send("reset-hidden");
  showStatus("Hidden elements restored");
});

function renderPresets(presets) {
  presetList.replaceChildren();
  if (!presets.length) {
    const empty = document.createElement("li");
    empty.textContent = "No presets yet.";
    presetList.append(empty);
    return;
  }

  for (const preset of presets) {
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = `${preset.name} · ${preset.reduction}%`;
    const apply = document.createElement("button");
    apply.type = "button";
    apply.textContent = "Apply";
    apply.addEventListener("click", () => save({ reduction: preset.reduction }).then(() => {
      reduction.value = preset.reduction;
      reductionValue.value = `${preset.reduction}%`;
    }));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Delete";
    remove.addEventListener("click", async () => {
      const next = presets.filter((entry) => entry.id !== preset.id);
      await chrome.storage.local.set({ [PRESETS_KEY]: next });
      renderPresets(next);
    });
    item.append(label, apply, remove);
    presetList.append(item);
  }
}

async function showPresets() {
  const commands = await chrome.commands.getAll();
  const shortcut = commands.find((command) => command.name === "toggle-overlay")?.shortcut;
  shortcutHint.textContent = `Shortcut: ${shortcut || "choose one in chrome://extensions/shortcuts"}`;
  const stored = await chrome.storage.local.get(PRESETS_KEY);
  renderPresets(stored[PRESETS_KEY] || []);
}

presetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const stored = await chrome.storage.local.get(PRESETS_KEY);
  const presets = stored[PRESETS_KEY] || [];
  if (presets.length >= 8) {
    showStatus("You can save 8 presets", false);
    return;
  }
  const name = presetName.value.trim();
  if (presets.some((preset) => preset.name.toLowerCase() === name.toLowerCase())) {
    showStatus("A preset already uses that name", false);
    return;
  }
  presets.push({ id: crypto.randomUUID(), name, reduction: Number(reduction.value) });
  await chrome.storage.local.set({ [PRESETS_KEY]: presets });
  presetName.value = "";
  renderPresets(presets);
  showStatus("Preset saved");
});

if (TIP_URL.startsWith("https://")) {
  tip.querySelector("a").href = TIP_URL;
  tip.hidden = false;
}

init().then(showPresets);
