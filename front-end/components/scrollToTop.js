// ── Reusable Scroll-To-Top Component ──────────────────────
function createScrollToTop() {
    // create button
    const btn = document.createElement('button');
    btn.id = 'scrollTopBtn';
    btn.innerHTML = '&#8679;'; // ↑ arrow
    btn.title = 'Back to top';

    // styles
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00d4ff, #0f3460);
        color: #fff;
        font-size: 1.4rem;
        border: none;
        cursor: pointer;
        display: none;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(0,212,255,0.4);
        transition: opacity 0.3s;
    `;

    // click → scroll to top
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // show only when scrolled down 200px
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });

    document.body.appendChild(btn);
}
