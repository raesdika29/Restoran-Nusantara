/* =========================================================
   Restoran Nusantara Maria - script.js
   Isi: konfigurasi, data menu, keranjang, navbar/footer,
        filter menu, form pemesanan, validasi, pesan WhatsApp
   ========================================================= */
"use strict";

/* ---------- 1. KONFIGURASI (bagian yang boleh diganti) ---------- */
// GANTI nomor WhatsApp restoran asli di sini.
// Format: kode negara tanpa "+" dan tanpa spasi. Contoh 0812-3456-7890 menjadi 6281234567890
const WA_NUMBER = "6281234567890";

// GANTI data kontak berikut sesuai restoran Anda (dipakai di footer)
const KONTAK = {
  alamat: "Jl. Contoh No. 123, Pamulang, Tangerang Selatan, Banten",
  email: "restoran@example.com",
  instagram: "restorannusantara",
  jam: "Senin - Minggu, 10.00 - 22.00 WIB"
};

/* ---------- 2. DATA MENU ----------
   Untuk mengganti foto: simpan foto di folder images/ lalu ubah nilai "img".
   Untuk menambah menu: salin satu baris, beri id baru yang unik. */
const MENU = [
  { id: 1,  name: "Rendang Padang",   region: "Sumatera Barat",   cat: "makanan", price: 35000, img: "rendang.jpeg",           desc: "Daging sapi dimasak berjam-jam dengan santan dan rempah hingga empuk dan pekat." },
  { id: 2,  name: "Nasi Liwet",       region: "Jawa Tengah",      cat: "makanan", price: 28000, img: "nasi-liwet.jpeg",        desc: "Nasi gurih berkuah santan, disajikan dengan ayam suwir, telur, dan sayur labu." },
  { id: 3,  name: "Gudeg Jogja",      region: "Yogyakarta",       cat: "makanan", price: 30000, img: "gudeg.jpeg",             desc: "Nangka muda dimasak manis bersama gula aren, krecek, dan telur pindang." },
  { id: 4,  name: "Soto Betawi",      region: "Jakarta",          cat: "makanan", price: 32000, img: "soto-betawi.jpeg",       desc: "Soto kuah santan dan susu dengan daging sapi, tomat, emping, dan acar." },
  { id: 5,  name: "Pempek Palembang", region: "Sumatera Selatan", cat: "makanan", price: 25000, img: "pempek.jpeg",            desc: "Olahan ikan dan sagu disajikan dengan kuah cuko asam, manis, dan pedas." },
  { id: 6,  name: "Ayam Betutu Bali", region: "Bali",             cat: "makanan", price: 35000, img: "ayam-betutu.jpeg",       desc: "Ayam berbumbu base genep khas Bali, dibungkus daun pisang lalu dipanggang." },
  { id: 7,  name: "Rawon Jawa Timur", region: "Jawa Timur",       cat: "makanan", price: 32000, img: "rawon.jpeg",             desc: "Sup daging berkuah hitam dari kluwek, dengan tauge pendek dan sambal." },
  { id: 8,  name: "Coto Makassar",    region: "Sulawesi Selatan", cat: "makanan", price: 30000, img: "coto-makassar.jpeg",     desc: "Sup jeroan dan daging sapi dengan bumbu kacang, dimakan bersama ketupat." },
  { id: 9,  name: "Sate Madura",      region: "Jawa Timur",       cat: "makanan", price: 28000, img: "sate-madura.jpeg",       desc: "Sate ayam berbumbu kacang dan kecap manis, dibakar di atas arang." },
  { id: 10, name: "Gado-Gado",        region: "Jakarta",          cat: "makanan", price: 22000, img: "gado-gado.jpeg",         desc: "Sayuran rebus, tahu, tempe, dan telur dengan saus kacang yang kental." },
  { id: 11, name: "Es Cendol",        region: "Jawa Barat",       cat: "minuman", price: 15000, img: "es-cendol.jpeg",         desc: "Cendol hijau, santan, dan gula aren cair di atas es serut." },
  { id: 12, name: "Es Teh Nusantara", region: "Jawa",             cat: "minuman", price:  8000, img: "es-teh.jpeg",            desc: "Teh melati dingin dengan gula batu, segar diminum bersama makanan pedas." },
  { id: 13, name: "Es Jeruk",         region: "Nusantara",        cat: "minuman", price: 12000, img: "es-jeruk.jpeg",          desc: "Perasan jeruk peras segar dengan es batu dan sedikit gula." },
  { id: 14, name: "Es Pisang Ijo",    region: "Sulawesi Selatan", cat: "dessert", price: 18000, img: "es-pisang-hijau.jpeg",   desc: "Pisang berbalut adonan hijau, disiram sirup, santan, dan es serut." },
  { id: 15, name: "Klepon",           region: "Jawa",             cat: "dessert", price: 15000, img: "kelpon.jpeg",            desc: "Bola ketan hijau berisi gula aren cair, digulung dalam kelapa parut." },
  { id: 16, name: "Kolak Pisang",     region: "Nusantara",        cat: "dessert", price: 16000, img: "kolak-pisang.jpeg",      desc: "Pisang dan ubi dengan kuah santan manis, cocok untuk penutup yang hangat." }
];
const KATEGORI = { makanan: "Makanan", minuman: "Minuman", dessert: "Dessert" };
const FEATURED_IDS = [1, 3, 4, 6, 11, 14, 16]; // menu unggulan di halaman Home

