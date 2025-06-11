# 🎵 YouTube Music Controller Chrome Extension

Some nerds like me who keep around 90 tabs and wanna control your music without finding your music tab again.
A lightweight Chrome extension that empowers you with advanced control over **YouTube Music** or **Spotify**directly from your browser. Seamlessly manage playback, search, track info, repeat/shuffle modes, and picture-in-picture — all without leaving your current tab.

---

## 🚀 Features

- **Playback Control**  
  Play, pause, skip to next or previous track, toggle shuffle and repeat modes programmatically on YouTube Music.

- **Search & Play**  
  Instantly search for music on [YouTube Music](https://music.youtube.com) or [Spotify](https://open.spotify.com/) and auto-play the first result with one click.


- **Picture-in-Picture (PiP) Mode**  
  Toggle video picture-in-picture mode for the currently playing track's video.

- **Keyboard Event Simulation**  
  Simulates media keyboard shortcuts (arrow keys with modifiers) to control playback progress or navigation.

- **Track Info Extraction**  
  Retrieves currently playing track's title, artist name, and album art for display or integration.

- **Popup and Dialog Suppression**  
  Prevent annoying native `alert()`, `confirm()`, and `prompt()` dialogs, and block popup windows (`window.open`).


---

## 📦 Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/lazylettucewaseaten/Music_Web_Manager
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable **Developer mode** (toggle in the top right corner).

4. Click **Load unpacked** and select the cloned extension folder.

5. Open YouTube Music or Spotify, and control your music with ease!

---

## ⚙️ How It Works

This extension uses content scripts injected into YouTube Music tabs to:

- Query and control native playback buttons using DOM selectors.
- Listen and respond to messages sent from the extension popup or background scripts.
- Programmatically simulate keyboard events to interact with YouTube Music's UI.
- Suppress disruptive browser dialogs and popups for a smoother experience.
- Manage picture-in-picture mode for video playback.
- Control and query repeat and shuffle states based on button aria-label attributes.
- Extract current track metadata for UI display or further integration.

---

## 🧩 Code Highlights

- **Playback Actions**: `playPause`, `next`, `prev`, `shuffle`, `repeat`
- **Track Info**: Extracts title, artist, and album image from player bar DOM.
- **Popup/Dialogs Blocking**: Overwrites native `alert`, `confirm`, and `prompt`.
- **Unload Prompt Prevention**: Blocks `beforeunload` event listeners and disables unload confirmation dialogs.
- **Picture-in-Picture**: Toggles PiP mode using `document.pictureInPictureElement` API.

---

## 🛠️ Development

1. Modify the source code in `content.js` or similar content script files.
2. Reload the extension on `chrome://extensions/` after changes.
3. Use Chrome Developer Tools on `music.youtube.com` to debug selectors and behaviors.

---

## 🔐 Permissions

The extension requires:

- `"activeTab"` and host permissions for `https://music.youtube.com/*` to inject content scripts and control the player.
- `"storage"` to save  user preferences.
- `"tabs"` permission for cross-tab communication (optional depending on extension scope).

---

## 🔮 Future Enhancements

- Like/Dislike feature.
- Storage in Playlist.

---

## 📄 License

MIT License © 2025 Ashish Ranjan

---

## 📞 Contact

For questions or feedback, please open an issue or contact me at [1ashish00ranjan1@gmail.com].

**Enjoy effortless Music control right from your browser! 🎧**
