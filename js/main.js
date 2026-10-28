/**
 * main.js - Core Portfolio Functionality
 * M. Abdul Rahman - Studio Grade Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initNavbar();
  initScrollSpy();
  initStatCounters();
  initProjectFilters();
  initProjectModal();
  initContactForm();
  initScrollReveal();
  initBackToTop();
});

/* ==========================================================================
   1. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const words = [
    'Web Developer',
    'Data Analyst',
    'Admin IT'
  ];


  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 450; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   2. FLOATING NAVBAR & MOBILE TOGGLE
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.floating-navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Subtle elevation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 24) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark text-sm' : 'fa-solid fa-bars text-sm';
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars text-sm';
      }
    });

    // Close on nav link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars text-sm';
      });
    });
  }
}

/* ==========================================================================
   3. SCROLL SPY (ACTIVE NAV LINK HIGHLIGHT)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function updateActiveNav() {
    const scrollY = window.pageYOffset + 180;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-white', 'bg-white/10');
            link.classList.remove('text-slate-300');
          } else {
            link.classList.remove('text-white', 'bg-white/10');
            link.classList.add('text-slate-300');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

/* ==========================================================================
   4. STAT COUNTERS ANIMATION
   ========================================================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          const duration = 1800;
          const start = 0;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Quartic ease out
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeProgress);

            stat.textContent = current + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              stat.textContent = target + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.getElementById('stats-container');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   5. PROJECT FILTER SYSTEM
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categoryAttr = card.getAttribute('data-category') || '';
        const categories = categoryAttr.split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px) scale(0.97)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   6. PROJECT DETAIL MODAL WITH AUTHENTIC DATA
   ========================================================================== */
