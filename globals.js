
// ============================================================
// globals.js — THE NEGOTIATION
// All state, constants, setup, draw, routing, input
// ============================================================

// --- Midnight color palette ---

const BG = [18, 27, 38];
const TEXT_MAIN = [243, 241, 233];
const TEXT_SOFT = [168, 180, 192];
const ACCENT = [242, 182, 93];
const CHART_ACCENT = [99, 214, 197];
const DATA_SERIES_COLORS = [
  CHART_ACCENT,
  [145, 183, 255],
  ACCENT,
  [242, 140, 98],
  [236, 145, 176],
  [192, 160, 245]
];
const reduceMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

// --- Scene Management ---
let currentScene = 0;
let transitioning = false;
let transitionTarget = -1;
let transitionPhase = 0;
let dimAlpha = 0;          // 0 = fully visible, 255 = fully black
const DIM_SPEED = 8.5;     // fade speed per frame

// --- Scene 0: Typing ---
let typedText = "";
let words = [];
let wordFreqs = {};
let floatingWords = [];
let wordCount = 0;
let maxWordFreq = 0;
let scene0Ready = false;
const WORDS_TO_ADVANCE = 30;
let scene3Questions = [];
let questionIndex = 0;
let questionAlpha = 0;
let matrixSize = 8;
let matrixCells = [];
let scene5CriticalReached = false;
let scene10Phase = 0;
let scene9Animals = [];
let scene9Exceptions = [];
let cursorX = 0;
let cursorY = 0;
let cursorBlink = true;
let cursorTimer = 0;

// --- Scene 1: Reveal ---
let scene1Timer = 0;
let scene1Phase = 0;
let revealProgress = 0;
let sortedFreqs = [];
let curvePoints = [];

// --- Scene 2: Universality ---
let scene2Timer = 0;
let scene2Phase = 0;
let universalityExamples = [];

// --- Scene 3: Why? ---
let scene3Timer = 0;
let scene3Phase = 0;
let scene3Cards = [];

// --- Scene 4: The Game (8x8 matrix) ---
let scene4Timer = 0;
let scene4Phase = 0;
let matrix = [];
let matrixTarget = [];
let matrixLabels = { rows: [], cols: [] };

// --- Scene 5: Phase Transition (slider) ---
let scene5Timer = 0;
let scene5Phase = 0;
let lambdaSlider = {
  x: 0, y: 0, w: 0, h: 0,
  handleX: 0, handleY: 0, handleR: 8,
  value: 0,        // 0 to 1
  dragging: false,
  visible: false
};

// --- Scene 6: Monkey Typing ---
let scene6Timer = 0;
let scene6Phase = 0;
let randomTypingText = "";
let randomTypingFreqs = {};
let randomTypingSpeed = 3; // chars per frame

// --- Scene 7: Four Laws ---
let scene7Timer = 0;
let scene7Phase = 0;
let lawCharts = [];

// --- Scene 8: 986 Languages ---
let scene8Timer = 0;
let scene8Phase = 0;
let langDots = [];
let dotsSpawned = 0;
let userEfficiency = 0;


// --- Scene 9: Boundary ---
let scene9Timer = 0;
let scene9Phase = 0;
let animalDots = [];
let exceptionDots = [];
let animalSpawnIndex = 0;
let exceptionSpawnIndex = 0;

// --- Scene 10: End Card ---
let scene10Timer = 0;
let endTitleAlpha = 0;

// ============================================================
// p5.js SETUP
// ============================================================
function setup() {
  var visualStage = document.getElementById("visual-stage");
  var experienceCanvas = createCanvas(visualStage.clientWidth || windowWidth, visualStage.clientHeight || windowHeight);
  experienceCanvas.parent(visualStage);
  experienceCanvas.elt.setAttribute("aria-hidden", "true");
  textFont("Space Grotesk");
  frameRate(60);

  // Initialize cursor position for Scene 0
  cursorX = width * 0.08;
  cursorY = height * 0.45;

  // Initialize slider position
  lambdaSlider.w = width * 0.5;
  lambdaSlider.h = 4;
  lambdaSlider.x = (width - lambdaSlider.w) / 2;
  lambdaSlider.y = height * 0.78;
  lambdaSlider.handleX = lambdaSlider.x;
  lambdaSlider.handleY = lambdaSlider.y;

  // Initialize first scene
  initCurrentScene();

  // Dismiss loading screen
  document.body.classList.add("loaded");


}

