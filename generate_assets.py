"""
generate_assets.py
Generates pixel-art and cyberpunk SVG assets for Neon Chongqing Radio.
"""
import os

BASE_DIR = r"C:\Users\USER\.gemini\antigravity\scratch\neon-chongqing-radio"
IMG_DIR = os.path.join(BASE_DIR, "assets", "images")
SPRITE_DIR = os.path.join(BASE_DIR, "assets", "sprites")

# 1. Billboard Anime Girl (Visor Idol)
billboard_idol = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#120826" />
      <stop offset="100%" stop-color="#2a0845" />
    </linearGradient>
    <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38f9ff" />
      <stop offset="100%" stop-color="#ff3cac" />
    </linearGradient>
    <filter id="neonGlow">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="320" height="400" fill="url(#bgGrad)"/>
  
  <!-- Cyber matrix grid background -->
  <g stroke="#38f9ff" stroke-width="0.5" opacity="0.25">
    <line x1="0" y1="50" x2="320" y2="50"/>
    <line x1="0" y1="100" x2="320" y2="100"/>
    <line x1="0" y1="150" x2="320" y2="150"/>
    <line x1="0" y1="200" x2="320" y2="200"/>
    <line x1="0" y1="250" x2="320" y2="250"/>
    <line x1="0" y1="300" x2="320" y2="300"/>
    <line x1="0" y1="350" x2="320" y2="350"/>
    <line x1="40" y1="0" x2="40" y2="400"/>
    <line x1="80" y1="0" x2="80" y2="400"/>
    <line x1="120" y1="0" x2="120" y2="400"/>
    <line x1="160" y1="0" x2="160" y2="400"/>
    <line x1="200" y1="0" x2="200" y2="400"/>
    <line x1="240" y1="0" x2="240" y2="400"/>
    <line x1="280" y1="0" x2="280" y2="400"/>
  </g>

  <!-- Giant Kanji Header -->
  <text x="20" y="45" font-family="'Press Start 2P', monospace, sans-serif" font-size="16" fill="#ffe14d" filter="url(#neonGlow)">FUTURE IDOL ✦ 01</text>
  <text x="260" y="45" font-family="sans-serif" font-size="14" fill="#38f9ff" font-weight="bold">電脳</text>

  <!-- Anime Face silhouette -->
  <g transform="translate(10, 20)">
    <!-- Hair back -->
    <path d="M 60 160 Q 30 260 70 340 L 230 340 Q 270 260 240 160 Z" fill="#20003b" />
    <path d="M 40 180 Q 20 280 60 360 L 90 360 Q 60 270 70 180 Z" fill="#ff3cac" opacity="0.6"/>
    <path d="M 260 180 Q 280 280 240 360 L 210 360 Q 240 270 230 180 Z" fill="#38f9ff" opacity="0.6"/>

    <!-- Neck & Face base -->
    <path d="M 125 240 L 125 310 Q 150 330 175 310 L 175 240 Z" fill="#fcd3b8"/>
    <path d="M 85 140 Q 150 110 215 140 Q 225 220 150 265 Q 75 220 85 140 Z" fill="#ffe7d6"/>

    <!-- Blush -->
    <ellipse cx="108" cy="195" rx="14" ry="7" fill="#ff3cac" opacity="0.35"/>
    <ellipse cx="192" cy="195" rx="14" ry="7" fill="#ff3cac" opacity="0.35"/>

    <!-- Cyber Visor / Glasses -->
    <polygon points="90,165 210,165 200,195 100,195" fill="#38f9ff" opacity="0.85" filter="url(#neonGlow)"/>
    <line x1="90" y1="168" x2="210" y2="168" stroke="#ffffff" stroke-width="2"/>
    <text x="110" y="185" font-family="'VT323', monospace" font-size="16" fill="#0a0614" font-weight="bold">TARGET ACQUIRED</text>

    <!-- Nose & Mouth -->
    <line x1="150" y1="205" x2="150" y2="212" stroke="#d49b80" stroke-width="2" stroke-linecap="round"/>
    <path d="M 142 230 Q 150 238 158 230" stroke="#ff3cac" stroke-width="3" fill="none" stroke-linecap="round"/>

    <!-- Bangs Hair -->
    <path d="M 75 145 Q 90 200 110 200 Q 130 160 150 205 Q 170 160 190 200 Q 210 200 225 145 Q 240 70 150 70 Q 60 70 75 145 Z" fill="url(#hairGrad)"/>
    
    <!-- Hair highlights & neon streaks -->
    <path d="M 100 80 Q 130 110 120 160" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
    <path d="M 180 80 Q 200 120 190 160" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.7"/>

    <!-- Cyber Headset -->
    <rect x="65" y="145" width="14" height="35" rx="4" fill="#120826" stroke="#38f9ff" stroke-width="2"/>
    <circle cx="72" cy="162" r="4" fill="#ff3cac"/>
    <rect x="221" y="145" width="14" height="35" rx="4" fill="#120826" stroke="#38f9ff" stroke-width="2"/>
    <circle cx="228" cy="162" r="4" fill="#38f9ff"/>
    <path d="M 72 145 Q 150 65 228 145" stroke="#7b5cff" stroke-width="4" fill="none"/>
  </g>

  <!-- Glowing neon banner at bottom -->
  <rect x="15" y="345" width="290" height="40" fill="#0a0614" stroke="#ff3cac" stroke-width="2"/>
  <text x="160" y="372" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="12" fill="#38f9ff">NEON PULSE 88.8</text>
  
  <!-- Scanline lines -->
  <g opacity="0.18">
    <line x1="0" y1="0" x2="320" y2="0" stroke="#fff" stroke-width="1"/>
    <line x1="0" y1="8" x2="320" y2="8" stroke="#fff" stroke-width="1"/>
    <line x1="0" y1="16" x2="320" y2="16" stroke="#fff" stroke-width="1"/>
    <line x1="0" y1="24" x2="320" y2="24" stroke="#fff" stroke-width="1"/>
    <line x1="0" y1="32" x2="320" y2="32" stroke="#fff" stroke-width="1"/>
    <line x1="0" y1="40" x2="320" y2="40" stroke="#fff" stroke-width="1"/>
    <line x1="0" y1="48" x2="320" y2="48" stroke="#fff" stroke-width="1"/>
    <line x1="0" y1="56" x2="320" y2="56" stroke="#fff" stroke-width="1"/>
    <line x1="0" y1="64" x2="320" y2="64" stroke="#fff" stroke-width="1"/>
    <line x1="0" y1="72" x2="320" y2="72" stroke="#fff" stroke-width="1"/>
    <line x1="0" y1="80" x2="320" y2="80" stroke="#fff" stroke-width="1"/>
    <line x1="0" y1="88" x2="320" y2="88" stroke="#fff" stroke-width="1"/>
  </g>
