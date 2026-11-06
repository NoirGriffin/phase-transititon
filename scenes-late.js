// ============================================================
// scenes-late.js — The Negotiation of Language
// Scenes 6–10: Random typing, Four laws, Cross-language
//              evidence, Boundaries, Reflection
// Complete latest version
// ============================================================

var scene8BarHeights = [];
var userExponent = 0;

function computeUserExponent() {
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

// ============================================================
// SCENE 6: RANDOM TYPING
// Phase 0: Random characters appear
// Phase 1: Frequency analysis builds
// Phase 2: Compare the toy curve with the user's sample
// ============================================================

function initScene6() {
  scene6Timer = 0;
  scene6Phase = 0;
  randomTypingText = "";
  randomTypingFreqs = {};
  randomTypingSpeed = 3;
}

function drawScene6() {
  scene6Timer++;

  if (scene6Phase < 2) {
    for (var i = 0; i < randomTypingSpeed; i++) {
      generateRandomLetter();
    }
  }

  if (scene6Timer > 300) scene6Phase = max(scene6Phase, 1);
  if (scene6Timer > 600) scene6Phase = max(scene6Phase, 2);

  switch (scene6Phase) {
    case 0: drawScene6Phase0(); break;
    case 1: drawScene6Phase1(); break;
    case 2: drawScene6Phase2(); break;
  }
}

function generateRandomLetter() {
  var r = random();
  if (r < 0.2) {
    randomTypingText += " ";

    var words = randomTypingText.trim().split(/\s+/);
    var lastWord = words[words.length - 1];
    if (lastWord && lastWord.length > 0) {
      var w = lastWord.toLowerCase();
      randomTypingFreqs[w] = (randomTypingFreqs[w] || 0) + 1;
    }
  } else {
    var code = floor(random(97, 123));
    randomTypingText += String.fromCharCode(code);
  }
}

function drawScene6Phase0() {
  push();
  textFont("Space Grotesk");
  var tSize = min(width, height) * 0.014;
  tSize = constrain(tSize, 10, 13);
  textSize(tSize);
  textAlign(LEFT, TOP);
  fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], 120);

  var displayText = randomTypingText.slice(-500);
  var maxW = width * 0.84;
  text(displayText, width * 0.08, height * 0.15, maxW, height * 0.6);
  pop();

  // Title
  push();
  textFont("Space Grotesk");
  textAlign(CENTER, TOP);
  var titleSize = min(width, height) * 0.022;
  titleSize = constrain(titleSize, 14, 20);
  textSize(titleSize);
  fill(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2], min(scene6Timer * 2, 200));
  text(STORY_CONTENT.visualCopy.randomTypingTitle, width / 2, height * 0.06);
  pop();

  drawNarrativeText(STORY_CONTENT.visualCopy.randomTyping[0], min(scene6Timer * 1.5, 140));
}

function drawScene6Phase1() {
  var chartX = width * 0.55;
  var chartY = height * 0.15;
  var chartW = width * 0.38;
  var chartH = height * 0.55;

  // Random text (left side, smaller)
  push();
  textFont("Space Grotesk");
  var tSize = min(width, height) * 0.011;
  tSize = constrain(tSize, 8, 11);
  textSize(tSize);
  textAlign(LEFT, TOP);
  fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], 80);
  var displayText = randomTypingText.slice(-300);
  text(displayText, width * 0.04, height * 0.15, width * 0.44, height * 0.55);
  pop();

  // Chart
  drawLogLogAxes(chartX, chartY, chartW, chartH, 120);

  // Random-text frequency curve
  var randomSorted = sortFrequencies(randomTypingFreqs);
  if (randomSorted.length > 0) {
    var randomFrequencies = [];
    for (var k = 0; k < min(randomSorted.length, 50); k++) {
      randomFrequencies.push(randomSorted[k].freq);
    }
    drawZipfCurve(randomFrequencies, chartX, chartY, chartW, chartH, [255, 110, 110], 180);
  }

  // Label
  push();
  textFont("Space Grotesk");
  var labelSize = min(width, height) * 0.012;
  labelSize = constrain(labelSize, 9, 12);
  textSize(labelSize);
  textAlign(LEFT, CENTER);
  fill(255, 110, 110, 150);
  text("\u2022 " + STORY_CONTENT.visualCopy.randomTypingLegend, chartX, chartY + chartH + 20);
  pop();

  drawNarrativeText(STORY_CONTENT.visualCopy.randomTyping[1], min((scene6Timer - 300) * 1.5, 140));
}

