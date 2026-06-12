const container = document.getElementById('kentler-container');
const buttons = document.querySelectorAll('.btn');
const aramaInput = document.getElementById('arama-input');

const modal = document.getElementById('detay-modal');
const modalResim = document.getElementById('modal-resim');
const modalBaslik = document.getElementById('modal-baslik');
const modalSehirTarih = document.getElementById('modal-sehir-tarih');
const modalUzunYazi = document.getElementById('modal-uzun-yazi');

const adminPanel = document.getElementById('arkeolog-panel');
const kentFormu = document.getElementById('kent-formu');
const formBaslik = document.getElementById('form-baslik');
const kaydetBtn = document.getElementById('kaydet-btn');
const iptalBtn = document.getElementById('iptal-btn');

const kentIdInput = document.getElementById('kent-id');
const kentIsimInput = document.getElementById('kent-isim');
const kentSehirInput = document.getElementById('kent-sehir');
const kentTarihInput = document.getElementById('kent-tarih');
const kentDonemInput = document.getElementById('kent-donem');
const kentAciklamaInput = document.getElementById('kent-aciklama');
const kentDetayInput = document.getElementById('kent-detay');

let aktifFiltre = 'hepsi';
let dinamikKentler = [];

function hafızayıGuncelle() {
    localStorage.setItem('antikKentlerArsivi', JSON.stringify(dinamikKentler));
}

function kentleriListele(liste) {
    if (!container) return;
    container.innerHTML = "";

    liste.forEach(kent => {
        const kartHTML = `
            <div class="card visible">
                <div class="image-container">
                    <img src="${kent.resim}" alt="${kent.isim}">
                    <span class="tag">${kent.donem.toUpperCase()}</span>
                </div>
                <div class="card-content">
                    <h3>${kent.isim}</h3>
                    <div class="location-badge">📍 ${kent.sehir} • ${kent.tarih}</div>
                    <p>${kent.aciklama}</p>
                    
                    <div class="crud-actions">
                        <button type="button" class="edit-btn" onclick="kentDuzenle(${kent.id})">Düzenle</button>
                        <button type="button" class="delete-btn" onclick="kentSil(${kent.id})">Sil</button>
                    </div>

                    <div class="card-footer">
                        <span style="color:#555;">ID: #00${kent.id}</span>
                        <button type="button" class="read-more-btn" onclick="modalAc(${kent.id})">Yolculuğa Başla →</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += kartHTML;
    });
}

function modalAc(id) {
    const secilenKent = dinamikKentler.find(kent => kent.id === id);
    if(secilenKent) {
        modalResim.src = secilenKent.resim;
        modalBaslik.innerText = secilenKent.isim;
        modalSehirTarih.innerText = `📍 ${secilenKent.sehir} | ${secilenKent.tarih} | ${secilenKent.donem.toUpperCase()} ÇAĞI`;
        modalUzunYazi.innerText = secilenKent.detay;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function modalKapat() {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
}

if (modal) {
    window.addEventListener('click', (e) => {
        if (e.target === modal) modalKapat();
    });
}

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const activeBtn = document.querySelector('.btn.active');
        if (activeBtn) activeBtn.classList.remove('active');
        e.target.classList.add('active');
        aktifFiltre = e.target.getAttribute('data-filter');
        hemFiltreleHemAra();
    });
});

if (aramaInput) {
    aramaInput.addEventListener('input', () => {
        hemFiltreleHemAra();
    });
}

function hemFiltreleHemAra() {
    const aramaMetni = aramaInput ? aramaInput.value.toLowerCase().trim() : "";
    
    const filtrelenmis = dinamikKentler.filter(kent => {
        const kategoriUyumlu = (aktifFiltre === 'hepsi' || kent.donem === aktifFiltre);
        const aramaUyumlu = kent.isim.toLowerCase().includes(aramaMetni) || 
                            kent.sehir.toLowerCase().includes(aramaMetni) ||
                            kent.aciklama.toLowerCase().includes(aramaMetni);
        
        return kategoriUyumlu && aramaUyumlu;
    });

    kentleriListele(filtrelenmis);
}

function panelToggle() {
    if (!adminPanel) return;
    adminPanel.classList.toggle('closed');
    if(!adminPanel.classList.contains('closed')) {
        adminPanel.scrollIntoView({ behavior: 'smooth' });
    }
}

function formSifirla() {
    if (!kentFormu) return;
    kentFormu.reset();
    kentIdInput.value = "";
    formBaslik.innerText = "Arşive Yeni Keşif Ekle";
    kaydetBtn.innerText = "Kayıtları Ağaçlandır";
    iptalBtn.style.display = "none";
}

if (kentFormu) {
    kentFormu.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = kentIdInput.value;
        let defaultResim = "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80";
        
        const yeniKent = {
            id: id ? parseInt(id) : Date.now(),
            isim: kentIsimInput.value,
            sehir: kentSehirInput.value,
            donem: kentDonemInput.value,
            tarih: kentTarihInput.value,
            resim: id ? dinamikKentler.find(k => k.id === parseInt(id)).resim : defaultResim,
            aciklama: kentAciklamaInput.value,
            detay: kentDetayInput.value
        };

        if (id) {
            const index = dinamikKentler.findIndex(k => k.id === parseInt(id));
            if (index !== -1) dinamikKentler[index] = yeniKent;
        } else {
            dynamicKentler = dinamikKentler.push(yeniKent);
        }

        hafızayıGuncelle();
        hemFiltreleHemAra();
        formSifirla();
        if(!id) {
            adminPanel.classList.add('closed');
            const exploreSec = document.getElementById('explore');
            if (exploreSec) exploreSec.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function kentSil(id) {
    if (confirm("Bu antik kenti dijital arşivden silmek istediğinize emin misiniz?")) {
        const index = dinamikKentler.findIndex(k => k.id === id);
        if (index !== -1) {
            dinamikKentler.splice(index, 1);
            hafızayıGuncelle();
            hemFiltreleHemAra();
        }
    }
}

function kentDuzenle(id) {
    const kent = dinamikKentler.find(k => k.id === id);
    if (kent && adminPanel) {
        kentIdInput.value = kent.id;
        kentIsimInput.value = kent.isim;
        kentSehirInput.value = kent.sehir;
        kentDonemInput.value = kent.donem;
        kentTarihInput.value = kent.tarih;
        kentAciklamaInput.value = kent.aciklama;
        kentDetayInput.value = kent.detay;

        formBaslik.innerText = `${kent.isim} Kayıtlarını Güncelle`;
        kaydetBtn.innerText = "Değişiklikleri Kaydet";
        iptalBtn.style.display = "inline-block";

        adminPanel.classList.remove('closed');
        adminPanel.scrollIntoView({ behavior: 'smooth' });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const yerelVeri = localStorage.getItem('antikKentlerArsivi');
    
    if (yerelVeri) {
        dinamikKentler = JSON.parse(yerelVeri);
    } else {
        dinamikKentler = [...antikKentler];
        hafızayıGuncelle();
    }
    
    kentleriListele(dinamikKentler);
    if (adminPanel) adminPanel.classList.add('closed');
});