"""
generate_cute_characters.py
Generates high-detail cute anime pixel sprites and portraits for Mei, Rio, Iki, Sai, Mimi
with CLEARLY VISIBLE FACES, expressive eyes, hair, and cyberpunk accessories.
"""
import os

BASE_DIR = r"C:\Users\USER\.gemini\antigravity\scratch\neon-chongqing-radio"
SPRITE_DIR = os.path.join(BASE_DIR, "assets", "sprites")
IMG_DIR = os.path.join(BASE_DIR, "assets", "images")
os.makedirs(SPRITE_DIR, exist_ok=True)
os.makedirs(IMG_DIR, exist_ok=True)

# Generate detailed 80x96 character sprites with big cute anime eyes, hair, and visible faces!
def generate_character_sprite(name, hair_color, eye_color, accent_color, hair_style, accessory):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 96" width="80" height="96" style="image-rendering:pixelated;">
  <defs>
    <filter id="glow-{name}">
      <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="{hair_color}"/>
    </filter>
  </defs>

  <!-- Ground Shadow -->
  <ellipse cx="40" cy="90" rx="20" ry="4" fill="rgba(0,0,0,0.5)"/>

  <!-- Body / Outfit -->
  <!-- Legs & Cyber Boots -->
  <rect x="29" y="70" width="8" height="18" rx="2" fill="#130826"/>
  <rect x="28" y="80" width="10" height="7" rx="2" fill="{hair_color}"/>
  <line x1="28" y1="84" x2="38" y2="84" stroke="#ffffff" stroke-width="1.5"/>

  <rect x="43" y="70" width="8" height="18" rx="2" fill="#130826"/>
  <rect x="42" y="80" width="10" height="7" rx="2" fill="{hair_color}"/>
  <line x1="42" y1="84" x2="52" y2="84" stroke="#ffffff" stroke-width="1.5"/>

  <!-- Cyber Jacket / Outfit -->
  <rect x="24" y="48" width="32" height="25" rx="4" fill="#180b33" stroke="{hair_color}" stroke-width="1.5"/>
  <rect x="33" y="50" width="14" height="20" fill="#0c041d"/>
  <line x1="40" y1="50" x2="40" y2="70" stroke="{accent_color}" stroke-width="2"/>
  
  <!-- Arms & Gloves -->
  <rect x="18" y="50" width="7" height="18" rx="3" fill="#180b33"/>
  <rect x="17" y="64" width="8" height="6" rx="2" fill="{accent_color}"/>
  
  <rect x="55" y="50" width="7" height="18" rx="3" fill="#180b33"/>
  <rect x="55" y="64" width="8" height="6" rx="2" fill="{accent_color}"/>

  <!-- Back Hair -->
  {hair_style.get('back', '')}

  <!-- Neck -->
  <rect x="36" y="44" width="8" height="6" fill="#fcd7b8"/>

  <!-- BIG CUTE ANIME FACE -->
  <!-- Head Base -->
  <rect x="22" y="16" width="36" height="30" rx="8" fill="#ffe7d6" stroke="#f0c2a1" stroke-width="1"/>
  <polygon points="30,44 40,48 50,44" fill="#ffe7d6"/>

  <!-- Cute Rosy Cheeks -->
  <ellipse cx="28" cy="36" rx="5" ry="2.5" fill="#ff4d88" opacity="0.45"/>
  <ellipse cx="52" cy="36" rx="5" ry="2.5" fill="#ff4d88" opacity="0.45"/>

  <!-- Big Kawaii Eyes -->
  <!-- Left Eye -->
  <rect x="26" y="25" width="9" height="12" rx="3" fill="#120521"/>
  <rect x="27" y="28" width="7" height="8" rx="2" fill="{eye_color}"/>
  <circle cx="28" cy="28" r="2.5" fill="#ffffff"/>
  <circle cx="32" cy="33" r="1.2" fill="#ffffff"/>
  <!-- Left Eyelash -->
  <path d="M 24 25 Q 30 22 36 24" stroke="#120521" stroke-width="2" fill="none" stroke-linecap="round"/>

  <!-- Right Eye -->
  <rect x="45" y="25" width="9" height="12" rx="3" fill="#120521"/>
  <rect x="46" y="28" width="7" height="8" rx="2" fill="{eye_color}"/>
  <circle cx="47" cy="28" r="2.5" fill="#ffffff"/>
  <circle cx="51" cy="33" r="1.2" fill="#ffffff"/>
  <!-- Right Eyelash -->
  <path d="M 44 24 Q 50 22 56 25" stroke="#120521" stroke-width="2" fill="none" stroke-linecap="round"/>

  <!-- Nose & Sweet Smile -->
  <circle cx="40" cy="36" r="1" fill="#e89c82"/>
  <path d="M 37 39 Q 40 43 43 39" stroke="#ff3366" stroke-width="2" fill="none" stroke-linecap="round"/>

  <!-- Front Hair & Bangs -->
  {hair_style.get('front', '')}

  <!-- Cyber Accessory (Visor / Goggles / Cat ears / Headset) -->
  {accessory}
