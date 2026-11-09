# Chrome Web Store listing: Playbright 1.3.0

Paste these into the Developer Dashboard. Items marked (UNSURE) should be checked against the current dashboard.

## Short description (129 characters, limit 132)

Fade or remove the dark overlay on streaming video, hide player UI you pick, and toggle per site. Free, local, no data collected.

## Detailed description

Playbright fades the dark overlays and scrims that streaming sites draw over video, so you can see the picture.

- Slider from original appearance to complete overlay removal
- Works without hard-coding any single streaming service
- Per-site on/off, remembered for each site
- Saved presets (up to 8)
- Alt+Shift+Y toggles the current site (change it at chrome://extensions/shortcuts)
- Click-to-hide picker for player controls or panels you want gone, per site
- Rescans automatically when single-page apps replace the player
- Stays idle on pages without a video
- Restores every original style when disabled

Free, with no account. It runs locally and collects no data. Settings are stored only in Chrome's local extension storage. It never reads video pixels.

Tips: start playback before clicking Rescan. Chrome blocks extensions on internal pages such as chrome://. Streaming sites change their markup, so use the picker when an overlay cannot be identified.

Playbright is not affiliated with any streaming service.

## Category (suggestion)

Productivity (alternative: Entertainment). (UNSURE which fits the dashboard's current list best.)

## Single purpose

Reduce or remove dark overlays on streaming video, and let the user hide chosen player UI elements, on a per-site basis.

## Permission justifications

- **storage**: Saves per-site settings (enabled, reduction level, selectors of elements the user hid) and the user's saved presets in chrome.storage.local.
- **Host permissions (<all_urls>)**: The overlay can appear on any streaming site, so the content script must be able to run on any page to detect a video and fade overlay elements. It stays idle on pages with no video and sends no page data anywhere.

## Remote code

No. All code is packaged in the extension. No remote scripts, no eval of remote content.

## Data usage

- Collected user data categories: none. Leave every data-type checkbox unticked.
- Certifications (tick all three):
  - I do not sell or transfer user data to third parties, outside of the approved use cases.
  - I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
  - I do not use or transfer user data to determine creditworthiness or for lending purposes.

## URLs

- Privacy policy: https://humayounbaig.github.io/PlayBright/privacy.html
- Homepage: https://humayounbaig.github.io/PlayBright/
- Support: https://humayounbaig.github.io/PlayBright/support.html
- Contact email: Humayoun.mani@gmail.com

## Assets you must make (checklist)

- [ ] At least one screenshot, 1280x800 or 640x400 (up to 5 allowed)
- [ ] Small promo tile, 440x280 (required by the dashboard)
- [ ] Store icon: 128x128, already in the package (icons/icon128.png)
- [ ] Marquee promo tile, 1400x560 (optional, UNSURE if still optional)

## Upload

Upload dist/playbright-1.3.0.zip (version 1.3.0). The store may ask for a developer registration fee on a first publish (UNSURE of the current amount).