</svg>"""

# 2. Billboard Kuromi/Kakya Cyber Cat Mascot
billboard_kuromi = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 350" width="100%" height="100%">
  <defs>
    <filter id="pinkGlow">
      <feGaussianBlur stdDeviation="4" result="b1"/>
      <feMerge>
        <feMergeNode in="b1"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <linearGradient id="kBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#08020f"/>
      <stop offset="100%" stop-color="#1d0630"/>
    </linearGradient>
  </defs>
  <rect width="300" height="350" fill="url(#kBg)" stroke="#ff3cac" stroke-width="3"/>
  <rect x="8" y="8" width="284" height="334" fill="none" stroke="#7b5cff" stroke-width="1" stroke-dasharray="4,4"/>

  <!-- Top bar -->
  <text x="20" y="36" font-family="'Press Start 2P', monospace" font-size="12" fill="#ff3cac" filter="url(#pinkGlow)">✦ KAKYA / KURO ✦</text>
  <text x="240" y="36" font-family="'VT323', monospace" font-size="18" fill="#38f9ff">v2.077</text>

  <!-- Big Cat/Bat Ears -->
  <path d="M 60 140 L 40 50 L 110 90 Z" fill="#0d0417" stroke="#ff3cac" stroke-width="3" filter="url(#pinkGlow)"/>
  <polygon points="62,125 50,68 98,96" fill="#ff3cac" opacity="0.4"/>

  <path d="M 240 140 L 260 50 L 190 90 Z" fill="#0d0417" stroke="#ff3cac" stroke-width="3" filter="url(#pinkGlow)"/>
  <polygon points="238,125 250,68 202,96" fill="#ff3cac" opacity="0.4"/>

  <!-- Head Base -->
  <ellipse cx="150" cy="165" rx="85" ry="75" fill="#0d0417" stroke="#38f9ff" stroke-width="3"/>

  <!-- Jester / Demon Cat Hood points -->
  <circle cx="150" cy="85" r="14" fill="#ff3cac"/>
  <text x="150" y="90" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="10" fill="#ffffff">☠</text>

  <!-- Huge Kawaii Eyes -->
  <ellipse cx="115" cy="160" rx="20" ry="26" fill="#ffffff"/>
  <ellipse cx="115" cy="160" rx="14" ry="20" fill="#0a0614"/>
  <ellipse cx="118" cy="152" rx="6" ry="9" fill="#ff3cac"/>
  <circle cx="112" cy="150" r="4" fill="#ffffff"/>
  <circle cx="120" cy="168" r="2.5" fill="#38f9ff"/>

  <ellipse cx="185" cy="160" rx="20" ry="26" fill="#ffffff"/>
  <ellipse cx="185" cy="160" rx="14" ry="20" fill="#0a0614"/>
  <ellipse cx="182" cy="152" rx="6" ry="9" fill="#ff3cac"/>
  <circle cx="178" cy="150" r="4" fill="#ffffff"/>
  <circle cx="186" cy="168" r="2.5" fill="#38f9ff"/>

  <!-- Nose & Wicked Cute Smile -->
  <polygon points="148,185 152,185 150,188" fill="#ff3cac"/>
  <path d="M 135 198 Q 150 215 165 198 Q 150 204 135 198 Z" fill="#ff3cac"/>
  <!-- Cute little fangs -->
  <polygon points="142,199 146,199 144,204" fill="#ffffff"/>
  <polygon points="154,199 158,199 156,204" fill="#ffffff"/>

  <!-- Cheeks -->
  <ellipse cx="92" cy="180" rx="10" ry="5" fill="#ff3cac" opacity="0.6"/>
  <ellipse cx="208" cy="180" rx="10" ry="5" fill="#ff3cac" opacity="0.6"/>

  <!-- Cyber collar with bell -->
  <rect x="110" y="235" width="80" height="15" rx="5" fill="#7b5cff"/>
  <circle cx="150" cy="242" r="8" fill="#ffe14d" stroke="#0a0614" stroke-width="2"/>

  <!-- Bottom Message -->
  <rect x="25" y="280" width="250" height="42" rx="6" fill="#150a2b" stroke="#38f9ff" stroke-width="1.5"/>
  <text x="150" y="306" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="11" fill="#ffe14d">RANDOM MODE NO.08</text>
</svg>"""

