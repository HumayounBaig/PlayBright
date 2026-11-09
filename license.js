// Paddle Billing. Create a one-time $4.99 price, then paste the hosted
// checkout URL (https://pay.paddle.io/checkout/hsc_...) and the pri_/pro_ IDs.
const PLAYBRIGHT_LICENSE = {
  checkoutUrl: "",
  priceId: "",
  productId: "",
};

const LICENSE_KEY = "license";
const PRESETS_KEY = "presets";

function paddleCheckoutUrl() {
  if (!PLAYBRIGHT_LICENSE.checkoutUrl || !PLAYBRIGHT_LICENSE.priceId) {
    throw new Error("Add your Paddle checkout URL and price ID in license.js.");
  }
  const url = new URL(PLAYBRIGHT_LICENSE.checkoutUrl);
  if (url.protocol !== "https:") throw new Error("The Paddle checkout URL has to start with https.");
  if (!url.searchParams.get("price_id")) url.searchParams.set("price_id", PLAYBRIGHT_LICENSE.priceId);
  return url.toString();
}

function completionData(payload, depth = 0) {
  if (!payload || typeof payload !== "object" || depth > 4) return null;
  const name = payload.name || payload.event_name || payload.event || payload.type;
  if (name === "checkout.completed" || name === "Checkout.Complete") {
    return payload.data || payload.callback_data || payload.eventData || payload;
  }
  for (const key of ["data", "callback_data", "eventData", "detail"]) {
    const found = completionData(payload[key], depth + 1);
    if (found) return found;
  }
  return null;
}

function itemIdentity(item) {
  return {
    priceId: item?.price_id || item?.priceId || item?.price?.id || "",
    productId: item?.product_id || item?.productId || item?.product?.id || "",
  };
}

function purchaseFromPaddleMessage(payload) {
  const data = completionData(payload);
  if (!data) return null;
  const transactionId =
    data.transaction_id ||
    data.transactionId ||
    (String(data.id || "").startsWith("txn_") ? data.id : "");
  if (!/^txn_[a-z\d]+$/i.test(transactionId)) return null;
  const items = Array.isArray(data.items) ? data.items.map(itemIdentity) : [];
  return { transactionId, items };
}

function purchaseMatchesConfig(purchase) {
  const prices = purchase.items.map((item) => item.priceId).filter(Boolean);
  const products = purchase.items.map((item) => item.productId).filter(Boolean);
  if (prices.length && !prices.includes(PLAYBRIGHT_LICENSE.priceId)) return false;
  if (PLAYBRIGHT_LICENSE.productId && products.length && !products.includes(PLAYBRIGHT_LICENSE.productId)) {
    return false;
  }
  return true;
}

async function rememberPaddlePurchase(purchase) {
  if (!PLAYBRIGHT_LICENSE.priceId || !purchaseMatchesConfig(purchase)) return false;
  const license = {
    provider: "paddle",
    transactionId: purchase.transactionId,
    priceId: PLAYBRIGHT_LICENSE.priceId,
    productId: PLAYBRIGHT_LICENSE.productId,
    checkedAt: Date.now(),
  };
  await chrome.storage.local.set({ [LICENSE_KEY]: license });
  return license;
}

async function currentLicense() {
  const stored = await chrome.storage.local.get(LICENSE_KEY);
  const license = stored[LICENSE_KEY];
  if (license?.provider !== "paddle" || !license.transactionId) return null;
  if (!PLAYBRIGHT_LICENSE.priceId || license.priceId !== PLAYBRIGHT_LICENSE.priceId) return null;
  if (PLAYBRIGHT_LICENSE.productId && license.productId !== PLAYBRIGHT_LICENSE.productId) return null;
  return license;
}

async function deactivateLicense() {
  await chrome.storage.local.remove(LICENSE_KEY);
}
