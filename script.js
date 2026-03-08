/**
 * XEBIC - Professional Dashboard Logic
 * GitHub: @sizning_profilingiz
 */

// 1. MA'LUMOTLAR BAZASI (Simulyatsiya)
const db = {
    masters: [
        { id: 1, name: "Ali Valiyev", job: "Santexnik", rating: 4.9, experience: 8, price: "150k", img: "https://i.pravatar.cc/150?u=1", status: "online" },
        { id: 2, name: "Sardor Azimov", job: "Elektrik", rating: 4.8, experience: 5, price: "120k", img: "https://i.pravatar.cc/150?u=2", status: "offline" },
        { id: 3, name: "Doston Akromov", job: "Kafelchi", rating: 4.7, experience: 10, price: "90k", img: "https://i.pravatar.cc/150?u=3", status: "online" },
        { id: 4, name: "Javohir Karimov", job: "Elektrik", rating: 5.0, experience: 12, price: "200k", img: "https://i.pravatar.cc/150?u=4", status: "online" }
    ],
    news: [
        { id: 1, title: "Sement narxi pasaydi", date: "Bugun, 10:30", category: "Bozor", text: "Qurilish materiallari bozorida sement 5% arzonlashdi...", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400" },
        { id: 2, title: "Yangi uylar uchun dizayn", date: "Kecha, 18:45", category: "Dizayn", text: "2024-yilda trendda bo'lgan loft uslubidagi interyerlar...", img: "https://images.unsplash.com/photo-1556912177-c54857056a2a?w=400" }
    ]
};

// 2. NAVIGATSIYA (Sections switching)
function showSection(sectionId) {
    // Barcha sectionlarni yashirish
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active-section'));
    // Barcha menyu tugmalaridan active klasini olib tashlash
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Kerakli sectionni ko'rsatish
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active-section');
        // Menyu tugmasini aktiv qilish
        const navItem = document.getElementById(`li-${sectionId}`);
        if (navItem) navItem.classList.add('active');
    }

    // Har safar section almashganda tepaga skroll qilish
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 3. MASTERLARNI RENDER QILISH
function renderMasters(data = db.masters) {
    const grid = document.getElementById('mastersGrid');
    const featuredGrid = document.getElementById('featuredMasters');
    
    const html = data.map(m => `
        <div class="master-card" data-job="${m.job}">
            <div style="display:flex; justify-content:space-between; align-items:flex-start">
                <div class="profile-pill" style="border:none; background:none; padding:0">
                    <img src="${m.img}" alt="${m.name}" style="width:60px; height:60px; border-radius:14px">
                    <div style="margin-left:12px">
                        <h4 style="font-size:1.1rem">${m.name}</h4>
                        <span style="font-size:0.8rem; color:var(--text-muted)">${m.job}</span>
                    </div>
                </div>
                <span class="status-pill ${m.status}">${m.status}</span>
            </div>
            
            <div style="margin:20px 0; display:flex; gap:15px">
                <div style="text-align:center; flex:1; background:var(--bg-main); padding:10px; border-radius:10px">
                    <small style="color:var(--text-muted)">Tajriba</small>
                    <p><b>${m.experience} yil</b></p>
                </div>
                <div style="text-align:center; flex:1; background:var(--bg-main); padding:10px; border-radius:10px">
                    <small style="color:var(--text-muted)">Narxi</small>
                    <p><b>${m.price}</b></p>
                </div>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between">
                <div style="color:#f59e0b"><i class="fas fa-star"></i> ${m.rating}</div>
                <button class="btn-pro" onclick="contactNow('${m.name}')" style="width:auto; padding:8px 20px">Band qilish</button>
            </div>
        </div>
    `).join('');

    if(grid) grid.innerHTML = html;
    if(featuredGrid) featuredGrid.innerHTML = html.slice(0, 2); // Dashboard uchun faqat 2ta
}

// 4. YANGILIKLARNI RENDER QILISH
function renderNews() {
    const newsGrid = document.getElementById('newsGrid');
    if(!newsGrid) return;

    newsGrid.innerHTML = db.news.map(n => `
        <div class="news-card" style="background:white; border-radius:16px; overflow:hidden; display:flex; gap:20px; box-shadow:var(--shadow); margin-bottom:20px">
            <img src="${n.img}" style="width:250px; height:180px; object-fit:cover">
            <div style="padding:20px">
                <span style="color:var(--primary); font-weight:700; font-size:0.8rem">${n.category}</span>
                <h3 style="margin:10px 0">${n.title}</h3>
                <p style="color:var(--text-muted); font-size:0.9rem">${n.text}</p>
                <div style="margin-top:15px; display:flex; justify-content:space-between; align-items:center">
                    <small style="color:var(--text-muted)">${n.date}</small>
                    <button class="filter-btn" style="background:var(--primary-light); color:var(--primary)">O'qish</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 5. SMART SEARCH (Global qidiruv)
function smartSearch() {
    const query = document.getElementById('globalSearch').value.toLowerCase();
    
    // Qidiruv ustida ishlash (faqat masterlar misolida)
    const filtered = db.masters.filter(m => 
        m.name.toLowerCase().includes(query) || 
        m.job.toLowerCase().includes(query)
    );

    renderMasters(filtered);

    // Agar qidiruv bo'sh bo'lmasa, avtomatik "Ustalar" bo'limiga o'tish (ixtiyoriy)
    if(query.length > 2) {
        showSection('ustalar');
    }
}

// 6. FILTRLARNI BOSHQARISH
document.addEventListener('click', (e) => {
    if(e.target.classList.contains('filter-btn')) {
        // Active klassni boshqarish
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const filterValue = e.target.innerText;
        if(filterValue === 'Hammasi') {
            renderMasters();
        } else {
            const filtered = db.masters.filter(m => m.job === filterValue);
            renderMasters(filtered);
        }
    }
});

// 7. INTERAKTIV FUNKSIYALAR
function contactNow(name) {
    Swal.fire({
        title: 'Muvaffaqiyatli!',
        text: `${name} bilan bog'lanish uchun so'rov yuborildi. Tezpada sizga javob berishadi.`,
        icon: 'success',
        confirmButtonColor: '#6366f1'
    });
}

// Sahifa yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    renderMasters();
    renderNews();
    
    // Toast xabarnoma (Professional ko'rinish uchun)
    console.log("XEBIC Dashboard v1.0 yuklandi...");
});

function saveProfileData() {
    const name = document.getElementById('p-name').value;
    const job = document.getElementById('p-job').value;

    if(name) {
        localStorage.setItem('xebic_user_name', name);
        localStorage.setItem('xebic_user_job', job);
        
        // UI ni yangilash
        document.getElementById('p-name-display').innerText = name;
        document.getElementById('p-job-display').innerHTML = `<i class="fas fa-briefcase"></i> ${job}`;
        document.getElementById('userNameDisplay').innerText = name;

        Swal.fire({
            icon: 'success',
            title: 'Saqlandi!',
            text: 'Profil ma’lumotlari muvaffaqiyatli yangilandi.',
            timer: 1500,
            showConfirmButton: false
        });
    }
}

// 1. Modal oynasini boshqarish
function openEditModal() {
    document.getElementById('editModal').classList.add('active');
    // Mavjud ma'lumotlarni inputga to'ldirish
    document.getElementById('inputFullName').value = document.getElementById('displayFullName').innerText;
    document.getElementById('inputPhone').value = document.getElementById('displayPhone').innerText;
    document.getElementById('inputLocation').value = document.getElementById('displayLocation').innerText.trim();
    document.getElementById('inputJob').value = document.getElementById('displayJob').innerText;
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

// 2. Ma'lumotlarni saqlash funksiyasi
function saveProfile() {
    const newName = document.getElementById('inputFullName').value;
    const newPhone = document.getElementById('inputPhone').value;
    const newLocation = document.getElementById('inputLocation').value;
    const newJob = document.getElementById('inputJob').value;

    // UI ni yangilash
    document.getElementById('displayFullName').innerHTML = `${newName} <i class="fas fa-check-circle verified"></i>`;
    document.getElementById('displayPhone').innerText = newPhone;
    document.getElementById('displayLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${newLocation}`;
    document.getElementById('displayJob').innerText = newJob;

    // Lokal xotiraga saqlash
    const userData = { newName, newPhone, newLocation, newJob };
    localStorage.setItem('xebec_user', JSON.stringify(userData));

    closeEditModal();
    alert("Ma'lumotlar muvaffaqiyatli saqlandi!");
}

// 3. Profil rasmiga rasm yuklash
document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('userAvatar').src = event.target.result;
            // Rasmni ham saqlab qo'yish mumkin (base64)
            localStorage.setItem('user_avatar', event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// 4. Tablarni almashtirish
function switchTab(element, tabName) {
    document.querySelectorAll('.tab-item').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    
    const content = document.getElementById('tabContent');
    if(tabName === 'reviews') {
        content.innerHTML = '<div class="empty-state"><p>Hali sharhlar yoq</p></div>';
    } else if(tabName === 'security') {
        content.innerHTML = '<div class="info-card"><h4>Parolni o\'zgartirish</h4><button class="btn-primary-sm">O\'zgartirish</button></div>';
    } else {
        content.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>E\'lonlar mavjud emas</p></div>';
    }
}

function switchTab(element, tabName) {
    // Tablarni aktiv qilish
    document.querySelectorAll('.tab-item').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    
    const contentWrapper = document.getElementById('tabContent');
    
    // Animatsiya qo'shish
    contentWrapper.style.opacity = '0';
    contentWrapper.style.transform = 'translateY(10px)';

    setTimeout(() => {
        let html = '';

        if (tabName === 'ads') {
            html = `
                <div class="content-header fade-in">
                    <h3>E'lonlarim</h3>
                    <button class="btn-add-new"><i class="fas fa-plus-circle"></i> Yangi qo'shish</button>
                </div>
                <div class="empty-state-advanced fade-in">
                    <div class="illustration-box"><i class="fas fa-folder-plus"></i></div>
                    <h4>E'lonlar mavjud emas</h4>
                    <p>Sizda hali birorta ham e'lon yo'q.</p>
                </div>
            `;
        } else if (tabName === 'reviews') {
            html = `
                <div class="content-header fade-in"><h3>Mijozlar sharhlari</h3></div>
                <div class="review-stats">
                    <div class="stat-card"><h4>4.8</h4><p>O'rtacha reyting</p></div>
                </div>
                <div class="empty-state-advanced fade-in">
                    <p>Hali sharhlar kelib tushmadi.</p>
                </div>
            `;
        } else if (tabName === 'security') {
            html = `
                <div class="content-header fade-in"><h3>Xavfsizlik sozlamalari</h3></div>
                <div class="info-card fade-in">
                    <div class="security-row">
                        <div><strong>Ikki bosqichli autentifikatsiya</strong><p>Hisobingizni himoya qiling</p></div>
                        <button class="btn-primary-sm">Yoqish</button>
                    </div>
                </div>
            `;
        }

        contentWrapper.innerHTML = html;
        contentWrapper.style.opacity = '1';
        contentWrapper.style.transform = 'translateY(0)';
    }, 200);
}


function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const speed = 200; // qanchalik tez o'sishi

        const updateCount = () => {
            const increment = target / speed;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target.toLocaleString(); // raqamlarni ajratib ko'rsatish (12,500,000)
            }
        };
        updateCount();
    });
}

