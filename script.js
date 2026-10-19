// State Management
let currentTemp = 24;
let currentSlide = 0;

// Data untuk Galeri Dokumentasi 7 Hari
// 1. Data kegiatan tetap 5 Hari
const activitiesData = [
    {
        day: 1,
        title: "Hari 1: Membaca Al-Qur'an. ",
        img: "day5.png",
        desc: "Dalam Foto tersebut terlihat kegiatan kami sedang membaca Al-Qur'an surat Ar-rum: 41 dan Q.S Al-A'raf: 56. Kedua ayat tersebut menjelaskan tentang Larangan merusak alam dan bumi. Melalui kegiatan membaca dan mentadaburi Al-Qur'an ini diharapkan dapat membangun kesadaran kita bersama untuk senantiasa menjaga dan melestarikan alam sebagai wujud tanggung jawab kita sabagai khalifah di bumi"
     },
    {
        day: 2,
        title: "Hari 2: Observasi di LAB",
        img: "day2.2.png",
        desc: "Dalam foto tersebut, pada hari kedua kami sedang melakukan observasi dilingkungan kampus terkait pemborosan listrik, terutama pada penggunaan AC, yang masih menyala meskipun ruangan tidak dipakai/tidak digunakan.Sebagaimana yang tercantum dalam Q.S Al-A'raf Ayat 31. yang dimana ayat tersebut menjadi pengingat bagi kita untuk menggunakan energi listrik secara bijak dan tidak berlebihan sebagai bentuk rasa syukur atas nikmat yang Allah berikan. "
    },
    {
        day: 3,
        title: "Hari 3: Diskusi pluralis terkait pemborosan listrik",
        img: "day3.3.png",
        desc: "kelompok kami melakukan Diskusi Pluralis terkait temuan pemborosan listrik, khususnya pada penggunaan AC di lingkungan kampus. Diskusi ini kami analisis dari tiga sudut pandang:"
    },
    {
        day: 4,
        title: "Hari 4: Merancang Proyek eco-kampus monitoring web",
        img: "day4.png",
        desc: "kelompok kami merancang satu aksi nyata sebagai solusi atas permasalahan pemborosan listrik AC di kampus. Aksi ini kami sesuaikan dengan keahlian kami sebagai mahasiswa Teknologi Informasi, dengan konsep _low-tech / appropriate"
    },
    {
        day: 5,
        title: "Hari 5: Menulis refleksi pribadi",
        img: "day1.png",
        desc: "Setelah observasi, diskusi dari 3 sudut pandang, dan membuat web ini, cara pandang kami berubah."
    }
];

let currentIndex = 0;

