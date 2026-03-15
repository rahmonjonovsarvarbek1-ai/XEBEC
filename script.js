/**
 * TORVEX | Industrial & Master Ecosystem
 * Full Control Script v2.6 (Firebase Integrated)
 * Lead Developer: Sarvarbek Rahmonjonov
 */

"use strict";

// 1. Eng tepada barcha importlarni bir marta e'lon qiling
import { 
    auth, 
    db, // config faylingizda 'db' allaqachon getFirestore() bo'lishi kerak
    googleProvider, 
    appleProvider, 
    signInWithPopup, 
    onAuthStateChanged, // firebase-config.js ichida 'export' borligini tekshiring
    RecaptchaVerifier, 
    signInWithPhoneNumber 
} from './firebase-config.js';


import { 
 
    doc, 
    getDoc, // Skrinshotdagi ReferenceError xatosini to'g'irlash uchun
    setDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";



// 2.1 Google orqali kirish
window.loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("Muvaffaqiyatli kirdi:", result.user.displayName);
        if (typeof closeModal === 'function') closeModal('auth-modal');
    } catch (error) {
        console.error("Google Login xatosi:", error.message);
        alert("Kirishda xatolik yuz berdi.");
    }
};

window.loginWithPhone = async () => {
    // 1. Foydalanuvchidan raqamni so'rash
    const phoneNumber = prompt("Telefon raqamingizni kiriting:", "+998901234567");
    
    if (!phoneNumber) return;

    // 2. ReCAPTCHA-ni sozlash (Invisible)
    // 'auth-modal' bu sizning modal oynangizning ID-si bo'lishi kerak
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'auth-modal', {
            'size': 'invisible'
        });
    }

    try {
        const appVerifier = window.recaptchaVerifier;
        
        // 3. SMS yuborish so'rovi (Test raqam bo'lgani uchun SMS kelmaydi)
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        
        // 4. Test kodini kiritish (Siz o'rnatgan 123456)
        const code = prompt("Siz belgilagan 6 xonali test kodini kiriting:");
        
        if (code) {
            const result = await confirmationResult.confirm(code);
            console.log("Muvaffaqiyatli kirildi!", result.user);
            alert("Xush kelibsiz! Telefon orqali kirish tasdiqlandi.");
            
            // Modalni yopish (agar funksiyangiz nomi shunday bo'lsa)
            if (typeof window.toggleAuthModal === 'function') {
                window.toggleAuthModal(false);
            }
        }
    } catch (error) {
        console.error("Xatolik:", error.code);
        alert("Xatolik yuz berdi: " + error.message);
    }
};

// 2.3 Apple orqali kirish
window.loginWithApple = () => {
    alert("Apple ID xizmati sozlanmoqda...");
};

// 2.3.1 Tizimdan chiqish funksiyasini global window obyektiga ulaymiz
window.handleLogout = async () => {
    try {
        await auth.signOut(); // auth o'zgaruvchisi import qilingan bo'lishi shart
        console.log("Tizimdan chiqildi");
        window.location.reload(); 
    } catch (error) {
        console.error("Chiqishda xatolik:", error.message);
        alert("Tizimdan chiqishda xatolik yuz berdi");
    }
};

// Modalni ochish va yopish funksiyasini global qilish
window.toggleAuthModal = (show = true) => {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
    }
};

// closeModal funksiyasini ham global qilib qo'yamiz (X tugmasi ishlashi uchun)
window.closeModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
};
onAuthStateChanged(auth, async (user) => {
    if (user) {
        AppState.user = user;
        console.log("Sessiya faol:", user.email);
         
        try {
            // Hujjatni olish
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            
            if (userDoc.exists()) {
                const data = userDoc.data();
                
                // Inputlarni to'ldirish
                if (document.getElementById('dbUsername')) document.getElementById('dbUsername').value = data.username || '';
                if (document.getElementById('dbRegion')) document.getElementById('dbRegion').value = data.region || 'Andijon';
                if (document.getElementById('dbBirthdate')) document.getElementById('dbBirthdate').value = data.birthdate || '';
                
                // Telefon raqami (+998 ni olib tashlab ko'rsatish)
                if (document.getElementById('dbPhone') && data.phone) {
                    document.getElementById('dbPhone').value = data.phone.replace("+998", "");
                }
                
                // Rolni aktivlashtirish
                if (data.role) {
                       window.currentSelectedRole = data.role;
                    if (window.selectProfileRole) window.selectProfileRole(data.role);
                }
            }
        } catch (error) {
            console.error("Ma'lumot yuklashda xato:", error);
         }
        
        renderProfile();
    } else {
        AppState.user = null;
        resetProfileUI();
    }
});