// Sahifa yuklanganda ishga tushirish
window.onload = animateCounters;


let cartCount = 0;

// 1. Savatga qo'shish funksiyasi
function addToCart(btn) {
    cartCount++;
    document.getElementById('cartCount').innerText = cartCount;
    
    // Vizual feedback (tugma yashil bo'lishi)
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = '#10b981';
    btn.style.color = 'white';
    
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = '#f1f5f9';
        btn.style.color = '#1e293b';
    }, 1000);
}

// 2. Kategoriyalar bo'yicha filtr (Oddiy va samarali)
function filterMarket(category) {
    // Tugmalar rangini yangilash
    document.querySelectorAll('.cat-chip').forEach(chip => {
        chip.classList.remove('active');
        if(chip.innerText.toLowerCase().includes(category) || (category === 'all' && chip.innerText === 'Hammasi')) {
            chip.classList.add('active');
        }
    });

    // Kartalarni filtrlash
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// 1. Dark Mode funksiyasi
function toggleDarkMode() {
    const isDark = document.getElementById('darkModeToggle').checked;
    if(isDark) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
}

// Sahifa yuklanganda mavzuni tekshirish
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'dark') {
        document.getElementById('darkModeToggle').checked = true;
        document.body.classList.add('dark-theme');
    }
});

