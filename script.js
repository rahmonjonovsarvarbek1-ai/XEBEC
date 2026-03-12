/**
 * XEBIC - Professional Dashboard Logic
 * GitHub: @sizning_profilingiz
 */
// script.js ning eng tepasiga qo'ying
const contentWrapper = document.getElementById('tabContent');

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

// 3. Asosiy funksiyalar
function showSection(id) {
    if (!contentWrapper) return; // Xatolikni oldini olish

    // Animatsiya mantiqi
    contentWrapper.style.opacity = '0';
    contentWrapper.style.transform = 'translateY(10px)';

    setTimeout(() => {
        // Bo'limni almashtirish kodini shu yerga yozing
        contentWrapper.style.opacity = '1';
        contentWrapper.style.transform = 'translateY(0)';
    }, 200);
}

function renderMasters() {
    console.log("Masterlar yuklanmoqda...");
    // Masterlarni chiqarish mantiqi
}

// 2. Pusherni xavfsiz yuklash
if (typeof Pusher !== 'undefined') {
    const pusher = new Pusher('SIZNING_APP_KEY', { cluster: 'eu' });
}

// 2. Chatni ochish funksiyasi
function openConversation(userId, name, img) {
    const messenger = document.getElementById('messengerMain');
    
    // UI ma'lumotlarini yangilash
    document.getElementById('activeChatName').innerText = name;
    document.getElementById('activeChatAvatar').src = img;
    
    // Sectionlarni ko'rsatish/yashirish
    document.getElementById('noChatSelected').style.display = 'none';
    document.getElementById('activeChat').style.display = 'flex';

    // Mobil uchun klass qo'shish
    if (window.innerWidth < 992) {
        document.querySelector('.messenger-container').classList.add('is-active');
    }

    // Pusher kanaliga ulanish
    pusher.unsubscribeAll(); // Oldingi chatlardan chiqish
    const channel = pusher.subscribe(`chat-${userId}`);
    
    channel.bind('new-message', function(data) {
        // Kelgan xabarni ekranga chiqarish
        renderMessage(data.text, 'received');
    });
}

// 3. Xabar yuborish funksiyasi
function sendMessage() {
    const input = document.getElementById('chatMessageInput');
    const text = input.value.trim();

    if (text) {
        renderMessage(text, 'sent'); // O'zimizga ko'rsatamiz
        
        // Bu yerda backend API-ga xabar yuboriladi (Vercel API kabi)
        // fetch('/api/messages', { method: 'POST', body: ... })

        input.value = '';
        input.style.height = 'auto';
    }
}

// 4. Xabarni ekranda ko'rsatish yordamchi funksiyasi
function renderMessage(text, type) {
    const display = document.getElementById('messageDisplay');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const html = `
        <div class="message ${type}">
            <p>${text}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    display.insertAdjacentHTML('beforeend', html);
    display.scrollTop = display.scrollHeight;
}





// Qidiruv maydonini kuzatish
document.querySelector('.chat-search input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().replace('@', ''); // '@' belgisini olib tashlaymiz
    renderChatSearch(searchTerm);
});

function renderChatSearch(query) {
    const chatList = document.getElementById('chatList');
    
    // Agar qidiruv bo'sh bo'lsa, ro'yxatni tozalaymiz yoki asosiy chatlarni qaytaramiz
    if (!query) {
        chatList.innerHTML = ''; 
        return;
    }

    // Masters bazasidan izlash (db.masters ichidan)
    const filteredMasters = db.masters.filter(m => 
        m.name.toLowerCase().includes(query) || 
        m.job.toLowerCase().includes(query)
    );

    // Natijalarni chiqarish
    if (filteredMasters.length > 0) {
        chatList.innerHTML = filteredMasters.map(m => `
            <div class="chat-item animate-fade-in" onclick="startChatWithMaster(${m.id}, '${m.name}', '${m.img}')">
                <div class="chat-item-avatar">
                    <img src="${m.img}" alt="${m.name}">
                    <span class="status-dot ${m.status}"></span>
                </div>
                <div class="chat-item-content">
                    <div class="chat-item-header">
                        <h4>${m.name}</h4>
                    </div>
                    <p>${m.job}</p>
                </div>
            </div>
        `).join('');
    } else {
        chatList.innerHTML = `
            <div style="text-align:center; padding:20px; color:var(--text-muted)">
                <i class="fas fa-search" style="font-size:2rem; margin-bottom:10px; opacity:0.3"></i>
                <p>"${query}" bo'yicha hech kim topilmadi</p>
            </div>`;
    }
}

function searchMessages(query) {
    const chatList = document.getElementById('chatList');
    const searchTerm = query.toLowerCase().trim().replace('@', '');

    if (!searchTerm) {
        chatList.innerHTML = ''; // Qidiruv bo'sh bo'lsa tozalash
        return;
    }

    // Masters bazasidan qidirish
    const filteredResults = db.masters.filter(m => 
        m.name.toLowerCase().includes(searchTerm) || 
        m.job.toLowerCase().includes(searchTerm)
    );

    
}
        // 4. Hech narsa topilmasa
        chatList.innerHTML = `
            <div style="text-align:center; padding:30px; opacity:0.5;">
                <i class="fas fa-search" style="font-size:2rem; margin-bottom:10px;"></i>
                <p>Natija topilmadi</p>
            </div>`;
    



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

// 4. Tablarni almashtirish (Yagona va xavfsiz variant)
window.switchTab = function(element, tabName) {
    // 1. Aktiv klassni barcha tab-item tugmalaridan olib tashlash
    const buttons = document.querySelectorAll('.tab-item');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // 2. Bosilgan tugmaga aktiv klassni qo'shish
    if (element) {
        element.classList.add('active');
    }

    // 3. Kontent chiqadigan joyni topish
    const contentWrapper = document.getElementById('tabContent');
    if (!contentWrapper) return; // Agar HTMLda tabContent bo'lmasa, xato bermaydi

    // 4. Animatsiya uchun qisqa vaqtga yashirish (ixtiyoriy)
    contentWrapper.style.opacity = '0.5';

    // 5. Tab nomiga qarab kontentni yangilash
    if (tabName === 'reviews') {
        contentWrapper.innerHTML = '<div class="empty-state"><p>Hali sharhlar yo\'q</p></div>';
    } else if (tabName === 'security') {
        contentWrapper.innerHTML = `
            <div class="info-card">
                <h4>Parolni o'zgartirish</h4>
                <p>Profilingiz xavfsizligini ta'minlash uchun parolni yangilab turing.</p>
                <button class="btn-primary-sm">O'zgartirish</button>
            </div>`;
    } else {
        contentWrapper.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>E\'lonlar mavjud emas</p></div>';
    }

    // Animatsiyani qaytarish
    setTimeout(() => {
        contentWrapper.style.opacity = '1';
    }, 100);
};




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
    `
    }).join('');
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





