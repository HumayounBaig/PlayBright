chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-overlay") return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) return;

  let host;
  try {
    host = new URL(tab.url).hostname;
  } catch {
    return;
  }

  const key = `site:${host}`;
  const stored = await chrome.storage.local.get(key);
  const settings = {
    enabled: true,
    reduction: 100,
    hiddenSelectors: [],
    ...(stored[key] || {}),
  };
  settings.enabled = !settings.enabled;
  await chrome.storage.local.set({ [key]: settings });

  try {
    await chrome.tabs.sendMessage(tab.id, { type: "apply-settings", settings });
  } catch {
    // The page has no player script, such as a Chrome settings tab.
  }
});
