var wordInput = document.getElementById("word-entry");
var entryGuidance = document.getElementById("entry-guidance");
var sceneCount = document.getElementById("scene-count");
var stageKicker = document.getElementById("stage-kicker");
var sceneHeading = document.getElementById("scene-heading");
var sceneSummary = document.getElementById("scene-summary");
var sceneBody = document.getElementById("scene-body");
var sceneCallout = document.getElementById("scene-callout");
var storyPanelContent = document.querySelector(".story-panel-content");
var researchMapPanel = document.getElementById("research-map");
var researchMapSummary = document.getElementById("research-map-summary");
var researchMapIntro = document.getElementById("research-map-intro");
var researchMapSteps = document.getElementById("research-map-steps");
var sourceSection = document.getElementById("source-section");
var sceneCitations = document.getElementById("scene-citations");
var sceneDescription = document.getElementById("scene-description");
var liveRegion = document.getElementById("live-region");
var wordCountStatus = document.getElementById("word-count-status");
var wordCountVisible = document.getElementById("word-count-visible");
var sampleTextButton = document.getElementById("sample-text-button");
var previousButton = document.getElementById("previous-scene");
var nextButton = document.getElementById("next-scene");
var replayButton = document.getElementById("replay-experience");
var sliderPanel = document.getElementById("slider-panel");
var sliderInput = document.getElementById("lambda-input");
var sliderOutput = document.getElementById("lambda-output");
var progressBar = document.getElementById("scene-progress");
var introScreen = document.getElementById("intro-screen");
var experienceApp = document.getElementById("experience-app");
var startButton = document.getElementById("start-experience");
var startStatus = document.getElementById("intro-ready-status");
var audioMenuTrigger = document.getElementById("audio-menu-trigger");
var audioMenuStatus = document.getElementById("audio-menu-status");
var ambientMusic = document.getElementById("ambient-music");
var ambientToggle = document.getElementById("ambient-toggle");
var ambientState = document.getElementById("ambient-state");
var musicVolume = document.getElementById("music-volume");
var musicVolumeOutput = document.getElementById("music-volume-output");
var cueToggle = document.getElementById("cue-toggle");
var cueState = document.getElementById("cue-state");
var audioLiveRegion = document.getElementById("audio-live-region");
var sceneCuesEnabled = true;
var sceneCueContext = null;
var lastAnnouncedScene = -1;
var experienceStarted = false;
var MAX_FLOATING_WORDS = 120;

function updateStoryBranding() {
  document.title = STORY_CONTENT.title + " — Phase Transition 2026";
  document.getElementById("intro-title").textContent = STORY_CONTENT.title;
  document.getElementById("intro-subtitle").textContent = STORY_CONTENT.subtitle;
  document.querySelector(".brand-title").textContent = STORY_CONTENT.title.toUpperCase();
}

function beginExperience() {
  if (experienceStarted || startButton.disabled) return;
  experienceStarted = true;
  startButton.disabled = true;
  introScreen.classList.add("is-leaving");

  window.setTimeout(function() {
    introScreen.hidden = true;
    experienceApp.inert = false;
    wordInput.focus({ preventScroll: true });
  }, 280);
}

window.setTimeout(function() {
  startButton.disabled = false;
  startButton.classList.add("is-ready");
  startStatus.textContent = "The Start button is ready.";
}, 2000);

startButton.addEventListener("click", beginExperience);

function syncAudioControls() {
  var musicIsPlaying = !ambientMusic.paused;
  audioMenuStatus.textContent = musicIsPlaying ? "Music on" : "Music off";
  audioMenuTrigger.setAttribute("aria-label", "Audio settings. Ambient music " + (musicIsPlaying ? "on" : "off") + ", scene cues " + (sceneCuesEnabled ? "on" : "off") + ".");
  ambientToggle.setAttribute("aria-pressed", String(musicIsPlaying));
  ambientState.textContent = musicIsPlaying ? "On" : "Off";
  cueToggle.setAttribute("aria-pressed", String(sceneCuesEnabled));
  cueState.textContent = sceneCuesEnabled ? "On" : "Off";
}

function playSceneCue() {
  if (!sceneCuesEnabled) return;
  var AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;

  try {
    sceneCueContext = sceneCueContext || new AudioContextConstructor();
    if (sceneCueContext.state === "suspended") sceneCueContext.resume();

    var now = sceneCueContext.currentTime;
    var oscillator = sceneCueContext.createOscillator();
    var envelope = sceneCueContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(520, now);
    oscillator.frequency.exponentialRampToValueAtTime(660, now + 0.12);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.02, now + 0.025);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.17);
    oscillator.connect(envelope);
    envelope.connect(sceneCueContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.18);
  } catch (error) {
    return;
  }
}

