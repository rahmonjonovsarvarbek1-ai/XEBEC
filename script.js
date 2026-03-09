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

// 1. Sahifa yuklanganda saqlangan rasmni barcha joyga qaytarish
window.addEventListener('DOMContentLoaded', () => {
    const savedAvatar = localStorage.getItem('user_avatar'); // Skrinshotingizdagi kalit bilan bir xil qildik
    if (savedAvatar) {
        updateAvatarElements(savedAvatar);
    }
});

// 2. Rasmni barcha joyda (profil va pill) yangilash
function updateAvatarElements(src) {
    const mainImg = document.getElementById('userAvatar'); // Profil sahifasidagi katta rasm
    const pillImg = document.querySelector('.profile-pill img'); // Tepada turadigan kichik rasm
    const postEditorAvatar = document.querySelector('.muhokama-input-section .user-avatar'); // "Nimalar bo'lyapti" yonidagi rasm

    if (mainImg) mainImg.src = src;
    if (pillImg) pillImg.src = src;
    if (postEditorAvatar) postEditorAvatar.src = src;
}

// 3. Postlarni tahrirlash funksiyasi
function editPost(postId) {
    let posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
    const post = posts.find(p => p.id === postId);
    if (post) {
        const newText = prompt("Xabarni tahrirlang:", post.text);
        if (newText !== null && newText.trim() !== "") {
            post.text = newText;
            localStorage.setItem('Xebec_Global_Feed', JSON.stringify(posts));
            renderGlobalTalks();
        }
    }
}

// 4. Postni o'chirish funksiyasi
function deletePost(postId) {
    if (confirm("Ushbu xabarni o'chirishni xohlaysizmi?")) {
        let posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
        posts = posts.filter(p => p.id !== postId);
        localStorage.setItem('Xebec_Global_Feed', JSON.stringify(posts));
        renderGlobalTalks();
    }
}

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

function switchTab(element, tabName) {
    // 1. Aktiv klassni tugmalardan olib tashlash va bosilganiga qo'shish
    document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');

    const contentWrapper = document.getElementById('tabContent');
    
    // 2. Tab ismiga qarab kontentni generatsiya qilish
    let html = '';

    if (tabName === 'ads') {
        html = `
            <div class="animate-fade-in">
                <div class="content-header">
                    <h3>Faol e'lonlaringiz</h3>
                    <button class="btn-add-new"><i class="fas fa-plus-circle"></i> Yangi qo'shish</button>
                </div>
                <div class="empty-state-advanced">
                    <div class="illustration-box"><i class="fas fa-folder-plus"></i></div>
                    <h4>Hozircha hech narsa yo'q</h4>
                    <p>Siz hali biron bir xizmat yoki mahsulot bo'yicha e'lon bermadingiz.</p>
                </div>
            </div>`;
    } else if (tabName === 'reviews') {
        html = `
            <div class="animate-fade-in">
                <div class="content-header">
                    <h3>Mijozlar sharhlari</h3>
                </div>
                <div class="reviews-list">
                    <div class="review-item">
                        <div class="review-user"><strong>Ali Valiyev</strong> <span>⭐⭐⭐⭐⭐</span></div>
                        <p>"Juda tez va sifatli xizmat ko'rsatishdi, tavsiya qilaman!"</p>
                        <small>2 kun avval</small>
                    </div>
                </div>
            </div>`;
    } else if (tabName === 'security') {
        html = `
            <div class="animate-fade-in">
                <div class="content-header">
                    <h3>Xavfsizlik sozlamalari</h3>
                </div>
                <div class="security-form">
                    <div class="input-group">
                        <label>Joriy parol</label>
                        <input type="password" id="currentPass" placeholder="********">
                    </div>
                    <div class="input-group">
                        <label>Yangi parol</label>
                        <input type="password" id="newPass" placeholder="Yangi parol">
                    </div>
                    <button class="btn-save-security" onclick="updatePassword()">Parolni yangilash</button>
                </div>
            </div>`;
    }

    contentWrapper.innerHTML = html;
}

