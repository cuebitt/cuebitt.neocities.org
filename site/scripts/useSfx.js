import { Howl } from "https://cdn.jsdelivr.net/npm/howler@2.2.4/+esm";

class SfxPlayer {
  /**
   * Creates a new SFX player using an object with names as keys and URLs as values
   * @param {any} sfxEntries
   * @param {boolean} [useHTML5=false] whether to use HTML5 audio or not
   * @param {boolean} [single=false] play only one sound at a time
   * @returns {any}
   */
  constructor(sfxEntries, useHTML5 = false, single = false) {
    this.soundRegistry = {};
    this.currentSound = null;
    this.single = single;

    Object.entries(sfxEntries).forEach(([soundName, soundUrl]) => {
      this.soundRegistry[soundName] = new Howl({
        src: [soundUrl],
        volume: 0.5,
        html5: useHTML5,
        onplay: () => {
          if (this.single && this.currentSound) this.currentSound.stop();
          this.currentSound = this.soundRegistry[soundName];
        },
        onstop: () => {
          this.currentSound = null;
        },
      });
    });
  }

  /**
   * Plays a sound in the sound registry, if it exists
   * @param {string} soundName name of the sound to play
   * @returns {void}
   */
  playSound(soundName) {
    if (this.single) this.stop();

    // play up to 2 sounds
    if (soundName.includes(",")) {
      const soundNames = soundName.split(",");

      this.soundRegistry[soundNames[0]].once("end", () => {
        this.soundRegistry[soundNames[1]].play();
      });

      this.soundRegistry[soundNames[0]].play();
    } else {
      this.soundRegistry[soundName].play();
    }
  }

  /**
   * Stop playing any sound if it is playing
   * @returns {void}
   */
  stop() {
    if (this.currentSound) this.currentSound.stop();
  }
}

/**
 * SFX Player hook (factory fn)
 * @returns {SfxPlayer[]}
 */
const useSfx = () => {
  const genSfx = {
    hover_click: "https://files.catbox.moe/0dwdsb.mp3",
    channel_click: "https://files.catbox.moe/oghwju.mp3",
    channel_open: "https://files.catbox.moe/i8e9d4.mp3",
    channel_close: "https://files.catbox.moe/xtru8e.mp3",
    ding: "https://files.catbox.moe/tr0usf.mp3",
  };

  const channelSfx = {
    disk: "https://files.catbox.moe/g6epxj.mp3",
    check_mii_out: "https://files.catbox.moe/6quqqw.mp3",
    shop: "https://files.catbox.moe/n21ygc.mp3",
    internet: "https://files.catbox.moe/u1xg3j.mp3",
    mii: "https://files.catbox.moe/l1j9w2.mp3",
  };

  const genSfxPlayer = new SfxPlayer(genSfx);
  const channelSfxPlayer = new SfxPlayer(channelSfx, false, true);

  const zombieSfx = new Howl({
    src: ["https://files.catbox.moe/yos1c2.mp3"],
    volume: 0.125,
    sprite: {
      z0: [10421, 419],
      z1: [200, 900],
      z2: [1148, 745],
      z3: [1994, 511],
      z4: [2488, 469],
      z5: [2974, 511],
      z6: [3493, 573],
      z7: [4071, 662],
      z8: [4934, 737],
      z9: [5780, 947],
      z10: [6752, 527],
      z11: [7305, 921],
      z12: [8276, 737],
      z13: [8997, 611],
      z14: [9709, 310],
      z15: [10052, 310],
    },
  });

  const zombieSfxPlayer = {
    last: -1,
    playSound: () => {
      let idx = Math.floor(Math.random() * 16);
      if (idx === zombieSfxPlayer.last) {
        idx = (idx + 1) % 16;
      }

      zombieSfx.play(`z${idx}`);
      zombieSfxPlayer.last = idx;
    },
  };

  return [genSfxPlayer, channelSfxPlayer, zombieSfxPlayer];
};

export { useSfx };
