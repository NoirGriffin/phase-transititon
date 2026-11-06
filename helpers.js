
// ============================================================
// helpers.js — THE NEGOTIATION
// Shared drawing & utility functions
// Midnight palette — clean, no glow effects
// Complete latest version
// ============================================================

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function dist2D(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

function clampVal(val, lo, hi) {
  return Math.max(lo, Math.min(hi, val));
}

// ============================================================
// TEXT UTILITIES
// ============================================================

function wrapText(str, maxW) {
  var words = str.split(" ");
  var lines = [];
  var currentLine = "";

  for (var i = 0; i < words.length; i++) {
    var testLine = currentLine.length === 0 ? words[i] : currentLine + " " + words[i];
    if (textWidth(testLine) > maxW && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

// ============================================================
// WORD FREQUENCY FUNCTIONS
// ============================================================

function formatEditorialText(value) {
  return String(value || "")
    .replace(/\{languageCount\}/g, String(STORY_CONTENT.languageEvidence.sampleSize))
    .replace(/\{languageShare\}/g, String(STORY_CONTENT.languageEvidence.reportedSharePercent));
}

function sortFrequencies(freqObj) {
  var arr = [];
  var keys = Object.keys(freqObj);
  for (var i = 0; i < keys.length; i++) {
    arr.push({ word: keys[i], freq: freqObj[keys[i]] });
  }
  arr.sort(function(a, b) { return b.freq - a.freq; });
  return arr;
}

function generateZipfFreqs(count, exp, maxFreq) {
  var freqs = [];
  for (var i = 0; i < count; i++) {
    freqs.push(maxFreq / Math.pow(i + 1, exp));
  }
  return freqs;
}

function calculateUserEfficiency(freqObj) {
  var sorted = sortFrequencies(freqObj);
  if (sorted.length < 3) return 0;

  var xValues = [];
  var yValues = [];
  for (var i = 0; i < sorted.length; i++) {
    xValues.push(Math.log(i + 1));
    yValues.push(Math.log(sorted[i].freq));
  }

  var meanX = xValues.reduce(function(sum, value) { return sum + value; }, 0) / xValues.length;
  var meanY = yValues.reduce(function(sum, value) { return sum + value; }, 0) / yValues.length;
  var covariance = 0;
  var varianceX = 0;
  var varianceY = 0;

  for (var i = 0; i < xValues.length; i++) {
    var deltaX = xValues[i] - meanX;
    var deltaY = yValues[i] - meanY;
    covariance += deltaX * deltaY;
    varianceX += deltaX * deltaX;
    varianceY += deltaY * deltaY;
  }

  if (varianceX === 0 || varianceY === 0) return 0;
  var slope = covariance / varianceX;
  var rSquared = (covariance * covariance) / (varianceX * varianceY);
  var exponentFit = clampVal(1 - Math.abs(Math.abs(slope) - 1), 0, 1);
  return clampVal(rSquared * exponentFit, 0, 1);
}

// ============================================================
// DRAWING: DOTS — Clean, no glow
// ============================================================

function drawGlowDot(x, y, size, col, alpha) {
  push();
  noStroke();
  fill(col[0], col[1], col[2], alpha);
  ellipse(x, y, size, size);
  pop();
}

// ============================================================
// DRAWING: CHART ELEMENTS
// ============================================================

function drawLogLogAxes(chartX, chartY, chartW, chartH, alpha) {
  push();
  stroke(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], alpha * 0.5);
  strokeWeight(1);

  line(chartX, chartY + chartH, chartX + chartW, chartY + chartH);
  line(chartX, chartY, chartX, chartY + chartH);

  var ticks = [0, 0.3, 0.5, 0.7, 0.85, 1.0];
  strokeWeight(0.5);
  stroke(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], alpha * 0.3);

  for (var i = 0; i < ticks.length; i++) {
    var t = ticks[i];
    var tx = chartX + t * chartW;
    line(tx, chartY + chartH, tx, chartY + chartH + 4);

    var ty = chartY + chartH - t * chartH;
    line(chartX - 4, ty, chartX, ty);
  }

  noStroke();
  textFont("Space Grotesk");
  var labelSize = min(width, height) * 0.01;
  labelSize = constrain(labelSize, 8, 10);
  textSize(labelSize);

  fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], alpha * 0.6);

  textAlign(CENTER, TOP);
  text(STORY_CONTENT.visualCopy.chartLabels.rank, chartX + chartW / 2, chartY + chartH + 10);

  push();
  textAlign(CENTER, BOTTOM);
  translate(chartX - 18, chartY + chartH / 2);
  rotate(-HALF_PI);
  text(STORY_CONTENT.visualCopy.chartLabels.frequency, 0, 0);
  pop();

  pop();
}

function drawZipfReference(chartX, chartY, chartW, chartH, alpha) {
  push();
  stroke(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], alpha * 0.4);
  strokeWeight(0.8);

  var segments = 20;
  for (var i = 0; i < segments; i += 2) {
    var t1 = i / segments;
    var t2 = (i + 1) / segments;
    var x1 = chartX + t1 * chartW;
    var y1 = chartY + t1 * chartH;
    var x2 = chartX + t2 * chartW;
    var y2 = chartY + t2 * chartH;
    line(x1, y1, x2, y2);
  }

  noStroke();
  textFont("Space Grotesk");
  var labelSize = min(width, height) * 0.009;
  labelSize = constrain(labelSize, 7, 9);
  textSize(labelSize);
  fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], alpha * 0.5);
  textAlign(LEFT, BOTTOM);
  text(STORY_CONTENT.visualCopy.chartLabels.referenceSlope, chartX + chartW * 0.7, chartY + chartH * 0.65);

  pop();
}

