"""
generate_edgerunners_song.py
Generates a synthwave/lo-fi cover of "I Really Want to Stay at Your House" (Cyberpunk 2077 / Edgerunners)
using Python standard library `wave`, `struct`, and `math`.
"""
import os
import wave
import struct
import math
import random

BASE_DIR = r"C:\Users\USER\.gemini\antigravity\scratch\neon-chongqing-radio"
AUDIO_DIR = os.path.join(BASE_DIR, "assets", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

SAMPLE_RATE = 22050
BPM = 125.0
BEAT_DUR = 60.0 / BPM  # ~0.48 sec per beat

# Note frequencies (Hz)
NOTES = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
    'C6': 1046.50, 'REST': 0.0
}

# The iconic melody of "I Really Want to Stay at Your House" (Chorus & Verse)
# (note, duration in beats)
MELODY = [
    # "So what do you wanna do, what's your point-of-view"
    ('E5', 0.5), ('E5', 0.5), ('E5', 0.5), ('D5', 0.5), ('C5', 0.5), ('D5', 0.5), ('E5', 1.0),
    ('G5', 0.5), ('E5', 0.5), ('D5', 1.0), ('REST', 1.0),
    
    # "There's a party soon, do you wanna go?"
    ('E5', 0.5), ('E5', 0.5), ('E5', 0.5), ('D5', 0.5), ('C5', 0.5), ('D5', 0.5), ('E5', 1.0),
    ('A5', 0.5), ('G5', 0.5), ('E5', 1.0), ('REST', 1.0),

    # "I couldn't wait for you to come and clear the cupboards"
    ('G5', 0.5), ('A5', 0.5), ('G5', 0.5), ('E5', 0.5), ('G5', 0.5), ('A5', 0.5), ('G5', 0.5), ('E5', 0.5),
    ('G5', 0.5), ('A5', 0.5), ('G5', 0.5), ('E5', 0.5), ('D5', 0.5), ('C5', 1.0), ('REST', 0.5),

    # "I really wanna stay at your house..."
    ('E5', 0.75), ('D5', 0.75), ('C5', 0.5), ('D5', 0.5), ('E5', 1.5), ('REST', 0.5),
    ('D5', 0.5), ('C5', 0.5), ('A4', 1.0), ('C5', 2.0), ('REST', 1.0)
]

# Chords (Am - F - C - G progression)
CHORDS = [
    [NOTES['A4']/2, NOTES['C4'], NOTES['E4']],  # Am
    [NOTES['F4']/2, NOTES['A4']/2, NOTES['C4']], # F
    [NOTES['C4']/2, NOTES['E4'], NOTES['G4']],   # C
    [NOTES['G4']/2, NOTES['B4']/2, NOTES['D4']]  # G
]

def generate_track():
    total_beats = sum(dur for _, dur in MELODY)
    # Loop it twice for a rich ~35-second preview
    melody_loop = MELODY * 2
    total_beats = sum(dur for _, dur in melody_loop)
    total_samples = int(total_beats * BEAT_DUR * SAMPLE_RATE)

    samples = [0.0] * total_samples

    # 1. Render Chords & Bassline & Drums
    chord_len_beats = 4.0
    chord_samples = int(chord_len_beats * BEAT_DUR * SAMPLE_RATE)

    for i in range(total_samples):
        t = i / SAMPLE_RATE
        beat_idx = int(t / BEAT_DUR)
        chord_idx = (beat_idx // 4) % len(CHORDS)
        current_chord = CHORDS[chord_idx]

        # Warm synth pad
        pad = 0.0
        for f in current_chord:
            pad += 0.04 * math.sin(2 * math.pi * f * t)
            pad += 0.02 * math.sin(2 * math.pi * (f * 2.01) * t)

        # Cyber Bass (808 style punch)
        root_f = current_chord[0]
        bass = 0.12 * math.sin(2 * math.pi * root_f * t)

        # Drums (Kick on 0 & 2, Snare on 1 & 3, Hi-hat every 0.5 beat)
        beat_pos = (t / BEAT_DUR) % 1.0
        drum = 0.0
        # Kick
        if beat_idx % 2 == 0 and beat_pos < 0.2:
            kt = beat_pos * BEAT_DUR
            drum += 0.3 * math.sin(2 * math.pi * 55 * math.exp(-kt * 18) * kt)
        # Snare
        elif beat_idx % 2 == 1 and beat_pos < 0.25:
            st = beat_pos * BEAT_DUR
            drum += random.uniform(-0.16, 0.16) * math.exp(-st * 22)
        # Hi-hat
        hat_pos = (t / (BEAT_DUR / 2)) % 1.0
        if hat_pos < 0.1:
            drum += random.uniform(-0.05, 0.05) * math.exp(-hat_pos * 30)

        samples[i] = pad + bass + drum

    # 2. Render Lead Vocal Melody ("I Really Want to Stay at Your House")
    current_sample = 0
    for note, dur in melody_loop:
        num_note_samples = int(dur * BEAT_DUR * SAMPLE_RATE)
        f = NOTES.get(note, 0.0)

        if f > 0:
            for s in range(num_note_samples):
                idx = current_sample + s
                if idx >= total_samples:
                    break
                nt = s / SAMPLE_RATE
                env = math.exp(-nt * 1.5)  # Soft decay envelope
                # Cyber synth lead: triangle + sine overtone for dreamy Edgerunners vocal lead
                lead = 0.22 * math.sin(2 * math.pi * f * nt) * env
                lead += 0.08 * math.sin(2 * math.pi * (f * 2.0) * nt) * env
                samples[idx] += lead

        current_sample += num_note_samples

    # Write WAV file
    filepath = os.path.join(AUDIO_DIR, "i_really_want_to_stay_at_your_house.wav")
    with wave.open(filepath, 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        raw_data = bytearray()
        for s in samples:
            clamped = max(-1.0, min(1.0, s))
            val = int(clamped * 32767.0)
            raw_data.extend(struct.pack('<h', val))
        wf.writeframes(raw_data)

    print(f"Generated Cyberpunk Edgerunners track: {filepath} ({total_samples/SAMPLE_RATE:.1f}s)")

if __name__ == "__main__":
    generate_track()

