// UI interactions: counters, reveal-on-scroll, region filters
(function(){
    function animateCounters() {
        const countriesEl = document.getElementById('countriesCount');
        const visaTypesEl = document.getElementById('visaTypesCount');
        const articlesEl = document.getElementById('articlesCount');

        const parseTarget = el => {
            if (!el) return 0;
            const raw = el.textContent || '';
            const n = parseInt(raw.replace(/[^0-9]/g, ''), 10);
            return isNaN(n) ? 0 : n;
        };

        const ease = t => 1 - Math.pow(1 - t, 3);

        const run = (el, to, duration=900) => {
            if (!el) return;
            const start = 0;
            const startTime = performance.now();
            const tick = now => {
                const elapsed = Math.min((now - startTime) / duration, 1);
                const val = Math.floor(start + (to - start) * ease(elapsed));
                el.textContent = val + '+';
                if (elapsed < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        // values are set by script.js; fall back to counting from arrays
        const countriesVal = (window.countries && window.countries.length) || parseTarget(countriesEl) || 195;
        const visaTypesVal = (window.visaTypes && window.visaTypes.length) || parseTarget(visaTypesEl) || 50;
        const articlesVal = (window.blogPosts && window.blogPosts.length) || parseTarget(articlesEl) || 100;

        run(countriesEl, countriesVal);
        run(visaTypesEl, visaTypesVal);
        run(articlesEl, articlesVal);
    }

    function revealOnScroll() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.card, .destination-card, .resource-card, .region-card, .visa-card').forEach(el => {
            el.classList.add('reveal');
            obs.observe(el);
        });
    }

    function buildRegionFilters() {
        const container = document.getElementById('regionFilters');
        if (!container) return;

        // derive regions from window.visaGuide or window.countries
        const regions = window.visaGuide && typeof window.visaGuide.getRegions === 'function'
            ? window.visaGuide.getRegions()
            : (window.countries || []).map(c => c.region).filter((v,i,a)=>a.indexOf(v)===i);

        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.textContent = 'All';
        allBtn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
            allBtn.classList.add('active');
            if (window.loadCountries) window.loadCountries();
        });
        container.appendChild(allBtn);

        regions.forEach(region => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = region;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
                btn.classList.add('active');
                if (window.visaGuide && typeof window.visaGuide.filterByRegion === 'function') {
                    window.visaGuide.filterByRegion(region);
                } else if (window.filterByRegion) {
                    window.filterByRegion(region);
                }
            });
            container.appendChild(btn);
        });
    }

    function init() {
        // run after DOM content loaded
        document.addEventListener('DOMContentLoaded', () => {
            // slight delay so counts from script.js are set first
            setTimeout(() => { try { animateCounters(); } catch(e){/*silent*/} }, 120);
            try { revealOnScroll(); } catch(e){}
            try { buildRegionFilters(); } catch(e){}

            // small hover parallax (pointer) for destination cards
            document.querySelectorAll('.destination-card').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const dx = (e.clientX - rect.left) / rect.width - 0.5;
                    const dy = (e.clientY - rect.top) / rect.height - 0.5;
                    card.style.transform = `perspective(600px) rotateX(${(-dy*4)}deg) rotateY(${dx*6}deg)`;
                });
                card.addEventListener('mouseleave', () => { card.style.transform = ''; });
            });
        });
    }

    init();
})();