// 2. Akkauntni o'chirish (Tasdiqlash bilan)
document.querySelector('.btn-danger-sm').addEventListener('click', () => {
    const confirmDelete = confirm("Haqiqatan ham hisobingizni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!");
    if(confirmDelete) {
        alert("Hisob o'chirildi (Simulyatsiya)");
        // Logika bu yerda davom etadi
    }
});


// Ustalar ma'lumotlar bazasi (Simulyatsiya)
const mastersData = [
    { id: 1, name: "Ali Valiyev", job: "Elektrik", exp: "5 yil", rating: 4.9, price: "100k", img: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Sardor Rahimov", job: "Santexnik", exp: "8 yil", rating: 4.7, price: "80k", img: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Jasur Hamroyev", job: "Malyar", exp: "3 yil", rating: 4.5, price: "70k", img: "https://i.pravatar.cc/150?u=3" }
];

function renderMasters(data) {
    const grid = document.getElementById('mastersGrid');
    document.getElementById('totalMasters').innerText = data.length;
    
    grid.innerHTML = data.map(master => `
        <div class="master-card-premium animate-fade-in" data-job="${master.job}">
            <div class="master-status"></div>
            <div class="master-profile">
                <img src="${master.img}" class="master-avatar" alt="${master.name}">
                <div class="master-info">
                    <h4>${master.name} <i class="fas fa-check-circle text-blue" style="font-size: 12px"></i></h4>
                    <span class="master-job">${master.job}</span>
                </div>
            </div>
            <div class="master-stats">
                <div class="stat-box"><span>Tajriba</span><b>${master.exp}</b></div>
                <div class="stat-box"><span>Reyting</span><b><i class="fas fa-star text-orange"></i> ${master.rating}</b></div>
            </div>
            <button class="btn-contact" onclick="contactMaster('${master.id}')">
                <i class="fas fa-comment-alt"></i> Bog'lanish
            </button>
        </div>
    `).join('');
}

