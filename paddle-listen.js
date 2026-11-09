if (!globalThis.__playbrightPaddleListen) {
  globalThis.__playbrightPaddleListen = true;

  function paddleFrame(origin) {
    try {
      const host = new URL(origin).hostname;
      return (
        host === "buy.paddle.com" ||
        host === "sandbox-buy.paddle.com" ||
        host === "checkout.paddle.com" ||
        host === "sandbox-checkout.paddle.com" ||
        host === "pay.paddle.io"
      );
    } catch {
      return false;
    }
  }

  window.addEventListener("message", (event) => {
    if (!paddleFrame(event.origin)) return;
    let serialized = "";
    try {
      serialized = JSON.stringify(event.data);
    } catch {
      return;
    }
    if (!serialized.includes("checkout.completed") && !serialized.includes("Checkout.Complete")) return;
    chrome.runtime.sendMessage({ type: "paddle-event", data: event.data });
  });
}
