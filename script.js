// ============================================
// 1. Particles
// ============================================
(function() {
    console.log('[粒子系统] 初始化粒子动画...');
    
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let w, h;
    const particles = [];
    const COUNT = 70;

    console.log(`[粒子系统] 准备创建 ${COUNT} 个粒子`);

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        console.log(`[粒子系统] Canvas 尺寸调整: ${w}x${h}`);
    }
    window.addEventListener('resize', () => {
        console.log('[粒子系统] 窗口大小改变，重新调整 Canvas');
        resize();
        for (const p of particles) {
            p.x = Math.random() * w;
            p.y = Math.random() * h;
        }
        console.log('[粒子系统] 粒子位置已重置');
    });
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

    for (let i = 0; i < COUNT; i++) {
        particles.push(new Particle());
    }
    console.log(`[粒子系统] ${COUNT} 个粒子创建完成`);

    function drawLines() {
        let linesDrawn = 0;
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
                    linesDrawn++;
                }
            }
        }
        return linesDrawn;
    }

    let frameCount = 0;
    function animate() {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
            p.update();
            p.draw();
        }
        const linesCount = drawLines();
        
        // 每 60 帧输出一次性能日志（约每秒一次）
        frameCount++;
        if (frameCount % 60 === 0) {
            console.log(`[粒子系统] 性能数据 - 帧数: ${frameCount}, 连线数: ${linesCount}, 粒子数: ${particles.length}`);
        }
        
        requestAnimationFrame(animate);
    }
    animate();
    console.log('[粒子系统] 动画循环已启动 ✅');

    console.log('[粒子系统] 初始化完成 ✅');
})();

// ============================================
// 2. Navigation
// ============================================
console.log('[导航系统] 初始化导航组件...');

const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const overlay = document.getElementById('mobileOverlay');
const navAnchors = document.querySelectorAll('[data-nav]');

console.log('[导航系统] DOM 元素检查:', {
    nav: !!nav,
    navToggle: !!navToggle,
    navLinks: !!navLinks,
    overlay: !!overlay,
    navAnchors: navAnchors.length
});

let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const isScrolled = window.scrollY > 20;
        nav.classList.toggle('scrolled', isScrolled);
        if (isScrolled) {
            console.log('[导航系统] 页面滚动超过 20px，添加阴影效果');
        } else {
            console.log('[导航系统] 页面回到顶部，移除阴影效果');
        }
    }, 50);
});

function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', isOpen);
    navToggle.classList.toggle('active', isOpen);
    overlay.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    console.log(`[导航系统] 移动菜单 ${isOpen ? '打开' : '关闭'}`);
}

navToggle.addEventListener('click', () => {
    console.log('[导航系统] 用户点击汉堡菜单按钮');
    toggleMenu();
});

overlay.addEventListener('click', () => {
    console.log('[导航系统] 用户点击遮罩层，关闭菜单');
    toggleMenu(false);
});

navAnchors.forEach(a => {
    a.addEventListener('click', () => {
        const linkText = a.textContent.trim();
        console.log(`[导航系统] 用户点击导航链接: "${linkText}"`);
        
        if (navLinks.classList.contains('open')) {
            console.log('[导航系统] 移动端菜单已关闭');
            toggleMenu(false);
        }
        
        navAnchors.forEach(el => el.classList.remove('active'));
        a.classList.add('active');
        console.log(`[导航系统] 导航项 "${linkText}" 已激活`);
    });
});

console.log('[导航系统] 导航组件初始化完成 ✅');

// ============================================
// 3. Reveal on Scroll (Intersection Observer)
// ============================================
console.log('[滚动动画] 初始化滚动显示动画...');

const revealEls = document.querySelectorAll('.reveal');
console.log(`[滚动动画] 找到 ${revealEls.length} 个需要动画的元素`);

const observer = new IntersectionObserver((entries) => {
    let visibleCount = 0;
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            visibleCount++;
            const index = Array.from(revealEls).indexOf(entry.target);
            console.log(`[滚动动画] 元素 #${index + 1} 进入视口，触发显示动画`);
        }
    }
    if (visibleCount > 0) {
        console.log(`[滚动动画] 本次有 ${visibleCount} 个元素显示`);
    }
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, index) => {
    observer.observe(el);
    console.log(`[滚动动画] 已监听元素 #${index + 1}`);
});

