# MatrixFlow Labs

> **ECE 317 — Linear Algebra Project**  
> German Jordanian University · Spring 2026

An interactive, browser-based technical report that visualises two real-world applications of Linear Algebra — **Malware Spread Modelling** (graph theory / matrix powers) and **Traffic Flow Analysis** (Gaussian elimination with free variables) — built with a tech-startup aesthetic using pure HTML5, CSS3, and vanilla JavaScript.

---

## Live Demo

Open `index.html` directly in any modern browser — no server, no build step, no dependencies.

---

## Applications

### App 1 · Malware Spread — *k*-Hop Reachability
Models a 10-node directed network as an adjacency matrix **A**.  
The cumulative reachability matrix **H = A + A² + ⋯ + Aᵏ** reveals every node reachable within *k* hops from an infected source.

- Pick any source node (S1–S10) and drag the *k* slider
- Nodes light up live as **infected** or **at-risk**
- Stats update for *Most Critical Spreader* and *Most Vulnerable Node*

### App 2 · Traffic Flow — CityBalancer
Models a 4-way intersection as a system of linear equations.  
The under-determined system has one free variable **x₂**, giving a family of solutions.

- Drag the **x₂** slider to explore every valid traffic state
- A Canvas animation shows glowing flow-dots on each road lane
- Flow values and lane speeds update in real time

---

## MATLAB Source

| File | Description |
|------|-------------|
| `main_project.m` | Full MATLAB script — both applications, formatted output |
| `KHopReachability.m` | Function: computes H matrix, most critical & most vulnerable nodes |

---

## Features

| Feature | Detail |
|---------|--------|
| Splash screen | Canvas particle-network animation |
| Dark / Light mode | CSS custom properties, one-click toggle |
| Scroll reveals | Intersection Observer–style reveal on every section |
| Print to PDF | `window.print()` with dedicated `@media print` stylesheet — clean academic output |
| Zero dependencies | No npm, no React, no CDN scripts required |

---

## Usage

```
matlab-project/
├── index.html        # Report structure
├── style.css         # Glassmorphism + dark-mode theming + print styles
├── script.js         # Canvas animations, matrix math, slider logic
├── main_project.m    # MATLAB — main script
└── KHopReachability.m# MATLAB — k-hop function
```

1. Clone or download the repo.
2. Double-click **`index.html`** (Chrome / Edge / Firefox recommended).
3. Click **"Enter the Lab"** on the splash screen.

### Export as PDF
1. Click **Print PDF** in the nav bar.
2. In the print dialog choose **Save as PDF**.
3. Enable *Background graphics* to preserve colours, or leave off for a clean black-and-white academic copy.

---

## Tech Stack

`HTML5 Canvas` · `CSS3 Custom Properties` · `Vanilla ES6 JavaScript` · `SVG` · `MATLAB R2024b`

---

## Author

| | |
|---|---|
| **Name** | Talal Jaber |
| **Student ID** | 20231502117 |
| **University** | German Jordanian University |
| **Course** | ECE 317 — Linear Algebra |
| **Also** | Founder, [Dinelink](https://github.com/Tello24jaber) |