// E'lonlarni yuklash funksiyasi
function renderMyAds() {
    const adsList = document.getElementById('myAdsList');
    const badge = document.querySelector('.tab-badge'); // Tepadagi raqam
    
    // LocalStorage'dan XEBEC e'lonlarini olish
    const myAds = JSON.parse(localStorage.getItem('Xebec_Ads')) || [];
    
    // Tabdagi raqamni yangilash
    if(badge) badge.innerText = myAds.length;
    if(document.getElementById('adsCount')) document.getElementById('adsCount').innerText = myAds.length;

    if (myAds.length === 0) {
        adsList.innerHTML = `
            <div class="empty-state-advanced">
                <div class="illustration-box"><i class="fas fa-folder-plus"></i></div>
                <h4>Hozircha e'lonlar yo'q</h4>
                <p>Yangi e'lon qo'shish tugmasini bosing.</p>
            </div>`;
        return;
    }

    adsList.innerHTML = myAds.map((ad, index) => `
        <div class="ad-card animate-slide-up">
            <span class="ad-status">Aktiv</span>
            <h4>${ad.title}</h4>
            <p>${ad.category}</p>
            <div class="ad-actions">
                <button class="btn-delete-ad" onclick="deleteAd(${index})">
                    <i class="fas fa-trash"></i> O'chirish
                </button>
            </div>
        </div>
    `).join('');
}

// E'lonni o'chirish
function deleteAd(index) {
    if(confirm("Ushbu e'lonni o'chirishni xohlaysizmi?")) {
        let myAds = JSON.parse(localStorage.getItem('Xebec_Ads')) || [];
        myAds.splice(index, 1);
        localStorage.setItem('Xebec_Ads', JSON.stringify(myAds));
        renderMyAds();
    }
}

function addGlobalPost() {
    const input = document.getElementById('globalPostInput');
    const text = input.value.trim();
    
    if(!text) return;

    const newPost = {
        id: Date.now(),
        userName: "Sarvarbek", // Profilingizdagi ism
        handle: "@sarvar",
        text: text,
        time: "Hozir"
    };

    let posts = JSON.parse(localStorage.getItem('Xebec_Global_Talks')) || [];
    posts.unshift(newPost);
    localStorage.setItem('Xebec_Global_Talks', JSON.stringify(posts));

    input.value = '';
    renderGlobalTalks();
}