// 1. Qidiruv funksiyasi
function searchMasters() {
    const query = document.getElementById('masterSearch').value.toLowerCase();
    const filtered = mastersData.filter(m => 
        m.name.toLowerCase().includes(query) || m.job.toLowerCase().includes(query)
    );
    renderMasters(filtered);
}

// 2. Job bo'yicha filtr
function filterByJob(job) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');

    if(job === 'all') {
        renderMasters(mastersData);
    } else {
        const filtered = mastersData.filter(m => m.job === job);
        renderMasters(filtered);
    }
}

// Sahifa yuklanganda render qilish
document.addEventListener('DOMContentLoaded', () => renderMasters(mastersData));


// Modalni ochish/yopish
function toggleAuthModal(action) {
    const modal = document.getElementById('loginModal');
    if(action === 'open') {
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
    }
}

// Kirish va Ro'yxatdan o'tish tablarini almashtirish
function switchAuthTab(type) {
    const regFields = document.getElementById('registerFields');
    const authBtn = document.getElementById('authBtn');
    const subtitle = document.getElementById('authSubtitle');
    
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    
    if(type === 'register') {
        document.getElementById('tabRegister').classList.add('active');
        regFields.style.display = 'block';
        authBtn.innerText = "Ro'yxatdan o'tish";
        subtitle.innerText = "XEBEC hamjamiyatiga qo'shiling";
    } else {
        document.getElementById('tabLogin').classList.add('active');
        regFields.style.display = 'none';
        authBtn.innerText = "Kirish";
        subtitle.innerText = "Davom etish uchun hisobingizga kiring";
    }
}

