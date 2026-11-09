# Playbright

A dependency-free Chrome extension that reduces dark scrims placed over streaming video. It also includes a visual picker for hiding player controls or other distracting UI on a per-site basis.

Write-up: [Removing a streaming overlay without blacking out the video](https://dev.to/humayounbaig/removing-a-streaming-overlay-without-blacking-out-the-video-21im)

## Features

- Detects dark, video-sized overlays without hard-coding a single streaming service
- Slider from original appearance to complete overlay removal
- Per-site enable/disable and settings
- Click-to-hide picker for specific player UI
- Automatically rescans when single-page apps replace the player
- Restores every original inline style when disabled
- Playbright Plus ($4.99 once): saved overlay presets and a keyboard shortcut

## Playbright Plus

The slider, per-site switch, and UI picker stay free. Plus adds named presets and `Alt+Shift+Y` to toggle the current site. The shortcut can be changed at `chrome://extensions/shortcuts`.

Paddle sells Plus and pays the seller. Pakistan is not on Paddle's unsupported-country list. Payouts are a monthly bank wire or Payoneer, and the dashboard minimum is $100. Set payout details before live checkout will run. A local bank account needs the account name, bank name, SWIFT/BIC, and IBAN.

1. Create a Paddle account and a one-time $4.99 price. Copy the price ID (`pri_...`) and product ID (`pro_...`).
2. In Paddle, open Checkout, then Hosted checkout, and copy the launch URL (`https://pay.paddle.io/checkout/hsc_...`). Live hosted checkout is turned on for approved mobile apps; a sandbox account can create the link for a test. If that screen is unavailable, host `paddle-checkout.html` on a domain approved under Website approval, paste the public client-side token into that file, and use the page URL instead.
3. Paste the checkout URL, price ID, and product ID into `license.js`.
4. Reload the extension. Buy opens Paddle, and Plus turns on in that browser when the payment finishes.

Paddle's API key stays out of the extension, so a refund in the Paddle dashboard does not lock this browser by itself. Remove Plus from this browser with the button in the popup.

## Install locally

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Open a streaming site, start playback, and click the extension.

After changing extension code, click the reload button on the extension card and refresh the streaming tab.

## Usage

- Move **Dark overlay reduction** toward **Remove**.
- Click **Rescan overlays** after opening a player if nothing was detected.
- Click **Pick UI to hide**, then click a control or panel on the page. Press `Esc` to cancel.
- Use **Reset hidden elements for this site** to restore manually hidden UI.

The extension intentionally avoids hiding interactive controls automatically. Site-specific UI should be hidden with the picker.

## Privacy

Playbright runs locally. It does not collect analytics, inspect video content, or send browsing data to a server. Settings are stored in Chrome's local extension storage.

## Limitations

- Chrome blocks extensions on internal pages such as `chrome://`.
- DRM-protected video pixels are not read or modified. Playbright fades separate overlay elements and full-size gradient layers, including CSS pseudo-elements. It does not fade a container that holds the video.
- Streaming sites frequently change their player markup. The picker is the fallback when an overlay cannot be safely identified.
