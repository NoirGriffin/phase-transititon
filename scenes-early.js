
// ============================================================
// scenes-early.js — THE NEGOTIATION
// Scenes 0–5: Typing → Reveal → Universality → Why → Game → Phase Transition
// Midnight palette — amber controls, aqua data accents
// Complete latest version
// ============================================================

// ============================================================
// SCENE 0: TYPING
// User types freely. Words float and grow by frequency.
// Auto-advances after 30 words.
// ============================================================

function initScene0() {
  scene0Ready = wordCount >= WORDS_TO_ADVANCE;
  cursorTimer = 0;
  cursorBlink = true;
}

function drawScene0() {
  drawTypedText();
  drawFloatingWords();
  drawScene0Hint();
  drawCursor();

  if (scene0Ready) {
    var pulse = sin(frameCount * 0.06) * 30 + 60;
    drawNarrativeText(STORY_CONTENT.visualCopy.ready, pulse);
  }
}

function drawTypedText() {
  if (typedText.length === 0 || document.getElementById("word-entry")) return;

  push();
  textFont("Space Grotesk");
  var tSize = min(width, height) * 0.018;
  tSize = constrain(tSize, 12, 16);
  textSize(tSize);
  textAlign(LEFT, TOP);

  var baseX = width * 0.08;
  var baseY = height * 0.45;
  var maxW = width * 0.84;
  var lineH = tSize * 1.6;

  var lines = wrapText(typedText, maxW);

  for (var i = 0; i < lines.length; i++) {
    var lineAlpha = map(i, 0, max(lines.length - 1, 1), 100, 220);
    if (lines.length === 1) lineAlpha = 220;

    fill(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2], lineAlpha);
    text(lines[i], baseX, baseY + i * lineH);
  }
  pop();
}

// ============================================================
// SCENE 1: THE REVEAL
// User's words transform into a Zipf curve.
// Phase 0: Words float → form ranked list
// Phase 1: Ranked list → log-log curve
// Phase 2: Narrative + click prompt
// ============================================================

function initScene1() {
  scene1Timer = 0;
  scene1Phase = 0;
  revealProgress = 0;

  sortedFreqs = sortFrequencies(wordFreqs);

  curvePoints = [];
  var chartX = width * 0.15;
  var chartY = height * 0.15;
  var chartW = width * 0.7;
  var chartH = height * 0.55;

  var maxFreq = sortedFreqs.length > 0 ? sortedFreqs[0].freq : 1;
  var logMaxRank = log(max(sortedFreqs.length, 2));
  var logMaxFreq = log(max(maxFreq, 2));

  for (var i = 0; i < sortedFreqs.length; i++) {
    var logRank = log(i + 1);
    var logFreq = log(sortedFreqs[i].freq);

    var targetX = chartX + (logRank / logMaxRank) * chartW;
    var targetY = chartY + chartH - (logFreq / logMaxFreq) * chartH;

    curvePoints.push({
      x: random(width * 0.1, width * 0.9),
      y: random(height * 0.1, height * 0.8),
      targetX: targetX,
      targetY: targetY,
      word: sortedFreqs[i].word,
      freq: sortedFreqs[i].freq,
      arrived: false
    });
  }
}

function drawScene1() {
  scene1Timer++;

  switch (scene1Phase) {
    case 0: drawScene1Phase0(); break;
    case 1: drawScene1Phase1(); break;
    case 2: drawScene1Phase2(); break;
  }
}

