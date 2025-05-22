addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'GET') {
    return new Response(htmlContent, {
      headers: { 'content-type': 'text/html; charset=utf-8' }
    })
  }
  return new Response('Method Not Allowed', { status: 405 })
}

// 完整 HTML
const htmlContent = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TOTP Dynamic Code Generator</title>
  
    <style>
    /* 背景渐变动画 */
    @keyframes gradientBackground {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #1e3c72, #2a5298, #a8c0ff, #e0eafc);
      background-size: 400% 400%;
      animation: gradientBackground 15s ease infinite;
      min-height: 100vh;
      padding: 20px;
      color: #333;
    }
    .container {
      max-width: 480px;
      width: 100%;
      margin: 40px auto;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      color: #333;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      padding: 20px;
    }
    h1 {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
    }
    p {
      text-align: center;
      margin-bottom: 20px;
      font-size: 16px;
    }
    input {
      width: 100%;
      padding: 14px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
      margin-bottom: 20px;
      outline: none;
    }
    .options {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 10px;
    }
    .options select, .options button {
      flex: 1;
      padding: 10px;
      font-size: 14px;
      border-radius: 6px;
      border: 1px solid rgba(0,0,0,0.1);
      background: rgba(255,255,255,0.8);
    }
    input::placeholder { color: #999; }
    /* 验证码数字（闪动动画） */
    .otp {
      font-size: 48px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
      cursor: pointer;
      user-select: none;
      background: linear-gradient(90deg, #ff4b2b, #ff416c);
      -webkit-background-clip: text;
      color: transparent;
      animation: glow 1.5s ease-in-out infinite alternate;
    }
    @keyframes glow {
      from { text-shadow: 0 0 5px rgba(0,0,0,0.2); }
      to   { text-shadow: 0 0 15px rgba(0,0,0,0.5); }
    }
    /* 圆形倒计时进度条 */
    .progress-container {
      position: relative;
      width: 140px;
      height: 140px;
      margin: 0 auto 20px;
    }
    .progress-container svg {
      transform: rotate(-90deg);
    }
    .progress-bg {
      fill: none;
      stroke: rgba(255,255,255,0.6);
      stroke-width: 10;
    }
    .progress-bar {
      fill: none;
      stroke: url(#gradientStroke);
      stroke-width: 10;
      stroke-linecap: round;
      transition: stroke-dashoffset 1s linear;
    }
    .progress-text {
      font-size: 28px;
      fill: #111;
      font-weight: bold;
    }
    .message {
      text-align: center;
      color: #e74c3c;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #555;
    }
    .footer a {
      color: #555;
      text-decoration: none;
    }
    .footer a:hover { text-decoration: underline; }
    /* 响应式 */
    @media (max-width: 600px) {
      .container { padding: 15px; }
      h1 { font-size: 20px; }
      p { font-size: 14px; }
      .otp { font-size: 36px; }
      input { font-size: 14px; padding: 12px; }
      .progress-container { width: 120px; height: 120px; }
      .progress-text { font-size: 24px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 id="title">TOTP Dynamic Code Generator</h1>
    <p id="instruction">Please enter your 2FA secret code</p>

    <input id="secretInput" type="text" placeholder="Please enter your 2FA secret code" />
    <div class="options">
      <select id="algorithmSelect">
        <option value="SHA-1">SHA-1</option>
        <option value="SHA-256">SHA-256</option>
        <option value="SHA-512">SHA-512</option>
      </select>
      <select id="digitsSelect">
        <option value="6">6</option>
        <option value="8">8</option>
      </select>
      <button id="pasteSecret">Paste</button>
      <button id="clearSecret">Clear</button>
    </div>
    <div class="otp" id="otpDisplay">------</div>
    <!-- 圆形倒计时 SVG -->
    <div class="progress-container">
      <svg viewBox="0 0 140 140">
        <defs>
          <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ff4b2b" />
            <stop offset="100%" stop-color="#ff416c" />
          </linearGradient>
        </defs>
        <circle class="progress-bg" cx="70" cy="70" r="62"></circle>
        <circle class="progress-bar" id="progressCircle" cx="70" cy="70" r="62"
                stroke-dasharray="389.557" stroke-dashoffset="389.557"></circle>
        <text x="70" y="78" text-anchor="middle" class="progress-text"
              transform="rotate(90,70,70)" id="progressText">--</text>
      </svg>
    </div>

    <div class="message" id="message"></div>
    <div class="footer">
      Powered by <a href="https://www.chatgpt.org.uk" target="_blank">https://www.chatgpt.org.uk</a>
    </div>
  </div>

  <script>
    // ============== 中英双语文本 ==============
    const texts = {
      zh: {
        title: "TOTP 动态验证码生成器",
        instruction: "请输入你的 2FA 设置代码",
        timeLeft: "剩余",
        seconds: "秒",
        error: "错误: ",
        copied: "已复制验证码到剪贴板"
      },
      en: {
        title: "TOTP Dynamic Code Generator",
        instruction: "Please enter your 2FA secret code",
        timeLeft: "Time left",
        seconds: "s",
        error: "Error: ",
        copied: "Copied to clipboard"
      }
    };
    const lang = (navigator.language || "en").toLowerCase();
    const currentLang = lang.startsWith('zh') ? 'zh' : 'en';
    document.getElementById('title').textContent = texts[currentLang].title;
    document.getElementById('instruction').textContent = texts[currentLang].instruction;
    document.getElementById('secretInput').placeholder = texts[currentLang].instruction;

    // ============== TOTP参数 ==============
    const timeStep = 30;
    let algorithm = localStorage.getItem('totpAlgorithm') || 'SHA-1';
    let digits = parseInt(localStorage.getItem('totpDigits')) || 6;
    let currentSecret = '';

    // DOM 引用
    const secretInput    = document.getElementById('secretInput');
    const algorithmSelect= document.getElementById('algorithmSelect');
    const digitsSelect   = document.getElementById('digitsSelect');
    const pasteBtn       = document.getElementById('pasteSecret');
    const clearBtn       = document.getElementById('clearSecret');
    const otpDisplay     = document.getElementById('otpDisplay');
    const messageDiv     = document.getElementById('message');
    const progressCircle = document.getElementById('progressCircle');
    const progressText   = document.getElementById('progressText');
    const circumference  = 2 * Math.PI * 62; // 半径62 => 周长≈389.557

    // 初始化表单值
    algorithmSelect.value = algorithm;
    digitsSelect.value = digits;
    const urlSecret = new URLSearchParams(location.search).get('secret');
    const savedSecret = localStorage.getItem('totpSecret');
    if (urlSecret) {
      secretInput.value = urlSecret;
      currentSecret = urlSecret.replace(/ /g, '').toUpperCase();
      localStorage.setItem('totpSecret', urlSecret);
    } else if (savedSecret) {
      secretInput.value = savedSecret;
      currentSecret = savedSecret.replace(/ /g, '').toUpperCase();
    }


    // ============== 1) 监听 input 事件（键盘输入） ==============
    secretInput.addEventListener('input', (e) => {
      const originalVal = e.target.value;                 // 用户原始输入
      const processedVal = originalVal.replace(/ /g, '').toUpperCase();
      currentSecret = processedVal;
      localStorage.setItem('totpSecret', originalVal);
      messageDiv.textContent = "";
    });

    algorithmSelect.addEventListener('change', (e) => {
      algorithm = e.target.value;
      localStorage.setItem('totpAlgorithm', algorithm);
    });

    digitsSelect.addEventListener('change', (e) => {
      digits = parseInt(e.target.value);
      localStorage.setItem('totpDigits', digits);
    });

    pasteBtn.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        secretInput.value = text;
        currentSecret = text.replace(/ /g, '').toUpperCase();
        localStorage.setItem('totpSecret', text);
      } catch (err) {
        messageDiv.textContent = texts[currentLang].error + err.message;
      }
    });

    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('totpSecret');
      secretInput.value = '';
      currentSecret = '';
      otpDisplay.textContent = '------';
    });
    
    

    // ============== 2) 点击验证码自动复制 ==============
    otpDisplay.addEventListener('click', () => {
      const text = otpDisplay.textContent.trim();
      if (text && text !== "------") {
        navigator.clipboard.writeText(text).then(() => {
          messageDiv.textContent = texts[currentLang].copied;
          setTimeout(() => { messageDiv.textContent = ""; }, 2000);
        }).catch(err => {
          messageDiv.textContent = texts[currentLang].error + err.message;
        });
      }
    });

    // ============== 3) 每秒更新验证码及倒计时 ==============
    setInterval(updateDisplay, 1000);

    async function updateDisplay() {
      updateCountdown();
      if (!currentSecret) {
        otpDisplay.textContent = "------";
        return;
      }
      try {
        const otp = await generateTOTP(currentSecret, { algorithm, digits });
        otpDisplay.textContent = otp;
      } catch (err) {
        otpDisplay.textContent = "------";
        messageDiv.textContent = texts[currentLang].error + err.message;
      }
    }

    // ============== 4) 圆形倒计时动画 ==============
    function updateCountdown() {
      const epoch = Math.floor(Date.now() / 1000);
      const remaining = timeStep - (epoch % timeStep);
      progressText.textContent = remaining;
      const offset = (remaining / timeStep) * circumference;
      progressCircle.style.strokeDasharray = circumference;
      progressCircle.style.strokeDashoffset = offset;
    }

    // ============== 5) 生成 TOTP ==============
    async function generateTOTP(secret, options = {}) {
      const algorithm = options.algorithm || "SHA-1";
      const digitsLocal = options.digits || 6;
      const keyBytes = base32ToUint8Array(secret);
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "HMAC", hash: { name: algorithm } },
        false,
        ["sign"]
      );
      const epoch = Math.floor(Date.now() / 1000);
      const counter = Math.floor(epoch / timeStep);
      const counterBytes = new Uint8Array(8);
      let temp = counter;
      for (let i = 7; i >= 0; i--) {
        counterBytes[i] = temp & 0xff;
        temp >>= 8;
      }
      const hmacBuffer = await crypto.subtle.sign("HMAC", cryptoKey, counterBytes);
      const hmac = new Uint8Array(hmacBuffer);
      const offset = hmac[hmac.length - 1] & 0x0f;
      const binary =
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8)  |
        (hmac[offset + 3] & 0xff);
      const otpValue = binary % (10 ** digitsLocal);
      return otpValue.toString().padStart(digitsLocal, "0");
    }

    // ============== 6) Base32 解码 ==============
    function base32ToUint8Array(base32) {
      base32 = base32.replace(/=+$/, "").toUpperCase();
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      let bits = "";
      for (const char of base32) {
        const val = alphabet.indexOf(char);
        if (val === -1) {
          throw new Error("Invalid Base32 char: " + char);
        }
        bits += val.toString(2).padStart(5, "0");
      }
      const bytes = [];
      for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.substring(i, i + 8), 2));
      }
      return new Uint8Array(bytes);
    }
  </script>
</body>
</html>
`;
