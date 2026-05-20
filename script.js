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
        ctx.fillStyle = '#00f0ff';
        
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
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.4 * (1 - dist/120)})`;
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
       Core UI Interactions
    ----------------------------------------------------------- */
    // (theme toggle and PDF download removed)
    if (false) {
        const btn = document.getElementById("print-btn");
        btn.textContent = "Generating\u2026";
        btn.disabled = true;

        const css = `
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.65; color: #000; background: #fff; }
            .pg { padding: 22mm 22mm 18mm 28mm; }
            /* Title page */
            .title-page { text-align: center; padding: 55mm 20mm 35mm; page-break-after: always; }
            .title-page .uni { font-size: 13pt; font-weight: bold; margin-bottom: 3mm; }
            .title-page .dept { font-size: 11pt; margin-bottom: 18mm; color: #333; }
            .title-page h1 { font-size: 17pt; font-weight: bold; line-height: 1.45; margin-bottom: 7mm; }
            .title-page .course-line { font-size: 11.5pt; border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; padding: 3mm 0; margin-bottom: 18mm; }
            .meta { margin: 0 auto; border-collapse: collapse; text-align: left; }
            .meta td { padding: 2mm 5mm; font-size: 11pt; }
            .meta td:first-child { font-weight: bold; }
            /* TOC */
            .toc { page-break-after: always; }
            .toc h2, h2.sh { font-size: 13.5pt; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 2.5mm; margin-bottom: 5mm; }
            .ti { display: flex; justify-content: space-between; align-items: flex-end; padding: 1.5mm 0; font-size: 11pt; border-bottom: 1px dotted #bbb; }
            .ti.sub { padding-left: 7mm; font-size: 10.5pt; }
            /* Sections */
            h3.sh3 { font-size: 11.5pt; font-weight: bold; margin: 5mm 0 2.5mm; }
            p { margin-bottom: 3mm; text-align: justify; }
            ul, ol { padding-left: 6mm; margin-bottom: 3mm; }
            li { margin-bottom: 1.5mm; }
            .section { margin-bottom: 7mm; }
            .pb { page-break-before: always; }
            /* Abstract */
            .abstract { border: 1px solid #555; padding: 4mm 6mm; margin-bottom: 8mm; page-break-inside: avoid; }
            .abstract h3 { font-size: 11pt; font-weight: bold; text-align: center; margin-bottom: 2.5mm; }
            /* Math / code */
            .math { background: #f7f7f7; border-left: 3px solid #555; padding: 2.5mm 5mm; margin: 2mm 0 4mm; font-family: 'Courier New', monospace; font-size: 10.5pt; white-space: pre; page-break-inside: avoid; }
            .code { background: #f5f5f5; border: 1px solid #ccc; padding: 3mm 4mm; font-family: 'Courier New', monospace; font-size: 9.5pt; line-height: 1.55; margin: 2mm 0 4mm; white-space: pre-wrap; page-break-inside: avoid; }
            code { font-family: 'Courier New', monospace; font-size: 10pt; background: #f0f0f0; padding: 0 2px; }
            /* Tables */
            .tbl-wrap { margin: 3mm 0 2mm; page-break-inside: avoid; }
            table.dt { border-collapse: collapse; width: 100%; font-size: 10.5pt; }
            table.dt th { background: #e8e8e8; border: 1px solid #999; padding: 2mm 3mm; text-align: center; font-weight: bold; }
            table.dt td { border: 1px solid #bbb; padding: 2mm 3mm; text-align: center; }
            table.mx { border-collapse: collapse; margin: 0 auto; font-family: 'Courier New', monospace; font-size: 10pt; border-left: 2.5px solid #000; border-right: 2.5px solid #000; }
            table.mx td { padding: 1.5mm 4mm; text-align: right; min-width: 20px; }
            .mx-wrap { text-align: center; margin: 3mm 0 2mm; page-break-inside: avoid; }
            .cap { font-size: 9.5pt; color: #444; font-style: italic; text-align: center; margin: 1.5mm 0 4mm; }
            /* References */
            ol.refs { padding-left: 6mm; }
            ol.refs li { margin-bottom: 2.5mm; font-size: 10.5pt; }
        `;

        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${css}</style></head><body>

<!-- TITLE PAGE -->
<div class="title-page">
  <p class="uni">German Jordanian University</p>
  <p class="dept">Faculty of Electrical Engineering &amp; Information Technology</p>
  <h1>Modeling Malware Spread and Solving Traffic Flow<br>Using Linear Algebra</h1>
  <p class="course-line">ECE 317 &mdash; Linear Algebra &nbsp;&bull;&nbsp; Startup Project Report</p>
  <table class="meta">
    <tr><td>Student</td><td>Talal Jaber</td></tr>
    <tr><td>Student ID</td><td>20231502117</td></tr>
    <tr><td>Course</td><td>ECE 317 &mdash; Linear Algebra</td></tr>
    <tr><td>Institution</td><td>German Jordanian University</td></tr>
    <tr><td>Date</td><td>May 2026</td></tr>
  </table>
</div>

<!-- ABSTRACT + TOC -->
<div class="pg">
<div class="abstract">
  <h3>Abstract</h3>
  <p>This report presents MatrixFlow Labs, a startup concept that applies linear algebra to two engineering domains: cybersecurity and urban traffic management. In the first application, a 10-node network is encoded as an adjacency matrix A &isin; &real;<sup>10&times;10</sup> and the cumulative reachability matrix H = &sum; A<sup>k</sup> is computed to identify all nodes reachable by malware within k propagation steps. In the second application, flow-conservation laws at four intersections form a linear system Ax = b with rank(A) = 3, solved via Gaussian elimination to yield one free variable and infinitely many valid traffic states. Both results demonstrate that matrix algebra provides an efficient, scalable framework for analysing complex networked systems.</p>
</div>
<div class="toc">
  <h2>Table of Contents</h2>
  <div class="ti"><span>1. Introduction</span><span>2</span></div>
  <div class="ti"><span>2. Mathematical Foundation</span><span>2</span></div>
  <div class="ti sub"><span>2.1 Adjacency Matrices</span><span>2</span></div>
  <div class="ti sub"><span>2.2 Matrix Powers and k-hop Reachability</span><span>2</span></div>
  <div class="ti sub"><span>2.3 Conservation of Flow</span><span>3</span></div>
  <div class="ti sub"><span>2.4 Gaussian Elimination</span><span>3</span></div>
  <div class="ti sub"><span>2.5 Rank and Free Variables</span><span>3</span></div>
  <div class="ti"><span>3. Application I &mdash; Cybersecurity Network Analysis</span><span>4</span></div>
  <div class="ti sub"><span>3.1 Network Model and Adjacency Matrix</span><span>4</span></div>
  <div class="ti sub"><span>3.2 Reachability Matrix Computation</span><span>4</span></div>
  <div class="ti sub"><span>3.3 Results and Analysis</span><span>5</span></div>
  <div class="ti"><span>4. Application II &mdash; Urban Traffic Flow</span><span>5</span></div>
  <div class="ti sub"><span>4.1 Intersection Model</span><span>5</span></div>
  <div class="ti sub"><span>4.2 System Formulation</span><span>6</span></div>
  <div class="ti sub"><span>4.3 Gaussian Elimination and RREF</span><span>6</span></div>
  <div class="ti sub"><span>4.4 Free Variable and Solution Set</span><span>7</span></div>
  <div class="ti"><span>5. MATLAB Implementation</span><span>7</span></div>
  <div class="ti"><span>6. Conclusion</span><span>8</span></div>
  <div class="ti"><span>7. References</span><span>8</span></div>
</div>
</div>

<!-- SECTION 1 -->
<div class="pg pb">
<div class="section">
  <h2 class="sh">1. Introduction</h2>
  <p>Modern engineering systems &mdash; from corporate computer networks to urban road infrastructure &mdash; consist of large numbers of interconnected nodes. Analysing the behaviour of these systems manually is computationally infeasible at scale. However, a powerful abstraction exists: any network can be encoded as a matrix, and the behaviour of the entire system can be studied through well-defined matrix operations.</p>
  <p>Linear algebra provides both the theoretical foundation and the computational tools for two structurally analogous problems. In cybersecurity, determining which servers a malware can infect within k propagation steps is equivalent to computing powers of an adjacency matrix and summing the results. In urban traffic engineering, the requirement that vehicle flow is conserved at every intersection produces a system of linear equations Ax = b, solvable by Gaussian elimination.</p>
  <p>This report documents the mathematical formulation, step-by-step solution, and MATLAB implementation of both applications, collectively forming the MatrixFlow Labs startup concept.</p>
</div>

<!-- SECTION 2 -->
<div class="section">
  <h2 class="sh">2. Mathematical Foundation</h2>
  <h3 class="sh3">2.1 Adjacency Matrices</h3>
  <p>A directed graph G = (V, E) with n nodes is encoded as an n &times; n adjacency matrix A, where entry A<sub>ij</sub> = 1 if a directed edge exists from node i to node j, and A<sub>ij</sub> = 0 otherwise. This binary matrix is the foundational data structure from which all reachability information is derived. For an undirected graph, A is symmetric: A<sub>ij</sub> = A<sub>ji</sub>.</p>

  <h3 class="sh3">2.2 Matrix Powers and k-hop Reachability</h3>
  <p>A fundamental result in graph theory states that the entry (A<sup>k</sup>)<sub>ij</sub> counts the number of distinct directed walks of exactly k steps from node i to node j. To determine whether any path of <em>at most</em> k hops exists, the cumulative reachability matrix H is defined as:</p>
  <div class="math">    H = A + A&sup2; + A&sup3; + &hellip; + A&sup k;</div>
  <p>If H<sub>ij</sub> &gt; 0, node j is reachable from node i within k steps. This is directly applicable to malware modelling: every node j with H<sub>ij</sub> &gt; 0 is computationally reachable &mdash; and thus compromised &mdash; within k propagation cycles from patient-zero node i. The computation requires k &minus; 1 matrix multiplications, each costing O(n&sup3;), giving a total complexity of O(kn&sup3;).</p>

  <h3 class="sh3">2.3 Conservation of Flow</h3>
  <p>In a traffic network, Kirchhoff&rsquo;s current law adapted to vehicle flow states that at every intersection, total inflow equals total outflow. For intersection v with known external flows and unknown internal road flows x<sub>1</sub>, &hellip;, x<sub>m</sub>:</p>
  <div class="math">    &sum; F_in(v) = &sum; F_out(v)</div>
  <p>Applying this constraint at every node yields one linear equation per intersection. Collecting all equations produces the matrix system Ax = b, where A encodes the network topology, x is the vector of unknown flow rates, and b is the vector of net external flows.</p>

  <h3 class="sh3">2.4 Gaussian Elimination</h3>
  <p>Gaussian elimination transforms the augmented matrix [A | b] into Row Echelon Form (REF) via three elementary row operations: (i) row swap R<sub>i</sub> &harr; R<sub>j</sub>; (ii) row scaling R<sub>i</sub> &larr; c &middot; R<sub>i</sub>, c &ne; 0; and (iii) row replacement R<sub>i</sub> &larr; R<sub>i</sub> + c &middot; R<sub>j</sub>. Back-substitution on the REF, or further reduction to Reduced Row Echelon Form (RREF) with leading 1s in each pivot column, yields the complete solution in a directly readable form.</p>

  <h3 class="sh3">2.5 Rank and Free Variables</h3>
  <p>The rank of matrix A &mdash; rank(A) &mdash; is the number of pivot columns in its RREF. By the Rank-Nullity theorem, for an m &times; n matrix:</p>
  <div class="math">    rank(A) + nullity(A) = n     &rArr;     # free variables = n &minus; rank(A)</div>
  <p>A free variable is a non-pivot unknown that can take any real value; each choice yields a distinct valid solution. The complete solution set is an affine subspace of &real;<sup>n</sup> of dimension equal to nullity(A). Linearly dependent rows &mdash; detectable when rows reduce to zero during elimination &mdash; are the algebraic cause of free variables arising. A system with rank(A) = n has a unique solution; rank(A) &lt; n yields infinitely many.</p>
</div>
</div>

<!-- SECTION 3 -->
<div class="pg pb">
<div class="section">
  <h2 class="sh">3. Application I &mdash; Cybersecurity Network Analysis</h2>
  <h3 class="sh3">3.1 Network Model and Adjacency Matrix</h3>
  <p>The network model consists of n = 10 servers S<sub>1</sub> through S<sub>10</sub>. Directed connections between servers are captured in the following 10 &times; 10 adjacency matrix A. Entry A<sub>ij</sub> = 1 indicates that server S<sub>i</sub> has a direct outgoing connection to server S<sub>j</sub>, representing a potential malware propagation path.</p>
  <div class="mx-wrap">
    <table class="mx">
      <tr><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
      <tr><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
      <tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
      <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
      <tr><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
      <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
      <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
      <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
      <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
      <tr><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    </table>
    <p class="cap">Table 1. Adjacency matrix A &isin; &real;<sup>10&times;10</sup>. Row i encodes all direct outgoing connections from server S<sub>i</sub>.</p>
  </div>

  <h3 class="sh3">3.2 Reachability Matrix Computation</h3>
  <p>For k = 3 propagation hops, the cumulative reachability matrix is computed as H = A + A&sup2; + A&sup3;. Each matrix power A<sup>p</sup> is obtained by repeated standard matrix multiplication. The element H<sub>ij</sub> represents the total number of distinct walks of length 1, 2, or 3 from server S<sub>i</sub> to server S<sub>j</sub>. A positive value indicates that malware originating at S<sub>i</sub> can reach S<sub>j</sub> within 3 propagation cycles.</p>
  <p>A binary reachability mask R is derived by setting R<sub>ij</sub> = 1 wherever H<sub>ij</sub> &gt; 0. The diagonal is set to zero to exclude self-loops. This mask is the primary output of the threat analysis.</p>

  <h3 class="sh3">3.3 Results and Analysis</h3>
  <p>Two key security metrics are extracted directly from the binary reachability mask R:</p>
  <ul>
    <li><strong>Most Critical Node (Spreader):</strong> the server with the highest row-sum in R, i.e., the node from which the most other servers are reachable within 3 hops. This node is the highest-priority target for isolation.</li>
    <li><strong>Most Vulnerable Node:</strong> the server with the highest column-sum in R, i.e., the node reachable from the most other servers. This node is the most exposed to infection.</li>
  </ul>
  <p>In MATLAB, these are computed as <code>[~, spreader] = max(sum(R, 2))</code> and <code>[~, target] = max(sum(R, 1))</code> respectively. The interactive simulator on the web platform displays these values dynamically for any chosen patient-zero node and any k &isin; {1, 2, 3}.</p>
</div>
</div>

<!-- SECTION 4 -->
<div class="pg pb">
<div class="section">
  <h2 class="sh">4. Application II &mdash; Urban Traffic Flow</h2>
  <h3 class="sh3">4.1 Intersection Model</h3>
  <p>A simplified urban grid contains four intersections A, B, C, D and four one-way road segments with unknown vehicle flow rates x<sub>1</sub>, x<sub>2</sub>, x<sub>3</sub>, x<sub>4</sub> (vehicles per minute). Traffic sensors provide the following external inflows and outflows at each node:</p>
  <div class="tbl-wrap">
    <table class="dt">
      <tr><th>Intersection</th><th>External Inflow (veh/min)</th><th>External Outflow (veh/min)</th><th>Net (In &minus; Out)</th></tr>
      <tr><td>A</td><td>80</td><td>30</td><td>+50</td></tr>
      <tr><td>B</td><td>20</td><td>70</td><td>&minus;50</td></tr>
      <tr><td>C</td><td>60</td><td>40</td><td>+20</td></tr>
      <tr><td>D</td><td>30</td><td>50</td><td>&minus;20</td></tr>
    </table>
    <p class="cap">Table 2. Measured external traffic flows at each intersection.</p>
  </div>

  <h3 class="sh3">4.2 System Formulation</h3>
  <p>Applying flow conservation (inflow = outflow) at each intersection yields four equations in four unknowns. Writing each equation as (sum of outflows) &minus; (sum of inflows) = net external inflow:</p>
  <div class="math">    A:   x&#x2081; &minus; x&#x2084;           = &minus;50
    B:  &minus;x&#x2081; + x&#x2082;           =  50
    C:        &minus;x&#x2082; + x&#x2083;     = &minus;20
    D:              &minus;x&#x2083; + x&#x2084; =  20</div>
  <p>In matrix form Ax = b, with augmented matrix [A | b]:</p>
  <div class="mx-wrap">
    <table class="mx">
      <tr><td> 1</td><td> 0</td><td> 0</td><td>&minus;1</td><td style="border-left:2.5px solid #000;padding-left:6px;">&minus;50</td></tr>
      <tr><td>&minus;1</td><td> 1</td><td> 0</td><td> 0</td><td style="border-left:2.5px solid #000;padding-left:6px;">  50</td></tr>
      <tr><td> 0</td><td>&minus;1</td><td> 1</td><td> 0</td><td style="border-left:2.5px solid #000;padding-left:6px;">&minus;20</td></tr>
      <tr><td> 0</td><td> 0</td><td>&minus;1</td><td> 1</td><td style="border-left:2.5px solid #000;padding-left:6px;">  20</td></tr>
    </table>
    <p class="cap">Table 3. Augmented matrix [A | b] before elimination.</p>
  </div>

  <h3 class="sh3">4.3 Gaussian Elimination and RREF</h3>
  <p>Applying the three row operations to reduce [A | b] to RREF:</p>
  <div class="math">    R&#x2082; &larr; R&#x2082; + R&#x2081;  :  [0,  1,  0, &minus;1 |   0]
    R&#x2083; &larr; R&#x2083; + R&#x2082;  :  [0,  0,  1, &minus;1 | &minus;20]
    R&#x2084; &larr; R&#x2084; + R&#x2083;  :  [0,  0,  0,  0 |   0]  &larr; linearly dependent row</div>
  <div class="mx-wrap">
    <table class="mx">
      <tr><td>1</td><td>0</td><td>0</td><td>&minus;1</td><td style="border-left:2.5px solid #000;padding-left:6px;">&minus;50</td></tr>
      <tr><td>0</td><td>1</td><td>0</td><td>&minus;1</td><td style="border-left:2.5px solid #000;padding-left:6px;">  0</td></tr>
      <tr><td>0</td><td>0</td><td>1</td><td>&minus;1</td><td style="border-left:2.5px solid #000;padding-left:6px;">&minus;20</td></tr>
      <tr><td>0</td><td>0</td><td>0</td><td> 0</td><td style="border-left:2.5px solid #000;padding-left:6px;">  0</td></tr>
    </table>
    <p class="cap">Table 4. RREF of [A | b]. Row 4 reduces to zero, confirming rank(A) = 3 and one free variable.</p>
  </div>

  <h3 class="sh3">4.4 Free Variable and Solution Set</h3>
  <p>The RREF confirms rank(A) = 3 with n = 4 unknowns. By the Rank-Nullity theorem, nullity(A) = 4 &minus; 3 = 1, so exactly one free variable exists. Column 2 (corresponding to x<sub>2</sub>) is the non-pivot column; x<sub>2</sub> = t is the free parameter. The general solution is:</p>
  <div class="math">    x&#x2081; = t &minus; 50
    x&#x2082; = t          (free)
    x&#x2083; = t &minus; 20
    x&#x2084; = t</div>
  <p>For all flows to be non-negative, t &ge; 50. Road capacity limits t &le; 100. The complete physically feasible solution set is the line segment parameterised by t &isin; [50, 100] in &real;<sup>4</sup>:</p>
  <div class="math">    x = (&minus;50, 0, &minus;20, 0)<sup>T</sup> + t&middot;(1, 1, 1, 1)<sup>T</sup>,   t &isin; [50, 100]</div>
  <p>The linear dependence of the four conservation equations is verified by noting that their sum is identically 0 = 0, meaning one equation is always redundant. This structural dependency is the precise algebraic reason the system is under-determined by one degree of freedom.</p>
</div>
</div>

<!-- SECTION 5 -->
<div class="pg pb">
<div class="section">
  <h2 class="sh">5. MATLAB Implementation</h2>
  <h3 class="sh3">5.1 Reachability Matrix (Application I)</h3>
  <div class="code">function H = computeReachability(A, k)
% Compute cumulative k-hop reachability matrix.
% H_ij > 0  iff  node j is reachable from node i in at most k steps.
    n  = size(A, 1);
    Ak = A;        % A^1
    H  = A;        % initialise cumulative sum
    for p = 2:k
        Ak = Ak * A;   % A^p via repeated multiplication  O(n^3) each
        H  = H  + Ak;  % accumulate
    end
    % Remove self-loops
    for i = 1:n,  H(i,i) = 0;  end
    % Binary mask
    R = H > 0;
    % Security metrics
    [~, mostCritical]   = max(sum(R, 2));   % row-sum  -> best spreader
    [~, mostVulnerable] = max(sum(R, 1));   % col-sum  -> most exposed
    fprintf('Most critical node  : S%d\n', mostCritical);
    fprintf('Most vulnerable node: S%d\n', mostVulnerable);
end</div>

  <h3 class="sh3">5.2 Gaussian Elimination / Traffic Flow (Application II)</h3>
  <div class="code">function solveTrafficFlow()
% Solve the 4-intersection traffic flow system Ax = b.
    A = [ 1  0  0 -1;
         -1  1  0  0;
          0 -1  1  0;
          0  0 -1  1];
    b = [-50; 50; -20; 20];

    fprintf('rank(A) = %d  (out of n = %d unknowns)\n', rank(A), 4);
    fprintf('nullity(A) = %d  ->  1 free variable\n', 4 - rank(A));

    % RREF of augmented matrix
    disp('RREF([A|b]) =');
    disp(rref([A, b]));

    % Parameterised general solution  (x2 = t)
    fprintf('\nGeneral solution (t = x2, free parameter):\n');
    fprintf('  x1 = t - 50\n  x2 = t\n  x3 = t - 20\n  x4 = t\n');
    fprintf('Feasible range: t in [50, 100]  (flows >= 0, capacity <= 100)\n');
end</div>
</div>
</div>

<!-- SECTION 6 + 7 -->
<div class="pg pb">
<div class="section">
  <h2 class="sh">6. Conclusion</h2>
  <p>This project demonstrated that two structurally different engineering problems &mdash; malware propagation in a computer network and vehicle flow at urban intersections &mdash; share the same algebraic backbone: matrix representation and the tools of linear algebra.</p>
  <p>In Application I, encoding a 10-node network as an adjacency matrix and computing cumulative matrix powers produced a complete k-hop infection map in O(kn&sup3;) time, vastly more efficient than per-node graph traversal. Row and column summations of the reachability matrix directly identified the most dangerous spreading node and the most exposed target, demonstrating how global network properties emerge from purely local matrix entries.</p>
  <p>In Application II, four flow-conservation equations formed a 4&times;4 linear system of rank 3, revealing inherent under-determinacy: the equations are linearly dependent (their sum is identically zero), producing exactly one free variable. Gaussian elimination reduced the augmented matrix to RREF in three steps, expressing three unknown flows as affine functions of the free parameter x<sub>2</sub>. Physical feasibility then bounded x<sub>2</sub> to [50, 100], yielding a one-dimensional solution set &mdash; a line segment in &real;<sup>4</sup>.</p>
  <p>Both results confirm that linear algebra is not merely an abstract mathematical discipline but a practical engineering tool capable of handling real-world complexity at scale.</p>
</div>
<div class="section">
  <h2 class="sh">7. References</h2>
  <ol class="refs">
    <li>G. Strang, <em>Introduction to Linear Algebra</em>, 6th ed., Wellesley-Cambridge Press, 2022.</li>
    <li>H. Anton and C. Rorres, <em>Elementary Linear Algebra: Applications Version</em>, 12th ed., John Wiley &amp; Sons, 2019.</li>
    <li>D. C. Lay, S. R. Lay, and J. J. McDonald, <em>Linear Algebra and Its Applications</em>, 6th ed., Pearson, 2021.</li>
    <li>C. D. Meyer, <em>Matrix Analysis and Applied Linear Algebra</em>, SIAM, 2000.</li>
  </ol>
</div>
</div>

</body></html>`;

        const container = document.createElement("div");
        container.innerHTML = html;
        container.style.cssText = "position:absolute;left:-9999px;top:0;width:210mm;";
        document.body.appendChild(container);

        const opt = {
            margin: 0,
            filename: "MatrixFlow_Labs_Report_Talal_Jaber.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["css", "legacy"] }
        };

        html2pdf().set(opt).from(container).save().then(() => {
            document.body.removeChild(container);
            btn.textContent = "Download PDF";
            btn.disabled = false;
        });
    } // end if(false)

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