console.log('[滚动动画] 滚动显示动画初始化完成 ✅');

// ============================================
// 4. Copy IP
// ============================================
console.log('[IP复制] 初始化 IP 复制功能...');

const heroIpBox = document.getElementById('heroIpBox');
const heroIpCopied = document.getElementById('heroIpCopied');
const joinCopyBtn = document.getElementById('joinCopyBtn');

console.log('[IP复制] DOM 元素检查:', {
    heroIpBox: !!heroIpBox,
    heroIpCopied: !!heroIpCopied,
    joinCopyBtn: !!joinCopyBtn
});

function copyIp() {
    const ip = 'mc.stalir.cn';
    console.log(`[IP复制] 尝试复制 IP: "${ip}"`);
    
    if (navigator.clipboard) {
        console.log('[IP复制] 使用 Clipboard API');
        navigator.clipboard.writeText(ip)
            .then(() => {
                console.log('[IP复制] IP 复制成功 (Clipboard API) ✅');
            })
            .catch((err) => {
                console.warn('[IP复制] Clipboard API 失败，使用降级方案', err);
                fallbackCopy(ip);
            });
    } else {
        console.log('[IP复制] Clipboard API 不可用，使用降级方案');
        fallbackCopy(ip);
    }
    
    heroIpCopied.classList.add('show');
    console.log('[IP复制] 显示 "已复制" 提示');
    
    setTimeout(() => {
        heroIpCopied.classList.remove('show');
        console.log('[IP复制] 隐藏 "已复制" 提示');
    }, 2200);
}

function fallbackCopy(text) {
    console.log('[IP复制] 使用降级方案 (textarea)');
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    
    try {
        document.execCommand('copy');
        console.log('[IP复制] IP 复制成功 (降级方案) ✅');
    } catch (err) {
        console.error('[IP复制] 降级方案复制失败', err);
    }
    
    document.body.removeChild(ta);
}

heroIpBox.addEventListener('click', () => {
    console.log('[IP复制] 用户点击 IP 显示区域');
    copyIp();
});

if (joinCopyBtn) {
    joinCopyBtn.addEventListener('click', () => {
        console.log('[IP复制] 用户点击加入区域的复制按钮');
        copyIp();
    });
}

console.log('[IP复制] IP 复制功能初始化完成 ✅');

// ============================================
// 5. Server Status (mcapi.us with fallback)
// ============================================
console.log('[服务器状态] 初始化服务器状态检测器...');

const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const badge = document.getElementById('serverStatus');

const STATUS = {
    CHECKING: { text: '检测中...', cls: '', dot: 'spin' },
    ONLINE: { text: '服务器在线', cls: 'online', dot: 'icon-check' },
    OFFLINE: { text: '服务器离线', cls: 'offline', dot: 'icon-x' },
    ERROR: { text: '状态获取失败', cls: 'api-error', dot: 'icon-x' }
};

console.log('[服务器状态] DOM 元素检查:', {
    statusDot: !!statusDot,
    statusText: !!statusText,
    badge: !!badge
});

function setStatus(state) {
    console.log(`[服务器状态] 设置状态为: ${state}`);
    const s = STATUS[state] || STATUS.ERROR;
    
    console.log('[服务器状态] 状态配置:', {
        state,
        text: s.text,
        cls: s.cls,
        dot: s.dot
    });
    
    badge.className = 'hero-badge ' + s.cls;
    statusText.textContent = s.text;
    statusDot.className = 'hero-badge-dot';
    
    if (s.dot === 'spin') {
        statusDot.classList.add('spin');
        console.log('[服务器状态] 添加旋转动画');
    } else if (s.dot === 'icon-check') {
        statusDot.classList.add('icon-check');
        console.log('[服务器状态] 添加对勾图标');
    } else if (s.dot === 'icon-x') {
        statusDot.classList.add('icon-x');
        console.log('[服务器状态] 添加叉号图标');
    }
    
    if (state === 'ONLINE') {
        statusDot.classList.add('pulse');
        console.log('[服务器状态] 添加脉冲动画 (在线状态)');
    }
    
    console.log(`[服务器状态] 状态更新完成: "${s.text}"`);
}

