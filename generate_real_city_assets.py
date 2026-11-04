"""
generate_real_city_assets.py
Generates high-detail panoramic cyberpunk Chongqing skyline and real architectural buildings.
"""
import os
import random

BASE_DIR = r"C:\Users\USER\.gemini\antigravity\scratch\neon-chongqing-radio"
IMG_DIR = os.path.join(BASE_DIR, "assets", "images")
os.makedirs(IMG_DIR, exist_ok=True)

# 1. Panoramic Cyberpunk Chongqing Skyline (2400 x 700 px)
def generate_chongqing_skyline():
    svg = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 700" width="2400" height="700">']
    svg.append('<defs>')
    svg.append('''
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#05020d"/>
        <stop offset="60%" stop-color="#120626"/>
        <stop offset="100%" stop-color="#1e0a3d"/>
      </linearGradient>
      <linearGradient id="billboardPink" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ff3cac"/>
        <stop offset="100%" stop-color="#7b5cff"/>
      </linearGradient>
      <linearGradient id="billboardCyan" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#38f9ff"/>
        <stop offset="100%" stop-color="#0055ff"/>
      </linearGradient>
      <filter id="neonBloom">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    ''')
    svg.append('</defs>')

    # Deep sky background
    svg.append('<rect width="2400" height="700" fill="url(#skyGrad)"/>')

    # Cyber Stars & Nebula dust
    for _ in range(120):
        sx = random.randint(0, 2400)
        sy = random.randint(0, 300)
        sr = random.choice([1, 1.5, 2])
        sc = random.choice(['#ffffff', '#38f9ff', '#ff3cac', '#ffe14d'])
        svg.append(f'<circle cx="{sx}" cy="{sy}" r="{sr}" fill="{sc}" opacity="{random.uniform(0.4, 0.9)}"/>')

    # Mountain silhouettes in background
    svg.append('''<path d="M 0 450 Q 300 280 600 420 T 1200 360 T 1800 400 T 2400 340 L 2400 700 L 0 700 Z" fill="#0c041c" opacity="0.6"/>''')

    # Distant Skyscrapers with realistic window grids
    towers = [
        # (x, width, height, color, name)
        (40, 110, 480, '#100724', 'tower1'),
        (160, 140, 560, '#170b33', 'twin_left'),
        (310, 140, 560, '#170b33', 'twin_right'),
        (460, 90, 420, '#0e0520', 'tower2'),
        (560, 160, 510, '#13082b', 'tower3'),
        (730, 120, 460, '#0f0622', 'tower4'),
        (860, 180, 580, '#190d38', 'mega1'),
        (1050, 130, 490, '#120728', 'tower5'),
        (1190, 200, 600, '#1b0e3d', 'chongqing_center'),
        (1400, 150, 530, '#14082c', 'tower6'),
        (1560, 110, 450, '#100624', 'tower7'),
        (1680, 170, 560, '#180c36', 'tower8'),
        (1860, 130, 470, '#110726', 'tower9'),
        (2000, 180, 540, '#160a32', 'tower10'),
        (2190, 160, 500, '#120727', 'tower11')
    ]

    for x, w, h, col, t_id in towers:
        y = 700 - h
        # Building silhouette
        svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{col}" stroke="#2a1254" stroke-width="1"/>')
        
        # Rooftop spire / antenna
        spire_x = x + w // 2
        svg.append(f'<line x1="{spire_x}" y1="{y}" x2="{spire_x}" y2="{y-35}" stroke="#4a2580" stroke-width="2"/>')
        svg.append(f'<circle cx="{spire_x}" cy="{y-35}" r="3" fill="#ff0055" filter="url(#neonBloom)"/>')

        # Vertical neon accent strip
        svg.append(f'<line x1="{x+6}" y1="{y+10}" x2="{x+6}" y2="{y+h-50}" stroke="#38f9ff" stroke-width="1.5" opacity="0.8"/>')
        if w > 120:
            svg.append(f'<line x1="{x+w-6}" y1="{y+10}" x2="{x+w-6}" y2="{y+h-50}" stroke="#ff3cac" stroke-width="1.5" opacity="0.8"/>')

        # Realistic lit windows grid
        rows = h // 18
        cols = w // 14
        for r in range(1, rows - 2):
            for c in range(1, cols - 1):
                wx = x + c * 14
                wy = y + r * 18 + 6
                # random window colors: cyan, yellow, pink, dim
                rand = random.random()
                if rand < 0.28:
                    svg.append(f'<rect x="{wx}" y="{wy}" width="7" height="9" rx="1" fill="#38f9ff" opacity="{random.uniform(0.6, 0.95)}"/>')
                elif rand < 0.45:
                    svg.append(f'<rect x="{wx}" y="{wy}" width="7" height="9" rx="1" fill="#ffe14d" opacity="{random.uniform(0.6, 0.95)}"/>')
                elif rand < 0.60:
                    svg.append(f'<rect x="{wx}" y="{wy}" width="7" height="9" rx="1" fill="#ff3cac" opacity="{random.uniform(0.6, 0.95)}"/>')
                elif rand < 0.85:
                    svg.append(f'<rect x="{wx}" y="{wy}" width="7" height="9" rx="1" fill="#ffffff" opacity="{random.uniform(0.4, 0.8)}"/>')
                else:
                    svg.append(f'<rect x="{wx}" y="{wy}" width="7" height="9" rx="1" fill="#080212" opacity="0.8"/>')

    # GIANT ANIME LED BILLBOARDS ON SKYLINE (Like PDF Pages 1, 2, 8, 9, 10)
    # Billboard 1: Twin Towers LED Matrix (Left)
    svg.append('''
      <rect x="175" y="240" width="110" height="220" rx="4" fill="#05010d" stroke="#38f9ff" stroke-width="2"/>
      <rect x="180" y="245" width="100" height="210" fill="url(#billboardCyan)" opacity="0.85"/>
      <circle cx="230" cy="310" r="32" fill="#fff" opacity="0.9"/>
      <ellipse cx="230" cy="315" rx="20" ry="24" fill="#120526"/>
      <line x1="218" y1="310" x2="228" y2="310" stroke="#38f9ff" stroke-width="3"/>
      <line x1="232" y1="310" x2="242" y2="310" stroke="#ff3cac" stroke-width="3"/>
      <text x="230" y="375" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="9" fill="#ffe14d">NEON IDOL</text>
      <text x="230" y="395" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#ffffff">重慶電波</text>
    ''')

    # Billboard 2: Central Tower Huge Anime Face (Like PDF Page 8 & 9)
    svg.append('''
      <rect x="875" y="220" width="150" height="250" rx="6" fill="#05010d" stroke="#ff3cac" stroke-width="3"/>
      <rect x="880" y="225" width="140" height="240" fill="url(#billboardPink)" opacity="0.9"/>
      <circle cx="950" cy="290" r="42" fill="#ffe7d6"/>
      <path d="M 910 270 Q 950 220 990 270 Q 980 320 950 320 Q 920 320 910 270 Z" fill="#20003b"/>
      <ellipse cx="935" cy="290" rx="8" ry="11" fill="#38f9ff"/>
      <circle cx="934" cy="288" r="3" fill="#fff"/>
      <ellipse cx="965" cy="290" rx="8" ry="11" fill="#38f9ff"/>
      <circle cx="964" cy="288" r="3" fill="#fff"/>
      <path d="M 942 308 Q 950 314 958 308" stroke="#ff0055" stroke-width="2" fill="none"/>
      <rect x="885" y="420" width="130" height="32" fill="#080214" stroke="#ffe14d" stroke-width="1.5"/>
      <text x="950" y="442" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="9" fill="#ffe14d">88.8 FM LIVE</text>
    ''')

    # Billboard 3: Vertical Calligraphy Sign (Right)
    svg.append('''
      <rect x="1700" y="260" width="40" height="180" rx="4" fill="#080214" stroke="#ffe14d" stroke-width="2"/>
      <text x="1720" y="300" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="22" fill="#ff3cac" filter="url(#neonBloom)">危</text>
      <text x="1720" y="340" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="22" fill="#ff3cac" filter="url(#neonBloom)">険</text>
      <text x="1720" y="380" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="22" fill="#38f9ff" filter="url(#neonBloom)">電</text>
      <text x="1720" y="420" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="22" fill="#38f9ff" filter="url(#neonBloom)">玩</text>
    ''')

    # Chongqing Grand Bridge Crossing River
    svg.append('''
      <!-- Bridge Pillars -->
      <rect x="520" y="460" width="22" height="200" fill="#14082c" stroke="#38f9ff" stroke-width="1"/>
      <rect x="1350" y="460" width="22" height="200" fill="#14082c" stroke="#38f9ff" stroke-width="1"/>
      
      <!-- Bridge Deck -->
      <polygon points="0,520 2400,520 2400,545 0,545" fill="#180b38" stroke="#ff3cac" stroke-width="2"/>
      
      <!-- Suspension Cables -->
      <line x1="531" y1="460" x2="200" y2="520" stroke="#38f9ff" stroke-width="1.5" opacity="0.6"/>
      <line x1="531" y1="460" x2="900" y2="520" stroke="#38f9ff" stroke-width="1.5" opacity="0.6"/>
      <line x1="1361" y1="460" x2="900" y2="520" stroke="#ff3cac" stroke-width="1.5" opacity="0.6"/>
      <line x1="1361" y1="460" x2="1800" y2="520" stroke="#ff3cac" stroke-width="1.5" opacity="0.6"/>

      <!-- Traffic Light Streams on Bridge -->
      <line x1="0" y1="532" x2="2400" y2="532" stroke="#ff3cac" stroke-width="3" stroke-dasharray="30, 20" opacity="0.9"/>
      <line x1="0" y1="538" x2="2400" y2="538" stroke="#ffe14d" stroke-width="2.5" stroke-dasharray="25, 30" opacity="0.9"/>
    ''')

    svg.append('</svg>')
    return '\n'.join(svg)

path = os.path.join(IMG_DIR, "skyline-chongqing.svg")
with open(path, "w", encoding="utf-8") as f:
    f.write(generate_chongqing_skyline())

print(f"Generated realistic skyline: {path}")