ambientToggle.addEventListener("click", function() {
  if (!ambientMusic.paused) {
    ambientMusic.pause();
    audioLiveRegion.textContent = "Ambient music paused.";
    return;
  }

  ambientMusic.volume = Number(musicVolume.value);
  var playRequest = ambientMusic.play();
  if (playRequest && typeof playRequest.then === "function") {
    playRequest.then(function() {
      audioLiveRegion.textContent = "Ambient lo-fi music is playing.";
      syncAudioControls();
    }).catch(function() {
      audioLiveRegion.textContent = "Ambient music could not be started. Try again using the music button.";
      syncAudioControls();
    });
  }
});

ambientMusic.addEventListener("play", syncAudioControls);
ambientMusic.addEventListener("pause", syncAudioControls);

musicVolume.addEventListener("input", function(event) {
  var volume = Number(event.currentTarget.value);
  ambientMusic.volume = volume;
  musicVolumeOutput.textContent = Math.round(volume * 100) + "%";
});

cueToggle.addEventListener("click", function() {
  sceneCuesEnabled = !sceneCuesEnabled;
  audioLiveRegion.textContent = sceneCuesEnabled ? "Scene transition cues enabled." : "Scene transition cues muted.";
  syncAudioControls();
});

function updateTypingState(value) {
  typedText = value.slice(0, 6000);
  words = typedText.toLowerCase().match(/[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*/gu) || [];
  wordFreqs = Object.create(null);
  var previousFloatingWords = Object.create(null);
  for (var i = 0; i < floatingWords.length; i++) {
    previousFloatingWords[floatingWords[i].word] = floatingWords[i];
  }
  floatingWords = [];
  maxWordFreq = 0;

  for (var i = 0; i < words.length; i++) {
    var word = words[i].replace(/[’']/g, "'");
    wordFreqs[word] = (wordFreqs[word] || 0) + 1;
  }

  // Render only frequent words in the background; the complete sample still feeds the chart.
  var uniqueWords = Object.keys(wordFreqs)
    .sort(function(a, b) { return wordFreqs[b] - wordFreqs[a]; })
    .slice(0, MAX_FLOATING_WORDS);
  for (var i = 0; i < uniqueWords.length; i++) {
    var word = uniqueWords[i];
    maxWordFreq = Math.max(maxWordFreq, wordFreqs[word]);
    if (previousFloatingWords[word]) floatingWords.push(previousFloatingWords[word]);
    else addFloatingWord(word);
  }

  wordCount = words.length;
  scene0Ready = wordCount >= WORDS_TO_ADVANCE;
  userEfficiency = calculateUserEfficiency(wordFreqs);
  wordCountStatus.textContent = wordCount + " words entered. " + (scene0Ready ? "Minimum met." : WORDS_TO_ADVANCE - wordCount + " more words needed.") + " " + typedText.length + " of 6,000 characters used.";
  wordCountVisible.textContent = wordCount >= WORDS_TO_ADVANCE ? wordCount + " words" : wordCount + " / " + WORDS_TO_ADVANCE + " minimum";
  syncExperienceControls();
}

function renderSceneSources(referenceIds) {
  sceneCitations.replaceChildren();
  var references = STORY_CONTENT.references.filter(function(reference) {
    return referenceIds.indexOf(reference.id) !== -1;
  });

  references.forEach(function(reference) {
    var item = document.createElement("li");
    var link = document.createElement("a");
    link.href = reference.href;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "[" + reference.id + "] " + reference.citation + ". “" + reference.title + ".” " + reference.publication + ".";
    item.appendChild(link);
    sceneCitations.appendChild(item);
  });

  sourceSection.hidden = references.length === 0;
}

function renderResearchMap(sceneIndex) {
  var content = STORY_CONTENT.researchMap;
  var visible = content.showOnScenes.indexOf(sceneIndex) !== -1;
  researchMapPanel.hidden = !visible;
  researchMapSteps.replaceChildren();
  if (!visible) return;

  researchMapSummary.textContent = formatEditorialText(content.title);
  researchMapIntro.textContent = formatEditorialText(content.introduction);
  content.steps.forEach(function(item) {
    var step = document.createElement("li");
    step.className = "research-map-step";
    var period = document.createElement("span");
    var title = document.createElement("h3");
    var paragraph = document.createElement("p");
    var connection = document.createElement("span");
    var reference = document.createElement("span");
    period.className = "research-map-period";
    title.className = "research-map-title";
    connection.className = "research-map-connection";
    reference.className = "research-map-reference";
    period.textContent = formatEditorialText(item.period);
    title.textContent = formatEditorialText(item.title);
    paragraph.textContent = formatEditorialText(item.body);
    connection.textContent = formatEditorialText(item.connection);
    reference.textContent = "Paper [" + item.referenceId + "]";
    step.appendChild(period);
    step.appendChild(title);
    step.appendChild(paragraph);
    step.appendChild(connection);
    step.appendChild(reference);
    researchMapSteps.appendChild(step);
  });
}

function syncExperienceControls() {
  if (!sceneCount) return;

  var current = Math.min(Math.max(currentScene, 0), STORY_CONTENT.scenes.length - 1);
  var sceneNumber = current + 1;
  var stage = STORY_CONTENT.scenes[current];
  var summary = stage.summary;

  if (current === STORY_CONTENT.scenes.length - 1) {
    var fitSummary = Object.keys(wordFreqs).length < 3
      ? "There were not enough distinct words for an exploratory fit."
      : "The exploratory fit is " + Math.round(userEfficiency * 100) + " percent; it is not a score for your writing.";
    summary = "You entered " + wordCount + " words. " + fitSummary;
  }

  sceneCount.textContent = String(sceneNumber).padStart(2, "0") + " / " + String(STORY_CONTENT.scenes.length).padStart(2, "0");
  stageKicker.textContent = formatEditorialText(stage.kicker);
  sceneHeading.textContent = formatEditorialText(stage.title);
  sceneSummary.textContent = formatEditorialText(summary);
  sceneBody.textContent = formatEditorialText(stage.body);
  sceneCallout.textContent = formatEditorialText(stage.note || "");
  sceneCallout.hidden = !stage.note;
  sceneDescription.textContent = [summary, stage.body, stage.note].map(formatEditorialText).filter(Boolean).join(" ");
  renderResearchMap(current);
  renderSceneSources(stage.references);
  progressBar.style.width = (sceneNumber / STORY_CONTENT.scenes.length) * 100 + "%";
  progressBar.parentElement.setAttribute("aria-valuemax", String(STORY_CONTENT.scenes.length));
  progressBar.parentElement.setAttribute("aria-valuenow", String(sceneNumber));

  wordInput.hidden = current !== 0;
  entryGuidance.hidden = current !== 0;
  sliderPanel.hidden = current !== 5 || !lambdaSlider.visible;
  previousButton.disabled = current === 0;
  nextButton.hidden = current === STORY_CONTENT.scenes.length - 1;
  nextButton.disabled = (current === 0 && !scene0Ready) || (current === 5 && !scene5CriticalReached);
  document.querySelector(".skip-link").hidden = current !== 0;
  nextButton.textContent = current === 0 ? "Reveal the pattern" : current === 5 && !scene5CriticalReached ? "Find the balance" : "Continue";
  replayButton.hidden = current !== STORY_CONTENT.scenes.length - 1;
  sampleTextButton.hidden = typedText.trim().length > 0;

  if (sliderInput && current === 5) {
    sliderInput.value = String(lambdaSlider.value);
    sliderOutput.value = Number(lambdaSlider.value).toFixed(2);
    sliderOutput.textContent = Number(lambdaSlider.value).toFixed(2);
    sliderInput.setAttribute("aria-valuetext", "Lambda " + Number(lambdaSlider.value).toFixed(2));
  }

  if (lastAnnouncedScene !== current) {
    storyPanelContent.scrollTop = 0;
    researchMapPanel.open = false;
    liveRegion.textContent = "Stage " + sceneNumber + " of " + STORY_CONTENT.scenes.length + ": " + stage.title + ". " + summary;
    lastAnnouncedScene = current;
  }
}

wordInput.addEventListener("input", function(event) {
  updateTypingState(event.currentTarget.value);
});

sampleTextButton.addEventListener("click", function() {
  wordInput.value = STORY_CONTENT.sampleText;
  updateTypingState(STORY_CONTENT.sampleText);
  wordInput.focus();
  wordInput.setSelectionRange(0, 0);
  wordInput.scrollTop = 0;
});

wordInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing && event.keyCode !== 229) {
    event.preventDefault();
    if (scene0Ready) advanceScene();
  }
});

