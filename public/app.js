(function () {
"use strict";
var q = function (s, root) { return (root || document).querySelector(s); };
var qa = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var characters = [];

function notify(message) {
  var toast = q("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(function () { toast.classList.remove("show"); }, 2400);
}

var header = q(".site-header");
var toggle = q("#menuToggle");
var nav = q("#mainNav");
function closeMenu() {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}
toggle.addEventListener("click", function () {
  var opened = !nav.classList.contains("open");
  nav.classList.toggle("open", opened);
  toggle.setAttribute("aria-expanded", String(opened));
  document.body.classList.toggle("menu-open", opened);
});
qa(".main-nav a").forEach(function (link) { link.addEventListener("click", closeMenu); });
function scrollUpdate() {
  header.classList.toggle("scrolled", window.scrollY > 24);
  var current = "home";
  qa("main section[id]").forEach(function (section) {
    if (window.scrollY >= section.offsetTop - 170) current = section.id;
  });
  qa(".main-nav a").forEach(function (link) {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
}
window.addEventListener("scroll", scrollUpdate, { passive: true });
scrollUpdate();
q("#year").textContent = new Date().getFullYear();

if ("IntersectionObserver" in window && !reduceMotion) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .1 });
  qa(".reveal").forEach(function (node) { observer.observe(node); });
} else {
  qa(".reveal").forEach(function (node) { node.classList.add("visible"); });
}

var T = window.THREE;
var serviceData = {
  leads: ["B2B Lead Generation", "SCOUT", "Find the right people at the right companies with targeted research and carefully organized prospect data.", ["Targeted B2B Leads", "LinkedIn Lead Generation", "Decision-Maker Research", "Email List Building", "Data Collection & Validation"]],
  design: ["Graphic Designing", "PIXEL", "Create professional, consistent visual assets that make brands and campaigns easier to recognize.", ["Social Media Posts", "Business Posters", "Logo Design", "Branding & Marketing Designs"]],
  content: ["Content Writing", "QUILL", "Communicate clearly with purposeful writing that informs, engages and supports your business goals.", ["SEO Blog Writing", "Website Content", "Article Writing", "Website Copywriting"]],
  seo: ["SEO Services", "RANK", "Improve the foundations of your search presence through research, structured optimization and useful content.", ["Keyword Research", "On-Page SEO", "Content Optimization", "Website SEO Audits"]],
  marketing: ["Digital Marketing", "ORBIT", "Bring your message to the right audience with coordinated campaigns and thoughtful digital promotion.", ["Social Media Marketing", "Online Brand Promotion", "Digital Growth Strategies", "Marketing Campaigns"]]
};

if (T) {
  var materials = {
    white: new T.MeshStandardMaterial({ color: 0xf8fbff, roughness: .32 }),
    blue: new T.MeshStandardMaterial({ color: 0x2563eb, roughness: .3, metalness: .12 }),
    sky: new T.MeshStandardMaterial({ color: 0x60a5fa, roughness: .28 }),
    ice: new T.MeshStandardMaterial({ color: 0xbfdbfe, roughness: .35 }),
    navy: new T.MeshStandardMaterial({ color: 0x0b1220, roughness: .28 }),
    silver: new T.MeshStandardMaterial({ color: 0xa9bbd1, metalness: .5, roughness: .3 })
  };
  function add(parent, geometry, mat, pos, scale) {
    var obj = new T.Mesh(geometry, mat);
    obj.position.set(pos[0], pos[1], pos[2]);
    obj.scale.set(scale[0], scale[1], scale[2]);
    obj.castShadow = true;
    parent.add(obj);
    return obj;
  }
  function ball(parent, mat, x, y, z, sx, sy, sz) {
    return add(parent, new T.SphereGeometry(1, 24, 18), mat, [x, y, z], [sx, sy, sz]);
  }
  function block(parent, mat, x, y, z, sx, sy, sz) {
    return add(parent, new T.BoxGeometry(sx, sy, sz), mat, [x, y, z], [1, 1, 1]);
  }
  function limb(parent, mat, a, b, radius) {
    var start = new T.Vector3(a[0], a[1], a[2]);
    var end = new T.Vector3(b[0], b[1], b[2]);
    var dir = new T.Vector3().subVectors(end, start);
    var obj = new T.Mesh(new T.CylinderGeometry(radius, radius, dir.length(), 16), mat);
    obj.position.copy(start).add(end).multiplyScalar(.5);
    obj.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize());
    parent.add(obj);
    return obj;
  }
  function mascot(kind) {
    var root = new T.Group();
    var head = new T.Group();
    var wings = [];
    if (kind === "pixel") {
      block(root, materials.white, 0, 0, 0, .9, .95, .75);
      block(root, materials.navy, 0, .04, .4, .66, .4, .12);
      ball(root, materials.sky, -.16, .05, .48, .075, .09, .04);
      ball(root, materials.sky, .16, .05, .48, .075, .09, .04);
      limb(root, materials.silver, [.56, -.04, .1], [.82, .48, .1], .035);
      ball(root, materials.blue, .83, .54, .1, .09, .12, .08);
      block(root, materials.sky, -.62, -.32, .1, .24, .24, .16);
    } else if (kind === "quill") {
      ball(root, materials.white, 0, 0, 0, .54, .62, .42);
      ball(root, materials.navy, 0, .15, .36, .42, .27, .1);
      ball(root, materials.white, -.15, .15, .46, .12, .13, .04);
      ball(root, materials.white, .15, .15, .46, .12, .13, .04);
      ball(root, materials.sky, -.15, .15, .5, .06, .07, .03);
      ball(root, materials.sky, .15, .15, .5, .06, .07, .03);
      var beak = add(root, new T.ConeGeometry(.08, .17, 5), materials.blue, [0, -.02, .48], [1, 1, 1]);
      beak.rotation.x = Math.PI / 2;
      wings.push(ball(root, materials.blue, -.53, -.06, 0, .15, .32, .11));
      wings.push(ball(root, materials.sky, .53, -.06, 0, .15, .32, .11));
      limb(root, materials.silver, [.6, 0, .1], [.75, .5, .1], .025);
    } else if (kind === "rank") {
      ball(root, materials.ice, 0, 0, 0, .58, .56, .42);
      head.position.y = .13;
      root.add(head);
      ball(head, materials.white, 0, 0, 0, .55, .46, .42);
      [-.17, .17].forEach(function (x) {
        var rim = add(head, new T.TorusGeometry(.14, .023, 8, 28), materials.blue, [x, .03, .43], [1, 1, 1]);
        ball(head, materials.sky, x, .03, .46, .06, .08, .03);
      });
      limb(head, materials.blue, [-.04, .03, .44], [.04, .03, .44], .02);
      wings.push(ball(root, materials.blue, -.55, -.15, 0, .14, .3, .11));
      wings.push(ball(root, materials.sky, .55, -.15, 0, .14, .3, .11));
      for (var n = 0; n < 4; n++) block(root, materials.sky, .7 + n * .09, .2 + n * .07, 0, .06, .13 + n * .07, .05);
    } else if (kind === "orbit") {
      ball(root, materials.white, 0, 0, 0, .55, .58, .43);
      block(root, materials.navy, 0, .08, .39, .66, .28, .1);
      ball(root, materials.sky, -.13, .08, .46, .07, .08, .03);
      ball(root, materials.sky, .13, .08, .46, .07, .08, .03);
      block(root, materials.blue, 0, -.32, -.36, .34, .53, .24);
      limb(root, materials.sky, [0, -.55, -.38], [0, -.74, -.38], .06);
      ball(root, materials.ice, 0, -.77, -.38, .08, .08, .08);
      add(root, new T.TorusGeometry(.2, .025, 8, 32), materials.sky, [.67, .42, 0], [1, 1, 1]);
    } else {
      ball(root, materials.white, 0, -.05, 0, .62, .7, .47);
      block(root, materials.blue, 0, -.1, .42, .52, .4, .12);
      ball(root, materials.sky, 0, -.08, .5, .09, .09, .035);
      head.position.y = .8;
      root.add(head);
      ball(head, materials.white, 0, 0, 0, .61, .52, .47);
      ball(head, materials.navy, 0, -.04, .4, .46, .29, .13);
      [-.18, .18].forEach(function (x) {
        ball(head, materials.white, x, .02, .5, .14, .14, .06);
        ball(head, materials.sky, x, .02, .55, .065, .08, .03);
      });
      limb(head, materials.silver, [0, .46, 0], [0, .62, 0], .025);
      ball(head, materials.sky, 0, .65, 0, .08, .08, .08);
      [-1, 1].forEach(function (side) {
        ball(root, materials.blue, side * .64, .03, 0, .15, .18, .14);
        limb(root, materials.white, [side * .68, -.05, 0], [side * .78, -.48, .04], .09);
      });
      add(root, new T.TorusGeometry(.2, .025, 8, 30), materials.sky, [1.02, .5, .04], [1, 1, 1]);
      limb(root, materials.silver, [-.3, -.62, 0], [-.3, -.96, 0], .1);
      limb(root, materials.silver, [.3, -.62, 0], [.3, -.96, 0], .1);
    }
    root.userData.head = head;
    root.userData.wings = wings;
    root.userData.kind = kind;
    root.userData.selected = false;
    return root;
  }
  function initScene(canvas, mode) {
    try {
      var renderer = new T.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.2 : 1.5));
      renderer.outputColorSpace = T.SRGBColorSpace;
      var scene = new T.Scene();
      scene.add(new T.HemisphereLight(0xdbeafe, 0x14213d, 2));
      var light = new T.DirectionalLight(0xffffff, 2.5);
      light.position.set(-4, 7, 6);
      scene.add(light);
      var blueLight = new T.PointLight(0x3b82f6, 22, 18);
      blueLight.position.set(4, 2, 2);
      scene.add(blueLight);
      var camera = new T.PerspectiveCamera(mode === "hero" ? 34 : 38, 1, .1, 60);
      camera.position.set(0, mode === "hero" ? 1.1 : 2.4, mode === "hero" ? 8.8 : 14);
      camera.lookAt(0, mode === "hero" ? .1 : -.2, 0);
      function resize() {
        var w = Math.max(1, canvas.clientWidth);
        var h = Math.max(1, canvas.clientHeight);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        if (mode === "services") {
          camera.position.z = Math.max(13, 9.7 / Math.max(.58, w / h));
          camera.position.y = w < 560 ? 2.8 : 2.35;
          camera.lookAt(0, -.25, 0);
        }
        camera.updateProjectionMatrix();
      }
      var observer = new ResizeObserver(resize);
      observer.observe(canvas);
      resize();
      return { renderer: renderer, scene: scene, camera: camera };
    } catch (err) {
      canvas.classList.add("webgl-unavailable");
      console.warn("WebGL unavailable; standard page features remain active.", err);
      return null;
    }
  }

  var heroCanvas = q("#heroCanvas");
  var hero = initScene(heroCanvas, "hero");
  if (hero) {
    var pad = new T.Group();
    pad.position.y = -1.2;
    hero.scene.add(pad);
    add(pad, new T.CylinderGeometry(1.58, 1.7, .22, 56), materials.navy, [0, 0, 0], [1, 1, 1]);
    add(pad, new T.CylinderGeometry(1.48, 1.54, .07, 56), materials.blue, [0, .14, 0], [1, 1, 1]);
    var halo = add(pad, new T.TorusGeometry(1.43, .02, 8, 56), materials.sky, [0, .19, 0], [1, 1, 1]);
    halo.rotation.x = Math.PI / 2;
    var heroBot = mascot("scout");
    heroBot.scale.setScalar(1.25);
    heroBot.position.y = -.15;
    hero.scene.add(heroBot);
    var target = new T.Group();
    add(target, new T.TorusGeometry(.26, .025, 8, 30), materials.ice, [0, 0, 0], [1, 1, 1]);
    target.position.set(-2, 1, -.5);
    hero.scene.add(target);
    var orb = ball(hero.scene, materials.sky, 2.1, 1.2, -.3, .22, .22, .22);
    var pointerX = 0;
    heroCanvas.addEventListener("pointermove", function (e) {
      var rect = heroCanvas.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - .5) * 2;
    });
    var greeting = 0;
    q("#mascotHello").addEventListener("click", function () {
      greeting = 1.1;
      notify("Scout says hello!");
    });
    function drawHero() {
      requestAnimationFrame(drawHero);
      var t = performance.now() / 1000;
      if (!reduceMotion) {
        heroBot.position.y = -.15 + Math.sin(t * 1.25) * .07;
        heroBot.rotation.y += (pointerX * .2 - heroBot.rotation.y) * .035;
        heroBot.userData.head.rotation.y = pointerX * .12 + Math.sin(t * .5) * .04;
        heroBot.userData.head.rotation.z = greeting * .35;
        target.rotation.z += .008;
        orb.position.y = 1.2 + Math.sin(t) * .15;
        greeting = Math.max(0, greeting - .018);
      }
      hero.renderer.render(hero.scene, hero.camera);
    }
    drawHero();
  }

  var serviceFocusTarget = 0;
