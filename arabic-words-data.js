// Arapça Kelime Verileri - Tüm Kategoriler
const arabicWords = [
    // Aile (s: 3)
    { ar: 'أب', ok: 'Eb', tr: 'Baba', s: 3, e: '👨' },
    { ar: 'أم', ok: 'Ümm', tr: 'Anne', s: 3, e: '👩' },
    { ar: 'ابن', ok: 'İbn', tr: 'Oğul', s: 3, e: '👦' },
    { ar: 'بنت', ok: 'Bint', tr: 'Kız', s: 3, e: '👧' },
    { ar: 'أخ', ok: 'Ah', tr: 'Erkek kardeş', s: 3, e: '👱' },
    { ar: 'أخت', ok: 'Uht', tr: 'Kız kardeş', s: 3, e: '👱‍♀️' },
    { ar: 'جد', ok: 'Cedd', tr: 'Dede', s: 3, e: '👴' },
    { ar: 'جدة', ok: 'Cedde', tr: 'Nine', s: 3, e: '👵' },
    { ar: 'طفل', ok: 'Tıfl', tr: 'Bebek', s: 3, e: '👶' },
    { ar: 'عائلة', ok: 'Aile', tr: 'Aile', s: 3, e: '👨‍👩‍👧‍👦' },

    // Renkler (s: 4)
    { ar: 'أحمر', ok: 'Ahmer', tr: 'Kırmızı', s: 4, e: '🔴' },
    { ar: 'أزرق', ok: 'Ezrak', tr: 'Mavi', s: 4, e: '🔵' },
    { ar: 'أصفر', ok: 'Asfar', tr: 'Sarı', s: 4, e: '🟡' },
    { ar: 'أخضر', ok: 'Ahdar', tr: 'Yeşil', s: 4, e: '🟢' },
    { ar: 'برتقالي', ok: 'Burtukaliy', tr: 'Turuncu', s: 4, e: '🟠' },
    { ar: 'بنفسجي', ok: 'Benefseciy', tr: 'Mor', s: 4, e: '🟣' },
    { ar: 'وردي', ok: 'Verdiy', tr: 'Pembe', s: 4, e: '💗' },
    { ar: 'أسود', ok: 'Esved', tr: 'Siyah', s: 4, e: '⚫' },
    { ar: 'أبيض', ok: 'Ebyad', tr: 'Beyaz', s: 4, e: '⚪' },
    { ar: 'بني', ok: 'Bunniy', tr: 'Kahverengi', s: 4, e: '🟤' },

    // Hayvanlar 1 (s: 5)
    { ar: 'قطة', ok: 'Kıtta', tr: 'Kedi', s: 5, e: '🐱' },
    { ar: 'كلب', ok: 'Kelb', tr: 'Köpek', s: 5, e: '🐶' },
    { ar: 'طائر', ok: 'Tair', tr: 'Kuş', s: 5, e: '🐦' },
    { ar: 'سمكة', ok: 'Semeke', tr: 'Balık', s: 5, e: '🐟' },
    { ar: 'أسد', ok: 'Esed', tr: 'Aslan', s: 5, e: '🦁' },
    { ar: 'فيل', ok: 'Fil', tr: 'Fil', s: 5, e: '🐘' },
    { ar: 'قرد', ok: 'Kırd', tr: 'Maymun', s: 5, e: '🐵' },
    { ar: 'أرنب', ok: 'Erneb', tr: 'Tavşan', s: 5, e: '🐰' },
    { ar: 'دب', ok: 'Dubb', tr: 'Ayı', s: 5, e: '🐻' },
    { ar: 'حصان', ok: 'Hısan', tr: 'At', s: 5, e: '🐴' },

    // Hayvanlar 2 (s: 6)
    { ar: 'بقرة', ok: 'Bakara', tr: 'İnek', s: 6, e: '🐄' },
    { ar: 'خروف', ok: 'Haruf', tr: 'Koyun', s: 6, e: '🐑' },
    { ar: 'دجاجة', ok: 'Decace', tr: 'Tavuk', s: 6, e: '🐔' },
    { ar: 'بطة', ok: 'Batta', tr: 'Ördek', s: 6, e: '🦆' },
    { ar: 'فراشة', ok: 'Feraşe', tr: 'Kelebek', s: 6, e: '🦋' },
    { ar: 'ضفدع', ok: 'Dıfda', tr: 'Kurbağa', s: 6, e: '🐸' },
    { ar: 'سلحفاة', ok: 'Sulahfat', tr: 'Kaplumbağa', s: 6, e: '🐢' },
    { ar: 'زرافة', ok: 'Zerafe', tr: 'Zürafa', s: 6, e: '🦒' },
    { ar: 'حمار وحشي', ok: 'Hımarun vahşiy', tr: 'Zebra', s: 6, e: '🦓' },
    { ar: 'بطريق', ok: 'Batrık', tr: 'Penguen', s: 6, e: '🐧' },

    // Meyveler (s: 7)
    { ar: 'تفاحة', ok: 'Tuffaha', tr: 'Elma', s: 7, e: '🍎' },
    { ar: 'موز', ok: 'Mevz', tr: 'Muz', s: 7, e: '🍌' },
    { ar: 'برتقال', ok: 'Burtukal', tr: 'Portakal', s: 7, e: '🍊' },
    { ar: 'فراولة', ok: 'Feravle', tr: 'Çilek', s: 7, e: '🍓' },
    { ar: 'عنب', ok: 'İneb', tr: 'Üzüm', s: 7, e: '🍇' },
    { ar: 'بطيخ', ok: 'Battıh', tr: 'Karpuz', s: 7, e: '🍉' },
    { ar: 'ليمون', ok: 'Leymun', tr: 'Limon', s: 7, e: '🍋' },
    { ar: 'كرز', ok: 'Kerez', tr: 'Kiraz', s: 7, e: '🍒' },
    { ar: 'خوخ', ok: 'Havh', tr: 'Şeftali', s: 7, e: '🍑' },
    { ar: 'إجاص', ok: 'İccas', tr: 'Armut', s: 7, e: '🍐' },

    // Sayılar (s: 2)
    { ar: 'واحد', ok: 'Vahid', tr: 'Bir', s: 2, e: '1️⃣' },
    { ar: 'اثنان', ok: 'İsnan', tr: 'İki', s: 2, e: '2️⃣' },
    { ar: 'ثلاثة', ok: 'Selase', tr: 'Üç', s: 2, e: '3️⃣' },
    { ar: 'أربعة', ok: 'Erbaa', tr: 'Dört', s: 2, e: '4️⃣' },
    { ar: 'خمسة', ok: 'Hamse', tr: 'Beş', s: 2, e: '5️⃣' },
    { ar: 'ستة', ok: 'Sitte', tr: 'Altı', s: 2, e: '6️⃣' },
    { ar: 'سبعة', ok: 'Sebaa', tr: 'Yedi', s: 2, e: '7️⃣' },
    { ar: 'ثمانية', ok: 'Semaniye', tr: 'Sekiz', s: 2, e: '8️⃣' },
    { ar: 'تسعة', ok: 'Tisaa', tr: 'Dokuz', s: 2, e: '9️⃣' },
    { ar: 'عشرة', ok: 'Aşera', tr: 'On', s: 2, e: '🔟' },
    { ar: 'أحد عشر', ok: 'Ehade aşer', tr: 'On bir', s: 2, e: '1️⃣1️⃣' },
    { ar: 'اثنا عشر', ok: 'İsna aşer', tr: 'On iki', s: 2, e: '1️⃣2️⃣' },
    { ar: 'ثلاثة عشر', ok: 'Selasetü aşer', tr: 'On üç', s: 2, e: '1️⃣3️⃣' },
    { ar: 'أربعة عشر', ok: 'Erbaatü aşer', tr: 'On dört', s: 2, e: '1️⃣4️⃣' },
    { ar: 'خمسة عشر', ok: 'Hamsetü aşer', tr: 'On beş', s: 2, e: '1️⃣5️⃣' },
    { ar: 'ستة عشر', ok: 'Sittetü aşer', tr: 'On altı', s: 2, e: '1️⃣6️⃣' },
    { ar: 'سبعة عشر', ok: 'Sebatü aşer', tr: 'On yedi', s: 2, e: '1️⃣7️⃣' },
    { ar: 'ثمانية عشر', ok: 'Semaniyetü aşer', tr: 'On sekiz', s: 2, e: '1️⃣8️⃣' },
    { ar: 'تسعة عشر', ok: 'Tisatü aşer', tr: 'On dokuz', s: 2, e: '1️⃣9️⃣' },
    { ar: 'عشرون', ok: 'İşrun', tr: 'Yirmi', s: 2, e: '2️⃣0️⃣' },

    // Şekiller (s: 21)
    { ar: 'دائرة', ok: 'Daire', tr: 'Daire', s: 21, e: '⭕' },
    { ar: 'مربع', ok: 'Murabba', tr: 'Kare', s: 21, e: '⬜' },
    { ar: 'مثلث', ok: 'Muselles', tr: 'Üçgen', s: 21, e: '🔺' },
    { ar: 'مستطيل', ok: 'Mustatil', tr: 'Dikdörtgen', s: 21, e: '▬' },
    { ar: 'نجمة', ok: 'Necme', tr: 'Yıldız', s: 21, e: '⭐' },
    { ar: 'قلب', ok: 'Kalb', tr: 'Kalp', s: 21, e: '❤️' },
    { ar: 'خط', ok: 'Hatt', tr: 'Çizgi', s: 21, e: '➖' },
    { ar: 'نقطة', ok: 'Nukta', tr: 'Nokta', s: 21, e: '•' },
    { ar: 'معين', ok: 'Muayyen', tr: 'Elmas', s: 21, e: '🔷' },
    { ar: 'بيضاوي', ok: 'Beydaviy', tr: 'Oval', s: 21, e: '🥚' },
    { ar: 'خماسي', ok: 'Humasiv', tr: 'Beşgen', s: 21, e: '⬟' },
    { ar: 'سداسي', ok: 'Sudasiy', tr: 'Altıgen', s: 21, e: '⬢' },
    { ar: 'هلال', ok: 'Hilal', tr: 'Hilal', s: 21, e: '🌙' },
    { ar: 'مكعب', ok: 'Mukaab', tr: 'Küp', s: 21, e: '🧊' },

    // Mutfak (s: 22)
    { ar: 'طبق', ok: 'Tabak', tr: 'Tabak', s: 22, e: '🍽️' },
    { ar: 'كأس', ok: 'Kaes', tr: 'Bardak', s: 22, e: '🥛' },
    { ar: 'ملعقة', ok: 'Mılaka', tr: 'Kaşık', s: 22, e: '🥄' },
    { ar: 'شوكة', ok: 'Şevke', tr: 'Çatal', s: 22, e: '🍴' },
    { ar: 'سكين', ok: 'Sikkin', tr: 'Bıçak', s: 22, e: '🔪' },
    { ar: 'قدر', ok: 'Kidr', tr: 'Tencere', s: 22, e: '🍲' },
    { ar: 'مقلاة', ok: 'Mikla', tr: 'Tava', s: 22, e: '🍳' },
    { ar: 'وعاء', ok: 'Vi\'a', tr: 'Kase', s: 22, e: '🥣' },
    { ar: 'فنجان', ok: 'Fincan', tr: 'Fincan', s: 22, e: '☕' },
    { ar: 'فرن', ok: 'Furn', tr: 'Fırın', s: 22, e: '♨️' },

    // Temel Cümleler (s: 23)
    // 1. Selamlaşma & Tanışma
    { ar: 'مَرْحَبًا', ok: 'Merhaban', tr: 'Merhaba', s: 23, e: '👋' },
    { ar: 'صَبَاحُ الْخَيْرِ', ok: 'Sabahul hayr', tr: 'Günaydın', s: 23, e: '🌅' },
    { ar: 'تُصْبِحُ عَلَى خَيْرٍ', ok: 'Tusbihu ala hayr', tr: 'İyi geceler', s: 23, e: '🌙' },
    { ar: 'مَا اسْمُكَ؟', ok: 'Mesmuke?', tr: 'Adın ne?', s: 23, e: '🤔' },
    { ar: 'اسْمِي إِلِيف', ok: 'İsmi Elif', tr: 'Benim adım Elif', s: 23, e: '👧' },
    { ar: 'تَشَرَّفْتُ بِمَعْرِفَتِكَ', ok: 'Teşerraftü bi-marifetik', tr: 'Memnun oldum', s: 23, e: '🤝' },
    { ar: 'كَيْفَ حَالُكَ؟', ok: 'Keyfe haluk?', tr: 'Nasılsın?', s: 23, e: '😊' },
    { ar: 'أَنَا بِخَيْرٍ، شُكْرًا', ok: 'Ene bihayr, şükran', tr: 'İyiyim, teşekkürler', s: 23, e: '👍' },
    { ar: 'كَمْ عُمْرُكَ؟', ok: 'Kem umruk?', tr: 'Kaç yaşındasın?', s: 23, e: '🎂' },
    { ar: 'مِنْ أَيْنَ أَنْتَ؟', ok: 'Min eyne ente?', tr: 'Nerelisin?', s: 23, e: '🌍' },
    { ar: 'أَرَاكَ لَاحِقًا', ok: 'Erake lahikan', tr: 'Görüşmek üzere', s: 23, e: '🙋' },
    { ar: 'أَهْلًا وَسَهْلًا', ok: 'Ehlen ve sehlen', tr: 'Hoş geldin', s: 23, e: '🤗' },

    // 2. Nezaket & Günlük İfadeler
    { ar: 'مِنْ فَضْلِكَ', ok: 'Min fadlik', tr: 'Lütfen', s: 23, e: '🤲' },
    { ar: 'شُكْرًا لَكَ', ok: 'Şükran lek', tr: 'Teşekkür ederim', s: 23, e: '🙏' },
    { ar: 'أَنَا آسِفٌ', ok: 'Ene asif', tr: 'Özür dilerim', s: 23, e: '🙇' },
    { ar: 'نَعَمْ', ok: 'Naam', tr: 'Evet', s: 23, e: '✅' },
    { ar: 'لَا', ok: 'La', tr: 'Hayır', s: 23, e: '❌' },

    // 3. Okul & Meslekler
    { ar: 'أَنَا طَالِبٌ', ok: 'Ene talib', tr: 'Ben bir öğrenciyim', s: 23, e: '🎒' },
    { ar: 'أَنَا مُعَلِّمٌ', ok: 'Ene muallem', tr: 'Ben bir öğretmenim', s: 23, e: '📖' },
    { ar: 'أَنَا طَبِيبٌ', ok: 'Ene tabib', tr: 'Ben bir doktorum', s: 23, e: '🩺' },

    // 4. Hoşlandığım Şeyler & Hobiler
    { ar: 'أُحِبُّكَ', ok: 'Uhibbuke', tr: 'Seni seviyorum', s: 23, e: '❤️' },
    { ar: 'أُحِبُّ اللَّعِبَ', ok: 'Uhibbu\'l-laib', tr: 'Oyun oynamayı severim', s: 23, e: '🎮' },
    { ar: 'أُحِبُّ الْقِرَاءَةَ', ok: 'Uhibbu\'l-kırae', tr: 'Kitap okumayı severim', s: 23, e: '📚' },
    { ar: 'أُحِبُّ الرَّسْمَ', ok: 'Uhibbu\'r-rasm', tr: 'Resim yapmayı severim', s: 23, e: '🎨' },
    { ar: 'أُحِبُّ الْمُثَلَّجَاتِ', ok: 'Uhibbu\'l-müsellecat', tr: 'Dondurmayı severim', s: 23, e: '🍦' },

    // 5. Günlük Durumlar & İhtiyaçlar
    { ar: 'أَنَا جَائِعٌ', ok: 'Ene cai\'', tr: 'Acıktım', s: 23, e: '😋' },
    { ar: 'أَنَا عَطْشَانُ', ok: 'Ene atşan', tr: 'Susadım', s: 23, e: '🥛' },
    { ar: 'أَنَا نَعْسَانُ', ok: 'Ene na\'san', tr: 'Uykum var', s: 23, e: '😴' }
];
