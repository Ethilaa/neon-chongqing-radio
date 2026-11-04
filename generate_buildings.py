"""
generate_buildings.py
Generates realistic Hongyadong multi-tier buildings, storefronts, and river bench assets.
"""
import os

BASE_DIR = r"C:\Users\USER\.gemini\antigravity\scratch\neon-chongqing-radio"
IMG_DIR = os.path.join(BASE_DIR, "assets", "images")

# 1. Real Hongyadong Architectural Building Facade (600x480)
hongyadong_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 480" width="600" height="480">
  <defs>
    <filter id="lanternGlow">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#ff0055"/>
    </filter>
    <filter id="neonGold">
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ffe14d"/>
    </filter>
  </defs>

  <!-- Level 1 Base (Ground Storefronts) -->
  <rect x="20" y="320" width="560" height="160" fill="#14092b" stroke="#38f9ff" stroke-width="2"/>
  
  <!-- Cyber Ramen & Hotpot Shopfront -->
  <rect x="40" y="350" width="160" height="130" fill="#0c041d" stroke="#ff3cac" stroke-width="2"/>
  <!-- Traditional Noren curtains -->
  <rect x="45" y="355" width="35" height="45" fill="#ff3cac"/>
  <rect x="85" y="355" width="35" height="45" fill="#ff3cac"/>
  <rect x="125" y="355" width="35" height="45" fill="#ff3cac"/>
  <rect x="165" y="355" width="30" height="45" fill="#ff3cac"/>
  <text x="120" y="385" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="16" fill="#fff">老火鍋</text>
  <!-- Shop glowing interior -->
  <rect x="50" y="410" width="140" height="65" fill="#ffe14d" opacity="0.3"/>
  <line x1="50" y1="410" x2="190" y2="410" stroke="#ffe14d" stroke-width="2"/>

  <!-- Arcade & Cyber Deck Shopfront -->
  <rect x="230" y="340" width="180" height="140" fill="#090217" stroke="#38f9ff" stroke-width="2"/>
  <rect x="245" y="348" width="150" height="28" fill="#170836" stroke="#ffe14d" stroke-width="1.5"/>
  <text x="320" y="367" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="9" fill="#ffe14d">ARCADE ✦ 2077</text>
  <!-- Arcade window with game glow -->
  <rect x="245" y="385" width="150" height="85" fill="#120629" stroke="#38f9ff" stroke-width="1"/>
  <circle cx="280" cy="420" r="14" fill="#ff3cac" opacity="0.7"/>
  <circle cx="360" cy="420" r="14" fill="#38f9ff" opacity="0.7"/>

  <!-- Balcony Level 2 (Tiered Chinese Eaves) -->
  <polygon points="10,320 30,280 570,280 590,320" fill="#220e44" stroke="#ffe14d" stroke-width="2"/>
  <!-- Curved Chinese Pagoda Eaves -->
  <path d="M 0 320 Q 30 295 80 295 L 520 295 Q 570 295 600 320" stroke="#ffe14d" stroke-width="4" fill="none" filter="url(#neonGold)"/>
  
  <!-- Tier 2 Building Body -->
  <rect x="60" y="160" width="480" height="120" fill="#160830" stroke="#7b5cff" stroke-width="2"/>
  
  <!-- Wooden Railings & Balcony Walkway -->
  <line x1="60" y1="270" x2="540" y2="270" stroke="#ffe14d" stroke-width="3"/>
  <g stroke="#ff3cac" stroke-width="1.5">
    <line x1="80" y1="250" x2="80" y2="270"/>
    <line x1="120" y1="250" x2="120" y2="270"/>
    <line x1="160" y1="250" x2="160" y2="270"/>
    <line x1="200" y1="250" x2="200" y2="270"/>
    <line x1="240" y1="250" x2="240" y2="270"/>
    <line x1="280" y1="250" x2="280" y2="270"/>
    <line x1="320" y1="250" x2="320" y2="270"/>
    <line x1="360" y1="250" x2="360" y2="270"/>
    <line x1="400" y1="250" x2="400" y2="270"/>
    <line x1="440" y1="250" x2="440" y2="270"/>
    <line x1="480" y1="250" x2="480" y2="270"/>
    <line x1="520" y1="250" x2="520" y2="270"/>
  </g>

  <!-- Hanging Glowing Red/Pink Lanterns -->
  <g filter="url(#lanternGlow)">
    <circle cx="100" cy="305" r="12" fill="#ff0055"/>
    <circle cx="200" cy="305" r="12" fill="#ff0055"/>
    <circle cx="300" cy="305" r="12" fill="#ff0055"/>
    <circle cx="400" cy="305" r="12" fill="#ff0055"/>
    <circle cx="500" cy="305" r="12" fill="#ff0055"/>
  </g>

  <!-- Level 3 Upper Pagoda Roof -->
  <path d="M 40 160 Q 80 130 140 130 L 460 130 Q 520 130 560 160" stroke="#ffe14d" stroke-width="4" fill="#260f4a" filter="url(#neonGold)"/>
  
  <!-- Rooftop Garden / Observation Deck -->
  <rect x="120" y="40" width="360" height="90" fill="#110526" stroke="#38f9ff" stroke-width="2"/>
  <text x="300" y="90" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="28" fill="#38f9ff">洪崖洞</text>
  <text x="300" y="115" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="9" fill="#ff3cac">CYBER CHONGQING</text>