// 2.5 Profil bo'limini chizish
function renderProfile() {
    const profileContainer = document.getElementById('profil');
    if (!profileContainer || !AppState.user) return;

    profileContainer.innerHTML = `
        <div class="profile-container" style="padding: 20px; animation: fadeIn 0.5s ease;">
            <div class="profile-header" style="text-align: center; margin-bottom: 25px;">
                <img src="${AppState.user.photoURL || 'assets/default-avatar.png'}" 
                     style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid #f1c40f; object-fit: cover; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                <h2 style="margin-top: 15px; color: var(--text-color);">${AppState.user.displayName || 'Foydalanuvchi'}</h2>
                <span style="color: #2ecc71; font-size: 0.9em;"><i class="fas fa-check-circle"></i> Tasdiqlangan profil</span>
            </div>

            <div class="profile-info-grid" style="display: grid; gap: 15px; background: rgba(0,0,0,0.05); padding: 20px; border-radius: 12px; color: var(--text-color);">
                <div class="info-item"><i class="far fa-envelope"></i> <strong>Email:</strong> ${AppState.user.email}</div>
                <div class="info-item"><i class="fas fa-phone-alt"></i> <strong>Tel:</strong> ${AppState.user.phoneNumber || 'Kiritilmagan'}</div>
                <div class="info-item"><i class="fas fa-id-badge"></i> <strong>ID:</strong> ${AppState.user.uid.substring(0, 10)}...</div>
            </div>

            <button onclick="window.handleLogout()" 
                    style="width: 100%; margin-top: 25px; background: #e74c3c; color: white; border: none; padding: 15px; border-radius: 10px; cursor: pointer; font-weight: 600; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fas fa-sign-out-alt"></i> Tizimdan chiqish
            </button>
        </div>
    `;
}

function resetProfileUI() {
    const profileContainer = document.getElementById('profil');
    if (profileContainer) {
        profileContainer.innerHTML = `
            <div style="text-align: center; padding: 50px 20px;">
                <i class="fas fa-user-lock" style="font-size: 3em; color: #ccc;"></i>
                <p style="margin-top: 15px;">Profilni ko'rish uchun tizimga kiring</p>
                <button onclick="toggleAuthModal()" class="login-prompt-btn">Kirish</button>
            </div>
        `;
    }
}
// --- 2. DATA (MA'LUMOTLAR OMBORI) ---
const TORVEX_DATA = {
    masters: [
        { id: 1, name: "Ali Valiyev", job: "Elektrik", rating: 4.9, exp: "12 yil", price: "100k", avatar: "https://i.pravatar.cc/150?u=1" },
        { id: 2, name: "Sardor Azimov", job: "Santexnik", rating: 4.7, exp: "8 yil", price: "80k", avatar: "https://i.pravatar.cc/150?u=2" },
        { id: 3, name: "Jasur Komilov", job: "Malyar", rating: 4.8, exp: "5 yil", price: "120k", avatar: "https://i.pravatar.cc/150?u=3" }
    ],
    products: [
        { id: 101, name: "Knauf Gipsokarton", price: 45000, img: "https://via.placeholder.com/150", category: "Qurilish" },
        { id: 102, name: "Bosch Perforator", price: 1200000, img: "https://via.placeholder.com/150", category: "Asboblar" }
    ]
};

// --- 3. GLOBAL STATE (ILOVA HOLATI) ---
let AppState = {
    user: null,
    cart: JSON.parse(localStorage.getItem('torvex_cart')) || [],
    currentTheme: localStorage.getItem('theme') || 'light'
};

// --- 4. INITIALIZATION (ISHGA TUSHIRISH) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("TORVEX Ecosystem yuklanmoqda...");
    initTheme();
    renderMasters('all');
    renderMarket();
    setupChat();
    animateDashboard();
    checkAuthState(); // Login holatini tekshirish
    
    // Default bo'lim
    showSection('dash');
});


window.loginWithGoogle = async function() {
    try {
        console.log("Google tizimiga ulanish...");
        const result = await signInWithPopup(auth, googleProvider);
        updateUIForUser(result.user);

        // MODALNI YOPISH: Login muvaffaqiyatli bo'lsa modalni yopamiz
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.style.display = 'none';
        }
    } catch (error) {
        console.error("Auth xatosi:", error.message);
        alert("Xatolik: " + error.message);
    }
};

// 5.1 EMAIL ORQALI KIRISH (Siz so'ragan funksiya)
window.initiateUserSession = async (event) => {
    if (event) event.preventDefault();
    
    const emailInput = document.getElementById('modalEmail');
    const email = emailInput ? emailInput.value : '';

    if (!email) {
        alert("Iltimos, email manzilingizni kiriting!");
        return;
    }

    // Hozircha konsolga chiqaradi, Firebase ulanmagan bo'lsa xabar beradi
    console.log("Email orqali kirish urinishi:", email);
    alert("Email xizmati vaqtincha sozlanmoqda. Iltimos, hozircha Google orqali kiring.");
};