function renderSlide() {
    const slidesContainer = document.getElementById("carousel-slides");
    const currentData = activitiesData[currentIndex];
    
    // Ini bagian yang mengontrol angka total (Sekarang otomatis bernilai 5)
   const totalDays = 5; 


    slidesContainer.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6 items-center transition-all duration-300">
            <!-- Gambar -->
            <div class="w-full md:w-1/2 flex justify-center">
                <img src="${currentData.img}" alt="${currentData.title}" class="w-full aspect-[3/4] max-h-[400px] md:max-h-[450px] object-cover rounded-2xl shadow-md">
            </div>
            <!-- Teks -->
            <div class="w-full md:w-1/2 flex flex-col justify-center">
                
                <!-- BADGE HIJAU: Sekarang akan tertulis "HARI KE-2 DARI 5" ketika di slide kedua -->
                <div class="mb-3">
                    <span class="inline-block px-3 py-1 bg-emerald-950/80 text-emerald-400 font-bold text-xs rounded-full uppercase tracking-wider border border-emerald-500/20">
                        HARI KE-${currentData.day} DARI ${totalDays}
                    </span>
                </div>

                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    ${currentData.title}
                </h3>
                <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    ${currentData.desc}
                </p>
            </div>
        </div>
    `;

    renderIndicators();
}

function renderIndicators() {
    const indicatorsContainer = document.getElementById("carousel-indicators");
    indicatorsContainer.innerHTML = "";
    
    activitiesData.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.className = `h-2 rounded-full transition-all duration-300 ${
            index === currentIndex ? "w-6 bg-emerald-600" : "w-2 bg-slate-300 dark:bg-slate-600"
        }`;
        dot.addEventListener("click", () => {
            currentIndex = index;
            renderSlide();
        });
        indicatorsContainer.appendChild(dot);
    });
}

document.getElementById("prev-slide").addEventListener("click", () => {
    currentIndex = (currentIndex === 0) ? activitiesData.length - 1 : currentIndex - 1;
    renderSlide();
});

document.getElementById("next-slide").addEventListener("click", () => {
    currentIndex = (currentIndex === activitiesData.length - 1) ? 0 : currentIndex + 1;
    renderSlide();
});

document.addEventListener("DOMContentLoaded", renderSlide);


// Calculation Functions
function calculateMetrics(temp) {
    // Estimasi sederhana berdasarkan suhu AC
    // 18C = ~750W, 24C = ~380W, 30C = ~150W
    const watt = Math.round(750 - (temp - 18) * 50);
    
    // Estimasi Biaya (8 jam per hari, 30 hari, Rp 1.444 per kWh)
    const kWhPerMonth = (watt * 8 * 30) / 1000;
    const cost = Math.round(kWhPerMonth * 1444);
    
    // Estimasi Emisi Karbon (0.85 kg CO2 per kWh di Indonesia)
    const carbon = Math.round(kWhPerMonth * 0.85);

    return { watt, cost, carbon };
}

// Update Remot UI
function updateThermostatUI() {
    const tempDisplay = document.getElementById('temp-display');
    const tempRange = document.getElementById('temp-range');
    const badge = document.getElementById('temp-recommendation-badge');
    const statusBadge = document.getElementById('ac-status-badge');
    
    const valWatt = document.getElementById('val-watt');
    const valCost = document.getElementById('val-cost');
    const valCarbon = document.getElementById('val-carbon');
    
    const recBox = document.getElementById('recommendation-box');
    const recTitle = document.getElementById('rec-title');
    const recDesc = document.getElementById('rec-desc');

    // Sync state
    tempDisplay.textContent = currentTemp;
    tempRange.value = currentTemp;

    // Recalculate
    const { watt, cost, carbon } = calculateMetrics(currentTemp);
    valWatt.textContent = `${watt} Watt`;
    valCost.textContent = `Rp ${cost.toLocaleString('id-ID')}`;
    valCarbon.textContent = `${carbon} Kg CO2`;

    // Dynamic Feedback based on temperature
    if (currentTemp >= 24 && currentTemp <= 26) {
        statusBadge.textContent = "SANGAT EFISIEN";
        statusBadge.className = "px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]";
        badge.textContent = "Suhu Ideal Penghematan Energi";
        
        recBox.className = "p-5 rounded-xl border transition-all duration-300 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50";
        recTitle.className = "font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2";
        recTitle.innerHTML = `<i class="fa-solid fa-circle-check"></i> Pengaturan Sangat Efisien (Direkomendasikan)`;
        recDesc.textContent = "Suhu 24°C - 26°C merupakan titik keseimbangan terbaik antara kenyamanan termal dan efisiensi listrik. Kompresor bekerja ringan tanpa beban berlebih.";
    } else if (currentTemp < 24) {
        statusBadge.textContent = "PEMBOROSAN ENERGI";
        statusBadge.className = "px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px]";
        badge.textContent = "Suhu Terlalu Dingin (Tidak Efisien)";
        
        recBox.className = "p-5 rounded-xl border transition-all duration-300 bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800/50";
        recTitle.className = "font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2";
        recTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Peringatan Boros Listrik!`;
        recDesc.textContent = `Menyetel suhu ke ${currentTemp}°C membuat kompresor bekerja terus-menerus tanpa berhenti. Hal ini menaikkan biaya hingga 40% dan melanggar prinsip penghematan harta (Hifdh al-Mal).`;
    } else {
        statusBadge.textContent = "HEMAT MAKSIMAL";
        statusBadge.className = "px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px]";
        badge.textContent = "Suhu Ekonomis";
        
        recBox.className = "p-5 rounded-xl border transition-all duration-300 bg-sky-50 border-sky-200 dark:bg-sky-950/30 dark:border-sky-800/50";
        recTitle.className = "font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2";
        recTitle.innerHTML = `<i class="fa-solid fa-leaf"></i> Mode Super Hemat`;
        recDesc.textContent = "Suhu ini sangat hemat energi, namun pastikan ventilasi udara terjaga agar ruangan tetap terasa segar.";
    }
}

// Carousel Documentation Functions
function renderCarousel() {
    const slideContainer = document.getElementById('carousel-slides');
    const indicatorContainer = document.getElementById('carousel-indicators');

    // Inject Slides
    slideContainer.innerHTML = activitiesData.map((item, index) => `
        <div class="carousel-slide ${index === currentSlide ? 'block' : 'hidden'} grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div class="md:col-span-6 rounded-2xl overflow-hidden shadow-md h-56 md:h-64">
                <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover">
            </div>
            <div class="md:col-span-6 space-y-3">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 inline-block">
                    HARI KE-${item.day} DARI 7
                </span>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white">${item.title}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${item.desc}</p>
            </div>
        </div>
    `).join('');

    // Inject Indicators
    indicatorContainer.innerHTML = activitiesData.map((_, index) => `
        <button onclick="goToSlide(${index})" class="w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-emerald-500 w-6' : 'bg-slate-300 dark:bg-slate-600'}"></button>
    `).join('');
}

function goToSlide(index) {
    currentSlide = index;
    renderCarousel();
}

// Event Listeners Initialization
document.addEventListener('DOMContentLoaded', () => {
    
    // Remot AC controls
    document.getElementById('btn-temp-up').addEventListener('click', () => {
        if (currentTemp < 30) {
            currentTemp++;
            updateThermostatUI();
        }
    });

    document.getElementById('btn-temp-down').addEventListener('click', () => {
        if (currentTemp > 18) {
            currentTemp--;
            updateThermostatUI();
        }
    });

    document.getElementById('temp-range').addEventListener('input', (e) => {
        currentTemp = parseInt(e.target.value);
        updateThermostatUI();
    });

    // Carousel controls
    document.getElementById('prev-slide').addEventListener('click', () => {
        currentSlide = (currentSlide === 0) ? activitiesData.length - 1 : currentSlide - 1;
        renderCarousel();
    });

    document.getElementById('next-slide').addEventListener('click', () => {
        currentSlide = (currentSlide === activitiesData.length - 1) ? 0 : currentSlide + 1;
        renderCarousel();
    });

    // Educational Tab Navigation
    const tabBtns = document.querySelectorAll('.edu-tab-btn');
    const tabContents = document.querySelectorAll('.edu-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabContents.forEach(content => {
                if (content.id === `tab-${targetTab}`) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // Dark/Light Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    function initTheme() {
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            darkIcon.classList.remove('hidden');
            lightIcon.classList.between && lightIcon.classList.add('hidden');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        }
    });

    // First render
    initTheme();
    updateThermostatUI();
    renderCarousel();
});