function renderGlobalTalks() {
    const feed = document.getElementById('globalFeed');
    const posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
    
    // Hozirgi saqlangan profil rasmini olamiz
    const currentAvatar = localStorage.getItem('user_avatar');

    feed.innerHTML = posts.map(post => {
        // Agar post sizniki bo'lsa (@sarvar), har doim oxirgi saqlangan rasmni ko'rsatamiz
        // Agar rasm bo'lmasa, ko'k doira va harf chiqadi
        let avatarHTML;
        
        if (post.handle === "@sarvar" && currentAvatar) {
            avatarHTML = `<img src="${currentAvatar}" class="user-mini-avatar">`;
        } else if (post.avatar) {
            avatarHTML = `<img src="${post.avatar}" class="user-mini-avatar">`;
        } else {
            avatarHTML = `<div class="user-initial-avatar">${post.user[0]}</div>`;
        }

        return `
        <div class="feed-card animate-slide-up">
            ${avatarHTML}
            <div class="post-main">
                <div class="post-header">
                    <div class="header-info">
                        <strong>${post.user}</strong> <i class="fas fa-check-circle verified"></i>
                        <span class="post-handle">${post.handle} · ${post.time}</span>
                    </div>
                    <div class="post-options">
                        <i class="fas fa-edit" onclick="editPost(${post.id})"></i>
                        <i class="fas fa-trash" onclick="deletePost(${post.id})"></i>
                    </div>
                </div>
                <div class="post-text">${post.text}</div>
                ${post.image ? `<img src="${post.image}" class="post-content-img">` : ''}
                <div class="post-footer">
                    <div class="action-unit"><i class="far fa-comment"></i> 0</div>
                    <div class="action-unit"><i class="far fa-heart"></i> 0</div>
                    <div class="action-unit"><i class="far fa-share-square"></i></div>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function showSection(sectionId) {
    // Bo'limlarni ko'rsatish mantiqi...
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';

    // NAVIGATSIYADAGI AKTIVLIKNI YANGILASH
    document.querySelectorAll('.nav-item-mobile').forEach(item => {
        item.classList.remove('active');
    });
    
    // Bosilgan elementga active klassini qo'shish
    event.currentTarget.classList.add('active');

    if(sectionId === 'muhokama') renderTalks();
}

let currentPostImage = null;

// Rasm tanlanganda preview ko'rsatish
function handlePostImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentPostImage = e.target.result;
            const container = document.getElementById('imagePreviewContainer');
            container.innerHTML = `<img src="${currentPostImage}" class="post-preview-img">
                                   <button onclick="removePostImage()" class="remove-img">&times;</button>`;
            container.className = 'preview-visible';
        }
        reader.readAsDataURL(file);
    }
}

function removePostImage() {
    currentPostImage = null;
    document.getElementById('imagePreviewContainer').className = 'preview-hidden';
}

// Post qo'shish
function addGlobalPost() {
    const input = document.getElementById('globalPostInput');
    if (!input.value.trim() && !currentPostImage) return;

    const newPost = {
        id: Date.now(),
        user: "Admin User", // Bu yerga profil ma'lumotlarini ulasangiz bo'ladi
        handle: "@admin",
        text: input.value,
        image: currentPostImage,
        time: "Hozir",
        likes: 0,
        replies: 0
    };

    let posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
    posts.unshift(newPost);
    localStorage.setItem('Xebec_Global_Feed', JSON.stringify(posts));

    // Tozalash
    input.value = '';
    removePostImage();
    renderGlobalTalks();
}

// Sahifa yuklanganda va bo'limga o'tganda postlarni ko'rsatish
window.onload = function() {
    // Agar foydalanuvchi profili mavjud bo'lsa, ma'lumotlarni yuklaymiz
    renderGlobalTalks();
};

function addGlobalPost() {
    const input = document.getElementById('globalPostInput');
    if (!input.value.trim() && !currentPostImage) return;

    // To'g'ri kalitdan rasmni olamiz
    const savedAvatar = localStorage.getItem('user_avatar');

    const newPost = {
        id: Date.now(),
        user: "Sarvarbek Rahmonjonov",
        handle: "@sarvar",
        avatar: savedAvatar, // null bo'lishi ham mumkin
        text: input.value,
        image: currentPostImage,
        time: new Date().getHours() + ":" + new Date().getMinutes().toString().padStart(2, '0'),
        likes: 0
    };

    let posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
    posts.unshift(newPost);
    localStorage.setItem('Xebec_Global_Feed', JSON.stringify(posts));

    input.value = '';
    renderGlobalTalks();
}

function addGlobalPost() {
    const input = document.getElementById('globalPostInput');
    if (!input.value.trim() && !currentPostImage) return;

    // Profil rasmini olish (agar src'da haqiqiy rasm bo'lsa)
    const profileImg = document.querySelector('.profile-image-large');
    const hasImage = profileImg && profileImg.src && !profileImg.src.includes('default-avatar'); 
    const realAvatar = hasImage ? profileImg.src : null;

    const newPost = {
        id: Date.now(),
        user: "Sarvarbek Rahmonjonov",
        handle: "@sarvar",
        avatar: realAvatar, // Rasm yo'q bo'lsa null bo'ladi
        text: input.value,
        image: currentPostImage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        likes: 0
    };

    let posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
    posts.unshift(newPost);
    localStorage.setItem('Xebec_Global_Feed', JSON.stringify(posts));

    input.value = '';
    removePostImage();
    renderGlobalTalks();
}


function showSection(sectionId) {
    // Barcha sectionlarni yashirish
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    
    // Tanlangan sectionni ko'rsatish
    document.getElementById(sectionId).style.display = 'block';

    // AGAR MUHOKAMA BO'LIMI BO'LSA - POSTLARNI YUKLASH
    if(sectionId === 'muhokama') {
        renderGlobalTalks();
    }
}

function renderGlobalTalks() {
    const feed = document.getElementById('globalFeed');
    if (!feed) return; // Element topilmasa funksiyani to'xtatish

    const posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
    
    // Profil rasmini ikkala ehtimoliy kalit bo'yicha tekshiramiz
    const currentAvatar = localStorage.getItem('user_avatar') || localStorage.getItem('userAvatar');

    feed.innerHTML = posts.map(post => {
        // Avatar mantiqi
        let avatarHTML;
        if (post.handle === "@sarvar" && currentAvatar) {
            avatarHTML = `<img src="${currentAvatar}" class="user-mini-avatar">`;
        } else if (post.avatar) {
            avatarHTML = `<img src="${post.avatar}" class="user-mini-avatar">`;
        } else {
            avatarHTML = `<div class="user-initial-avatar">${post.user ? post.user[0] : 'U'}</div>`;
        }

        // Har bir post uchun HTML qaytarish
        return `
        <div class="feed-card animate-slide-up">
            ${avatarHTML}
            <div class="post-main">
                <div class="post-header">
                    <div class="header-info">
                        <strong>${post.user || 'Foydalanuvchi'}</strong> <i class="fas fa-check-circle verified"></i>
                        <span class="post-handle">${post.handle || '@user'} · ${post.time || 'Hozir'}</span>
                    </div>
                    <div class="post-options">
                        <i class="fas fa-edit" onclick="editPost(${post.id})"></i>
                        <i class="fas fa-trash" onclick="deletePost(${post.id})"></i>
                    </div>
                </div>
                <div class="post-text">${post.text}</div>
                
                <div class="post-footer">
                    <div class="action-unit" onclick="addComment(${post.id})">
                        <i class="far fa-comment"></i> 
                        <span>${post.comments ? post.comments.length : 0}</span>
                    </div>
                    
                    <div class="action-unit ${post.isLiked ? 'active-like' : ''}" onclick="toggleLike(${post.id})">
                        <i class="${post.isLiked ? 'fas' : 'far'} fa-heart"></i> 
                        <span>${post.likes || 0}</span>
                    </div>
                    
                    <div class="action-unit" onclick="sharePost(${post.id})">
                        <i class="far fa-share-square"></i>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Profilni ko'rish funksiyasi
function viewUserProfile(userId) {
    console.log("Foydalanuvchi profili ochilmoqda:", userId);
    showSection('profil'); // Hozircha o'zingizni profilingizga yo'naltiradi
    // Keyinchalik bu yerga boshqa foydalanuvchi ma'lumotlarini yuklash kodini yozasiz
}

// Profil rasmini o'zgartirish uchun (masalan, fayl tanlanganda)
function updateProfileImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newSrc = e.target.result;
            // Ham profil sahifasidagi, ham yuqoridagi kichik rasmni yangilaymiz
            document.querySelector('.profile-image-large').src = newSrc;
            document.querySelector('.profile-pill img').src = newSrc;
            
            // Keyingi safar post yozganda yangi rasm chiqishi uchun saqlab qo'yamiz
            localStorage.setItem('userAvatar', newSrc);
        };
        reader.readAsDataURL(file);
    }
}