// Formani yuborish
function handleAuth(event) {
    event.preventDefault();
    const email = document.getElementById('authEmail').value;
    
    // Simulyatsiya: Muvaffaqiyatli kirish
    alert(`Xush kelibsiz, ${email}! Tizimga muvaffaqiyatli kirdingiz.`);
    toggleAuthModal('close');
    
    // Bu yerda profil menyusini yangilash mumkin
    document.querySelector('.profile-title h2').innerText = email.split('@')[0];
}

let cart = [];

function addToCart(productId) {
    const item = constructionProducts.find(p => p.id === productId);
    cart.push(item);
    
    // Headerdagi savatcha belgisini yangilash
    const cartCount = document.querySelector('.icon-circle span'); 
    if(cartCount) {
        cartCount.innerText = cart.length;
        cartCount.style.background = "#ff4d4d"; // Yangi narsa qo'shilsa qizil bo'lsin
    }
    
    console.log("Savatchada:", cart);
}

function toggleMenu() {
    // Nuqta qo'yishni unutmang, bu klass ekanligini bildiradi
    const navbar = document.querySelector('.side-nav'); 
    
    if (navbar) {
        navbar.classList.toggle('active');
        console.log("Menyu holati o'zgardi");
    } else {
        // Agar xato bo'lsa, konsolda ko'rinadi
        console.error("Xato: .side-nav topilmadi!");
    }
}
function showSection(sectionId) {
    // 1. Barcha bo'limlarni yashirish
    const sections = ['dash', 'ustalar', 'bozor', 'news', 'profil', 'sozlamalar'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // 2. Tanlangan bo'limni ko'rsatish
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block';
    }

    // 3. Mobil sidebar ochiq bo'lsa, uni avtomat yopish
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.remove('active');

    // 4. Pastki navigatsiyada aktiv holatni yangilash (ixtiyoriy)
    console.log("Hozirgi bo'lim: " + sectionId);
}


// SAHIFANI TEKSHIRISH
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('Xebec_Persistent_User');
    if (savedUser) {
        unlockProfile(JSON.parse(savedUser));
    }
});

// LOGIN / SIGN IN FUNKSIYASI
function initiateUserSession(event) {
    event.preventDefault();
    
   const user = {
    name: document.getElementById('regFullName').value,
    // USERNAME QISMI QO'SHILDI
    username: document.getElementById('regUsername').value.toLowerCase().trim(), 
    email: document.getElementById('regEmail').value,
    id: Math.floor(1000 + Math.random() * 9000), // Random ID
    joinDate: new Date().toLocaleDateString() //
};

    // LOCALSTORAGEGA SAQLASH (ABADIIY)
    localStorage.setItem('Xebec_Persistent_User', JSON.stringify(user));
    unlockProfile(user);
}

// PROFILNI OCHISH
function unlockProfile(user) {
    document.getElementById('auth-gate').style.display = 'none';
    document.getElementById('real-profile-content').style.display = 'block';
    
    // Foydalanuvchi ma'lumotlarini kiritish
    document.getElementById('displayFullName').innerHTML = `${user.name} <i class="fas fa-check-circle verified"></i>`;
    
    // @USERNAME QISMI QO'SHILDI
    if(user.username) {
        document.getElementById('displayUsername').innerText = `@${user.username}`;
    }
    
    document.getElementById('displayID').innerText = `#${user.id}`;
    document.getElementById('displayJoinedDate').innerText = user.joinDate;
}

// HISOBNI O'CHIRISH (SIZ AYTGAN DELETE)
function confirmAccountDeletion() {
    if(confirm("Diqqat! Hisobni o'chirsangiz, barcha ma'lumotlaringiz abadiy yo'qoladi. Rozimisiz?")) {
        localStorage.removeItem('Xebec_Persistent_User');
        location.reload();
    }
}