function drawScene1Phase0() {
  var chartX = width * 0.15;
  var chartY = height * 0.15;
  var chartW = width * 0.7;
  var chartH = height * 0.55;

  var axisAlpha = min(scene1Timer * 2, 150);
  drawLogLogAxes(chartX, chartY, chartW, chartH, axisAlpha);

  if (scene1Timer > 60) {
    var refAlpha = min((scene1Timer - 60) * 1.5, 100);
    drawZipfReference(chartX, chartY, chartW, chartH, refAlpha);
  }

  var allArrived = true;
  for (var i = 0; i < curvePoints.length; i++) {
    var cp = curvePoints[i];

    var speed = 0.03 + i * 0.002;
    cp.x = lerp(cp.x, cp.targetX, speed);
    cp.y = lerp(cp.y, cp.targetY, speed);

    var d = dist2D(cp.x, cp.y, cp.targetX, cp.targetY);
    if (d < 2) {
      cp.arrived = true;
    } else {
      allArrived = false;
    }

    var dotSize = map(cp.freq, 1, sortedFreqs[0].freq, 3, 10);
    drawGlowDot(cp.x, cp.y, dotSize, ACCENT, 180);

    if (i < 5) {
      push();
      textFont("Space Grotesk");
      var labelSize = min(width, height) * 0.012;
      labelSize = constrain(labelSize, 9, 12);
      textSize(labelSize);
      textAlign(LEFT, CENTER);
      fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], 150);
      text(cp.word, cp.x + dotSize + 4, cp.y);
      pop();
    }
  }

  var narAlpha = min(scene1Timer * 1.5, 120);
  drawNarrativeText(STORY_CONTENT.visualCopy.reveal.sorting, narAlpha);

  if (allArrived || scene1Timer > 480) {
    scene1Phase = 1;
    scene1Timer = 0;
  }
}

function drawScene1Phase1() {
  var chartX = width * 0.15;
  var chartY = height * 0.15;
  var chartW = width * 0.7;
  var chartH = height * 0.55;

  drawLogLogAxes(chartX, chartY, chartW, chartH, 150);
  drawZipfReference(chartX, chartY, chartW, chartH, 100);

  revealProgress = min(revealProgress + 0.015, 1);
  var pointsToShow = floor(curvePoints.length * easeOutCubic(revealProgress));

  push();
  noFill();
  stroke(ACCENT[0], ACCENT[1], ACCENT[2], 200);
  strokeWeight(1.5);
  beginShape();
  for (var i = 0; i < pointsToShow; i++) {
    vertex(curvePoints[i].targetX, curvePoints[i].targetY);
  }
  endShape();
  pop();

  for (var i = 0; i < pointsToShow; i++) {
    var cp = curvePoints[i];
    var dotSize = map(cp.freq, 1, sortedFreqs[0].freq, 3, 10);
    drawGlowDot(cp.targetX, cp.targetY, dotSize, ACCENT, 200);

    if (i < 5) {
      push();
      textFont("Space Grotesk");
      var labelSize = min(width, height) * 0.012;
      labelSize = constrain(labelSize, 9, 12);
      textSize(labelSize);
      textAlign(LEFT, CENTER);
      fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], 180);
      text(cp.word, cp.targetX + dotSize + 4, cp.targetY);
      pop();
    }
  }

  drawNarrativeText(STORY_CONTENT.visualCopy.reveal.tail, min(scene1Timer * 2, 140));

  if (revealProgress >= 1) {
    scene1Phase = 2;
    scene1Timer = 0;
  }
}

function drawScene1Phase2() {
  var chartX = width * 0.15;
  var chartY = height * 0.15;
  var chartW = width * 0.7;
  var chartH = height * 0.55;

  drawLogLogAxes(chartX, chartY, chartW, chartH, 150);
  drawZipfReference(chartX, chartY, chartW, chartH, 100);

  push();
  noFill();
  stroke(ACCENT[0], ACCENT[1], ACCENT[2], 200);
  strokeWeight(1.5);
  beginShape();
  for (var i = 0; i < curvePoints.length; i++) {
    vertex(curvePoints[i].targetX, curvePoints[i].targetY);
  }
  endShape();
  pop();

  for (var i = 0; i < curvePoints.length; i++) {
    var cp = curvePoints[i];
    var dotSize = map(cp.freq, 1, sortedFreqs[0].freq, 3, 10);
    drawGlowDot(cp.targetX, cp.targetY, dotSize, ACCENT, 200);
  }

  // "this is Zipf's law" — clean, single draw
  var labelAlpha = min(scene1Timer * 3, 220);
  push();
  textFont("Space Grotesk");
  textAlign(CENTER, CENTER);

  var titleSize = min(width, height) * 0.028;
  titleSize = constrain(titleSize, 16, 26);
  textSize(titleSize);

  fill(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2], labelAlpha);
  text(STORY_CONTENT.visualCopy.reveal.headline, width / 2, height * 0.82);

  pop();

  drawNarrativeText(STORY_CONTENT.scenes[1].summary, min(scene1Timer * 1.5, 140));

  if (scene1Timer > 60) {
    drawClickPrompt(min(scene1Timer - 60, 100));
  }
}

