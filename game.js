const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const fadeLayer = document.getElementById('fadeLayer');
const tooltip = document.getElementById('tooltip');

// 游戏状态
const STATE = {
    MENU: 0,
    SCENE_1_CHAT: 1,
    SCENE_1_PHONE: 2,
    SCENE_HOME_TV: 6,
    SCENE_2_DINNER: 3,
    SCENE_3_WALK: 4,
    SCENE_4_DATE: 7,
    SCENE_5_HAIR: 8,
    SCENE_6_PHOTO: 9,
    SCENE_7_SKINCARE: 10, // 新增：护肤场景
    ENDING: 5
};

// 资源颜色
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
    window_light: '#f1c40f'
};

// 全局变量
let currentState = STATE.MENU;
let score = 0;
let frameCount = 0;
let mouse = { x: 0, y: 0, clicked: false, down: false, lastY: 0 };
let textTyper = { text: "", index: 0, timer: 0, complete: false };
let profileScrollY = 0;

// 场景变量
let billTimer = 0;
let walkTimer = 0;
let showDinnerOptions = false;
let waiterX = 600;

let scene1ReplyConfig = {
    choiceMade: false,
    userText: "",
    replyText: "",
    showQR: false,
    timer: 0
};

// Home TV 场景变量
let homeTvTimer = 0;
let showHomeOptions = false;
let lipstickClickFrame = 0;

let homeTvReaction = {
    active: false,
    text: "",
    color: "#333",
    timer: 0
};

// Scene 4 Date 变量
let dateTimer = 0;
let handHoldProgress = 0;

// Scene 5 Hair 变量
let hairTimer = 0;
let hairPhase = 0;
let hairDryerBought = false;

// Scene 6 Photo 变量
let photoTimer = 0;
let photoCount = 0;
let photoPhase = 0;
let flashOpacity = 0;

// Scene 7 Skincare 变量
let skinTimer = 0;
let skinPhase = 0; // 0:她给我擦, 1:我给她擦, 2:完美, 3+:失败分支
let newBottleShown = false;

let flags = {
    sawMoments: false,
    paidSecretly: false,
    gaveCoat: false,
    usedLipstick: false,
    scene1Correct: false,
    scene5Correct: false,
    scene6Correct: false,
    scene7Correct: false, // 新增：护肤全对
    scene1Finished: false,
    scene1InputClicked: false,
    scene2Finished: false,
    scene3Finished: false
};

function resetGame() {
    score = 0;
    frameCount = 0;
    billTimer = 0;
    walkTimer = 0;
    homeTvTimer = 0;
    dateTimer = 0;
    hairTimer = 0;
    hairPhase = 0;
    hairDryerBought = false;

    photoTimer = 0;
    photoCount = 0;
    photoPhase = 0;
    flashOpacity = 0;

    skinTimer = 0;
    skinPhase = 0;
    newBottleShown = false;

    handHoldProgress = 0;
    showDinnerOptions = false;
    showHomeOptions = false;
    waiterX = 600;
    profileScrollY = 0;
    lipstickClickFrame = 0;

    scene1ReplyConfig = {
        choiceMade: false,
        userText: "",
        replyText: "",
        showQR: false,
        timer: 0
    };

    homeTvReaction = {
        active: false,
        text: "",
        color: "#333",
        timer: 0
    };

    flags = {
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
        scene3Finished: false
    };
    resetTyper();
}

// 检查是否达成完美结局条件
function checkPerfectRun() {
    return flags.scene1Correct && flags.paidSecretly && flags.gaveCoat && flags.usedLipstick && flags.scene5Correct && flags.scene6Correct && flags.scene7Correct;
}

// ==================== 核心：移动端输入处理 ====================

function getInputPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

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

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function handleStart(e) {
    const pos = getInputPos(e);
    mouse.x = pos.x;
    mouse.y = pos.y;
    mouse.lastY = pos.y;
    mouse.clicked = true;
    mouse.down = true;
}

function handleMove(e) {
    e.preventDefault();
    const pos = getInputPos(e);

    if (currentState === STATE.SCENE_1_PHONE && mouse.down) {
        const deltaY = mouse.lastY - pos.y;
        profileScrollY += deltaY;
        profileScrollY = Math.max(0, Math.min(profileScrollY, 400));
    }

    mouse.x = pos.x;
    mouse.y = pos.y;
    mouse.lastY = pos.y;
}

function handleEnd(e) {
    mouse.down = false;
}

canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('mouseup', handleEnd);
canvas.addEventListener('mouseleave', handleEnd);

canvas.addEventListener('touchstart', handleStart, {passive: false});
canvas.addEventListener('touchmove', handleMove, {passive: false});
canvas.addEventListener('touchend', handleEnd);


// ==================== 游戏逻辑 ====================

function typeText(str, speed = 2) {
    if (textTyper.text !== str) {
        textTyper.text = str;
        textTyper.index = 0;
        textTyper.complete = false;
    }
    if (!textTyper.complete) {
        if (frameCount % speed === 0) {
            textTyper.index++;
        }
        if (textTyper.index >= str.length) {
            textTyper.complete = true;
        }
    }
    return str.substring(0, textTyper.index);
}

function resetTyper() {
    textTyper.text = "";
    textTyper.index = 0;
    textTyper.complete = false;
}

function transitionTo(newState, callback) {
    fadeLayer.classList.add('fade-active');
    setTimeout(() => {
        if (callback) callback();
        currentState = newState;
        mouse.clicked = false;
        mouse.down = false;
        resetTyper();
        fadeLayer.classList.remove('fade-active');
    }, 1000);
}

// ==================== 绘图辅助 ====================

function drawRect(x, y, w, h, color, radius = 0) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function drawText(text, x, y, size, color = COLORS.text, align = 'center', font = '"ZCOOL KuaiLe", sans-serif') {
    ctx.fillStyle = color;
    ctx.font = `${size}px ${font}`;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
}