function handleLogout() {
    // Chiqishda ma'lumot o'chmaydi, shunchaki login oynasi qaytadi
    document.getElementById('real-profile-content').style.display = 'none';
    document.getElementById('auth-gate').style.display = 'block';
}

// Username orqali qidirish funksiyasi
function searchByUserHandle(handle) {
    const searchInput = document.querySelector('.search-bar input').value;
    
    if (searchInput.startsWith('@')) {
        const query = searchInput.substring(1).toLowerCase();
        console.log(`Foydalanuvchi qidirilmoqda: ${query}`);
        // Bu yerda kelajakda bazadan qidirish mantiqi bo'ladi
    }
}

function loadUserInfo() {
    const userData = JSON.parse(localStorage.getItem('Xebec_Persistent_User'));
    
    if (userData) {
        document.getElementById('displayID').innerText = `#${userData.id || '9874'}`;
        document.getElementById('displayPhone').innerText = userData.phone || '+998 90 123 45 67';
        document.getElementById('displayTelegram').innerText = userData.telegram || '@username';
        document.getElementById('displayJob').innerText = userData.job || 'Bosh Administrator';
        document.getElementById('displayCity').innerText = userData.city || 'Toshkent, O\'zbekiston';
        document.getElementById('displayJoinedDate').innerText = userData.joinDate || '08.03.2026';
    }
}

// Sahifa yuklanganda ma'lumotlarni to'ldirish
window.onload = loadUserInfo;

// Tahrirlash rejimini yoqish/o'chirish
function toggleEdit(field) {
    const displayElement = document.getElementById(`display${field}`);
    const inputElement = document.getElementById(`edit${field}`);
    const saveBtn = document.getElementById(`save${field}`);
    
    // Matnni inputga o'tkazish
    inputElement.value = displayElement.innerText;
    
    // Elementlarni ko'rsatish/yashirish
    displayElement.style.display = 'none';
    inputElement.style.display = 'inline-block';
    saveBtn.style.display = 'inline-block';
    inputElement.focus();
}

// Tahrirlash rejimini yoqish/o'chirish
function toggleEdit(field) {
    const displayElement = document.getElementById(`display${field}`);
    const inputElement = document.getElementById(`edit${field}`);
    const saveBtn = document.getElementById(`save${field}`);
    
    if (!displayElement || !inputElement || !saveBtn) return; // Element topilmasa to'xtatish

    // Matnni inputga o'tkazish
    inputElement.value = displayElement.innerText;
    
    // Elementlarni ko'rsatish/yashirish
    displayElement.style.display = 'none';
    inputElement.style.display = 'inline-block';
    saveBtn.style.display = 'inline-block';
    inputElement.focus();
}

// Ma'lumotni saqlash
function saveField(field) {
    const displayElement = document.getElementById(`display${field}`);
    const inputElement = document.getElementById(`edit${field}`);
    const saveBtn = document.getElementById(`save${field}`); // BU YERDA XATO BOR EDI
    
    if (!displayElement || !inputElement || !saveBtn) return;

    const newValue = inputElement.value;
    displayElement.innerText = newValue;

    // LocalStorage ni yangilash
    const userData = JSON.parse(localStorage.getItem('Xebec_Persistent_User')) || {};
    
    // Maydon nomini bazaga moslash
    const dbField = field.toLowerCase();
    
    // Obyektdagi kalitlarni tekshirib saqlash
    if (dbField === 'city') {
        userData.city = newValue;
    } else if (dbField === 'job') {
        userData.job = newValue;
    } else {
        userData[dbField] = newValue;
    }
    
    localStorage.setItem('Xebec_Persistent_User', JSON.stringify(userData));

    // Elementlarni qaytarish
    displayElement.style.display = 'inline-block';
    inputElement.style.display = 'none';
    saveBtn.style.display = 'none';
}

function toggleDrawer() {
    const drawer = document.getElementById('settingsDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    drawer.classList.toggle('open');
    
    // Overlayni ko'rsatish yoki yashirish
    if (drawer.classList.contains('open')) {
        overlay.style.display = 'block';
    } else {
        overlay.style.display = 'none';
    }
}