var serviceScene = initScene(q("#servicesCanvas"), "services");
  if (serviceScene) {
    var xPositions = [-4.65, -2.35, 0, 2.35, 4.65];
    var keys = ["leads", "design", "content", "seo", "marketing"];
    var types = ["scout", "pixel", "quill", "rank", "orbit"];
    for (var i = 0; i < 5; i++) {
      var x = xPositions[i];
      var island = new T.Group();
      island.position.set(x, i % 2 === 0 ? -.05 : .3, 0);
      island.scale.setScalar(.83);
      serviceScene.scene.add(island);
      add(island, new T.CylinderGeometry(.91, 1.04, .2, 36), materials.navy, [0, -.6, 0], [1, 1, 1]);
      add(island, new T.CylinderGeometry(.82, .9, .11, 36), materials.blue, [0, -.47, 0], [1, 1, 1]);
      var ring = add(island, new T.TorusGeometry(.83, .018, 8, 36), materials.sky, [0, -.39, 0], [1, 1, 1]);
      ring.rotation.x = Math.PI / 2;
      var character = mascot(types[i]);
      character.scale.setScalar(.7);
      character.position.set(x, i % 2 === 0 ? .3 : .65, .04);
      serviceScene.scene.add(character);
      var accent = add(serviceScene.scene, new T.TorusGeometry(.15, .02, 8, 24), materials.ice, [x, i % 2 === 0 ? 1.8 : 2.1, -.2], [1, 1, 1]);
      characters.push({ key: keys[i], model: character, accent: accent });
    }
    function drawServices() {
      requestAnimationFrame(drawServices);
      var t = performance.now() / 1000;
      characters.forEach(function (item, index) {
        if (!reduceMotion) {
          item.model.position.y = (index % 2 === 0 ? .3 : .65) + Math.sin(t * 1.15 + index) * .07;
          item.model.rotation.y = Math.sin(t * .4 + index) * .11;
          if (item.key === "content") {
            item.model.userData.wings[0].rotation.z = Math.sin(t * 2.5) * .14;
            item.model.userData.wings[1].rotation.z = -Math.sin(t * 2.5) * .14;
          }
          item.accent.rotation.y += .01;
          item.model.scale.setScalar(item.model.scale.x + ((item.model.userData.selected ? .78 : .7) - item.model.scale.x) * .04);
        }
      });
      serviceScene.camera.position.x += (serviceFocusTarget - serviceScene.camera.position.x) * .045;
      serviceScene.camera.lookAt(serviceFocusTarget, -.25, 0);
      serviceScene.renderer.render(serviceScene.scene, serviceScene.camera);
    }
    drawServices();
  }
  window.addEventListener("scroll", function () {
    var progress = Math.max(0, Math.min(1, (window.innerHeight - q("#services").getBoundingClientRect().top) / (window.innerHeight + q("#services").offsetHeight)));
    var heroProgress = Math.max(0, Math.min(1, window.scrollY / Math.max(1, window.innerHeight)));
    if (hero) {
      hero.camera.position.z = 8.8 + heroProgress * 2.1;
      hero.camera.position.y = 1.1 + heroProgress * .3;
      hero.camera.lookAt(0, .1, 0);
    }
    var canvasWidth = q("#servicesCanvas").clientWidth;
    var canvasHeight = q("#servicesCanvas").clientHeight;
    var baseZ = Math.max(13, 9.7 / Math.max(.58, canvasWidth / Math.max(1, canvasHeight)));
    serviceScene.camera.position.z = baseZ - progress * 1.6;
    serviceScene.camera.position.y = (canvasWidth < 560 ? 2.8 : 2.35) - progress * .22;
    serviceScene.camera.updateProjectionMatrix();
  }, { passive: true });
} else {
  q("#heroCanvas").classList.add("webgl-unavailable");
  q("#servicesCanvas").classList.add("webgl-unavailable");
}