# 3. Billboard Cyber Geisha / Chongqing Tower LED
billboard_geisha = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 440" width="100%" height="100%">
  <defs>
    <filter id="cyanGlow">
      <feGaussianBlur stdDeviation="3" result="b2"/>
      <feMerge>
        <feMergeNode in="b2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="280" height="440" fill="#090518" stroke="#38f9ff" stroke-width="2"/>
  
  <!-- Vertical LED Matrix column -->
  <g fill="#38f9ff" opacity="0.3">
    <rect x="10" y="10" width="260" height="420" fill="none" stroke="#7b5cff" stroke-width="1"/>
  </g>

  <!-- Big Red Sun Motif behind Geisha -->
  <circle cx="140" cy="180" r="90" fill="#ff0055" opacity="0.85" filter="url(#cyanGlow)"/>

  <!-- Head / Hair silhouette -->
  <path d="M 60 210 Q 50 100 140 80 Q 230 100 220 210 Q 230 250 200 320 L 80 320 Q 50 250 60 210 Z" fill="#05010a"/>
  
  <!-- Cyber Hair Ornaments (Kanazashi with neon light tubes) -->
  <line x1="50" y1="80" x2="110" y2="130" stroke="#38f9ff" stroke-width="4" filter="url(#cyanGlow)"/>
  <circle cx="48" cy="78" r="6" fill="#ffe14d"/>
  <line x1="230" y1="80" x2="170" y2="130" stroke="#ff3cac" stroke-width="4" filter="url(#cyanGlow)"/>
  <circle cx="232" cy="78" r="6" fill="#38f9ff"/>

  <!-- Face mask / makeup -->
  <path d="M 95 150 Q 140 135 185 150 Q 190 220 140 250 Q 90 220 95 150 Z" fill="#ffffff"/>
  
  <!-- Geisha eye makeup & cyber eyes -->
  <path d="M 105 178 Q 120 165 132 178" stroke="#ff0055" stroke-width="3" fill="none"/>
  <line x1="110" y1="180" x2="128" y2="180" stroke="#38f9ff" stroke-width="3"/>

  <path d="M 148 178 Q 160 165 175 178" stroke="#ff0055" stroke-width="3" fill="none"/>
  <line x1="152" y1="180" x2="170" y2="180" stroke="#38f9ff" stroke-width="3"/>

  <!-- Lip makeup (traditional red dot) -->
  <ellipse cx="140" cy="225" rx="6" ry="4" fill="#ff0055"/>

  <!-- Cyber circuit lines running down cheek -->
  <path d="M 140 234 L 140 260 L 160 275 L 160 300" stroke="#38f9ff" stroke-width="2" fill="none" opacity="0.9"/>
  <circle cx="160" cy="300" r="3" fill="#ffe14d"/>

  <!-- Kimono collar -->
  <path d="M 100 280 L 140 330 L 180 280 L 220 370 L 60 370 Z" fill="#13082b" stroke="#ff3cac" stroke-width="2"/>
  <line x1="100" y1="280" x2="160" y2="350" stroke="#ffe14d" stroke-width="2"/>

  <!-- Vertical Neon Calligraphy -->
  <text x="35" y="60" font-family="sans-serif" font-weight="900" font-size="24" fill="#38f9ff" filter="url(#cyanGlow)">重</text>
  <text x="35" y="90" font-family="sans-serif" font-weight="900" font-size="24" fill="#38f9ff" filter="url(#cyanGlow)">慶</text>
  <text x="35" y="120" font-family="sans-serif" font-weight="900" font-size="24" fill="#ff3cac" filter="url(#cyanGlow)">電</text>
  <text x="35" y="150" font-family="sans-serif" font-weight="900" font-size="24" fill="#ff3cac" filter="url(#cyanGlow)">脳</text>

  <rect x="20" y="385" width="240" height="40" fill="#05010a" stroke="#ffe14d" stroke-width="1.5"/>
  <text x="140" y="411" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="10" fill="#ffe14d">PLUG IN // NOW</text>
