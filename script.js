const blessings = [
  "好好吃饭 🍚",
  "早点睡觉 😴",
  "不要焦虑 🌿",
  "多喝热水 ☕",
  "一切都会变好的 💫",
  "心情要好呀 🌈",
  "记得笑一笑 😊",
  "好运永相随 🍀",
  "注意保暖哦 🥰",
  "好运正在路上 🛣️"
];

function showPopup(msg) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.textContent = msg;
  document.body.appendChild(popup);

  // 随机位置，避开顶部标题区域（80px以下）
  const x = Math.random() * (window.innerWidth - 150);
  const y = 80 + Math.random() * (window.innerHeight - 180);
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
}

function loopBlessings() {
  let i = 0;
  function next() {
    showPopup(blessings[i]);
    i = (i + 1) % blessings.length;
    setTimeout(next, 1000); // 更快，每秒一条
  }
  next();
}

function playMusic() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const mainGain = audioCtx.createGain();
  mainGain.gain.value = 0.03; // 音量稍低
  mainGain.connect(audioCtx.destination);

  function createNote(freq, duration) {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gainNode).connect(mainGain);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  // 循环播放旋律
  function loopMelody() {
    const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63];
    let time = 0;
    notes.forEach(freq => {
      createNote(freq, 0.4);
      time += 0.5;
    });
    setTimeout(loopMelody, time * 1000);
  }

  loopMelody();
}

window.onload = () => {
  const startBtn = document.getElementById('startBtn');
  const startScreen = document.getElementById('startScreen');
  const mainTitle = document.getElementById('mainTitle');
  const bgm = document.getElementById('bgm');

  startBtn.addEventListener('click', () => {
    // 隐藏开始屏幕
    startScreen.style.display = 'none';
    mainTitle.style.display = 'block';

    // 播放音乐
    bgm.play().catch(err => {
      console.log('音频播放失败:', err);
    });

    // 开始显示祝福
    loopBlessings();
  });
};