// 5.2 TELEFON RAQAMI ORQALI KIRISH
window.loginWithPhone = async () => {
    const phoneNumber = prompt("Telefon raqamingizni kiriting (masalan: +998901234567):");
    
    if (!phoneNumber) {
        alert("Raqam kiritilmadi!");
        return;
    }

    console.log("Telefon orqali kirish urinishi:", phoneNumber);
    alert("Telefon orqali tasdiqlash xizmati vaqtincha sozlanmoqda. Iltimos, hozircha Google orqali kiring.");
    
    // Kelajakda Firebase sozlangach modalni yopish uchun:
    // const authModal = document.getElementById('auth-modal');
    // if (authModal) authModal.style.display = 'none';
};

function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            AppState.user = user;
            updateUIForUser(user);
        }
    });
}

function updateUIForUser(user) {
    const authGate = document.getElementById('auth-gate');
    const profileSection = document.getElementById('real-profile-content');
    
    if (authGate && profileSection) {
        authGate.style.display = 'none';
        profileSection.style.display = 'block';
        profileSection.innerHTML = `
            <div class="user-card animate-fade-in">
                <img src="${user.photoURL}" class="user-avatar" style="width:60px; border-radius:50%">
                <h4>${user.displayName}</h4>
                <p>${user.email}</p>
                <button onclick="auth.signOut().then(() => location.reload())" class="btn-logout">Chiqish</button>
            </div>
        `;
    }
}

// --- 6. NAVIGATION ENGINE (BO'LIMLAR) ---
window.showSection = function(sectionId) {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item, .nav-item-mobile');

    const activeSection = document.getElementById(sectionId);
    if (!activeSection) {
        console.warn(`Section topilmadi: ${sectionId}`);
        return;
    }

    // 1. Hamma bo'limlarni yashirish
    sections.forEach(s => s.style.display = 'none');
    
    // 2. Hamma menyu tugmalaridan 'active' klassini olib tashlash
    navItems.forEach(n => n.classList.remove('active'));

    // 3. Tanlangan bo'limni ko'rsatish
    activeSection.style.display = 'block';
    
    // 4. Menyu tugmasini aktiv qilish
    // Agar sectionId 'profil' bo'lsa, pastki menyudagi profil tugmasini topadi
    const navId = sectionId === 'dash' ? 'li-dash' : `li-${sectionId}`;
    const activeNav = document.getElementById(navId);
    if (activeNav) activeNav.classList.add('active');

    // 5. Sidebar bo'lsa yopish (mobil versiya uchun)
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.remove('active');

    // --- PROFIL UCHUN MAXSUS MANTIQ ---
    if (sectionId === 'profil') {
        checkProfileAuthView(); // Profil ochilganda login holatini tekshirish
    }

    window.scrollTo(0, 0);
};

// Profil ichidagi bloklarni almashish uchun yordamchi funksiya
function checkProfileAuthView() {
    const user = auth.currentUser; // Firebase auth'dan joriy foydalanuvchi
    const loggedInDiv = document.getElementById('auth-logged-in');
    const loggedOutDiv = document.getElementById('auth-logged-out');

    if (user) {
        if (loggedInDiv) loggedInDiv.style.display = 'block';
        if (loggedOutDiv) loggedOutDiv.style.display = 'none';
    } else {
        if (loggedInDiv) loggedInDiv.style.display = 'none';
        if (loggedOutDiv) loggedOutDiv.style.display = 'block';
    }
}

// --- 7. MASTERS SYSTEM (USTALAR KATALOGI) ---
window.renderMasters = function(filter = 'all') {
    const grid = document.getElementById('mastersGrid');
    if (!grid) return;

    const filtered = filter === 'all' ? TORVEX_DATA.masters : TORVEX_DATA.masters.filter(m => m.job === filter);
    
    grid.innerHTML = filtered.map(master => `
        <div class="master-card animate-fade-in">
            <div class="master-img">
                <img src="${master.avatar}" alt="${master.name}">
                <span class="verify-badge"><i class="fas fa-check"></i></span>
            </div>
            <div class="master-info">
                <h4>${master.name}</h4>
                <p class="job-tag">${master.job}</p>
                <div class="master-stats">
                    <span><i class="fas fa-star"></i> ${master.rating}</span>
                    <span><i class="fas fa-briefcase"></i> ${master.exp}</span>
                </div>
                <div class="master-footer">
                    <span class="price-start">${master.price} so'mdan</span>
                    <button onclick="window.showSection('muhokama')" class="btn-contact">Bog'lanish</button>
                </div>
            </div>
        </div>
    `).join('');

    const countEl = document.getElementById('totalMasters');
    if (countEl) countEl.innerText = filtered.length;
};