function drawScene6Phase2() {
  var chartX = width * 0.15;
  var chartY = height * 0.12;
  var chartW = width * 0.7;
  var chartH = height * 0.55;

  drawLogLogAxes(chartX, chartY, chartW, chartH, 150);
  drawZipfReference(chartX, chartY, chartW, chartH, 80);

  // Random-text curve
  var randomSorted = sortFrequencies(randomTypingFreqs);
  if (randomSorted.length > 0) {
    var randomFrequencies = [];
    for (var k = 0; k < min(randomSorted.length, 50); k++) {
      randomFrequencies.push(randomSorted[k].freq);
    }
    drawZipfCurve(randomFrequencies, chartX, chartY, chartW, chartH, [255, 110, 110], 160);
  }

  // User curve
  if (sortedFreqs.length > 0) {
    var uFreqs = [];
    for (var k = 0; k < sortedFreqs.length; k++) {
      uFreqs.push(sortedFreqs[k].freq);
    }
    drawZipfCurve(uFreqs, chartX, chartY, chartW, chartH, ACCENT, 200);
  }

  // Ideal Zipf curve
  var idealFreqs = generateZipfFreqs(50, 1.0, sortedFreqs.length > 0 ? sortedFreqs[0].freq : 100);
  drawZipfCurve(idealFreqs, chartX, chartY, chartW, chartH, [120, 220, 160], 80);

  // Legend
  push();
  textFont("Space Grotesk");
  var labelSize = min(width, height) * 0.012;
  labelSize = constrain(labelSize, 9, 12);
  textSize(labelSize);
  textAlign(LEFT, CENTER);

  var legendY = chartY + chartH + 25;
  var legendGap = labelSize + 8;

  fill(ACCENT[0], ACCENT[1], ACCENT[2], 180);
  text("\u2022 " + STORY_CONTENT.visualCopy.chartLabels.userCurve, chartX, legendY);

  fill(255, 110, 110, 160);
  text("\u2022 " + STORY_CONTENT.visualCopy.randomTypingLegend, chartX, legendY + legendGap);

  fill(120, 220, 160, 100);
  text("\u2022 " + STORY_CONTENT.visualCopy.chartLabels.idealCurve, chartX, legendY + legendGap * 2);
  pop();

  // Key insight
  var insightAlpha = min((scene6Timer - 600) * 2, 200);
  push();
  textFont("Space Grotesk");
  textAlign(CENTER, CENTER);
  var insightSize = min(width, height) * 0.016;
  insightSize = constrain(insightSize, 11, 15);
  textSize(insightSize);
  fill(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2], insightAlpha);
  text(STORY_CONTENT.visualCopy.randomTypingHeadline, width / 2, height * 0.88);
  pop();

  drawNarrativeText(STORY_CONTENT.visualCopy.randomTyping[2], min((scene6Timer - 600) * 1.5, 140));

  if (scene6Timer > 720) {
    drawClickPrompt(min(scene6Timer - 720, 100));
  }
}


// ============================================================
// SCENE 7: THE CONSTELLATION — Four Interconnected Laws
// Zipf's law isn't alone. The 2025 paper shows four linguistic
// laws share a single optimization origin. This scene reveals
// them as a constellation: nodes appear one by one, connection
// lines draw between them, and the unifying principle emerges
// at the center.
//
// Phase 0 (0-120):   First node — Zipf's law (the one they know)
// Phase 1 (120-240): Second node — Brevity law + connection
// Phase 2 (240-360): Third node — Menzerath's law + connections
// Phase 3 (360-480): Fourth node — Meaning distribution + all connections
// Phase 4 (480-600): Center label — "optimization" unifying text
// Phase 5 (600+):    Click prompt
//
// NO animBridge dependency — pure p5.js lerp animations
// Variables: scene7Timer, scene7Phase (globals.js)
//            lawCharts (globals.js, populated in init)
// Helpers:   drawNarrativeText(), drawClickPrompt() (helpers.js)
// Content:   STORY_CONTENT.laws[], .visualCopy.frameworkTitle,
//            .visualCopy.frameworkSubtitle, .visualCopy.framework
// ============================================================

// Connection map: which nodes connect to which
// Each entry is [nodeA, nodeB]
var constellationEdges = [
  [0, 1],  // Zipf → Brevity
  [0, 2],  // Zipf → Menzerath
  [1, 3],  // Brevity → Meaning
  [2, 3],  // Menzerath → Meaning
  [0, 3],  // Zipf → Meaning (diagonal)
  [1, 2]   // Brevity → Menzerath (diagonal)
];

function initScene7() {
  scene7Timer = 0;
  scene7Phase = 0;

  // Node colors — distinct, from palette
  var nodeColors = [
    ACCENT,                // Zipf — amber/gold (the familiar one)
    [145, 183, 255],       // Brevity — soft blue
    [99, 214, 197],        // Menzerath — teal (CHART_ACCENT)
    [236, 145, 176]        // Meaning — soft pink
  ];

  // Build node data from STORY_CONTENT.laws
  lawCharts = [];
  for (var i = 0; i < STORY_CONTENT.laws.length; i++) {
    var law = STORY_CONTENT.laws[i];
    lawCharts.push({
      name: law.name,
      subtitle: law.subtitle,
      color: nodeColors[i],
      // Alpha tracks fade-in (0 → 255)
      alpha: 0,
      // Dot pulse offset for visual variety
      pulseOffset: i * 1.7
    });
  }
}

