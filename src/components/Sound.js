import * as Tone from "tone";

// Create a synth for musical feedback
const successSynth = new Tone.PolySynth(Tone.Synth).toDestination();
successSynth.volume.value = -10;

// Create different success patterns
const successPatterns = [
  ["C5", "E5"], // Simple major third
  ["G4", "C5"], // Perfect fourth
  ["C5", "E5", "G5"], // Major triad
  ["E5", "G5", "C6"], // Major triad (higher)
  ["C5", "D5", "E5", "G5"], // Extended pattern
  ["C5", "E5", "G5", "A5", "C6"], // Major pentatonic
];

// Create an error synth
const errorSynth = new Tone.Synth({
  oscillator: { type: "triangle" },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0,
    release: 0.1,
  },
}).toDestination();
errorSynth.volume.value = -6;

// Initialize speech synthesis
const speech = window.speechSynthesis;

let maleVoice = null;

// Helper function to configure male voice settings
const configureMaleVoice = (utterance) => {
  utterance.pitch = 0.3; // Much lower pitch
  utterance.rate = 0.9; // Slightly slower
  utterance.volume = 0.8;

  if (maleVoice) {
    utterance.voice = maleVoice;
  }
};

// Initialize voices and wait for them to load
const initVoices = () => {
  const voices = window.speechSynthesis.getVoices();
  // Try to find a deep male voice, prioritizing certain known voices
  maleVoice = voices.find(
    (voice) =>
      voice.name.includes("Microsoft David") ||
      voice.name.includes("Daniel") || // Safari male voice
      voice.name.includes("Google UK English Male") ||
      voice.name.includes("Fred") || // US male voice
      (voice.name.toLowerCase().includes("male") && voice.lang.startsWith("en"))
  );
  console.log(
    "Available voices:",
    voices.map((v) => `${v.name} (${v.lang})`)
  );
  console.log("Selected voice:", maleVoice?.name);
};

// Set up voice loading
if (window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = initVoices;
} else {
  initVoices(); // For browsers that don't support onvoiceschanged
}

const Sound = {
  playSuccess: () => {
    const pattern =
      successPatterns[Math.floor(Math.random() * successPatterns.length)];
    const now = Tone.now();
    pattern.forEach((note, i) => {
      successSynth.triggerAttackRelease(note, "16n", now + i * 0.1);
    });
  },

  playError: () => {
    errorSynth.triggerAttackRelease("A3", "16n");
  },

  playAchievement: () => {
    const now = Tone.now();
    // Play an ascending arpeggio with a brighter sound
    const achievementSynth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.2,
        release: 0.5,
      },
    }).toDestination();
    achievementSynth.volume.value = -8;

    ["C4", "E4", "G4", "C5", "E5"].forEach((note, i) => {
      achievementSynth.triggerAttackRelease(note, "8n", now + i * 0.1);
    });

    // Voice only for achievements
    const utterance = new SpeechSynthesisUtterance("Amazing!");
    configureMaleVoice(utterance);
    speech.speak(utterance);
  },

  playStreak: () => {
    const now = Tone.now();
    // Create a brighter synth for streaks
    const streakSynth = new Tone.Synth({
      oscillator: { type: "square8" },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.2,
        release: 0.3,
      },
    }).toDestination();
    streakSynth.volume.value = -12;

    // Play a more complex ascending pattern
    ["C5", "E5", "G5", "C6"].forEach((note, i) => {
      streakSynth.triggerAttackRelease(note, "16n", now + i * 0.08);
    });

    // Voice for streaks
    const utterance = new SpeechSynthesisUtterance("Excellent!"); // Changed phrase
    configureMaleVoice(utterance);
    speech.speak(utterance);
  },

  playCompletion: () => {
    const now = Tone.now();
    // Create a rich synth for completion
    const completionSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.02,
        decay: 0.3,
        sustain: 0.4,
        release: 1,
      },
    }).toDestination();
    completionSynth.volume.value = -8;

    // Play a triumphant chord progression
    completionSynth.triggerAttackRelease(["C4", "E4", "G4"], "4n", now);
    completionSynth.triggerAttackRelease(["C4", "F4", "A4"], "4n", now + 0.4);
    completionSynth.triggerAttackRelease(
      ["C4", "E4", "G4", "C5"],
      "2n",
      now + 0.8
    );

    // Voice for completion
    const utterance = new SpeechSynthesisUtterance("Well done!");
    configureMaleVoice(utterance);
    speech.speak(utterance);
  },
};

export default Sound;
