🔧 PHASE 1: Music Loading & Basic Library
✅ Goal:

Let the user load local music files and display them in the Library section.
🧩 Tasks:

    Add Music Files

        Add a “+ Add Music” button under Library.

        Trigger a <input type="file" multiple /> to select songs.

    Display Library List

        Show all added songs in a list under Library.

        Save basic metadata: filename, artist, title, duration.

    Save to Local DB (IndexedDB preferred over LocalStorage)

        Use IndexedDB to store song metadata and reference to file URLs.

        Persist song list across reloads.

    Play from Library

        When a user clicks a song, it loads into the audio player and plays.

🗂 PHASE 2: Organize Music by Folder (Optional)
✅ Goal:

Let users select a directory and automatically group music from that folder.
🧩 Tasks:

    Use webkitdirectory (Chrome/Edge only) or File System Access API (more modern).

    Allow browsing entire folders and loading all MP3s inside.

    Display folder groups in Library.

📻 PHASE 3: Playback System
✅ Goal:

Enable full control over music playback.
🧩 Tasks:

    Hook up play/pause/next/prev buttons.

    Update track title, artist, album art.

    Add progress updates (scrubbing, time updates).

    Volume control.

🎛 PHASE 4: Playlist Management
✅ Goal:

Allow users to create, update, delete, and play from playlists.
🧩 Tasks:

    CRUD for playlists stored in IndexedDB.

    Add/remove tracks to/from playlists.

    Load playlist into play queue.

💾 PHASE 5: Persistence Layer
✅ Goal:

Handle all data in-browser without external backend.
🧩 Use:

    IndexedDB for:

        Songs metadata

        File references

        Playlists

    Optionally fallback to LocalStorage (for settings, theme, etc.)

📌 PHASE 6: Advanced Features (Later)

    Lyrics syncing & LRC editing

    Tag editor for MP3 metadata

    Custom themes

    Export/Import backup of library


    ✅ OVERVIEW: Next Core Milestones
📁 1. Database & Local Storage Setup

We'll use IndexedDB for structured data like:

    Music Library (loaded files)

    Play Queue

    Playlists

    Settings (volume, theme, last song, timestamp, etc.)

And LocalStorage for:

    Quick preferences (dark/light mode, sidebar state, last tab)

🧭 2. App Navigation (No Reloads)

Use JavaScript to:

    Show/hide views (Library, Playlists, Settings)

    Track active tab in memory and optionally LocalStorage

    Use data-view attributes or similar

🎵 3. Queue & Resume System

    When playing a song from Library, insert the rest into Queue

    Save:

        Current song ID

        Timestamp (currentTime)

        Queue list

    Restore all on reload

🎛 4. Playlist CRUD

    Add playlist

    Rename/delete playlist

    Add/remove tracks from a playlist

    Store all in IndexedDB

✅ PHASED BREAKDOWN
Phase 1: Set Up IndexedDB Layer

    Create DB structure using idb wrapper (cleaner syntax) or plain IndexedDB.

    Define object stores:

        library (id, name, artist, filePath, etc.)

        queue (array of track IDs)

        playlists (id, name, tracks[])

        settings (key-value)

✅ Once set up, we can easily persist music metadata and user state.
Phase 2: Implement App View Navigation

    Add data-view="library" etc. to each section.

    Use JS to show one view at a time.

    Store active view in localStorage on switch.

Phase 3: Build & Auto-Populate Play Queue

    When a song from Library is played:

        Build a temporary queue from the rest of the library.

        Save queue to IndexedDB.

    Update UI queue list.

Phase 4: Track Playback State

    On every timeupdate, store:

        Current song ID

        Current timestamp

    On load, restore and start from saved position.

Phase 5: Playlist CRUD UI

    Add "New Playlist" button

    Show list of playlists with rename/delete

    Show songs in selected playlist

    Add/remove tracks

    All synced to IndexedDB