previousButton.addEventListener("click", function() {
  if (!transitioning) goToScene(currentScene - 1);
});

nextButton.addEventListener("click", function() {
  if (currentScene === 0 && !scene0Ready) {
    wordInput.focus();
    return;
  }
  if (!transitioning) advanceScene();
});

replayButton.addEventListener("click", resetExperience);

sliderInput.addEventListener("input", function(event) {
  lambdaSlider.value = Number(event.currentTarget.value);
  lambdaSlider.handleX = lambdaSlider.x + lambdaSlider.value * lambdaSlider.w;
  if (lambdaSlider.value >= 0.35 && lambdaSlider.value <= 0.47) {
    scene5CriticalReached = true;
    scene5Phase = 2;
  }
  syncExperienceControls();
});

wordInput.addEventListener("pointerdown", function() {
  if (currentScene === 0) wordInput.focus();
});

document.addEventListener("keydown", function(event) {
  if (event.target instanceof HTMLElement && event.target.closest("button, a, input, textarea, select, summary, [contenteditable='true']")) return;
  if (event.key === "ArrowRight" && currentScene > 0 && currentScene < STORY_CONTENT.scenes.length - 1) {
    event.preventDefault();
    if (!nextButton.disabled) advanceScene();
  }
  if (event.key === "ArrowLeft" && currentScene > 0) {
    event.preventDefault();
    goToScene(currentScene - 1);
  }
  if ((event.key === "r" || event.key === "R") && currentScene === STORY_CONTENT.scenes.length - 1) resetExperience();
});

document.addEventListener("DOMContentLoaded", function() {
  updateStoryBranding();
  syncExperienceControls();
});