// ============================================================
// SCENE 2: UNIVERSALITY
// Zipf's law isn't just language — it's everywhere.
// ============================================================

function initScene2() {
  scene2Timer = 0;
  scene2Phase = 0;

  universalityExamples = STORY_CONTENT.comparisonExamples.map(function(example, index) {
    return {
      label: example.label,
      color: DATA_SERIES_COLORS[index],
      freqs: generateZipfFreqs(50, example.exponent, example.maxFrequency),
      alpha: 0
    };
  });
}

function drawScene2() {
  scene2Timer++;

  var chartX = width * 0.15;
  var chartY = height * 0.12;
  var chartW = width * 0.7;
  var chartH = height * 0.55;

  if (scene2Timer > 30)  scene2Phase = max(scene2Phase, 1);
  if (scene2Timer > 150) scene2Phase = max(scene2Phase, 2);
  if (scene2Timer > 270) scene2Phase = max(scene2Phase, 3);

  drawLogLogAxes(chartX, chartY, chartW, chartH, 150);

  for (var i = 0; i < universalityExamples.length; i++) {
    var ex = universalityExamples[i];

    if (i < scene2Phase) {
      ex.alpha = min(ex.alpha + 3, 180);
    }

    if (ex.alpha > 0) {
      drawZipfCurve(ex.freqs, chartX, chartY, chartW, chartH, ex.color, ex.alpha);

      push();
      textFont("Space Grotesk");
      var labelSize = min(width, height) * 0.013;
      labelSize = constrain(labelSize, 10, 13);
      textSize(labelSize);
      textAlign(LEFT, CENTER);
      fill(ex.color[0], ex.color[1], ex.color[2], ex.alpha);

      var labelY = chartY + chartH + 30 + i * (labelSize + 8);
      text("\u2022 " + ex.label, chartX, labelY);
      pop();
    }
  }

  if (sortedFreqs.length > 0) {
    var userFreqs = [];
    for (var i = 0; i < sortedFreqs.length; i++) {
      userFreqs.push(sortedFreqs[i].freq);
    }
    var userAlpha = min(scene2Timer * 2, 100);
    drawZipfCurve(userFreqs, chartX, chartY, chartW, chartH, TEXT_SOFT, userAlpha);
  }

  var comparisonCopy = STORY_CONTENT.visualCopy.comparison;
  var comparisonIndex = scene2Phase < 2 ? 0 : scene2Phase < 3 ? 1 : 2;
  drawNarrativeText(comparisonCopy[comparisonIndex], min(scene2Timer * 1.5, 140));

  if (scene2Phase >= 3 && scene2Timer > 350) {
    drawClickPrompt(min(scene2Timer - 350, 100));
  }
}
// ============================================================
// SCENE 3: EVIDENCE TRIAGE
// Four competing explanations, each expandable on hover.
// Phase 0: Prompt appears
// Phase 1: Cards fade in staggered
// Phase 2: Scanning beam + "same shape" subtitle
// Phase 3: Click prompt
// ============================================================

function initScene3() {
  scene3Timer = 0;
  scene3Phase = 0;
  scene3Cards = [];

  var cardData = STORY_CONTENT.visualCopy.question.cards;
  for (var i = 0; i < cardData.length; i++) {
    scene3Cards.push({
      label: cardData[i].label,
      title: cardData[i].title,
      body: cardData[i].body,
      hoverProgress: 0
    });
  }
}

