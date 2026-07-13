(function() {
    // ============================================
    //  Canvas Particle System (blue-purple theme)
    // ============================================
    var canvas = document.getElementById('particles');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var animId;

    var PARTICLE_COUNT = 130;
    var COLORS = [
        'rgba(129, 140, 248, 0.45)',
        'rgba(139, 92, 246, 0.35)',
        'rgba(168, 177, 255, 0.28)',
        'rgba(200, 171, 250, 0.22)',
        'rgba(99, 102, 241, 0.3)',
        'rgba(148, 163, 184, 0.12)',
    ];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 60,
            size: Math.random() * 4 + 2,
            speedY: -(Math.random() * 0.55 + 0.18),
            speedX: (Math.random() - 0.5) * 0.25,
            opacity: Math.random() * 0.55 + 0.18,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: (Math.random() - 0.5) * 0.018,
        };
    }

    function initParticles() {
        particles = [];
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            var p = createParticle();
            p.y = Math.random() * canvas.height;
            particles.push(p);
        }
    }

    function updateParticles() {
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.wobble) * 0.12;
            p.wobble += p.wobbleSpeed;

            if (p.y < -10) {
                p.y = canvas.height + Math.random() * 40;
                p.x = Math.random() * canvas.width;
            }
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    }

    function animate() {
        updateParticles();
        drawParticles();
        animId = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    window.addEventListener('resize', function() {
        resize();
        initParticles();
    });

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            animate();
        }
    });

    // ============================================
    //  Navigation
    // ============================================
    var nav = document.getElementById('nav');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    var mobileOverlay = document.getElementById('mobileOverlay');
    var navAnchors = document.querySelectorAll('[data-nav]');

    function closeMenu() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        mobileOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openMenu() {
        navToggle.classList.add('active');
        navLinks.classList.add('open');
        mobileOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    navToggle.addEventListener('click', function() {
        navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });

    mobileOverlay.addEventListener('click', closeMenu);

    navAnchors.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMenu();
            navAnchors.forEach(function(l) { l.classList.remove('active'); });
            link.classList.add('active');
        });
    });

    var sections = [];
    navAnchors.forEach(function(a) {
        var id = a.getAttribute('href').substring(1);
        var el = document.getElementById(id);
        if (el) sections.push({ el: el, a: a });
    });

    function onScroll() {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        var scrollPos = window.scrollY + 140;
        var current = sections[0];
        for (var i = 0; i < sections.length; i++) {
            if (sections[i].el.offsetTop <= scrollPos) current = sections[i];
        }
        navAnchors.forEach(function(l) { l.classList.remove('active'); });
        if (current) current.a.classList.add('active');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ============================================
    //  IP Copy
    // ============================================
    var SERVER_IP = 'mc.stalir.cn';

    function copyIP(feedbackEl) {
        function doCopy(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(text);
            }
            return new Promise(function(resolve, reject) {
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                try {
                    document.execCommand('copy');
                    resolve();
                } catch (e) {
                    reject(e);
                }
                document.body.removeChild(ta);
            });
        }

        doCopy(SERVER_IP).then(function() {
            if (feedbackEl) {
                feedbackEl.classList.add('show');
                clearTimeout(feedbackEl._t);
                feedbackEl._t = setTimeout(function() { feedbackEl.classList.remove('show'); }, 1800);
            }
        }).catch(function() {});
    }

    document.getElementById('heroIpBox').addEventListener('click', function() {
        copyIP(document.getElementById('heroIpCopied'));
    });

    document.getElementById('joinCopyBtn').addEventListener('click', function(e) {
        e.preventDefault();
        copyIP(null);
        var btn = document.getElementById('joinCopyBtn');
        var orig = btn.textContent;
        btn.textContent = '已复制';
        setTimeout(function() { btn.textContent = orig; }, 1800);
    });

    // ============================================
    //  Scroll Reveal
    // ============================================
    var revealEls = document.querySelectorAll('.reveal');
    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(function(el) { revealObserver.observe(el); });

    // ============================================
    //  Server Status Check
    // ============================================
    var statusBadge = document.getElementById('serverStatus');
    var statusDot = document.getElementById('statusDot');
    var statusText = document.getElementById('statusText');

    var STATUS_URL = 'https://api.mcsrvstat.us/3/mc.stalir.cn';
    var retryTimer = null;

    function clearStatus() {
        statusBadge.classList.remove('online', 'offline', 'api-error');
        statusDot.classList.remove('icon-check', 'icon-x', 'spin');
    }

    function setServerOnline() {
        clearStatus();
        statusBadge.classList.add('online');
        statusDot.classList.add('icon-check');
        statusText.textContent = '服务器运行中';
    }

    function setServerOffline() {
        clearStatus();
        statusBadge.classList.add('offline');
        statusDot.classList.add('icon-x');
        statusText.textContent = '服务器已离线';
    }

    function setServerApiError() {
        clearStatus();
        statusBadge.classList.add('api-error');
        statusDot.classList.add('icon-x');
        statusText.textContent = 'API 无法连接';
    }

    function parseServerStatus(text) {
        try {
            var data = JSON.parse(text);
            if (data.online) {
                setServerOnline();
            } else if (data.debug && data.debug.error && data.debug.error.ping && data.debug.error.ping.indexOf('Unknown problem') !== -1) {
                setServerApiError();
            } else {
                setServerOffline();
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    function checkServer(allowRetry) {
        // Reset to checking state
        clearStatus();
        statusDot.classList.add('spin');
        statusText.textContent = '检测中...';

        var url = STATUS_URL + '?_=' + Date.now();

        fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store',
        }).then(function(response) {
            // 304 Not Modified — cached response is still valid, treat as success
            if (response.status === 304) {
                // Re-fetch without cache-busting to get the cached body
                return fetch(STATUS_URL, { method: 'GET', cache: 'force-cache' })
                    .then(function(r) { return r.text(); })
                    .then(function(text) {
                        if (!parseServerStatus(text)) {
                            // If we can't parse the cached response, consider it online
                            // (304 means the server was online when cached)
                            setServerOnline();
                        }
                    });
            }

            if (response.status === 200) {
                return response.text().then(function(text) {
                    parseServerStatus(text);
                });
            }

            // Any other status — fail
            throw new Error('HTTP ' + response.status);
        }).catch(function() {
            if (allowRetry !== false) {
                // Retry once after 2 seconds
                clearTimeout(retryTimer);
                retryTimer = setTimeout(function() {
                    checkServer(false);
                }, 2000);
            } else {
                setServerApiError();
            }
        });
    }

    // Check on load, then every 60 seconds
    checkServer();
    setInterval(function() { checkServer(); }, 60000);

    // Click status badge to refresh
    statusBadge.addEventListener('click', function() {
        checkServer();
    });

    // ============================================
    //  Modpack Version
    // ============================================
    var modpackVersionEl = document.getElementById('modpackVersion');

    function fetchModpackVersion() {
        fetch('https://update.kxkl2024.cn/index.json', {
            cache: 'no-store'
        }).then(function(r) { return r.json(); }).then(function(data) {
            if (data && data.length > 0) {
                var latest = data[data.length - 1];
                if (latest && latest.label) {
                    modpackVersionEl.textContent = 'v' + latest.label;
                    return;
                }
            }
            modpackVersionEl.textContent = '获取失败';
        }).catch(function() {
            modpackVersionEl.textContent = '获取失败';
        });
    }

    fetchModpackVersion();
})();