async function fetchFromMcApi() {
    console.log('[服务器状态] [主 API] 开始获取服务器状态 (mcapi.us)...');
    const startTime = Date.now();
    
    try {
        const apiUrl = 'https://mcapi.us/server/status?ip=mc.stalir.cn&port=25565';
        console.log(`[服务器状态] [主 API] 发起请求: ${apiUrl}`);
        const resp = await fetch(apiUrl);
        
        console.log('[服务器状态] [主 API] 响应已接收:', {
            status: resp.status,
            statusText: resp.statusText,
            ok: resp.ok,
            耗时: `${Date.now() - startTime}ms`
        });
        
        if (!resp.ok) {
            console.warn(`[服务器状态] [主 API] 返回错误状态码: ${resp.status}`);
            throw new Error(`API 错误: ${resp.status} ${resp.statusText}`);
        }
        
        const data = await resp.json();
        
        // 获取时间戳
        const lastUpdated = data.last_updated ? parseInt(data.last_updated) : null;
        const timestamp = lastUpdated || Math.floor(Date.now() / 1000);
        
        console.log('[服务器状态] [主 API] 响应数据:', {
            在线状态: data.online,
            玩家数: data.players,
            MOTD: data.motd?.clean || data.motd?.raw,
            版本: data.version,
            最后更新时间: lastUpdated ? new Date(lastUpdated * 1000).toLocaleString('zh-CN') : '未知',
            时间戳: new Date().toISOString()
        });
        
        return { 
            online: data.online, 
            source: 'mcapi.us',
            timestamp: timestamp,
            raw: data
        };
        
    } catch (error) {
        console.error('[服务器状态] [主 API] 获取失败:', {
            错误信息: error.message,
            耗时: `${Date.now() - startTime}ms`
        });
        throw error;
    }
}

async function fetchFromMcSrvStat() {
    console.log('[服务器状态] [备用 API] 开始获取服务器状态 (mcsrvstat.us)...');
    const startTime = Date.now();
    
    try {
        const apiUrl = 'https://api.mcsrvstat.us/3/mc.stalir.cn';
        console.log(`[服务器状态] [备用 API] 发起请求: ${apiUrl}`);
        const resp = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'StalirServerStatus/1.0'
            }
        });
        
        console.log('[服务器状态] [备用 API] 响应已接收:', {
            status: resp.status,
            statusText: resp.statusText,
            ok: resp.ok,
            耗时: `${Date.now() - startTime}ms`
        });
        
        if (!resp.ok) {
            console.warn(`[服务器状态] [备用 API] 返回错误状态码: ${resp.status}`);
            throw new Error(`备用 API 错误: ${resp.status} ${resp.statusText}`);
        }
        
        const data = await resp.json();
        
        // 获取缓存时间戳
        const cacheTime = data.debug?.cachetime ? parseInt(data.debug.cachetime) : null;
        const timestamp = cacheTime || Math.floor(Date.now() / 1000);
        
        console.log('[服务器状态] [备用 API] 响应数据:', {
            在线状态: data.online,
            玩家数: data.players ? `${data.players.online}/${data.players.max}` : '未知',
            MOTD: data.motd?.clean?.[0] || data.motd?.raw?.[0] || '未知',
            版本: data.version || '未知',
            软件: data.software || '未知',
            插件数: data.plugins ? data.plugins.length : '未知',
            缓存时间: cacheTime ? new Date(cacheTime * 1000).toLocaleString('zh-CN') : '未知',
            时间戳: new Date().toISOString()
        });
        
        return { 
            online: data.online, 
            source: 'mcsrvstat.us',
            timestamp: timestamp,
            raw: data
        };
        
    } catch (error) {
        console.error('[服务器状态] [备用 API] 获取失败:', {
            错误信息: error.message,
            耗时: `${Date.now() - startTime}ms`
        });
        throw error;
    }
}

