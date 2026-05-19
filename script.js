// MatrixFlow Labs - Interactive Engine

document.addEventListener("DOMContentLoaded", () => {
    /* -----------------------------------------------------------
       Splash Screen Mechanics
    ----------------------------------------------------------- */
    const canvas = document.getElementById('splash-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Particle Matrix Web
    const particles = [];
    const numParticles = Math.min(100, Math.floor(window.innerWidth / 15));
    for(let i=0; i<numParticles; i++){
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 2 + 1
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        const isLight = document.body.classList.contains('light-mode');
        ctx.fillStyle = isLight ? '#000000' : '#00f0ff';
        
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Lines
        ctx.lineWidth = 0.5;
        for(let i=0; i<particles.length; i++) {
            for(let j=i+1; j<particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if(dist < 120) {
                    ctx.strokeStyle = isLight 
                        ? `rgba(0,0,0, ${1 - dist/120})` 
                        : `rgba(0, 240, 255, ${0.4 * (1 - dist/120)})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Enter Platform
    document.getElementById("enter-btn").addEventListener("click", () => {
        const splash = document.getElementById("splash");
        const main = document.getElementById("main-content");
        
        splash.style.opacity = 0;
        setTimeout(() => {
            splash.style.display = "none";
            main.classList.remove("hidden");
            
            // Trigger reveals
            setTimeout(revealSections, 50);
        }, 1000);
    });

    /* -----------------------------------------------------------
       Core UI Interactions (Theme, Print)
    ----------------------------------------------------------- */
    const themeBtn = document.getElementById("theme-toggle");
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        document.body.classList.toggle("dark-mode");
        themeBtn.textContent = document.body.classList.contains("light-mode") ? "🌙" : "☀️";
        drawNetworkLines();
    });

    document.getElementById("print-btn").addEventListener("click", () => { window.print(); });

    // Scroll Reveal
    const reveals = document.querySelectorAll(".reveal");
    function revealSections() {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        reveals.forEach(rev => {
            const elementTop = rev.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                rev.classList.add("active");
            }
        });
    }
    window.addEventListener("scroll", revealSections);


    /* -----------------------------------------------------------
       App 1: The Malware Map (Graph Theory)
    ----------------------------------------------------------- */
    // A 10-node adjacency matrix simulated randomly but deterministically for consistent UI UX
    const Adjacency = [
        [0,1,0,0,0,1,0,0,0,0], // 0
        [0,0,1,0,0,0,1,0,0,0], // 1
        [1,0,0,1,0,0,0,1,0,0], // 2
        [0,0,0,0,1,0,0,0,1,0], // 3
        [1,0,0,0,0,1,0,0,0,1], // 4
        [0,0,0,0,1,0,1,0,0,0], // 5
        [0,0,0,0,0,0,0,1,0,0], // 6
        [0,0,0,0,0,0,0,0,1,0], // 7
        [0,0,0,0,0,0,0,0,0,1], // 8
        [1,0,0,0,0,0,0,0,0,0]  // 9
    ];
    
    // Matrix Multiplication Helper
    function multiply(A, B) {
        let result = Array(10).fill(0).map(() => Array(10).fill(0));
        for(let i=0; i<10; i++)
            for(let j=0; j<10; j++)
                for(let k=0; k<10; k++)
                    result[i][j] += A[i][k] * B[k][j];
        return result;
    }

    // Add Matrices Helper
    function add(A, B) {
        let result = Array(10).fill(0).map(() => Array(10).fill(0));
        for(let i=0; i<10; i++)
            for(let j=0; j<10; j++)
                result[i][j] = A[i][j] + B[i][j];
        return result;
    }

    // Coordinates for the nodes in SVG space (0 to 100%)
    const nodeCoords = [
        {x: 10, y: 50}, {x: 30, y: 20}, {x: 30, y: 80}, {x: 50, y: 50},
        {x: 70, y: 20}, {x: 70, y: 80}, {x: 90, y: 50}, {x: 50, y: 15},
        {x: 50, y: 85}, {x: 20, y: 50}
    ];

    const nodeContainer = document.getElementById("nodes-container");
    const svgLines = document.getElementById("network-lines");
    const nodeElements = [];

    // Create DOM Nodes
    nodeCoords.forEach((c, idx) => {
        let div = document.createElement("div");
        div.className = "graph-node";
        div.style.left = c.x + "%";
        div.style.top = c.y + "%";
        div.textContent = "S" + (idx+1);
        
        // Node hover interactivity to set infection
        div.addEventListener("click", () => {
            document.getElementById("infected-node").value = idx;
            updateMalwareNetwork();
        });

        nodeElements.push(div);
        nodeContainer.appendChild(div);
    });

    // Draw SVG Lines base
    function drawNetworkLines() {
        svgLines.innerHTML = '';
        for(let i=0; i<10; i++){
            for(let j=0; j<10; j++){
                if(Adjacency[i][j] === 1) {
                    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    // Need to calculate percentages
                    line.setAttribute("x1", nodeCoords[i].x + "%");
                    line.setAttribute("y1", nodeCoords[i].y + "%");
                    line.setAttribute("x2", nodeCoords[j].x + "%");
                    line.setAttribute("y2", nodeCoords[j].y + "%");
                    line.setAttribute("class", "graph-edge");
                    line.id = `edge-${i}-${j}`;
                    
                    // Add arrowhead marker (optional)
                    svgLines.appendChild(line);
                }
            }
        }
    }
    
    // Animate Number value function (for stats)
    function animateValue(obj, start, end, duration) {
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateMalwareNetwork() {
        const root = parseInt(document.getElementById("infected-node").value);
        const k = parseInt(document.getElementById("k-hops").value);
        document.getElementById("k-val").textContent = k;

        // Calculate H matrix
        let H = Array(10).fill(0).map(() => Array(10).fill(0));
        let Apow = Adjacency;
        for(let p = 1; p <= k; p++) {
            if(p > 1) Apow = multiply(Apow, Adjacency);
            H = add(H, Apow);
        }

        let atRiskCount = 0;
        
        // Reset Nodes & Edges
        nodeElements.forEach(n => {
            n.classList.remove("infected", "at-risk");
        });
        
        Array.from(document.getElementsByClassName("graph-edge")).forEach(e => {
            e.classList.remove("active");
        });

        // Set Root
        nodeElements[root].classList.add("infected");

        // Set At Risk
        for(let j=0; j<10; j++){
            if(H[root][j] > 0 && root !== j) {
                nodeElements[j].classList.add("at-risk");
                atRiskCount++;
                
                // Highlight edges involved (naive highlighting for 1st hop)
                if(Adjacency[root][j] === 1) {
                    let edge = document.getElementById(`edge-${root}-${j}`);
                    if(edge) edge.classList.add("active");
                }
            }
        }

        // Stats calculation (Global)
        let rowSums = H.map(row => row.reduce((a,b)=>a+b,0));
        let colSums = Array(10).fill(0);
        for(let i=0; i<10; i++) for(let j=0; j<10; j++) colSums[j] += H[i][j];

        let mostCritical = rowSums.indexOf(Math.max(...rowSums));
        let mostVuln = colSums.indexOf(Math.max(...colSums));

        // Animate counter
        const atRiskSpan = document.getElementById("at-risk-nodes");
        const prevCount = parseInt(atRiskSpan.innerText) || 0;
        animateValue(atRiskSpan, prevCount, atRiskCount, 500);

        document.getElementById("most-critical").textContent = "S" + (mostCritical + 1);
        document.getElementById("most-vulnerable").textContent = "S" + (mostVuln + 1);
    }

    document.getElementById("k-hops").addEventListener("input", updateMalwareNetwork);
    document.getElementById("infected-node").addEventListener("change", updateMalwareNetwork);

    drawNetworkLines();
    updateMalwareNetwork();


    /* -----------------------------------------------------------
       App 2: CityBalancer — Canvas Traffic Visualization
    ----------------------------------------------------------- */
    const x2slider = document.getElementById("x2-slider");
    const trafficCanvas = document.getElementById("traffic-canvas");
    const tctx = trafficCanvas.getContext("2d");

    const ROUTE_COLORS = { x1: '#ff2a85', x2: '#00f0ff', x3: '#10e59a', x4: '#b678ff' };
    let trafficState = { x1: 170, x2: 80, x3: 20, x4: 280 };
    let trafficDots = { x1: [], x2: [], x3: [], x4: [] };

    function syncDotCount(route, target) {
        const arr = trafficDots[route];
        while (arr.length < target) arr.push({ pos: Math.random() });
        if (arr.length > target) arr.splice(target);
    }

    function resizeTrafficCanvas() {
        const p = trafficCanvas.parentElement;
        if (p.clientWidth > 0 && p.clientHeight > 0) {
            trafficCanvas.width = p.clientWidth;
            trafficCanvas.height = p.clientHeight;
        }
    }

    function drawTrafficFrame() {
        resizeTrafficCanvas();
        const W = trafficCanvas.width, H = trafficCanvas.height;
        if (!W || !H) { requestAnimationFrame(drawTrafficFrame); return; }

        const cx = W / 2, cy = H / 2, roadW = 50, dotR = 5;
        const isDark = document.body.classList.contains('dark-mode');

        tctx.clearRect(0, 0, W, H);

        // Background
        tctx.fillStyle = isDark ? '#050b14' : '#f0f4f8';
        tctx.fillRect(0, 0, W, H);

        // Road lanes
        tctx.fillStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
        tctx.fillRect(0, cy - roadW / 2, W, roadW);
        tctx.fillRect(cx - roadW / 2, 0, roadW, H);

        // Center dashes
        tctx.save();
        tctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';
        tctx.setLineDash([8, 10]);
        tctx.lineWidth = 1.5;
        tctx.beginPath(); tctx.moveTo(0, cy); tctx.lineTo(W, cy); tctx.stroke();
        tctx.beginPath(); tctx.moveTo(cx, 0); tctx.lineTo(cx, H); tctx.stroke();
        tctx.restore();

        // Cover intersection box
        tctx.fillStyle = isDark ? '#050b14' : '#f0f4f8';
        tctx.fillRect(cx - roadW / 2, cy - roadW / 2, roadW, roadW);

        function drawDot(x, y, color) {
            tctx.beginPath();
            tctx.arc(x, y, dotR, 0, Math.PI * 2);
            tctx.fillStyle = color;
            tctx.shadowBlur = 14;
            tctx.shadowColor = color;
            tctx.fill();
            tctx.shadowBlur = 0;
        }

        const baseSpeed = 0.003;

        // x1 → moves RIGHT on top lane
        trafficDots.x1.forEach(d => {
            d.pos = (d.pos + baseSpeed * (trafficState.x1 / 150)) % 1;
            drawDot(d.pos * W, cy - roadW / 4, ROUTE_COLORS.x1);
        });

        // x2 → moves LEFT on bottom lane
        trafficDots.x2.forEach(d => {
            d.pos = (d.pos + baseSpeed * (trafficState.x2 / 150)) % 1;
            drawDot((1 - d.pos) * W, cy + roadW / 4, ROUTE_COLORS.x2);
        });

        // x3 → moves DOWN on right lane
        trafficDots.x3.forEach(d => {
            d.pos = (d.pos + baseSpeed * (trafficState.x3 / 100)) % 1;
            drawDot(cx + roadW / 4, d.pos * H, ROUTE_COLORS.x3);
        });

        // x4 → moves UP on left lane
        trafficDots.x4.forEach(d => {
            d.pos = (d.pos + baseSpeed * (trafficState.x4 / 150)) % 1;
            drawDot(cx - roadW / 4, (1 - d.pos) * H, ROUTE_COLORS.x4);
        });

        // Draw live labels
        tctx.font = 'bold 12px "JetBrains Mono", monospace';

        tctx.textAlign = 'center';
        tctx.fillStyle = ROUTE_COLORS.x1;
        tctx.fillText(`x₁ = ${trafficState.x1}`, W / 4, cy - roadW / 2 - 10);

        tctx.fillStyle = ROUTE_COLORS.x2;
        tctx.fillText(`x₂ = ${trafficState.x2}`, 3 * W / 4, cy + roadW / 2 + 18);

        tctx.textAlign = 'left';
        tctx.fillStyle = ROUTE_COLORS.x3;
        tctx.fillText(`x₃ = ${trafficState.x3}`, cx + roadW / 2 + 10, H / 4);

        tctx.textAlign = 'right';
        tctx.fillStyle = ROUTE_COLORS.x4;
        tctx.fillText(`x₄ = ${trafficState.x4}`, cx - roadW / 2 - 10, 3 * H / 4);

        requestAnimationFrame(drawTrafficFrame);
    }

    function updateTraffic() {
        const x2 = Math.min(100, parseInt(x2slider.value));
        x2slider.value = x2;
        const x1 = 250 - x2;
        const x3 = 100 - x2;
        const x4 = 200 + x2;

        document.getElementById("x2-display").textContent = x2;

        const d1 = document.getElementById("tx1");
        const d2 = document.getElementById("tx2");
        const d3 = document.getElementById("tx3");
        const d4 = document.getElementById("tx4");
        animateValue(d1, parseInt(d1.innerText) || x1, x1, 200);
        animateValue(d2, parseInt(d2.innerText) || x2, x2, 200);
        animateValue(d3, parseInt(d3.innerText) || x3, x3, 200);
        animateValue(d4, parseInt(d4.innerText) || x4, x4, 200);

        // Update canvas state — dot count scales with flow
        trafficState = { x1, x2, x3, x4 };
        syncDotCount('x1', Math.max(1, Math.min(10, Math.round(x1 / 25))));
        syncDotCount('x2', Math.min(10, Math.round(x2 / 25)));
        syncDotCount('x3', Math.min(10, Math.round(x3 / 25)));
        syncDotCount('x4', Math.max(1, Math.min(12, Math.round(x4 / 25))));
    }

    x2slider.addEventListener("input", updateTraffic);
    window.addEventListener("resize", resizeTrafficCanvas);

    // Kick off canvas loop and initialize state
    updateTraffic();
    requestAnimationFrame(drawTrafficFrame);
});