/* ---------- 3. FUNGSI BANTU ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const rupiah = n => "Rp" + n.toLocaleString("id-ID");
const findItem = id => MENU.find(m => m.id === Number(id));

// Gambar placeholder otomatis jika file foto di folder images/ belum ada
const svgUri = svg => "data:image/svg+xml;utf8," + encodeURIComponent(svg);
const IMG_PLACEHOLDER = svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='#ecdfc0'/><text x='50%' y='50%' font-family='Georgia' font-size='26' fill='#4a2c1a' text-anchor='middle'>Foto Nusantara</text></svg>");
const LOGO_PLACEHOLDER = svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><circle cx='40' cy='40' r='40' fill='#b98a2e'/><text x='50%' y='57%' font-family='Georgia' font-size='34' fill='#fff' text-anchor='middle'>M</text></svg>");
document.addEventListener("error", e => {
  const img = e.target;
  if (img.tagName !== "IMG" || img.dataset.fallback) return;
  img.dataset.fallback = "1";
  img.src = img.classList.contains("logo") ? LOGO_PLACEHOLDER : IMG_PLACEHOLDER;
}, true);

let toastTimer;
function showToast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- 4. KERANJANG ---------- */
// cart berbentuk { idMenu: jumlah }. Disimpan di localStorage agar tetap ada saat pindah halaman.
let cart = {};
try { cart = JSON.parse(localStorage.getItem("nusantaraCart")) || {}; } catch (e) { cart = {}; }

const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
const cartTotal = () => Object.entries(cart).reduce((sum, [id, qty]) => sum + findItem(id).price * qty, 0);

function refresh() {
  try { localStorage.setItem("nusantaraCart", JSON.stringify(cart)); } catch (e) { /* abaikan */ }
  const badge = $("#cartCount");
  if (badge) badge.textContent = cartCount();
  renderOrder();
}
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  showToast(findItem(id).name + " ditambahkan ke pesanan");
  refresh();
}
function setQty(id, qty) {
  qty = Math.floor(Number(qty));
  if (!Number.isFinite(qty) || qty <= 0) {
    delete cart[id];
    refresh();
    return;
  }
  cart[id] = qty;
  refresh();
}
function removeFromCart(id) { delete cart[id]; refresh(); }

// Satu tempat untuk semua tombol ber-atribut data-act
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const id = el.dataset.id;
  if (el.dataset.act === "add") addToCart(id);
  if (el.dataset.act === "inc") setQty(id, cart[id] + 1);
  if (el.dataset.act === "dec") setQty(id, cart[id] - 1);
  if (el.dataset.act === "remove") removeFromCart(id);
});

/* ---------- 5. NAVBAR & FOOTER ---------- */
function buildLayout() {
  const page = location.pathname.split("/").pop() || "index.html";
  const link = (href, text) => `<li><a href="${href}"${page === href ? ' class="active"' : ""}>${text}</a></li>`;
  const header = $("#site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <nav class="nav" aria-label="Navigasi utama">
        <a class="brand" href="index.html">
          <img class="logo" src="logo.jpg" alt="Logo Restoran Nusantara Maria">
          <span>Restoran <b>Nusantara</b> Maria</span>
        </a>
        <a class="cart" href="menu.html#pesan" aria-label="Keranjang pesanan">🛒<em id="cartCount">0</em></a>
        <button class="burger" aria-label="Buka menu" aria-expanded="false"><span></span><span></span><span></span></button>
        <ul class="links" id="navLinks">
          ${link("index.html", "Home")}
          ${link("menu.html", "Menu")}
          ${link("tentang.html", "Tentang Kami")}
          ${link("kontak.html", "Kontak")}
          <li><a class="btn btn-gold small" href="menu.html#pesan">Pesan Sekarang</a></li>
        </ul>
      </nav>`;
    const burger = $(".burger", header), links = $("#navLinks");
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
    links.addEventListener("click", e => { if (e.target.closest("a")) links.classList.remove("open"); });
  }
  const footer = $("#site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container footer-grid">
        <div><h4>Restoran Nusantara Maria</h4><p>Cita rasa Nusantara, hadir di setiap sajian.</p></div>
        <div><h4>Kontak</h4><p>${KONTAK.alamat}</p><p><a href="mailto:${KONTAK.email}">${KONTAK.email}</a></p></div>
        <div><h4>Jam Operasional</h4><p>${KONTAK.jam}</p>
          <p><a href="https://instagram.com/${KONTAK.instagram}" target="_blank" rel="noopener">@${KONTAK.instagram}</a></p></div>
      </div>
      <p class="copy">© ${new Date().getFullYear()} Restoran Nusantara Maria. Semua hak dilindungi.</p>`;
  }
}