function openService(key) {
  var item = serviceData[key];
  if (!item) return;
  q("#detailKicker").textContent = (Object.keys(serviceData).indexOf(key) + 1) + " / " + item[1];
  q("#detailTitle").textContent = item[0];
  q("#detailDescription").textContent = item[2];
  var list = q("#detailList");
  list.replaceChildren();
  item[3].forEach(function (text) {
    var li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
  var focusMap = { leads: -4.65, design: -2.35, content: 0, seo: 2.35, marketing: 4.65 };
  serviceFocusTarget = focusMap[key] * .34;
  q("#serviceDetail").classList.add("open");
  qa(".service-hotspot").forEach(function (b) {
    b.classList.toggle("active", b.dataset.service === key);
  });
  characters.forEach(function (c) { c.model.userData.selected = c.key === key; });
}
function closeService() {
  serviceFocusTarget = 0;
  q("#serviceDetail").classList.remove("open");
  qa(".service-hotspot").forEach(function (b) { b.classList.remove("active"); });
  characters.forEach(function (c) { c.model.userData.selected = false; });
}
qa(".service-hotspot, #servicesMobile button").forEach(function (b) {
  b.addEventListener("click", function () { openService(b.dataset.service); });
});
q("#detailClose").addEventListener("click", closeService);

// Portfolio filtering and concept modal.
var projects = [
  ["B2B Prospect Research", "LEAD GENERATION", "A demonstration research-dashboard concept showing how target accounts and prospect information can be organized. The figures and layout are illustrative, not client performance data."],
  ["Social Media Creative", "GRAPHIC DESIGN", "A sample campaign graphic exploring bold typography, blue-led art direction and a clear visual hierarchy. This is a demonstration concept."],
  ["Editorial Content Sample", "CONTENT WRITING", "A sample editorial layout for a business growth article. Replace with an approved writing sample when available."],
  ["SEO Audit Dashboard", "SEO", "A demonstration SEO dashboard with illustrative progress indicators. The data shown is conceptual and does not represent a client result."],
  ["Campaign Concept", "DIGITAL MARKETING", "A demonstration campaign visual focused on reaching a defined audience with a consistent message. This is not a live campaign case study."]
];
qa(".filter-button").forEach(function (button) {
  button.addEventListener("click", function () {
    qa(".filter-button").forEach(function (b) { b.classList.toggle("active", b === button); });
    qa(".portfolio-card").forEach(function (card) {
      card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
    });
  });
});
var modal = q("#projectModal");
function showProject(index) {
  var project = projects[index];
  if (!project) return;
  q("#modalTitle").textContent = project[0];
  q("#modalCategory").textContent = project[1] + " / DEMONSTRATION CONCEPT";
  q("#modalDescription").textContent = project[2];
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  q(".modal-close", modal).focus();
}
function closeProject() {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = "";
}
qa(".portfolio-card").forEach(function (card) {
  card.addEventListener("click", function () { showProject(Number(card.dataset.project)); });
});
qa("[data-close-modal]").forEach(function (button) {
  button.addEventListener("click", closeProject);
});
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") { closeMenu(); closeProject(); }
});