function drawScene7() {
  scene7Timer++;

  // Phase progression
  if (scene7Timer > 120) scene7Phase = max(scene7Phase, 1);
  if (scene7Timer > 240) scene7Phase = max(scene7Phase, 2);
  if (scene7Timer > 360) scene7Phase = max(scene7Phase, 3);
  if (scene7Timer > 480) scene7Phase = max(scene7Phase, 4);
  if (scene7Timer > 600) scene7Phase = max(scene7Phase, 5);

  // --- Node positions: diamond layout, centered ---
  var cx = width / 2;
  var cy = height * 0.42;
  var spread = min(width, height) * 0.22;
  spread = constrain(spread, 80, 200);

  // [0]=top, [1]=right, [2]=left, [3]=bottom
  var nodePositions = [
    { x: cx,            y: cy - spread },       // Zipf (top)
    { x: cx + spread,   y: cy },                // Brevity (right)
    { x: cx - spread,   y: cy },                // Menzerath (left)
    { x: cx,            y: cy + spread }         // Meaning (bottom)
  ];

  // --- Fade in nodes progressively ---
  for (var i = 0; i < lawCharts.length; i++) {
    var targetAlpha = 0;
    if (i === 0 && scene7Timer > 30)  targetAlpha = 255;
    if (i === 1 && scene7Timer > 150) targetAlpha = 255;
    if (i === 2 && scene7Timer > 270) targetAlpha = 255;
    if (i === 3 && scene7Timer > 390) targetAlpha = 255;

    lawCharts[i].alpha = lerp(lawCharts[i].alpha, targetAlpha, 0.05);
  }

  // --- Draw connection lines ---
  // Each edge appears when BOTH nodes have alpha > 50
  push();
  for (var e = 0; e < constellationEdges.length; e++) {
    var a = constellationEdges[e][0];
    var b = constellationEdges[e][1];
    var edgeAlpha = min(lawCharts[a].alpha, lawCharts[b].alpha);

    if (edgeAlpha > 10) {
      // Line draw progress: grows from node A to node B
      var edgeProgress = constrain(edgeAlpha / 255, 0, 1);
      var ax = nodePositions[a].x;
      var ay = nodePositions[a].y;
      var bx = nodePositions[b].x;
      var by = nodePositions[b].y;

      var drawX = lerp(ax, bx, edgeProgress);
      var drawY = lerp(ay, by, edgeProgress);

      stroke(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], edgeAlpha * 0.2);
      strokeWeight(1);
      line(ax, ay, drawX, drawY);
    }
  }
  pop();

  // --- Draw nodes ---
  for (var i = 0; i < lawCharts.length; i++) {
    var node = lawCharts[i];
    var pos = nodePositions[i];
    var a = node.alpha;

    if (a < 1) continue;

    // Pulsing dot
    var pulse = reduceMotion ? 10 : 10 + sin(frameCount * 0.03 + node.pulseOffset) * 3;

    // Outer ring (soft)
    push();
    noFill();
    stroke(node.color[0], node.color[1], node.color[2], a * 0.2);
    strokeWeight(1);
    ellipse(pos.x, pos.y, pulse * 2.5, pulse * 2.5);
    pop();

    // Solid dot
    push();
    noStroke();
    fill(node.color[0], node.color[1], node.color[2], a * 0.85);
    ellipse(pos.x, pos.y, pulse, pulse);
    pop();

    // Law name
    push();
    textFont("Space Grotesk");
    var nameSize = min(width, height) * 0.016;
    nameSize = constrain(nameSize, 11, 16);
    textSize(nameSize);
    textAlign(CENTER, CENTER);
    fill(node.color[0], node.color[1], node.color[2], a * 0.9);

    // Position label based on node location to avoid overlap
    var labelOffsetY = 0;
    if (i === 0) labelOffsetY = -pulse - 18;      // top node: label above
    if (i === 1) labelOffsetY = pulse + 14;        // right node: label below
    if (i === 2) labelOffsetY = pulse + 14;         // left node: label below
    if (i === 3) labelOffsetY = pulse + 18;         // bottom node: label below

    text(node.name, pos.x, pos.y + labelOffsetY);

    // Subtitle
    textFont("IBM Plex Mono");
    var subSize = nameSize * 0.7;
    textSize(subSize);
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], a * 0.6);
    text(node.subtitle, pos.x, pos.y + labelOffsetY + nameSize + 2);
    pop();
  }

  // --- Center unifying label (Phase 4+) ---
  if (scene7Phase >= 4) {
    var centerAlpha = min((scene7Timer - 480) * 2, 200);

    push();
    textFont("Space Grotesk");
    textAlign(CENTER, CENTER);

    // Main title
    var titleSize = min(width, height) * 0.02;
    titleSize = constrain(titleSize, 12, 20);
    textSize(titleSize);
    fill(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2], centerAlpha);
    text(STORY_CONTENT.visualCopy.frameworkTitle, cx, cy);

    // Subtitle
    var subSize = titleSize * 0.75;
    textSize(subSize);
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], centerAlpha * 0.7);
    text(STORY_CONTENT.visualCopy.frameworkSubtitle, cx, cy + titleSize + 6);
    pop();
  }


  // --- Narrative text (phase-specific, reads from array) ---
  if (scene7Phase < 4) {
    var fw = STORY_CONTENT.visualCopy.framework;
    var narrAlpha = 0;
    var narrText = "";

    if (typeof fw === "string") {
      // Fallback: if framework is still a single string
      narrText = fw;
      narrAlpha = min(scene7Timer * 1.5, 140);
    } else {
      // Array: pick the text for current phase
      var phaseIndex = min(scene7Phase, fw.length - 1);
      narrText = fw[phaseIndex];
      if (scene7Phase === 0) {
        narrAlpha = min(scene7Timer * 1.5, 140);
      } else {
        // Fade in fresh for each new phase
        var phaseStart = scene7Phase * 120;
        narrAlpha = min((scene7Timer - phaseStart) * 2, 140);
      }
    }

    drawNarrativeText(narrText, narrAlpha);
  }


  // --- Click prompt ---
  if (scene7Phase >= 5) {
    drawClickPrompt(min(scene7Timer - 600, 100));
  }
}



// ============================================================
// SCENE 8: 986 LANGUAGES — Histogram + Personal Dot
// Phase 0: Empty histogram frame fades in
// Phase 1: Bars grow upward one by one (staggered)
// Phase 2: Notable language markers appear
// Phase 3: YOUR dot drops in with callout
// Phase 4: Personal connection text + click prompt
//
// Variables used from globals.js:
//   scene8Timer, scene8Phase, wordFreqs, wordCount, sortedFreqs, userEfficiency
// Variables used from Part 1 of this file:
//   scene8BarHeights, userExponent, computeUserExponent()
// Helpers used from helpers.js:
//   drawNarrativeText(), drawClickPrompt(), formatEditorialText(), sortFrequencies()
// STORY_CONTENT paths:
//   languageHistogram.bins[], .notableLanguages[], .totalLanguages, .binWidth
//   languageEvidence.sampleSize, .reportedSharePercent
//   visualCopy.languageDetails[0–3]
//   visualCopy.chartLabels.clickPrompt
// ============================================================

function initScene8() {
  scene8Timer = 0;
  scene8Phase = 0;
  scene8BarHeights = [];

  var bins = STORY_CONTENT.languageHistogram.bins;
  for (var i = 0; i < bins.length; i++) {
    scene8BarHeights.push(0);
  }

  // Compute user exponent from wordFreqs if enough words exist
  computeUserExponent();
}