function determineServerStatus(primaryResult, fallbackResult) {
    console.log('[服务器状态] 开始综合判断服务器状态...');
    
    // 检查 API 是否返回了有效数据
    const hasPrimary = primaryResult !== null && primaryResult !== undefined;
    const hasFallback = fallbackResult !== null && fallbackResult !== undefined;
    
    console.log('[服务器状态] 数据可用性:', {
        主API: hasPrimary ? '可用' : '不可用',
        备用API: hasFallback ? '可用' : '不可用'
    });
    
    // 情况1: 两个 API 都不可用
    if (!hasPrimary && !hasFallback) {
        console.log('[服务器状态] 所有 API 均不可用 ❌');
        return { status: 'ERROR', reason: '所有 API 不可用' };
    }
    
    // 情况2: 只有主 API 可用
    if (hasPrimary && !hasFallback) {
        console.log('[服务器状态] 只有主 API 可用，使用主 API 结果');
        const status = primaryResult.online ? 'ONLINE' : 'OFFLINE';
        return { 
            status: status, 
            reason: `主 API: ${primaryResult.online ? '在线' : '离线'}`,
            source: 'mcapi.us',
            timestamp: primaryResult.timestamp
        };
    }
    
    // 情况3: 只有备用 API 可用
    if (!hasPrimary && hasFallback) {
        console.log('[服务器状态] 只有备用 API 可用，使用备用 API 结果');
        const status = fallbackResult.online ? 'ONLINE' : 'OFFLINE';
        return { 
            status: status, 
            reason: `备用 API: ${fallbackResult.online ? '在线' : '离线'}`,
            source: 'mcsrvstat.us',
            timestamp: fallbackResult.timestamp
        };
    }
    
    // 情况4: 两个 API 都可用，比较时间戳
    console.log('[服务器状态] 两个 API 都可用，比较时间戳...');
    
    const primaryTime = primaryResult.timestamp;
    const fallbackTime = fallbackResult.timestamp;
    const currentTime = Math.floor(Date.now() / 1000);
    
    // 计算时间差（秒）
    const primaryAge = currentTime - primaryTime;
    const fallbackAge = currentTime - fallbackTime;
    
    console.log('[服务器状态] 时间戳比较:', {
        主API时间: new Date(primaryTime * 1000).toLocaleString('zh-CN'),
        主API年龄: `${primaryAge}秒 (${(primaryAge / 60).toFixed(1)}分钟)`,
        备用API时间: new Date(fallbackTime * 1000).toLocaleString('zh-CN'),
        备用API年龄: `${fallbackAge}秒 (${(fallbackAge / 60).toFixed(1)}分钟)`,
        时间差: `${Math.abs(primaryAge - fallbackAge)}秒`
    });
    
    // 选择时间戳更近的数据（数值更大表示更近）
    let selectedResult;
    let selectedSource;
    let selectedTime;
    
    if (primaryTime >= fallbackTime) {
        selectedResult = primaryResult;
        selectedSource = '主 API (mcapi.us)';
        selectedTime = primaryTime;
        console.log('[服务器状态] 选择主 API 数据 (时间戳更新)');
    } else {
        selectedResult = fallbackResult;
        selectedSource = '备用 API (mcsrvstat.us)';
        selectedTime = fallbackTime;
        console.log('[服务器状态] 选择备用 API 数据 (时间戳更新)');
    }
    
    const status = selectedResult.online ? 'ONLINE' : 'OFFLINE';
    console.log(`[服务器状态] 使用 ${selectedSource} 数据: ${selectedResult.online ? '在线 ✓' : '离线 ✗'}`);
    
    // 额外检查：如果两个 API 状态不一致，记录警告
    if (primaryResult.online !== fallbackResult.online) {
        console.warn('[服务器状态] ⚠️ 两个 API 返回的状态不一致:', {
            主API: primaryResult.online ? '在线' : '离线',
            备用API: fallbackResult.online ? '在线' : '离线',
            使用数据: selectedSource
        });
    }
    
    return { 
        status: status, 
        reason: `使用 ${selectedSource} 数据 (时间戳: ${new Date(selectedTime * 1000).toLocaleString('zh-CN')})`,
        source: selectedSource,
        timestamp: selectedTime,
        primaryOnline: primaryResult.online,
        fallbackOnline: fallbackResult.online
    };
}

