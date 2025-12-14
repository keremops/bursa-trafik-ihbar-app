const CONFIG = {
    appVersion: "v1.1.0 Stable",
    mailAddress: "bursatrafikdnt@egm.gov.tr",
    maxFileSizeMB: 25,
    
    // Kanun Maddeleri Veritabanı
    violations: {
        park_kaldirim: { text: "Hatalı Park (Kaldırım Üzeri)", code: "61/1-n" },
        park_engelli:  { text: "Hatalı Park (Engelli Yeri)", code: "61/1-o" },
        park_durak:    { text: "Hatalı Park (Durak İhlali)", code: "61/1-e" },
        park_yaya:     { text: "Hatalı Park (Yaya Geçidi)", code: "61/1-c" },
        serit_ihlali:  { text: "Tehlikeli Şerit / Makas", code: "46/2-c" },
        ters_yon:      { text: "Ters Yön İhlali", code: "46/2-h" },
        kirmizi_isik:  { text: "Kırmızı Işık İhlali", code: "47/1-b" },
        other:         { text: "Diğer (Manuel Giriş)", code: null }
    }
};