// ============================================================
// p5.js DRAW (main loop)
// ============================================================
function draw() {
  // Background
  background(BG[0], BG[1], BG[2]);

  // Draw current scene
  if (!transitioning) {
    drawCurrentScene();
  }

  // Scene transition overlay
  if (transitioning) {
    drawTransition();
  }
}

// ============================================================
// SCENE ROUTING
// ============================================================
function initCurrentScene() {
  switch (currentScene) {
    case 0:  initScene0();  break;
    case 1:  initScene1();  break;
    case 2:  initScene2();  break;
    case 3:  initScene3();  break;
    case 4:  initScene4();  break;
    case 5:  initScene5();  break;
    case 6:  initScene6();  break;
    case 7:  initScene7();  break;
    case 8:  initScene8();  break;
    case 9:  initScene9();  break;
    case 10: initScene10(); break;
  }

  // Connect to anime.js overlay/bridge animations
  if (typeof animBridge !== "undefined") {
    animBridge.enterScene(currentScene);
  }

  updateCursorForScene(currentScene);
  if (typeof syncExperienceControls === "function") syncExperienceControls();
}

function drawCurrentScene() {
  switch (currentScene) {
    case 0:  drawScene0();  break;
    case 1:  drawScene1();  break;
    case 2:  drawScene2();  break;
    case 3:  drawScene3();  break;
    case 4:  drawScene4();  break;
    case 5:  drawScene5();  break;
    case 6:  drawScene6();  break;
    case 7:  drawScene7();  break;
    case 8:  drawScene8();  break;
    case 9:  drawScene9();  break;
    case 10: drawScene10(); break;
  }
}

// ============================================================
// SCENE TRANSITIONS
// ============================================================
function goToScene(targetScene) {
  if (transitioning || targetScene < 0 || targetScene > 10 || targetScene === currentScene) return;
  if (currentScene === 0 && targetScene > 0 && !scene0Ready) return;
  if (typeof playSceneCue === "function") playSceneCue();

  transitioning = true;
  transitionTarget = targetScene;
  transitionPhase = 1;
  dimAlpha = 0;
  if (typeof syncExperienceControls === "function") syncExperienceControls();
}

function advanceScene() {
  goToScene(currentScene + 1);
}

function drawTransition() {
  if (reduceMotion) {
    currentScene = transitionTarget;
    transitionTarget = -1;
    transitionPhase = 0;
    dimAlpha = 0;
    transitioning = false;
    initCurrentScene();
    return;
  }

  if (transitionPhase === 1) {
    dimAlpha = min(dimAlpha + DIM_SPEED, 255);
    drawCurrentScene();
    noStroke();
    fill(BG[0], BG[1], BG[2], dimAlpha);
    rect(0, 0, width, height);

    if (dimAlpha >= 255) {
      currentScene = transitionTarget;
      transitionTarget = -1;
      initCurrentScene();
      transitionPhase = 2;
    }
    return;
  }

  if (transitionPhase === 2) {
    drawCurrentScene();
    dimAlpha = max(dimAlpha - DIM_SPEED, 0);
    noStroke();
    fill(BG[0], BG[1], BG[2], dimAlpha);
    rect(0, 0, width, height);

    if (dimAlpha <= 0) {
      transitionPhase = 0;
      transitioning = false;
      if (typeof syncExperienceControls === "function") syncExperienceControls();
    }
  }
}

