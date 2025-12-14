const Utils = {
    // HTML Element Seçici Kısayolu
    $: (selector) => document.querySelector(selector),

    // Tarih Formatlayıcı (YYYY-MM-DD -> DD.MM.YYYY)
    formatDate: (dateString) => {
        if (!dateString) return "Tarihsiz";
        return dateString.split('-').reverse().join('.');
    },

    // Koordinat Dönüştürücü (DMS -> Decimal)
    convertDMSToDD: (dms, ref) => {
        let dd = dms[0] + dms[1]/60 + dms[2]/3600;
        if (ref === "S" || ref === "W") dd = dd * -1;
        return dd;
    },

    // Adres Çözümleyici (Reverse Geocoding)
    resolveAddress: async (lat, lon) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=tr`);
            const data = await response.json();
            return data.display_name || null;
        } catch (e) {
            console.error("Adres servisi hatası:", e);
            return null;
        }
    },

    // Dosya Boyutu Kontrolü
    checkFileSize: (sizeInBytes) => {
        const sizeMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        return {
            mb: sizeMB,
            isValid: sizeMB <= CONFIG.maxFileSizeMB
        };
    }
};