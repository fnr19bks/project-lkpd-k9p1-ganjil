/* =========================================================
   LKPD DIGITAL — GRAF: REPRESENTASI MASALAH DAN NAVIGASI
   script.js — Vanilla JavaScript (ES6), tanpa library eksternal
   ========================================================= */
(function () {
  'use strict';

  /* =========================================================================
     ⚙️  BAGIAN YANG BISA DIUBAH GURU (TUNABLE)
     -------------------------------------------------------------------------
     Ubah hanya bagian di bawah ini jika ingin menyesuaikan soal.
     Tidak perlu memahami seluruh logika program.
     ========================================================================= */

  /* --- 1. DAFTAR NODE (SIMPUL) -------------------------------------------
     id      : huruf/kode unik untuk node (harus unik satu sama lain)
     x, y    : posisi node pada kanvas.
               Kanvas memakai KOORDINAT LOGIS 800 x 520 (lebar x tinggi).
               Sudut kiri-atas = (0,0). Sudut kanan-bawah = (800,520).
     nameKey : kunci nama tempat pada kamus bahasa (lihat objek I18N).
               Untuk mengubah nama tempat, ubah nilai "nodeA".."nodeE"
               pada I18N.id (Bahasa Indonesia) dan I18N.en (English).
     ----------------------------------------------------------------------- */
  const NODES = [
    { id: 'A', x: 100, y: 420, nameKey: 'nodeA' }, // Gerbang sekolah
    { id: 'B', x: 300, y: 280, nameKey: 'nodeB' }, // Lapangan
    { id: 'C', x: 520, y: 140, nameKey: 'nodeC' }, // Koridor
    { id: 'D', x: 480, y: 420, nameKey: 'nodeD' }, // Kantin
    { id: 'E', x: 720, y: 280, nameKey: 'nodeE' }  // Perpustakaan
  ];

  /* --- 2. DAFTAR EDGE YANG BENAR (KUNCI JAWABAN) -------------------------
     Setiap pasangan huruf adalah hubungan yang SAH.
     Urutan huruf tidak berpengaruh (A-B sama dengan B-A) karena graf ini
     adalah graf TAK BERARAH (undirected graph).
     ----------------------------------------------------------------------- */
  const REQUIRED_EDGES = [
    ['A', 'B'],
    ['B', 'C'],
    ['C', 'E'],
    ['B', 'D'],
    ['D', 'E']
  ];

  /* --- 3. RUTE YANG DICARI (untuk notifikasi sukses) ---------------------
     A = titik awal, E = titik tujuan.
     ----------------------------------------------------------------------- */
  const START_NODE = 'A';
  const GOAL_NODE = 'E';

  /* --- 4. UKURAN TAMPILAN NODE PADA KANVAS ------------------------------- */
  const NODE_RADIUS = 34;   // jari-jari lingkaran node (koordinat logis)
  const HIT_RADIUS = 42;    // area klik node (sedikit lebih besar agar mudah)
  const LOGICAL_W = 800;    // JANGAN diubah kecuali Anda mengubah semua x node
  const LOGICAL_H = 520;    // JANGAN diubah kecuali Anda mengubah semua y node

  /* =========================================================================
     KAMUS BAHASA (DWIBAHASA: ID / EN)
     ========================================================================= */
  const I18N = {
    id: {
      appTitle: 'LKPD Digital · Graf: Representasi Masalah & Navigasi',
      appSubtitle: 'Informatika Kelas 8 — Berpikir Komputasional',

      step1: 'Belajar Konsep',
      step2: 'Misi Pembuat Graf',
      step3: 'Refleksi LKPD',

      /* ---- Tahap 1 ---- */
      s1Title: 'Tahap 1 — Belajar Konsep',
      s1Intro: 'Graf adalah kumpulan titik yang saling terhubung oleh garis. Dua istilah paling penting dalam graf adalah Node dan Edge.',
      nodeDesc: 'Node adalah titik yang mewakili sebuah objek, tempat, atau keadaan. Pada peta sekolah, node bisa berupa Gerbang, Lapangan, Kantin, dan lainnya.',
      edgeDesc: 'Edge adalah garis yang menghubungkan dua node. Edge menunjukkan adanya hubungan langsung antara dua tempat, misalnya jalan yang bisa dilalui dari Gerbang ke Lapangan.',
      s1TypesTitle: 'Jenis-Jenis Graf (Graph Types)',
      undirectedDesc: 'Garis tidak memiliki panah. Hubungan berlaku dua arah: bisa dari A ke B, bisa juga dari B ke A.',
      directedDesc: 'Garis memiliki panah. Hubungan hanya berlaku satu arah, misalnya jalan satu arah.',
      weightedDesc: 'Setiap garis memiliki angka (bobot), misalnya jarak dalam meter atau waktu tempuh.',
      s1Takeaway: 'Kesimpulan: untuk memodelkan rute sekolah, tentukan dulu apa yang menjadi node (tempat), lalu edge (jalan penghubung antar tempat).',

      /* ---- Tahap 2 ---- */
      s2Title: 'Tahap 2 — Misi Pembuat Graf',
      s2Mission: 'Misi: Hubungkan tempat-tempat di sekolah berikut sesuai daftar hubungan yang benar. Klik satu node, lalu klik node lain untuk menarik garis.',
      targetTitle: 'Daftar Hubungan (Edge) yang Harus Dibuat',
      progressLabel: 'Hubungan terbentuk',
      resetBtn: 'Ulangi Misi',
      checkBtn: 'Periksa Rute A → E',
      s2Hint: 'Tips: garis HIJAU berarti hubungan benar, garis MERAH berarti hubungan salah (dan akan hilang).',
      legendNode: 'Node (Simpul)',
      legendEdge: 'Edge (Sisi)',

      /* ---- Nama tempat (node) ---- */
      nodeA: 'Gerbang sekolah',
      nodeB: 'Lapangan',
      nodeC: 'Koridor',
      nodeD: 'Kantin',
      nodeE: 'Perpustakaan',

      /* ---- Pesan sistem ---- */
      toastSelected: 'Node {x} terpilih. Sekarang klik node tujuan.',
      toastAlready: 'Hubungan {a}–{b} sudah dibuat.',
      toastWrong: 'Hubungan {a}–{b} salah. Coba pasangan lain!',
      toastRight: 'Benar! Hubungan {a}–{b} terbentuk.',
      toastPathFound: 'Rute ditemukan: {path}',
      toastNoPath: 'Belum ada rute dari Gerbang (A) ke Perpustakaan (E).',
      toastReset: 'Misi diulang. Semua garis dihapus.',

      /* ---- Modal ---- */
      modalTitle: 'Hebat! Misi Selesai',
      modalBody: 'Kamu berhasil membentuk seluruh 5 edge pada graf rute sekolah. Berikut rute yang bisa kamu tempuh dari Gerbang (A) ke Perpustakaan (E):',
      modalClose: 'Lanjut ke Refleksi',

      /* ---- Tahap 3 ---- */
      s3Title: 'Tahap 3 — Refleksi LKPD',
      s3Intro: 'Jawab pertanyaan berikut dengan kalimatmu sendiri. Jawabanmu akan ikut tercetak saat kamu menekan tombol "Selesaikan & Unduh PDF".',
      nameLabel: 'Nama',
      classLabel: 'Kelas',
      dateLabel: 'Tanggal',
      printBtn: 'Selesaikan & Unduh PDF',
      answerPlaceholder: 'Tulis jawabanmu di sini...',

      q1: 'Dalam graf rute sekolah, apa yang dimaksud node?',
      q2: 'Apa yang ditunjukkan edge?',
      q3: 'Jika A adalah gerbang, B lapangan, C perpustakaan, dan hubungan yang tersedia A–B serta B–C, tuliskan rute dari A ke C.',
      q4: 'Mengapa tidak semua titik pada gambar harus dihubungkan?',
      q5: 'Apa yang perlu dijelaskan jika garis diberi panah?',

      prevBtn: '← Sebelumnya',
      nextBtn: 'Selanjutnya →',

      printTitle: 'LKPD Informatika — Graf: Representasi Masalah dan Navigasi',
      printName: 'Nama',
      printClass: 'Kelas',
      printDate: 'Tanggal'
    },

    en: {
      appTitle: 'Digital Worksheet · Graph: Problem Representation & Navigation',
      appSubtitle: 'Grade 8 Informatics — Computational Thinking',

      step1: 'Concept Learning',
      step2: 'Graph Builder Mission',
      step3: 'Worksheet Reflection',

      /* ---- Stage 1 ---- */
      s1Title: 'Stage 1 — Concept Learning',
      s1Intro: 'A graph is a collection of points connected by lines. The two most important terms in a graph are Node and Edge.',
      nodeDesc: 'A node is a point that represents an object, place, or state. On a school map, a node could be the Gate, Field, Canteen, and so on.',
      edgeDesc: 'An edge is a line that connects two nodes. An edge shows a direct relationship between two places, for example a path you can walk from the Gate to the Field.',
      s1TypesTitle: 'Graph Types',
      undirectedDesc: 'The line has no arrow. The relationship works both ways: from A to B, and also from B to A.',
      directedDesc: 'The line has an arrow. The relationship works in one direction only, such as a one-way street.',
      weightedDesc: 'Each line has a number (weight), for example distance in metres or travel time.',
      s1Takeaway: 'Conclusion: to model a school route, first decide what becomes the node (place), then the edge (connecting path between places).',

      /* ---- Stage 2 ---- */
      s2Title: 'Stage 2 — Graph Builder Mission',
      s2Mission: 'Mission: Connect the school places below according to the correct list of relationships. Click one node, then click another node to draw a line.',
      targetTitle: 'Edges You Must Create',
      progressLabel: 'Edges created',
      resetBtn: 'Restart Mission',
      checkBtn: 'Check Route A → E',
      s2Hint: 'Tip: a GREEN line means the relationship is correct, a RED line means it is wrong (and will disappear).',
      legendNode: 'Node (Vertex)',
      legendEdge: 'Edge',

      /* ---- Place names (nodes) ---- */
      nodeA: 'School gate',
      nodeB: 'Field',
      nodeC: 'Corridor',
      nodeD: 'Canteen',
      nodeE: 'Library',

      /* ---- System messages ---- */
      toastSelected: 'Node {x} selected. Now click the destination node.',
      toastAlready: 'Edge {a}–{b} has already been created.',
      toastWrong: 'Edge {a}–{b} is wrong. Try another pair!',
      toastRight: 'Correct! Edge {a}–{b} created.',
      toastPathFound: 'Route found: {path}',
      toastNoPath: 'There is no route from the Gate (A) to the Library (E) yet.',
      toastReset: 'Mission restarted. All lines cleared.',

      /* ---- Modal ---- */
      modalTitle: 'Great! Mission Complete',
      modalBody: 'You successfully created all 5 edges on the school route graph. Here are the routes you can take from the Gate (A) to the Library (E):',
      modalClose: 'Continue to Reflection',

      /* ---- Stage 3 ---- */
      s3Title: 'Stage 3 — Worksheet Reflection',
      s3Intro: 'Answer the questions below in your own words. Your answers will be printed when you press "Finish & Download PDF".',
      nameLabel: 'Name',
      classLabel: 'Class',
      dateLabel: 'Date',
      printBtn: 'Finish & Download PDF',
      answerPlaceholder: 'Write your answer here...',

      q1: 'In the school route graph, what is a node?',
      q2: 'What does an edge show?',
      q3: 'If A is the gate, B is the field, C is the library, and the available edges are A–B and B–C, write the route from A to C.',
      q4: 'Why do not all points in the picture have to be connected?',
      q5: 'What needs to be explained if a line is given an arrow?',

      prevBtn: '← Previous',
      nextBtn: 'Next →',

      printTitle: 'Informatics Worksheet — Graph: Problem Representation and Navigation',
      printName: 'Name',
      printClass: 'Class',
      printDate: 'Date'
    }
  };

  /* =========================================================================
     STATE APLIKASI
     ========================================================================= */
  let LANG = 'id';
  let currentStep = 1;

  const builtEdges = [];          // [{a:'A', b:'B', t:0}]  garis yang sudah benar
  const builtSet = new Set();     // Set berisi kunci edge yang sudah benar
  const effects = [];             // efek garis sementara (merah/hijau berkedip)

  let selectedId = null;          // node yang sedang dipilih
  let hoverId = null;             // node yang sedang di-hover kursor
  let shakeUntil = 0;             // waktu berakhir efek getaran kanvas
  let pathNotified = false;       // apakah notifikasi rute sudah pernah muncul
  let missionComplete = false;    // apakah seluruh edge sudah terbentuk

  const nodeById = {};
  NODES.forEach(function (n) { nodeById[n.id] = n; });

  /* =========================================================================
     UTILITAS BAHASA
     ========================================================================= */
  function t(key) {
    const dict = I18N[LANG] || I18N.id;
    return (dict[key] !== undefined) ? dict[key] : (I18N.id[key] !== undefined ? I18N.id[key] : key);
  }

  function fmt(template, map) {
    return template.replace(/\{(\w+)\}/g, function (m, k) {
      return (map[k] !== undefined) ? map[k] : m;
    });
  }

  function nodeName(id) {
    const n = nodeById[id];
    return n ? t(n.nameKey) : id;
  }

  function edgeKey(a, b) {
    return [a, b].sort().join('-');
  }

  function isRequiredEdge(a, b) {
    const k = edgeKey(a, b);
    for (let i = 0; i < REQUIRED_EDGES.length; i++) {
      if (edgeKey(REQUIRED_EDGES[i][0], REQUIRED_EDGES[i][1]) === k) return true;
    }
    return false;
  }

  /* =========================================================================
     REFERENSI DOM
     ========================================================================= */
  const canvas = document.getElementById('graph-canvas');
  const ctx = canvas.getContext('2d');
  const toastEl = document.getElementById('toast');
  const checklistEl = document.getElementById('edge-checklist');
  const progressCountEl = document.getElementById('progress-count');
  const progressFillEl = document.getElementById('progress-fill');
  const questionsEl = document.getElementById('questions');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalRoutes = document.getElementById('modal-routes');
  const printHeader = document.getElementById('print-header');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const cctx = confettiCanvas.getContext('2d');

  /* =========================================================================
     AUDIO FEEDBACK SEDERHANA (WebAudio, tanpa file eksternal)
     ========================================================================= */
  let audioCtx = null;

  function beep(freq, dur, type) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (err) {
      /* Audio tidak wajib; abaikan jika browser memblokir. */
    }
  }

  /* =========================================================================
     TOAST
     ========================================================================= */
  let toastTimer = null;

  function showToast(message, type) {
    toastEl.textContent = message;
    toastEl.className = 'toast show' + (type ? ' ' + type : '');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.className = 'toast' + (type ? ' ' + type : '');
    }, 2600);
  }

  /* =========================================================================
     KANVAS — UKURAN & TRANSFORMASI
     ========================================================================= */
  function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const sx = w / LOGICAL_W;
    const sy = h / LOGICAL_H;
    ctx.setTransform(sx, 0, 0, sy, 0, 0);
  }

  function toLogical(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * LOGICAL_W,
      y: ((clientY - rect.top) / rect.height) * LOGICAL_H
    };
  }

  function hitTest(x, y) {
    for (let i = 0; i < NODES.length; i++) {
      const n = NODES[i];
      const dx = x - n.x;
      const dy = y - n.y;
      if (Math.sqrt(dx * dx + dy * dy) <= HIT_RADIUS) return n;
    }
    return null;
  }

  /* =========================================================================
     MENGGAMBAR
     ========================================================================= */
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawBackground() {
    ctx.fillStyle = '#f8fbfe';
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

    ctx.save();
    ctx.strokeStyle = 'rgba(18, 58, 103, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= LOGICAL_W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, LOGICAL_H);
      ctx.stroke();
    }
    for (let y = 0; y <= LOGICAL_H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(LOGICAL_W, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawEdgeSegment(aId, bId, color, width, alpha, dash) {
    const a = nodeById[aId];
    const b = nodeById[bId];
    if (!a || !b) return;

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const offset = NODE_RADIUS + 4;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(a.x + ux * offset, a.y + uy * offset);
    ctx.lineTo(b.x - ux * offset, b.y - uy * offset);
    ctx.stroke();
    ctx.restore();
  }

  function drawNode(n) {
    const isSelected = (selectedId === n.id);
    const isHover = (hoverId === n.id);
    const R = NODE_RADIUS;
    const time = performance.now() / 1000;

    /* Cincin berdenyut untuk node terpilih */
    if (isSelected) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(n.x, n.y, R + 9 + Math.sin(time * 5) * 3.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 183, 3, 0.95)';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }

    /* Cincin hover */
    if (isHover && !isSelected) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(n.x, n.y, R + 7, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(18, 179, 166, 0.55)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }

    /* Lingkaran node */
    ctx.save();
    ctx.shadowColor = 'rgba(11, 37, 69, 0.28)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    const grad = ctx.createLinearGradient(n.x, n.y - R, n.x, n.y + R);
    grad.addColorStop(0, '#1cc9b9');
    grad.addColorStop(1, '#0b8f85');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(n.x, n.y, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(n.x, n.y, R, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    /* Huruf node */
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.id, n.x, n.y + 1);

    /* Label nama tempat */
    const label = nodeName(n.id) + ' (' + n.id + ')';
    ctx.font = '600 15px "Segoe UI", system-ui, sans-serif';
    const textW = ctx.measureText(label).width;
    const boxW = textW + 22;
    const boxH = 27;
    const boxX = n.x - boxW / 2;
    const boxY = n.y + R + 9;

    ctx.save();
    ctx.shadowColor = 'rgba(11, 37, 69, 0.12)';
    ctx.shadowBlur = 6;
    roundRect(boxX, boxY, boxW, boxH, 13);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.97)';
    ctx.fill();
    ctx.restore();

    roundRect(boxX, boxY, boxW, boxH, 13);
    ctx.strokeStyle = 'rgba(18, 58, 103, 0.20)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#0b2545';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(label, n.x, boxY + boxH / 2 + 1);
  }

  function render() {
    const now = performance.now();

    ctx.save();
    ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
    drawBackground();

    /* Efek getaran (shake) ketika garis salah */
    if (shakeUntil > now) {
      const k = (shakeUntil - now) / 320;
      const dx = Math.sin(now / 17) * 9 * k;
      const dy = Math.cos(now / 13) * 6 * k;
      ctx.translate(dx, dy);
    }

    /* Garis yang sudah benar */
    for (let i = 0; i < builtEdges.length; i++) {
      const e = builtEdges[i];
      drawEdgeSegment(e.a, e.b, 'rgba(11, 143, 133, 0.95)', 7, 1, null);
      drawEdgeSegment(e.a, e.b, 'rgba(28, 201, 185, 0.85)', 3, 1, null);
    }

    /* Efek sementara (merah salah / hijau benar) */
    for (let i = 0; i < effects.length; i++) {
      const ef = effects[i];
      const p = Math.min(1, ef.t / ef.dur);
      const alpha = 1 - p;
      drawEdgeSegment(ef.a, ef.b, ef.color, ef.width, alpha, ef.dash);
    }

    /* Semua node */
    for (let i = 0; i < NODES.length; i++) {
      drawNode(NODES[i]);
    }

    ctx.restore();
  }

  /* =========================================================================
     EFEK ANIMASI
     ========================================================================= */
  function updateEffects(dt) {
    for (let i = effects.length - 1; i >= 0; i--) {
      effects[i].t += dt;
      if (effects[i].t >= effects[i].dur) effects.splice(i, 1);
    }
  }

  function addEffect(a, b, color, width, dur, dash) {
    effects.push({ a: a, b: b, color: color, width: width, t: 0, dur: dur, dash: dash || null });
  }

  /* =========================================================================
     LOGIKA PERMAINAN
     ========================================================================= */
  function buildEdge(aId, bId) {
    const key = edgeKey(aId, bId);
    if (builtSet.has(key)) return;
    builtSet.add(key);
    builtEdges.push({ a: aId, b: bId, t: 0 });
  }

  function findPath(start, goal) {
    const adj = {};
    NODES.forEach(function (n) { adj[n.id] = []; });
    builtEdges.forEach(function (e) {
      adj[e.a].push(e.b);
      adj[e.b].push(e.a);
    });

    const queue = [[start]];
    const visited = {};
    visited[start] = true;

    while (queue.length) {
      const path = queue.shift();
      const last = path[path.length - 1];
      if (last === goal) return path;
      const neighbours = adj[last] || [];
      for (let i = 0; i < neighbours.length; i++) {
        const nb = neighbours[i];
        if (!visited[nb]) {
          visited[nb] = true;
          queue.push(path.concat([nb]));
        }
      }
    }
    return null;
  }

  function handleNodeClick(node) {
    /* Klik pertama: memilih node */
    if (selectedId === null) {
      selectedId = node.id;
      beep(660, 0.08, 'sine');
      showToast(fmt(t('toastSelected'), { x: node.id }), null);
      return;
    }

    /* Klik node yang sama: membatalkan pilihan */
    if (selectedId === node.id) {
      selectedId = null;
      return;
    }

    const a = selectedId;
    const b = node.id;
    selectedId = null;

    /* Sudah pernah dibuat? */
    if (builtSet.has(edgeKey(a, b))) {
      showToast(fmt(t('toastAlready'), { a: a, b: b }), null);
      return;
    }

    if (isRequiredEdge(a, b)) {
      /* --- BENAR --- */
      buildEdge(a, b);
      addEffect(a, b, 'rgba(28, 201, 185, 0.95)', 9, 700, null);
      beep(880, 0.12, 'triangle');
      showToast(fmt(t('toastRight'), { a: a, b: b }), 'success');
      updateProgressUI();

      if (builtEdges.length === REQUIRED_EDGES.length && !missionComplete) {
        missionComplete = true;
        setTimeout(onMissionComplete, 420);
      } else if (!missionComplete) {
        const path = findPath(START_NODE, GOAL_NODE);
        if (path && !pathNotified) {
          pathNotified = true;
          setTimeout(function () {
            showToast(fmt(t('toastPathFound'), { path: path.join(' – ') }), 'success');
          }, 450);
        }
      }
    } else {
      /* --- SALAH --- */
      addEffect(a, b, 'rgba(230, 57, 70, 0.95)', 7, 900, [12, 9]);
      shakeUntil = performance.now() + 320;
      beep(200, 0.18, 'sawtooth');
      showToast(fmt(t('toastWrong'), { a: a, b: b }), 'error');
    }
  }

  function onMissionComplete() {
    launchConfetti(140);
    beep(1046, 0.16, 'triangle');
    setTimeout(function () { beep(1318, 0.22, 'triangle'); }, 150);

    const routes = [];
    const p1 = findPath(START_NODE, GOAL_NODE);
    if (p1) routes.push(p1.join(' – '));

    /* Cari rute alternatif sederhana (A-B-D-E) bila ada */
    const alt = ['A', 'B', 'D', 'E'];
    let altOk = true;
    for (let i = 0; i < alt.length - 1; i++) {
      if (!builtSet.has(edgeKey(alt[i], alt[i + 1]))) { altOk = false; break; }
    }
    if (altOk && alt.join(' – ') !== routes[0]) routes.push(alt.join(' – '));

    modalRoutes.innerHTML = routes.map(function (r) {
      return '<span class="route-pill">' + r + '</span>';
    }).join('');

    modalOverlay.classList.add('show');
    modalOverlay.setAttribute('aria-hidden', 'false');
  }

  function updateProgressUI() {
    const total = REQUIRED_EDGES.length;
    const done = builtEdges.length;

    progressCountEl.textContent = done + ' / ' + total;
    progressFillEl.style.width = ((done / total) * 100) + '%';

    renderChecklist();
  }

  function renderChecklist() {
    let html = '';
    for (let i = 0; i < REQUIRED_EDGES.length; i++) {
      const a = REQUIRED_EDGES[i][0];
      const b = REQUIRED_EDGES[i][1];
      const done = builtSet.has(edgeKey(a, b));
      html += '<li class="check-item' + (done ? ' done' : '') + '">' +
        '<span class="check-box">' + (done ? '✓' : '') + '</span>' +
        '<span class="check-text"><b>' + a + '</b> ' + nodeName(a) +
        ' — <b>' + b + '</b> ' + nodeName(b) + '</span>' +
        '</li>';
    }
    checklistEl.innerHTML = html;
  }

  function resetMission() {
    builtEdges.length = 0;
    builtSet.clear();
    effects.length = 0;
    selectedId = null;
    hoverId = null;
    shakeUntil = 0;
    pathNotified = false;
    missionComplete = false;

    /* Hapus rute A-B-C-E dan A-B-D-E secara otomatis tidak diperlukan
       karena seluruh state sudah dikosongkan. */

    updateProgressUI();
    showToast(t('toastReset'), null);
    beep(320, 0.12, 'sine');
  }

  /* =========================================================================
     KONFETI
     ========================================================================= */
  const confettiParticles = [];
  let confettiRunning = false;

  function sizeConfetti() {
    confettiCanvas.width = Math.max(1, window.innerWidth);
    confettiCanvas.height = Math.max(1, window.innerHeight);
  }

  function launchConfetti(count) {
    sizeConfetti();
    const colors = ['#12b3a6', '#ffb703', '#0b2545', '#1b4f8a', '#e63946', '#4cc9f0', '#ffffff'];
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * confettiCanvas.height * 0.35,
        vx: (Math.random() - 0.5) * 3.4,
        vy: 2 + Math.random() * 4.2,
        size: 6 + Math.random() * 9,
        color: colors[(Math.random() * colors.length) | 0],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.32
      });
    }
    if (!confettiRunning) {
      confettiRunning = true;
      requestAnimationFrame(confettiLoop);
    }
  }

  function confettiLoop() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.rot += p.vr;
      if (p.y > confettiCanvas.height + 40) confettiParticles.splice(i, 1);
    }

    for (let i = 0; i < confettiParticles.length; i++) {
      const p = confettiParticles[i];
      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rot);
      cctx.fillStyle = p.color;
      cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.62);
      cctx.restore();
    }

    if (confettiParticles.length > 0) {
      requestAnimationFrame(confettiLoop);
    } else {
      confettiRunning = false;
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  /* =========================================================================
     LOOP ANIMASI UTAMA
     ========================================================================= */
  let lastTs = 0;

  function loop(ts) {
    const dt = lastTs ? Math.min(60, ts - lastTs) : 16;
    lastTs = ts;

    updateEffects(dt);

    const stage2 = document.getElementById('stage-2');
    if (stage2 && stage2.classList.contains('is-active')) {
      render();
    }

    requestAnimationFrame(loop);
  }

  /* =========================================================================
     NAVIGASI TAHAP
     ========================================================================= */
  function goToStep(step) {
    currentStep = Math.max(1, Math.min(3, step));

    for (let i = 1; i <= 3; i++) {
      const sec = document.getElementById('stage-' + i);
      if (sec) sec.classList.toggle('is-active', i === currentStep);
    }

    const stepBtns = document.querySelectorAll('.step-btn');
    for (let i = 0; i < stepBtns.length; i++) {
      stepBtns[i].classList.toggle('is-active', Number(stepBtns[i].dataset.step) === currentStep);
    }

    document.getElementById('btn-prev').disabled = (currentStep === 1);
    document.getElementById('btn-prev').style.opacity = (currentStep === 1) ? '0.45' : '1';

    if (currentStep === 2) {
      /* Kanvas baru terlihat sekarang — pastikan ukurannya benar */
      setTimeout(fitCanvas, 30);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* =========================================================================
     FORM REFLEKSI
     ========================================================================= */
  const QUESTION_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'];
  const qTextEls = {};

  function buildQuestions() {
    let html = '';
    for (let i = 0; i < QUESTION_KEYS.length; i++) {
      const key = QUESTION_KEYS[i];
      html +=
        '<div class="question">' +
          '<p class="q-text" data-qkey="' + key + '">' + (i + 1) + '. ' + t(key) + '</p>' +
          '<textarea id="ans-' + key + '" rows="3" placeholder="' + t('answerPlaceholder') + '"></textarea>' +
          '<div class="print-answer" data-for="' + key + '"></div>' +
        '</div>';
    }
    questionsEl.innerHTML = html;

    for (let i = 0; i < QUESTION_KEYS.length; i++) {
      const key = QUESTION_KEYS[i];
      qTextEls[key] = questionsEl.querySelector('[data-qkey="' + key + '"]');
      const ta = document.getElementById('ans-' + key);
      ta.placeholder = t('answerPlaceholder');
      ta.addEventListener('input', function () {
        const target = questionsEl.querySelector('.print-answer[data-for="' + key + '"]');
        if (target) target.textContent = ta.value;
      });
    }
  }

  function refreshQuestions() {
    for (let i = 0; i < QUESTION_KEYS.length; i++) {
      const key = QUESTION_KEYS[i];
      if (qTextEls[key]) {
        qTextEls[key].textContent = (i + 1) + '. ' + t(key);
      }
      const ta = document.getElementById('ans-' + key);
      if (ta) ta.placeholder = t('answerPlaceholder');
    }
  }

  function preparePrint() {
    /* Sinkronkan jawaban textarea ke blok cetak */
    for (let i = 0; i < QUESTION_KEYS.length; i++) {
      const key = QUESTION_KEYS[i];
      const ta = document.getElementById('ans-' + key);
      const target = questionsEl.querySelector('.print-answer[data-for="' + key + '"]');
      if (ta && target) {
        target.textContent = ta.value.trim() === '' ? '—' : ta.value;
      }
    }

    /* Isi header cetak */
    const nameVal = document.getElementById('student-name').value || '-';
    const classVal = document.getElementById('student-class').value || '-';
    const dateVal = document.getElementById('student-date').value || '-';

    printHeader.innerHTML =
      '<h2>' + t('printTitle') + '</h2>' +
      '<p>' + t('printName') + ': ' + escapeHtml(nameVal) +
      ' &nbsp;|&nbsp; ' + t('printClass') + ': ' + escapeHtml(classVal) +
      ' &nbsp;|&nbsp; ' + t('printDate') + ': ' + escapeHtml(dateVal) + '</p>';

    /* Pastikan kanvas ter-render sebelum dicetak */
    fitCanvas();
    render();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* =========================================================================
     BAHASA
     ========================================================================= */
  function applyLanguage() {
    document.documentElement.lang = LANG;

    /* Teks statis dengan data-i18n */
    const nodes = document.querySelectorAll('[data-i18n]');
    for (let i = 0; i < nodes.length; i++) {
      const key = nodes[i].getAttribute('data-i18n');
      nodes[i].textContent = t(key);
    }

    /* Tombol bahasa */
    const langBtns = document.querySelectorAll('.lang-btn');
    for (let i = 0; i < langBtns.length; i++) {
      langBtns[i].classList.toggle('is-active', langBtns[i].dataset.lang === LANG);
    }

    /* Bagian dinamis */
    renderChecklist();
    refreshQuestions();

    /* Judul halaman */
    document.title = t('appTitle');
  }

  function setLanguage(lang) {
    if (lang !== 'id' && lang !== 'en') return;
    LANG = lang;
    applyLanguage();
    beep(760, 0.07, 'sine');
  }

  /* =========================================================================
     EVENT LISTENER
     ========================================================================= */
  function bindEvents() {
    /* --- Kanvas --- */
    canvas.addEventListener('click', function (e) {
      const p = toLogical(e.clientX, e.clientY);
      const node = hitTest(p.x, p.y);
      if (node) handleNodeClick(node);
    });

    canvas.addEventListener('mousemove', function (e) {
      const p = toLogical(e.clientX, e.clientY);
      const node = hitTest(p.x, p.y);
      const newHover = node ? node.id : null;
      if (newHover !== hoverId) {
        hoverId = newHover;
        canvas.style.cursor = hoverId ? 'pointer' : 'crosshair';
      }
    });

    canvas.addEventListener('mouseleave', function () {
      hoverId = null;
      canvas.style.cursor = 'crosshair';
    });

    /* Sentuh untuk perangkat layar sentuh */
    canvas.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      const t0 = e.touches[0];
      const p = toLogical(t0.clientX, t0.clientY);
      const node = hitTest(p.x, p.y);
      if (node) {
        e.preventDefault();
        handleNodeClick(node);
      }
    }, { passive: false });

    /* --- Tombol panel --- */
    document.getElementById('btn-reset').addEventListener('click', resetMission);

    document.getElementById('btn-check').addEventListener('click', function () {
      const path = findPath(START_NODE, GOAL_NODE);
      if (path) {
        showToast(fmt(t('toastPathFound'), { path: path.join(' – ') }), 'success');
        beep(920, 0.1, 'triangle');
      } else {
        showToast(t('toastNoPath'), 'error');
        beep(220, 0.14, 'sawtooth');
      }
    });

    /* --- Navigasi tahap --- */
    const stepBtns = document.querySelectorAll('.step-btn');
    for (let i = 0; i < stepBtns.length; i++) {
      stepBtns[i].addEventListener('click', function () {
        goToStep(Number(this.dataset.step));
      });
    }

    document.getElementById('btn-prev').addEventListener('click', function () {
      goToStep(currentStep - 1);
    });

    document.getElementById('btn-next').addEventListener('click', function () {
      goToStep(currentStep + 1);
    });

    /* --- Toggle bahasa --- */
    const langBtns = document.querySelectorAll('.lang-btn');
    for (let i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener('click', function () {
        setLanguage(this.dataset.lang);
      });
    }

    /* --- Modal --- */
    document.getElementById('modal-close').addEventListener('click', function () {
      modalOverlay.classList.remove('show');
      modalOverlay.setAttribute('aria-hidden', 'true');
      goToStep(3);
    });

    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('show');
        modalOverlay.setAttribute('aria-hidden', 'true');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
        modalOverlay.classList.remove('show');
        modalOverlay.setAttribute('aria-hidden', 'true');
      }
    });

    /* --- Cetak --- */
    document.getElementById('btn-print').addEventListener('click', function () {
      preparePrint();
      setTimeout(function () {
        window.print();
      }, 120);
    });

    window.addEventListener('beforeprint', preparePrint);

    /* --- Ukuran kanvas --- */
    window.addEventListener('resize', function () {
      fitCanvas();
      sizeConfetti();
    });

    window.addEventListener('orientationchange', function () {
      setTimeout(fitCanvas, 260);
    });

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(function () { fitCanvas(); });
      ro.observe(canvas);
    }

    /* Tanggal hari ini otomatis */
    const dateInput = document.getElementById('student-date');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = yyyy + '-' + mm + '-' + dd;
  }

  /* =========================================================================
     INISIALISASI
     ========================================================================= */
  function init() {
    sizeConfetti();
    buildQuestions();
    applyLanguage();
    renderChecklist();
    updateProgressUI();
    bindEvents();
    goToStep(1);

    /* Ukuran kanvas awal (stage 2 masih tersembunyi, jadi coba lagi nanti) */
    fitCanvas();
    setTimeout(fitCanvas, 200);

    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();