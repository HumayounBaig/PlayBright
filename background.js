importScripts("license.js");

const PADDLE_CHECKOUT = "paddleCheckout";
const PADDLE_CHECKOUT_MS = 60 * 60 * 1000;

async function openPaddleCheckout() {
  const url = paddleCheckoutUrl();
  const tab = await chrome.tabs.create({ url });
  await chrome.storage.session.set({
    [PADDLE_CHECKOUT]: { tabId: tab.id, startedAt: Date.now() },
  });
}

async function pendingPaddleTab(tabId) {
  const stored = await chrome.storage.session.get(PADDLE_CHECKOUT);
  const pending = stored[PADDLE_CHECKOUT];
  if (!pending || pending.tabId !== tabId) return null;
  if (Date.now() - pending.startedAt > PADDLE_CHECKOUT_MS) return null;
  return pending;
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message.type === "open-paddle-checkout") {
    openPaddleCheckout().then(
      () => respond({ ok: true }),
      (error) => respond({ ok: false, error: error.message || "Could not open Paddle checkout" }),
    );
    return true;
  }

  if (message.type !== "paddle-event") return undefined;

  const tabId = sender.tab?.id;
  if (!tabId) return undefined;
  pendingPaddleTab(tabId).then(async (pending) => {
    if (!pending) return;
    const purchase = purchaseFromPaddleMessage(message.data);
    if (!purchase) return;
    const saved = await rememberPaddlePurchase(purchase);
    if (saved) await chrome.storage.session.remove(PADDLE_CHECKOUT);
  });
  return undefined;
});

chrome.tabs.onUpdated.addListener(async (tabId, info) => {
  if (info.status !== "complete") return;
  if (!(await pendingPaddleTab(tabId))) return;
  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: ["paddle-listen.js"] });
  } catch {
    // The checkout tab closed before the page finished loading.
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-overlay") return;
  if (!(await currentLicense())) return;

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
