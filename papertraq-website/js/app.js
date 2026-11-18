/* ==========================================================================
   PAPERTRAQ CENTRALIZED APPLICATION LOGIC (js/app.js)
   Modular Vanilla JS: Config, Bilingual EN|ID, 3-Mode Stage, Journal Filter,
   TOC Scroll-Spy, Live Cart & Copy-to-Instagram DM Generator
   ========================================================================== */

const PAPERTRAQ_CONFIG = {
  igHandle: '@papertraq',
  igUrl: 'https://instagram.com/papertraq',
  fallbackEmail: 'contact@papertraq.com',
  fxRate: 18110
};

/* --------------------------------------------------------------------------
   1. BILINGUAL SWITCHER (EN | ID)
   -------------------------------------------------------------------------- */
let currentLang = 'en';

function getDefaultLangForPage() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('journal') || path.includes('article-')) {
    return 'id';
  }
  return 'en';
}

function setLang(lang) {
  currentLang = (lang === 'id') ? 'id' : 'en';
  try {
    localStorage.setItem('papertraq_lang', currentLang);
  } catch (e) {}

  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
    btn.classList.toggle('active', btn.getAttribute('data-set-lang') === currentLang);
  });

  document.querySelectorAll('[data-en][data-id]').forEach(function (el) {
    const val = el.getAttribute('data-' + currentLang);
    if (val !== null) {
      el.innerHTML = val;
    }
  });

  document.querySelectorAll('[data-placeholder-en][data-placeholder-id]').forEach(function (el) {
    const ph = el.getAttribute('data-placeholder-' + currentLang);
    if (ph !== null) {
      el.setAttribute('placeholder', ph);
    }
  });

  if (document.getElementById('cart-items-display')) {
    renderCart();
  }
  if (document.getElementById('dm-preview-text')) {
    updateDmPreview();
  }
}

function initLanguage() {
  let saved = null;
  try {
    saved = localStorage.getItem('papertraq_lang');
  } catch (e) {}
  const initial = saved || getDefaultLangForPage();
  setLang(initial);
}

/* --------------------------------------------------------------------------
   2. ACTIVE NAVIGATION STATE DETECTOR
   -------------------------------------------------------------------------- */
function highlightActiveNav() {
  const path = window.location.pathname.toLowerCase();
  let currentSection = 'home';
  if (path.includes('journal') || path.includes('article-')) {
    currentSection = 'journal';
  } else if (path.includes('contact')) {
    currentSection = 'contact';
  }

  document.querySelectorAll('[data-nav]').forEach(function (link) {
    link.classList.toggle('active', link.getAttribute('data-nav') === currentSection);
  });
}

/* --------------------------------------------------------------------------
   3. HERO 3-MODE HARDWARE SWITCHER (Badge / Reader 180° / Desk Dock)
   -------------------------------------------------------------------------- */
function setScreenMode(mode) {
  ['badge', 'reader', 'dock'].forEach(function (m) {
    const stageEl = document.getElementById('s-' + m);
    const btnEl = document.getElementById('btn-m-' + m);
    if (stageEl) stageEl.style.display = (m === mode) ? 'block' : 'none';
    if (btnEl) btnEl.className = (m === mode) ? 'on' : '';
  });
}

/* --------------------------------------------------------------------------
   4. JOURNAL LANDING PAGE TOPIC FILTER
   -------------------------------------------------------------------------- */
function filterJournal(category, btnEl) {
  document.querySelectorAll('.filter-pill').forEach(function (pill) {
    pill.classList.remove('active');
  });
  if (btnEl) btnEl.classList.add('active');

  document.querySelectorAll('[data-topic-cat]').forEach(function (item) {
    const itemCat = item.getAttribute('data-topic-cat');
    const show = (category === 'all' || itemCat === category);
    item.classList.toggle('hidden', !show);
  });
}

/* --------------------------------------------------------------------------
   5. ARTICLE TABLE OF CONTENTS SCROLL-SPY
   -------------------------------------------------------------------------- */