// ============================================================
// CURSOR CONTROL
// ============================================================
function updateCursorForScene() {
  document.body.classList.remove("hide-cursor", "slider-active");
  document.body.classList.add("show-cursor");
}

// ============================================================
// INPUT HANDLING
// ============================================================



function mouseClicked(event) {
  if (!event || !(event.target instanceof HTMLCanvasElement)) return;
  if (transitioning || currentScene === 0 || currentScene === 5 || currentScene === 10) return;
  advanceScene();
}

function resetExperience() {
  currentScene = 0;
  transitioning = false;
  transitionTarget = -1;
  transitionPhase = 0;
  dimAlpha = 0;

  typedText = "";
  words = [];
  wordFreqs = {};
  floatingWords = [];
  wordCount = 0;
  maxWordFreq = 0;
  scene0Ready = false;
  userEfficiency = 0;

  scene1Timer = 0;
  scene1Phase = 0;
  revealProgress = 0;
  sortedFreqs = [];
  curvePoints = [];
  scene2Timer = 0;
  scene2Phase = 0;
  universalityExamples = [];
  scene3Timer = 0;
  scene3Phase = 0;
  scene3Questions = [];
  scene3Cards = [];
  questionIndex = 0;
  questionAlpha = 0;
  scene4Timer = 0;
  scene4Phase = 0;
  matrixCells = [];
  scene5Timer = 0;
  scene5Phase = 0;
  scene5CriticalReached = false;
  lambdaSlider.value = 0;
  lambdaSlider.visible = false;
  lambdaSlider.dragging = false;
  scene6Timer = 0;
  scene6Phase = 0;
  randomTypingText = "";
  randomTypingFreqs = {};
  scene7Timer = 0;
  scene7Phase = 0;
  lawCharts = [];
  scene8Timer = 0;
  scene8Phase = 0;
  langDots = [];
  dotsSpawned = 0;
  scene9Timer = 0;
  scene9Phase = 0;
  animalDots = [];
  exceptionDots = [];
  animalSpawnIndex = 0;
  exceptionSpawnIndex = 0;
  scene10Timer = 0;
  scene10Phase = 0;

  var input = document.getElementById("word-entry");
  if (input) input.value = "";
  if (typeof updateTypingState === "function") updateTypingState("");
  initCurrentScene();
  if (input) input.focus({ preventScroll: true });
}


// ============================================================
// WINDOW RESIZE
// ============================================================
function windowResized() {
  var visualStage = document.getElementById("visual-stage");
  resizeCanvas(Math.max(1, visualStage.clientWidth), Math.max(1, visualStage.clientHeight));

  lambdaSlider.w = width * 0.5;
  lambdaSlider.x = (width - lambdaSlider.w) / 2;
  lambdaSlider.y = height * 0.78;
  lambdaSlider.handleY = lambdaSlider.y;
  lambdaSlider.handleX = lambdaSlider.x + lambdaSlider.value * lambdaSlider.w;
  cursorX = width * 0.08;
  cursorY = height * 0.45;
  if (typeof syncExperienceControls === "function") syncExperienceControls();
}


function computeUserExponent() {
  // Build sorted frequency array from the actual wordFreqs object
  var keys = Object.keys(wordFreqs);
  if (keys.length < 5) {
    userExponent = 0;
    return;
  }
  var freqs = [];
  for (var i = 0; i < keys.length; i++) {
    freqs.push(wordFreqs[keys[i]]);
  }
  freqs.sort(function(a, b) { return b - a; });

  // Least-squares on log-log to estimate Zipf exponent
  var sumX = 0, sumY = 0, sumXX = 0, sumXY = 0;
  var n = min(freqs.length, 50);
  for (var i = 0; i < n; i++) {
    var lx = Math.log(i + 1);
    var ly = Math.log(freqs[i]);
    sumX += lx;
    sumY += ly;
    sumXX += lx * lx;
    sumXY += lx * ly;
  }
  var slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  userExponent = Math.abs(slope);
  userExponent = constrain(userExponent, 0.3, 2.5);
}



