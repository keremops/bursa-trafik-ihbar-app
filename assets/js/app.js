document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Başlangıç Ayarları
    const now = new Date();
    Utils.$('#date').valueAsDate = now;
    Utils.$('#time').value = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    
    // Kullanıcı Verilerini Yükle
    loadUserData();
    
    // Event Listener'lar
    setupEventListeners();
}

function setupEventListeners() {
    // Beni Hatırla
    const rememberCheckbox = Utils.$('#rememberMe');
    rememberCheckbox.addEventListener('change', (e) => toggleRememberMe(e.target.checked));
    
    [Utils.$('#reporterName'), Utils.$('#reporterPhone')].forEach(input => {
        input.addEventListener('input', () => {
            if (Utils.$('#rememberMe').checked) saveUserData();
        });
    });

    // Dosya Seçimi
    Utils.$('#mediaInput').addEventListener('change', handleFileSelect);

    // İhlal Türü Değişimi
    Utils.$('#violationType').addEventListener('change', (e) => {
        const customInput = Utils.$('#customViolation');
        if (e.target.value === 'other') {
            customInput.classList.remove('hidden');
            customInput.focus();
        } else {
            customInput.classList.add('hidden');
        }
    });
}

// --- Beni Hatırla Mantığı ---
function saveUserData() {
    localStorage.setItem('trafik_reporter_name', Utils.$('#reporterName').value);
    localStorage.setItem('trafik_reporter_phone', Utils.$('#reporterPhone').value);
    localStorage.setItem('trafik_remember', 'true');
}

function loadUserData() {
    if (localStorage.getItem('trafik_remember') === 'true') {
        Utils.$('#rememberMe').checked = true;
        Utils.$('#reporterName').value = localStorage.getItem('trafik_reporter_name') || '';
        Utils.$('#reporterPhone').value = localStorage.getItem('trafik_reporter_phone') || '';
    }
}

function toggleRememberMe(isChecked) {
    if (isChecked) {
        saveUserData();
    } else {
        localStorage.removeItem('trafik_reporter_name');
        localStorage.removeItem('trafik_reporter_phone');
        localStorage.setItem('trafik_remember', 'false');
    }
}

// --- Dosya ve EXIF İşlemleri ---
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // UI Güncelleme
    Utils.$('#fileStatus').classList.remove('hidden');
    Utils.$('#fileName').innerText = file.name;
    Utils.$('#uploadText').innerText = "Değiştir";

    // Boyut Kontrolü
    const sizeCheck = Utils.checkFileSize(file.size);
    const sizeEl = Utils.$('#fileSize');
    if (!sizeCheck.isValid) {
        sizeEl.innerHTML = `<span class="text-red-600 font-bold">${sizeCheck.mb} MB (Çok Büyük!)</span>`;
        alert("Uyarı: Dosya boyutu mail sınırını aşıyor!");
    } else {
        sizeEl.innerHTML = `<span class="text-green-600 font-medium">${sizeCheck.mb} MB</span>`;
    }

    // EXIF Okuma
    if (file.type.startsWith('image/')) {
        Utils.$('#metaDate').innerText = "Aranıyor...";
        Utils.$('#metaLoc').innerText = "Aranıyor...";

        EXIF.getData(file, function() {
            // Tarih
            const dateTaken = EXIF.getTag(this, "DateTimeOriginal");
            if (dateTaken) {
                const [d, t] = dateTaken.split(" ");
                const dateParts = d.split(":");
                Utils.$('#date').value = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
                Utils.$('#time').value = t.substring(0, 5);
                Utils.$('#metaDate').innerHTML = `<span class="text-green-600 font-bold">Bulundu</span>`;
            } else {
                Utils.$('#metaDate').innerText = "Yok";
            }

            // Konum
            const lat = EXIF.getTag(this, "GPSLatitude");
            const long = EXIF.getTag(this, "GPSLongitude");

            if (lat && long) {
                const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
                const longRef = EXIF.getTag(this, "GPSLongitudeRef") || "E";
                const latitude = Utils.convertDMSToDD(lat, latRef);
                const longitude = Utils.convertDMSToDD(long, longRef);
                
                Utils.$('#metaLoc').innerHTML = `<span class="text-green-600 font-bold">Koordinat OK</span>`;
                
                // Adres Çözümleme
                Utils.$('#locationLoader').classList.remove('hidden');
                Utils.resolveAddress(latitude, longitude).then(address => {
                    Utils.$('#location').value = address || `Koordinat: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    Utils.$('#locationLoader').classList.add('hidden');
                });
            } else {
                Utils.$('#metaLoc').innerText = "Yok";
            }
        });
    }
}

// --- Mail Oluşturma (Global Fonksiyonlar HTML onclick için) ---
window.openPreviewModal = function() {
    const plate = Utils.$('#plate').value;
    if(plate.length < 3) {
        alert("Lütfen önce araç plakasını giriniz.");
        return;
    }
    
    Utils.$('#finalTextPreview').value = generateText();
    Utils.$('#previewModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

window.closeModal = function() {
    Utils.$('#previewModal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

window.copyToClipboard = function() {
    const text = Utils.$('#finalTextPreview').value;
    navigator.clipboard.writeText(text).then(() => alert("Metin kopyalandı!"));
}

window.sendMail = function() {
    const text = Utils.$('#finalTextPreview').value;
    const plate = Utils.$('#plate').value;
    const subject = encodeURIComponent(`Trafik İhlal İhbarı: ${plate}`);
    const body = encodeURIComponent(text);
    window.location.href = `mailto:${CONFIG.mailAddress}?subject=${subject}&body=${body}`;
}

function generateText() {
    const plate = Utils.$('#plate').value.toUpperCase() || "XXX";
    const dateInput = Utils.$('#date').value;
    const dateFormatted = Utils.formatDate(dateInput);
    const time = Utils.$('#time').value;
    const location = Utils.$('#location').value || "Bursa genel";
    const reporterName = Utils.$('#reporterName').value || "İsimsiz";
    const reporterPhone = Utils.$('#reporterPhone').value || "-";
    const selectedKey = Utils.$('#violationType').value;

    let violationText = "";
    let lawCode = "";

    if (selectedKey === 'other') {
        violationText = Utils.$('#customViolation').value || "Trafik Kuralı İhlali";
        lawCode = "ilgili mevzuat";
    } else {
        const violationData = CONFIG.violations[selectedKey];
        violationText = violationData.text;
        lawCode = `KTK Madde ${violationData.code}`;
    }

    return `Bursa Emniyet Müdürlüğü Trafik Denetleme Şube Müdürlüğü'ne,

KONU: ${plate} plakalı aracın trafik kuralı ihlali ihbarı.

Aşağıda detayları belirtilen ve ekte görsel/video kanıtları sunulan aracın; Karayolları Trafik Kanunu'na aykırı hareket ettiği tespit edilmiştir.

OLAY BİLGİLERİ:
--------------------------------------------------
• PLAKA      : ${plate}
• TARİH/SAAT : ${dateFormatted} - ${time}
• İHLAL TÜRÜ : ${violationText}
• KONUM      : ${location}
--------------------------------------------------

TALEP:
Söz konusu eylemin ${lawCode} uyarınca değerlendirilerek;
1. Tescil plakasına cezai işlem uygulanmasını,
2. Kamu düzeninin sağlanmasını,
3. Tarafıma işlem sonucunun bildirilmesini arz ederim.

Saygılarımla,

İHBAR EDEN:
Ad Soyad : ${reporterName}
Telefon  : ${reporterPhone}
Tarih    : ${new Date().toLocaleDateString('tr-TR')}`;
}