function drawScene8() {
  scene8Timer++;

  // Phase progression
  if (scene8Timer > 60)  scene8Phase = max(scene8Phase, 1);
  if (scene8Timer > 300) scene8Phase = max(scene8Phase, 2);
  if (scene8Timer > 450) scene8Phase = max(scene8Phase, 3);
  if (scene8Timer > 600) scene8Phase = max(scene8Phase, 4);

  var histData = STORY_CONTENT.languageHistogram;
  var bins = histData.bins;

  // Chart dimensions
  var chartX = width * 0.1;
  var chartY = height * 0.08;
  var chartW = width * 0.78;
  var chartH = height * 0.58;
  var chartBottom = chartY + chartH;

  // Find max count for scaling
  var maxCount = 0;
  for (var i = 0; i < bins.length; i++) {
    if (bins[i].count > maxCount) maxCount = bins[i].count;
  }

  var baseAlpha = min(scene8Timer * 3, 220);
  var barW = (chartW / bins.length) * 0.8;
  var barGap = (chartW / bins.length) * 0.2;

  // Chart frame (axes)
  push();
  stroke(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], baseAlpha * 0.4);
  strokeWeight(1);
  line(chartX, chartBottom, chartX + chartW, chartBottom);
  line(chartX, chartY, chartX, chartBottom);
  pop();

  // Axis labels
  push();
  textFont("IBM Plex Mono");
  textSize(constrain(min(width, height) * 0.009, 7, 10));
  fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], baseAlpha * 0.6);
  textAlign(CENTER, TOP);
  text("Zipf exponent", chartX + chartW / 2, chartBottom + 28);
  push();
  translate(chartX - 20, chartY + chartH / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, BOTTOM);
  text("number of languages", 0, 0);
  pop();
  pop();

  // X axis tick labels (every other bin)
  push();
  textFont("IBM Plex Mono");
  textSize(constrain(min(width, height) * 0.008, 6, 9));
  fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], baseAlpha * 0.5);
  textAlign(CENTER, TOP);
  for (var i = 0; i < bins.length; i += 2) {
    var tickX = chartX + (i + 0.5) * (chartW / bins.length);
    text(nf(bins[i].center, 1, 2), tickX, chartBottom + 6);
  }
  pop();

  // Histogram bars (staggered growth in Phase 1+)
  if (scene8Phase >= 1) {
    for (var i = 0; i < bins.length; i++) {
      var barStart = 60 + i * 8;
      var targetH = (maxCount > 0) ? bins[i].count / maxCount : 0;

      if (scene8Timer > barStart) {
        scene8BarHeights[i] = lerp(scene8BarHeights[i], targetH, 0.06);
      }

      var bx = chartX + i * (chartW / bins.length) + barGap / 2;
      var bh = scene8BarHeights[i] * chartH;
      var by = chartBottom - bh;

      push();
      noStroke();
      // Bar fill
      fill(ACCENT[0], ACCENT[1], ACCENT[2], baseAlpha * 0.28);
      rect(bx, by, barW, bh);

      // Bar top edge highlight
      if (bh > 2) {
        fill(ACCENT[0], ACCENT[1], ACCENT[2], baseAlpha * 0.7);
        rect(bx, by, barW, 2);
      }
      pop();

      // Count label on tall bars
      if (scene8BarHeights[i] > 0.3 && bins[i].count > 20) {
        push();
        textFont("IBM Plex Mono");
        textSize(constrain(min(width, height) * 0.008, 6, 9));
        textAlign(CENTER, BOTTOM);
        fill(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2], baseAlpha * 0.6);
        text(bins[i].count, bx + barW / 2, by - 4);
        pop();
      }
    }
  }

  // Notable language markers (Phase 2+)
  if (scene8Phase >= 2) {
    var notable = histData.notableLanguages;
    var markerAlpha = min((scene8Timer - 300) * 2.5, 180);

    push();
    for (var i = 0; i < notable.length; i++) {
      var lang = notable[i];
      var minExp = bins[0].center - histData.binWidth / 2;
      var maxExp = bins[bins.length - 1].center + histData.binWidth / 2;
      var lx = map(lang.exponent, minExp, maxExp, chartX, chartX + chartW);

      // Vertical tick
      stroke(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], markerAlpha * 0.5);
      strokeWeight(0.5);
      line(lx, chartBottom + 2, lx, chartBottom + 14);

      // Label (staggered vertically to avoid overlap)
      noStroke();
      textFont("IBM Plex Mono");
      textSize(constrain(min(width, height) * 0.008, 6, 9));
      textAlign(CENTER, TOP);
      fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], markerAlpha * 0.8);
      var labelY = chartBottom + 16 + (i % 2) * 12;
      text(lang.label, lx, labelY);
    }
    pop();
  }

  // User's exponent dot (Phase 3+)
  var hasExponent = (userExponent > 0);
  if (scene8Phase >= 3 && hasExponent) {
    var dotAlpha = min((scene8Timer - 450) * 3, 240);
    var minExp = bins[0].center - histData.binWidth / 2;
    var maxExp = bins[bins.length - 1].center + histData.binWidth / 2;
    var userX = map(userExponent, minExp, maxExp, chartX, chartX + chartW);
    userX = constrain(userX, chartX, chartX + chartW);

    // Drop animation
    var dropProgress = constrain((scene8Timer - 450) / 60, 0, 1);
    var eased = 1 - pow(1 - dropProgress, 3);
    var userDotY = lerp(chartY - 20, chartBottom - 12, eased);

    // Pulsing ring
    push();
    noFill();
    var pulseSize = 16 + sin(frameCount * 0.05) * 4;
    stroke(ACCENT[0], ACCENT[1], ACCENT[2], dotAlpha * 0.3);
    strokeWeight(1.5);
    ellipse(userX, userDotY, pulseSize, pulseSize);

    // Solid dot
    noStroke();
    fill(ACCENT[0], ACCENT[1], ACCENT[2], dotAlpha);
    ellipse(userX, userDotY, 8, 8);
    pop();

    // Callout label
    if (dotAlpha > 100) {
      push();
      textFont("IBM Plex Mono");
      textSize(constrain(min(width, height) * 0.01, 8, 11));
      textAlign(LEFT, CENTER);
      fill(ACCENT[0], ACCENT[1], ACCENT[2], dotAlpha * 0.9);

      var calloutX = userX + 14;
      var calloutY = userDotY;
      if (calloutX + 100 > chartX + chartW) {
        textAlign(RIGHT, CENTER);
        calloutX = userX - 14;
      }

      text("your text: " + nf(userExponent, 1, 2), calloutX, calloutY);

      // Connector line
      stroke(ACCENT[0], ACCENT[1], ACCENT[2], dotAlpha * 0.4);
      strokeWeight(0.5);
      var lineEndX = (calloutX > userX) ? calloutX - 4 : calloutX + 4;
      line(userX + 6, userDotY, lineEndX, calloutY);
      pop();
    }
  }

  // Fallback if user typed too few words
  if (scene8Phase >= 3 && !hasExponent) {
    push();
    textFont("IBM Plex Mono");
    textSize(constrain(min(width, height) * 0.01, 8, 11));
    textAlign(CENTER, CENTER);
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], 120);
    text("(need more text to place your dot)", width / 2, chartY - 10);
    pop();
  }

  // Total count label
  if (scene8Phase >= 1) {
    push();
    textFont("IBM Plex Mono");
    textSize(constrain(min(width, height) * 0.01, 8, 11));
    textAlign(RIGHT, TOP);
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], baseAlpha * 0.6);
    text("n = " + histData.totalLanguages + " languages", chartX + chartW, chartY - 14);
    pop();
  }

  // Narrative text — uses languageDetails[] with formatEditorialText for templates
  var details = STORY_CONTENT.visualCopy.languageDetails;
  var narrText = "";
  if (scene8Phase < 2) {
    narrText = details[0];
  } else if (scene8Phase < 3) {
    narrText = formatEditorialText(details[1]);
  } else if (scene8Phase < 4) {
    narrText = details[2];
  } else {
    narrText = details[3];
  }
  var narrAlpha = min(scene8Timer * 1.2, 150);
  drawNarrativeText(narrText, narrAlpha);

  // Click prompt
  if (scene8Phase >= 4 && scene8Timer > 700) {
    drawClickPrompt(min(scene8Timer - 700, 100));
  }
}