// Prospect game: five suitable fictional prospects, three distractors.
var prospects = [
  { name: "Northstar Cloud", detail: "B2B SaaS · Workflow tools / US · 120 employees", fit: true },
  { name: "Harbor Metrics", detail: "B2B SaaS · Analytics platform / US · 260 employees", fit: true },
  { name: "Brightpath Systems", detail: "B2B SaaS · HR software / US · 78 employees", fit: true },
  { name: "Summit Automate", detail: "B2B SaaS · Operations / US · 410 employees", fit: true },
  { name: "Bluepeak Revenue", detail: "B2B SaaS · Sales enablement / US · 190 employees", fit: true },
  { name: "Cedar & Stone", detail: "Consumer retail · Home goods / US · 85 employees", fit: false },
  { name: "Alpine Apps", detail: "Mobile games · Consumer app / Canada · 34 employees", fit: false },
  { name: "Metro Freight", detail: "Logistics · Freight services / US · 720 employees", fit: false }
];
var playing = false;
var paused = false;
var score = 0;
var chosen = new Set();
var startButton = q("#startGame");
var pauseButton = q("#pauseGame");
var resetButton = q("#resetGame");
function updateGame() {
  q("#gameScore").textContent = score + " / 5";
  q("#gameRemaining").textContent = String(5 - score);
  q("#gameProgress").style.width = (score * 20) + "%";
}
function shuffled(list) {
  var copy = list.slice();
  for (var i = copy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
  }
  return copy;
}
function renderProspects() {
  var grid = q("#prospectGrid");
  grid.replaceChildren();
  shuffled(prospects).forEach(function (prospect) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "prospect-card";
    var name = document.createElement("b");
    var detail = document.createElement("small");
    var label = document.createElement("span");
    name.textContent = prospect.name;
    detail.textContent = prospect.detail;
    label.textContent = "DEMO PROFILE · SELECT";
    button.append(name, detail, label);
    button.disabled = !playing || paused;
    button.addEventListener("click", function () { chooseProspect(prospect, button); });
    grid.appendChild(button);
  });
}
function chooseProspect(prospect, button) {
  if (!playing || paused || chosen.has(prospect.name)) return;
  chosen.add(prospect.name);
  if (prospect.fit) {
    score++;
    button.classList.add("correct");
    q("span", button).textContent = "✓ GOOD-FIT PROSPECT";
    q("#gameFeedback").textContent = "Good match. This company fits the target profile.";
  } else {
    button.classList.add("incorrect");
    q("span", button).textContent = "NOT A MATCH · TRY ANOTHER";
    q("#gameFeedback").textContent = "Not quite. Check sector, location and company size.";
  }
  button.disabled = true;
  updateGame();
  if (score === 5) finishGame();
}
function beginGame() {
  playing = true; paused = false; score = 0; chosen.clear();
  q("#gameComplete").hidden = true;
  q("#gameStatus").textContent = "IN PROGRESS";
  q("#gameInstruction").textContent = "Choose the five US-based B2B SaaS businesses with 50–500 employees.";
  q("#gameFeedback").textContent = "";
  startButton.disabled = true; startButton.textContent = "Game Running";
  pauseButton.disabled = false; pauseButton.textContent = "Pause"; resetButton.disabled = false;
  renderProspects(); updateGame();
}
function finishGame() {
  playing = false;
  q("#gameStatus").textContent = "COMPLETED";
  q("#gameInstruction").textContent = "All five suitable prospects identified.";
  q("#gameFeedback").textContent = "Great prospect-fit judgement!";
  qa(".prospect-card").forEach(function (b) { b.disabled = true; });
  q("#gameComplete").hidden = false;
  startButton.disabled = false; startButton.textContent = "Play Again";
  pauseButton.disabled = true; resetButton.disabled = false;
}
startButton.addEventListener("click", beginGame);
pauseButton.addEventListener("click", function () {
  if (!playing && !paused) return;
  paused = !paused;
  pauseButton.textContent = paused ? "Resume" : "Pause";
  q("#gameStatus").textContent = paused ? "PAUSED" : "IN PROGRESS";
  q("#gameInstruction").textContent = paused ? "Mission paused. Resume when you're ready." : "Choose the five US-based B2B SaaS businesses with 50–500 employees.";
  qa(".prospect-card").forEach(function (b) {
    b.disabled = paused || chosen.has(q("b", b).textContent);
  });
  q("#gameFeedback").textContent = paused ? "Scout is taking a short break." : "Back to prospect discovery.";
});
resetButton.addEventListener("click", function () {
  playing = false; paused = false; score = 0; chosen.clear();
  q("#gameStatus").textContent = "READY";
  q("#gameInstruction").textContent = "Press start, then choose the five businesses that match the target profile.";
  q("#gameFeedback").textContent = "";
  q("#gameComplete").hidden = true;
  q("#prospectGrid").innerHTML = '<div class="prospect-placeholder"><span>SCOUT</span><b>Ready when you are.</b><small>Eight sample prospects will appear here.</small></div>';
  startButton.disabled = false; startButton.textContent = "Start Game";
  pauseButton.disabled = true; pauseButton.textContent = "Pause";
  resetButton.disabled = true;
  updateGame();
});
updateGame();

