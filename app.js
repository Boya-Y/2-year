const { useEffect, useRef } = React;

const STATE = {
  MENU: 0,
  LOADING: 12,
  SCENE_1_NOTIFICATION: 11,
  SCENE_1_CHAT: 1,
  SCENE_1_PHONE: 2,
  SCENE_2_DINNER: 3,
  SCENE_3_WALK: 4,
  SCENE_4_DATE: 7,
  SCENE_5_HAIR: 8,
  SCENE_6_PHOTO: 9,
  SCENE_7_SKINCARE: 10,
  SCENE_HOME_TV: 6,
  ENDING: 5
};

const COLORS = {
  bg: '#fffaf0',
  primary: '#ff8da1',
  xhs_red: '#ff2442',
  text: '#333333',
  text_gray: '#999999',
  highlight: '#ffb7c5',
  ui_gray: '#f5f5f5',
  line_gray: '#e6e6e6',
  phone_screen: '#ffffff',
  bubble_green: '#95ec69',
  bubble_me: '#ff8da1',
  window_light: '#f1c40f',
  night_sky: '#2c3e50'
};
const TEXT = {
  menu: { title: '恋雪', subtitle: '伯牙的恋爱大冒险', start: '开始故事' },
  lock: { time: '20:30', date: '11月14日 星期二', faceid_unlocked: '面容ID已解锁', appIconText: '书', appName: '小红薯', notification: '橘生✨ 关注了你', now: '现在', swipe: '向上滑动解锁' },
  scene1: { chatDate: '2023.11.14', firstMsg: '99年小学老师  dd一下', inputPlaceholder: ' 说点什么...', inputCursor: ' |', opt1: '你好啊', opt1Reply: '你好你好', opt2: '同学你好，请问你叫什么名字', opt2Reply: '我叫周梦雪，你叫什么？', opt3: '同学你好漂亮，微信号也一定很好记吧', opt3Reply: '油嘴滑舌！', qrTip: '扫一扫加我', backChat: '返回聊天', headerName: '橘生✨' },
  profile: { nickname: '橘生✨', id: '小红薯号：117102336', bio: '', statsFollow: '关注', statsFans: '粉丝', statsLikes: '获赞与收藏', follow: '关注', tabsNotes: '笔记', tabsCollect: '收藏', tabsLike: '赞过', cardAuthor: '橘生✨', likePrefix: '❤ ', cards: [ { title: '‘’ 歲末將至 平安喜樂 ‘’', likes: '520', type: 'selfie' }, { title: '纯白海景房 光污染一下吧', likes: '102', type: 'food' }, { title: '成都宴满分体验💯', likes: '330', type: 'scenery' }, { title: '小猫咪有多能睡', likes: '89', type: 'food' }, { title: '求抱抱', likes: '999', type: 'selfie' } ] },
  profile: { nickname: '橘生✨', id: '小红薯号：117102336', bio: '', statsFollow: '关注', statsFans: '粉丝', statsLikes: '获赞与收藏', follow: '关注', tabsNotes: '笔记', tabsCollect: '收藏', tabsLike: '赞过', cardAuthor: '橘生✨', likePrefix: '❤ ', followCount: '12', fansCount: '326', likesCount: '1.2k', cards: [ { title: '‘’ 歲末將至 平安喜樂 ‘’', likes: '520', type: 'selfie' }, { title: '纯白海景房 光污染一下吧', likes: '102', type: 'food' }, { title: '成都宴满分体验💯', likes: '330', type: 'scenery' }, { title: '小猫咪有多能睡', likes: '89', type: 'food' }, { title: '求抱抱', likes: '999', type: 'selfie' } ] },
  scene2: { cashier: '收银台', paidSecret: '已悄悄买单', emptyPlate: '空盘', msg1: '她：今天吃得好饱呀~味道真不错！', waiterApproach: '（服务员拿着账单慢慢走过来了...）', waiterAsk: '服务员：你好，请问这边买单吗？', buy: '我来买吧', split: '我们要AA吗？', explainPaid: '我：刚才去洗手间的时候已经结过了。' },
  scene3: { msg1: '（走在回家的路上，风突然大了起来...）', msg2: '她：嘶... 好冷啊...', should: '我应该...', coatAction: '我：（默默脱下外套披在她身上）', optAskCold: '问她：你冷吗？', optEncourage: '说：坚持一下就到了' },
  home: { lateMsg: '（不知不觉，天色渐晚，电影也快放完了...）', should: '我应该...', leave: '天色太晚了，我先回家了', sheLeaveReply: '她：好，那你路上小心。', stay: '我能在你家过夜吗？', sheAngry: '她：把我当什么人了？滚😡！', dryLips: '我：入冬了，嘴唇稍微有点干...', sheLipstick: '她：（拿起唇膏）别动，我帮你涂。' },
  date: { year: '2023', month: '11月', day: '26', boyName: '伯牙', girlName: '橘子', line1: '2023年11月26日', line2: '这是一个难以忘怀的日子。', line3: '因为——', line4: '我和我喜欢的女生在一起了', clickContinue: '点击开启婚后生活 >' },
  hair: { msg0: '（她刚洗完头从浴室出来...）', should: '我应该...', optRest: '快去吹头发，别感冒了', optBlow: '来，我给你吹头。', msg1a: '（走过去帮她吹头发...）', msg1b: '（吹风机的声音嗡嗡作响...）', msg1c: '她：我的头发好毛躁哦，不像别的那些女生那么柔顺...', optPraise: '宝宝的头发一点也不毛躁', optBad: '别的女生的头发都比你毛躁', buyAction: '我：（默默拿起手机下单了最新款吹风机）', buyResult: '我：刚才给你买了个更好的吹风机，更护发，过两天就到。', bad3: '她：哦...😐', bad4: '她：烦死了，毛躁不毛躁我不知道吗！', bad5: '她：挺好的，你还给几个妹妹吹过？🤔' },
  photo: { msg0a: '她：镜头往上一点！', msg0b: '她：要记得把我的人框在2/3的位置哦~', msg0c: '她：开实况别忘记了！', msg0d: '她：要拍到后面的景色哦~', msg0e: '她：还有那个...', msg1: '她：还有光线好像不太对...', optStop: '行了行了别说了', optQuit: '再也不想出来了...', msg2a: '她：对不起嘛宝宝，马上带你去吃好吃的～', msg2b: '她：宝宝没事嘿嘿，这张拍完就不拍了...', msg3a: '她：（跑过来看照片）', msg3b: '她：宝宝你拍的也太好了呜呜呜🥹 我好爱你！' },
  skin: { msg0: '（她正在给你擦护肤霜...）', should: '我应该...', optNo: '别给我擦了，我不要', optThanks: '谢谢宝宝～喜欢～', msg1a: '我：每次都是你给我擦，以后都让我给你擦。', msg1b: '（轻轻帮她擦拭脸颊...）', optComfort: '这样擦着舒服吗？', optDry: '宝宝你的皮肤有点干燥', msg2a: '我：嘿嘿，我知道你的绿宝瓶快用完了，买了新的。', msg2b: '（掏出崭新的护肤品递给她）', bad3: '她：我的护肤品都用完了你也不给我买...爱与不爱真的很明显。', bad4: '她：你好恶心，呕🤮', bad5: '她：跟我的技术相比还是有比较大的差距，菜就多练。', bad6: '她：你还知道啊？也不给我护理，爱与不爱真的很明显。' },
  ending: { congrats: '2周年快乐！', letter: ['最爱的宝宝：', '', '两周年快乐！', '感谢有你的存在，', '让我的存在也有了意义。', '我会一直一直爱你，直到永远，周梦雪', '', '爱你的老公，喻博宇。', '2023.11.26'], review: '重温我们的故事', over: '故事结束', normalTitle: '好朋友结局：好人卡', normalDesc: '你是个好人，但更适合跟她做朋友。', badTitle: '直男结局：菜狗', badDesc: '聊得明白吗你就聊。', restart: '重新开始', mistakes: { scene1: '回到 聊天', scene2: '回到 晚餐', scene3: '回到 寒夜', home: '回到 沙发', hair: '回到 吹头发', photo: '回到 拍照', skin: '回到 护肤' } }
};
const ASSETS = {
  avatars: { me: 'assets/me.jpg', her: 'assets/her.jpg' },
  xhsCards: ['assets/1.jpg','assets/2.jpg','assets/3.jpg','assets/4.jpg','assets/5.jpg'],
  bgm: 'assets/BGM.mp3'
};

const LOGIC_W = 450;
const LOGIC_H = 800;