function initTocSpy() {
  const tocLinks = document.querySelectorAll('.article-toc a[href^="#"]');
  if (!tocLinks.length) return;

  const sections = [];
  tocLinks.forEach(function (link) {
    const targetId = link.getAttribute('href').slice(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) sections.push({ id: targetId, el: targetEl, link: link });
  });

  if (!sections.length) return;

  window.addEventListener('scroll', function () {
    let activeId = sections[0].id;
    const offset = 140;
    sections.forEach(function (sec) {
      if (sec.el.getBoundingClientRect().top <= offset) {
        activeId = sec.id;
      }
    });
    sections.forEach(function (sec) {
      sec.link.classList.toggle('active', sec.id === activeId);
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   6. LIVE STORE & CART (Hairline Catalog Rows + Quantity Stepper)
   -------------------------------------------------------------------------- */
const CATALOG = {
  lite: {
    nameEn: 'PaperTraq Lite (Polycarbonate)',
    nameId: 'PaperTraq Lite (Polikarbonat)',
    price: 79.00,
    isDev: true
  },
  pro: {
    nameEn: 'PaperTraq Pro Edition (CNC Aluminum)',
    nameId: 'PaperTraq Pro Edition (Aluminium CNC)',
    price: 129.00,
    isDev: true
  },
  faceplate: {
    nameEn: '01. Modular Magnetic Faceplate',
    nameId: '01. Plat Muka Modular (Magnetik)',
    price: 14.00,
    isDev: false
  },
  dock: {
    nameEn: '02. Smart Desk Dock (Standalone)',
    nameId: '02. Smart Desk Dock (Terpisah)',
    price: 29.00,
    isDev: false
  },
  grip: {
    nameEn: '03. Extended Grip Case (USB-C)',
    nameId: '03. Extended Grip Case (USB-C)',
    price: 22.00,
    isDev: false
  },
  bumper: {
    nameEn: '04. Edge Rubber Bumpers (4-Pack)',
    nameId: '04. Pelindung Sudut Karet (4-Pack)',
    price: 9.00,
    isDev: false
  },
  silicone: {
    nameEn: '05. Liquid Silicone Case',
    nameId: '05. Casing Silikon Matte Anti-Slip',
    price: 15.00,
    isDev: false
  },
  leather: {
    nameEn: '06. Executive Leather Sleeve',
    nameId: '06. Sarung Kulit Eksekutif',
    price: 25.00,
    isDev: false
  },
  lanyard: {
    nameEn: '07. Lanyard & Carabiner (Quick-Release)',
    nameId: '07. Lanyard & Karabiner Lepas-Cepat',
    price: 24.00,
    isDev: false
  },
  pouch: {
    nameEn: '08. Screen Protector & Microfiber Pouch',
    nameId: '08. Pelindung Layar & Kantong Microfiber',
    price: 12.00,
    isDev: false
  }
};

let cart = {};
let lastTotal = 0;

function getItemName(item) {
  return currentLang === 'id' ? item.nameId : item.nameEn;
}

function changeQty(id, delta) {
  if (!cart[id]) cart[id] = 0;
  cart[id] += delta;
  if (cart[id] <= 0) {
    delete cart[id];
  }
  renderCart();
}

function clearCart() {
  cart = {};
  renderCart();
}

function renderCart() {
  const listEl = document.getElementById('cart-items-display');
  if (!listEl) return;

  for (const id in CATALOG) {
    const actionBox = document.getElementById('action-' + id);
    const rowEl = document.getElementById('card-' + id);
    const qty = cart[id] || 0;

    if (actionBox && rowEl) {
      if (qty > 0) {
        rowEl.className = 'item-row chosen';
        actionBox.innerHTML =
          '<div class="stepper">' +
          '<button type="button" onclick="changeQty(\'' + id + '\', -1)" aria-label="Decrease quantity">-</button>' +
          '<span>' + qty + '</span>' +
          '<button type="button" onclick="changeQty(\'' + id + '\', 1)" aria-label="Increase quantity">+</button>' +
          '</div>';
      } else {
        rowEl.className = 'item-row';
        const label = CATALOG[id].isDev
          ? (currentLang === 'id' ? '+ Tambah' : '+ Add to Cart')
          : (currentLang === 'id' ? '+ Tambah' : '+ Add');
        actionBox.innerHTML = '<button type="button" class="btn-qty" onclick="changeQty(\'' + id + '\', 1)">' + label + '</button>';
      }
    }
  }

  let subtotal = 0;
  let totalUnits = 0;
  let hasDev = false;
  let hasAcc = false;

  if (Object.keys(cart).length === 0) {
    listEl.innerHTML = currentLang === 'id'
      ? '<div style="text-align:center;padding:24px 10px;font-size:.86rem;color:var(--ink-soft)">Keranjang masih kosong.<br>Pilih perangkat atau aksesori untuk memulai.</div>'
      : '<div style="text-align:center;padding:24px 10px;font-size:.86rem;color:var(--ink-soft)">Your cart is empty.<br>Select a badge or gear to begin.</div>';
  } else {
    let html = '';
    for (const id in cart) {
      const item = CATALOG[id];
      const qty = cart[id];
      const lineCost = item.price * qty;
      const displayName = getItemName(item);
      subtotal += lineCost;
      totalUnits += qty;
      if (item.isDev) hasDev = true;
      if (!item.isDev) hasAcc = true;

      html +=
        '<div class="cart-row">' +
        '<div class="t" title="' + displayName + '"><span>' + displayName + '</span></div>' +
        '<div class="cart-stepper">' +
        '<button type="button" onclick="changeQty(\'' + id + '\', -1)" aria-label="Decrease">-</button>' +
        '<span>' + qty + '</span>' +
        '<button type="button" onclick="changeQty(\'' + id + '\', 1)" aria-label="Increase">+</button>' +
        '</div>' +
        '<span style="font-family:var(--f-mono);font-weight:700;min-width:65px;text-align:right">$' + lineCost.toFixed(2) + '</span>' +
        '</div>';
    }
    listEl.innerHTML = html;
  }

  const noteEl = document.getElementById('c-note');
  if (noteEl) {
    if (cart.pro && cart.dock) {
      noteEl.innerText = currentLang === 'id'
        ? 'Catatan: PaperTraq Pro sudah termasuk 1 Smart Desk Dock di dalam kotak.'
        : 'Note: PaperTraq Pro already includes a Smart Desk Dock in the box.';
    } else {
      noteEl.innerText = '';
    }
  }

  let discPct = 0;
  let discAmt = 0;
  if (hasDev && hasAcc) {
    discPct = totalUnits >= 5 ? 15 : 10;
    discAmt = subtotal * (discPct / 100);
  }

  const finalTotal = subtotal - discAmt;
  const idrTotal = Math.round((finalTotal * PAPERTRAQ_CONFIG.fxRate) / 1000) * 1000;

  document.getElementById('c-subtotal').innerText = '$' + subtotal.toFixed(2);
  const discLine = document.getElementById('c-disc-line');
  if (discAmt > 0) {
    discLine.style.display = 'flex';
    document.getElementById('c-disc-lbl').innerText = (currentLang === 'id' ? 'Diskon Bundle (' : 'Bundle Discount (') + discPct + '%):';
    document.getElementById('c-disc-val').innerText = '-$' + discAmt.toFixed(2);
  } else {
    discLine.style.display = 'none';
  }

  document.getElementById('c-total').innerText = '$' + finalTotal.toFixed(2);
  lastTotal = finalTotal;
  document.getElementById('c-idr').innerText = '≈ Rp ' + idrTotal.toLocaleString('id-ID');
  document.getElementById('c-checkout-btn').disabled = (totalUnits === 0);
}

/* --------------------------------------------------------------------------
   7. COPY-TO-INSTAGRAM DM & MODAL HANDLERS (Official @papertraq Channel)
   -------------------------------------------------------------------------- */
function copyTextAndOpenIg(text, noteElId) {
  const noteEl = document.getElementById(noteElId);
  const successMsg = currentLang === 'id'
    ? 'Format pesan berhasil disalin! Silakan tempel (Paste) di DM Instagram ' + PAPERTRAQ_CONFIG.igHandle + '.'
    : 'Message copied to clipboard! Paste it directly into Instagram DM ' + PAPERTRAQ_CONFIG.igHandle + '.';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(function () {});
  }

  if (noteEl) {
    noteEl.innerText = successMsg;
    noteEl.className = 'form-note show';
  }

  window.open(PAPERTRAQ_CONFIG.igUrl, '_blank', 'noopener,noreferrer');
}

function openOrderModal() {
  const summaryEl = document.getElementById('modal-summary-items');
  if (!summaryEl) return;

  let summary = '';
  for (const id in cart) {
    const qty = cart[id];
    const lineCost = CATALOG[id].price * qty;
    summary += '<div style="margin-bottom:5px">• <b>' + qty + 'x</b> ' + getItemName(CATALOG[id]) + ' — $' + lineCost.toFixed(2) + '</div>';
  }
  const estIdr = Math.round((lastTotal * PAPERTRAQ_CONFIG.fxRate) / 1000) * 1000;
  summary += '<div style="margin-top:8px;border-top:1px dashed var(--hairline-strong);padding-top:8px"><b>' +
    (currentLang === 'id' ? 'Estimasi total: ' : 'Estimated total: ') +
    '$' + lastTotal.toFixed(2) + ' (≈ Rp ' + estIdr.toLocaleString('id-ID') + ')</b></div>';

  summaryEl.innerHTML = summary;
  const noteEl = document.getElementById('order-note');
  if (noteEl) noteEl.className = 'form-note';
  document.getElementById('order-modal').className = 'modal-wrap active';
}

function closeOrderModal() {
  const m = document.getElementById('order-modal');
  if (m) m.className = 'modal-wrap';
}

function buildOrderMessageText() {
  let lines = '';
  for (const id in cart) {
    const q = cart[id];
    lines += '- ' + q + 'x ' + getItemName(CATALOG[id]) + ' ($' + (CATALOG[id].price * q).toFixed(2) + ')\n';
  }
  const estIdr = Math.round((lastTotal * PAPERTRAQ_CONFIG.fxRate) / 1000) * 1000;
  const nameVal = (document.getElementById('o-name') && document.getElementById('o-name').value) || '-';
  const countryVal = (document.getElementById('o-country') && document.getElementById('o-country').value) || '-';

  return 'Halo PaperTraq (' + PAPERTRAQ_CONFIG.igHandle + '), saya ingin melakukan reservasi Batch 01:\n\n' +
    lines +
    '\nEstimasi Total: $' + lastTotal.toFixed(2) + ' (≈ Rp ' + estIdr.toLocaleString('id-ID') + ')' +
    '\nNama: ' + nameVal +
    '\nNegara / Kota: ' + countryVal;
}

function handleOrderSubmit(e) {
  e.preventDefault();
  const body = buildOrderMessageText();
  copyTextAndOpenIg(body, 'order-note');
}

function fallbackOrderEmail() {
  const body = buildOrderMessageText();
  window.open('mailto:' + PAPERTRAQ_CONFIG.fallbackEmail + '?subject=' + encodeURIComponent('PaperTraq Batch 01 Reservation') + '&body=' + encodeURIComponent(body), '_blank', 'noopener');
}

/* Contact Page Live DM Generator */
function updateDmPreview() {
  const previewEl = document.getElementById('dm-preview-text');
  if (!previewEl) return;

  const topicEl = document.getElementById('dm-topic');
  const nameEl = document.getElementById('dm-name');
  const orgEl = document.getElementById('dm-org');
  const msgEl = document.getElementById('dm-msg');

  const topic = topicEl ? topicEl.value : 'Batch 01 Reservation';
  const name = (nameEl && nameEl.value.trim()) || (currentLang === 'id' ? '[Nama Anda]' : '[Your Name]');
  const org = (orgEl && orgEl.value.trim()) || '-';
  const msg = (msgEl && msgEl.value.trim()) || (currentLang === 'id'
    ? 'Halo tim PaperTraq, saya ingin berdiskusi mengenai kebutuhan produk.'
    : 'Hello PaperTraq team, I would like to inquire about your product.');

  if (currentLang === 'id') {
    previewEl.textContent =
      'Halo ' + PAPERTRAQ_CONFIG.igHandle + ',\n' +
      'Topik: ' + topic + '\n' +
      'Nama: ' + name + '\n' +
      'Instansi / Perusahaan: ' + org + '\n\n' +
      'Pesan:\n' + msg;
  } else {
    previewEl.textContent =
      'Hi ' + PAPERTRAQ_CONFIG.igHandle + ',\n' +
      'Topic: ' + topic + '\n' +
      'Name: ' + name + '\n' +
      'Organization: ' + org + '\n\n' +
      'Message:\n' + msg;
  }
}

function handleContactDmSubmit(e) {
  e.preventDefault();
  const previewEl = document.getElementById('dm-preview-text');
  if (!previewEl) return;
  copyTextAndOpenIg(previewEl.textContent, 'contact-dm-note');
}

/* Close modals on backdrop click or Escape key */
document.addEventListener('click', function (ev) {
  if (ev.target && ev.target.classList && ev.target.classList.contains('modal-wrap')) {
    ev.target.className = 'modal-wrap';
  }
});

document.addEventListener('keydown', function (ev) {
  if (ev.key === 'Escape') {
    document.querySelectorAll('.modal-wrap').forEach(function (w) {
      w.className = 'modal-wrap';
    });
  }
});

/* Initialize on DOM Ready */
document.addEventListener('DOMContentLoaded', function () {
  highlightActiveNav();
  initLanguage();
  initTocSpy();
  if (document.getElementById('cart-items-display')) {
    renderCart();
  }
  if (document.getElementById('dm-preview-text')) {
    updateDmPreview();
  }
});