// Save contact submissions through the public database-backed endpoint.
q("#contactForm").addEventListener("submit", async function (event) {
  event.preventDefault();
  var form = event.currentTarget;
  var status = q("#formFeedback");
  var button = q("#submitInquiry");
  var values = Object.fromEntries(new FormData(form).entries());
  status.classList.remove("error");
  status.textContent = "";
  if (!values.fullName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !values.service || values.message.trim().length < 15) {
    status.textContent = "Please complete your name, valid email, service and a message of at least 15 characters.";
    status.classList.add("error");
    return;
  }
  button.disabled = true;
  button.textContent = "Sending inquiry…";
  try {
    var apiBase = window.__HATCHABLE__ && window.__HATCHABLE__.api ? window.__HATCHABLE__.api : "/api";
    var response = await fetch(apiBase + "/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    var result = await response.json();
    if (!response.ok) throw new Error(result.error || "We could not save your inquiry. Please try again.");
    status.textContent = result.message || "Thank you. Your inquiry has been received.";
    form.reset();
    notify("Inquiry received. Thank you!");
  } catch (error) {
    status.textContent = error.message || "Something went wrong. Please try again shortly.";
    status.classList.add("error");
  }
  button.disabled = false;
  button.innerHTML = 'Send Project Inquiry <span>↗</span>';
});

// Footer easter egg.
var sequence = ["scout", "pixel", "quill", "rank", "orbit"];
var eggProgress = [];
qa("[data-egg]").forEach(function (button) {
  button.addEventListener("click", function () {
    var key = button.dataset.egg;
    if (key === sequence[eggProgress.length]) {
      eggProgress.push(key);
      button.classList.add("selected");
      if (eggProgress.length === sequence.length) {
        q("#easterMessage").hidden = false;
        notify("The creative crew says hello!");
        window.setTimeout(function () {
          q("#easterMessage").hidden = true;
          eggProgress = [];
          qa("[data-egg]").forEach(function (b) { b.classList.remove("selected"); });
        }, 3000);
      }
    } else {
      eggProgress = key === sequence[0] ? [key] : [];
      qa("[data-egg]").forEach(function (b) {
        b.classList.toggle("selected", b.dataset.egg === key && key === sequence[0]);
      });
      notify("Start with S, then follow the crew.");
    }
  });
});
})();