async function fetchStatus() {
    console.log('[服务器状态] 开始获取服务器状态 (双 API 验证)...');
    const overallStart = Date.now();
    
    let primaryResult = null;
    let fallbackResult = null;
    
    // 并行请求两个 API
    console.log('[服务器状态] 并行请求主 API 和备用 API...');
    const fetchPromises = [
        fetchFromMcApi().then(result => {
            primaryResult = result;
            console.log('[服务器状态] 主 API 请求完成 ✅');
        }).catch(error => {
            console.warn('[服务器状态] 主 API 请求失败 ❌:', error.message);
        }),
        fetchFromMcSrvStat().then(result => {
            fallbackResult = result;
            console.log('[服务器状态] 备用 API 请求完成 ✅');
        }).catch(error => {
            console.warn('[服务器状态] 备用 API 请求失败 ❌:', error.message);
        })
    ];
    
    // 等待两个请求完成（或失败）
    await Promise.allSettled(fetchPromises);
    console.log('[服务器状态] 两个 API 请求均已完成');
    
    // 综合判断服务器状态
    const decision = determineServerStatus(primaryResult, fallbackResult);
    console.log('[服务器状态] 判断结果:', {
        最终状态: decision.status,
        数据来源: decision.source || '未知',
        状态原因: decision.reason,
        总耗时: `${Date.now() - overallStart}ms`
    });
    
    if (decision.primaryOnline !== undefined && decision.fallbackOnline !== undefined) {
        console.log('[服务器状态] 状态一致性:', {
            主API: decision.primaryOnline ? '在线' : '离线',
            备用API: decision.fallbackOnline ? '在线' : '离线',
            是否一致: decision.primaryOnline === decision.fallbackOnline ? '是' : '否 ⚠️'
        });
    }
    
    setStatus(decision.status);
    console.log(`[服务器状态] 最终状态: ${decision.status === 'ONLINE' ? '✅ 在线' : '❌ 离线/错误'}`);
    console.log(`[服务器状态] 总耗时: ${Date.now() - overallStart}ms`);
}

console.log('[服务器状态] 开始初始状态检测...');
setStatus('CHECKING');

setTimeout(() => {
    console.log('[服务器状态] 初始延迟 (400ms) 结束，开始获取状态...');
    fetchStatus();
}, 400);

badge.addEventListener('click', () => {
    console.log('[服务器状态] 用户点击状态徽章，手动刷新');
    setStatus('CHECKING');
    fetchStatus();
});

console.log('[服务器状态] 状态检测器初始化完成 ✅');

// ============================================
// 6. Plugin Card 鼠标跟随光效
// ============================================
console.log('[卡片特效] 初始化插件卡片鼠标跟随光效...');

const pluginCards = document.querySelectorAll('.plugin-card');
console.log(`[卡片特效] 找到 ${pluginCards.length} 个插件卡片`);

pluginCards.forEach((card, index) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
    });
    
    card.addEventListener('mouseenter', () => {
        console.log(`[卡片特效] 鼠标进入卡片 #${index + 1}`);
    });
    
    card.addEventListener('mouseleave', () => {
        console.log(`[卡片特效] 鼠标离开卡片 #${index + 1}`);
    });
});

console.log('[卡片特效] 插件卡片光效初始化完成 ✅');

// ============================================
// 7. 页面加载完成
// ============================================
console.log('✨ Stalir — 公益群组生存服');
console.log('=' .repeat(50));
console.log('[系统] 所有组件初始化完成 ✅');
console.log('[系统] 页面加载时间:', `${performance.now().toFixed(0)}ms`);
console.log('[系统] 当前时间:', new Date().toLocaleString('zh-CN'));
console.log('=' .repeat(50));

// 页面完全加载后的性能报告
window.addEventListener('load', () => {
    console.log('[性能] 页面完全加载完成');
    console.log('[性能] 总加载时间:', `${performance.now().toFixed(0)}ms`);
    
    // 输出内存使用情况（如果浏览器支持）
    if (performance.memory) {
        console.log('[性能] 内存使用:', {
            已用: `${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
            总量: `${(performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
            限制: `${(performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
        });
    }
});

console.log('[系统] 脚本执行完成 🚀');