// Postni o'chirish
function deletePost(postId) {
    if(confirm("Ushbu xabarni o'chirishni xohlaysizmi?")) {
        let posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
        posts = posts.filter(p => p.id !== postId);
        localStorage.setItem('Xebec_Global_Feed', JSON.stringify(posts));
        renderGlobalTalks();
    }
}

// Postni tahrirlash
function editPost(postId) {
    let posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
    const post = posts.find(p => p.id === postId);
    const newText = prompt("Xabarni tahrirlang:", post.text);
    
    if(newText !== null) {
        post.text = newText;
        localStorage.setItem('Xebec_Global_Feed', JSON.stringify(posts));
        renderGlobalTalks();
    }
}

// 1. Sahifa yuklanganda barcha rasmlarni yangilash
window.addEventListener('DOMContentLoaded', () => {
    const savedAvatar = localStorage.getItem('user_avatar') || localStorage.getItem('userAvatar');
    if (savedAvatar) {
        // Hamma joydagi rasmlarni bir marta yangilab chiqamiz
        const targets = [
            '.profile-image-large', 
            '.profile-pill img', 
            '#composerUserAvatar', 
            '#userAvatar'
        ];
        targets.forEach(selector => {
            const el = document.querySelector(selector) || document.getElementById(selector.replace('#',''));
            if (el) el.src = savedAvatar;
        });
    }
});

