# Playbright

Website: https://humayounbaig.github.io/PlayBright/ · Repo: https://github.com/HumayounBaig/PlayBright

A dependency-free Chrome extension that reduces dark scrims placed over streaming video. It also includes a visual picker for hiding player controls or other distracting UI on a per-site basis.

Write-up: [Removing a streaming overlay without blacking out the video](https://dev.to/humayounbaig/removing-a-streaming-overlay-without-blacking-out-the-video-21im)

## Features

- Detects dark, video-sized overlays without hard-coding a single streaming service
- Slider from original appearance to complete overlay removal
- Per-site enable/disable and settings
- Click-to-hide picker for specific player UI
- Automatically rescans when single-page apps replace the player
- On pages without a video it only does a light check for one after page changes, and applies elements you chose to hide on that site; it does not scan for overlays
- Restores every original inline style when disabled
- Saved overlay presets and an `Alt+Shift+Y` shortcut to toggle the current site (change it at `chrome://extensions/shortcuts`)

## Support

Playbright is free. To show an optional tip link in the popup, set `TIP_URL` in `popup.js` to your tip page URL (https only).

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

## Publishing to the Chrome Web Store

The listing text, permission justifications and asset checklist are in [STORE_LISTING.md](STORE_LISTING.md). The website, privacy policy, terms and support pages are in [docs/](docs/) and are served by GitHub Pages. Upload `dist/playbright-1.3.0.zip`.

## Privacy

Full policy: [docs/privacy.html](docs/privacy.html) (also at the website). Playbright runs locally. It does not collect analytics, inspect video content, or send browsing data to a server. Settings are stored in Chrome's local extension storage.

## Limitations

- Chrome blocks extensions on internal pages such as `chrome://`.
- DRM-protected video pixels are not read or modified. Playbright fades separate overlay elements and full-size gradient layers, including CSS pseudo-elements. It does not fade a container that holds the video.
- Streaming sites frequently change their player markup. The picker is the fallback when an overlay cannot be safely identified.
