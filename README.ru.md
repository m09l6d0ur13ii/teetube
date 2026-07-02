[🇷🇺 Русский](README.ru.md) | [🇬🇧 English](README.md)

# TeeTube - Трекер видео DDNet

Это главный сайт для **TeeTube**, созданной сообществом базы данных видеороликов по DDNet и Teeworlds на YouTube.

Сайт читает глобальную базу данных из репозитория `teetube-db` и отображает её через удобный интерфейс. Вы можете фильтровать видео по игре, карте, игроку, режиму и многому другому!

## 🔗 Связанные проекты

TeeTube разделен на 4 репозитория:
- 🌐 [TeeTube (Сайт)](https://github.com/m09l6d0ur13ii/teetube) - Главный сайт, который вы сейчас смотрите.
- 💾 [TeeTube Database (База)](https://github.com/m09l6d0ur13ii/teetube-db) - JSON база всех видео.
- 🛠️ [TeeTube Admin (Админка)](https://github.com/m09l6d0ur13ii/teetube-admin) - Расширение для модераторов для добавления новых видео.
- 👁️ [TeeTube Extension (Для пользователей)](https://github.com/m09l6d0ur13ii/teetube-extension) - Расширение для показа тегов прямо на YouTube.

## 🛠️ Как скачать и запустить этот репозиторий

Чтобы скачать только этот сайт и запустить его, выполните эти команды в терминале:

```bash
git clone https://github.com/m09l6d0ur13ii/teetube.git
cd teetube
# Теперь вы можете просто открыть index.html в браузере!
```

## 📦 Как скачать ВЕСЬ проект TeeTube

Если вы хотите работать со всеми частями TeeTube сразу, вы можете скачать все репозитории в одну папку:

```bash
mkdir teetube-workspace
cd teetube-workspace
git clone https://github.com/m09l6d0ur13ii/teetube.git
git clone https://github.com/m09l6d0ur13ii/teetube-extension.git
git clone https://github.com/m09l6d0ur13ii/teetube-admin.git
git clone https://github.com/m09l6d0ur13ii/teetube-db.git
```

### Структура файлов
- `index.html` - Главная структура страницы.
- `index.css` - Стили сайта.
- `index.js` - Логика, которая скачивает базу и отображает видео.

Сложный бэкенд не нужен. Всё работает статично и хостится прямо на GitHub Pages!