</svg>"""

# Hair styles and accessories
mei_hair = {
    'back': '<rect x="16" y="24" width="10" height="28" rx="5" fill="#ff3cac"/><rect x="54" y="24" width="10" height="28" rx="5" fill="#ff3cac"/>',
    'front': '<path d="M 20 18 Q 40 10 60 18 Q 56 26 48 24 Q 40 28 32 24 Q 24 26 20 18 Z" fill="#ff3cac"/><rect x="22" y="18" width="6" height="14" rx="2" fill="#ff3cac"/><rect x="52" y="18" width="6" height="14" rx="2" fill="#ff3cac"/>'
}
mei_acc = '<rect x="28" y="10" width="24" height="6" rx="2" fill="#38f9ff" opacity="0.9" filter="url(#glow-Mei)"/><line x1="28" y1="13" x2="52" y2="13" stroke="#fff" stroke-width="1.5"/>'

rio_hair = {
    'back': '<polygon points="20,20 12,38 22,34" fill="#ffe14d"/><polygon points="60,20 68,38 58,34" fill="#ffe14d"/>',
    'front': '<path d="M 18 18 Q 40 6 62 18 L 56 24 L 46 20 L 40 26 L 34 20 L 24 24 Z" fill="#ffe14d"/>'
}
rio_acc = '<rect x="25" y="44" width="30" height="7" rx="3" fill="#130826" stroke="#ff3cac" stroke-width="1.5"/><circle cx="33" cy="47" r="4" fill="#38f9ff"/><circle cx="47" cy="47" r="4" fill="#38f9ff"/>'

iki_hair = {
    'back': '<rect x="18" y="24" width="44" height="30" rx="6" fill="#38f9ff"/>',
    'front': '<path d="M 20 18 Q 40 12 60 18 Q 54 28 48 24 Q 40 29 32 24 Q 26 28 20 18 Z" fill="#38f9ff"/>'
}
iki_acc = '<polygon points="22,14 16,2 28,10" fill="#120521" stroke="#38f9ff" stroke-width="2"/><polygon points="58,14 64,2 52,10" fill="#120521" stroke="#38f9ff" stroke-width="2"/><polygon points="21,11 18,5 25,10" fill="#ff3cac"/><polygon points="59,11 62,5 55,10" fill="#ff3cac"/>'

sai_hair = {
    'back': '<rect x="20" y="24" width="40" height="26" rx="4" fill="#7b5cff"/>',
    'front': '<path d="M 20 18 Q 40 10 60 18 L 55 26 L 42 22 L 35 28 L 22 24 Z" fill="#7b5cff"/>'
}
sai_acc = '<circle cx="49" cy="31" r="7" fill="none" stroke="#ffe14d" stroke-width="2"/><line x1="42" y1="31" x2="56" y2="31" stroke="#ffe14d" stroke-width="1"/><circle cx="49" cy="31" r="2" fill="#ff3cac"/>'

mimi_hair = {
    'back': '<path d="M 16 26 Q 8 46 22 56 L 26 30 Z" fill="#ff71ce"/><path d="M 64 26 Q 72 46 58 56 L 54 30 Z" fill="#ff71ce"/>',
    'front': '<path d="M 18 18 Q 40 10 62 18 Q 54 27 46 23 Q 40 28 34 23 Q 26 27 18 18 Z" fill="#ff71ce"/>'
}
mimi_acc = '<rect x="14" y="24" width="7" height="16" rx="3" fill="#ffe14d"/><rect x="59" y="24" width="7" height="16" rx="3" fill="#ffe14d"/><path d="M 17 24 Q 40 6 63 24" stroke="#ffe14d" stroke-width="3" fill="none"/><line x1="21" y1="36" x2="33" y2="40" stroke="#38f9ff" stroke-width="2"/><circle cx="34" cy="40" r="3" fill="#ff3cac"/>'

chars = [
    ("crew-mei.svg", "Mei", "#ff3cac", "#38f9ff", "#38f9ff", mei_hair, mei_acc),
    ("crew-rio.svg", "Rio", "#ffe14d", "#ff3cac", "#ff3cac", rio_hair, rio_acc),
    ("crew-iki.svg", "Iki", "#38f9ff", "#ff3cac", "#ff3cac", iki_hair, iki_acc),
    ("crew-sai.svg", "Sai", "#7b5cff", "#ffe14d", "#ffe14d", sai_hair, sai_acc),
    ("crew-mimi.svg", "Mimi", "#ff71ce", "#38f9ff", "#38f9ff", mimi_hair, mimi_acc),
]

for filename, name, hair, eye, accent, hstyle, acc in chars:
    svg_code = generate_character_sprite(name, hair, eye, accent, hstyle, acc)
    path = os.path.join(SPRITE_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg_code.strip())
    print(f"Generated cute sprite: {filename}")

# Cute Cyberpunk Glitter Cursor (Sparkle Star + Heart)
cute_cursor_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <filter id="c-glow">
      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#ff3cac"/>
    </filter>
  </defs>
  <!-- Sparkle Wand / Cute Cursor Core -->
  <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" fill="#ffffff" filter="url(#c-glow)"/>
  <polygon points="12,5 14,10 19,12 14,14 12,19 10,14 5,12 10,10" fill="#38f9ff"/>
  <circle cx="12" cy="12" r="3" fill="#ffe14d"/>
  <!-- Little heart ornament -->
  <path d="M 21 21 h2 v-1 h1 v1 h1 v-1 h1 v1 h1 v2 h-1 v1 h-1 v1 h-1 v1 h-1 v-1 h-1 v-1 h-1 v-1 h-1 v-2 z" fill="#ff3cac"/>
</svg>"""

with open(os.path.join(IMG_DIR, "cute-cursor.svg"), "w", encoding="utf-8") as f:
    f.write(cute_cursor_svg.strip())

print("All cute character sprites and cursor created!")

