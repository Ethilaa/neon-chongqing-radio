# 🌆 Neon Chongqing Radio ✦ Cyberpunk City & Music Station

> An interactive, retro-futuristic cyberpunk metropolis built in pure HTML5, CSS3, and Vanilla JavaScript with Web Audio API. Explore multi-district vertical architecture, leap across rooftop cracks, win prizes in the neon claw machine, sit along the Jialing River promenade to hear *Cyberpunk: Edgerunners*, and tune into an authentic pastel handheld music station!

![Neon Chongqing Skyline](assets/images/neon-chongqing-skyline-art.jpg)

---

## ✦ Core Pillars & Highlights

### 1. 🏙️ City Exploration (Multi-District Metropolis)
- **District 1 (Downtown & Arcade Alley)**: High-density vertical towers, Hongyadong multi-tier pagodas, noodle bars, holographic billboards (*Geisha*, *Kuromi*, *Cyber Idol*), and the Heart Smasher arcade.
- **District 2 (Jialing Riverwalk & Promenade)**: Shimmering waterfront reflections, luminous cruise ships with lanterns, monorail passing between buildings, and the scenic **River Pier Bench** where pressing `[E]` to sit auto-tunes the radio to **"I Really Want to Stay at Your House" by Rosa Walton (*Cyberpunk 2077 / Edgerunners*)**.
- **3D Camera Rotation**: Seamlessly toggle between panoramic **River View**, elevated **Drone Angle**, and immersive **Street Walk**, or manually rotate with `[Q]` and `[R]`.

### 2. 🕹️ Playable Arcade Mini-Games
- **Jumping Crack (Rooftop Runner)**: Sprint across skyscraper gaps, double-jump, dodge patrol drones, collect glowing coins, and set record leap distances.
- **Neon Claw Machine ("夹娃娃")**: Cyber arcade claw machine with realistic physics, drop mechanics, coin economy, and 6 collectible cyberpunk plushies.

### 3. 📻 Handheld Music Play Station (Pastel Ice-Blue Console)
- Faithful 1:1 replica of the retro handheld console with working D-Pad, A/B buttons, volume knob, speaker grilles, and LCD screen.
- **Built-in Stations & Synthesizers**:
  - *Cyberpunk Edgerunners Radio* ("I Really Want to Stay at Your House")
  - *Neon Synthwave 80s* ("Synthwave Overdrive")
  - *Chillwave Lo-Fi Beat* ("Chongqing City Nights")
- Dynamic Web Audio visualizer, ambient neon rain audio toggle, and custom local audio file upload.

---

## ⌨️ Controls

| Key | Action |
| --- | --- |
| `[A]` / `[D]` or `[←]` / `[→]` | Walk left / right |
| `[Shift]` | Cyber Sprint / Dash |
| `[Space]` or `[W]` | Jump & Double Jump (Hold in air to glide) |
| `[E]` or `[Enter]` | Sit on River Bench / Interact with Arcade Cabinets |
| `[Q]` / `[R]` | Rotate 3D Camera Perspective |
| `[M]` | Toggle Cyberpunk OS Menu |
| `[C]` | Toggle Handheld Music Console |

---

## 🚀 How to Run Locally

Because the project is completely static (no build tools, bundlers, or dependencies required), you can run it instantly using any static server or by double-clicking `index.html`:

```bash
# Option A: Using Python built-in server (Recommended for audio/CORS)
python -m http.server 8000

# Option B: Using Node.js npx serve
npx serve .
```
Then open `http://localhost:8000` in your browser!

---

## 🌐 1-Click Free Deployment (Share with Friends)

### Method 1: GitHub Pages (Free & Automatic)
1. Push this repository to GitHub.
2. In your repository on GitHub, go to **Settings** > **Pages** (on the left menu).
3. Under **Build and deployment** > **Branch**, select `main` and `/ (root)`, then click **Save**.
4. In about 30 seconds, your site is live at:
   `https://<your-username>.github.io/<your-repo-name>/`

### Method 2: Netlify Drop (10-Second Instant Share)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `neon-chongqing-radio` folder directly into your browser window.
3. You immediately get a public, SSL-secured link to share with anyone!

### Method 3: Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Keep the default settings (Framework preset: *Other*) and click **Deploy**.

---

## 🛠️ Project Structure

```
neon-chongqing-radio/
├── index.html                   # Main entry point & consolidated Cyberpunk HUD
├── README.md                    # Project documentation & deployment guide
├── .gitignore                   # Standard git ignores
├── assets/
│   ├── audio/                   # Edgerunners, Synthwave, Lo-Fi, Rain, SFX
│   ├── images/                  # Billboards, Skyline panorama, Drones, Icons
│   └── sprites/                 # Crew characters (Mei, Rio, Iki, Sai, Mimi)
├── css/
│   ├── city.css                 # 3D stage, top HUD grid, river shaders, monorail
│   ├── console.css              # Handheld music station console & LCD styles
│   ├── games.css                # Runner & Claw machine arcade styles
│   └── style.css                # Base theme, typography, splash screen, menu
└── js/
    ├── audio.js                 # Web Audio API synthesizer, rain & SFX engine
    ├── city.js                  # City rendering, physics, monorail, bench interaction
    ├── console.js               # Handheld console controls & visualizer
    ├── menu.js                  # Cyberpunk OS tabbed navigation system
    ├── game-runner.js           # Rooftop jumping arcade mini-game
    ├── game-claw.js             # Neon claw machine physics & prizes
    └── radio.js                 # Music station playlist & audio bindings
```

