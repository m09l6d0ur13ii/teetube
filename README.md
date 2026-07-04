[🇷🇺 Русский](README.ru.md) | [🇬🇧 English](README.md)

# TeeTube - DDNet Video Tracker

This is the main website for **TeeTube**, a community-curated database of DDNet and Teeworlds YouTube videos. 

It reads the global database from the `teetube-db` repository and displays it using a simple, fast interface. You can filter videos by game, map, player, mode, and more!

!!!!!!!!!!!!!!!

Bilibili support will be added in the future; there’s a lot of content there too—map walkthroughs, map skips, map speedruns, and game-related animations!

# Previews

# teetube site:
<img width="1920" height="910" alt="image-rx (2)" src="https://github.com/user-attachments/assets/a947a2ff-f451-4afa-9783-e5a30a9ecfe4" />

# teetube-extension

Youtube:

<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/1ec50524-ab8c-4790-b121-559dbb3ee79c" />
<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/853728b4-b149-4c87-92ed-bdbbf51ced51" />
<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/4c84e09d-43e4-4651-9a22-c7f78caaa961" />
<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/45597cdc-ce3e-4799-bf79-76511d12287f" />


player:
<img width="1920" height="910" alt="image-ry (2)" src="https://github.com/user-attachments/assets/143e6de3-1e2b-4391-88b0-a31a7c39b4c4" />
<img width="1920" height="910" alt="image-s1 (2)" src="https://github.com/user-attachments/assets/14c88d19-0e94-435f-b181-6da7505f43bc" />
<img width="1920" height="910" alt="image-s0 (2)" src="https://github.com/user-attachments/assets/76eddf9d-fe4b-43af-8b11-6647d01dcacf" />

maps:
<img width="1920" height="910" alt="image-rz (2)" src="https://github.com/user-attachments/assets/c80e9cb2-b2f6-4d9a-8b30-4e8696beae1e" />
<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/cbd6fbfc-d35c-420b-84b0-2829c507c90e" />

Clans:
<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/ed3aeebb-9124-4421-9859-1eb1a4d88de5" />

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