// ============================================================
// SCENE 9: THE BOUNDARY
// Does Zipf's law exist outside human language?
// The 2003 model predicts it shouldn't, because animals lack
// the speaker-hearer optimization game. But the evidence is
// mixed, and that's what makes this scene interesting.
//
// Phase 0 (0-120):   Human Zipf curve appears (reference)
// Phase 1 (120-360): Animal dots drop in one by one, each with
//                    an exponential curve that visibly diverges
// Phase 2 (360-540): Exception species fade in near the Zipf line
//                    with pulsing dots (the debated cases)
// Phase 3 (540-720): Boundary zone highlights + narrative
// Phase 4 (720+):    Click prompt
//
// NO animBridge dependency — pure p5.js lerp animations
// Variables: scene9Timer, scene9Phase, scene9Animals, scene9Exceptions (globals.js)
// Helpers: drawLogLogAxes(), drawZipfReference(), drawZipfCurve(),
//          generateZipfFreqs(), drawGlowDot(), drawNarrativeText(), drawClickPrompt()
// Content: STORY_CONTENT.visualCopy.boundaryProfiles, .boundaryLabel,
//          .boundaryNarration[], .zipfReferenceLabel
// ============================================================

// Scene 9 local animation state (no animBridge needed)
var scene9AnimalAlphas = [];
var scene9ExceptionAlphas = [];
var scene9BoundaryAlpha = 0;

function generateExponentialFreqs(count, decay, initialFrequency) {
  var frequencies = [];
  for (var i = 0; i < count; i++) {
    frequencies.push(initialFrequency * Math.exp(-decay * i));
  }
  return frequencies;
}

function initScene9() {
  scene9Timer = 0;
  scene9Phase = 0;
  scene9Animals = [];
  scene9Exceptions = [];
  scene9AnimalAlphas = [];
  scene9ExceptionAlphas = [];
  scene9BoundaryAlpha = 0;

  // Warm colors for exponential species (they diverge from Zipf)
  var warmColors = [
    [230, 120, 100],   // coral
    [210, 155, 90],    // sand
    [185, 130, 160]    // mauve
  ];

  var animalProfiles = STORY_CONTENT.visualCopy.boundaryProfiles.exponential;
  for (var i = 0; i < animalProfiles.length; i++) {
    scene9Animals.push({
      name: animalProfiles[i],
      color: warmColors[i % warmColors.length],
      // Each animal gets a position along the chart
      chartPosition: 0.2 + i * 0.25,
      // Vertical offset to separate curves visually
      decayRate: 0.18 + i * 0.04
    });
    scene9AnimalAlphas.push(0);
  }

  // Cool colors for Zipf-like exceptions (they hug the line)
  var coolColors = [
    [100, 180, 230],   // sky blue
    [130, 210, 190]    // seafoam
  ];

  var mixedProfiles = STORY_CONTENT.visualCopy.boundaryProfiles.mixed;
  for (var i = 0; i < mixedProfiles.length; i++) {
    scene9Exceptions.push({
      name: mixedProfiles[i],
      color: coolColors[i % coolColors.length],
      chartPosition: 0.35 + i * 0.3
    });
    scene9ExceptionAlphas.push(0);
  }
}