// filterByJob faqat bir marta window-da e'lon qilindi (SyntaxError oldini oladi)
window.filterByJob = function(job, event) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    window.renderMasters(job);
};

// --- 8. MARKETPLACE (BOZOR TIZIMI) ---
window.renderMarket = function() {
    const grid = document.getElementById('marketGrid');
    if (!grid) return;

    grid.innerHTML = TORVEX_DATA.products.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}">
            <div class="product-details">
                <h5>${p.name}</h5>
                <p class="price">${p.price.toLocaleString()} so'm</p>
                <button onclick="addToCart(${p.id})" class="btn-add-cart">Savatga</button>
            </div>
        </div>
    `).join('');
};

window.addToCart = function(id) {
    const product = TORVEX_DATA.products.find(p => p.id === id);
    AppState.cart.push(product);
    localStorage.setItem('torvex_cart', JSON.stringify(AppState.cart));
    updateCartUI();
};

function updateCartUI() {
    const badge = document.getElementById('cartCount');
    if (badge) badge.innerText = AppState.cart.length;
}

// --- 9. CHAT & THEME ---
function setupChat() {
    const chatList = document.getElementById('chatList');
    if (!chatList) return;

    const chats = [
        { id: 1, name: "Ali Valiyev (Elektrik)", lastMsg: "Ertaga soat 9:00 da boraman.", time: "10:45" }
    ];

    chatList.innerHTML = chats.map(c => `
        <div class="chat-item" onclick="openConversation(${c.id})">
            <div class="chat-avatar">${c.name[0]}</div>
            <div class="chat-info">
                <b>${c.name}</b>
                <p>${c.lastMsg}</p>
            </div>
        </div>
    `).join('');
}

window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

function initTheme() {
    if (AppState.currentTheme === 'dark') document.body.classList.add('dark-mode');
}

function animateDashboard() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(c => {
        const target = +c.getAttribute('data-target');
        c.innerText = target.toLocaleString();
    });
}

// Tanlangan rolni saqlash uchun o'zgaruvchi
window.currentSelectedRole = '';

// Ro'lni tanlash mantiqi
window.selectProfileRole = function(role) {
    window.currentSelectedRole = role;
    
    // Hammasidan 'active'ni olib tashlash
    document.querySelectorAll('.role-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Tanlanganiga 'active' qo'shish
    const activeBtn = document.getElementById(`role-${role}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
};


// Ma'lumotlarni saqlash va tahrirlash
window.updatePersonalDetails = async function() {
    const user = auth.currentUser;
    if (!user) return alert("Avval tizimga kiring!");

    const username = document.getElementById('dbUsername').value;
    const region = document.getElementById('dbRegion').value;
    const birthdate = document.getElementById('dbBirthdate').value;
    const phone = document.getElementById('dbPhone').value;

    if (!username || !window.currentSelectedRole) {
        return alert("Iltimos, username va rolni tanlang!");
    }

    try {
        await setDoc(doc(db, 'users', user.uid), {
            username: username.toLowerCase().trim(),
            region: region,
            birthdate: birthdate,
            phone: "+998" + phone.trim(),
            role: window.currentSelectedRole,
            updatedAt: serverTimestamp() // Oxirgi tahrirlash vaqti
        }, { merge: true });

        alert("Ma'lumotlar saqlandi! Endi ular butun umrga eslab qolinadi.");
    } catch (error) {
        console.error("Xatolik:", error);
        alert("Saqlashda xato yuz berdi.");
    }
};

// Ma'lumotlarni saqlash funksiyasi
window.saveFinalProfile = async function() {
    const user = auth.currentUser;
    if (!user) return alert("Avval tizimga kiring!");

    const username = document.getElementById('setupUsername').value;
    const region = document.getElementById('setupRegion').value;
    const birthdate = document.getElementById('setupBirthdate').value;

    try {
        // v10 uslubida Firestore-ga yozish
        await setDoc(doc(db, 'users', user.uid), {
            fullName: user.displayName,
            email: user.email,
            username: username.toLowerCase().trim(),
            region: region,
            birthdate: birthdate,
            setupComplete: true,
            lastUpdated: serverTimestamp()
        }, { merge: true });

        alert("Profil muvaffaqiyatli saqlandi!");
        document.getElementById('setup-profile-modal').style.display = 'none';
    } catch (error) {
        console.error("Xatolik:", error);
        alert("Xatolik yuz berdi!");
    }
};