// ============================================
// 1. Particles
// ============================================
(function() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let w, h;
    const particles = [];
    const COUNT = 70;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > w) this.speedX *= -1;
            if (this.y < 0 || this.y > h) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 160, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(180, 160, 255, ${0.08 * (1 - dist / 140)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
            p.update();
            p.draw();
        }
        drawLines();
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        for (const p of particles) {
            p.x = Math.random() * w;
            p.y = Math.random() * h;
        }
    });
})();

// ============================================
// 2. Navigation
// ============================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const overlay = document.getElementById('mobileOverlay');
const navAnchors = document.querySelectorAll('[data-nav]');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
});

function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', isOpen);
    navToggle.classList.toggle('active', isOpen);
    overlay.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}
navToggle.addEventListener('click', () => toggleMenu());
overlay.addEventListener('click', () => toggleMenu(false));

navAnchors.forEach(a => {
    a.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) toggleMenu(false);
        navAnchors.forEach(el => el.classList.remove('active'));
        a.classList.add('active');
    });
});

// ============================================
// 3. Reveal on Scroll (Intersection Observer)
// ============================================
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    }
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

// ============================================
// 4. Copy IP
// ============================================
const heroIpBox = document.getElementById('heroIpBox');
const heroIpCopied = document.getElementById('heroIpCopied');
const joinCopyBtn = document.getElementById('joinCopyBtn');

function copyIp() {
    const ip = 'mc.stalir.cn';
    if (navigator.clipboard) {
        navigator.clipboard.writeText(ip).catch(() => fallbackCopy(ip));
    } else {
        fallbackCopy(ip);
    }
    heroIpCopied.classList.add('show');
    setTimeout(() => heroIpCopied.classList.remove('show'), 2200);
}

function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
}

heroIpBox.addEventListener('click', copyIp);
if (joinCopyBtn) joinCopyBtn.addEventListener('click', copyIp);

// ============================================
// 5. Server Status (mcapi.us)
// ============================================
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const badge = document.getElementById('serverStatus');

const STATUS = {
    CHECKING: { text: '检测中...', cls: '', dot: 'spin' },
    ONLINE: { text: '服务器在线', cls: 'online', dot: 'icon-check' },
    OFFLINE: { text: '服务器离线', cls: 'offline', dot: 'icon-x' },
    ERROR: { text: '状态获取失败', cls: 'api-error', dot: 'icon-x' }
};

function setStatus(state) {
    const s = STATUS[state] || STATUS.ERROR;
    badge.className = 'hero-badge ' + s.cls;
    statusText.textContent = s.text;
    statusDot.className = 'hero-badge-dot';
    if (s.dot === 'spin') statusDot.classList.add('spin');
    else if (s.dot === 'icon-check') statusDot.classList.add('icon-check');
    else if (s.dot === 'icon-x') statusDot.classList.add('icon-x');
    if (state === 'ONLINE') statusDot.classList.add('pulse');
}

async function fetchStatus() {
    try {
        const resp = await fetch('https://mcapi.us/server/status?ip=mc.stalir.cn&port=25565');
        if (!resp.ok) throw new Error('API error');
        const data = await resp.json();
        if (data.online) {
            setStatus('ONLINE');
        } else {
            setStatus('OFFLINE');
        }
    } catch (_) {
        setStatus('ERROR');
    }
}

setStatus('CHECKING');
setTimeout(fetchStatus, 400);

badge.addEventListener('click', () => {
    setStatus('CHECKING');
    fetchStatus();
});

// ============================================
// 6. Plugin Card 鼠标跟随光效
// ============================================
document.querySelectorAll('.plugin-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
    });
});

console.log('✨ Stalir — 公益群组生存服');