function drawScene9() {
  scene9Timer++;

  // Phase progression
  if (scene9Timer > 120) scene9Phase = max(scene9Phase, 1);
  if (scene9Timer > 360) scene9Phase = max(scene9Phase, 2);
  if (scene9Timer > 540) scene9Phase = max(scene9Phase, 3);
  if (scene9Timer > 720) scene9Phase = max(scene9Phase, 4);

  // Chart dimensions
  var chartX = width * 0.12;
  var chartY = height * 0.08;
  var chartW = width * 0.72;
  var chartH = height * 0.55;

  // Draw chart frame
  drawLogLogAxes(chartX, chartY, chartW, chartH, 120);
  drawZipfReference(chartX, chartY, chartW, chartH, 60);

  // Human Zipf curve (the reference they know)
  var humanAlpha = min(scene9Timer * 2, 120);
  var humanFreqs = generateZipfFreqs(40, 1.0, 5000);
  drawZipfCurve(humanFreqs, chartX, chartY, chartW, chartH, ACCENT, humanAlpha);

  // Human label
  push();
  textFont("Space Grotesk");
  var labelSize = min(width, height) * 0.011;
  labelSize = constrain(labelSize, 8, 11);
  textSize(labelSize);
  textAlign(LEFT, CENTER);
  fill(ACCENT[0], ACCENT[1], ACCENT[2], humanAlpha * 0.7);
  text(STORY_CONTENT.visualCopy.zipfReferenceLabel, chartX + chartW + 8, chartY + 10);
  pop();

  // --- Phase 1: Animal exponential curves drop in one by one ---
  if (scene9Phase >= 1) {
    for (var i = 0; i < scene9Animals.length; i++) {
      // Staggered fade-in: each animal 60 frames apart
      var animalStart = 120 + i * 60;
      var targetAlpha = (scene9Timer > animalStart) ? 200 : 0;
      scene9AnimalAlphas[i] = lerp(scene9AnimalAlphas[i], targetAlpha, 0.04);

      var a = scene9AnimalAlphas[i];
      if (a < 2) continue;

      var animal = scene9Animals[i];

      // Draw exponential curve (visually different from Zipf)
      var aFreqs = generateExponentialFreqs(25, animal.decayRate, 3000);
      push();
      noFill();
      stroke(animal.color[0], animal.color[1], animal.color[2], a * 0.5);
      strokeWeight(1.2);

      var logMaxRank = Math.log(aFreqs.length);
      var logMaxFreq = Math.log(Math.max(aFreqs[0], 2));

      beginShape();
      for (var k = 0; k < aFreqs.length; k++) {
        var logRank = Math.log(k + 1);
        var logFreq = Math.log(Math.max(aFreqs[k], 1));
        var px = chartX + (logRank / logMaxRank) * chartW;
        var py = chartY + chartH - (logFreq / logMaxFreq) * chartH;
        vertex(px, py);
      }
      endShape();
      pop();

      // Species dot (positioned at midpoint of its curve)
      var midIdx = floor(aFreqs.length * animal.chartPosition);
      midIdx = constrain(midIdx, 0, aFreqs.length - 1);
      var dotLogR = Math.log(midIdx + 1) / logMaxRank;
      var dotLogF = Math.log(Math.max(aFreqs[midIdx], 1)) / logMaxFreq;
      var dotX = chartX + dotLogR * chartW;
      var dotY = chartY + chartH - dotLogF * chartH;

      // Drop animation
      var dropProgress = constrain((scene9Timer - animalStart) / 45, 0, 1);
      var eased = 1 - pow(1 - dropProgress, 3);
      var animDotY = lerp(chartY - 15, dotY, eased);

      drawGlowDot(dotX, animDotY, 5, animal.color, a);

      // Label
      if (a > 80) {
        push();
        textFont("IBM Plex Mono");
        var nlSize = min(width, height) * 0.01;
        nlSize = constrain(nlSize, 7, 10);
        textSize(nlSize);
        textAlign(LEFT, CENTER);
        fill(animal.color[0], animal.color[1], animal.color[2], a * 0.8);
        text(animal.name, dotX + 8, animDotY);
        pop();
      }
    }
  }

  // --- Phase 2: Exception species (Zipf-like) fade in ---
  if (scene9Phase >= 2) {
    for (var i = 0; i < scene9Exceptions.length; i++) {
      var excStart = 360 + i * 80;
      var targetAlpha = (scene9Timer > excStart) ? 220 : 0;
      scene9ExceptionAlphas[i] = lerp(scene9ExceptionAlphas[i], targetAlpha, 0.04);

      var ea = scene9ExceptionAlphas[i];
      if (ea < 2) continue;

      var exc = scene9Exceptions[i];

      // These get Zipf-like curves (close to the reference line)
      var eFreqs = generateZipfFreqs(25, 0.9 + i * 0.1, 4000);

      push();
      noFill();
      stroke(exc.color[0], exc.color[1], exc.color[2], ea * 0.6);
      strokeWeight(1.2);

      var eLogMaxRank = Math.log(eFreqs.length);
      var eLogMaxFreq = Math.log(Math.max(eFreqs[0], 2));

      beginShape();
      for (var k = 0; k < eFreqs.length; k++) {
        var logRank = Math.log(k + 1);
        var logFreq = Math.log(Math.max(eFreqs[k], 1));
        var px = chartX + (logRank / eLogMaxRank) * chartW;
        var py = chartY + chartH - (logFreq / eLogMaxFreq) * chartH;
        vertex(px, py);
      }
      endShape();
      pop();

      // Pulsing dot (these are debated, so they pulse)
      var excMidIdx = floor(eFreqs.length * exc.chartPosition);
      excMidIdx = constrain(excMidIdx, 0, eFreqs.length - 1);
      var excDotLogR = Math.log(excMidIdx + 1) / eLogMaxRank;
      var excDotLogF = Math.log(Math.max(eFreqs[excMidIdx], 1)) / eLogMaxFreq;
      var excDotX = chartX + excDotLogR * chartW;
      var excDotY = chartY + chartH - excDotLogF * chartH;

      // Pulse animation
      var pulse = reduceMotion ? 6 : sin(frameCount * 0.04 + i * 2.5) * 2.5 + 6;

      // Outer ring (debated = uncertain = pulsing ring)
      push();
      noFill();
      stroke(exc.color[0], exc.color[1], exc.color[2], ea * 0.25);
      strokeWeight(1);
      ellipse(excDotX, excDotY, pulse * 3, pulse * 3);
      pop();

      drawGlowDot(excDotX, excDotY, pulse, exc.color, ea);

      // Label
      if (ea > 80) {
        push();
        textFont("IBM Plex Mono");
        var nlSize = min(width, height) * 0.01;
        nlSize = constrain(nlSize, 7, 10);
        textSize(nlSize);
        textAlign(LEFT, CENTER);
        fill(exc.color[0], exc.color[1], exc.color[2], ea * 0.8);
        text(exc.name, excDotX + 10, excDotY);
        pop();
      }
    }
  }

  // --- Phase 3: Boundary zone ---
  if (scene9Phase >= 3) {
    scene9BoundaryAlpha = lerp(scene9BoundaryAlpha, 1.0, 0.03);

    if (scene9BoundaryAlpha > 0.01) {
      var bf = scene9BoundaryAlpha;

      // Soft band around the Zipf reference line
      push();
      noStroke();
      fill(ACCENT[0], ACCENT[1], ACCENT[2], 12 * bf);

      beginShape();
      for (var k = 0; k <= 20; k++) {
        var t = k / 20;
        var bx = chartX + t * chartW;
        var by = chartY + t * chartH - 25;
        vertex(bx, by);
      }
      for (var k = 20; k >= 0; k--) {
        var t = k / 20;
        var bx = chartX + t * chartW;
        var by = chartY + t * chartH + 25;
        vertex(bx, by);
      }
      endShape(CLOSE);

      // Boundary label
      textFont("Space Grotesk");
      var bSize = min(width, height) * 0.012;
      bSize = constrain(bSize, 9, 12);
      textSize(bSize);
      textAlign(CENTER, CENTER);
      fill(ACCENT[0], ACCENT[1], ACCENT[2], 50 * bf);
      text(STORY_CONTENT.visualCopy.boundaryLabel, chartX + chartW / 2, chartY + chartH + 18);
      pop();
    }
  }

  // --- Legend (Phase 1+) ---
  if (scene9Phase >= 1) {
    var legendAlpha = min((scene9Timer - 120) * 1.5, 140);
    push();
    textFont("IBM Plex Mono");
    var legSize = min(width, height) * 0.009;
    legSize = constrain(legSize, 7, 10);
    textSize(legSize);
    textAlign(LEFT, CENTER);

    var legX = chartX;
    var legY = chartY + chartH + 35;
    var legGap = legSize + 6;

    // Warm = exponential
    fill(230, 120, 100, legendAlpha);
    text("warm = exponential (not Zipf)", legX, legY);

    // Cool = Zipf-like (if phase 2+)
    if (scene9Phase >= 2) {
      var coolLegAlpha = min((scene9Timer - 360) * 1.5, 140);
      fill(100, 180, 230, coolLegAlpha);
      text("cool = Zipf-like (debated)", legX, legY + legGap);
    }

    // Gold = human
    fill(ACCENT[0], ACCENT[1], ACCENT[2], legendAlpha * 0.7);
    text("gold = human language", legX, legY + legGap * 2);
    pop();
  }

  // --- Narrative text (phase-specific) ---
  var boundaryNarration = STORY_CONTENT.visualCopy.boundaryNarration;
  var narrText = "";
  var narrAlpha = 0;

  if (boundaryNarration && boundaryNarration.length > 0) {
    // Array mode: phase-specific text
    var narrIndex = min(scene9Phase, boundaryNarration.length - 1);
    narrText = boundaryNarration[narrIndex];
    if (scene9Phase === 0) {
      narrAlpha = min(scene9Timer * 1.5, 140);
    } else {
      var phaseStarts = [0, 120, 360, 540, 720];
      var ps = (scene9Phase < phaseStarts.length) ? phaseStarts[scene9Phase] : 720;
      narrAlpha = min((scene9Timer - ps) * 2, 140);
    }
  } else {
    // Fallback: single string
    narrText = STORY_CONTENT.visualCopy.boundary;
    narrAlpha = min(scene9Timer * 1.5, 140);
  }

  drawNarrativeText(narrText, narrAlpha);

  // --- Click prompt ---
  if (scene9Phase >= 4) {
    drawClickPrompt(min(scene9Timer - 720, 100));
  }
}