function drawScene3() {
  scene3Timer++;
  if (scene3Timer > 100) scene3Phase = max(scene3Phase, 1);
  if (scene3Timer > 300) scene3Phase = max(scene3Phase, 2);
  if (scene3Timer > 520) scene3Phase = max(scene3Phase, 3);

  // Card accent colors
  var cardColors = [
    ACCENT,
    [255, 170, 100],
    [130, 180, 255],
    [210, 150, 235]
  ];

  // Responsive layout
  var cardW = min(width * 0.19, 190);
  var gap = min(width * 0.025, 28);
  var totalW = scene3Cards.length * cardW + (scene3Cards.length - 1) * gap;
  var startX = (width - totalW) / 2;
  var topY = height * 0.29;
  var normalH = 112;
  var expandedH = 230;

  // Prompt text
  push();
  textFont("Space Grotesk");
  textAlign(LEFT, TOP);
  fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], 150);
  textSize(constrain(min(width, height) * 0.012, 10, 13));
  text(STORY_CONTENT.visualCopy.question.prompt, startX, height * 0.17);
  pop();

  // Hover detection
  var hoveredIndex = -1;
  for (var i = 0; i < scene3Cards.length; i++) {
    var cx = startX + i * (cardW + gap);
    var currentH = normalH + (expandedH - normalH) * scene3Cards[i].hoverProgress;
    if (mouseX >= cx && mouseX <= cx + cardW &&
        mouseY >= topY && mouseY <= topY + currentH) {
      hoveredIndex = i;
    }
  }

  // Update hover progress
  for (var i = 0; i < scene3Cards.length; i++) {
    var target = (i === hoveredIndex) ? 1 : 0;
    scene3Cards[i].hoverProgress = lerp(scene3Cards[i].hoverProgress, target, 0.12);
    if (scene3Cards[i].hoverProgress < 0.01) scene3Cards[i].hoverProgress = 0;
    if (scene3Cards[i].hoverProgress > 0.99) scene3Cards[i].hoverProgress = 1;
  }

  // Scanning beam behind cards
  if (scene3Phase >= 2) {
    var beamBaseY = topY + normalH + 20;
    var beamX = map((scene3Timer - 300) % 180, 0, 180, startX, startX + totalW);
    push();
    stroke(ACCENT[0], ACCENT[1], ACCENT[2], 130);
    strokeWeight(1);
    line(startX, beamBaseY, beamX, beamBaseY);
    // Glow dot at beam tip
    noStroke();
    fill(ACCENT[0], ACCENT[1], ACCENT[2], 190);
    ellipse(beamX, beamBaseY, 6, 6);
    fill(ACCENT[0], ACCENT[1], ACCENT[2], 60);
    ellipse(beamX, beamBaseY, 14, 14);
    // Beam label
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], 150);
    textFont("Space Grotesk");
    textSize(10);
    textAlign(LEFT, TOP);
    text(STORY_CONTENT.visualCopy.question.beamLabel, startX, beamBaseY + 18);
    pop();
  }

  // Draw cards (two passes: non-hovered first, hovered on top)
  for (var pass = 0; pass < 2; pass++) {
    for (var i = 0; i < scene3Cards.length; i++) {
      if (pass === 0 && i === hoveredIndex) continue;
      if (pass === 1 && i !== hoveredIndex) continue;
      if (pass === 1 && hoveredIndex < 0) continue;

      var card = scene3Cards[i];
      var col = cardColors[i];
      var isHovered = (i === hoveredIndex);
      var hp = card.hoverProgress;

      // Staggered fade-in
      var active = scene3Phase >= 1 && scene3Timer > (100 + i * 55);
      var alpha = active ? min((scene3Timer - 100 - i * 55) * 3, 210) : 25;

      // Dim non-hovered cards
      if (hoveredIndex >= 0 && !isHovered) {
        alpha *= 0.5;
      }

      var cx = startX + i * (cardW + gap);
      var currentH = normalH + (expandedH - normalH) * hp;
      var cy = topY + (active && hp < 0.1 ? sin(frameCount * 0.02 + i) * 4 : 0);

      push();
      // Card background
      noStroke();
      fill(col[0], col[1], col[2], alpha * (0.12 + hp * 0.04));
      rect(cx, cy, cardW, currentH, 6);

      // Card border
      noFill();
      stroke(col[0], col[1], col[2], alpha * (0.7 + hp * 0.3));
      strokeWeight(0.5 + (active ? 1 : 0) + hp * 0.5);
      rect(cx, cy, cardW, currentH, 6);

      // Side accent bar
      noStroke();
      fill(col[0], col[1], col[2], alpha);
      rect(cx, cy, 3, currentH, 3);

      // Label text
      textFont("Space Grotesk");
      textAlign(LEFT, TOP);
      textSize(9);
      fill(col[0], col[1], col[2], alpha);
      text(card.label, cx + 14, cy + 16);

      // Title text
      fill(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2], alpha);
      var titleSize = constrain(min(width, height) * 0.018, 14, 20);
      textSize(titleSize);
      text(card.title, cx + 14, cy + 38, cardW - 28, titleSize * 2.5);

      // Body text (fades in with hover)
      if (hp > 0.05 && active) {
        var bodyAlpha = alpha * hp * 0.8;
        fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], bodyAlpha);
        var bodySize = constrain(min(width, height) * 0.011, 8, 11);
        textSize(bodySize);
        text(card.body, cx + 14, cy + 84, cardW - 28, currentH - 94);
      }
      pop();
    }
  }

  // Narrative text at bottom
  push();
  textFont("Space Grotesk");
  textAlign(CENTER, BOTTOM);
  textSize(constrain(min(width, height) * 0.013, 10, 14));
  var narrAlpha = min(scene3Timer * 1.5, 140);
  fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], narrAlpha);
  text(STORY_CONTENT.visualCopy.question.phaseOneNarrative, width / 2, height * 0.92);
  pop();

  // Click prompt
  if (scene3Phase >= 3 && scene3Timer > 600) {
    push();
    textFont("IBM Plex Mono");
    textAlign(CENTER, BOTTOM);
    textSize(constrain(min(width, height) * 0.01, 8, 11));
    var promptAlpha = min(scene3Timer - 600, 100);
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], promptAlpha);
    text(STORY_CONTENT.visualCopy.chartLabels.clickPrompt, width / 2, height * 0.97);
    pop();
  }
}
// ============================================================
// SCENE 4: THE NEGOTIATION
// A signal travels through a noisy channel. Clarity and effort compete.
// ============================================================