</svg>"""

# 4. Flying Police/City Drone
drone_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 70" width="100%" height="100%">
  <defs>
    <filter id="droneGlow">
      <feGaussianBlur stdDeviation="2" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Rotors -->
  <ellipse cx="25" cy="20" rx="20" ry="4" fill="#38f9ff" opacity="0.6"/>
  <line x1="5" y1="20" x2="45" y2="20" stroke="#38f9ff" stroke-width="2"/>
  <ellipse cx="95" cy="20" rx="20" ry="4" fill="#38f9ff" opacity="0.6"/>
  <line x1="75" y1="20" x2="115" y2="20" stroke="#38f9ff" stroke-width="2"/>

  <!-- Arms -->
  <line x1="25" y1="20" x2="50" y2="35" stroke="#4a5568" stroke-width="3"/>
  <line x1="95" y1="20" x2="70" y2="35" stroke="#4a5568" stroke-width="3"/>

  <!-- Main Body Chassis -->
  <polygon points="40,30 80,30 90,45 75,55 45,55 30,45" fill="#120c24" stroke="#7b5cff" stroke-width="2"/>

  <!-- Glowing Scanner Eye -->
  <circle cx="60" cy="42" r="7" fill="#ff3cac" filter="url(#droneGlow)"/>
  <circle cx="60" cy="42" r="3" fill="#ffffff"/>

  <!-- Bottom Searchlight cone -->
  <polygon points="54,52 66,52 85,70 35,70" fill="#38f9ff" opacity="0.25"/>

  <!-- Flashing red/cyan lights -->
  <circle cx="32" cy="45" r="2.5" fill="#ff3cac"/>
  <circle cx="88" cy="45" r="2.5" fill="#38f9ff"/>
</svg>"""

# 5. Flying Cyber Hovercar
hovercar_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" width="100%" height="100%">
  <defs>
    <filter id="carGlow">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Sleek Cyber Chassis -->
  <path d="M 10 38 Q 20 25 50 20 L 105 16 Q 140 18 152 35 L 145 46 L 15 46 Z" fill="#100824" stroke="#ff3cac" stroke-width="2"/>
  
  <!-- Neon Underglow Thrusters -->
  <rect x="25" y="47" width="110" height="5" rx="2" fill="#38f9ff" filter="url(#carGlow)"/>

  <!-- Cockpit Windshield -->
  <path d="M 52 22 L 95 19 L 108 30 L 45 30 Z" fill="#38f9ff" opacity="0.8"/>

  <!-- Headlight beam -->
  <polygon points="150,35 155,35 160,42 148,42" fill="#ffe14d" filter="url(#carGlow)"/>
  
  <!-- Rear thruster flame -->
  <polygon points="10,38 2,42 10,45" fill="#ff3cac" filter="url(#carGlow)"/>