const projectData = {
  1: {
    title: 'Sistem Informasi Penjualan Kemplang Aleng',
    category: 'Academic Project • E-Commerce & Web Development',
    tag: 'Academic Project',
    image: 'assets/projects/sistempenjualan/Screenshot 2026-04-21 185842.png',
    description: 'Sistem Informasi Penjualan Kemplang Aleng berbasis web yang dikembangkan menggunakan framework PHP CodeIgniter dan basis data MySQL. Dirancang secara komprehensif untuk mendigitalkan seluruh alur bisnis UMKM Toko Kemplang Aleng Palembang—mulai dari etalase katalog produk interaktif, keranjang belanja dengan akumulasi berat otomatis, integrasi pembayaran multi-channel otomatis via Midtrans Payment Gateway, kalkulasi ongkos kirim real-time berdasarkan bobot produk dan kota tujuan via API RajaOngkir, pelacakan perjalanan nomor resi pengiriman real-time via API BinderByte, hingga dashboard analitik penjualan dan cetak laporan keuangan bulanan.',
    features: [
      'Integrasi Payment Gateway Midtrans (Snap): Pembayaran otomatis multi-metode instan mencakup GoPay / GoPay Later, QRIS, Virtual Account (BCA, Mandiri, BNI, BRI, Permata), Kartu Kredit/Debit, dan Google Pay.',
      'Prediksi Ongkir Otomatis via API RajaOngkir: Sinkronisasi tarif ongkos kirim real-time dari kurir ekspedisi (TIKI, JNE, POS) berdasarkan akumulasi bobot produk (gram) dan kota/kecamatan alamat tujuan pengiriman.',
      'Cek Perjalanan Paket via API BinderByte: Fitur pelacakan resi ekspedisi langsung dan akurat agar pelanggan dan admin dapat memantau status posisi perjalanan paket secara real-time.',
      'Katalog Produk & Keranjang Belanja Dinamis: Menampilkan ragam produk kemplang khas Palembang (Kemplang Stik, Mangkok, Kancing, Panggang, Bantet, dll) dengan kontrol kuantitas dan total harga real-time.',
      'Modul Checkout & Manajemen Alamat: Memudahkan pelanggan memilih alamat tersimpan atau memasukkan alamat baru dengan kalkulasi subtotal dan total bayar transparan.',
      'Detail Pesanan & Cetak Invoice Digital: Menampilkan nomor order invoice, detail produk yang dipesan, estimasi kedatangan kurir, biaya ongkir, dan tombol cetak invoice.',
      'Dashboard Eksekutif Administrator Toko: Visualisasi ringkasan pesanan masuk, total produk terdaftar, pelanggan aktif, pendapatan hari ini, grafik tren penjualan tahunan, dan daftar produk terlaris bulanan.',
      'Laporan Penjualan Bulanan & Fitur Cetak: Rekapitulasi transaksi bulanan terperinci (jumlah produk terjual, berat total, grand total omset) dilengkapi tombol print laporan resmi.'
    ],
    tech: ['CodeIgniter (PHP)', 'MySQL', 'Midtrans Payment Gateway', 'API RajaOngkir', 'API BinderByte', 'REST API & JSON', 'Bootstrap / CSS3', 'JavaScript'],
    gallery: [
      { src: 'assets/projects/sistempenjualan/Screenshot 2026-04-21 185842.png', label: 'Katalog Produk' },
      { src: 'assets/projects/sistempenjualan/Screenshot 2026-04-21 193852.png', label: 'Keranjang Belanja' },
      { src: 'assets/projects/sistempenjualan/Screenshot 2026-04-21 194808.png', label: 'Checkout & RajaOngkir' },
      { src: 'assets/projects/sistempenjualan/Screenshot 2026-01-14 165233.png', label: 'Midtrans Payment Snap' },
      { src: 'assets/projects/sistempenjualan/Screenshot 2026-04-22 113408.png', label: 'Detail Pesanan & Ongkir' },
      { src: 'assets/projects/sistempenjualan/Screenshot 2026-04-22 114637.png', label: 'Dashboard Admin' },
      { src: 'assets/projects/sistempenjualan/Screenshot 2026-01-15 140457.png', label: 'Laporan Penjualan' },
      { src: 'assets/projects/sistempenjualan/Screenshot 2026-01-15 141523.png', label: 'Cetak Laporan Bulanan' },
      { src: 'assets/projects/sistempenjualan/foto.jpeg', label: 'Dokumentasi Lapangan' }
    ],
    demo: '#',
    code: 'https://wa.me/62895604672318?text=Halo%20M.%20Abdul%20Rahman,%20saya%20tertarik%20dengan%20proyek%20Sistem%20Informasi%20Penjualan%20Kemplang%20Aleng'
  },
  2: {
    title: 'Pemetaan Peta Administrasi Desa Mekar Jadi Menggunakan Software ArcGIS',
    category: 'Academic / KKN Project • Geographic Information System (GIS) & Pemetaan Spasial',
    tag: 'Academic • GIS Project',
    image: 'assets/projects/PEMETAAN PETA ADMINISTRASI DESA MEKAR JADI MENGGUNAKAN SOFTWARE ARCGIS/Peta Arcgis Desa mekar jadi.jpg',
    description: 'Proyek pemetaan spasial dan penyusunan peta batas administrasi Desa Mekar Jadi (Kecamatan Sungai Lilin, Kabupaten Musi Banyuasin, Sumatera Selatan) menggunakan perangkat lunak ArcGIS Desktop yang dipadukan dengan citra satelit resolusi tinggi Google Earth Pro serta survei lapangan langsung. Proyek ini dijalankan guna menghadirkan acuan kartografi resmi mengenai batas teritorial desa, jaringan transportasi jalan, aliran hidrologi sungai, zonasi pemukiman warga, dan tutupan lahan perkebunan desa.',
    features: [
      'Digitasi Spasial Batas Wilayah Administrasi: Penarikan garis batas desa presisi yang memisahkan Desa Mekar Jadi dengan wilayah desa sekitar (Sumber Rejeki, Sri Gunung, dll).',
      'Pemetaan Jaringan Jalan & Transportasi: Mengidentifikasi jalur jalan utama, jalan lokal lingkungan, jalur antardesa, dan fasilitas jembatan penghubung.',
      'Analisis Zonasi Pemukiman & Tutupan Lahan: Klasifikasi spasial area pemukiman warga, perkebunan kelapa sawit, semak belukar, serta fasilitas umum pedesaan.',
      'Sinkronisasi Citra Satelit Google Earth Pro: Pemanfaatan citra satelit resolusi tinggi untuk memverifikasi toponimi titik spot krusial dan tata letak bangunan desa secara akurat.',
      'Survei Lapangan & Wawancara Pemangku Kepentingan: Pengumpulan data primer, cross-check batas riil, dan validasi toponimi desa langsung bersama Ketua KUD dan aparatur desa setempat.',
      'Standardisasi Layout Kartografi Digital: Penyusunan layout peta baku mencakup judul peta, arah mata angin (North Arrow), skala grafis & nominal (1:400), diagram peta indeks lokasi, sistem koordinat/proyeksi Transverse Mercator (WGS 1984 Zone 48S), serta legenda keterangan simbolis.'
    ],
    tech: ['ArcGIS Desktop', 'Google Earth Pro', 'Sistem Informasi Geografis (SIG)', 'Analisis Spasial', 'Kartografi Digital', 'GPS & Survei Lapangan', 'Digitasi Vektor'],
    gallery: [
      { src: 'assets/projects/PEMETAAN PETA ADMINISTRASI DESA MEKAR JADI MENGGUNAKAN SOFTWARE ARCGIS/Peta Arcgis Desa mekar jadi.jpg', label: 'Layout Peta ArcGIS' },
      { src: 'assets/projects/PEMETAAN PETA ADMINISTRASI DESA MEKAR JADI MENGGUNAKAN SOFTWARE ARCGIS/Google earth peta desa mekar jadi.jpg', label: 'Citra Google Earth' },
      { src: 'assets/projects/PEMETAAN PETA ADMINISTRASI DESA MEKAR JADI MENGGUNAKAN SOFTWARE ARCGIS/Survey dengan ketua kud desa.jpg', label: 'Survei Bersama KUD' }
    ],
    demo: '#',
    code: 'https://wa.me/62895604672318?text=Halo%20M.%20Abdul%20Rahman,%20saya%20tertarik%20dengan%20proyek%20Pemetaan%20Peta%20Administrasi%20Desa%20Mekar%20Jadi'
  },
  3: {
    title: 'Perancangan Sistem E-Surat Berbasis Web pada Dinas Perpustakaan dan Kearsipan Kota Palembang',
    category: 'Academic / Internship Project • Web Application & Sistem Informasi Manajemen',
    tag: 'Academic • Public Sector',
    image: 'assets/projects/PERANCANGAN SISTEM ESURAT BERBASIS WEB PADA DINAS PERPUSTAKAAN DAN KEARSIPAN KOTA PALEMBANG/Halaman dashboard.png',
    description: 'Sistem Informasi Manajemen E-Surat berbasis web yang dirancang khusus untuk mendigitalkan dan mengefisiensikan tata kelola administrasi korespondensi persuratan pada Dinas Perpustakaan dan Kearsipan Kota Palembang. Sistem ini mentransformasi proses pencatatan konvensional menjadi terpusat secara digital, mencakup dashboard metrik volume surat, agenda surat masuk dan keluar terstruktur, formulir registrasi surat baru, upload dan pratinjau berkas digital (PDF), serta pencarian arsip secara cepat dan terorganisir.',
    features: [
      'Dashboard Eksekutif & Statistik Surat: Menyajikan ringkasan metrik Total Surat Masuk dan Surat keluar, serta grafik visual tren pergerakan volume surat bulanan.',
      'Manajemen & Registrasi Agenda Surat Masuk: Pencatatan nomor agenda otomatis, nomor surat instansi asal, tanggal surat, tanggal terima, perihal, dan upload softcopy file berkas (PDF).',
      'Manajemen & Registrasi Agenda Surat Keluar: Pencatatan nomor agenda surat keluar, tanggal terbit, instansi tujuan pengiriman, nomor berkas, perihal, dan penyimpanan arsip digital.',
      'Sistem Pencarian Cepat (Live Search): Fitur pencarian instan berdasarkan nomor surat, perihal, maupun instansi pengirim/tujuan untuk mempermudah temu balik arsip kearsipan.',
      'Penyimpanan & Pratinjau Arsip Digital: Pengelolaan dokumen digital surat dalam format PDF yang dapat diakses, dilihat langsung (preview), dan diunduh oleh staf terkait.',
      'Autentikasi Pengguna & Keamanan Data: Modul login terproteksi untuk membatasi hak akses pengelolaan surat hanya kepada petugas kearsipan dan staf berwenang.'
    ],
    tech: ['PHP', 'MySQL', 'UI/UX Design', 'JavaScript', 'HTML5 / CSS3', 'Bootstrap', 'Manajemen Kearsipan Digital'],
    gallery: [
      { src: 'assets/projects/PERANCANGAN SISTEM ESURAT BERBASIS WEB PADA DINAS PERPUSTAKAAN DAN KEARSIPAN KOTA PALEMBANG/Halaman dashboard.png', label: 'Dashboard Statistik' },
      { src: 'assets/projects/PERANCANGAN SISTEM ESURAT BERBASIS WEB PADA DINAS PERPUSTAKAAN DAN KEARSIPAN KOTA PALEMBANG/halaman login.png', label: 'Halaman Login' },
      { src: 'assets/projects/PERANCANGAN SISTEM ESURAT BERBASIS WEB PADA DINAS PERPUSTAKAAN DAN KEARSIPAN KOTA PALEMBANG/halaman surat masuk.png', label: 'Agenda Surat Masuk' },
      { src: 'assets/projects/PERANCANGAN SISTEM ESURAT BERBASIS WEB PADA DINAS PERPUSTAKAAN DAN KEARSIPAN KOTA PALEMBANG/Rancangan tambah surat masuk.png', label: 'Form Surat Masuk' },
      { src: 'assets/projects/PERANCANGAN SISTEM ESURAT BERBASIS WEB PADA DINAS PERPUSTAKAAN DAN KEARSIPAN KOTA PALEMBANG/Halaman Surat keluar.png', label: 'Agenda Surat Keluar' },
      { src: 'assets/projects/PERANCANGAN SISTEM ESURAT BERBASIS WEB PADA DINAS PERPUSTAKAAN DAN KEARSIPAN KOTA PALEMBANG/rancangan tambah surat keluar.png', label: 'Form Surat Keluar' }
    ],
    demo: '#',
    code: 'https://wa.me/62895604672318?text=Halo%20M.%20Abdul%20Rahman,%20saya%20tertarik%20dengan%20proyek%20Perancangan%20Sistem%20E-Surat%20Dinas%20Perpustakaan%20dan%20Kearsipan'
  }
};