// "Yozmoqda..." effektini simulyatsiya qilish (Faqat test uchun)
document.getElementById('chatMessageInput').addEventListener('input', function() {
    // Bu yerda serverga "typing" eventini yuborish mumkin
    console.log("Foydalanuvchi yozmoqda...");
});

// Dropdown menyuni boshqarish
function toggleChatDropdown() {
    document.getElementById('chatDropdown').classList.toggle('show');
}

// Menyudan tashqariga bosilganda yopish
window.onclick = function(event) {
    if (!event.target.matches('.fa-ellipsis-v')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let d of dropdowns) {
            if (d.classList.contains('show')) d.classList.remove('show');
        }
    }
}

// Filtr funksiyasi
function filterChats(type) {
    // Tugmalar rangini yangilash
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(type === 'all' ? 'hammasi' : type === 'direct' ? 'lichka' : 'guruh')) {
            btn.classList.add('active');
        }
    });

    // Chatlarni filtrlash mantiqi (Simulyatsiya)
    console.log(`${type} bo'yicha chatlar saralandi`);
    // Bu yerda ChatApp.renderChatList(type) funksiyasini chaqirishingiz mumkin
}



// Orqaga qaytish (Telefonda)
function closeConversation() {
    const messenger = document.getElementById('messengerMain');
    messenger.classList.remove('is-active');
}

// Textarea balandligini avtomatik sozlash
function autoHeight(element) {
    element.style.height = "auto";
    element.style.height = (element.scrollHeight) + "px";
}

// Xabar yuborish
function handleSendMessage() {
    const input = document.getElementById('chatMessageInput');
    const text = input.value.trim();
    if (!text) return;

    const display = document.getElementById('messageDisplay');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgHtml = `
        <div class="message sent animate-slide-up" style="display: flex; flex-direction: column;">
            <p>${text}</p>
            <span style="font-size: 10px; opacity: 0.7; align-self: flex-end; margin-top: 4px;">${time}</span>
        </div>
    `;

    display.insertAdjacentHTML('beforeend', msgHtml);
    input.value = '';
    input.style.height = "auto";
    display.scrollTop = display.scrollHeight;
}



// 3. Enter bosilganda yuborish (Shift+Enter bo'lmasa)
document.getElementById('chatMessageInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});



// Lichkaga kirish funksiyasi
function openPrivateChat(id, name, img) {
    // 1. Mobil versiya uchun "active" klassini qo'shish
    const container = document.getElementById('messengerMain');
    container.classList.add('is-active'); 

    // 2. Chat oynasini yangilash
    document.getElementById('noChatSelected').style.display = 'none';
    document.getElementById('activeChat').style.display = 'flex';

    // 3. Headerdagi ma'lumotlarni o'zgartirish
    document.getElementById('activeChatName').innerText = name;
    document.getElementById('activeChatAvatar').src = img;

    // 4. Xabarlar oynasini tozalash (yoki tarixni yuklash)
    document.getElementById('messageDisplay').innerHTML = `
        <div class="chat-date">Bugun</div>
        <div class="message received">
            <p>Assalomu alaykum! Men ${name}. Sizga qanday yordam bera olaman?</p>
            <span class="time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
    `;
}

import { auth, googleProvider } from "./firebase-config.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { saveUserToDB } from "./database.js";

const googleBtn = document.getElementById('google-btn');

if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Foydalanuvchi kirgan zahoti bazaga yozamiz
            await saveUserToDB(result.user);
            window.location.href = "home.html"; // Muvaffaqiyatli bo'lsa bosh sahifaga
        } catch (error) {
            console.error("Login xatosi:", error.message);
        }
    });
}