function drawZipfCurve(freqs, chartX, chartY, chartW, chartH, col, alpha) {
  if (freqs.length < 2) return;

  var logMaxRank = Math.log(freqs.length);
  var logMaxFreq = Math.log(Math.max(freqs[0], 2));

  push();
  noFill();
  stroke(col[0], col[1], col[2], alpha);
  strokeWeight(1.5);

  beginShape();
  for (var i = 0; i < freqs.length; i++) {
    var logRank = Math.log(i + 1);
    var logFreq = Math.log(Math.max(freqs[i], 1));

    var px = chartX + (logRank / logMaxRank) * chartW;
    var py = chartY + chartH - (logFreq / logMaxFreq) * chartH;

    vertex(px, py);
  }
  endShape();
  pop();
}

// ============================================================
// DRAWING: NARRATIVE TEXT — Single draw, no glow
// ============================================================

function drawNarrativeText(str, alpha) {
  if (!str || alpha <= 0) return;

  push();
  textFont("Space Grotesk");
  var tSize = min(width, height) * 0.016;
  tSize = constrain(tSize, 11, 15);
  textSize(tSize);
  textAlign(CENTER, BOTTOM);

  var yPos = height * 0.94;
  var maxW = width * 0.8;

  fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], alpha);
  text(str, width * 0.1, yPos - tSize * 2, maxW, tSize * 3);

  pop();
}

// ============================================================
// DRAWING: CLICK PROMPT — Clean pulse, no glow
// ============================================================

function drawClickPrompt(alpha) {
  if (alpha <= 0) return;

  push();
  textFont("Space Grotesk");
  var tSize = min(width, height) * 0.012;
  tSize = constrain(tSize, 9, 12);
  textSize(tSize);
  textAlign(CENTER, BOTTOM);

  var pulse = reduceMotion ? 0.8 : sin(frameCount * 0.04) * 0.2 + 0.8;
  var finalAlpha = alpha * pulse;

  fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], finalAlpha);
  text(STORY_CONTENT.visualCopy.chartLabels.clickPrompt, width / 2, height * 0.98);

  pop();
}


// ============================================================
// DRAWING: SCENE 0 HELPERS
// ============================================================

function drawScene0Hint() {
  if (typedText.length > 0 || document.getElementById("word-entry")) return;

  push();
  textFont("Space Grotesk");
  var tSize = min(width, height) * 0.018;
  tSize = constrain(tSize, 12, 16);
  textSize(tSize);
  textAlign(LEFT, TOP);

  var pulse = sin(frameCount * 0.03) * 0.15 + 0.35;
  fill(TEXT_SOFT[0], TEXT_SOFT[1], TEXT_SOFT[2], 255 * pulse);
  text(STORY_CONTENT.visualCopy.chartLabels.typingHint, width * 0.08, height * 0.45);

  pop();
}

function drawCursor() {
  if (document.getElementById("word-entry")) return;
  cursorTimer++;
  if (cursorTimer % 30 === 0) cursorBlink = !cursorBlink;
  if (!cursorBlink) return;

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
  var lastLine = lines.length > 0 ? lines[lines.length - 1] : "";
  var cursorX = baseX + textWidth(lastLine);
  var cursorY = baseY + max(0, lines.length - 1) * lineH;

  fill(ACCENT[0], ACCENT[1], ACCENT[2], 200);
  rect(cursorX + 1, cursorY, 2, tSize);

  pop();
}

function drawWordCount() {
  push();
  textFont("Space Grotesk");
  var tSize = min(width, height) * 0.012;
  tSize = constrain(tSize, 9, 12);
  textSize(tSize);
  textAlign(RIGHT, TOP);

  var progress = wordCount / WORDS_TO_ADVANCE;
  var col;
  if (progress < 0.5) {
    col = TEXT_SOFT;
  } else if (progress < 1) {
    col = ACCENT;
  } else {
    col = CHART_ACCENT;
  }

  fill(col[0], col[1], col[2], 200);
  text(min(wordCount, WORDS_TO_ADVANCE) + " / " + WORDS_TO_ADVANCE, width * 0.92, max(height * 0.13, 108));

  pop();
}

function drawFloatingWords() {
  if (!floatingWords || floatingWords.length === 0) return;

  push();
  textFont("Space Grotesk");
  textAlign(CENTER, CENTER);

  for (var i = 0; i < floatingWords.length; i++) {
    var fw = floatingWords[i];

    if (!reduceMotion) {
      fw.x += fw.vx;
      fw.y += fw.vy;

      if (fw.x < -50) fw.x = width + 50;
      if (fw.x > width + 50) fw.x = -50;
      if (fw.y < -50) fw.y = height + 50;
      if (fw.y > height + 50) fw.y = -50;
    }

    var freq = wordFreqs[fw.word] || 1;
    var fwSize = map(freq, 1, max(maxWordFreq, 2), 10, 28);
    fwSize = constrain(fwSize, 10, 28);

    var fwAlpha = map(freq, 1, max(maxWordFreq, 2), 30, 120);

    textSize(fwSize);
    fill(ACCENT[0], ACCENT[1], ACCENT[2], fwAlpha);
    text(fw.word, fw.x, fw.y);
  }

  pop();
}


// ============================================================
// INPUT: TYPING (Scene 0)
// ============================================================


function addFloatingWord(word) {
  for (var i = 0; i < floatingWords.length; i++) {
    if (floatingWords[i].word === word) return;
  }

  floatingWords.push({
    word: word,
    x: random(width * 0.1, width * 0.9),
    y: random(height * 0.1, height * 0.35),
    vx: random(-0.3, 0.3),
    vy: random(-0.2, 0.2)
  });
}