function initProjectModal() {
  const modalBackdrop = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImage = document.getElementById('modal-img');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDescription = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalTech = document.getElementById('modal-tech');
  const modalDemo = document.getElementById('modal-demo');
  const modalCode = document.getElementById('modal-code');
  const galleryContainer = document.getElementById('modal-gallery-container');
  const galleryGrid = document.getElementById('modal-gallery');

  const detailButtons = document.querySelectorAll('.open-modal-btn');

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];

      if (!data) return;

      modalImage.src = data.image;
      modalImage.alt = data.title;
      modalTag.textContent = data.tag;
      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalDescription.textContent = data.description;

      // Populate gallery thumbnails
      if (galleryContainer && galleryGrid) {
        galleryGrid.innerHTML = '';
        if (data.gallery && data.gallery.length > 0) {
          galleryContainer.classList.remove('hidden');
          if (data.gallery.length <= 3) {
            galleryGrid.className = 'grid grid-cols-3 max-w-md mx-auto gap-2.5';
          } else if (data.gallery.length <= 6) {
            galleryGrid.className = 'grid grid-cols-3 sm:grid-cols-6 max-w-3xl mx-auto gap-2';
          } else {
            galleryGrid.className = 'grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2';
          }
          data.gallery.forEach((item, idx) => {
            const thumbBtn = document.createElement('button');
            thumbBtn.type = 'button';
            thumbBtn.className = `modal-thumb-btn relative rounded-lg overflow-hidden border transition-all aspect-[16/10] group focus:outline-none ${idx === 0 ? 'active' : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'}`;
            thumbBtn.innerHTML = `
              <img src="${item.src}" alt="${item.label}" class="w-full h-full object-cover">
              <span class="absolute inset-x-0 bottom-0 bg-slate-950/85 text-[9px] font-mono text-center py-0.5 text-slate-300 truncate">${item.label}</span>
            `;
            thumbBtn.addEventListener('click', () => {
              modalImage.src = item.src;
              modalImage.alt = item.label;
              galleryGrid.querySelectorAll('button').forEach(b => {
                b.classList.remove('active');
                b.classList.add('border-slate-800', 'opacity-60');
              });
              thumbBtn.classList.remove('border-slate-800', 'opacity-60');
              thumbBtn.classList.add('active');
            });
            galleryGrid.appendChild(thumbBtn);
          });
        } else {
          galleryContainer.classList.add('hidden');
        }
      }

      // Populate features list
      modalFeatures.innerHTML = '';
      data.features.forEach(feat => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2.5 text-slate-300 text-xs sm:text-sm';
        li.innerHTML = `
          <span class="w-4 h-4 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
            <i class="fa-solid fa-check"></i>
          </span>
          <span class="leading-relaxed">${feat}</span>
        `;
        modalFeatures.appendChild(li);
      });

      // Populate tech badges
      modalTech.innerHTML = '';
      data.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'px-2.5 py-1 text-xs rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 font-medium font-mono';
        span.textContent = t;
        modalTech.appendChild(span);
      });

      // Demo and CV buttons (if present)
      if (modalDemo) {
        if (data.demo && data.demo !== '#') {
          modalDemo.href = data.demo;
          modalDemo.target = '_blank';
          modalDemo.rel = 'noopener noreferrer';
          modalDemo.removeAttribute('download');
          modalDemo.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square text-xs"></i> <span>Kunjungi Sistem Live</span>`;
        } else {
          modalDemo.href = 'assets/cv-m-abdul-rahman.pdf';
          modalDemo.setAttribute('download', 'CV_M_Abdul_Rahman.pdf');
          modalDemo.target = '_self';
          modalDemo.removeAttribute('rel');
          modalDemo.innerHTML = `<i class="fa-solid fa-file-pdf text-xs"></i> <span>Lihat CV Lengkap</span>`;
        }
      }

      if (modalCode) {
        if (data.code && data.code.startsWith('https://wa.me')) {
          modalCode.href = data.code;
          modalCode.innerHTML = `<i class="fa-brands fa-whatsapp text-emerald-400 text-sm"></i> <span>Tanya Proyek via WA</span>`;
        } else {
          modalCode.href = data.code || '#';
        }
      }

      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. CONTACT FORM & INTERACTIVE TOAST
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      showToast('Harap lengkapi semua bidang yang ditandai bintang (*).', 'error');
      return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Mengirim Pesan...
    `;
    submitBtn.disabled = true;

    // Simulate sending
    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      showToast('Pesan berhasil terkirim! Terima kasih telah menghubungi M. Abdul Rahman.', 'success');
    }, 1100);
  });

  function showToast(msg, type = 'success') {
    if (!toast) return;

    if (toastMessage) toastMessage.textContent = msg;

    if (type === 'error') {
      toast.classList.remove('border-slate-700');
      toast.classList.add('border-rose-500/80');
    } else {
      toast.classList.remove('border-rose-500/80');
      toast.classList.add('border-slate-700');
    }

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}

/* ==========================================================================
   8. SCROLL REVEAL ANIMATION
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
