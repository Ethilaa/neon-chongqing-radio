"""
generate_audio.py
Generates placeholder WAV audio tracks and sound effects for Neon Chongqing Radio
using standard library `wave`, `struct`, and `math`.
"""
import os
import wave
import struct
import math
import random

BASE_DIR = r"C:\Users\USER\.gemini\antigravity\scratch\neon-chongqing-radio"
AUDIO_DIR = os.path.join(BASE_DIR, "assets", "audio")

SAMPLE_RATE = 22050

def write_wav(filename, samples):
    filepath = os.path.join(AUDIO_DIR, filename)
    with wave.open(filepath, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(SAMPLE_RATE)
        # Pack to 16-bit signed integers
        raw_data = bytearray()
        for s in samples:
            # clamp to -1.0 to 1.0
            clamped = max(-1.0, min(1.0, s))
            int_val = int(clamped * 32767.0)
            raw_data.extend(struct.pack('<h', int_val))
        wav_file.writeframes(raw_data)
    print(f"Generated {filename} ({len(samples)/SAMPLE_RATE:.1f}s)")

# 1. Rain ambience (10 seconds seamless loopable pink/filtered noise with drops)
def gen_rain(duration=8.0):
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    b0 = b1 = b2 = 0.0
    for i in range(num_samples):
        # White noise
        white = random.uniform(-1.0, 1.0)
        # Pink noise approximation
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        pink = b0 + b1 + b2 + white * 0.5362
        pink *= 0.08  # Soft volume
        # Random rain droplets
        if random.random() < 0.003:
            drop = math.sin(i * 0.2) * 0.15 * math.exp(-(i % 1000) / 150.0)
            pink += drop
        samples.append(pink)
    return samples

# 2. Chill Cyber Lo-fi Beat (8-measure loop, ~10 seconds)
def gen_lofi_beat(duration=10.0):
    num_samples = int(duration * SAMPLE_RATE)
    samples = [0.0] * num_samples
    bpm = 75
    quarter_note = SAMPLE_RATE * 60 / bpm
    chords = [
        [220.00, 261.63, 329.63, 392.00],  # Am7
        [174.61, 220.00, 261.63, 329.63],  # Fmaj7
        [130.81, 164.81, 196.00, 246.94],  # Cmaj7
        [196.00, 246.94, 293.66, 349.23],  # G7
    ]
    chord_len = int(quarter_note * 4)

    for i in range(num_samples):
        t = i / SAMPLE_RATE
        chord_idx = (i // chord_len) % len(chords)
        current_chord = chords[chord_idx]
        
        # Synth electric piano / chord pad
        chord_val = 0.0
        for f in current_chord:
            # warm sine + slight triangle
            chord_val += 0.06 * math.sin(2 * math.pi * f * t)
            chord_val += 0.02 * math.sin(2 * math.pi * (f * 2.0) * t)
        
        # Bassline
        root_f = current_chord[0] / 2.0
        bass = 0.12 * math.sin(2 * math.pi * root_f * t)
        
        # Lo-fi drums (Kick & Snare)
        beat_phase = (i % int(quarter_note * 2)) / quarter_note
        drum = 0.0
        # Kick on beat 0
        if beat_phase < 0.25:
            kick_t = beat_phase * quarter_note / SAMPLE_RATE
            drum += 0.35 * math.sin(2 * math.pi * 60 * math.exp(-kick_t * 15) * kick_t)
        # Snare on beat 1
        elif 1.0 <= beat_phase < 1.3:
            snare_t = (beat_phase - 1.0) * quarter_note / SAMPLE_RATE
            noise = random.uniform(-0.18, 0.18) * math.exp(-snare_t * 20)
            drum += noise
        # Hi-hat every 0.5 beat
        hat_phase = (i % int(quarter_note / 2)) / (quarter_note / 2)
        if hat_phase < 0.15:
            hat_t = hat_phase * (quarter_note / 2) / SAMPLE_RATE
            drum += random.uniform(-0.06, 0.06) * math.exp(-hat_t * 40)
            
        samples[i] = chord_val + bass + drum
    return samples

# 3. SFX: Blip / Click
def gen_sfx_click():
    num_samples = int(0.08 * SAMPLE_RATE)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        f = 800 - t * 4000
        env = math.exp(-t * 50)
        samples.append(0.3 * math.sin(2 * math.pi * f * t) * env)
    return samples

# 4. SFX: Jump
def gen_sfx_jump():
    num_samples = int(0.2 * SAMPLE_RATE)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        f = 250 + t * 900
        env = math.exp(-t * 10)
        samples.append(0.35 * math.sin(2 * math.pi * f * t) * env)
    return samples

# 5. SFX: Coin pickup
def gen_sfx_coin():
    num_samples = int(0.3 * SAMPLE_RATE)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        f = 987.77 if t < 0.12 else 1318.51  # B5 -> E6
        env = math.exp(- (t % 0.15) * 15)
        samples.append(0.3 * math.sin(2 * math.pi * f * t) * env)
    return samples

write_wav("rain.wav", gen_rain(8.0))
write_wav("lofi_city_nights.wav", gen_lofi_beat(10.0))
write_wav("sfx_click.wav", gen_sfx_click())
write_wav("sfx_jump.wav", gen_sfx_jump())
write_wav("sfx_coin.wav", gen_sfx_coin())
print("All audio assets generated successfully!")