function initScene4() {
  scene4Timer = 0;
  scene4Phase = 0;
  scene4Signals = [];
  scene4SpeakerEffort = 0;
  scene4ListenerEffort = 1;

  // Pre-generate signal paths
  for (var i = 0; i < 8; i++) {
    scene4Signals.push({
      progress: random(0, 1),
      speed: random(0.003, 0.008),
      signal: floor(random(3)),
      alpha: 0
    });
  }
}

function drawScene4() {
  scene4Timer++;

  // Phase progression (Phase 1 extended +60 frames for reading time)
  if (scene4Timer > 80) scene4Phase = max(scene4Phase, 1);
  if (scene4Timer > 340) scene4Phase = max(scene4Phase, 2);
  if (scene4Timer > 520) scene4Phase = max(scene4Phase, 3);

  // Layout
  var centerY = height * 0.4;
  var speakerX = width * 0.18;
  var listenerX = width * 0.82;
  var channelW = listenerX - speakerX;
  var nodeR = constrain(min(width, height) * 0.045, 28, 50);
  var baseAlpha = min(scene4Timer * 3, 220);

  // Channel line
  push();
  stroke(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], baseAlpha * 0.3);
  strokeWeight(1);
  line(speakerX + nodeR, centerY, listenerX - nodeR, centerY);
  pop();

  // Speaker node
  push();
  noStroke();
  fill(ACCENT[0], ACCENT[1], ACCENT[2], baseAlpha * 0.15);
  ellipse(speakerX, centerY, nodeR * 2, nodeR * 2);
  stroke(ACCENT[0], ACCENT[1], ACCENT[2], baseAlpha * 0.7);
  strokeWeight(1.5);
  noFill();
  ellipse(speakerX, centerY, nodeR * 2, nodeR * 2);
  noStroke();
  textFont("Space Grotesk");
  textAlign(CENTER, CENTER);
  textSize(constrain(min(width, height) * 0.013, 10, 14));
  fill(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2], baseAlpha);
  text("speaker", speakerX, centerY);
  pop();

  // Listener node
  push();
  var listCol = [130, 180, 255];
  noStroke();
  fill(listCol[0], listCol[1], listCol[2], baseAlpha * 0.15);
  ellipse(listenerX, centerY, nodeR * 2, nodeR * 2);
  stroke(listCol[0], listCol[1], listCol[2], baseAlpha * 0.7);
  strokeWeight(1.5);
  noFill();
  ellipse(listenerX, centerY, nodeR * 2, nodeR * 2);
  noStroke();
  textFont("Space Grotesk");
  textAlign(CENTER, CENTER);
  textSize(constrain(min(width, height) * 0.013, 10, 14));
  fill(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2], baseAlpha);
  text("listener", listenerX, centerY);
  pop();

  // Animate signals traveling along the channel
  if (scene4Phase >= 1) {
    // Chaos factor: 1.0 at start of Phase 1, decays to 0 over ~400 frames
    var chaos = constrain(1 - (scene4Timer - 80) / 400, 0, 1);

    push();
    noStroke();
    for (var i = 0; i < scene4Signals.length; i++) {
      var sig = scene4Signals[i];
      sig.alpha = min(sig.alpha + 3, 180);

      sig.progress += sig.speed;
      if (sig.progress > 1) {
        sig.progress = 0;
        sig.signal = floor(random(3));
        // Speeds are wild early, normalise as chaos decays
        var steadySpeed = random(0.004, 0.006);
        var wildSpeed = random(0.001, 0.015);
        sig.speed = lerp(steadySpeed, wildSpeed, chaos);
      }

      var sx = speakerX + nodeR + sig.progress * (channelW - nodeR * 2);
      // Base vertical position
      var sy = centerY + (i - 3.5) * 6;
      // Add vertical jitter that decreases with chaos
      sy += random(-14, 14) * chaos;
      // Add horizontal stutter early on
      sx += random(-6, 6) * chaos;

      // Color: early on, signals flicker between colors randomly
      // As chaos settles, they stabilise to their assigned color
      var displaySignal = sig.signal;
      if (chaos > 0.3 && random() < chaos * 0.4) {
        displaySignal = floor(random(3));
      }

      var sigColor = (displaySignal === 0) ? ACCENT
        : (displaySignal === 1) ? [130, 180, 255]
        : [210, 150, 235];

      // Alpha also jitters early
      var sigAlpha = sig.alpha * (1 - chaos * 0.4 * random());
      fill(sigColor[0], sigColor[1], sigColor[2], sigAlpha);

      // Size pulses erratically early, settles to steady 5px
      var dotSize = 5 + random(-3, 3) * chaos;
      ellipse(sx, sy, dotSize, dotSize);
    }
    pop();
  }

  // Effort meters
  if (scene4Phase >= 2) {
    var meterAlpha = min((scene4Timer - 340) * 3, 200);
    var meterW = constrain(width * 0.12, 60, 120);
    var meterH = 10;
    var meterY = centerY + nodeR + 40;

    // Gradually shift effort balance
    var progress = constrain((scene4Timer - 340) / 300, 0, 1);
    scene4SpeakerEffort = lerp(0.15, 0.5, progress);
    scene4ListenerEffort = lerp(0.9, 0.5, progress);

    // Speaker effort bar
    push();
    textFont("IBM Plex Mono");
    textSize(9);
    textAlign(CENTER, TOP);
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], meterAlpha * 0.7);
    text("speaker effort", speakerX, meterY - 16);
    noStroke();
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], meterAlpha * 0.2);
    rect(speakerX - meterW / 2, meterY, meterW, meterH, 3);
    fill(ACCENT[0], ACCENT[1], ACCENT[2], meterAlpha * 0.8);
    rect(speakerX - meterW / 2, meterY, meterW * scene4SpeakerEffort, meterH, 3);
    pop();

    // Listener effort bar
    push();
    textFont("IBM Plex Mono");
    textSize(9);
    textAlign(CENTER, TOP);
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], meterAlpha * 0.7);
    text("listener effort", listenerX, meterY - 16);
    noStroke();
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], meterAlpha * 0.2);
    rect(listenerX - meterW / 2, meterY, meterW, meterH, 3);
    fill(130, 180, 255, meterAlpha * 0.8);
    rect(listenerX - meterW / 2, meterY, meterW * scene4ListenerEffort, meterH, 3);
    pop();
  }

  // Balance label when settled
  if (scene4Phase >= 3) {
    var balAlpha = min((scene4Timer - 520) * 2, 160);
    push();
    textFont("Space Grotesk");
    textAlign(CENTER, TOP);
    textSize(constrain(min(width, height) * 0.013, 10, 14));
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], balAlpha);
    text(STORY_CONTENT.visualCopy.communication[3], width / 2, height * 0.78);
    pop();
  }

  // Narrative text (cycles through communication copy)
  if (scene4Phase >= 1) {
    var commIdx = min(scene4Phase - 1, STORY_CONTENT.visualCopy.communication.length - 1);
    push();
    textFont("Space Grotesk");
    textAlign(CENTER, BOTTOM);
    textSize(constrain(min(width, height) * 0.013, 10, 14));
    var narrAlpha = min(scene4Timer * 1.2, 150);
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], narrAlpha);
    text(STORY_CONTENT.visualCopy.communication[commIdx], width / 2, height * 0.92);
    pop();
  }

  // Click prompt
  if (scene4Phase >= 3 && scene4Timer > 620) {
    push();
    textFont("IBM Plex Mono");
    textAlign(CENTER, BOTTOM);
    textSize(constrain(min(width, height) * 0.01, 8, 11));
    var promptAlpha = min(scene4Timer - 620, 100);
    fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], promptAlpha);
    text(STORY_CONTENT.visualCopy.chartLabels.clickPrompt, width / 2, height * 0.97);
    pop();
  }
}

