const morseCode = {
  " ": "   ", a: "·-", b: "-···", c: "-·-·", d: "-··", e: "·", f: "··-·",
  g: "--·", h: "····", i: "··", j: "·---", k: "-·-", l: "·-··", m: "--",
  n: "-·", o: "---", p: "·--·", q: "--·-", r: "·-·", s: "···", t: "-",
  u: "··-", v: "···-", w: "·--", x: "-··-", y: "-·--", z: "--··",
  0: "-----", 1: "·----", 2: "··---", 3: "···--", 4: "····-", 5: "·····",
  6: "-····", 7: "--···", 8: "---··", 9: "----·"
};

const playButton = document.getElementById("playMorseBtn");

function getKey(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function playMorse(morseString) {
  const context = new (window.AudioContext || window.webkitAudioContext)();

  const dotDuration = 0.12;
  const dashDuration = dotDuration * 3;
  const symbolGap = dotDuration;
  
  // These values are increased to make the gaps longer
  const letterGap = dotDuration * 5; 
  const wordGap = dotDuration * 10; 

  let time = context.currentTime;

  const playTone = (duration) => {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(600, time);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    const attackTime = 0.01;
    const releaseTime = 0.02;

    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(1, time + attackTime);
    oscillator.start(time);
    gainNode.gain.setValueAtTime(1, time + duration - releaseTime);
    gainNode.gain.linearRampToValueAtTime(0, time + duration);
    oscillator.stop(time + duration);
    time += duration;
  };

  const words = morseString.trim().split("   "); 

  for (let i = 0; i < words.length; i++) {
    const word = words[i].trim();
    if (word === "") continue;
    const letters = word.split(" "); 

    for (let j = 0; j < letters.length; j++) {
      const letter = letters[j];
      const symbols = letter.split("");

      for (let k = 0; k < symbols.length; k++) {
        const symbol = symbols[k];
        if (symbol === "·") {
          playTone(dotDuration);
        } else if (symbol === "-") {
          playTone(dashDuration);
        }
        time += symbolGap;
      }
      time += letterGap - symbolGap;
    }
    time += wordGap - letterGap;
  }
}

let inputOfText = document.querySelector("#normaltext");
let inputOfMorse = document.querySelector("#morsetext");

function getText() {
  inputOfText.addEventListener("input", (val) => {
    if (inputOfText.value === "") {
      inputOfMorse.value = "";
      return;
    }

    const char = val.data?.toLowerCase();
    if (morseCode[char]) {
      inputOfMorse.value += morseCode[char] + " ";
    }
  });

  inputOfText.addEventListener("keydown", (val) => {
    if (val.key === "Backspace") {
      let text = inputOfText.value.slice(0, -1).toLowerCase();
      inputOfMorse.value = "";
      text.split("").forEach((char) => {
        if (morseCode[char]) {
          inputOfMorse.value += morseCode[char] + " ";
        }
      });
    }
  });
}

function getMorse() {
  inputOfMorse.addEventListener("input", () => {
    let morse = inputOfMorse.value.trim().replace(/\./g, "·");
    let words = morse.split("   ");
    let translated = "";

    for (let word of words) {
      let letters = word.trim().split("  ");
      for (let letter of letters) {
        const char = getKey(morseCode, letter);
        if (char) {
          translated += char;
        }
      }
      translated += " ";
    }

    inputOfText.value = translated.trim();
  });

  inputOfMorse.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      setTimeout(() => {
        const morse = inputOfMorse.value.trim().replace(/\./g, "·");
        let words = morse.split("   ");
        let translated = "";

        for (let word of words) {
          let letters = word.trim().split("  ");
          for (let letter of letters) {
            const char = getKey(morseCode, letter);
            if (char) {
              translated += char;
            }
          }
          translated += " ";
        }

        inputOfText.value = translated.trim();
      }, 0);
    }
  });
}

playButton.addEventListener("click", () => {
  const morseText = inputOfMorse.value.trim();
  if (morseText.length === 0) {
    alert("Please enter Morse code to play.");
    return;
  }
  playMorse(morseText);
});

getMorse();
getText();