function App() {
  const canvasRef = useRef(null);
  const imagesRef = useRef({ me: null, her: null, cards: [] });
  const audioRef = useRef(null);

  const gameState = useRef({
    current: STATE.LOADING,
    score: 0,
    frameCount: 0,
    mouse: { x: 0, y: 0, clicked: false, down: false, lastY: 0 },
    textTyper: { text: "", index: 0, complete: false },
    profileScrollY: 0,
    transition: { active: false, alpha: 0, mode: 'IDLE', nextState: null, onMidpoint: null },
    billTimer: 0,
    walkTimer: 0,
    showDinnerOptions: false,
    waiterX: LOGIC_W + 100,
    paymentFeedbackTimer: 0,
    coatClickTime: 0,
    scene1Reply: { choiceMade: false, userText: "", replyText: "", showQR: false, timer: 0 },
    homeTv: { timer: 0, showOptions: false, lipstickClickFrame: 0, reaction: { active: false, text: "", color: "#333", timer: 0 } },
    date: { timer: 0, phase: 0, phaseTimer: 0 },
    hair: { timer: 0, phase: 0, dryerBought: false },
    photo: { timer: 0, count: 0, phase: 0, flash: 0 },
    skin: { timer: 0, phase: 0, newBottleShown: false },
    notification: { timer: 0, phase: 0, slideY: 0, unlockTimer: 0 },
    preload: { total: 0, loaded: 0 },
    flags: {
      sawMoments: false,
      paidSecretly: false,
      gaveCoat: false,
      usedLipstick: false,
      scene1Correct: false,
      scene5Correct: false,
      scene6Correct: false,
      scene7Correct: false,
      scene1Finished: false,
      scene1InputClicked: false,
      scene2Finished: false,
      scene3Finished: false,
      failReason: 0
    }
  });

  const layoutRef = useRef({ scale: 1, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    imagesRef.current = { me: new Image(), her: new Image(), cards: ASSETS.xhsCards.map(() => { const img = new Image(); img.decoding = 'async'; return img; }) };
    imagesRef.current.me.decoding = 'async';
    imagesRef.current.her.decoding = 'async';

    const assetsTotal = 2;
    gameState.current.preload.total = assetsTotal;
    gameState.current.preload.loaded = 0;

    const onAssetLoaded = () => { const s = gameState.current; s.preload.loaded = Math.min(s.preload.total, s.preload.loaded + 1); };
    const onAssetFailed = () => { const s = gameState.current; s.preload.loaded = Math.min(s.preload.total, s.preload.loaded + 1); };

    imagesRef.current.me.onload = onAssetLoaded; imagesRef.current.me.onerror = onAssetFailed; imagesRef.current.me.src = ASSETS.avatars.me;
    imagesRef.current.her.onload = onAssetLoaded; imagesRef.current.her.onerror = onAssetFailed; imagesRef.current.her.src = ASSETS.avatars.her;
    imagesRef.current.cards.forEach((img, i) => { img.src = ASSETS.xhsCards[i]; });

    audioRef.current = new Audio();
    audioRef.current.src = ASSETS.bgm;
    audioRef.current.loop = true;
    audioRef.current.preload = 'none';
    const ensurePlay = () => { if (audioRef.current) audioRef.current.play().catch(() => {}); };
    window.addEventListener('mousedown', ensurePlay);
    window.addEventListener('touchstart', ensurePlay, { passive: true });
    window.addEventListener('keydown', ensurePlay);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) ensurePlay(); });

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      const scale = Math.min(innerWidth / LOGIC_W, innerHeight / LOGIC_H);
      const drawW = LOGIC_W * scale;
      const drawH = LOGIC_H * scale;
      const offsetX = (innerWidth - drawW) / 2;
      const offsetY = (innerHeight - drawH) / 2;
      layoutRef.current = { scale, offsetX, offsetY, dpr };
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
    };
    window.addEventListener('resize', resize);
    resize();

    const getLogicPos = (evt) => {
      const { scale, offsetX, offsetY } = layoutRef.current;
      let clientX, clientY;
      if (evt.touches && evt.touches.length > 0) {
        clientX = evt.touches[0].clientX;
        clientY = evt.touches[0].clientY;
      } else if (evt.changedTouches && evt.changedTouches.length > 0) {
        clientX = evt.changedTouches[0].clientX;
        clientY = evt.changedTouches[0].clientY;
      } else {
        clientX = evt.clientX;
        clientY = evt.clientY;
      }
      return { x: (clientX - offsetX) / scale, y: (clientY - offsetY) / scale };
    };

    const handleInputStart = (e) => {
      const pos = getLogicPos(e);
      const s = gameState.current;
      s.mouse.x = pos.x; s.mouse.y = pos.y; s.mouse.lastY = pos.y;
      s.mouse.clicked = true; s.mouse.down = true;
    };

    const handleInputMove = (e) => {
      e.preventDefault();
      const pos = getLogicPos(e);
      const s = gameState.current;
      if (s.current === STATE.SCENE_1_PHONE && s.mouse.down) {
        const deltaY = s.mouse.lastY - pos.y;
        s.profileScrollY += deltaY;
        s.profileScrollY = Math.max(0, Math.min(s.profileScrollY, 400));
      }
      s.mouse.x = pos.x; s.mouse.y = pos.y; s.mouse.lastY = pos.y;
    };

    const handleInputEnd = () => { gameState.current.mouse.down = false; };

    canvas.addEventListener('mousedown', handleInputStart);
    canvas.addEventListener('mousemove', handleInputMove);
    canvas.addEventListener('mouseup', handleInputEnd);
    canvas.addEventListener('touchstart', handleInputStart, { passive: false });
    canvas.addEventListener('touchmove', handleInputMove, { passive: false });
    canvas.addEventListener('touchend', handleInputEnd);

    const resetGame = () => {
      const s = gameState.current;
      s.score = 0; s.frameCount = 0; s.billTimer = 0; s.walkTimer = 0;
      s.paymentFeedbackTimer = 0; s.coatClickTime = 0;
      s.homeTv = { timer: 0, showOptions: false, lipstickClickFrame: 0, reaction: { active: false, text: "", color: "#333", timer: 0 } };
      s.showDinnerOptions = false; s.waiterX = LOGIC_W + 100; s.profileScrollY = 0;
      s.date = { timer: 0, phase: 0, phaseTimer: 0 };
      s.hair = { timer: 0, phase: 0, dryerBought: false };
      s.photo = { timer: 0, count: 0, phase: 0, flash: 0 };
      s.skin = { timer: 0, phase: 0, newBottleShown: false };
      s.scene1Reply = { choiceMade: false, userText: "", replyText: "", showQR: false, timer: 0 };
      s.transition = { active: false, alpha: 0, mode: 'IDLE', nextState: null, onMidpoint: null };
      s.notification = { timer: 0, phase: 0, slideY: 0, unlockTimer: 0 };
      Object.keys(s.flags).forEach(key => s.flags[key] = false);
      s.flags.failReason = 0; s.textTyper = { text: "", index: 0, complete: false };
    };

    const checkPerfectRun = () => {
      const f = gameState.current.flags;
      return f.scene1Correct && f.paidSecretly && f.gaveCoat && f.usedLipstick && f.scene5Correct && f.scene6Correct && f.scene7Correct;
    };

    const transitionTo = (newState, instant = false, onMidpoint = null) => {
      const s = gameState.current;
      s.mouse.clicked = false; s.mouse.down = false; s.textTyper = { text: "", index: 0, complete: false };
      if (instant) { s.current = newState; if(onMidpoint) onMidpoint(); return; }
      if (s.transition.active) return;
      s.transition.active = true; s.transition.mode = 'FADE_OUT'; s.transition.alpha = 0;
      s.transition.nextState = newState;
      s.transition.onMidpoint = onMidpoint;
    };

    const findFirstMistake = () => {
      const f = gameState.current.flags;
      if (!f.scene1Correct) return { state: STATE.SCENE_1_CHAT, label: TEXT.ending.mistakes.scene1 };
      if (!f.paidSecretly) return { state: STATE.SCENE_2_DINNER, label: TEXT.ending.mistakes.scene2 };
      if (!f.gaveCoat) return { state: STATE.SCENE_3_WALK, label: TEXT.ending.mistakes.scene3 };
      if (!f.usedLipstick) return { state: STATE.SCENE_HOME_TV, label: TEXT.ending.mistakes.home };
      if (!f.scene5Correct) return { state: STATE.SCENE_5_HAIR, label: TEXT.ending.mistakes.hair };
      if (!f.scene6Correct) return { state: STATE.SCENE_6_PHOTO, label: TEXT.ending.mistakes.photo };
      if (!f.scene7Correct) return { state: STATE.SCENE_7_SKINCARE, label: TEXT.ending.mistakes.skin };
      return null;
    };

    const retryFromMistake = (targetState) => {
      transitionTo(targetState, false, () => {
        const s = gameState.current;
        const f = s.flags;
        switch (targetState) {
            case STATE.SCENE_1_CHAT:
            s.scene1Reply = { choiceMade: false, userText: "", replyText: "", showQR: false, timer: 0 }; f.scene1Finished = false; f.scene1InputClicked = false; f.scene1Correct = false; s.profileScrollY = 0; s.notification = { timer: 0, phase: 0, slideY: 0, unlockTimer: 0 }; break;
            case STATE.SCENE_2_DINNER: s.billTimer = 0; s.showDinnerOptions = false; s.waiterX = LOGIC_W + 100; f.scene2Finished = false; f.paidSecretly = false; s.paymentFeedbackTimer = 0; break;
            case STATE.SCENE_3_WALK: s.walkTimer = 0; f.scene3Finished = false; f.gaveCoat = false; s.coatClickTime = 0; break;
            case STATE.SCENE_HOME_TV: s.homeTv = { timer: 0, showOptions: false, lipstickClickFrame: 0, reaction: { active: false, text: "", color: "#333", timer: 0 } }; f.usedLipstick = false; break;
            case STATE.SCENE_5_HAIR: s.hair = { timer: 0, phase: 0, dryerBought: false }; f.scene5Correct = false; break;
            case STATE.SCENE_6_PHOTO: s.photo = { timer: 0, count: 0, phase: 0, flash: 0 }; f.scene6Correct = false; f.failReason = 0; break;
            case STATE.SCENE_7_SKINCARE: s.skin = { timer: 0, phase: 0, newBottleShown: false }; f.scene7Correct = false; break;
            default: break;
        }
      });
    };

    const drawRect = (x, y, w, h, color, radius = 0) => {
      ctx.fillStyle = color; ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, radius); else ctx.rect(x, y, w, h);
      ctx.fill();
    };

    const drawCircle = (x, y, r, color) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    };

    const drawText = (text, x, y, size, color = COLORS.text, align = 'center', fontName = '"ZCOOL KuaiLe", sans-serif') => {
      ctx.fillStyle = color; ctx.font = `${size}px ${fontName}`; ctx.textAlign = align;
      ctx.textBaseline = 'middle'; ctx.fillText(text, x, y); ctx.textBaseline = 'alphabetic';
    };

    const drawParagraph = (text, x, y, maxWidth, lineHeight, fontSize, color = COLORS.text, align = 'left') => {
        ctx.fillStyle = color; ctx.font = `${fontSize}px "ZCOOL KuaiLe", sans-serif`; ctx.textAlign = align;
        let words = text.split(''); let line = ''; let currentY = y;
        for(let n = 0; n < words.length; n++) {
          let testLine = line + words[n]; let metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) { ctx.fillText(line, x, currentY); line = words[n]; currentY += lineHeight; }
          else { line = testLine; }
        }
        ctx.fillText(line, x, currentY);
    };

    const isHover = (x, y, w, h) => {
      const mx = gameState.current.mouse.x; const my = gameState.current.mouse.y;
      return mx > x && mx < x + w && my > y && my < y + h;
    };

    const drawButton = (text, x, y, w, h, callback, btnColor = COLORS.primary) => {
      if (gameState.current.transition.active) return;
      const hover = isHover(x, y, w, h);
      ctx.shadowBlur = hover ? 10 : 0; ctx.shadowColor = btnColor;
      ctx.fillStyle = hover ? btnColor : '#fff'; ctx.strokeStyle = btnColor; ctx.lineWidth = 3;
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, 20); else ctx.rect(x, y, w, h);
      ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      let fontSize = 18; if (text.length > 10) fontSize = 16; if (text.length > 14) fontSize = 14; if (text.length > 18) fontSize = 12;
      ctx.font = `${fontSize}px "ZCOOL KuaiLe", sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = hover ? '#fff' : btnColor;
      ctx.fillText(text, x + w/2, y + h/2 + fontSize/3);
      if (hover && gameState.current.mouse.clicked) { gameState.current.mouse.clicked = false; callback(); }
    };

    const typeText = (str, speed = 5) => {
      const s = gameState.current; const typer = s.textTyper;
      if (typer.text !== str) { typer.text = str; typer.index = 0; typer.complete = false; }
      if (!typer.complete) {
        if (s.frameCount % speed === 0) { typer.index++; }
        if (typer.index >= str.length) { typer.complete = true; }
      }
      return str.substring(0, typer.index);
    };

    const drawSnowflake = (x, y, size, color) => {
      ctx.save(); ctx.translate(x, y); ctx.strokeStyle = color; ctx.lineWidth = size / 10; ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -size / 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -size / 4); ctx.lineTo(-size / 8, -size / 2.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -size / 4); ctx.lineTo(size / 8, -size / 2.5); ctx.stroke();
        ctx.rotate(Math.PI / 3);
      }
      ctx.restore();
    };

    const drawBean = (x, y, isGirl = false, emotion = 'normal', scale = 1) => {
      ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
      if (isGirl) {
        ctx.fillStyle = '#333'; ctx.beginPath();
        ctx.moveTo(-28, -15); ctx.quadraticCurveTo(-50, 5, -45, 65); ctx.quadraticCurveTo(-40, 85, -20, 75); ctx.quadraticCurveTo(-30, 45, -22, 5);
        ctx.moveTo(28, -15); ctx.quadraticCurveTo(50, 5, 45, 65); ctx.quadraticCurveTo(40, 85, 20, 75); ctx.quadraticCurveTo(30, 45, 22, 5);
        ctx.moveTo(-28, -15); ctx.quadraticCurveTo(0, -50, 28, -15); ctx.fill();
      }
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#333'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 35, 45, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#333';
      if (emotion === 'happy') { ctx.beginPath(); ctx.moveTo(-12, -5); ctx.lineTo(-5, -12); ctx.lineTo(2, -5); ctx.moveTo(12, -5); ctx.lineTo(19, -12); ctx.lineTo(26, -5); ctx.stroke(); }
      else { drawCircle(-12, -8, 3, '#333'); drawCircle(12, -8, 3, '#333'); }
      if (isGirl || emotion === 'shy') { ctx.fillStyle = '#ffb7c5'; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.arc(-18, 5, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(18, 5, 5, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1.0; }
      if (isGirl) { ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(0, -10, 34, Math.PI * 1.1, Math.PI * 1.9); ctx.fill(); }
      ctx.restore();
    };

    const drawIcon = (type, x, y, size, color) => {
      ctx.save(); ctx.translate(x, y); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (type === 'back') { ctx.beginPath(); ctx.moveTo(size/2, -size/2); ctx.lineTo(-size/2, 0); ctx.lineTo(size/2, size/2); ctx.stroke(); }
      else if (type === 'more') { ctx.beginPath(); ctx.arc(-size/3, 0, 2, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(size/3, 0, 2, 0, Math.PI*2); ctx.fill(); }
      ctx.restore();
    };

    const drawChatBubble = (x, y, text, isMe) => {
      ctx.font = `16px "ZCOOL KuaiLe", sans-serif`; const maxWidth = 240; const lineHeight = 24; const padding = 12;
      let lines = []; let line = '';
      for (let i = 0; i < text.length; i++) {
        let testLine = line + text[i]; let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) { lines.push(line); line = text[i]; } else { line = testLine; }
      }
      lines.push(line);
      const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + padding * 2;
      const h = lines.length * lineHeight + padding + 5;
      const bx = isMe ? x - w : x; const bgColor = isMe ? COLORS.bubble_me : '#fff'; const textColor = isMe ? '#fff' : '#333';
      drawRect(bx, y, w, h, bgColor, 10);
      ctx.beginPath();
      if (isMe) { ctx.moveTo(bx + w, y + 10); ctx.lineTo(bx + w + 5, y + 10); ctx.lineTo(bx + w, y + 15); } else { ctx.moveTo(bx, y + 10); ctx.lineTo(bx - 5, y + 10); ctx.lineTo(bx, y + 15); }
      ctx.fillStyle = bgColor; ctx.fill();
      if (!isMe) { ctx.strokeStyle = '#eee'; ctx.strokeRect(bx, y, w, h); }
      ctx.fillStyle = textColor; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      lines.forEach((l, i) => { ctx.fillText(l, bx + padding, y + padding + i * lineHeight + 6); });
      ctx.textBaseline = 'alphabetic';
      return h;
    };

    const updateMenu = () => {
      const s = gameState.current;
      ctx.fillStyle = COLORS.bg; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
      drawText(TEXT.menu.title, LOGIC_W / 2, 250, 80, COLORS.primary);
      drawText(TEXT.menu.subtitle, LOGIC_W / 2, 320, 24, "#aaa");
      const scale = 1 + Math.sin(s.frameCount * 0.05) * 0.05;
      ctx.save(); ctx.translate(LOGIC_W / 2, 150); ctx.scale(scale, scale); drawSnowflake(0, 0, 80, COLORS.primary); ctx.restore();
      drawButton(TEXT.menu.start, (LOGIC_W - 200) / 2, 550, 200, 60, () => { resetGame(); transitionTo(STATE.SCENE_1_NOTIFICATION); });
    };

    const drawLockScreen = (yOffset) => {
        const s = gameState.current;
        const grad = ctx.createLinearGradient(0, yOffset, 0, LOGIC_H + yOffset);
        grad.addColorStop(0, '#2c3e50'); grad.addColorStop(1, '#4ca1af');
        ctx.fillStyle = grad; ctx.fillRect(0, yOffset, LOGIC_W, LOGIC_H);
        drawText(TEXT.lock.time, LOGIC_W / 2, 150 + yOffset, 60, '#fff', 'center', 'Arial');
        drawText(TEXT.lock.date, LOGIC_W / 2, 200 + yOffset, 20, '#fff', 'center', 'Arial');
        const lockY = 50 + yOffset;
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
        if (s.notification.phase === 1) {
             ctx.save(); ctx.translate(LOGIC_W/2, lockY); ctx.rotate(s.frameCount * 0.2); ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.stroke(); ctx.restore();
        } else if (s.notification.phase >= 2) {
            ctx.save(); ctx.translate(LOGIC_W/2, lockY); ctx.fillStyle = '#fff'; drawRect(-8, -6, 16, 12, '#fff', 2); ctx.beginPath(); ctx.arc(0, -6, 5, Math.PI, 0); ctx.stroke(); ctx.restore();
            drawText(TEXT.lock.faceid_unlocked, LOGIC_W/2, lockY + 30, 12, '#fff');
        } else {
            ctx.save(); ctx.translate(LOGIC_W/2, lockY); drawRect(-8, -6, 16, 12, '#fff', 2); ctx.beginPath(); ctx.arc(0, -6, 5, Math.PI, 0); ctx.stroke(); ctx.restore();
        }
        const cardW = 380, cardH = 80, cardX = (LOGIC_W - cardW) / 2, cardY = 300 + yOffset;
        ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(0,0,0,0.3)'; drawRect(cardX, cardY, cardW, cardH, 'rgba(255,255,255,0.9)', 15); ctx.shadowBlur = 0;
        drawRect(cardX + 15, cardY + 15, 50, 50, COLORS.xhs_red, 10); drawText(TEXT.lock.appIconText, cardX + 40, cardY + 48, 24, '#fff');
        drawText(TEXT.lock.appName, cardX + 80, cardY + 30, 14, '#666', 'left'); drawText(TEXT.lock.notification, cardX + 80, cardY + 55, 16, '#333', 'left'); drawText(TEXT.lock.now, cardX + cardW - 40, cardY + 30, 12, '#999');
        drawText(TEXT.lock.swipe, LOGIC_W/2, LOGIC_H - 50 + yOffset, 14, '#fff'); drawRect(LOGIC_W/2 - 70, LOGIC_H - 30 + yOffset, 140, 5, '#fff', 2);
    };

    const updateScene1Notification = () => {
        const s = gameState.current;
        if (s.notification.phase === 0) { if (s.mouse.clicked) { s.mouse.clicked = false; s.notification.phase = 1; s.notification.unlockTimer = 0; } }
        else if (s.notification.phase === 1) { s.notification.unlockTimer++; if (s.notification.unlockTimer > 40) { s.notification.phase = 2; s.notification.unlockTimer = 0; } }
        else if (s.notification.phase === 2) { s.notification.unlockTimer++; if (s.notification.unlockTimer > 40) { s.notification.phase = 3; } }
        else if (s.notification.phase === 3) { s.notification.slideY -= 25; if (s.notification.slideY <= -LOGIC_H) { transitionTo(STATE.SCENE_1_CHAT, true); return; } }
        if (s.notification.phase === 3) { updateScene1(false); drawLockScreen(s.notification.slideY); } else { drawLockScreen(0); }
    };

    const updateScene1 = (interactive = true) => {
        const s = gameState.current; const f = s.flags; const px = 250, py = 50, pw = 300, ph = 500;
        ctx.fillStyle = '#f0f2f5'; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
        drawRect(0, 0, LOGIC_W, 80, '#fff'); drawIcon('back', 30, 50, 12, '#333'); drawText(TEXT.scene1.headerName, LOGIC_W / 2, 56, 18, '#333'); drawIcon('more', LOGIC_W - 30, 50, 12, '#333'); ctx.strokeStyle = COLORS.line_gray; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 80); ctx.lineTo(LOGIC_W, 80); ctx.stroke();
        const avatarX = 20, avatarY = 100, avatarR = 20;
        ctx.save(); ctx.beginPath(); ctx.arc(avatarX + avatarR, avatarY + avatarR, avatarR, 0, Math.PI * 2); ctx.clip(); const herImg = imagesRef.current.her; if (herImg && herImg.complete) { ctx.drawImage(herImg, avatarX, avatarY, avatarR*2, avatarR*2); } else { ctx.fillStyle = '#ffe4e1'; ctx.fillRect(avatarX, avatarY, avatarR*2, avatarR*2); ctx.fillStyle = COLORS.xhs_red; ctx.beginPath(); ctx.arc(avatarX + avatarR, avatarY + avatarR + 5, 12, 0, Math.PI*2); ctx.fill(); } ctx.restore();
        if (!f.sawMoments) drawCircle(avatarX + 2 * avatarR - 2, avatarY + 5, 4, 'red');
        if (interactive && !s.scene1Reply.choiceMade && isHover(avatarX, avatarY, 40, 40)) { canvas.style.cursor = 'pointer'; if (s.mouse.clicked) { s.mouse.clicked = false; transitionTo(STATE.SCENE_1_PHONE, true); } }
        let currentY = 105; const h1 = drawChatBubble(70, currentY + 5, TEXT.scene1.firstMsg, false);
        drawText(TEXT.scene1.chatDate, LOGIC_W / 2, 90, 10, '#ccc');
        if (s.scene1Reply.choiceMade) {
            if (interactive) s.scene1Reply.timer++;
            currentY += h1 + 20; { const meImg = imagesRef.current.me; if (meImg && meImg.complete) { ctx.save(); ctx.beginPath(); ctx.arc(LOGIC_W - 40, currentY + 20, 20, 0, Math.PI*2); ctx.clip(); ctx.drawImage(meImg, LOGIC_W - 60, currentY, 40, 40); ctx.restore(); } else { drawCircle(LOGIC_W - 40, currentY + 20, 20, COLORS.primary); } } const h2 = drawChatBubble(LOGIC_W - 70, currentY + 5, s.scene1Reply.userText, true);
            if (s.scene1Reply.timer > 80) {
            currentY += h2 + 20; ctx.save(); ctx.beginPath(); ctx.arc(avatarX + avatarR, currentY + 20, avatarR, 0, Math.PI * 2); ctx.clip(); const her2 = imagesRef.current.her; if (her2 && her2.complete) { ctx.drawImage(her2, avatarX, currentY, avatarR*2, avatarR*2); } else { ctx.fillStyle = '#ffe4e1'; ctx.fillRect(avatarX, currentY, avatarR*2, avatarR*2); ctx.fillStyle = COLORS.xhs_red; ctx.beginPath(); ctx.arc(avatarX + avatarR, currentY + 25, 12, 0, Math.PI*2); ctx.fill(); } ctx.restore();
            const h3 = drawChatBubble(70, currentY + 5, s.scene1Reply.replyText, false);
            if (s.scene1Reply.showQR && s.scene1Reply.timer > 200) {
                const qrY = currentY + h3 + 20; drawRect(70, qrY, 120, 120, '#fff', 5); ctx.strokeStyle = '#eee'; ctx.strokeRect(70, qrY, 120, 120); ctx.fillStyle = '#000';
                for(let i=0; i<5; i++) for(let j=0; j<5; j++) if((i+j)%2==0) drawRect(85 + i*18, qrY+15 + j*18, 12, 12, '#000');
                drawText(TEXT.scene1.qrTip, 130, qrY + 140, 12, '#999');
            }
            }
            const waitTime = s.scene1Reply.showQR ? 480 : 180;
            if (interactive && s.scene1Reply.timer > waitTime) {
              if (f.scene1Correct) { f.scene1Finished = true; transitionTo(STATE.SCENE_2_DINNER); }
              else { transitionTo(STATE.ENDING); }
            }
            return;
        }
        const inputY = LOGIC_H - 70; drawRect(0, LOGIC_H - 80, LOGIC_W, 80, '#fff'); ctx.strokeStyle = COLORS.line_gray; ctx.beginPath(); ctx.moveTo(0, LOGIC_H - 80); ctx.lineTo(LOGIC_W, LOGIC_H - 80); ctx.stroke();
        const inputW = LOGIC_W - 100; let inputStroke = !f.scene1InputClicked && isHover(20, inputY, inputW, 40) ? COLORS.xhs_red : 'transparent'; if (f.scene1InputClicked) inputStroke = COLORS.xhs_red;
        if (interactive && !f.scene1InputClicked && isHover(20, inputY, inputW, 40) && s.mouse.clicked) { s.mouse.clicked = false; f.scene1InputClicked = true; }
        drawRect(20, inputY, inputW, 40, COLORS.ui_gray, 20); if (inputStroke !== 'transparent') { ctx.save(); ctx.strokeStyle = inputStroke; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(20, inputY, inputW, 40, 20); ctx.stroke(); ctx.restore(); }
        drawText(f.scene1InputClicked ? TEXT.scene1.inputCursor : TEXT.scene1.inputPlaceholder, 60, inputY + 25, 14, f.scene1InputClicked ? '#333' : '#999', 'left'); drawCircle(LOGIC_W - 40, inputY + 20, 15, COLORS.ui_gray); drawText("+", LOGIC_W - 40, inputY + 26, 20, '#666');
        if (interactive && s.frameCount > 60 && f.scene1InputClicked) {
            const btnW = 280, btnX = (LOGIC_W - btnW) / 2; const optY = LOGIC_H - 250;
            drawButton(TEXT.scene1.opt1, btnX, optY, btnW, 45, () => { s.scene1Reply = { choiceMade: true, userText: TEXT.scene1.opt1, replyText: TEXT.scene1.opt1Reply, showQR: false, timer: 0 }; s.score = 0; }, COLORS.xhs_red);
            drawButton(TEXT.scene1.opt2, btnX, optY + 55, btnW, 45, () => { s.scene1Reply = { choiceMade: true, userText: TEXT.scene1.opt2, replyText: TEXT.scene1.opt2Reply, showQR: false, timer: 0 }; s.score = 4; }, COLORS.xhs_red);
            if (f.sawMoments) { ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(255, 36, 66, 0.3)'; drawButton(TEXT.scene1.opt3, btnX, optY - 55, btnW, 45, () => { s.scene1Reply = { choiceMade: true, userText: TEXT.scene1.opt3, replyText: TEXT.scene1.opt3Reply, showQR: true, timer: 0 }; s.score += 2; f.scene1Correct = true; }, COLORS.xhs_red); ctx.shadowBlur = 0; }
        }
    };

    const updateScene1Phone = () => {
        const s = gameState.current;
        ctx.fillStyle = '#000'; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H); drawRect(0, 0, LOGIC_W, LOGIC_H, '#fff');
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, LOGIC_W, LOGIC_H); ctx.clip(); ctx.translate(0, -s.profileScrollY);
        const grad = ctx.createLinearGradient(0, 0, 0, 200); grad.addColorStop(0, '#ffdde1'); grad.addColorStop(1, '#ee9ca7'); ctx.fillStyle = grad; ctx.fillRect(0, 0, LOGIC_W, 200);
        const infoY = 160; const rBig = 38; ctx.save(); ctx.beginPath(); ctx.arc(50, infoY, rBig, 0, Math.PI*2); ctx.clip(); const herImg = imagesRef.current.her; if (herImg && herImg.complete) { ctx.drawImage(herImg, 50 - rBig, infoY - rBig, rBig*2, rBig*2); } else { ctx.fillStyle = '#ffe4e1'; ctx.fillRect(50 - rBig, infoY - rBig, rBig*2, rBig*2); } ctx.restore();
        drawText(TEXT.profile.nickname, 110, infoY + 15, 20, '#333', 'left'); drawText(TEXT.profile.id, 110, infoY + 35, 12, '#999', 'left'); drawText(TEXT.profile.bio, 20, infoY + 70, 14, '#333', 'left');
        const statsY = infoY + 100; drawText(TEXT.profile.followCount, 30, statsY, 16, '#333'); drawText(TEXT.profile.statsFollow, 30, statsY + 20, 12, '#999'); drawText(TEXT.profile.fansCount, 90, statsY, 16, '#333'); drawText(TEXT.profile.statsFans, 90, statsY + 20, 12, '#999'); drawText(TEXT.profile.likesCount, 160, statsY, 16, '#333'); drawText(TEXT.profile.statsLikes, 170, statsY + 20, 12, '#999');
        drawRect(LOGIC_W - 120, infoY + 10, 80, 30, COLORS.xhs_red, 15); drawText(TEXT.profile.follow, LOGIC_W - 80, infoY + 30, 14, '#fff');
        const tabY = statsY + 40; drawText(TEXT.profile.tabsNotes, 60, tabY, 16, '#333'); drawRect(45, tabY + 10, 30, 2, COLORS.xhs_red); drawText(TEXT.profile.tabsCollect, 150, tabY, 16, '#999'); drawText(TEXT.profile.tabsLike, 240, tabY, 16, '#999'); ctx.strokeStyle = '#f0f0f0'; ctx.beginPath(); ctx.moveTo(0, tabY+15); ctx.lineTo(LOGIC_W, tabY+15); ctx.stroke();
        const contentY = tabY + 30; const cardW = (LOGIC_W - 40) / 2, gap = 10;
        const drawCard = (cx, cy, title, likeCount, type, index, imgH) => {
          const cardH = imgH + 70;
          drawRect(cx, cy, cardW, cardH, '#fff', 8); ctx.strokeStyle = '#f5f5f5'; ctx.strokeRect(cx, cy, cardW, cardH);
          const cardImg = imagesRef.current.cards[index];
          if (cardImg && cardImg.complete && cardImg.naturalWidth > 0) { ctx.drawImage(cardImg, cx, cy, cardW, imgH); }
          else {
            if (type === 'selfie') { ctx.fillStyle = COLORS.highlight; ctx.beginPath(); ctx.arc(cx + cardW/2, cy + imgH/2, Math.min(30, imgH/2 - 10), 0, Math.PI*2); ctx.fill(); }
            else if (type === 'food') { drawCircle(cx + cardW/2, cy + imgH/2, Math.min(20, imgH/2 - 10), '#ffd700'); }
            else { ctx.fillStyle = '#87ceeb'; const ph = Math.min(imgH - 20, 60); drawRect(cx+20, cy + (imgH - ph)/2, cardW-40, ph, '#87ceeb'); }
          }
          ctx.fillRect(cx, cy + imgH, cardW, 10);
          drawText(title, cx + 10, cy + imgH + 25, 14, '#333', 'left');
          drawCircle(cx + 15, cy + imgH + 50, 10, '#eee');
          drawText(TEXT.profile.cardAuthor, cx + 30, cy + imgH + 55, 12, '#999', 'left');
          drawText(TEXT.profile.likePrefix + likeCount, cx + cardW - 10, cy + imgH + 55, 10, '#999', 'right');
        };
        const colX = [15, 15 + cardW + gap]; let colY = [contentY, contentY];
        TEXT.profile.cards.forEach((c, i) => {
          let imgH = 150; const img = imagesRef.current.cards[i];
          if (img && img.complete && img.naturalWidth > 0) { imgH = Math.round(cardW * img.naturalHeight / img.naturalWidth); }
          const col = colY[0] <= colY[1] ? 0 : 1;
          drawCard(colX[col], colY[col], c.title, c.likes, c.type, i, imgH);
          colY[col] += imgH + 70 + gap;
        });
        ctx.restore();
        drawIcon('back', 30, 50, 12, '#fff');
        if (isHover(0, 0, 80, 80) && s.mouse.clicked) { s.mouse.clicked = false; s.flags.sawMoments = true; transitionTo(STATE.SCENE_1_CHAT, true); }
        drawButton(TEXT.scene1.backChat, (LOGIC_W - 200)/2, LOGIC_H - 80, 200, 50, () => { s.flags.sawMoments = true; transitionTo(STATE.SCENE_1_CHAT, true); }, COLORS.xhs_red);
    };

    const updateScene2 = () => {
      const s = gameState.current; const f = s.flags;
      if (s.mouse.clicked && !f.scene2Finished && !s.showDinnerOptions) {
        if (isHover(LOGIC_W - 150, 100, 150, 200)) { f.paidSecretly = true; s.score += 2; s.mouse.clicked = false; s.paymentFeedbackTimer = 90; return; }
      }
      ctx.fillStyle = '#fff8dc'; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
      ctx.fillStyle = '#d2b48c'; ctx.fillRect(LOGIC_W - 150, 150, 150, 100); drawText(TEXT.scene2.cashier, LOGIC_W - 75, 200, 16, '#fff');
      if (!f.paidSecretly && !s.showDinnerOptions && s.frameCount % 60 < 30) drawCircle(LOGIC_W - 75, 140, 5, COLORS.primary);
      if (f.paidSecretly) drawText("✔", LOGIC_W - 75, 140, 20, 'green');
      if (s.paymentFeedbackTimer > 0) { s.paymentFeedbackTimer--; ctx.fillStyle = COLORS.highlight; ctx.globalAlpha = 0.8; ctx.fillRect(LOGIC_W - 150, 150, 150, 100); ctx.globalAlpha = 1.0; drawText(TEXT.scene2.paidSecret, LOGIC_W / 2, 280, 20, COLORS.primary); }
      const boyX = LOGIC_W * 0.3, girlX = LOGIC_W * 0.7, charY = 450; drawBean(boyX, charY, false); drawBean(girlX, charY, true);
      drawRect(20, 500, LOGIC_W - 40, 150, '#8b4513', 10); drawCircle(LOGIC_W * 0.3, 530, 30, '#ddd'); drawCircle(LOGIC_W * 0.7, 530, 30, '#ddd'); drawText(TEXT.scene2.emptyPlate, LOGIC_W * 0.3, 535, 12, '#aaa');
      drawRect(20, 60, LOGIC_W - 40, 120, '#fff', 10); ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.strokeRect(20, 60, LOGIC_W - 40, 120);
      s.billTimer++;
      let msg = "";
      if (s.billTimer < 120) msg = ""; else if (s.billTimer < 360) msg = TEXT.scene2.msg1;
      else if (s.billTimer < 600) {
        msg = TEXT.scene2.waiterApproach;
        let wX = (LOGIC_W + 100) - (s.billTimer - 360) * 1.5; if (wX < LOGIC_W - 80) wX = LOGIC_W - 80;
        s.waiterX = wX; drawBean(wX, 350, false, 'normal', 0.8); drawRect(wX - 12, 365, 24, 30, '#fff', 2);
      } else { msg = TEXT.scene2.waiterAsk; s.showDinnerOptions = true; }
      if (msg) drawText(typeText(msg, 5), 40, 100, 20, '#333', 'left');
      if (s.showDinnerOptions) {
        if (f.paidSecretly) {
          drawRect(20, 60, LOGIC_W - 40, 120, '#fff', 10); drawText(TEXT.scene2.explainPaid, 40, 100, 20, '#333', 'left');
          if (s.billTimer > 800) transitionTo(STATE.SCENE_3_WALK);
        } else {
          const btnW = 180; drawButton(TEXT.scene2.buy, (LOGIC_W - btnW)/2, 680, btnW, 50, () => { s.score = 4; transitionTo(STATE.ENDING); });
          drawButton(TEXT.scene2.split, (LOGIC_W - btnW)/2, 740, btnW, 50, () => { s.score = 0; transitionTo(STATE.ENDING); });
        }
      }
    };

    const updateScene3 = () => {
      const s = gameState.current; const f = s.flags;
      ctx.fillStyle = '#2c3e50'; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H); ctx.fillStyle = 'rgba(255,255,255,0.5)'; for(let i=0; i<10; i++) drawCircle((s.frameCount * 2 + i * 50) % LOGIC_W, (s.frameCount * 3 + i * 80) % LOGIC_H, 2, '#fff'); ctx.fillStyle = '#34495e'; ctx.fillRect(0, 550, LOGIC_W, 250);
      const centerX = LOGIC_W / 2, charY = 500; let shake = 0; if (s.walkTimer > 100) shake = Math.sin(s.frameCount * 0.5) * 2;
      drawBean(centerX + 50 + shake, charY, true, 'normal', 1, true); ctx.fillStyle = '#ffcccc'; ctx.beginPath(); ctx.ellipse(centerX + 50 + shake, charY + 50, 20, 40, 0, 0, Math.PI*2); ctx.fill(); drawBean(centerX - 50, charY, false);
      let coatColor = '#8e44ad';
      if (isHover(centerX - 80, charY, 60, 100) && !f.gaveCoat && s.walkTimer > 100) { coatColor = '#9b59b6'; canvas.style.cursor = 'pointer'; if (s.mouse.clicked) { f.gaveCoat = true; s.mouse.clicked = false; s.score += 2; s.coatClickTime = s.walkTimer; } }
      if (!f.gaveCoat) { ctx.fillStyle = coatColor; ctx.beginPath(); ctx.ellipse(centerX - 50, charY + 50, 25, 45, 0, 0, Math.PI*2); ctx.fill(); } else { ctx.fillStyle = '#bdc3c7'; ctx.beginPath(); ctx.ellipse(centerX - 50, charY + 50, 20, 40, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = coatColor; ctx.beginPath(); ctx.ellipse(centerX + 50 + shake, charY + 55, 28, 48, 0, 0, Math.PI*2); ctx.fill(); }
      drawRect(20, 60, LOGIC_W - 40, 120, '#fff', 10); s.walkTimer++;
      let msg = ""; if (s.walkTimer < 180) msg = TEXT.scene3.msg1; else if (s.walkTimer < 420) msg = TEXT.scene3.msg2; else if (!f.gaveCoat) msg = TEXT.scene3.should; else msg = TEXT.scene3.coatAction;
      drawText(typeText(msg, 5), 40, 100, 20, '#333', 'left');
      if (s.walkTimer >= 420 && !f.gaveCoat) {
        const btnW = 220; drawButton(TEXT.scene3.optAskCold, (LOGIC_W - btnW)/2, 650, btnW, 50, () => { s.score = 4; transitionTo(STATE.ENDING); });
        drawButton(TEXT.scene3.optEncourage, (LOGIC_W - btnW)/2, 710, btnW, 50, () => { s.score = 0; transitionTo(STATE.ENDING); });
      } else if (f.gaveCoat) { if (s.walkTimer > s.coatClickTime + 250) { transitionTo(STATE.SCENE_HOME_TV); } }
    };

    const updateSceneHomeTV = () => {
        const s = gameState.current; const f = s.flags; const h = s.homeTv; h.timer++;
        let darkness = Math.min(1, h.timer / 400); const r = 255 - darkness * 50, g = 240 - darkness * 60, b = 230 - darkness * 70; ctx.fillStyle = `rgb(${r}, ${g}, ${b})`; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
        const winW = 200, winH = 150; ctx.fillStyle = '#87CEEB'; if (h.timer > 0) { const nr = 135 * (1 - darkness) + 44 * darkness; const ng = 206 * (1 - darkness) + 62 * darkness; const nb = 235 * (1 - darkness) + 80 * darkness; ctx.fillStyle = `rgb(${nr}, ${ng}, ${nb})`; } ctx.fillRect(50, 100, winW, winH); ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.strokeRect(50, 100, winW, winH); ctx.beginPath(); ctx.moveTo(50 + winW/2, 100); ctx.lineTo(50 + winW/2, 100 + winH); ctx.stroke(); ctx.beginPath(); ctx.moveTo(50, 100 + winH/2); ctx.lineTo(50 + winW, 100 + winH/2); ctx.stroke();
        ctx.fillStyle = '#333'; drawRect(LOGIC_W - 120, 200, 120, 80, '#000', 5); ctx.fillStyle = `rgba(200, 230, 255, ${0.2 + Math.random() * 0.3})`; ctx.fillRect(LOGIC_W - 115, 205, 110, 70);
        const sofaY = 400; drawRect(50, sofaY, 300, 100, '#d35400', 20); drawRect(30, sofaY + 60, 340, 60, '#e67e22', 20); drawBean(130, sofaY + 30, false); drawBean(230, sofaY + 30, true, 'normal', 1, true);
        const tableY = 550; drawRect(50, tableY, 300, 100, '#8b4513', 5);
        const lipX = 250, lipY = tableY + 20, lipW = 20, lipH = 40;
        if (!f.usedLipstick && h.timer > 60 && !h.reaction.active) { if (isHover(lipX - 40, lipY - 40, lipW + 80, lipH + 80)) { canvas.style.cursor = 'pointer'; if (s.mouse.clicked) { s.mouse.clicked = false; f.usedLipstick = true; h.lipstickClickFrame = h.timer; s.score += 2; } } }
        ctx.fillStyle = '#ffc0cb'; ctx.fillRect(lipX, lipY, lipW, lipH); ctx.fillStyle = '#555'; ctx.fillRect(lipX, lipY + 20, lipW, 10);
        drawRect(20, 60, LOGIC_W - 40, 120, '#fff', 10); ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.strokeRect(20, 60, LOGIC_W - 40, 120);
        let msg = "";
        if (h.reaction.active) { msg = h.reaction.text; h.reaction.timer++; if (h.reaction.timer > 180) transitionTo(STATE.ENDING); }
        else if (f.usedLipstick) { let dt = h.timer - h.lipstickClickFrame; if (dt < 150) msg = TEXT.home.dryLips; else { msg = TEXT.home.sheLipstick; ctx.save(); ctx.translate(LOGIC_W / 2, 300); ctx.scale(1 + Math.sin(s.frameCount*0.1)*0.2, 1 + Math.sin(s.frameCount*0.1)*0.2); drawText("❤", 0, 0, 50, COLORS.primary); ctx.restore(); } if (dt > 360) transitionTo(STATE.SCENE_4_DATE); }
        else { if (h.timer < 180) msg = TEXT.home.lateMsg; else if (h.timer > 300) { msg = TEXT.home.should; h.showOptions = true; } }
        drawText(typeText(msg, 5), 40, 100, 20, h.reaction.active && h.reaction.color === 'red' ? 'red' : '#333', 'left');
        if (h.showOptions && !f.usedLipstick && !h.reaction.active) {
          const btnW = 240; drawButton(TEXT.home.leave, (LOGIC_W - btnW)/2, 680, btnW, 50, () => { h.reaction = { active: true, text: TEXT.home.sheLeaveReply, color: "#333", timer: 0 }; s.score = 4; });
          drawButton(TEXT.home.stay, (LOGIC_W - btnW)/2, 740, btnW, 50, () => { h.reaction = { active: true, text: TEXT.home.sheAngry, color: "red", timer: 0 }; s.score = 0; });
        }
    };

    const updateScene4Date = () => {
        const s = gameState.current; s.date.timer++; const dt = s.date.timer;
        const grad = ctx.createLinearGradient(0, 0, 0, LOGIC_H); grad.addColorStop(0, '#fdfbf7'); grad.addColorStop(1, '#ffd1dc'); ctx.fillStyle = grad; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
        const calW = 240, calH = 300, calX = (LOGIC_W - calW) / 2, calY = 150;
        ctx.shadowBlur = 15; ctx.shadowColor = 'rgba(0,0,0,0.1)'; drawRect(calX, calY, calW, calH, '#fff', 10); ctx.shadowBlur = 0;
        drawRect(calX, calY, calW, 60, '#e74c3c', 10); ctx.fillRect(calX, calY + 40, calW, 20);
        drawCircle(calX + 40, calY + 30, 8, '#333'); drawCircle(calX + 200, calY + 30, 8, '#333');
        drawText(TEXT.date.year, LOGIC_W / 2, calY + 38, 24, '#fff', 'center');
        drawText(TEXT.date.month, calX + calW/2, calY + 120, 40, '#333'); drawText(TEXT.date.day, calX + calW/2, calY + 220, 80, '#e74c3c', 'center', 'Arial');
        const boyX = LOGIC_W/2 - 60, girlX = LOGIC_W/2 + 60, charY = 540; let slide = Math.max(0, 50 - dt * 0.5);
        drawBean(boyX - slide, charY, false); drawText(TEXT.date.boyName, boyX - slide, charY - 65, 14, '#333');
        drawBean(girlX + slide, charY, true, 'normal', 1, true); drawText(TEXT.date.girlName, girlX + slide, charY - 65, 14, '#333');
        if (dt > 100) {
          let scale = 1 + Math.sin(dt * 0.05) * 0.1; ctx.save(); ctx.translate(LOGIC_W/2, 500); ctx.scale(scale, scale); drawText("❤", 0, 0, 40, '#ff6b81'); ctx.restore();
          let alpha = Math.min(1, (dt - 100) / 60); ctx.globalAlpha = alpha;
          if (s.date.phase === 0) { drawText(TEXT.date.line1, LOGIC_W/2, 680, 24, '#333'); drawText(TEXT.date.line2, LOGIC_W/2, 720, 18, '#666'); }
          else { drawText(TEXT.date.line3, LOGIC_W/2, 680, 24, '#333'); drawText(TEXT.date.line4, LOGIC_W/2, 720, 18, '#666'); }
          ctx.globalAlpha = 1.0;
        }
        if (dt > 200) {
          if (s.mouse.clicked) { s.mouse.clicked = false; if(s.date.phase===0) s.date.phase=1; else transitionTo(STATE.SCENE_5_HAIR); }
          if (Math.floor(dt / 30) % 2 === 0) drawText(TEXT.date.clickContinue, LOGIC_W - 80, LOGIC_H - 50, 16, '#aaa');
        }
    };

    const updateScene5Hair = () => {
      const s = gameState.current; const h = s.hair; const f = s.flags; h.timer++;
      ctx.fillStyle = '#fdf5e6'; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
      drawRect(LOGIC_W/2 - 75, 100, 150, 100, '#fff', 5); ctx.strokeStyle = '#d4a373'; ctx.strokeRect(LOGIC_W/2 - 75, 100, 150, 100); ctx.beginPath(); ctx.moveTo(220, 160); ctx.lineTo(250, 130); ctx.lineTo(280, 160); ctx.strokeStyle='#888'; ctx.stroke();
      const bedY = 350; drawRect(50, bedY, LOGIC_W - 100, 250, '#e0e0e0', 20); drawRect(50, bedY + 120, LOGIC_W - 100, 130, '#fff', 20); drawRect(80, bedY - 20, 100, 50, '#fff', 10); drawRect(LOGIC_W - 180, bedY - 20, 100, 50, '#fff', 10); drawRect(20, 500, 80, 120, '#8b4513', 5);
      const phoneX = 40, phoneY = 510, phoneW = 40, phoneH = 70;
      if (h.phase === 1 && !h.dryerBought) {
        if (isHover(phoneX - 20, phoneY - 20, phoneW + 40, phoneH + 40)) { canvas.style.cursor = 'pointer'; if (s.mouse.clicked) { s.mouse.clicked = false; h.dryerBought = true; f.scene5Correct = true; s.score += 2; h.phase = 2; h.timer = 0; } }
      }
      drawRect(phoneX, phoneY, phoneW, phoneH, h.phase===1 && !h.dryerBought && isHover(phoneX-20,phoneY-20,phoneW+40,phoneH+40) ? '#555' : '#333', 5); drawRect(phoneX+2, phoneY+5, phoneW-4, phoneH-10, '#111', 2);
      let boyX = 120, girlX = 300, girlY = 300;
      if (h.phase === 1) { if (h.timer < 60) boyX = 120 + (girlX - 80 - 120) * (h.timer / 60); else boyX = girlX - 80; } else if (h.phase === 2 || h.phase === 4 || h.phase === 5) boyX = girlX - 80;
      drawBean(boyX, 300, false);
      if (h.phase === 0) { drawBean(girlX, girlY, true, 'normal', 1, true); ctx.fillStyle = '#afeeee'; ctx.beginPath(); ctx.arc(girlX, girlY - 15, 45, Math.PI, 0); ctx.fill(); ctx.fillRect(girlX - 45, girlY - 15, 90, 20); }
      else { drawBean(girlX, girlY, true, 'normal', 1, true); if (h.timer >= 60 && h.phase === 1 && !h.dryerBought) { ctx.save(); ctx.translate(girlX - 60, girlY - 20); drawRect(0, 0, 40, 20, '#555'); drawRect(40, -5, 10, 30, '#555'); ctx.strokeStyle = '#ccc'; ctx.beginPath(); ctx.moveTo(40, 10); ctx.lineTo(60 + Math.random()*10, 5 + Math.random()*10); ctx.moveTo(40, 10); ctx.lineTo(60 + Math.random()*10, 15 + Math.random()*10); ctx.stroke(); ctx.restore(); } }
      drawRect(20, 60, LOGIC_W - 40, 120, '#fff', 10); ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.strokeRect(20, 60, LOGIC_W - 40, 120);
      let msg = "";
      if (h.phase === 0) {
        if (h.timer < 120) msg = TEXT.hair.msg0; else { msg = TEXT.hair.should; if (h.timer > 120) { drawButton(TEXT.hair.optRest, (LOGIC_W-350)/2, 680, 350, 40, () => { h.phase = 3; h.timer = 0; s.score = 0; }); drawButton(TEXT.hair.optBlow, (LOGIC_W-350)/2, 730, 350, 40, () => { h.phase = 1; h.timer = 0; }); } }
      } else if (h.phase === 1) {
        if (h.timer < 120) msg = TEXT.hair.msg1a; else if (h.timer < 200) msg = TEXT.hair.msg1b; else {
          msg = TEXT.hair.msg1c;
          if (!h.dryerBought) { drawButton(TEXT.hair.optPraise, (LOGIC_W-350)/2, 680, 350, 40, () => { h.phase = 4; h.timer = 0; s.score = 4; }); drawButton(TEXT.hair.optBad, (LOGIC_W-350)/2, 730, 350, 40, () => { h.phase = 5; h.timer = 0; s.score = 0; }); }
        }
      } else if (h.phase === 2) {
        if (h.timer < 150) msg = TEXT.hair.buyAction; else { msg = TEXT.hair.buyResult; ctx.save(); ctx.translate(400, 300); ctx.scale(1.5, 1.5); drawText("❤", 0, 0, 50, COLORS.primary); ctx.restore(); if (h.timer > 400) transitionTo(STATE.SCENE_6_PHOTO); }
      } else if (h.phase === 3) { msg = TEXT.hair.bad3; if (h.timer > 150) transitionTo(STATE.ENDING); }
      else if (h.phase === 4) { msg = TEXT.hair.bad4; if (h.timer > 150) transitionTo(STATE.ENDING); }
      else if (h.phase === 5) { msg = TEXT.hair.bad5; if (h.timer > 150) transitionTo(STATE.ENDING); }
      drawParagraph(typeText(msg, 5), 40, 100, 370, 26, 20, '#333', 'left');
    };

    const updateScene6Photo = () => {
      const s = gameState.current; const p = s.photo; const f = s.flags; p.timer++;
      ctx.fillStyle = '#87ceeb'; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H); ctx.fillStyle = '#a8e6cf'; ctx.beginPath(); ctx.moveTo(0, 400); ctx.lineTo(200, 200); ctx.lineTo(500, 450); ctx.lineTo(800, 250); ctx.lineTo(800, 600); ctx.lineTo(0, 600); ctx.fill(); ctx.fillStyle = '#dcedc1'; ctx.fillRect(0, 450, LOGIC_W, 350);
      const girlX = LOGIC_W / 2, girlY = 350; drawBean(girlX, girlY, true, 'happy', 1, true);
      ctx.strokeStyle = '#333'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(girlX - 40, girlY + 50); ctx.lineTo(girlX - 70, girlY + 10); ctx.stroke(); ctx.beginPath(); ctx.moveTo(girlX - 70, girlY + 10); ctx.lineTo(girlX - 80, girlY - 10); ctx.stroke(); ctx.beginPath(); ctx.moveTo(girlX - 70, girlY + 10); ctx.lineTo(girlX - 60, girlY - 10); ctx.stroke();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.strokeRect(50, 100, LOGIC_W - 100, 400); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      const sz = 40, cx = 400, cy = 275; ctx.strokeRect(cx - sz/2, cy - sz/2, sz, sz);
      ctx.beginPath(); ctx.moveTo(300, 50); ctx.lineTo(300, 500); ctx.moveTo(500, 50); ctx.lineTo(500, 500); ctx.moveTo(100, 200); ctx.lineTo(700, 200); ctx.moveTo(100, 350); ctx.lineTo(700, 350); ctx.stroke();
      ctx.fillStyle = '#000'; ctx.fillRect(0, 500, 800, 100);
      const shutterX = LOGIC_W / 2, shutterY = 700, shutterR = 35; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(shutterX, shutterY, shutterR, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(shutterX, shutterY, shutterR - 6, 0, Math.PI*2); ctx.fill();
      if (p.phase <= 1) { if (isHover(shutterX - 40, shutterY - 40, 80, 80)) { canvas.style.cursor = 'pointer'; if (s.mouse.clicked) { s.mouse.clicked = false; p.count++; p.flash = 1.0; if (p.count >= 3) { p.phase = 3; p.timer = 0; } } } }
      if (p.flash > 0) { ctx.fillStyle = `rgba(255, 255, 255, ${p.flash})`; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H); p.flash -= 0.1; }
      if (p.phase !== 2 && p.phase !== 3) { ctx.fillStyle = 'rgba(0,0,0,0.6)'; drawRect(20, 60, LOGIC_W - 40, 60, 'rgba(0,0,0,0.6)', 10); } else { drawRect(20, 60, LOGIC_W - 40, 80, '#fff', 10); ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.strokeRect(20, 60, LOGIC_W - 40, 80); }
      let msg = "", textColor = '#fff';
      if (p.phase === 0) {
        textColor = '#fff';
        if (p.timer < 180) msg = TEXT.photo.msg0a; else if (p.timer < 360) msg = TEXT.photo.msg0b; else if (p.timer < 540) msg = TEXT.photo.msg0c; else if (p.timer < 720) msg = TEXT.photo.msg0d; else { msg = TEXT.photo.msg0e; p.phase = 1; }
      } else if (p.phase === 1) {
        msg = TEXT.photo.msg1; textColor = '#fff'; drawButton(TEXT.photo.optStop, (LOGIC_W-250)/2, 300, 250, 50, () => { p.phase = 2; p.timer = 0; f.failReason = 1; s.score = 4; }); drawButton(TEXT.photo.optQuit, (LOGIC_W-250)/2, 370, 250, 50, () => { p.phase = 2; p.timer = 0; f.failReason = 2; s.score = 0; });
      } else if (p.phase === 2) {
        textColor = '#333'; if (f.failReason === 1) msg = TEXT.photo.msg2a; else msg = TEXT.photo.msg2b;
        if (p.timer > 50) { ctx.save(); ctx.translate(LOGIC_W/2, 300); ctx.scale(2, 2); drawBean(0, 0, true, 'normal', 1, true); ctx.restore(); }
        if (p.timer > 200) transitionTo(STATE.ENDING);
      } else if (p.phase === 3) {
        textColor = '#333'; if (p.timer < 100) { msg = TEXT.photo.msg3a; ctx.save(); ctx.translate(LOGIC_W/2, 300); ctx.scale(2, 2); drawBean(0, 0, true, 'happy', 1, true); ctx.restore(); } else { msg = TEXT.photo.msg3b; ctx.save(); ctx.translate(LOGIC_W/2, 200); ctx.scale(1.5, 1.5); drawText("❤", 0, 0, 50, COLORS.primary); ctx.restore(); if (p.timer > 300) { f.scene6Correct = true; s.score += 2; transitionTo(STATE.SCENE_7_SKINCARE); } }
      }
      if (p.phase >= 2) drawParagraph(typeText(msg, 5), 40, 100, 370, 26, 18, textColor, 'left'); else drawText(typeText(msg, 5), LOGIC_W/2, 100, 18, textColor);
    };

    const updateScene7Skincare = () => {
      const s = gameState.current; const k = s.skin; const f = s.flags; k.timer++;
      ctx.fillStyle = '#fdf5e6'; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
      const bedY = 350; drawRect(50, bedY, LOGIC_W - 100, 250, '#e0e0e0', 20); drawRect(50, bedY + 100, LOGIC_W - 100, 150, '#fff', 20); drawRect(80, bedY - 20, 100, 50, '#fff', 10); drawRect(LOGIC_W - 180, bedY - 20, 100, 50, '#fff', 10);
      drawRect(20, 500, 80, 120, '#8b4513', 5);
      const bottleX = 40, bottleY = 510, bottleW = 40, bottleH = 50;
      if (k.phase === 0 || k.phase === 1) {
        if (isHover(bottleX - 20, bottleY - 20, bottleW + 40, bottleH + 40)) {
          canvas.style.cursor = 'pointer';
          if (s.mouse.clicked) {
            s.mouse.clicked = false;
            if (k.phase === 0) { k.phase = 3; k.timer = 0; s.score = 0; }
            else { k.phase = 2; k.timer = 0; f.scene7Correct = true; s.score += 2; }
          }
        }
      }
      ctx.fillStyle = '#2ecc71'; drawRect(bottleX, bottleY, bottleW, bottleH, '#2ecc71', 5); ctx.fillStyle = '#fff'; ctx.fillRect(bottleX + 10, bottleY + 10, 20, 20);
      let boyX, boyY, girlX, girlY;
      if (k.phase === 0 || k.phase === 3 || k.phase === 4) { boyX = 120; boyY = 300; girlX = 250; girlY = 320; } else { boyX = 250; boyY = 320; girlX = 120; girlY = 300; }
      drawBean(boyX, boyY, false); drawBean(girlX, girlY, true, 'normal', 1, true);
      ctx.strokeStyle = '#333'; ctx.lineWidth = 3; ctx.beginPath();
      if (k.phase === 0 || k.phase === 3 || k.phase === 4) { ctx.moveTo(girlX - 40, girlY + 30); ctx.lineTo(boyX + 20, boyY); } else { ctx.moveTo(boyX - 40, boyY + 30); ctx.lineTo(girlX + 20, girlY); }
      ctx.stroke();
      drawRect(20, 60, LOGIC_W - 40, 120, '#fff', 10); ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.strokeRect(20, 60, LOGIC_W - 40, 120);
      let msg = "";
      if (k.phase === 0) {
        if (k.timer < 120) msg = TEXT.skin.msg0; else {
          msg = TEXT.skin.should;
          drawButton(TEXT.skin.optNo, (LOGIC_W-280)/2, 680, 280, 40, () => { k.phase = 1; k.timer = 0; });
          drawButton(TEXT.skin.optThanks, (LOGIC_W-280)/2, 730, 280, 40, () => { k.phase = 4; k.timer = 0; s.score = 0; });
        }
      } else if (k.phase === 1) {
        if (k.timer < 150) msg = TEXT.skin.msg1a; else {
          msg = TEXT.skin.msg1b;
          drawButton(TEXT.skin.optComfort, (LOGIC_W-280)/2, 680, 280, 40, () => { k.phase = 5; k.timer = 0; s.score = 4; });
          drawButton(TEXT.skin.optDry, (LOGIC_W-280)/2, 730, 280, 40, () => { k.phase = 6; k.timer = 0; s.score = 0; });
        }
      } else if (k.phase === 2) {
        if (k.timer < 150) msg = TEXT.skin.msg2a; else {
          msg = TEXT.skin.msg2b;
          if (!k.newBottleShown) { ctx.fillStyle = '#2ecc71'; drawRect(200, 250, 60, 80, '#2ecc71', 5); ctx.fillStyle = '#f1c40f'; drawCircle(230, 270, 15, '#f1c40f'); }
          if (k.timer > 300) transitionTo(STATE.ENDING);
        }
      } else if (k.phase === 3) { msg = TEXT.skin.bad3; if (k.timer > 150) transitionTo(STATE.ENDING); }
      else if (k.phase === 4) { msg = TEXT.skin.bad4; if (k.timer > 100) transitionTo(STATE.ENDING); }
      else if (k.phase === 5) { msg = TEXT.skin.bad5; if (k.timer > 150) transitionTo(STATE.ENDING); }
      else if (k.phase === 6) { msg = TEXT.skin.bad6; if (k.timer > 150) transitionTo(STATE.ENDING); }
      drawParagraph(typeText(msg, 5), 40, 100, 370, 26, 18, '#333', 'left');
    };

    const updateEnding = () => {
      const s = gameState.current;
      ctx.fillStyle = COLORS.bg; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
      let title = "", desc = "", color = "";
      if (checkPerfectRun()) {
        const grad = ctx.createLinearGradient(0, 0, 0, LOGIC_H);
        grad.addColorStop(0, '#ff9a9e'); grad.addColorStop(1, '#fecfef');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
        for (let i = 0; i < 20; i++) {
            const t = s.frameCount * 0.02 + i * 100; const x = (Math.sin(t * 0.5 + i) * 200 + LOGIC_W / 2); const y = (t * 50 + i * 100) % (LOGIC_H + 100) - 50; const size = 20 + Math.sin(t) * 10;
            ctx.save(); ctx.translate(x, y); ctx.globalAlpha = 0.3; drawText("❤", 0, 0, size, '#fff'); ctx.restore();
        }
        ctx.globalAlpha = 1.0;
        drawText(TEXT.ending.congrats, LOGIC_W / 2, 120, 48, '#fff', 'center', 'Arial');
        const centerX = LOGIC_W / 2, charY = 250;
        drawBean(centerX - 35, charY, false, 'happy', 1.2); drawBean(centerX + 35, charY, true, 'happy', 1.2, true);
        ctx.save(); ctx.translate(centerX, charY - 80); const beat = 1 + Math.sin(s.frameCount * 0.1) * 0.1; ctx.scale(beat, beat); drawText("❤", 0, 0, 60, '#ff2442'); ctx.restore();
        const lines = TEXT.ending.letter;
        let startY = 380;
        lines.forEach((line, i) => {
            if (s.frameCount > i * 20) {
                const alpha = Math.min(1, (s.frameCount - i * 20) / 20);
                ctx.globalAlpha = alpha; ctx.fillStyle = '#333'; ctx.font = `18px "ZCOOL KuaiLe", sans-serif`; ctx.textAlign = 'center'; ctx.fillText(line, LOGIC_W / 2, startY + i * 28);
            }
        });
        ctx.globalAlpha = 1.0;
        if (s.frameCount > lines.length * 20 + 60) {
            drawButton(TEXT.ending.review, (LOGIC_W - 240)/2, 720, 240, 50, () => { transitionTo(STATE.SCENE_1_NOTIFICATION, false, resetGame); }, '#ff6b81');
        }
      } else {
        drawText(TEXT.ending.over, LOGIC_W / 2, 200, 40, '#333');
        const mistake = findFirstMistake();
        if (mistake) {
          drawButton(mistake.label, (LOGIC_W - 200)/2, 600, 200, 50, () => { retryFromMistake(mistake.state); }, "#3498db");
        }
        if (s.score >= 4) { title = TEXT.ending.normalTitle; desc = TEXT.ending.normalDesc; color = "#f39c12"; drawText("😐", LOGIC_W / 2, 400, 60, "#333"); }
        else { title = TEXT.ending.badTitle; desc = TEXT.ending.badDesc; color = "#7f8c8d"; drawText("💔", LOGIC_W / 2, 400, 60, "#7f8c8d"); }
        drawText(title, LOGIC_W / 2, 300, 24, color); drawText(desc, LOGIC_W / 2, 340, 14, '#555');
        drawButton(TEXT.ending.restart, (LOGIC_W - 200)/2, 670, 200, 50, () => { transitionTo(STATE.SCENE_1_NOTIFICATION, false, resetGame); });
      }
    };

    const updateLoading = () => {
      const s = gameState.current;
      ctx.fillStyle = COLORS.bg; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
      const ratio = Math.min(1, s.preload.total ? s.preload.loaded / s.preload.total : 0);
      drawText('正在加载...', LOGIC_W / 2, LOGIC_H / 2 - 40, 20, '#333');
      const barW = 300, barH = 20, x = (LOGIC_W - barW) / 2, y = LOGIC_H / 2;
      drawRect(x, y, barW, barH, '#eee', 10);
      drawRect(x, y, Math.floor(barW * ratio), barH, COLORS.primary, 10);
      if (ratio >= 1) { s.current = STATE.MENU; }
    };

    const loop = () => {
      const s = gameState.current;
      s.frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (s.transition.active) {
        if (s.transition.mode === 'FADE_OUT') {
          s.transition.alpha += 0.02;
          if (s.transition.alpha >= 1) {
            s.transition.alpha = 1; s.current = s.transition.nextState; s.transition.mode = 'FADE_IN';
            if(s.transition.onMidpoint) s.transition.onMidpoint();
            s.mouse.clicked = false; s.textTyper = { text: "", index: 0, complete: false };
          }
        } else {
          s.transition.alpha -= 0.02; if (s.transition.alpha <= 0) { s.transition.alpha = 0; s.transition.active = false; s.transition.onMidpoint = null; }
        }
      }
      switch (s.current) {
        case STATE.LOADING: updateLoading(); break;
        case STATE.MENU: updateMenu(); break;
        case STATE.SCENE_1_NOTIFICATION: updateScene1Notification(); break;
        case STATE.SCENE_1_CHAT: updateScene1(); break;
        case STATE.SCENE_1_PHONE: updateScene1Phone(); break;
        case STATE.SCENE_2_DINNER: updateScene2(); break;
        case STATE.SCENE_3_WALK: updateScene3(); break;
        case STATE.SCENE_HOME_TV: updateSceneHomeTV(); break;
        case STATE.SCENE_4_DATE: updateScene4Date(); break;
        case STATE.SCENE_5_HAIR: updateScene5Hair(); break;
        case STATE.SCENE_6_PHOTO: updateScene6Photo(); break;
        case STATE.SCENE_7_SKINCARE: updateScene7Skincare(); break;
        case STATE.ENDING: updateEnding(); break;
        default: break;
      }
      if (s.transition.active || s.transition.alpha > 0) { ctx.fillStyle = `rgba(255, 255, 255, ${s.transition.alpha})`; ctx.fillRect(0, 0, LOGIC_W, LOGIC_H); }
      if (s.mouse.clicked) s.mouse.clicked = false;
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleInputStart);
      canvas.removeEventListener('mousemove', handleInputMove);
      canvas.removeEventListener('mouseup', handleInputEnd);
      canvas.removeEventListener('touchstart', handleInputStart);
      canvas.removeEventListener('touchmove', handleInputMove);
      canvas.removeEventListener('touchend', handleInputEnd);
      window.removeEventListener('mousedown', ensurePlay);
      window.removeEventListener('touchstart', ensurePlay);
      window.removeEventListener('keydown', ensurePlay);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