// ============================================================
// SCENE 5: THE PHASE TRANSITION
// Lambda slider: user controls the speaker-listener balance.
// Phase 0: Slider appears + explanation
// Phase 1: User interacts — curve responds live
// Phase 2: Critical zone reached — Zipf emerges
// ============================================================

function initScene5() {
  scene5Timer = 0;
  scene5Phase = 0;
  scene5CriticalReached = false;

  lambdaSlider.x = width * 0.25;
  lambdaSlider.y = height * 0.78;
  lambdaSlider.w = width * 0.5;
  lambdaSlider.handleX = lambdaSlider.x;
  lambdaSlider.value = 0;
  lambdaSlider.visible = false;
  lambdaSlider.dragging = false;
}

function drawScene5() {
  scene5Timer++;

  if (scene5Timer > 60 && !lambdaSlider.visible) {
    lambdaSlider.visible = true;
    scene5Phase = max(scene5Phase, 1);
    if (typeof syncExperienceControls === "function") syncExperienceControls();
  }

  var chartX = width * 0.15;
  var chartY = height * 0.08;
  var chartW = width * 0.7;
  var chartH = height * 0.5;

  drawLogLogAxes(chartX, chartY, chartW, chartH, 150);

  var lam = lambdaSlider.value;
  var exponent;
  var curveColor;

  if (lam < 0.35) {
    exponent = 0.2 + lam * 1.5;
    curveColor = [255, 140, 80];
  } else if (lam > 0.47) {
    exponent = 1.0 + (lam - 0.47) * 3;
    curveColor = [100, 180, 255];
  } else {
    exponent = 1.0 + (lam - 0.41) * 0.5;
    curveColor = [0, 210, 190];
  }

  var dynFreqs = generateZipfFreqs(50, exponent, 5000);
  drawZipfCurve(dynFreqs, chartX, chartY, chartW, chartH, curveColor, 200);

  drawZipfReference(chartX, chartY, chartW, chartH, 60);

  if (lam >= 0.35 && lam <= 0.47 && !scene5CriticalReached) {
    scene5CriticalReached = true;
    scene5Phase = 2;
  }

  drawRegimeLabels(lam, chartX, chartY, chartW, chartH);

  var transitionCopy = STORY_CONTENT.visualCopy.transition;
  drawNarrativeText(transitionCopy[scene5Phase <= 1 ? 0 : 1], min(scene5Timer * 1.5, 140));

  if (scene5CriticalReached && scene5Timer > 300) {
    drawClickPrompt(min(scene5Timer - 300, 100));
  }
}

function drawRegimeLabels(lam, chartX, chartY, chartW, chartH) {
  push();
  textFont("Space Grotesk");
  var labelSize = min(width, height) * 0.012;
  labelSize = constrain(labelSize, 9, 12);
  textSize(labelSize);

  var sAlpha = (lam < 0.35) ? 140 : 50;
  textAlign(LEFT, TOP);
  fill(255, 140, 80, sAlpha);
  text("speaker wins", chartX, chartY + chartH + 25);

  var cAlpha = (lam >= 0.35 && lam <= 0.47) ? 160 : 50;
  textAlign(CENTER, TOP);
  fill(0, 210, 190, cAlpha);
  text("\u03bb* \u2248 0.41", chartX + chartW / 2, chartY + chartH + 25);

  var lAlpha = (lam > 0.47) ? 140 : 50;
  textAlign(RIGHT, TOP);
  fill(100, 180, 255, lAlpha);
  text("listener wins", chartX + chartW, chartY + chartH + 25);

  pop();
}