</svg>"""

# 2. Cozy Wooden/Neon River Bench Asset (120x80)
river_bench_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 90" width="140" height="90">
  <defs>
    <filter id="benchGlow">
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ff3cac"/>
    </filter>
    <filter id="lampGlow">
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#ffe14d"/>
    </filter>
  </defs>

  <!-- Ground Stone Pier -->
  <rect x="0" y="70" width="140" height="20" fill="#130926" stroke="#38f9ff" stroke-width="1.5"/>

  <!-- Atmospheric Streetlamp by Bench -->
  <line x1="18" y1="70" x2="18" y2="12" stroke="#2a154d" stroke-width="3"/>
  <path d="M 18 12 Q 24 6 30 10 L 30 18" stroke="#ffe14d" stroke-width="2" fill="none"/>
  <!-- Lantern Light -->
  <circle cx="30" cy="22" r="9" fill="#ffe14d" filter="url(#lampGlow)" opacity="0.9"/>
  <circle cx="30" cy="22" r="4" fill="#ffffff"/>

  <!-- Wooden Cyber Bench -->
  <!-- Legs -->
  <rect x="48" y="55" width="6" height="18" rx="2" fill="#38f9ff"/>
  <rect x="106" y="55" width="6" height="18" rx="2" fill="#38f9ff"/>

  <!-- Wooden Slats Seat -->
  <rect x="42" y="48" width="76" height="10" rx="3" fill="#2b144e" stroke="#ff3cac" stroke-width="1.5" filter="url(#benchGlow)"/>
  <line x1="44" y1="53" x2="116" y2="53" stroke="#ffe14d" stroke-width="1"/>

  <!-- Bench Backrest -->
  <rect x="44" y="32" width="72" height="14" rx="3" fill="#220e42" stroke="#ff3cac" stroke-width="1.5"/>

  <!-- Cozy Plush Pillow / Cushion -->
  <ellipse cx="58" cy="47" rx="8" ry="4" fill="#ff71ce"/>

  <!-- Signboard -->
  <rect x="62" y="15" width="68" height="14" rx="3" fill="#090317" stroke="#38f9ff" stroke-width="1"/>
  <text x="96" y="25" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="6" fill="#ffe14d">RIVER VIEW</text>
</svg>"""

with open(os.path.join(IMG_DIR, "chongqing-buildings.svg"), "w", encoding="utf-8") as f:
    f.write(hongyadong_svg.strip())

with open(os.path.join(IMG_DIR, "river-bench.svg"), "w", encoding="utf-8") as f:
    f.write(river_bench_svg.strip())

print("Buildings and River Bench SVGs generated successfully!")

