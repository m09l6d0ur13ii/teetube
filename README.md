[🇷🇺 Русский](README.ru.md) | [🇬🇧 English](README.md)

# TeeTube - DDNet Video Tracker

This is the main website for **TeeTube**, a community-curated database of DDNet and Teeworlds YouTube videos. 

It reads the global database from the `teetube-db` repository and displays it using a simple, fast interface. You can filter videos by game, map, player, mode, and more!

## 🔗 Related Projects

TeeTube is divided into 4 repositories:
- 🌐 [TeeTube (Frontend)](https://github.com/m09l6d0ur13ii/teetube) - The main website you are looking at now.
- 💾 [TeeTube Database](https://github.com/m09l6d0ur13ii/teetube-db) - The JSON database of all tagged videos.
- 🛠️ [TeeTube Admin](https://github.com/m09l6d0ur13ii/teetube-admin) - Extension for moderators to tag new videos.
- 👁️ [TeeTube Extension](https://github.com/m09l6d0ur13ii/teetube-extension) - Extension for regular users to see video tags directly on YouTube.

## 🛠️ How to download and run this repository

To download just this website and run it locally, run the following commands in your terminal:

```bash
git clone https://github.com/m09l6d0ur13ii/teetube.git
cd teetube
# You can now open index.html in your browser!
```

## 📦 How to download the ENTIRE TeeTube Project

If you want to work on all parts of TeeTube at once, you can download all repositories into one folder:

```bash
mkdir teetube-workspace
cd teetube-workspace
git clone https://github.com/m09l6d0ur13ii/teetube.git
git clone https://github.com/m09l6d0ur13ii/teetube-extension.git
git clone https://github.com/m09l6d0ur13ii/teetube-admin.git
git clone https://github.com/m09l6d0ur13ii/teetube-db.git
```

### Files Structure
- `index.html` - The main layout and UI structure.
- `index.css` - All the styling for the dashboard.
- `index.js` - The logic that fetches the database and renders the videos.

No complex backend is needed. It's fully static and hosted on GitHub Pages!
