// İngilizce Kelime Verileri - 5 Kategori
const englishWords = [
    // Aile (s: 3)
    { ar: 'Father', ok: 'Fader', tr: 'Baba', s: 3, e: '👨' },
    { ar: 'Mother', ok: 'Mader', tr: 'Anne', s: 3, e: '👩' },
    { ar: 'Son', ok: 'San', tr: 'Oğul', s: 3, e: '👦' },
    { ar: 'Daughter', ok: 'Doter', tr: 'Kız', s: 3, e: '👧' },
    { ar: 'Brother', ok: 'Brader', tr: 'Erkek Kardeş', s: 3, e: '👦' },
    { ar: 'Sister', ok: 'Sister', tr: 'Kız Kardeş', s: 3, e: '👩' },
    { ar: 'Grandfather', ok: 'Grendfader', tr: 'Dede', s: 3, e: '👴' },
    { ar: 'Grandmother', ok: 'Grendmader', tr: 'Nine', s: 3, e: '👵' },
    { ar: 'Baby', ok: 'Beybi', tr: 'Bebek', s: 3, e: '👶' },
    { ar: 'Family', ok: 'Femili', tr: 'Aile', s: 3, e: '🏠' },

    // Renkler (s: 4)
    { ar: 'Red', ok: 'Red', tr: 'Kırmızı', s: 4, e: '🔴' },
    { ar: 'Blue', ok: 'Blu', tr: 'Mavi', s: 4, e: '🔵' },
    { ar: 'Yellow', ok: 'Yelou', tr: 'Sarı', s: 4, e: '🟡' },
    { ar: 'Green', ok: 'Grin', tr: 'Yeşil', s: 4, e: '🟢' },
    { ar: 'Orange', ok: 'Orinc', tr: 'Turuncu', s: 4, e: '🟠' },
    { ar: 'Purple', ok: 'Pörpıl', tr: 'Mor', s: 4, e: '🟣' },
    { ar: 'Pink', ok: 'Pink', tr: 'Pembe', s: 4, e: '💗' },
    { ar: 'Black', ok: 'Blek', tr: 'Siyah', s: 4, e: '⚫' },
    { ar: 'White', ok: 'Vayt', tr: 'Beyaz', s: 4, e: '⚪' },
    { ar: 'Brown', ok: 'Braun', tr: 'Kahverengi', s: 4, e: '🟤' },

    // Hayvanlar 1 (s: 5)
    { ar: 'Cat', ok: 'Ket', tr: 'Kedi', s: 5, e: '🐱' },
    { ar: 'Dog', ok: 'Dog', tr: 'Köpek', s: 5, e: '🐶' },
    { ar: 'Bird', ok: 'Börd', tr: 'Kuş', s: 5, e: '🐦' },
    { ar: 'Fish', ok: 'Fiş', tr: 'Balık', s: 5, e: '🐟' },
    { ar: 'Lion', ok: 'Layın', tr: 'Aslan', s: 5, e: '🦁' },
    { ar: 'Elephant', ok: 'Elefınt', tr: 'Fil', s: 5, e: '🐘' },
    { ar: 'Monkey', ok: 'Manki', tr: 'Maymun', s: 5, e: '🐵' },
    { ar: 'Rabbit', ok: 'Rebit', tr: 'Tavşan', s: 5, e: '🐰' },
    { ar: 'Bear', ok: 'Ber', tr: 'Ayı', s: 5, e: '🐻' },
    { ar: 'Horse', ok: 'Hors', tr: 'At', s: 5, e: '🐴' },

    // Hayvanlar 2 (s: 6)
    { ar: 'Cow', ok: 'Kau', tr: 'İnek', s: 6, e: '🐄' },
    { ar: 'Sheep', ok: 'Şip', tr: 'Koyun', s: 6, e: '🐑' },
    { ar: 'Chicken', ok: 'Çikın', tr: 'Tavuk', s: 6, e: '🐔' },
    { ar: 'Duck', ok: 'Dak', tr: 'Ördek', s: 6, e: '🦆' },
    { ar: 'Butterfly', ok: 'Batırflay', tr: 'Kelebek', s: 6, e: '🦋' },
    { ar: 'Frog', ok: 'Frog', tr: 'Kurbağa', s: 6, e: '🐸' },
    { ar: 'Turtle', ok: 'Törtıl', tr: 'Kaplumbağa', s: 6, e: '🐢' },
    { ar: 'Giraffe', ok: 'Ciraf', tr: 'Zürafa', s: 6, e: '🦒' },
    { ar: 'Zebra', ok: 'Zebra', tr: 'Zebra', s: 6, e: '🦓' },
    { ar: 'Penguin', ok: 'Penguin', tr: 'Penguen', s: 6, e: '🐧' },

    // Meyveler (s: 7)
    { ar: 'Apple', ok: 'Epıl', tr: 'Elma', s: 7, e: '🍎' },
    { ar: 'Banana', ok: 'Bınana', tr: 'Muz', s: 7, e: '🍌' },
    { ar: 'Orange', ok: 'Orinc', tr: 'Portakal', s: 7, e: '🍊' },
    { ar: 'Strawberry', ok: 'Stroberi', tr: 'Çilek', s: 7, e: '🍓' },
    { ar: 'Grapes', ok: 'Greyps', tr: 'Üzüm', s: 7, e: '🍇' },
    { ar: 'Watermelon', ok: 'Votermelın', tr: 'Karpuz', s: 7, e: '🍉' },
    { ar: 'Lemon', ok: 'Lemın', tr: 'Limon', s: 7, e: '🍋' },
    { ar: 'Cherry', ok: 'Çeri', tr: 'Kiraz', s: 7, e: '🍒' },
    { ar: 'Peach', ok: 'Piç', tr: 'Şeftali', s: 7, e: '🍑' },
    { ar: 'Pear', ok: 'Per', tr: 'Armut', s: 7, e: '🍐' },

    // Sayılar (s: 2)
    { ar: 'One', ok: 'Van', tr: 'Bir', s: 2, e: '1️⃣' },
    { ar: 'Two', ok: 'Tu', tr: 'İki', s: 2, e: '2️⃣' },
    { ar: 'Three', ok: 'Thri', tr: 'Üç', s: 2, e: '3️⃣' },
    { ar: 'Four', ok: 'For', tr: 'Dört', s: 2, e: '4️⃣' },
    { ar: 'Five', ok: 'Fayv', tr: 'Beş', s: 2, e: '5️⃣' },
    { ar: 'Six', ok: 'Siks', tr: 'Altı', s: 2, e: '6️⃣' },
    { ar: 'Seven', ok: 'Sevın', tr: 'Yedi', s: 2, e: '7️⃣' },
    { ar: 'Eight', ok: 'Eyt', tr: 'Sekiz', s: 2, e: '8️⃣' },
    { ar: 'Nine', ok: 'Nayn', tr: 'Dokuz', s: 2, e: '9️⃣' },
    { ar: 'Ten', ok: 'Ten', tr: 'On', s: 2, e: '🔟' },
    { ar: 'Eleven', ok: 'İlevın', tr: 'On bir', s: 2, e: '1️⃣1️⃣' },
    { ar: 'Twelve', ok: 'Tvelv', tr: 'On iki', s: 2, e: '1️⃣2️⃣' },
    { ar: 'Thirteen', ok: 'Törtin', tr: 'On üç', s: 2, e: '1️⃣3️⃣' },
    { ar: 'Fourteen', ok: 'Fortin', tr: 'On dört', s: 2, e: '1️⃣4️⃣' },
    { ar: 'Fifteen', ok: 'Fiftin', tr: 'On beş', s: 2, e: '1️⃣5️⃣' },
    { ar: 'Sixteen', ok: 'Sikstin', tr: 'On altı', s: 2, e: '1️⃣6️⃣' },
    { ar: 'Seventeen', ok: 'Sevıntin', tr: 'On yedi', s: 2, e: '1️⃣7️⃣' },
    { ar: 'Eighteen', ok: 'Eytin', tr: 'On sekiz', s: 2, e: '1️⃣8️⃣' },
    { ar: 'Nineteen', ok: 'Nayntin', tr: 'On dokuz', s: 2, e: '1️⃣9️⃣' },
    { ar: 'Twenty', ok: 'Tventi', tr: 'Yirmi', s: 2, e: '2️⃣0️⃣' },

    // Şekiller (s: 21)
    { ar: 'Circle', ok: 'Sörkıl', tr: 'Daire', s: 21, e: '⭕' },
    { ar: 'Square', ok: 'Skweyr', tr: 'Kare', s: 21, e: '⬜' },
    { ar: 'Triangle', ok: 'Trayengıl', tr: 'Üçgen', s: 21, e: '🔺' },
    { ar: 'Rectangle', ok: 'Rektengıl', tr: 'Dikdörtgen', s: 21, e: '▬' },
    { ar: 'Star', ok: 'Star', tr: 'Yıldız', s: 21, e: '⭐' },
    { ar: 'Heart', ok: 'Hart', tr: 'Kalp', s: 21, e: '❤️' },
    { ar: 'Line', ok: 'Layn', tr: 'Çizgi', s: 21, e: '➖' },
    { ar: 'Dot', ok: 'Dot', tr: 'Nokta', s: 21, e: '•' },
    { ar: 'Diamond', ok: 'Daymınd', tr: 'Elmas', s: 21, e: '🔷' },
    { ar: 'Oval', ok: 'Ovıl', tr: 'Oval', s: 21, e: '🥚' },
    { ar: 'Pentagon', ok: 'Pentagın', tr: 'Beşgen', s: 21, e: '⬟' },
    { ar: 'Hexagon', ok: 'Heksagın', tr: 'Altıgen', s: 21, e: '⬢' },
    { ar: 'Crescent', ok: 'Kresınt', tr: 'Hilal', s: 21, e: '🌙' },
    { ar: 'Cube', ok: 'Kyub', tr: 'Küp', s: 21, e: '🧊' },

    // Mutfak (s: 22)
    { ar: 'Plate', ok: 'Pleyt', tr: 'Tabak', s: 22, e: '🍽️' },
    { ar: 'Glass', ok: 'Gles', tr: 'Bardak', s: 22, e: '🥛' },
    { ar: 'Spoon', ok: 'Spun', tr: 'Kaşık', s: 22, e: '🥄' },
    { ar: 'Fork', ok: 'Fork', tr: 'Çatal', s: 22, e: '🍴' },
    { ar: 'Knife', ok: 'Nayf', tr: 'Bıçak', s: 22, e: '🔪' },
    { ar: 'Pot', ok: 'Pot', tr: 'Tencere', s: 22, e: '🍲' },
    { ar: 'Pan', ok: 'Pen', tr: 'Tava', s: 22, e: '🍳' },
    { ar: 'Bowl', ok: 'Boul', tr: 'Kase', s: 22, e: '🥣' },
    { ar: 'Cup', ok: 'Kap', tr: 'Fincan', s: 22, e: '☕' },
    { ar: 'Oven', ok: 'Oven', tr: 'Fırın', s: 22, e: '♨️' },

    // Temel Cümleler (s: 23)
    // 1. Selamlaşma & Tanışma
    { ar: 'Hello', ok: 'Helo', tr: 'Merhaba', s: 23, e: '👋' },
    { ar: 'Good morning', ok: 'Gud morning', tr: 'Günaydın', s: 23, e: '🌅' },
    { ar: 'Good night', ok: 'Gud nayt', tr: 'İyi geceler', s: 23, e: '🌙' },
    { ar: 'What is your name?', ok: 'Vat iz yor neym?', tr: 'Adın ne?', s: 23, e: '🤔' },
    { ar: 'My name is Elif', ok: 'May neym iz Elif', tr: 'Benim adım Elif', s: 23, e: '👧' },
    { ar: 'Nice to meet you', ok: 'Nays tu mit yu', tr: 'Memnun oldum', s: 23, e: '🤝' },
    { ar: 'How are you?', ok: 'Hav ar yu?', tr: 'Nasılsın?', s: 23, e: '😊' },
    { ar: 'I am fine, thank you', ok: 'Ay em fayn, tenk yu', tr: 'İyiyim, teşekkürler', s: 23, e: '👍' },
    { ar: 'How old are you?', ok: 'Hav old ar yu?', tr: 'Kaç yaşındasın?', s: 23, e: '🎂' },
    { ar: 'Where are you from?', ok: 'Ver ar yu fram?', tr: 'Nerelisin?', s: 23, e: '🌍' },
    { ar: 'See you soon', ok: 'Si yu sun', tr: 'Görüşmek üzere', s: 23, e: '🙋' },
    { ar: 'Welcome', ok: 'Velkam', tr: 'Hoş geldin', s: 23, e: '🤗' },

    // 2. Nezaket & Günlük İfadeler
    { ar: 'Please', ok: 'Pliz', tr: 'Lütfen', s: 23, e: '🤲' },
    { ar: 'Thank you', ok: 'Tenk yu', tr: 'Teşekkür ederim', s: 23, e: '🙏' },
    { ar: 'I am sorry', ok: 'Ay em sori', tr: 'Özür dilerim', s: 23, e: '🙇' },
    { ar: 'Yes', ok: 'Yes', tr: 'Evet', s: 23, e: '✅' },
    { ar: 'No', ok: 'No', tr: 'Hayır', s: 23, e: '❌' },

    // 3. Okul & Meslekler
    { ar: 'I am a student', ok: 'Ay em e styudınt', tr: 'Ben bir öğrenciyim', s: 23, e: '🎒' },
    { ar: 'I am a teacher', ok: 'Ay em e tiçır', tr: 'Ben bir öğretmenim', s: 23, e: '📖' },
    { ar: 'I am a doctor', ok: 'Ay em e doktır', tr: 'Ben bir doktorum', s: 23, e: '🩺' },

    // 4. Hoşlandığım Şeyler & Hobiler
    { ar: 'I love you', ok: 'Ay lav yu', tr: 'Seni seviyorum', s: 23, e: '❤️' },
    { ar: 'I like playing games', ok: 'Ay layk pleying geymz', tr: 'Oyun oynamayı severim', s: 23, e: '🎮' },
    { ar: 'I like reading books', ok: 'Ay layk riding buks', tr: 'Kitap okumayı severim', s: 23, e: '📚' },
    { ar: 'I like drawing', ok: 'Ay layk droving', tr: 'Resim yapmayı severim', s: 23, e: '🎨' },
    { ar: 'I like ice cream', ok: 'Ay layk ays krim', tr: 'Dondurmayı severim', s: 23, e: '🍦' },

    // 5. Günlük Durumlar & İhtiyaçlar
    { ar: 'I am hungry', ok: 'Ay em hangri', tr: 'Acıktım', s: 23, e: '😋' },
    { ar: 'I am thirsty', ok: 'Ay em törsti', tr: 'Susadım', s: 23, e: '🥛' },
    { ar: 'I am sleepy', ok: 'Ay em slipi', tr: 'Uykum var', s: 23, e: '😴' }
];