// ============================================================
// SCENE 10: THE END CARD
// Variables: scene10Timer, scene10Phase, wordCount, wordFreqs,
//            userEfficiency (globals.js)
//            userExponent (scenes-late.js Part 1)
// Helpers: sortFrequencies(), drawNarrativeText() (helpers.js)
// Content: STORY_CONTENT.visualCopy.ending, .references[]
// ============================================================

function initScene10() {
  scene10Timer = 0;
  scene10Phase = 0;
}

function drawScene10() {
  scene10Timer++;

  // Phase progression
  if (scene10Timer > 180) scene10Phase = max(scene10Phase, 1);
  if (scene10Timer > 360) scene10Phase = max(scene10Phase, 2);
  if (scene10Timer > 540) scene10Phase = max(scene10Phase, 3);
  if (scene10Timer > 720) scene10Phase = max(scene10Phase, 4);

  // Background particles (gentle, always present)
  drawEndParticles();

  // --- Phase 0: Title ---
  var titleAlpha = min(scene10Timer * 1.2, 220);

  push();
  textFont("Space Grotesk");
  textAlign(CENTER, CENTER);

  var titleSize = constrain(min(width, height) * 0.045, 18, 42);
  textSize(titleSize);

  // Measure and shrink if needed
  var titleText = STORY_CONTENT.visualCopy.ending.title;
  while (textWidth(titleText) > width * 0.85 && titleSize > 16) {
    titleSize -= 1;
    textSize(titleSize);
  }

  fill(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2], titleAlpha);
  text(titleText, width / 2, height * 0.18);
  pop();

  // Subtle line under title
  if (titleAlpha > 100) {
    push();
    stroke(ACCENT[0], ACCENT[1], ACCENT[2], titleAlpha * 0.15);
    strokeWeight(1);
    var lineW = min(width * 0.25, 200);
    line(width / 2 - lineW / 2, height * 0.24, width / 2 + lineW / 2, height * 0.24);
    pop();
  }

  // --- Phase 1: Your journey (observational, not scored) ---
  if (scene10Phase >= 1) {
    var journeyAlpha = min((scene10Timer - 180) * 1.5, 180);

    push();
    textFont("IBM Plex Mono");
    textAlign(CENTER, CENTER);

    var jSize = constrain(min(width, height) * 0.013, 9, 13);
    textSize(jSize);

    // Word count
    var uniqueCount = Object.keys(wordFreqs).length;
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], journeyAlpha);
    text("you typed " + wordCount + " words. " + uniqueCount + " were unique.", width / 2, height * 0.33);

    // Zipf fidelity as observation
    var jLineGap = jSize + 10;
    if (uniqueCount >= 5 && userExponent > 0) {
      // Observation, not a grade
      fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], journeyAlpha * 0.85);
      text("your text followed a power law with exponent " + nf(userExponent, 1, 2), width / 2, height * 0.33 + jLineGap);

      // Contextual comparison
      var context = "";
      if (userExponent > 0.8 && userExponent < 1.2) {
        context = "close to the ideal Zipf exponent of 1.0";
      } else if (userExponent >= 1.2) {
        context = "steeper than typical; your vocabulary was concentrated";
      } else {
        context = "flatter than typical; your vocabulary was spread wide";
      }
      fill(ACCENT[0], ACCENT[1], ACCENT[2], journeyAlpha * 0.6);
      text(context, width / 2, height * 0.33 + jLineGap * 2);
    } else {
      fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], journeyAlpha * 0.6);
      text("not enough text to measure, but the pattern was forming", width / 2, height * 0.33 + jLineGap);
    }

    pop();
  }

  // --- Phase 2: Research attribution ---
  if (scene10Phase >= 2) {
    var refAlpha = min((scene10Timer - 360) * 1.5, 150);

    push();
    textFont("IBM Plex Mono");
    textAlign(CENTER, CENTER);

    var refSize = constrain(min(width, height) * 0.01, 7, 11);
    textSize(refSize);

    // Small heading
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], refAlpha * 0.5);
    text("built on the work of", width / 2, height * 0.52);

    // Three citations
    var citGap = refSize + 8;
    var citStartY = height * 0.57;

    for (var i = 0; i < STORY_CONTENT.references.length; i++) {
      var ref = STORY_CONTENT.references[i];
      fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], refAlpha * 0.75);
      text("[" + (i + 1) + "] " + ref.citation, width / 2, citStartY + i * citGap);
    }

    pop();
  }

  // --- Phase 3: Takeaway reflection ---
  if (scene10Phase >= 3) {
    var takeawayAlpha = min((scene10Timer - 540) * 1.2, 160);

    push();
    textFont("Space Grotesk");
    textAlign(CENTER, CENTER);

    var taSize = constrain(min(width, height) * 0.016, 11, 16);
    textSize(taSize);

    // Subtitle (above takeaway)
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], takeawayAlpha * 0.6);
    textSize(taSize * 0.8);
    text(STORY_CONTENT.visualCopy.ending.subtitle, width / 2, height * 0.74);

    // Main takeaway
    textSize(taSize);
    fill(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2], takeawayAlpha * 0.85);
    var takeawayText = STORY_CONTENT.visualCopy.ending.takeaway;
    var maxTakeawayW = width * 0.75;
    text(takeawayText, width * 0.125, height * 0.79, maxTakeawayW, taSize * 4);

    pop();
  }

  // --- Phase 4: Credits + gentle pulse ---
  if (scene10Phase >= 4) {
    var endAlpha = reduceMotion ? 50 : sin(frameCount * 0.02) * 20 + 50;

    push();
    textFont("IBM Plex Mono");
    textAlign(CENTER, CENTER);
    var endSize = constrain(min(width, height) * 0.009, 7, 10);
    textSize(endSize);
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], endAlpha);
    text("phase transition 2026", width / 2, height * 0.93);
    pop();
  }
}

function drawEndParticles() {
  push();
  noStroke();

  for (var i = 0; i < 30; i++) {
    var px = (width * 0.05) + (i * width * 0.9 / 30);
    var py = reduceMotion
      ? height * 0.5
      : height * 0.5 + sin(frameCount * 0.006 + i * 0.8) * height * 0.38;

    var breathe = reduceMotion
      ? 0.4
      : sin(frameCount * 0.012 + i * 1.5) * 0.5 + 0.5;

    var pAlpha = breathe * 25 + 8;
    var pSize = breathe * 2 + 0.8;

    fill(ACCENT[0], ACCENT[1], ACCENT[2], pAlpha);
    ellipse(px, py, pSize, pSize);
  }

  pop();
}



