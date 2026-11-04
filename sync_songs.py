#!/usr/bin/env python3
"""
sync_songs.py
Automatically scans 'assets/audio' for all audio files (.mp3, .wav, .ogg, .m4a),
generates 'assets/audio/playlist.json', and updates the radio station playlist so
anyone opening the website can listen to all songs permanently!
"""

import os
import json
import re

AUDIO_DIR = os.path.join(os.path.dirname(__file__), 'assets', 'audio')
PLAYLIST_FILE = os.path.join(AUDIO_DIR, 'playlist.json')

# Audio files to ignore (sound effects and ambient weather)
IGNORE_FILES = {'rain.wav', 'sfx_click.wav', 'sfx_coin.wav', 'sfx_jump.wav'}

def clean_title(filename):
    name = os.path.splitext(filename)[0]
    # Replace underscores/dashes with spaces
    name = re.sub(r'[_\-]+', ' ', name).strip()
    return name.title()

def sync():
    if not os.path.exists(AUDIO_DIR):
        print(f"Directory not found: {AUDIO_DIR}")
        return

    files = sorted(os.listdir(AUDIO_DIR))
    tracks = []

    # Priority: ensure Edgerunners track is first
    for f in files:
        if f in IGNORE_FILES:
            continue
        ext = os.path.splitext(f)[1].lower()
        if ext not in ('.mp3', '.wav', '.ogg', '.m4a'):
            continue

        raw_name = clean_title(f)
        src = f"assets/audio/{f}"

        # Classify station based on filename
        lower = f.lower()
        if 'stay' in lower or 'house' in lower or 'edgerunners' in lower or 'rosa' in lower:
            station_id = 'edgerunners'
            station_name = 'CYBERPUNK EDGERUNNERS'
            badge = 'EDGERUNNERS'
            artist = 'Rosa Walton / Cyberpunk 2077'
            title = 'I Really Want to Stay at Your House'
        elif 'synth' in lower or 'wave' in lower or 'overdrive' in lower:
            station_id = 'synthwave'
            station_name = 'NEON SYNTHWAVE'
            badge = 'SYNTHWAVE'
            artist = 'Cyber Pulse'
            title = raw_name
        elif 'lofi' in lower or 'chill' in lower or 'night' in lower or 'radio' in lower:
            station_id = 'lofi'
            station_name = 'CHILLWAVE LO-FI'
            badge = 'LO-FI'
            artist = 'Neon Chongqing Radio'
            title = raw_name
        else:
            station_id = 'city_radio'
            station_name = 'NEON CITY FM'
            badge = 'TRACK'
            artist = 'Cyberpunk Radio 88.8'
            title = raw_name

        tracks.append({
            "title": title,
            "artist": artist,
            "src": src,
            "badge": badge,
            "stationId": station_id,
            "stationName": station_name
        })

    # Sort so Edgerunners stay track is always index 0
    tracks.sort(key=lambda t: 0 if 'stay' in t['title'].lower() or 'edgerunners' in t['stationId'] else 1)

    with open(PLAYLIST_FILE, 'w', encoding='utf-8') as out:
        json.dump(tracks, out, indent=2, ensure_ascii=False)

    print(f"Successfully synced {len(tracks)} tracks to {PLAYLIST_FILE}:")
    for i, t in enumerate(tracks):
        print(f"  [{i+1}] {t['title']} ({t['artist']}) -> {t['src']}")

if __name__ == '__main__':
    sync()