</svg>"""

# 6. Character Sprites: Mei, Rio, Iki, Sai, Mimi (Pixel-Art SVG 64x64)
def make_pixel_sprite(name, color_primary, color_secondary, role, accessory_type):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" style="image-rendering: pixelated;">
  <rect width="64" height="64" fill="none"/>
  
  <!-- Shadow -->
  <ellipse cx="32" cy="60" rx="14" ry="3" fill="#000000" opacity="0.6"/>

  <!-- Legs / Boots -->
  <rect x="24" y="46" width="6" height="12" fill="#110822"/>
  <rect x="24" y="54" width="7" height="4" fill="{color_primary}"/>
  <rect x="34" y="46" width="6" height="12" fill="#110822"/>
  <rect x="33" y="54" width="7" height="4" fill="{color_primary}"/>

  <!-- Torso / Cyber Jacket -->
  <rect x="22" y="30" width="20" height="18" rx="2" fill="{color_secondary}"/>
  <rect x="27" y="32" width="10" height="14" fill="#0f051d"/>
  <line x1="32" y1="32" x2="32" y2="44" stroke="{color_primary}" stroke-width="2"/>

  <!-- Arms -->
  <rect x="18" y="32" width="5" height="14" fill="{color_secondary}"/>
  <rect x="41" y="32" width="5" height="14" fill="{color_secondary}"/>
  <!-- Gloves -->
  <rect x="17" y="43" width="6" height="4" fill="{color_primary}"/>
  <rect x="41" y="43" width="6" height="4" fill="{color_primary}"/>

  <!-- Neck & Head -->
  <rect x="29" y="27" width="6" height="4" fill="#fed3b7"/>
  <rect x="24" y="14" width="16" height="14" rx="2" fill="#ffe2cf"/>

  <!-- Face: Eyes -->
  <rect x="26" y="20" width="3" height="4" fill="#0d0417"/>
  <rect x="27" y="20" width="1" height="2" fill="#ffffff"/>
  <rect x="35" y="20" width="3" height="4" fill="#0d0417"/>
  <rect x="36" y="20" width="1" height="2" fill="#ffffff"/>

  <!-- Hair -->
  <rect x="22" y="10" width="20" height="8" rx="3" fill="{color_primary}"/>
  <rect x="20" y="14" width="5" height="12" fill="{color_primary}"/>
  <rect x="39" y="14" width="5" height="12" fill="{color_primary}"/>
  <!-- Hair bangs -->
  <rect x="25" y="14" width="14" height="4" fill="{color_primary}"/>

  <!-- Accessory based on character -->
  <!-- Cat ears / headphones / visor -->
  <rect x="21" y="8" width="5" height="5" fill="{color_secondary}"/>
  <rect x="38" y="8" width="5" height="5" fill="{color_secondary}"/>
  <circle cx="32" cy="18" r="2" fill="{color_primary}"/>
</svg>"""

mei_svg = make_pixel_sprite("Mei", "#ff3cac", "#7b5cff", "Rooftop Courier", "wings")
rio_svg = make_pixel_sprite("Rio", "#ffe14d", "#ff3cac", "Street Racer", "goggles")
iki_svg = make_pixel_sprite("Iki", "#38f9ff", "#7b5cff", "Signal Hacker", "cat_ears")
sai_svg = make_pixel_sprite("Sai", "#7b5cff", "#ff0055", "Gun Tinkerer", "chrome_arm")
mimi_svg = make_pixel_sprite("Mimi", "#ff71ce", "#38f9ff", "Night-Radio Host", "mic")

# Write all SVGs
files = {
    os.path.join(IMG_DIR, "billboard-idol.svg"): billboard_idol,
    os.path.join(IMG_DIR, "billboard-kuromi.svg"): billboard_kuromi,
    os.path.join(IMG_DIR, "billboard-geisha.svg"): billboard_geisha,
    os.path.join(IMG_DIR, "drone.svg"): drone_svg,
    os.path.join(IMG_DIR, "hovercar.svg"): hovercar_svg,
    os.path.join(SPRITE_DIR, "crew-mei.svg"): mei_svg,
    os.path.join(SPRITE_DIR, "crew-rio.svg"): rio_svg,
    os.path.join(SPRITE_DIR, "crew-iki.svg"): iki_svg,
    os.path.join(SPRITE_DIR, "crew-sai.svg"): sai_svg,
    os.path.join(SPRITE_DIR, "crew-mimi.svg"): mimi_svg,
}

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())

print(f"Successfully generated {len(files)} SVG assets!")