function drawIcon(type, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (type === 'back') {
        ctx.beginPath();
        ctx.moveTo(size/2, -size/2);
        ctx.lineTo(-size/2, 0);
        ctx.lineTo(size/2, size/2);
        ctx.stroke();
    } else if (type === 'more') {
        ctx.beginPath(); ctx.arc(-size/3, 0, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(size/3, 0, 2, 0, Math.PI*2); ctx.fill();
    } else if (type === 'share') {
        ctx.beginPath();
        ctx.moveTo(-size/4, size/3); ctx.lineTo(-size/4, -size/3); ctx.lineTo(size/2, -size/3);
        ctx.moveTo(size/4, -size/1.5); ctx.lineTo(size/2, -size/3); ctx.lineTo(size/4, 0);
        ctx.stroke();
    }
    ctx.restore();
}

function isHover(x, y, w, h) {
    return mouse.x > x && mouse.x < x + w && mouse.y > y && mouse.y < y + h;
}

function drawButton(text, x, y, w, h, callback, btnColor = COLORS.primary) {
    const hover = isHover(x, y, w, h);

    ctx.shadowBlur = hover ? 5 : 0;
    ctx.shadowColor = btnColor;

    ctx.fillStyle = hover ? btnColor : '#fff';
    ctx.strokeStyle = btnColor;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 20);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    let fontSize = 16;
    if (text.length > 12) fontSize = 14;
    if (text.length > 16) fontSize = 12;
    if (text.length > 20) fontSize = 12;

    ctx.font = `${fontSize}px "ZCOOL KuaiLe", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = hover ? '#fff' : btnColor;
    ctx.fillText(text, x + w/2, y + h/2 + fontSize/3);

    if (hover && mouse.clicked) {
        mouse.clicked = false;
        callback();
    }
}

function drawBean(x, y, isGirl = false, emotion = 'normal') {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, 40, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#333';
    if (emotion === 'happy') {
        ctx.beginPath();
        ctx.moveTo(-15, -5); ctx.lineTo(-5, -15); ctx.lineTo(5, -5);
        ctx.moveTo(15, -5); ctx.lineTo(25, -15); ctx.lineTo(35, -5);
        ctx.stroke();
    } else {
        drawCircle(-15, -10, 3, '#333');
        drawCircle(15, -10, 3, '#333');
    }

    if (isGirl || emotion === 'shy') {
        ctx.fillStyle = '#ffb7c5';
        ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.arc(-20, 5, 6, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(20, 5, 6, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    if (isGirl) {
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(0, -10, 42, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-40, 10, 10, 0, Math.PI*2);
        ctx.fill();
    }
    ctx.restore();
}

function drawChatBubble(x, y, text, isMe) {
    ctx.font = `15px "ZCOOL KuaiLe", sans-serif`;
    const maxWidth = 180;
    const lineHeight = 22;
    const padding = 12;

    let lines = [];
    let line = '';
    for (let i = 0; i < text.length; i++) {
        let testLine = line + text[i];
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            lines.push(line);
            line = text[i];
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    let maxLineWidth = 0;
    lines.forEach(l => maxLineWidth = Math.max(maxLineWidth, ctx.measureText(l).width));

    const w = maxLineWidth + padding * 2;
    const h = lines.length * lineHeight + padding + 5;

    const bx = isMe ? x - w : x;
    const bgColor = isMe ? COLORS.bubble_me : '#fff';
    const textColor = isMe ? '#fff' : '#333';

    drawRect(bx, y, w, h, bgColor, 10);

    ctx.beginPath();
    if (isMe) {
        ctx.moveTo(bx + w, y + 10);
        ctx.lineTo(bx + w + 5, y + 10);
        ctx.lineTo(bx + w, y + 15);
    } else {
        ctx.moveTo(bx, y + 10);
        ctx.lineTo(bx - 5, y + 10);
        ctx.lineTo(bx, y + 15);
    }
    ctx.fillStyle = bgColor;
    ctx.fill();

    if (!isMe) {
        ctx.strokeStyle = '#eee';
        ctx.strokeRect(bx, y, w, h);
    }

    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    lines.forEach((l, i) => {
        ctx.fillText(l, bx + padding, y + padding + i * lineHeight + 6);
    });
    ctx.textBaseline = 'alphabetic';

    return h;
}

// ==================== 场景逻辑 ====================

function updateMenu() {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawText("拣 爱", 400, 250, 80, COLORS.primary);
    drawText("网页致敬版", 400, 300, 24, "#aaa");
    drawText("手机版已适配", 400, 550, 14, "#ccc");

    const scale = 1 + Math.sin(frameCount * 0.05) * 0.05;
    ctx.save();
    ctx.translate(400, 150);
    ctx.scale(scale, scale);
    drawText("❤", 0, 0, 60, COLORS.primary);
    ctx.restore();

    drawButton("开始故事", 300, 400, 200, 60, () => {
        transitionTo(STATE.SCENE_1_CHAT, resetGame);
    });
}

function updateScene1() {
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const px = 250, py = 50, pw = 300, ph = 500;
    drawRect(px, py, pw, ph, '#333', 30);
    drawRect(px + 10, py + 10, pw - 20, ph - 20, COLORS.phone_screen, 20);

    drawRect(px + 10, py + 10, pw - 20, 20, '#fff', 20);
    drawText("9:41", px + 40, py + 26, 10, '#333');
    drawRect(px + pw - 50, py + 18, 16, 8, '#333', 2);

    const topBarY = py + 30;
    drawRect(px + 10, topBarY, pw - 20, 40, '#fff');

    drawIcon('back', px + 30, topBarY + 20, 12, '#333');
    drawText("橘生✨", px + 150, topBarY + 25, 16, '#333', 'center', 'sans-serif');
    drawIcon('more', px + 270, topBarY + 20, 12, '#333');

    ctx.strokeStyle = COLORS.line_gray;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px+10, topBarY + 40); ctx.lineTo(px+pw-10, topBarY + 40); ctx.stroke();

    const avatarX = px + 25;
    const avatarY = topBarY + 60;
    const avatarR = 20;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarR, avatarY + avatarR, avatarR, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#ffe4e1';
    ctx.fillRect(avatarX, avatarY, avatarR*2, avatarR*2);
    ctx.fillStyle = COLORS.xhs_red;
    ctx.beginPath(); ctx.arc(avatarX + avatarR, avatarY + avatarR + 5, 12, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    if (!flags.sawMoments) {
        drawCircle(avatarX + 2 * avatarR - 2, avatarY + 5, 4, 'red');
    }

    if (!scene1ReplyConfig.choiceMade && isHover(avatarX, avatarY, 40, 40)) {
        canvas.style.cursor = 'pointer';
        if (mouse.clicked) {
            mouse.clicked = false;
            currentState = STATE.SCENE_1_PHONE;
        }
    }

    let textY = topBarY + 65;
    let currentY = textY;

    const h1 = drawChatBubble(px + 75, currentY + 5, "dd", false);
    drawText("昨天 20:30", px + 150, topBarY + 50, 10, '#ccc');

    if (scene1ReplyConfig.choiceMade) {
        scene1ReplyConfig.timer++;

        currentY += h1 + 20;

        drawCircle(px + pw - 45, currentY + 20, 20, COLORS.primary);
        const h2 = drawChatBubble(px + pw - 75, currentY + 5, scene1ReplyConfig.userText, true);

        if (scene1ReplyConfig.timer > 60) {
            currentY += h2 + 20;

            ctx.save();
            ctx.beginPath(); ctx.arc(avatarX + avatarR, currentY + 20, avatarR, 0, Math.PI * 2); ctx.clip();
            ctx.fillStyle = '#ffe4e1'; ctx.fillRect(avatarX, currentY, avatarR*2, avatarR*2);
            ctx.fillStyle = COLORS.xhs_red; ctx.beginPath(); ctx.arc(avatarX + avatarR, currentY + 25, 12, 0, Math.PI*2); ctx.fill();
            ctx.restore();

            const h3 = drawChatBubble(px + 75, currentY + 5, scene1ReplyConfig.replyText, false);

            if (scene1ReplyConfig.showQR && scene1ReplyConfig.timer > 180) {
                const qrY = currentY + h3 + 20;
                drawRect(px + 75, qrY, 100, 100, '#fff', 5);
                ctx.strokeStyle = '#eee'; ctx.strokeRect(px + 75, qrY, 100, 100);
                ctx.fillStyle = '#000';
                for(let i=0; i<5; i++) {
                    for(let j=0; j<5; j++) {
                        if ((i+j)%2==0) drawRect(px+85 + i*16, qrY+10 + j*16, 10, 10, '#000');
                    }
                }
                drawText("扫一扫加我", px + 125, qrY + 120, 12, '#999');
            }
        }

        const waitTime = scene1ReplyConfig.showQR ? 400 : 180;
        if (scene1ReplyConfig.timer > waitTime) {
             flags.scene1Finished = true;
             transitionTo(STATE.SCENE_2_DINNER);
        }

        return;
    }

    const bottomAreaH = 180;
    const bottomY = py + ph - 20 - bottomAreaH;

    drawRect(px + 10, py + ph - 70, pw - 20, 50, '#fff');
    ctx.strokeStyle = COLORS.line_gray; ctx.beginPath(); ctx.moveTo(px+10, py+ph-70); ctx.lineTo(px+pw-10, py+ph-70); ctx.stroke();

    const inputX = px + 25;
    const inputY = py + ph - 60;
    const inputW = 200;
    const inputH = 30;

    let inputColor = COLORS.ui_gray;
    let inputStroke = 'transparent';

    if (!flags.scene1InputClicked) {
        if (isHover(inputX, inputY, inputW, inputH)) {
            canvas.style.cursor = 'pointer';
            inputStroke = COLORS.xhs_red;
            if (mouse.clicked) {
                mouse.clicked = false;
                flags.scene1InputClicked = true;
            }
        }
    } else {
        inputStroke = COLORS.xhs_red;
        inputColor = '#fff';
    }

    drawRect(inputX, inputY, inputW, inputH, inputColor, 15);
    if (inputStroke !== 'transparent') {
        ctx.save();
        ctx.strokeStyle = inputStroke;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(inputX, inputY, inputW, inputH, 15);
        ctx.stroke();
        ctx.restore();
    }

    if (flags.scene1InputClicked) {
        drawText(" |", px + 70, py + ph - 40, 12, '#333', 'left', 'sans-serif');
    } else {
        drawText(" 说点什么...", px + 70, py + ph - 40, 12, '#999', 'left', 'sans-serif');
    }

    drawCircle(px + 245, py + ph - 45, 12, COLORS.ui_gray);
    drawText("+", px + 245, py + ph - 41, 16, '#666');

    if (frameCount > 60 && flags.scene1InputClicked) {
        const optY = bottomY + 20;
        const btnColor = COLORS.xhs_red;
        const btnW = 260;
        const btnX = px + (pw - btnW) / 2;

        drawButton("你好啊", btnX, optY, btnW, 36, () => {
            scene1ReplyConfig.choiceMade = true;
            scene1ReplyConfig.userText = "你好啊";
            scene1ReplyConfig.replyText = "你好你好";
        }, btnColor);

        drawButton("同学你好，请问你叫什么名字", btnX, optY + 45, btnW, 36, () => {
            scene1ReplyConfig.choiceMade = true;
            scene1ReplyConfig.userText = "同学你好，请问你叫什么名字";
            scene1ReplyConfig.replyText = "我叫周梦雪，你叫什么？";
            score += 0;
        }, btnColor);

        if (flags.sawMoments) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 36, 66, 0.3)';
            drawButton("同学你好漂亮，微信号也一定很好记吧", btnX, optY - 45, btnW, 36, () => {
                scene1ReplyConfig.choiceMade = true;
                scene1ReplyConfig.userText = "同学你好漂亮，微信号也一定很好记吧";
                scene1ReplyConfig.replyText = "油嘴滑舌！";
                scene1ReplyConfig.showQR = true;
                score += 2;
                flags.scene1Correct = true;
            }, btnColor);
            ctx.shadowBlur = 0;
        }
    }
}

function updateScene1Phone() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const px = 250, py = 50, pw = 300, ph = 500;
    drawRect(px, py, pw, ph, '#fff', 30);

    ctx.save();
    ctx.beginPath();
    ctx.rect(px + 10, py + 10, pw - 20, ph - 20);
    ctx.clip();

    ctx.translate(0, -profileScrollY);

    const grad = ctx.createLinearGradient(px, py, px, py + 150);
    grad.addColorStop(0, '#ffdde1');
    grad.addColorStop(1, '#ee9ca7');
    ctx.fillStyle = grad;
    ctx.fillRect(px + 10, py + 10, pw - 20, 120);

    const infoY = py + 110;

    drawCircle(px + 50, infoY, 38, '#fff');
    drawCircle(px + 50, infoY, 35, '#ffe4e1');
    ctx.fillStyle = COLORS.xhs_red;
    ctx.beginPath(); ctx.arc(px + 50, infoY + 8, 20, 0, Math.PI*2); ctx.fill();

    drawText("橘生✨", px + 100, infoY + 15, 20, '#333', 'left', 'sans-serif');
    drawText("小红薯号：9527888", px + 100, infoY + 35, 10, '#999', 'left', 'sans-serif');

    drawText("吃喝玩乐✨ | 摄影📷 | 分享生活", px + 30, infoY + 65, 12, '#333', 'left', 'sans-serif');

    const statsY = infoY + 90;
    drawText("12", px + 40, statsY, 14, '#333');
    drawText("关注", px + 40, statsY + 15, 10, '#999');

    drawText("326", px + 90, statsY, 14, '#333');
    drawText("粉丝", px + 90, statsY + 15, 10, '#999');

    drawText("1.2k", px + 140, statsY, 14, '#333');
    drawText("获赞与收藏", px + 160, statsY + 15, 10, '#999');

    drawRect(px + 200, infoY, 70, 28, COLORS.xhs_red, 14);
    drawText("关注", px + 235, infoY + 19, 12, '#fff');
    drawCircle(px + 285, infoY + 14, 14, COLORS.ui_gray);

    const tabY = statsY + 30;
    drawText("笔记", px + 50, tabY, 14, '#333', 'center', 'sans-serif');
    drawRect(px + 35, tabY + 8, 30, 2, COLORS.xhs_red);
    drawText("收藏", px + 120, tabY, 14, '#999', 'center', 'sans-serif');
    drawText("赞过", px + 190, tabY, 14, '#999', 'center', 'sans-serif');

    ctx.strokeStyle = '#f0f0f0'; ctx.beginPath(); ctx.moveTo(px+10, tabY+10); ctx.lineTo(px+pw-10, tabY+10); ctx.stroke();

    const contentY = tabY + 25;
    const cardW = 130;
    const cardH = 160;
    const gapY = 10;

    function drawCard(cx, cy, title, likeCount, type) {
        drawRect(cx, cy, cardW, cardH, '#fff', 8);
        ctx.strokeStyle = '#f5f5f5'; ctx.strokeRect(cx, cy, cardW, cardH);
        drawRect(cx, cy, cardW, 110, '#f9f9f9', 8);
        ctx.fillRect(cx, cy+100, cardW, 10);

        if (type === 'selfie') {
             ctx.fillStyle = COLORS.highlight;
             ctx.beginPath(); ctx.arc(cx + cardW/2, cy + 60, 20, 0, Math.PI*2); ctx.fill();
        } else if (type === 'food') {
             drawCircle(cx + cardW/2, cy + 60, 15, '#ffd700');
        } else if (type === 'scenery') {
             ctx.fillStyle = '#87ceeb';
             drawRect(cx+30, cy+40, 70, 40, '#87ceeb');
        }

        drawText(title, cx + 10, cy + 130, 12, '#333', 'left');
        drawCircle(cx + 15, cy + 148, 8, '#eee');
        drawText("橘生✨", cx + 30, cy + 152, 10, '#999', 'left');
        drawText("❤ " + likeCount, cx + cardW - 10, cy + 152, 10, '#999', 'right');
    }

    drawCard(px + 20, contentY, "今日份自拍~✨", "520", 'selfie');
    drawCard(px + 20 + cardW + 10, contentY, "超好吃的火锅🍲", "102", 'food');

    const row2Y = contentY + cardH + gapY;
    drawCard(px + 20, row2Y, "周末去看了展🎨", "330", 'scenery');
    drawCard(px + 20 + cardW + 10, row2Y, "这是什么神仙奶茶!", "89", 'food');

    const row3Y = row2Y + cardH + gapY;
    drawCard(px + 20, row3Y, "心情不好 求抱抱", "999", 'selfie');
    drawCard(px + 20 + cardW + 10, row3Y, "偶遇一只小猫咪🐱", "245", 'scenery');

    ctx.restore();

    ctx.shadowBlur = 2; ctx.shadowColor = 'rgba(0,0,0,0.2)';

    if (isHover(px, py, 60, 60)) {
        canvas.style.cursor = 'pointer';
        if (mouse.clicked) {
            mouse.clicked = false;
            flags.sawMoments = true;
            currentState = STATE.SCENE_1_CHAT;
        }
    }
    drawIcon('back', px + 30, py + 40, 12, '#fff');

    ctx.shadowBlur = 0;

    ctx.save();
    ctx.beginPath();
    ctx.rect(px+10, py+ph-60, pw-20, 50);
    ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(px+10, py+ph-60, pw-20, 50);
    ctx.restore();

    drawButton("返回聊天", px + 50, py + 440, 200, 40, () => {
        flags.sawMoments = true;
        currentState = STATE.SCENE_1_CHAT;
    }, COLORS.xhs_red);
}

function updateSceneHomeTV() {
    homeTvTimer++;

    let darkness = Math.min(1, homeTvTimer / 400);
    const r = 255 - darkness * 50;
    const g = 240 - darkness * 60;
    const b = 230 - darkness * 70;
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const winX = 100, winY = 100, winW = 200, winH = 150;
    ctx.fillStyle = '#87CEEB';
    if (homeTvTimer > 0) {
        const nr = 135 * (1 - darkness) + 44 * darkness;
        const ng = 206 * (1 - darkness) + 62 * darkness;
        const nb = 235 * (1 - darkness) + 80 * darkness;
        ctx.fillStyle = `rgb(${nr}, ${ng}, ${nb})`;
    }
    ctx.fillRect(winX, winY, winW, winH);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.strokeRect(winX, winY, winW, winH);
    ctx.beginPath(); ctx.moveTo(winX + winW/2, winY); ctx.lineTo(winX + winW/2, winY + winH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(winX, winY + winH/2); ctx.lineTo(winX + winW, winY + winH/2); ctx.stroke();

    const tvX = 550, tvY = 200, tvW = 150, tvH = 100;
    ctx.fillStyle = '#333';
    drawRect(tvX, tvY, tvW, tvH, '#000', 5);
    ctx.fillStyle = `rgba(200, 230, 255, ${0.2 + Math.random() * 0.3})`;
    ctx.fillRect(tvX + 5, tvY + 5, tvW - 10, tvH - 10);
    ctx.fillStyle = `rgba(200, 230, 255, ${0.1 + Math.random() * 0.1})`;
    ctx.beginPath();
    ctx.moveTo(tvX, tvY + tvH);
    ctx.lineTo(tvX - 50, 500);
    ctx.lineTo(tvX + tvW + 50, 500);
    ctx.lineTo(tvX + tvW, tvY + tvH);
    ctx.fill();

    const sofaX = 150, sofaY = 350, sofaW = 350, sofaH = 120;
    drawRect(sofaX, sofaY, sofaW, sofaH, '#d35400', 20);
    drawRect(sofaX - 20, sofaY + 60, sofaW + 40, 80, '#e67e22', 20);

    drawBean(250, 380, false);
    drawBean(350, 380, true);

    const tableX = 150, tableY = 430, tableW = 300, tableH = 100;
    drawRect(tableX, tableY, tableW, tableH, '#8b4513', 5);

    const lipX = 400, lipY = 440, lipW = 20, lipH = 40;
    let lipColor = '#ffc0cb';

    if (!flags.usedLipstick && homeTvTimer > 60 && !homeTvReaction.active) {
        if (isHover(lipX - 40, lipY - 40, lipW + 80, lipH + 80)) {
            lipColor = '#ff69b4';
            canvas.style.cursor = 'pointer';
            if (mouse.clicked) {
                mouse.clicked = false;
                flags.usedLipstick = true;
                lipstickClickFrame = homeTvTimer;
                score += 2;
            }
        }
    }

    ctx.fillStyle = lipColor;
    ctx.fillRect(lipX, lipY, lipW, lipH);
    ctx.fillStyle = '#555';
    ctx.fillRect(lipX, lipY + 20, lipW, 10);

    drawRect(100, 50, 600, 100, '#fff', 10);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.strokeRect(100, 50, 600, 100);

    let msg = "";

    if (homeTvReaction.active) {
        msg = homeTvReaction.text;
        homeTvReaction.timer++;
        if (homeTvReaction.timer > 120) {
            transitionTo(STATE.SCENE_4_DATE);
        }
    } else if (flags.usedLipstick) {
        let dt = homeTvTimer - lipstickClickFrame;

        if (dt < 150) {
            msg = "我：入冬了，嘴唇稍微有点干...";
        } else {
            msg = "她：（拿起唇膏）别动，我帮你涂。";
            ctx.save();
            ctx.translate(300, 300);
            ctx.scale(1 + Math.sin(frameCount*0.1)*0.2, 1 + Math.sin(frameCount*0.1)*0.2);
            drawText("❤", 0, 0, 50, COLORS.primary);
            ctx.restore();
        }

        if (dt > 350) {
             transitionTo(STATE.SCENE_4_DATE);
        }
    } else {
        if (homeTvTimer < 100) {
            msg = "（不知不觉，天色渐晚，电影也快放完了...）";
        } else if (homeTvTimer > 200) {
            msg = "我应该...";
            showHomeOptions = true;
        }
    }

    drawText(msg, 130, 110, 20, homeTvReaction.active && homeTvReaction.color === 'red' ? 'red' : '#333', 'left');

    if (showHomeOptions && !flags.usedLipstick && !homeTvReaction.active) {
        const btnY = 520;
        drawButton("天色太晚了，我先回家了", 150, btnY, 240, 50, () => {
             homeTvReaction = {
                 active: true,
                 text: "她：好，那你路上小心。",
                 color: "#333",
                 timer: 0
             };
        });

        drawButton("我能在你家过夜吗？", 410, btnY, 240, 50, () => {
            homeTvReaction = {
                 active: true,
                 text: "她：滚😡！",
                 color: "red",
                 timer: 0
             };
            score -= 2;
        });
    }
}

function updateScene2() {
    if (mouse.clicked && !flags.scene2Finished && !showDinnerOptions) {
        if (isHover(500, 100, 250, 350)) {
            flags.paidSecretly = true;
            score += 2;

            ctx.fillStyle = COLORS.highlight;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(500, 100, 200, 300);
            ctx.globalAlpha = 1.0;

            drawText("已悄悄买单", 600, 200, 20, COLORS.primary);
            mouse.clicked = false;
            return;
        }
    }

    ctx.fillStyle = '#fff8dc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRect(200, 400, 400, 200, '#8b4513', 10);
    drawCircle(300, 420, 30, '#ddd');
    drawCircle(500, 420, 30, '#ddd');
    drawText("空盘", 300, 425, 12, '#aaa');

    drawBean(250, 350, false);
    drawBean(550, 350, true);

    ctx.fillStyle = '#d2b48c';
    ctx.fillRect(550, 150, 150, 100);
    drawText("收银台", 625, 200, 16, '#fff');

    if (!flags.paidSecretly && !showDinnerOptions) {
        if (frameCount % 60 < 30) {
            drawCircle(625, 140, 5, COLORS.primary);
        }
    } else if (flags.paidSecretly) {
        drawText("✔", 625, 140, 20, 'green');
    }

    drawRect(100, 50, 600, 100, '#fff', 10);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 50, 600, 100);

    billTimer++;
    let msg = "";

    if (billTimer < 60) {
        msg = "";
    } else if (billTimer < 260) {
        msg = "她：今天吃得好饱呀~ 味道真不错！";
    } else if (billTimer < 460) {
        msg = "（服务员拿着账单慢慢走过来了...）";
        let wX = 750 - (billTimer - 260);
        if (wX < 600) wX = 600;
        waiterX = wX;
        drawBean(wX, 300, false);
        drawRect(wX - 15, 320, 30, 40, '#fff', 2);
    } else {
        msg = "服务员：你好，请问这边买单吗？";
        showDinnerOptions = true;
    }

    if (msg !== "") {
        drawText(typeText(msg), 130, 110, 20, '#333', 'left');
    }

    if (showDinnerOptions) {
        if (flags.paidSecretly) {
            drawRect(100, 50, 600, 100, '#fff', 10);
            drawText("我：刚才去洗手间的时候已经结过了。", 130, 110, 20, '#333', 'left');

            if (billTimer > 600) {
                transitionTo(STATE.SCENE_3_WALK);
            }
        } else {
            drawButton("我来买吧", 200, 500, 150, 50, () => {
                score += 1;
                transitionTo(STATE.SCENE_3_WALK);
            });
            drawButton("我们要AA吗？", 450, 500, 150, 50, () => {
                score -= 1;
                transitionTo(STATE.SCENE_3_WALK);
            });
        }
    }
}

function updateScene3() {
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for(let i=0; i<10; i++) {
        let x = (frameCount * 2 + i * 100) % 800;
        let y = (frameCount * 1 + i * 50) % 600;
        drawCircle(x, y, 2, '#fff');
    }

    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 450, 800, 150);

    const centerX = 400;
    const charY = 400;

    let shake = 0;
    if (walkTimer > 100) {
        shake = Math.sin(frameCount * 0.5) * 2;
    }

    drawBean(centerX + 60 + shake, charY, true, 'normal');
    ctx.fillStyle = '#ffcccc';
    ctx.beginPath(); ctx.ellipse(centerX + 60 + shake, charY + 50, 20, 40, 0, 0, Math.PI*2); ctx.fill();

    drawBean(centerX - 60, charY, false);

    let coatColor = '#8e44ad';
    if (isHover(centerX - 90, charY, 60, 100) && !flags.gaveCoat && walkTimer > 100) {
        coatColor = '#9b59b6';
        canvas.style.cursor = 'pointer';
        if (mouse.clicked) {
            flags.gaveCoat = true;
            mouse.clicked = false;
            score += 2;
        }
    }

    if (!flags.gaveCoat) {
        ctx.fillStyle = coatColor;
        ctx.beginPath(); ctx.ellipse(centerX - 60, charY + 50, 25, 45, 0, 0, Math.PI*2); ctx.fill();
    } else {
        ctx.fillStyle = '#bdc3c7';
        ctx.beginPath(); ctx.ellipse(centerX - 60, charY + 50, 20, 40, 0, 0, Math.PI*2); ctx.fill();

        ctx.fillStyle = coatColor;
        ctx.beginPath(); ctx.ellipse(centerX + 60 + shake, charY + 55, 28, 48, 0, 0, Math.PI*2); ctx.fill();
    }

    drawRect(100, 50, 600, 100, '#fff', 10);
    walkTimer++;

    let msg = "";
    if (walkTimer < 100) {
        msg = "（走在回家的路上，风突然大了起来...）";
    } else if (walkTimer < 300) {
        msg = "她：嘶... 好冷啊...";
    } else if (!flags.gaveCoat) {
        msg = "我应该...";
    } else {
        msg = "我：（默默脱下外套披在她身上）";
    }

    drawText(typeText(msg), 130, 110, 20, '#333', 'left');

    if (walkTimer >= 300 && !flags.gaveCoat) {
        drawButton("问她：你冷吗？", 200, 500, 200, 50, () => {
            score -= 1;
            transitionTo(STATE.ENDING);
        });
        drawButton("说：坚持一下就到了", 450, 500, 200, 50, () => {
            score -= 2;
            transitionTo(STATE.ENDING);
        });
    } else if (flags.gaveCoat && walkTimer > 450) {
        transitionTo(STATE.SCENE_HOME_TV);
    }
}

function updateScene4Date() {
    dateTimer++;

    const grad = ctx.createLinearGradient(0, 0, 0, 600);
    grad.addColorStop(0, '#fdfbf7');
    grad.addColorStop(1, '#ffd1dc');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const calX = 300, calY = 100, calW = 200, calH = 240;

    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    drawRect(calX, calY, calW, calH, '#fff', 10);
    ctx.shadowBlur = 0;

    drawRect(calX, calY, calW, 60, '#e74c3c', 10);
    ctx.fillRect(calX, calY + 40, calW, 20);

    drawCircle(calX + 50, calY + 30, 8, '#333');
    drawCircle(calX + 150, calY + 30, 8, '#333');

    drawText("2023", calX + 100, calY + 40, 24, '#fff');

    drawText("11月", calX + 100, calY + 120, 40, '#333');
    drawText("26", calX + 100, calY + 200, 80, '#e74c3c', 'center', 'Arial');

    const boyX = 320, boyY = 450;
    const girlX = 480, girlY = 450;

    let slide = Math.max(0, 50 - dateTimer * 0.5);

    drawBean(boyX - slide, boyY, false);
    drawBean(girlX + slide, boyY, true);

    if (dateTimer > 100) {
        let scale = 1 + Math.sin(dateTimer * 0.05) * 0.1;
        ctx.save();
        ctx.translate(400, 380);
        ctx.scale(scale, scale);
        drawText("❤", 0, 0, 40, '#ff6b81');
        ctx.restore();

        let alpha = Math.min(1, (dateTimer - 100) / 60);
        ctx.globalAlpha = alpha;
        drawText("2023年11月26日", 400, 530, 24, '#333');
        drawText("这是一个难以忘怀的日子。", 400, 570, 18, '#666');
        ctx.globalAlpha = 1.0;
    }

    if (dateTimer > 200) {
        if (mouse.clicked) {
            mouse.clicked = false;
            transitionTo(STATE.SCENE_5_HAIR);
        }
        if (Math.floor(dateTimer / 30) % 2 === 0) {
            drawText("点击继续 >", 700, 550, 16, '#aaa');
        }
    }
}

function updateScene5Hair() {
    hairTimer++;

    ctx.fillStyle = '#fdf5e6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRect(200, 100, 150, 100, '#fff', 5);
    ctx.strokeStyle = '#d4a373'; ctx.strokeRect(200, 100, 150, 100);
    ctx.beginPath(); ctx.moveTo(220, 160); ctx.lineTo(250, 130); ctx.lineTo(280, 160); ctx.strokeStyle='#888'; ctx.stroke();

    const bedX = 100, bedY = 350, bedW = 600, bedH = 200;
    drawRect(bedX, bedY, bedW, bedH, '#e0e0e0', 20);
    drawRect(bedX, bedY + 100, bedW, 100, '#fff', 20);
    drawRect(bedX + 50, bedY - 30, 120, 60, '#fff', 10);
    drawRect(bedX + 430, bedY - 30, 120, 60, '#fff', 10);

    drawRect(50, 400, 80, 120, '#8b4513', 5);

    const phoneX = 70, phoneY = 410, phoneW = 40, phoneH = 70;
    let phoneColor = '#333';
    let phoneScreen = '#111';

    if (hairPhase === 1 && !hairDryerBought) {
        if (isHover(phoneX - 20, phoneY - 20, phoneW + 40, phoneH + 40)) {
            phoneColor = '#555';
            canvas.style.cursor = 'pointer';
            if (mouse.clicked) {
                mouse.clicked = false;
                hairDryerBought = true;
                flags.scene5Correct = true;
                score += 2;
                hairPhase = 2;
                hairTimer = 0;
            }
        }
    }

    drawRect(phoneX, phoneY, phoneW, phoneH, phoneColor, 5);
    drawRect(phoneX+2, phoneY+5, phoneW-4, phoneH-10, phoneScreen, 2);

    let boyX = 200;
    let boyY = 300;
    let girlX = 500;
    let girlY = 300;

    if (hairPhase === 1) {
        if (hairTimer < 60) {
            let progress = hairTimer / 60;
            boyX = 200 + (girlX - 100 - 200) * progress;
        } else {
            boyX = girlX - 100;
        }
    } else if (hairPhase === 2 || hairPhase === 4 || hairPhase === 5) {
        boyX = girlX - 100;
    }

    drawBean(boyX, boyY, false);

    if (hairPhase === 0) {
        drawBean(girlX, girlY, true);
        ctx.fillStyle = '#afeeee';
        ctx.beginPath(); ctx.arc(girlX, girlY - 15, 45, Math.PI, 0); ctx.fill();
        ctx.fillRect(girlX - 45, girlY - 15, 90, 20);
    } else {
        drawBean(girlX, girlY, true);
        if (hairPhase === 1 && !hairDryerBought && boyX >= girlX - 100) {
             ctx.save();
             ctx.translate(girlX - 60, girlY - 20);
             drawRect(0, 0, 40, 20, '#555');
             drawRect(40, -5, 10, 30, '#555');
             ctx.strokeStyle = '#ccc';
             ctx.beginPath();
             ctx.moveTo(40, 10); ctx.lineTo(60 + Math.random()*10, 5 + Math.random()*10);
             ctx.moveTo(40, 10); ctx.lineTo(60 + Math.random()*10, 15 + Math.random()*10);
             ctx.stroke();
             ctx.restore();
        }
    }

    drawRect(100, 50, 600, 100, '#fff', 10);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.strokeRect(100, 50, 600, 100);

    let msg = "";

    if (hairPhase === 0) {
        if (hairTimer < 60) msg = "（她刚洗完头从浴室出来...）";
        else msg = "我应该...";

        if (hairTimer > 60) {
            drawButton("宝宝你吹完头赶紧上床吧，别感冒了", 150, 500, 500, 40, () => {
                hairPhase = 3;
                hairTimer = 0;
            });
            drawButton("宝宝来，我给你吹头。", 150, 550, 500, 40, () => {
                hairPhase = 1;
                hairTimer = 0;
            });
        }
    } else if (hairPhase === 1) {
        if (hairTimer < 60) {
             msg = "（走过去帮她吹头发...）";
        } else if (hairTimer < 200) {
            msg = "（吹风机的声音嗡嗡作响...）";
        } else {
            msg = "她：我的头发好毛躁哦，不像别的那些女生...";

            if (!hairDryerBought) {
                drawButton("宝宝的头发一点也不毛躁", 200, 500, 400, 40, () => {
                    hairPhase = 4;
                    hairTimer = 0;
                });
                drawButton("别的女生的头发都比你毛躁", 200, 550, 400, 40, () => {
                    hairPhase = 5;
                    hairTimer = 0;
                });
            }
        }
    } else if (hairPhase === 2) {
        if (hairTimer < 100) {
            msg = "我：（默默拿起手机下单了最新款吹风机）";
        } else {
            msg = "我：刚才给你买了个更好的吹风机，过两天就到。";
            ctx.save();
            ctx.translate(400, 300);
            ctx.scale(1.5, 1.5);
            drawText("❤", 0, 0, 50, COLORS.primary);
            ctx.restore();

            if (hairTimer > 250) {
                transitionTo(STATE.SCENE_6_PHOTO);
            }
        }
    } else if (hairPhase === 3) {
        msg = "她：哦...😐";
        if (hairTimer > 100) transitionTo(STATE.ENDING);
    } else if (hairPhase === 4) {
        msg = "她：烦死了，毛躁不毛躁我不知道吗！";
        if (hairTimer > 100) transitionTo(STATE.ENDING);
    } else if (hairPhase === 5) {
        msg = "她：挺好的，你还给几个妹妹吹过？🤔";
        if (hairTimer > 100) transitionTo(STATE.ENDING);
    }

    drawText(msg, 130, 110, 20, '#333', 'left');
}

function updateScene6Photo() {
    photoTimer++;

    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#a8e6cf';
    ctx.beginPath(); ctx.moveTo(0, 400); ctx.lineTo(200, 200); ctx.lineTo(500, 450); ctx.lineTo(800, 250); ctx.lineTo(800, 600); ctx.lineTo(0, 600); ctx.fill();
    ctx.fillStyle = '#dcedc1';
    ctx.fillRect(0, 450, 800, 150);

    const girlX = 400, girlY = 350;
    drawBean(girlX, girlY, true, 'happy');
    ctx.strokeStyle = '#333'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(girlX - 40, girlY + 50); ctx.lineTo(girlX - 70, girlY + 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(girlX - 70, girlY + 10); ctx.lineTo(girlX - 80, girlY - 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(girlX - 70, girlY + 10); ctx.lineTo(girlX - 60, girlY - 10); ctx.stroke();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.strokeRect(100, 50, 600, 450);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    const cx = 400, cy = 275, s = 40;
    ctx.strokeRect(cx - s/2, cy - s/2, s, s);
    ctx.beginPath();
    ctx.moveTo(300, 50); ctx.lineTo(300, 500);
    ctx.moveTo(500, 50); ctx.lineTo(500, 500);
    ctx.moveTo(100, 200); ctx.lineTo(700, 200);
    ctx.moveTo(100, 350); ctx.lineTo(700, 350);
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 500, 800, 100);

    const shutterX = 400, shutterY = 550, shutterR = 35;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(shutterX, shutterY, shutterR, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(shutterX, shutterY, shutterR - 6, 0, Math.PI*2); ctx.fill();

    if (photoPhase <= 1) {
        if (isHover(shutterX - 40, shutterY - 40, 80, 80)) {
            canvas.style.cursor = 'pointer';
            if (mouse.clicked) {
                mouse.clicked = false;
                photoCount++;
                flashOpacity = 1.0;

                if (photoCount >= 3) {
                    photoPhase = 3;
                    photoTimer = 0;
                }
            }
        }
    }

    if (flashOpacity > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        flashOpacity -= 0.1;
    }

    if (photoPhase !== 2 && photoPhase !== 3) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        drawRect(100, 60, 600, 60, 'rgba(0,0,0,0.6)', 10);
    } else {
        drawRect(100, 60, 600, 80, '#fff', 10);
        ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.strokeRect(100, 60, 600, 80);
    }

    let msg = "";
    let textColor = '#fff';

    if (photoPhase === 0) {
        textColor = '#fff';
        if (photoTimer < 100) msg = "她：镜头往上一点！";
        else if (photoTimer < 200) msg = "她：要记得把我的人框在2/3的位置哦~";
        else if (photoTimer < 300) msg = "她：开实况别忘记了！";
        else if (photoTimer < 400) msg = "她：要拍到后面的景色哦~";
        else {
            msg = "她：还有那个...";
            photoPhase = 1;
        }
    } else if (photoPhase === 1) {
        msg = "她：还有光线好像不太对...";
        textColor = '#fff';

        const btnY = 350;
        drawButton("行了行了别说了，我会拍", 200, 200, 400, 50, () => {
            photoPhase = 2;
            photoTimer = 0;
            flags.failReason = 1;
        });
        drawButton("再也不想跟你出来玩了...", 200, 270, 400, 50, () => {
            photoPhase = 2;
            photoTimer = 0;
            flags.failReason = 2;
        });
    } else if (photoPhase === 2) {
        textColor = '#333';
        if (flags.failReason === 1) {
            msg = "她：对不起嘛宝宝，我担心你没拍好耽误时间...";
        } else {
            msg = "她：宝宝没事嘿嘿，这张拍完就不拍了...";
        }

        if (photoTimer > 50) {
             ctx.save();
             ctx.translate(400, 300);
             ctx.scale(2, 2);
             drawBean(0, 0, true, 'normal');
             ctx.restore();
        }

        if (photoTimer > 200) transitionTo(STATE.ENDING);

    } else if (photoPhase === 3) {
        textColor = '#333';
        if (photoTimer < 100) {
            msg = "她：（跑过来看照片）";
            ctx.save();
            ctx.translate(400, 300);
            ctx.scale(2, 2);
            drawBean(0, 0, true, 'happy');
            ctx.restore();
        } else {
            msg = "她：宝宝你拍的也太好了呜呜呜🥹 我好爱你！";
            ctx.save();
            ctx.translate(400, 200);
            ctx.scale(1.5, 1.5);
            drawText("❤", 0, 0, 50, COLORS.primary);
            ctx.restore();

            if (photoTimer > 250) {
                flags.scene6Correct = true;
                score += 2;
                // 进入护肤场景
                transitionTo(STATE.SCENE_7_SKINCARE);
            }
        }
    }

    drawText(msg, 400, 100, 20, textColor);
}

// --- 新增场景7：护肤 ---
function updateScene7Skincare() {
    skinTimer++;

    ctx.fillStyle = '#fdf5e6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bedX = 100, bedY = 350, bedW = 600, bedH = 200;
    drawRect(bedX, bedY, bedW, bedH, '#e0e0e0', 20);
    drawRect(bedX, bedY + 100, bedW, 100, '#fff', 20);
    drawRect(bedX + 50, bedY - 30, 120, 60, '#fff', 10);
    drawRect(bedX + 430, bedY - 30, 120, 60, '#fff', 10);

    drawRect(50, 400, 80, 120, '#8b4513', 5);

    const bottleX = 70, bottleY = 410, bottleW = 40, bottleH = 50;

    // 绿色瓶子交互
    if (skinPhase === 0 || skinPhase === 1) {
        if (isHover(bottleX - 20, bottleY - 20, bottleW + 40, bottleH + 40)) {
            canvas.style.cursor = 'pointer';
            if (mouse.clicked) {
                mouse.clicked = false;
                if (skinPhase === 0) {
                    skinPhase = 3; // 提前点击，失败
                    skinTimer = 0;
                } else if (skinPhase === 1) {
                    skinPhase = 2; // 正确时机，成功
                    skinTimer = 0;
                    flags.scene7Correct = true;
                    score += 2;
                }
            }
        }
    }

    ctx.fillStyle = '#2ecc71'; // 绿瓶子
    drawRect(bottleX, bottleY, bottleW, bottleH, '#2ecc71', 5);
    ctx.fillStyle = '#fff';
    ctx.fillRect(bottleX + 10, bottleY + 10, 20, 20);

    let boyX, boyY, girlX, girlY;

    if (skinPhase === 0) {
        // 她给我擦
        boyX = 300; boyY = 300;
        girlX = 400; girlY = 320;
        drawBean(boyX, boyY, false);
        drawBean(girlX, girlY, true);
        // 手臂动画
        ctx.strokeStyle = '#333'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(girlX - 40, girlY + 30); ctx.lineTo(boyX + 20, boyY); ctx.stroke();
    } else {
        // 我给她擦
        boyX = 400; boyY = 320;
        girlX = 300; girlY = 300;
        drawBean(girlX, girlY, true);
        drawBean(boyX, boyY, false);
        // 手臂动画
        ctx.strokeStyle = '#333'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(boyX - 40, boyY + 30); ctx.lineTo(girlX + 20, girlY); ctx.stroke();
    }

    drawRect(100, 50, 600, 100, '#fff', 10);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.strokeRect(100, 50, 600, 100);

    let msg = "";

    if (skinPhase === 0) {
        if (skinTimer < 60) {
            msg = "（她正在给你擦护肤霜...）";
        } else {
            msg = "我应该...";
            drawButton("别给我擦了，我不要", 200, 500, 400, 40, () => {
                skinPhase = 1; // 进入正确分支
                skinTimer = 0;
            });
            drawButton("谢谢宝宝给我擦脸脸～喜欢～", 200, 550, 400, 40, () => {
                skinPhase = 4; // 恶心分支
                skinTimer = 0;
            });
        }
    } else if (skinPhase === 1) {
        if (skinTimer < 100) {
            msg = "我：宝宝，我来给你擦，每次都是你给我擦，以后都让我给你擦。";
        } else {
            msg = "（轻轻帮她擦拭脸颊...）";
            drawButton("怎么样宝宝，这样擦着舒服吗？", 200, 500, 400, 40, () => {
                skinPhase = 5; // 技术差分支
                skinTimer = 0;
            });
            drawButton("宝宝你的皮肤好干燥", 200, 550, 400, 40, () => {
                skinPhase = 6; // 直男分支
                skinTimer = 0;
            });
        }
    } else if (skinPhase === 2) {
        // 成功拿出新护肤品
        if (skinTimer < 100) {
            msg = "我：嘿嘿宝宝，我知道你的绿宝瓶快用完了，我给你买了新的。";
        } else {
            msg = "（掏出崭新的护肤品递给她）";
            if (!newBottleShown) {
                // 绘制新瓶子
                ctx.fillStyle = '#2ecc71';
                drawRect(350, 250, 60, 80, '#2ecc71', 5);
                ctx.fillStyle = '#f1c40f'; // 蝴蝶结
                drawCircle(380, 270, 15, '#f1c40f');
            }
            if (skinTimer > 200) transitionTo(STATE.ENDING);
        }
    } else if (skinPhase === 3) {
        msg = "她：我的护肤品都用完了你也不给我买，爱与不爱真的很明显...";
        if (skinTimer > 150) transitionTo(STATE.ENDING);
    } else if (skinPhase === 4) {
        msg = "她：你好恶心🤮";
        if (skinTimer > 100) transitionTo(STATE.ENDING);
    } else if (skinPhase === 5) {
        msg = "她：还行吧，跟我的技术相比还是有差距。";
        // 显示我无语
        drawText("😐", 400, 250, 40, '#333');
        if (skinTimer > 150) transitionTo(STATE.ENDING);
    } else if (skinPhase === 6) {
        msg = "她：你还知道啊？爱与不爱真的很明显。";
        if (skinTimer > 150) transitionTo(STATE.ENDING);
    }

    drawText(msg, 130, 110, 18, '#333', 'left');
}

function updateEnding() {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawText("故事结束", 400, 150, 40, '#333');

    let title = "";
    let desc = "";
    let color = "";

    if (checkPerfectRun()) {
        title = "完美结局：这就是爱";
        desc = "爱不是说说而已，而是每一个细微处的观察与呵护。";
        color = COLORS.primary;
        drawText("❤ ❤", 400, 350, 60, COLORS.primary);
    } else {
        if (score >= 4) {
             title = "普通结局：好人卡";
             desc = "你是个好人，但可能还不够懂她。";
             color = "#f39c12";
             drawText("😐", 400, 350, 60, "#333");
        } else {
             title = "坏结局：钢铁直男";
             desc = "有些机会错过了，就真的错过了。";
             color = "#7f8c8d";
             drawText("💔", 400, 350, 60, "#7f8c8d");
        }
    }

    drawText(title, 400, 250, 30, color);
    drawText(desc, 400, 300, 18, '#555');

    drawButton("重新开始", 300, 450, 200, 50, () => {
        transitionTo(STATE.SCENE_1_CHAT, resetGame);
    });
}

function loop() {
    frameCount++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (currentState) {
        case STATE.MENU:
            updateMenu();
            break;
        case STATE.SCENE_1_CHAT:
            updateScene1();
            break;
        case STATE.SCENE_1_PHONE:
            updateScene1Phone();
            break;
        case STATE.SCENE_HOME_TV:
            updateSceneHomeTV();
            break;
        case STATE.SCENE_2_DINNER:
            updateScene2();
            break;
        case STATE.SCENE_3_WALK:
            updateScene3();
            break;
        case STATE.SCENE_4_DATE:
            updateScene4Date();
            break;
        case STATE.SCENE_5_HAIR:
            updateScene5Hair();
            break;
        case STATE.SCENE_6_PHOTO:
            updateScene6Photo();
            break;
        case STATE.SCENE_7_SKINCARE:
            updateScene7Skincare();
            break;
        case STATE.ENDING:
            updateEnding();
            break;
    }

    if (currentState === STATE.SCENE_1_CHAT && !flags.sawMoments && frameCount < 300) {
        tooltip.style.opacity = 1;
        tooltip.innerText = "试试点击一些看起来不是按钮的东西？";
    } else {
        tooltip.style.opacity = 0;
    }

    if (mouse.clicked) mouse.clicked = false;

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