// 2. Tahrirlash funksiyasini 1144-qatordan keyin qo'shing
function editPost(postId) {
    let posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
        const newText = prompt("Xabarni tahrirlang:", posts[postIndex].text);
        if (newText !== null && newText.trim() !== "") {
            posts[postIndex].text = newText;
            localStorage.setItem('Xebec_Global_Feed', JSON.stringify(posts));
            renderGlobalTalks(); // Ekranni yangilash
        }
    }
}

// 1. Like bosish funksiyasi
function toggleLike(postId) {
    let posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        // Agar like bosilmagan bo'lsa 1 qo'shadi, bosilgan bo'lsa ayiradi
        if (!post.isLiked) {
            post.likes = (post.likes || 0) + 1;
            post.isLiked = true;
        } else {
            post.likes -= 1;
            post.isLiked = false;
        }
        localStorage.setItem('Xebec_Global_Feed', JSON.stringify(posts));
        renderGlobalTalks(); // UI ni yangilash
    }
}

// 2. Comment yozish (oddiy variant)
function addComment(postId) {
    const commentText = prompt("Fikringizni qoldiring:");
    if (commentText) {
        let posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (!post.comments) post.comments = [];
            post.comments.push(commentText);
            localStorage.setItem('Xebec_Global_Feed', JSON.stringify(posts));
            alert("Fikr muvaffaqiyatli qo'shildi!");
            renderGlobalTalks();
        }
    }
}

// 3. Share (Havolani nusxalash)
function sharePost(postId) {
    const dummyUrl = `https://xebec.uz/post/${postId}`;
    navigator.clipboard.writeText(dummyUrl).then(() => {
        alert("Post havolasi nusxalandi!");
    });
}

function toggleLike(postId) {
    let posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.isLiked = !post.isLiked;
        post.likes = post.isLiked ? (post.likes || 0) + 1 : (post.likes || 1) - 1;
        localStorage.setItem('Xebec_Global_Feed', JSON.stringify(posts));
        renderGlobalTalks();
    }
}

function sharePost(postId) {
    alert("Post havolasi nusxalandi!");
}

function addComment(postId) {
    const comment = prompt("Fikringizni yozing:");
    if (comment) {
        let posts = JSON.parse(localStorage.getItem('Xebec_Global_Feed')) || [];
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (!post.comments) post.comments = [];
            post.comments.push(comment);
            localStorage.setItem('Xebec_Global_Feed', JSON.stringify(posts));
            renderGlobalTalks();
        }
    }
}

// Har bir harakatni boshqarish
function openAddAdModal() {
    document.getElementById('addAdModal').classList.add('active');
}

function openWallet() {
    document.getElementById('walletModal').classList.add('active');
    // Balansni localStorage'dan olish (agar bo'lsa)
    const bal = localStorage.getItem('user_balance') || "150,000";
    document.getElementById('currentBalance').innerText = bal + " UZS";
}

function openPremium() {
    alert("🚀 Premium funksiyasi tez kunda ishga tushadi! E'lonlaringizni TOP-ga chiqaring.");
}

function openSupport() {
    document.getElementById('supportModal').classList.add('active');
}

// Modalni yopish funksiyasi
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// HTML-dagi tugmalarga funksiyalarni bog'laymiz (agar hali bog'lanmagan bo'lsa)
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.action-item');
    items[0].onclick = openAddAdModal;
    items[1].onclick = openWallet;
    items[2].onclick = openPremium;
    items[3].onclick = openSupport;
});