/* ---------- 6. KARTU MENU, FILTER, MENU UNGGULAN ---------- */
function cardHTML(m) {
  return `
    <article class="card reveal" data-cat="${m.cat}">
      <img src="${m.img}" alt="${m.name}" loading="lazy">
      <div class="card-body">
        <h3>${m.name}</h3>
        <span class="region">${m.region}</span>
        <p>${m.desc}</p>
        <span class="price">${rupiah(m.price)}</span>
        <button class="btn btn-green small" data-act="add" data-id="${m.id}">Tambah ke Pesanan</button>
      </div>
    </article>`;
}
function renderMenuGrid(filter = "semua") {
  const grid = $("#menuGrid");
  if (!grid) return;
  const list = MENU.filter(m => filter === "semua" || m.cat === filter);
  grid.innerHTML = list.map(cardHTML).join("");
  observeReveal();
}
function initFilters() {
  $$(".filter").forEach(btn => btn.addEventListener("click", () => {
    $$(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenuGrid(btn.dataset.filter);
  }));
}
function renderFeatured() {
  const grid = $("#featuredGrid");
  if (grid) grid.innerHTML = FEATURED_IDS.map(id => cardHTML(findItem(id))).join("");
}

/* ---------- 7. FORM PEMESANAN ---------- */
const selectedCats = new Set(); // kategori yang sedang dicentang

function renderOrder() {
  const picker = $("#pickList");
  if (!picker) return; // halaman ini tidak punya form
  // kategori otomatis tercentang jika ada menu dari kategori itu di keranjang
  Object.keys(cart).forEach(id => selectedCats.add(findItem(id).cat));
  $$('input[name="kategori"]').forEach(cb => { cb.checked = selectedCats.has(cb.value); });

  // daftar pilihan menu per kategori (checkbox + input jumlah)
  picker.innerHTML = [...selectedCats].map(cat => `
    <div class="pick-group"><h4>${KATEGORI[cat]}</h4>
      ${MENU.filter(m => m.cat === cat).map(m => `
        <div class="pick-row">
          <label><input type="checkbox" data-pick="${m.id}" ${cart[m.id] ? "checked" : ""}>${m.name} <small>(${rupiah(m.price)})</small></label>
          ${cart[m.id] ? `<input class="qty" type="number" min="1" value="${cart[m.id]}" data-qty="${m.id}" aria-label="Jumlah ${m.name}">` : ""}
        </div>`).join("")}
    </div>`).join("") || '<p class="empty">Pilih kategori di atas untuk menampilkan menu.</p>';

  // ringkasan "Pesanan Anda"
  const ids = Object.keys(cart);
  $("#sumList").innerHTML = ids.length ? ids.map(id => {
    const m = findItem(id), q = cart[id];
    return `
      <div class="sum-row">
        <span class="sum-name">${m.name} x ${q}</span><span class="sum-price">${rupiah(m.price * q)}</span>
        <div class="sum-ctrl">
          <button type="button" class="mini" data-act="dec" data-id="${id}" aria-label="Kurangi">−</button>
          <span>${q}</span>
          <button type="button" class="mini" data-act="inc" data-id="${id}" aria-label="Tambah">+</button>
          <button type="button" class="mini del" data-act="remove" data-id="${id}">Hapus</button>
        </div>
      </div>`;
  }).join("") : '<p class="empty">Belum ada pesanan. Tambahkan menu favorit Anda.</p>';
  $("#sumTotal").textContent = rupiah(cartTotal());
}

function initOrderForm() {
  const form = $("#orderForm");
  if (!form) return;
  form.elements.tanggal.min = todayStr();

  // centang/hapus kategori
  $$('input[name="kategori"]', form).forEach(cb => cb.addEventListener("change", () => {
    if (cb.checked) selectedCats.add(cb.value);
    else {
      selectedCats.delete(cb.value);
      MENU.filter(m => m.cat === cb.value).forEach(m => delete cart[m.id]); // menu kategori itu ikut dihapus
    }
    refresh();
  }));
  // centang menu / ubah jumlah
  form.addEventListener("change", e => {
    if (e.target.dataset.pick) {
      e.target.checked ? setQty(e.target.dataset.pick, 1) : removeFromCart(e.target.dataset.pick);
    }
    if (e.target.dataset.qty) setQty(e.target.dataset.qty, e.target.value);
  });
  // metode pembayaran: tampilkan pilihan lanjutan
  $$('input[name="bayar"]', form).forEach(r => r.addEventListener("change", () => {
    $$('input[name="opsi"]', form).forEach(o => (o.checked = false));
    $("#subCard").hidden = r.value !== "Kartu Debit/Kredit";
    $("#subWallet").hidden = r.value !== "Dompet Digital";
  }));
  form.addEventListener("submit", e => { e.preventDefault(); submitOrder(form); });

  $("#modalClose").addEventListener("click", () => $("#modal").classList.remove("show"));
  $("#newOrder").addEventListener("click", () => {
    cart = {}; selectedCats.clear(); form.reset();
    $("#subCard").hidden = $("#subWallet").hidden = true;
    $("#modal").classList.remove("show");
    refresh();
  });
}

function todayStr() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

/* Validasi: mengembalikan objek { namaField: pesanError } */
function validate(f) {
  const err = {};
  if (f.nama.value.trim().length < 3) err.nama = "Nama lengkap wajib diisi (minimal 3 huruf).";
  if (!/^(\+62|62|0)8\d{8,11}$/.test(f.hp.value.replace(/[\s-]/g, ""))) err.hp = "Nomor HP tidak valid. Contoh: 081234567890.";
  if (!f.tanggal.value) err.tanggal = "Tanggal booking wajib dipilih.";
  else if (f.tanggal.value < todayStr()) err.tanggal = "Tanggal booking tidak boleh sebelum hari ini.";
  if (!cartCount()) err.menu = "Pilih minimal satu menu.";
  if (!f.bayar.value) err.bayar = "Pilih metode pembayaran.";
  else if (f.bayar.value !== "Cash" && !f.opsi.value) err.bayar = "Pilih jenis kartu atau dompet digital.";
  if (f.alamat.value.trim().length < 10) err.alamat = "Alamat pengantaran wajib diisi lengkap.";
  return err;
}

function buildMessage(f) {
  const lines = Object.entries(cart).map(([id, q]) => `- ${findItem(id).name} x${q}`).join("\n");
  const bayar = f.bayar.value === "Cash" ? "Cash" : `${f.bayar.value} - ${f.opsi.value}`;
  return `HALO, SAYA INGIN MEMESAN

Nama: ${f.nama.value.trim()}
No. HP: ${f.hp.value.trim()}
Tanggal Booking: ${f.tanggal.value}

PESANAN:
${lines}

TOTAL:
${rupiah(cartTotal())}

METODE PEMBAYARAN:
${bayar}

CATATAN:
${f.catatan.value.trim() || "-"}

ALAMAT:
${f.alamat.value.trim()}`;
}

function submitOrder(form) {
  const f = form.elements, errors = validate(f);
  $$(".field", form).forEach(el => el.classList.remove("has-error"));
  $$("[data-error]", form).forEach(el => (el.textContent = ""));
  Object.entries(errors).forEach(([key, msg]) => {
    const out = $(`[data-error="${key}"]`, form);
    if (out) { out.textContent = msg; out.closest(".field")?.classList.add("has-error"); }
  });
  const alertBox = $("#formAlert");
  if (Object.keys(errors).length) {
    alertBox.style.display = "block";
    alertBox.textContent = "Data belum lengkap. Periksa kolom yang ditandai di bawah.";
    $(`[data-error="${Object.keys(errors)[0]}"]`, form)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  alertBox.style.display = "none";
  const message = buildMessage(f);
  $("#modalSummary").textContent = message;
  $("#waLink").href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  $("#modal").classList.add("show");
  showToast("Pesanan berhasil dibuat!");
}

/* ---------- 8. ANIMASI MUNCUL SAAT SCROLL ---------- */
let observer;
function observeReveal() {
  observer = observer || new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("visible"); observer.unobserve(en.target); }
  }), { threshold: .12 });
  $$(".reveal:not(.visible)").forEach(el => observer.observe(el));
}

/* ---------- 9. START ---------- */
document.addEventListener("DOMContentLoaded", () => {
  buildLayout();
  renderFeatured();
  renderMenuGrid();
  initFilters();
  initOrderForm();
  refresh();
  observeReveal();
});
