
const blessings = [
  "好好吃饭 🍚",
  "早点睡觉 😴",
  "不要焦虑 🌿",
  "多喝热水 ☕",
  "一切都会变好的 💫",
  "心情要好呀 🌈",
  "身强体壮 😊",
  "活动一下 🍀",
  "注意保暖 🥰",
  "好运正在路上 🛣️",
  "发财暴富 💰",
  "美景在等你 ⛰️"
];

// 存储所有弹窗的数组
const popups = [];
const MAX_POPUPS = 15; // 最多显示15个弹窗

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

  // 添加到数组
  popups.push(popup);

  // 如果超过最大数量，移除最早的弹窗
  if (popups.length > MAX_POPUPS) {
    const oldPopup = popups.shift();
    oldPopup.style.opacity = '0';
    setTimeout(() => oldPopup.remove(), 300);
  }
}

function loopBlessings() {
  let i = 0;

  // 立即显示第一个弹窗
  showPopup(blessings[i]);
  i = (i + 1) % blessings.length;

  // 然后每秒显示一个
  function next() {
    showPopup(blessings[i]);
    i = (i + 1) % blessings.length;
    setTimeout(next, 1000);
  }
  setTimeout(next, 1000);
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

  // 设置音量
  bgm.volume = 0.5;

  // 音乐在页面加载时就开始播放（不等按钮）
  const playPromise = bgm.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      console.log('音乐自动播放成功！');
    }).catch(err => {
      console.error('自动播放失败，等待用户交互:', err);
      // 如果自动播放失败，在用户点击按钮时播放
      startBtn.addEventListener('click', () => {
        bgm.play().then(() => {
          console.log('用户交互后音乐播放成功！');
        }).catch(e => console.error('播放失败:', e));
      }, { once: true });
    });
  }

  // 按钮只控制弹窗的显示
  startBtn.addEventListener('click', () => {
    // 立即隐藏开始屏幕（无延迟）
    startScreen.style.display = 'none';
    mainTitle.style.display = 'block';

    // 立即开始显示祝福（无延迟）
    loopBlessings();
  });
};
