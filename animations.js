
// ============================================================
// animations.js — THE NEGOTIATION
// anime.js bridge layer: DOM overlays + animation state
// Complete latest version
// ============================================================

// ============================================================
// ANIMATION BRIDGE
// p5.js scenes read values from this object.
// anime.js writes to it. The two never talk directly.
// ============================================================
const animBridge = {

  // --- Scene 7: Four Laws ---
  scene7: {
    mergeProgress: 0,
    borderFade: 1,
    equationScale: 0,
    orbitAngle: 0
  },

  // --- Scene 8: 986 Languages ---
  scene8: {
    spawnProgress: 0
  },

  // --- Scene 9: Boundary ---
  scene9: {
    animalPositions: [],
    exceptionPositions: [],
    boundaryFade: 0
  },

  // --- Active anime.js timeline references (for cleanup) ---
  _activeTimelines: [],

  // --- Scene enter hook (called from globals.js initCurrentScene) ---
  enterScene: function(sceneNum) {
    // Kill all running animations from previous scene
    this.cleanup();

    switch (sceneNum) {
      case 7:  this.enterScene7();  break;
      case 8:  this.enterScene8();  break;
      case 9:  this.enterScene9();  break;
      case 10: this.enterScene10(); break;
    }


  },

  // --- Kill all running animations ---
  cleanup: function() {
    for (var i = 0; i < this._activeTimelines.length; i++) {
      if (this._activeTimelines[i] && this._activeTimelines[i].pause) {
        this._activeTimelines[i].pause();
      }
    }
    this._activeTimelines = [];


    // Reset bridge values
    this.scene7.mergeProgress = 0;
    this.scene7.borderFade = 1;
    this.scene7.equationScale = 0;
    this.scene7.orbitAngle = 0;

    this.scene8.spawnProgress = 0;


    this.scene9.animalPositions = [];
    this.scene9.exceptionPositions = [];
    this.scene9.boundaryFade = 0;
  },

  // ============================================================
  // SCENE 7: Four Laws — Bridge Animations
  // ============================================================
  enterScene7: function() {
    if (reduceMotion || typeof anime !== "function") {
      this.scene7.mergeProgress = 1;
      this.scene7.borderFade = 0;
      this.scene7.equationScale = 1;
      this.scene7.orbitAngle = 0;
      return;
    }

    var self = this;

    // Merge progress: 0 → 1 over 3 seconds
    var mergeTL = anime({
      targets: self.scene7,
      mergeProgress: 1,
      duration: 3000,
      easing: "easeInOutCubic",
      delay: 2000
    });
    this._activeTimelines.push(mergeTL);

    // Border fade: 1 → 0 over 1.5s (starts after merge)
    var borderTL = anime({
      targets: self.scene7,
      borderFade: 0,
      duration: 1500,
      easing: "easeOutQuad",
      delay: 4500
    });
    this._activeTimelines.push(borderTL);

    // Equation scale: 0 → 1 with elastic pop
    var eqTL = anime({
      targets: self.scene7,
      equationScale: 1,
      duration: 1200,
      easing: "easeOutElastic(1, 0.5)",
      delay: 5500
    });
    this._activeTimelines.push(eqTL);

    // Orbit angle: continuous rotation
    var orbitTL = anime({
      targets: self.scene7,
      orbitAngle: [0, Math.PI * 2],
      duration: 20000,
      easing: "linear",
      loop: true,
      delay: 6000
    });
    this._activeTimelines.push(orbitTL);
  },

  // ============================================================
  // SCENE 8: 986 Languages — Bridge Animations
  // ============================================================
  enterScene8: function() {
    if (reduceMotion || typeof anime !== "function") {
      this.scene8.spawnProgress = STORY_CONTENT.languageEvidence.sampleSize;
      return;
    }

    var self = this;

    // Spawn progress: 0 → 986 over 8 seconds (accelerating)
    var spawnTL = anime({
      targets: self.scene8,
      spawnProgress: STORY_CONTENT.languageEvidence.sampleSize,
      duration: 8000,
      easing: "easeInQuad",
      delay: 1500
    });
    this._activeTimelines.push(spawnTL);


  },

  // ============================================================
  // SCENE 9: Boundary — Bridge Animations
  // ============================================================
  enterScene9: function() {
    // Scene 9 animations are triggered dynamically
    // (animal spawn, exception spawn, boundary fade)
    // so we just reset state here. Individual animations
    // are triggered from the scene via helper functions below.
  },

  // ============================================================
  // SCENE 10: End Card — Bridge Animations (DOM overlay)
  // ============================================================
  enterScene10: function() {
    // End card text is handled by p5.js canvas (drawScene10)
    // No DOM overlays needed — the scene is self-contained
  },


};

// ============================================================
// DYNAMIC ANIMATION TRIGGERS
// Called from scene files when specific events happen
// ============================================================

// Scene 9: Animate an animal dot approaching then repelling from the curve
function animateAnimalApproach(index, startX, startY, curveX, curveY, finalX, finalY) {
  if (reduceMotion || typeof anime !== "function") {
    animBridge.scene9.animalPositions[index] = { x: finalX, y: finalY, phase: 3 };
    return;
  }

  // Ensure position entry exists
  if (!animBridge.scene9.animalPositions[index]) {
    animBridge.scene9.animalPositions[index] = {
      x: startX, y: startY, phase: 0
    };
  }

  var pos = animBridge.scene9.animalPositions[index];

  // Phase 1: Approach the curve
  var approachTL = anime({
    targets: pos,
    x: curveX,
    y: curveY,
    duration: 2000,
    easing: "easeOutQuad",
    complete: function() {
      pos.phase = 1;

      // Phase 2: Repel to final position (with overshoot)
      var repelTL = anime({
        targets: pos,
        x: finalX,
        y: finalY,
        duration: 1500,
        easing: "easeOutBack",
        complete: function() {
          pos.phase = 3; // settled
        }
      });
      animBridge._activeTimelines.push(repelTL);
    }
  });
  animBridge._activeTimelines.push(approachTL);
}

// Scene 9: Animate an exception dot hovering
function animateExceptionHover(index, startX, startY, hoverX, hoverY) {
  if (reduceMotion || typeof anime !== "function") {
    animBridge.scene9.exceptionPositions[index] = { x: hoverX, y: hoverY };
    return;
  }

  if (!animBridge.scene9.exceptionPositions[index]) {
    animBridge.scene9.exceptionPositions[index] = {
      x: startX, y: startY
    };
  }

  var pos = animBridge.scene9.exceptionPositions[index];

  // Move to hover position
  var hoverTL = anime({
    targets: pos,
    x: hoverX,
    y: hoverY,
    duration: 2000,
    easing: "easeOutQuad",
    complete: function() {
      // Start oscillation loop
      var oscillateTL = anime({
        targets: pos,
        y: [hoverY - 8, hoverY + 8],
        duration: 3000,
        easing: "easeInOutSine",
        direction: "alternate",
        loop: true
      });
      animBridge._activeTimelines.push(oscillateTL);
    }
  });
  animBridge._activeTimelines.push(hoverTL);
}

// Scene 9: Animate boundary zone fade-in
function animateBoundaryFade() {
  if (reduceMotion || typeof anime !== "function") {
    animBridge.scene9.boundaryFade = 1;
    return;
  }

  var fadeTL = anime({
    targets: animBridge.scene9,
    boundaryFade: 1,
    duration: 3000,
    easing: "easeInOutQuad"
  });
  animBridge._activeTimelines.push(fadeTL);
}

