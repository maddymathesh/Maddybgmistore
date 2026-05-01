const pages = ['home', 'buy', 'sell', 'recovery', 'reviews', 'connect'];

const PAGE_PATHS = {
    home: '/home/',
    buy: '/buy/',
    sell: '/sell/',
    recovery: '/recovery/',
    reviews: '/reviews/',
    connect: '/connectwithus/'
};

const PATH_TO_PAGE = {
    '/home/': 'home', '/home/': 'home',
    '/buy/': 'buy',
    '/sell/': 'sell',
    '/recovery/': 'recovery',
    '/reviews/': 'reviews',
    '/connectwithus/': 'connect', '/connetwithus': 'connect'
};

function navigate(id) {
    const path = PAGE_PATHS[id] || '/home/';
    window.location.href = path;
}

function highlightNav(id) {
    pages.forEach(p => {
        const navEl = document.getElementById('nav-' + p);
        const mnavEl = document.getElementById('mnav-' + p);
        if (navEl) navEl.classList.remove('active');
        if (mnavEl) mnavEl.classList.remove('active');
    });
    const navEl = document.getElementById('nav-' + id);
    const mnavEl = document.getElementById('mnav-' + id);
    if (navEl) navEl.classList.add('active');
    if (mnavEl) mnavEl.classList.add('active');
}

function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}

document.addEventListener('click', function (e) {
    const menu = document.getElementById('mobileMenu');
    const ham = document.getElementById('ham');
    if (menu && ham && !menu.contains(e.target) && !ham.contains(e.target)) {
        menu.classList.remove('open');
    }
});