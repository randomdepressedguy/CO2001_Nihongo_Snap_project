// Comprehensive JLPT N5 (~60 points) & N4 (~65 points) Grammar Dataset
// Schema: { id, title, reading, romaji, jlpt, meaning: { vi, en }, formation: string[], explanation, notes, examples: [{ ja, furigana, vi, en }] }

const RAW_GRAMMAR_N5 = [
  [
    '〜は〜です', 'はです', 'wa desu',
    'A là B (Câu khẳng định lịch sự)', 'A is B (Polite affirmative copula)',
    ['Danh từ 1 + は + Danh từ 2 / Tính từ + です'],
    'Cấu trúc cơ bản nhất trong tiếng Nhật dùng để giới thiệu tên, nghề nghiệp, quốc tịch hoặc mô tả tính chất của chủ ngữ. Trợ từ は (đọc là wa) đánh dấu chủ đề của câu.',
    'Không dùng です trực tiếp sau động từ (động từ dùng đuôi ます).',
    '私はベトナム人です。', 'わたしはべとなむじんです。', 'Tôi là người Việt Nam.', 'I am Vietnamese.'
  ],
  [
    '〜は〜ではありません / じゃありません', 'はではありません', 'wa dewa arimasen',
    'A không phải là B', 'A is not B (Polite negative)',
    ['Danh từ 1 + は + Danh từ 2 + ではありません / じゃありません'],
    'Dạng phủ định lịch sự của です. Trong văn nói hằng ngày, じゃありません hoặc じゃないです thường được dùng nhiều hơn ではありません.',
    'では trong ではありません đọc là dewa.',
    '田中さんは学生ではありません。', 'たなかさんはがくせいではありません。', 'Anh Tanaka không phải là sinh viên.', 'Mr. Tanaka is not a student.'
  ],
  [
    '〜か（疑問文）', 'か', 'ka',
    'Phải không? / Câu nghi vấn', 'Question marker particle',
    ['Câu khẳng định lịch sự (〜です / 〜ます) + か'],
    'Đặt trợ từ か ở cuối câu với ngữ điệu lên giọng để biến câu trần thuật thành câu hỏi lịch sự.',
    'Trong câu hỏi có từ để hỏi (何, どこ, だれ...), vẫn giữ か ở cuối câu lịch sự.',
    'お名前は何ですか。', 'おなまえはなんですか。', 'Tên của bạn là gì?', 'What is your name?'
  ],
  [
    'N1 の N2', 'の', 'no',
    'N2 của N1 (Sở hữu / Thuộc về)', 'Possessive / Modifying particle (of, \'s)',
    ['Danh từ 1 + の + Danh từ 2'],
    'Trợ từ の dùng để nối hai danh từ, biểu thị quyền sở hữu, nơi trực thuộc, xuất xứ hoặc nội dung chuyên môn của danh từ đứng sau.',
    'Thứ tự ngược với tiếng Việt: người sở hữu đứng trước, vật sở hữu đứng sau (私の本 = sách của tôi).',
    'これは私の日本語の本です。', 'これはわたしのにほんごのほんです。', 'Đây là quyển sách tiếng Nhật của tôi.', 'This is my Japanese book.'
  ],
  [
    '〜も（〜も）', 'も', 'mo',
    'Cũng (~ cũng vậy)', 'Also, too, as well',
    ['Danh từ + も + Vị ngữ'],
    'Thay thế cho trợ từ は, が hoặc を khi muốn diễn tả một đối tượng có cùng tính chất hoặc hành động với đối tượng đã nêu trước đó.',
    'Khi đi với に hoặc へ thì đặt も ngay sau đó (にも, へも).',
    '私も東京へ行きます。', 'わたしもとうきょうへいきます。', 'Tôi cũng sẽ đi Tokyo.', 'I am going to Tokyo too.'
  ],
  [
    'これ・それ・あれ・どれ', 'これそれあれどれ', 'kore sore are dore',
    'Cái này / Cái đó / Cái kia / Cái nào', 'This / That / That over there / Which one',
    ['これ / それ / あれ + は + Danh từ + です'],
    'Đại từ chỉ định đồ vật: これ (gần người nói), それ (gần người nghe), あれ (xa cả hai), どれ (cái nào trong từ 3 vật trở lên).',
    'Không đứng trực tiếp trước danh từ (muốn bổ nghĩa danh từ phải dùng この・その・あの・どの + N).',
    'それはどこの傘ですか。', 'それはどこのかさですか。', 'Đó là chiếc ô của nước/hãng nào vậy?', 'Where is that umbrella from?'
  ],
  [
    'この・その・あの・どの + N', 'このそのあのどの', 'kono sono ano dono',
    'N này / N đó / N kia / N nào', 'This N / That N / Which N',
    ['この / その / あの / どの + Danh từ'],
    'Từ chỉ định bắt buộc phải đi kèm ngay trước một danh từ để xác định cụ thể đối tượng đang nói tới.',
    'Luôn phải có danh từ theo sau, không thể đứng độc lập một mình như これ・それ・あれ.',
    'この鞄は誰のですか。', 'このかばんはだれのですか。', 'Chiếc túi này là của ai vậy?', 'Whose bag is this?'
  ],
  [
    'ここ・そこ・あそこ・どこ', 'ここそこあそこどこ', 'koko soko asoko doko',
    'Ở đây / Ở đó / Ở kia / Ở đâu', 'Here / There / Over there / Where',
    ['ここ / そこ / あそこ + は + Địa điểm + です'],
    'Đại từ chỉ nơi chốn: ここ (chỗ người nói), そこ (chỗ người nghe), あそこ (chỗ xa cả hai), どこ (ở đâu).',
    'Dạng lịch sự hơn là こちら・そちら・あちら・どちら (vừa chỉ hướng vừa chỉ nơi chốn/người).',
    '図書館はどこですか。', 'としょかんはどこですか。', 'Thư viện ở đâu vậy?', 'Where is the library?'
  ],
  [
    '〜ます / 〜ません / 〜ました / 〜ませんでした', 'ます', 'masu',
    'Chia thời hiện tại / tương lai / quá khứ lịch sự của động từ', 'Polite verb tense conjugations',
    ['V-ます (Hiện tại/Tương lai)', 'V-ません (Phủ định)', 'V-ました (Quá khứ)', 'V-ませんでした (Quá khứ phủ định)'],
    'Đuôi động từ lịch sự trong giao tiếp chuẩn mực. V-ます diễn tả thói quen ở hiện tại hoặc hành động sẽ diễn ra trong tương lai.',
    'Trong câu quá khứ phủ định dùng ませんでした chứ không dùng ましたない.',
    '昨日、映画を見ませんでした。', 'きのう、えいがをみませんでした。', 'Hôm qua tôi đã không xem phim.', 'I did not watch a movie yesterday.'
  ],
  [
    '時間 + に', 'じかんに', 'jikan ni',
    'Vào lúc (thời điểm cụ thể)', 'At (a specific point in time)',
    ['Danh từ chỉ thời gian có con số cụ thể (Giờ, Thứ, Ngày, Tháng) + に + Động từ'],
    'Trợ từ に đặt sau thời gian có con số xác định (6 giờ, ngày 10, Chủ nhật) để chỉ thời điểm hành động xảy ra.',
    'Các từ chỉ thời gian tương đối như 今日 (hôm nay), 明日 (ngày mai), 毎日 (mỗi ngày), 来週 (tuần sau) KHÔNG dùng に.',
    '毎朝、六時半に起きます。', 'まいあさ、ろくじはんにおきます。', 'Mỗi sáng tôi thức dậy lúc 6 giờ rưỡi.', 'I wake up at 6:30 every morning.'
  ],
  [
    '〜から〜まで', 'からまで', 'kara made',
    'Từ ~ đến ~ (thời gian / không gian)', 'From ~ to / until ~',
    ['Danh từ 1 (Thời gian/Địa điểm) + から + Danh từ 2 + まで'],
    'Biểu thị điểm bắt đầu (から) và điểm kết thúc (まで) của thời gian hoặc khoảng cách địa lý.',
    'Có thể dùng riêng lẻ từng từ (ví dụ: 九時から始まります = Bắt đầu từ 9 giờ).',
    '銀行は九時から三時までです。', 'ぎんこうはくじからさんじまでです。', 'Ngân hàng làm việc từ 9 giờ đến 3 giờ.', 'The bank is open from 9:00 to 3:00.'
  ],
  [
    '場所 + へ / に + 行きます・来ます・帰ります', 'へいきます', 'e ikimasu',
    'Đi / Đến / Về (một địa điểm)', 'Go / Come / Return to (a place)',
    ['Danh từ chỉ địa điểm + へ (hoặc に) + 行きます / 来ます / 帰ります'],
    'Trợ từ へ (đọc là e) nhấn mạnh phương hướng di chuyển, còn に nhấn mạnh đích đến.',
    'Khi viết là へ nhưng phát âm luôn là "e".',
    '来月、京都へ行きます。', 'らいげつ、きょうとへいきます。', 'Tháng sau tôi sẽ đi Kyoto.', 'I will go to Kyoto next month.'
  ],
  [
    '交通手段 + で', 'で', 'de',
    'Bằng (phương tiện giao thông / công cụ)', 'By means of / With (transport or tool)',
    ['Danh từ (Phương tiện / Công cụ / Ngôn ngữ) + で + Động từ'],
    'Trợ từ で biểu thị phương tiện đi lại, dụng cụ ăn uống/viết lách, hoặc ngôn ngữ được sử dụng để thực hiện hành động.',
    'Riêng "đi bộ" dùng 歩いて (aruite), không dùng 歩で.',
    '毎日、電車で大学へ行きます。', 'まいにち、でんしゃでだいがくへいきます。', 'Mỗi ngày tôi đến trường đại học bằng tàu điện.', 'I go to university by train every day.'
  ],
  [
    '人 + と + V', 'と', 'to',
    'Cùng với (ai đó)', 'Together with (someone)',
    ['Danh từ chỉ người + と + Động từ'],
    'Trợ từ と chỉ đối tượng cùng thực hiện hành động với chủ ngữ.',
    'Nếu làm một mình thì dùng 一人で (hitori de - một mình), không dùng と.',
    '週末、友達と買い物に行きます。', 'しゅうまつ、ともだちとかいものにいきます。', 'Cuối tuần tôi đi mua sắm cùng bạn bè.', 'I go shopping with my friends on the weekend.'
  ],
  [
    'N + を + V（他動詞）', 'を', 'o',
    'Làm ~ (tân ngữ trực tiếp của ngoại động từ)', 'Direct object marker',
    ['Danh từ + を + Ngoại động từ (食べる, 飲む, 見る, 読む, 買う...)'],
    'Trợ từ を (phát âm là o) đánh dấu đối tượng trực tiếp chịu tác động của ngoại động từ.',
    'Riêng các động từ chỉ sở thích/năng lực (好き, 嫌い, 上手, 分かる) đi với が chứ không đi với を.',
    '朝ご飯にパンと卵を食べます。', 'あさごはんにぱんとたまごをたべます。', 'Tôi ăn bánh mì và trứng vào bữa sáng.', 'I eat bread and eggs for breakfast.'
  ],
  [
    '場所 + で + V（動作の場所）', 'で', 'de',
    'Làm gì ở đâu (địa điểm diễn ra hành động)', 'At / In (place of action)',
    ['Danh từ chỉ địa điểm + で + Động từ hành động'],
    'Trợ từ で đứng sau địa điểm để chỉ nơi một hoạt động cụ thể diễn ra (học ở thư viện, mua ở siêu thị).',
    'Phân biệt với に: に dùng cho sự tồn tại (あります/います), còn で dùng cho hành động.',
    '図書館で日本語を勉強します。', 'としょかんでにほんごをべんきょうします。', 'Tôi học tiếng Nhật ở thư viện.', 'I study Japanese at the library.'
  ],
  [
    '〜ませんか（勧誘）', 'ませんか', 'masen ka',
    'Cùng làm ~ nhé? (Lời mời lịch sự)', 'Won\'t you ~? / Would you like to ~?',
    ['Động từ bỏ ます + ませんか'],
    'Cách rủ hoặc mời ai đó làm gì một cách lịch sự, tôn trọng ý kiến của người nghe.',
    'Lịch sự và tế nhị hơn 〜ましょう vì cho phép người nghe dễ dàng từ chối nếu bận.',
    '一緒にお茶を飲みませんか。', 'いっしょにおちゃをのみませんか。', 'Bạn uống trà cùng tôi nhé?', 'Would you like to have tea together?'
  ],
  [
    '〜ましょう（誘い・提案）', 'ましょう', 'mashou',
    'Chúng mình cùng làm ~ thôi!', 'Let\'s ~!',
    ['Động từ bỏ ます + ましょう'],
    'Dùng khi hô hào cùng làm việc gì đó, hoặc dùng để đáp lại lời mời 〜ませんか (ええ、行きましょう).',
    'Cũng dùng khi người nói chủ động đề nghị giúp người nghe (荷物を持ちましょうか = Để tôi xách đồ giúp nhé?).',
    'ここで少し休みましょう。', 'ここですこしやすみましょう。', 'Chúng mình nghỉ ở đây một chút thôi.', 'Let\'s take a little rest here.'
  ],
  [
    '人 + に + あげます・貸します・教えます', 'にあげます', 'ni agemasu',
    'Tặng / Cho mượn / Dạy cho ai', 'Give / Lend / Teach to someone',
    ['Người nhận + に + Vật + を + あげます / 貸します / 教えます / 送ります'],
    'Trợ từ に đánh dấu người tiếp nhận vật phẩm hoặc thông tin từ hành động của chủ ngữ.',
    'Nếu đối tượng nhận là công ty/trường học (không phải cá nhân) có thể dùng へ hoặc に.',
    '母の日に母に花をあげました。', 'ははのひにははにはなをあげました。', 'Vào Ngày của Mẹ, tôi đã tặng hoa cho mẹ.', 'I gave flowers to my mother on Mother\'s Day.'
  ],
  [
    '人 + に / から + もらいます・借ります・習います', 'にもらいます', 'ni moraimasu',
    'Nhận / Mượn / Học từ ai', 'Receive / Borrow / Learn from someone',
    ['Người cho + に (hoặc から) + Vật + を + もらいます / 借ります / 習います'],
    'Biểu thị nguồn xuất phát của món quà, vật mượn hoặc kiến thức mà chủ ngữ nhận được.',
    'Khi nhận từ một tổ chức (trường học, ngân hàng, công ty) thì dùng から thay vì に.',
    '友達に面白い本を借りました。', 'ともだちにおもしろいほんをかりました。', 'Tôi đã mượn một quyển sách thú vị từ người bạn.', 'I borrowed an interesting book from a friend.'
  ],
  [
    'もう + V-ました / まだです', 'もうました', 'mou mashita',
    'Đã làm ~ rồi / Vẫn chưa', 'Already did ~ / Not yet',
    ['もう + V-ました (Đã ~ rồi)', 'いいえ、まだです / まだ V-ていません (Vẫn chưa)'],
    'もう đi với động từ quá khứ để chỉ hành động đã hoàn tất. Khi trả lời "chưa", dùng まだです hoặc まだ V-ていません.',
    'Không trả lời いいえ、V-ませんでした cho câu hỏi もう V-ましたか.',
    'もう昼ご飯を食べましたか。', 'もうひるごはんをたべましたか。', 'Bạn đã ăn trưa chưa?', 'Have you eaten lunch already?'
  ],
  [
    'い形容詞・な形容詞（現在・過去・否定）', 'けいようし', 'keiyoushi',
    'Tính từ đuôi い và Tính từ đuôi な', 'i-Adjectives and na-Adjectives conjugation',
    ['Tính từ い: 〜い → 〜くない (Phủ định) → 〜かったです (Quá khứ)', 'Tính từ な: 〜です → 〜じゃありません → 〜でした'],
    'Tiếng Nhật có hai nhóm tính từ: Tính từ い biến đổi trực tiếp ở chữ い cuối; Tính từ な chia giống hệt danh từ. Khi đứng trước danh từ, tính từ な giữ nguyên な (静かな町).',
    'Ngoại lệ: いい (tốt) khi chia sang các thể khác phải đổi thành よい (よくない, よかったです). きれい và 有名 (ゆうめい) tuy tận cùng là い nhưng là tính từ な.',
    '昨日の試験はあまり難しくなかったです。', 'きのうのしけんはあまりむずかしくなかったです。', 'Kỳ thi hôm qua đã không khó lắm.', 'Yesterday\'s exam was not very difficult.'
  ],
  [
    'N + が + 好きです・嫌いです・上手です・下手です', 'がすきです', 'ga suki desu',
    'Thích / Ghét / Giỏi / Kém cái gì', 'Like / Dislike / Be good at / Be poor at',
    ['Danh từ + が + 好き / 嫌い / 上手 / 下手 + です'],
    'Các tính từ chỉ sở thích và năng lực sử dụng trợ từ が để đánh dấu đối tượng.',
    'Không dùng 上手です để tự khen bản thân (khi nói về mình nên dùng 得意です hoặc 好きです).',
    '私は日本の音楽が好きです。', 'わたしはにほんのおんがくがすきです。', 'Tôi thích âm nhạc Nhật Bản.', 'I like Japanese music.'
  ],
  [
    'N + が + 分かります / あります', 'がわかります', 'ga wakarimasu',
    'Hiểu / Có (sở hữu)', 'Understand / Have (possess)',
    ['Danh từ + が + 分かります / あります'],
    'Động từ 分かります (hiểu/biết) và あります (có tiền bạc, thời gian, đồ vật) luôn đi với trợ từ が.',
    'Có thể thêm trạng từ chỉ mức độ như よく (rõ), だいたい (đại khái), 少し (một chút), ぜんぜん〜ません (hoàn toàn không).',
    'ひらがなとカタカナが分かります。', 'ひらがなとかたかながわかります。', 'Tôi biết chữ Hiragana và Katakana.', 'I understand Hiragana and Katakana.'
  ],
  [
    '〜から（理由）', 'から', 'kara',
    'Vì ~ nên ~ (Nguyên nhân - Kết quả)', 'Because ~ / Since ~',
    ['Mệnh đề nguyên nhân (Thể lịch sự / Thể thông thường) + から、Mệnh đề kết quả'],
    'Liên từ から đặt cuối mệnh đề thứ nhất để nêu lý do hoặc nguyên nhân dẫn đến hành động ở mệnh đề thứ hai.',
    'Có thể đặt だから ở đầu câu tiếp theo ("Chính vì thế...").',
    '時間がありませんから、タクシーで行きます。', 'じかんがありませんから、たくしーでいきます。', 'Vì không có thời gian nên tôi sẽ đi bằng taxi.', 'Because I don\'t have time, I will go by taxi.'
  ],
  [
    '場所 + に + N + が + あります・います', 'にありますいます', 'ni arimasu imasu',
    'Ở đâu có cái gì / ai (Tồn tại)', 'There is / are ~ in (a place)',
    ['Địa điểm + に + Đồ vật/Cây cối + が + あります', 'Địa điểm + に + Người/Động vật + が + います'],
    'Biểu thị sự tồn tại: あります dùng cho vật vô tri và thực vật (không tự di chuyển); います dùng cho người và động vật sống.',
    'Khi muốn nhấn mạnh chủ ngữ "A đang ở địa điểm B", dùng cấu trúc: A は B に あります/います.',
    '机の上にパソコンと辞書があります。', 'つくえのうえにぱそこんとじしょがあります。', 'Trên bàn có máy tính và từ điển.', 'There is a computer and a dictionary on the desk.'
  ],
  [
    'N1 や N2（など）', 'やなど', 'ya nado',
    'Chẳng hạn như N1, N2... (Liệt kê không đầy đủ)', 'N1, N2, and so on (Non-exhaustive listing)',
    ['Danh từ 1 + や + Danh từ 2 + （など）'],
    'Khác với と (liệt kê toàn bộ), や dùng để nêu ra một vài ví dụ tiêu biểu trong một nhóm nhiều vật, thường đi kèm など ở cuối.',
    'Chỉ nối danh từ với danh từ.',
    '箱の中に手紙や写真などがあります。', 'はこのなかにてがみやしゃしんなどがあります。', 'Trong hộp có những thứ như thư từ, ảnh chụp...', 'There are things like letters and photos in the box.'
  ],
  [
    '助数詞（〜つ・〜人・〜枚・〜本・〜台）', 'じょすうし', 'josuushi',
    'Lượng từ đếm đồ vật và con người', 'Counters for objects and people',
    ['Danh từ + を/が + Số đếm + Lượng từ + Động từ'],
    'Tiếng Nhật dùng lượng từ tùy theo hình dáng vật: 〜つ (đồ vật chung từ 1–10), 〜人 (người), 〜枚 (vật mỏng: giấy, áo, đĩa), 〜本 (vật thon dài: bút, ô, chai), 〜台 (máy móc, xe cộ).',
    'Lượng từ thường đặt SAU trợ từ を/が và ngay trước động từ (りんごを三つ買いました). Lưu ý bất quy tắc: 一人 (ひとり), 二人 (ふたり).',
    'りんごを三つと切手を五枚買いました。', 'りんごをみっつときってをごまいかいました。', 'Tôi đã mua 3 quả táo và 5 con tem.', 'I bought three apples and five stamps.'
  ],
  [
    '期間 + に + 回数 + V', 'きかんにかいすう', 'kikan ni kaisu',
    'Bao nhiêu lần trong một khoảng thời gian (Tần suất)', 'Frequency per time period',
    ['Khoảng thời gian (一週間, 一ヶ月, 一年) + に + Số lần (〜回 / 〜度) + Động từ'],
    'Biểu thị tần suất thực hiện hành động trong một chu kỳ thời gian nhất định.',
    'Thêm くらい / ごろ sau số lần để chỉ mức xấp xỉ.',
    '一週間に二回、日本語を習っています。', 'いっしゅうかんににかい、にほんごをならっています。', 'Tôi học tiếng Nhật 2 lần một tuần.', 'I take Japanese lessons twice a week.'
  ],
  [
    '場所 + へ + V（ますstem）+ に + 行きます・来ます', 'にいきます', 'ni ikimasu',
    'Đi / Đến để làm gì (Mục đích của sự di chuyển)', 'Go / Come in order to do ~',
    ['Địa điểm + へ + Động từ bỏ ます (hoặc Danh từ V-suru) + に + 行きます / 来ます / 帰ります'],
    'Trợ từ に đặt sau gốc ます của động từ hoặc danh từ chỉ hoạt động (買い物, 散歩, 勉強) để nêu mục đích của việc đi/đến.',
    'Nếu là danh từ thuần túy (như 買い物, 観光) thì gắn trực tiếp với に.',
    '週末、友達と映画を見に行きます。', 'しゅうまつ、ともだちとえいがをみにいきます。', 'Cuối tuần tôi đi xem phim cùng bạn.', 'I am going to see a movie with my friend this weekend.'
  ],
  [
    'N1 は N2 より + Adj です（比較）', 'より', 'yori',
    'N1 hơn N2 (So sánh hơn)', 'N1 is more [Adj] than N2',
    ['N1 + は + N2 + より + Tính từ + です'],
    'Dùng trợ từ より sau đối tượng làm mốc để so sánh tính chất của N1 vượt trội hơn N2.',
    'Có thể thêm ずっと trước tính từ để nhấn mạnh "hơn hẳn".',
    '飛行機は新幹線より速いです。', 'ひこうきはしんかんせんよりはやいです。', 'Máy bay thì nhanh hơn tàu Shinkansen.', 'Airplanes are faster than bullet trains.'
  ],
  [
    'N1 と N2 と どちらが + Adj ですか', 'とどちらが', 'to dochira ga',
    'Giữa N1 và N2 thì cái nào hơn? (So sánh lựa chọn)', 'Between N1 and N2, which is more [Adj]?',
    ['N1 + と + N2 + と + どちらが + Tính từ + ですか', 'Trả lời: N1 / N2 + のほうが + Tính từ + です'],
    'Dùng どちら (hoặc どっち trong văn nói) để hỏi lựa chọn giữa 2 đối tượng, và trả lời bằng 〜のほうが.',
    'Nếu cả hai tương đương nhau thì trả lời: どちらも〜です.',
    'コーヒーと紅茶とどちらが好きですか。', 'こーひーとこうちゃとどちらがすきですか。', 'Giữa cà phê và hồng trà thì bạn thích loại nào hơn?', 'Which do you prefer, coffee or black tea?'
  ],
  [
    'N（の中）で〜が一番 + Adj です（最上級）', 'でいちばん', 'de ichiban',
    'Trong nhóm N thì ~ là nhất (So sánh nhất)', 'Among N, ~ is the most [Adj]',
    ['Danh từ (Phạm vi/Nhóm) + （の中）で + Từ nghi vấn / Chủ thể + が + 一番 + Tính từ + です'],
    'Dùng để hỏi hoặc khẳng định đối tượng nổi bật nhất trong một tập hợp từ 3 đối tượng trở lên.',
    'Chú ý chọn từ nghi vấn phù hợp với phạm vi: 季節 (mùa) → いつ, スポーツ → 何, 人 → だれ, 場所 → どこ.',
    '日本料理の中で寿司が一番好きです。', 'にほんりょうりのなかですしがいちばんすきです。', 'Trong các món ăn Nhật Bản, tôi thích sushi nhất.', 'Among Japanese dishes, I like sushi the best.'
  ],
  [
    'N + が + 欲しいです', 'がほしいです', 'ga hoshii desu',
    'Muốn có (một đồ vật / đối tượng)', 'Want (an object / thing)',
    ['Danh từ + が + 欲しいです'],
    '欲しい là một tính từ đuôi い biểu thị mong muốn sở hữu một vật gì đó của bản thân người nói.',
    'Phủ định là 欲しくないです. Không dùng 欲しいです để nói trực tiếp về mong muốn của ngôi thứ ba.',
    '新しいパソコンが欲しいです。', 'あたらしいぱそこんがほしいです。', 'Tôi muốn có một chiếc máy tính mới.', 'I want a new computer.'
  ],
  [
    'V（ますstem）+ たいです', 'たいです', 'tai desu',
    'Muốn làm gì', 'Want to do ~',
    ['Động từ bỏ ます + たいです (Phủ định: 〜たくないです)'],
    'Biểu thị nguyện vọng thực hiện hành động của người nói. 〜たい biến đổi giống hệt một tính từ đuôi い.',
    'Tân ngữ của ngoại động từ có thể dùng cả を hoặc が (水を飲みたい / 水が飲みたい).',
    '将来、日本で働きたいです。', 'しょうらい、にほんで働きたいです。', 'Trong tương lai tôi muốn làm việc tại Nhật Bản.', 'I want to work in Japan in the future.'
  ],
  [
    'V-て形（動詞のて形）', 'てけい', 'te-kei',
    'Cách chia động từ thể て và nối câu', 'Verb te-form and connecting actions',
    ['Nhóm 1: う・つ・る → って; む・ぶ・ぬ → んで; く → いて; ぐ → いで; す → して', 'Nhóm 2: Bỏ ます + て', 'Nhóm 3: します → して, 来ます → 来て（きて）'],
    'Thể て là nền tảng quan trọng nhất của sơ cấp, dùng để nối chuỗi hành động theo trình tự thời gian ("làm A rồi làm B") và kết hợp với hàng loạt cấu trúc ngữ pháp.',
    'Ngoại lệ duy nhất ở nhóm 1: 行きます → 行って (itte).',
    '朝起きて、顔を洗って、朝ご飯を食べます。', 'あさおきて、かおをあらって、あさごはんをたべます。', 'Sáng tôi thức dậy, rửa mặt rồi ăn sáng.', 'In the morning I wake up, wash my face, and eat breakfast.'
  ],
  [
    'V-て + ください', 'てください', 'te kudasai',
    'Xin hãy làm ~ (Yêu cầu / Đề nghị lịch sự)', 'Please do ~',
    ['Động từ thể て + ください'],
    'Dùng khi nhờ vả, hướng dẫn hoặc mời mọc người nghe thực hiện một hành động.',
    'Muốn lịch sự hơn nữa trong môi trường công sở có thể dùng V-ていただけますか hoặc V-てくださいませんか.',
    'ここに名前と電話番号を書いてください。', 'ここになまえとでんわばんごうをかいてください。', 'Xin hãy viết tên và số điện thoại vào đây.', 'Please write your name and phone number here.'
  ],
  [
    'V-て + います（現在進行・状態・習慣）', 'ています', 'te imasu',
    'Đang làm ~ / Trạng thái tiếp diễn / Nghề nghiệp', 'Be doing ~ (Ongoing action or resultant state)',
    ['Động từ thể て + います'],
    'Có 3 cách dùng chính: (1) Hành động đang diễn ra ngay lúc nói; (2) Trạng thái kết quả còn lưu lại (結婚しています, 住んでいます, 知っています); (3) Thói quen hoặc nghề nghiệp lặp đi lặp lại.',
    'Phủ định của 知っています (biết) là 知りません (không biết), KHÔNG dùng 知っていません.',
    '今、雨が降っています。', 'いま、あめがふっています。', 'Bây giờ trời đang mưa.', 'It is raining right now.'
  ],
  [
    'V-て + もいいですか', 'てもいいですか', 'te mo ii desu ka',
    'Làm ~ có được không? (Xin phép)', 'May I do ~? / Is it okay if I ~?',
    ['Động từ thể て / Tính từ / Danh từ + もいいですか'],
    'Dùng để xin phép hoặc xác nhận xem một hành động có được chấp thuận hay không.',
    'Khi từ chối lịch sự, thường trả lời: すみません、ちょっと… thay vì nói thẳng いけません.',
    'この部屋で写真を撮ってもいいですか。', 'このへやでしゃしんをとってもいいですか。', 'Tôi chụp ảnh trong căn phòng này có được không?', 'May I take photos in this room?'
  ],
  [
    'V-て + はいけません', 'てはいけません', 'te wa ikemasen',
    'Không được phép làm ~ (Cấm đoán)', 'Must not do ~ (Prohibition)',
    ['Động từ thể て + はいけません'],
    'Biểu thị quy định, luật lệ hoặc sự ngăn cấm thực hiện một hành động.',
    'Không dùng cấu trúc này trực tiếp với cấp trên hoặc người lớn tuổi.',
    '図書館の中で食べ物を食べてはいけません。', 'としょかんのなかでたべものをたべてはいけません。', 'Không được ăn đồ ăn ở trong thư viện.', 'You must not eat food inside the library.'
  ],
  [
    'V-て + から', 'てから', 'te kara',
    'Sau khi làm ~ thì làm ~', 'After doing A, do B',
    ['Động từ 1 thể て + から、Động từ 2'],
    'Nhấn mạnh trình tự thời gian rõ rệt: hoàn thành xong hành động 1 rồi mới bắt đầu thực hiện hành động 2.',
    'Chủ ngữ của mệnh đề trước から nếu là chủ ngữ phụ thì đi với が.',
    '手を洗ってから、ご飯を食べます。', 'てをあらってから、ごはんをたべます。', 'Sau khi rửa tay xong thì tôi ăn cơm.', 'After washing my hands, I eat my meal.'
  ],
  [
    'Adj / N + で・くて（形容詞の接続）', 'くてで', 'kute de',
    'Vừa ~ vừa ~ (Nối các tính từ / danh từ)', 'Connecting adjectives and nouns',
    ['Tính từ い: Đổi い → くて', 'Tính từ な / Danh từ: Thêm で'],
    'Dùng để liệt kê hai hay nhiều đặc điểm, tính chất của cùng một chủ thể trong một câu.',
    'Không nối một tính từ tích cực với một tính từ tiêu cực bằng くて/で (trường hợp trái ngược phải dùng が hoặc けど). Riêng いい → よくて.',
    'この店は安くて、料理がおいしいです。', 'このみせはやすくて、りょうりがおいしいです。', 'Quán này vừa rẻ, đồ ăn lại vừa ngon.', 'This restaurant is cheap and the food is delicious.'
  ],
  [
    'N1 は N2 が + Adj です', 'はが', 'wa ga',
    'N1 thì có bộ phận/thuộc tính N2 như thế nào', 'Topic-attribute structure (N1 has [Adj] N2)',
    ['Danh từ 1 (Chủ đề lớn) + は + Danh từ 2 (Bộ phận/Đặc trưng) + が + Tính từ + です'],
    'Dùng để mô tả một đặc điểm hoặc bộ phận cụ thể (N2) thuộc về chủ đề chính (N1).',
    'Rất thông dụng khi tả ngoại hình (背が高い, 髪が長い, 目が大きい) hoặc đặc sản địa phương.',
    'ベトナムは果物がおいしいです。', 'べとなむはくだものがおいしいです。', 'Ở Việt Nam thì trái cây rất ngon.', 'Vietnam has delicious fruit.'
  ],
  [
    'V-ないで + ください', 'ないでください', 'naide kudasai',
    'Xin đừng làm ~ (Yêu cầu không làm gì)', 'Please do not ~',
    ['Động từ thể ない + でください'],
    'Dùng để yêu cầu, khuyên nhủ hoặc nhắc nhở người nghe không thực hiện một hành động nào đó.',
    'Cách chia thể ない: Nhóm 1 đổi cột い sang cột あ + ない (riêng あります → ない, 買います → 買わない); Nhóm 2 bỏ ます + ない; Nhóm 3: します → しない, 来ます → 来ない（こない）.',
    '大事な約束ですから、忘れないでください。', 'だいじなやくそくですから、わすれないでください。', 'Vì là cuộc hẹn quan trọng nên xin đừng quên nhé.', 'Because it is an important appointment, please do not forget.'
  ],
  [
    'V-なければ + なりません', 'なければなりません', 'nakereba narimasen',
    'Phải làm ~ (Nghĩa vụ / Bắt buộc)', 'Must do ~ / Have to do ~',
    ['Động từ thể ない (bỏ い) + ければなりません (hoặc 〜ないといけません)'],
    'Diễn tả trách nhiệm, bổn phận hoặc việc bắt buộc phải thực hiện.',
    'Trong hội thoại thân mật thường rút gọn thành 〜なきゃ hoặc 〜なくちゃ.',
    '毎日、薬を飲まなければなりません。', 'まいにち、くすりをのまなければなりません。', 'Mỗi ngày tôi đều phải uống thuốc.', 'I have to take medicine every day.'
  ],
  [
    'V-なくても + いいです', 'なくてもいいです', 'nakutemo ii desu',
    'Không cần làm ~ cũng được', 'Do not have to ~ / Need not ~',
    ['Động từ thể ない (bỏ い) + くてもいいです'],
    'Biểu thị sự không bắt buộc, cho phép người nghe không cần thực hiện hành động đó.',
    'Là mẫu câu trả lời phủ định nhẹ nhàng cho câu hỏi V-なければなりませんか.',
    '明日は休みですから、早く起きなくてもいいです。', 'あしたはやすみですから、はやくおきなくてもいいです。', 'Vì ngày mai là ngày nghỉ nên không cần dậy sớm cũng được.', 'Since tomorrow is a holiday, you don\'t have to wake up early.'
  ],
  [
    'V（辞書形）/ N + が + できます', 'ができます', 'ga dekimasu',
    'Có thể làm ~ (Khả năng / Năng lực)', 'Can do ~ / Be able to ~',
    ['Động từ thể từ điển (V-る) + ことができます', 'Danh từ chỉ hành động (運転, 料理, 日本語) + ができます'],
    'Diễn tả năng lực cá nhân hoặc điều kiện cho phép thực hiện một việc tại một nơi nào đó.',
    'Khi dùng động từ nguyên dạng phải thêm ことが ở giữa V-る và できます.',
    '私は漢字を百字ぐらい書くことができます。', 'わたしはかんじをひゃくじぐらいかくことができます。', 'Tôi có thể viết được khoảng 100 chữ Kanji.', 'I can write about 100 Kanji characters.'
  ],
  [
    '趣味は + N / V-ること + です', 'しゅみはことです', 'shumi wa koto desu',
    'Sở thích của tôi là ~', 'My hobby is (doing) ~',
    ['趣味は + Danh từ / [Động từ thể từ điển + こと] + です'],
    'Thêm こと vào sau động từ thể từ điển để danh từ hóa cụm động từ, giúp nó đứng được trước です.',
    'Cấu trúc V-る + こと cũng dùng trong nhiều mẫu câu khác như 好きなことは〜です.',
    '私の趣味は音楽を聞くことです。', 'わたしのしゅみはおんがくをきくことです。', 'Sở thích của tôi là nghe nhạc.', 'My hobby is listening to music.'
  ],
  [
    'V-る / N の / 期間 + 前に', 'まえに', 'mae ni',
    'Trước khi làm ~ / Trước ~', 'Before doing ~ / Ago',
    ['Động từ thể từ điển (V-る) + 前に', 'Danh từ + の + 前に', 'Khoảng thời gian + 前に'],
    'Chỉ một hành động xảy ra trước một hành động khác hoặc trước một mốc sự kiện.',
    'Động từ đứng trước 前に LUÔN ở thể từ điển (V-る), kể cả khi mệnh đề chính ở quá khứ.',
    '寝る前に、少し本を読みます。', 'ねるまえに、すこしほんをよみます。', 'Trước khi đi ngủ, tôi đọc sách một chút.', 'Before going to bed, I read a book for a little while.'
  ],
  [
    'V-た + ことがあります', 'たことがあります', 'ta koto ga arimasu',
    'Đã từng làm ~ (Kinh nghiệm trong quá khứ)', 'Have done ~ before (Past experience)',
    ['Động từ thể た + ことがあります (Phủ định: V-たことがありません)'],
    'Dùng để nói về trải nghiệm đã từng có ít nhất một lần trong đời tính đến thời điểm hiện tại.',
    'Không dùng với các trạng từ chỉ thời điểm quá khứ gần cụ thể như 昨日 (hôm qua) hay 先週 (tuần trước).',
    '私は日本へ行ったことがあります。', 'わたしはにほんへいったことがあります。', 'Tôi đã từng đi Nhật Bản.', 'I have been to Japan before.'
  ],
  [
    'V-たり、V-たり + します', 'たりたりします', 'tari tari shimasu',
    'Lúc thì làm A, lúc thì làm B (Liệt kê hành động tiêu biểu)', 'Do things like A and B',
    ['Động từ 1 thể た + り、Động từ 2 thể た + り + します / しました'],
    'Liệt kê 2–3 hành động đại diện trong số nhiều việc làm vào một khoảng thời gian (như ngày nghỉ, cuối tuần) mà không ràng buộc thứ tự trước sau.',
    'Thời của cả câu (hiện tại hay quá khứ) được quyết định ở chữ します / しました cuối cùng.',
    '日曜日は部屋を掃除したり、映画を見たりします。', 'にちようびはへやをそうじしたり、えいがをみたりします。', 'Chủ nhật tôi thường làm những việc như dọn phòng, xem phim...', 'On Sundays I do things like cleaning my room and watching movies.'
  ],
  [
    'Adj / N + になります（変化）', 'になります', 'ni narimasu',
    'Trở nên ~ / Bước sang trạng thái mới', 'Become ~ / Get ~',
    ['Tính từ い (bỏ い) + く + なります', 'Tính từ な / Danh từ + に + なります'],
    'Diễn tả sự thay đổi tự nhiên của trạng thái, thời tiết, tuổi tác, nghề nghiệp theo thời gian.',
    'Chú ý: いい → よくなります.',
    '春になって、暖かくなりました。', 'はるになって、あたたかくなりました。', 'Mùa xuân đến, trời đã trở nên ấm áp hơn.', 'Spring has come and it has gotten warmer.'
  ],
  [
    '〜と思います（意見・推量）', 'とおもいます', 'to omoimasu',
    'Tôi nghĩ rằng ~', 'I think that ~',
    ['Mệnh đề chia ở Thể thông thường (Plain form / 普通形) + と思います'],
    'Dùng để bày tỏ ý kiến cá nhân, nhận định hoặc sự phỏng đoán của người nói.',
    'Nếu danh từ hoặc tính từ な đứng ngay trước と思います thì phải đổi です thành だ (雨だと思います).',
    '明日は雨が降ると思います。', 'あしたはあめがふるとおもいます。', 'Tôi nghĩ rằng ngày mai trời sẽ mưa.', 'I think it will rain tomorrow.'
  ],
  [
    '〜と言いました（引用）', 'といいました', 'to iimashita',
    'Đã nói rằng ~ (Trích dẫn trực tiếp & gián tiếp)', 'Said that ~ (Direct & indirect quotation)',
    ['「Câu trực tiếp」+ と言いました', 'Mệnh đề Thể thông thường + と言いました'],
    'Dùng trợ từ と để trích dẫn lại lời nói của bản thân hoặc người khác.',
    'Khi trích dẫn một người đang nói/nhắn nhủ thường xuyên thì dùng 〜と言っています.',
    '先生は来週試験があると言いました。', 'せんせいはらいしゅうしけんがあるといいました。', 'Thầy giáo đã nói rằng tuần sau có bài kiểm tra.', 'The teacher said that there will be an exam next week.'
  ],
  [
    '〜でしょう？（確認）', 'でしょう', 'deshou',
    'Đúng không? / Phải không nhỉ? (Xác nhận thông tin)', 'Right? / Isn\'t it? (Seeking confirmation)',
    ['Mệnh đề Thể thông thường (Danh từ / Tính từ な bỏ だ) + でしょう？ (Lên giọng)'],
    'Dùng khi người nói muốn xác nhận lại một điều mà mình tin là người nghe cũng biết hoặc đồng tình.',
    'Khi xuống giọng ở cuối câu, 〜でしょう mang nghĩa suy đoán "Chắc là ~" (N4).',
    '明日は休みでしょう？', 'あしたはやすみでしょう？', 'Ngày mai là ngày nghỉ đúng không?', 'Tomorrow is a day off, right?'
  ],
  [
    '名詞修飾（連体修飾節）', 'めいししゅうしょく', 'meishi shuushoku',
    'Mệnh đề định ngữ bổ nghĩa cho danh từ', 'Relative clauses modifying nouns',
    ['Mệnh đề Thể thông thường (Động từ / Tính từ) + Danh từ'],
    'Trong tiếng Nhật, mệnh đề phụ bổ nghĩa cho danh từ luôn đứng TRƯỚC danh từ đó. Chủ ngữ nhỏ bên trong mệnh đề định ngữ dùng trợ từ が (không dùng は).',
    'Tính từ な vẫn giữ な trước danh từ, danh từ thì dùng の.',
    'これは母が作ったケーキです。', 'これはははがつくったけーきです。', 'Đây là chiếc bánh ngọt mà mẹ tôi đã làm.', 'This is the cake that my mother made.'
  ],
  [
    'V-る / V-た / Adj / N + とき（時）', 'とき', 'toki',
    'Khi ~ / Lúc ~', 'When ~ / At the time of ~',
    ['Động từ (V-る / V-ない / V-た) + とき', 'Tính từ い + とき / Tính từ な + なとき', 'Danh từ + の + とき'],
    'Nối hai mệnh đề để chỉ thời điểm hành động chính diễn ra. V-る とき chỉ trước khi hành động hoàn tất; V-た とき chỉ sau khi hành động đã hoàn tất.',
    'Ví dụ: 国へ帰るとき (trước khi/trên đường về nước) khác với 国へ帰ったとき (khi đã về tới nước rồi).',
    '道が分からないとき、地図を見ます。', 'みちがわからないとき、ちずをみます。', 'Khi không biết đường, tôi xem bản đồ.', 'When I don\'t know the way, I look at a map.'
  ],
  [
    'V-た / N の + あとで（後で）', 'あとで', 'ato de',
    'Sau khi ~', 'After doing ~ / Afterwards',
    ['Động từ thể た + あとで', 'Danh từ + の + あとで'],
    'Diễn tả một hành động diễn ra sau một sự kiện hoặc hành động khác.',
    'So với V-てから, 〜あとで nhấn mạnh mốc thời gian tổng quát hơn và đi được với cả Danh từ + の.',
    '仕事が終わったあとで、飲みに行きませんか。', 'しごとがおわったあとで、のみにいきませんか。', 'Sau khi xong việc, chúng ta đi uống nước nhé?', 'Shall we go for a drink after work finishes?'
  ],
  [
    'V-る / N + と（条件・恒常的結果）', 'と', 'to',
    'Hễ ~ thì ~ (Kết quả tất yếu / Chỉ đường)', 'Whenever ~ / If ~ (Natural consequence)',
    ['Động từ thể từ điển (V-る) / V-ない + と、Mệnh đề kết quả tất yếu'],
    'Diễn tả một quy luật tự nhiên, thao tác máy móc hoặc chỉ đường ("Hễ làm A là tự khắc xảy ra B").',
    'Mệnh đề phía sau と KHÔNG được là câu mệnh lệnh, rủ rê, xin phép hay ý chí chủ quan (như 〜たい, 〜ましょう, 〜てください).',
    'このボタンを押すと、切符が出ます。', 'このぼたんをおすと、きっぷがでます。', 'Hễ bấm nút này thì vé sẽ ra.', 'When you press this button, a ticket comes out.'
  ],
  [
    'N + だけ / しか〜ません', 'だけしか', 'dake shika',
    'Chỉ ~ (Giới hạn số lượng hoặc phạm vi)', 'Only / Nothing but ~',
    ['Danh từ / Số lượng + だけ + Khẳng định / Phủ định', 'Danh từ / Số lượng + しか + Phủ định (〜ません)'],
    'Cả hai đều dịch là "chỉ", nhưng だけ mang sắc thái trung lập (đủ rồi) và đi với câu khẳng định, còn しか nhấn mạnh sự ít ỏi ("chỉ có mỗi...") và BẮT BUỘC đi với động từ phủ định.',
    'しか thay thế cho जो trợ từ が và を, nhưng đứng sau các trợ từ khác (にしか, でしか).',
    'ローマ字しか書けません。', 'ろーまじしかかけません。', 'Tôi chỉ viết được mỗi chữ Romaji thôi.', 'I can only write Romaji.'
  ],
  [
    'V（ますstem）+ ながら', 'ながら', 'nagara',
    'Vừa làm A vừa làm B (Hai hành động song song)', 'While doing A, do B simultaneously',
    ['Động từ 1 (bỏ ます) + ながら、Động từ 2 (Hành động chính)'],
    'Diễn tả cùng một chủ ngữ thực hiện đồng thời hai hành động, trong đó hành động đứng sau ながら là hành động chính.',
    'Hai hành động phải có cùng một chủ ngữ.',
    '音楽を聞きながら、宿題をします。', 'おんがくをききながら、しゅくだいをします。', 'Tôi vừa nghe nhạc vừa làm bài tập về nhà.', 'I do my homework while listening to music.'
  ]
];

const RAW_GRAMMAR_N4 = [
  [
    '〜ようになる', 'ようになる', 'you ni naru',
    'Trở nên có thể làm gì / Bắt đầu hình thành thói quen mới', 'To reach the point that / To come to be that / To turn into',
    [
      'Động từ thể khả năng (Potential Verb) + ようになる',
      'Động từ thể từ điển (V-る) / thể ない (V-ない) + ようになる'
    ],
    'Diễn tả sự thay đổi trạng thái từ không thể sang có thể làm được một việc gì đó, hoặc một thói quen mới được hình thành theo thời gian.',
    'Phân biệt với 〜ようにする (cố gắng duy trì/tạo thói quen chủ động).',
    '日本語が話せるようになりました。', 'にほんごがはなせるようになりました。', 'Tôi đã có thể nói được tiếng Nhật rồi.', 'I have become able to speak Japanese.'
  ],
  [
    '〜ようにする', 'ようにする', 'you ni suru',
    'Cố gắng làm ~ / Tập thói quen làm ~', 'Make sure to ~ / Try to ~ / Make a habit of ~',
    ['Động từ thể từ điển (V-る) / thể ない (V-ない) + ようにする'],
    'Diễn tả sự nỗ lực, chủ động duy trì một thói quen hoặc lưu tâm thực hiện một hành động đều đặn.',
    'Khi dùng ở dạng tiếp diễn 〜ようにしています, nó chỉ một thói quen đang được duy trì hằng ngày.',
    '毎日、野菜をたくさん食べるようにしています。', 'まいにち、やさいをたくさんたべるようにしています。', 'Tôi luôn cố gắng ăn nhiều rau mỗi ngày.', 'I make a point of eating lots of vegetables every day.'
  ],
  [
    '〜つもりだ', 'つもりだ', 'tsumori da',
    'Dự định làm ~ / Có ý định làm ~', 'Plan to ~ / Intend to ~',
    ['Động từ thể từ điển (V-る) + つもりです', 'Động từ thể ない (V-ない) + つもりです'],
    'Biểu thị ý định hoặc kế hoạch khá chắc chắn của người nói đối với một việc trong tương lai.',
    'Dạng phủ định V-ないつもりです là "quyết định sẽ không làm". Không dùng trực tiếp cho cấp trên.',
    '来年、日本へ留学するつもりです。', 'らいねん、にほんへりゅうがくするつもりです。', 'Năm sau tôi dự định đi du học Nhật Bản.', 'I intend to study abroad in Japan next year.'
  ],
  [
    '〜予定だ（よていだ）', 'よていだ', 'yotei da',
    'Theo kế hoạch / Lịch trình dự kiến là ~', 'Schedule to ~ / Plan to ~',
    ['Động từ thể từ điển (V-る) + 予定です', 'Danh từ + の + 予定です'],
    'Dùng cho các lịch trình, kế hoạch công tác hoặc sự kiện đã được sắp xếp, lên lịch cụ thể (khách quan hơn つもり).',
    'Đi được với cả Danh từ + の (会議の予定です).',
    '飛行機は十時に到着する予定です。', 'ひこうきはじゅうじにとうちゃくするよていです。', 'Máy bay dự kiến sẽ hạ cánh lúc 10 giờ.', 'The plane is scheduled to arrive at 10 o\'clock.'
  ],
  [
    '可能形（かのうけい・Potential Form）', 'かのうけい', 'kanoukei',
    'Thể khả năng (Có thể làm ~)', 'Potential verb form (Can do ~)',
    ['Nhóm 1: Đổi âm cột う → cột え + る (書く → 書ける, 話す → 話せる)', 'Nhóm 2: Bỏ ます + られる (食べる → 食べられる)', 'Nhóm 3: する → できる, 来る → 来られる（こられる）'],
    'Biểu thị năng lực của chủ ngữ hoặc tính khả thi của hành động trong hoàn cảnh nhất định. Khi chuyển sang thể khả năng, trợ từ を thường đổi thành が.',
    'Các động từ như 見える, 聞こえる, 分かる vốn đã mang nghĩa khả năng nên không chia sang thể khả năng nữa.',
    'ここでは無料のWi-Fiが使えます。', 'ここではむりょうのわいふぁいがつかえます。', 'Ở đây có thể sử dụng Wi-Fi miễn phí.', 'You can use free Wi-Fi here.'
  ],
  [
    '〜し、〜し（理由・並立）', 'しし', 'shi shi',
    'Vừa ~ vừa ~ / Hơn nữa lại ~ (Liệt kê lý do & đặc điểm)', 'Not only ~ but also ~ / Because ~ and ~',
    ['Mệnh đề 1 (Thể thông thường) + し、Mệnh đề 2 (Thể thông thường) + し、Kết luận'],
    'Dùng để liệt kê nhiều đặc điểm hoặc nhiều nguyên nhân củng cố cho một kết luận ở cuối câu.',
    'Danh từ và tính từ な phải có だ trước し (静かだし, 日曜日だし).',
    'このアパートは駅に近いし、家賃も安いし、とても便利です。', 'このあぱーとはえきにちかいし、やちんもやすいし、とてもべんりです。', 'Căn hộ này vừa gần ga, tiền thuê lại rẻ nên rất tiện lợi.', 'This apartment is close to the station, the rent is cheap, and it\'s very convenient.'
  ],
  [
    '〜そうだ（様態・Looks like）', 'そうだようたい', 'sou da (youtai)',
    'Trông có vẻ ~ / Sắp sửa ~ (Phỏng đoán qua quan sát)', 'Look like ~ / Seem ~ / Be about to ~',
    ['Động từ bỏ ます + そうだ', 'Tính từ い (bỏ い) / Tính từ な (bỏ な) + そうだ'],
    'Diễn tả nhận định dựa trên những gì mắt thấy trực tiếp hoặc cảm nhận ngay tại hiện trường.',
    'Ngoại lệ: いい → よさそうだ, ない → なさそうだ. Không dùng với danh từ.',
    '黒い雲がありますから、雨が降りそうです。', 'くろいくもがありますから、あめがふりそうです。', 'Vì có mây đen nên trông có vẻ sắp mưa rồi.', 'There are dark clouds, so it looks like it is about to rain.'
  ],
  [
    '〜そうだ（伝聞・I heard that）', 'そうだでんぶん', 'sou da (denbun)',
    'Nghe nói là ~ (Truyền đạt thông tin nghe được)', 'I heard that ~ / They say that ~',
    ['Mệnh đề chia ở Thể thông thường (Plain form) + そうです'],
    'Dùng để truyền đạt lại thông tin nghe được từ bản tin, báo chí hoặc người khác mà không thêm phán đoán cá nhân.',
    'Khác với そうだ (trông có vẻ): dạng truyền đạt giữ nguyên い của tính từ い và giữ だ sau danh từ/tính từ な (おいしいそうです = nghe nói là ngon).',
    '天気予報によると、明日はとても寒いそうです。', 'てんきよほうによると、あしたはとてもさむいそうです。', 'Theo dự báo thời tiết thì nghe nói ngày mai trời rất lạnh.', 'According to the weather forecast, I heard it will be very cold tomorrow.'
  ],
  [
    '〜ようだ / 〜みたいに（比況・推量）', 'ようだ', 'you da',
    'Hình như là ~ / Giống như là ~', 'It seems that ~ / Just like ~',
    ['Động từ / Tính từ い (Thể thông thường) + ようだ', 'Tính từ な + な + ようだ', 'Danh từ + の + ようだ'],
    'Diễn tả sự suy đoán dựa trên cảm giác, dấu hiệu tổng hợp của người nói, hoặc dùng để so sánh ví von.',
    'Trong văn nói thân mật, 〜みたいだ được dùng thay cho 〜ようだ (N / Na bỏ だ + みたい).',
    '部屋の電気が消えています。誰もいないようです。', 'へやのでんきがきえています。だれもいないようです。', 'Đèn phòng đang tắt. Hình như không có ai ở nhà.', 'The room light is off. It seems nobody is there.'
  ],
  [
    '〜らしい（推量・典型）', 'らしい', 'rashii',
    'Hình như ~ / Nghe đồn là ~ / Đúng chất ~', 'It seems ~ / Apparently ~ / Typical of ~',
    ['Động từ / Tính từ い (Thể thông thường) + らしい', 'Tính từ な / Danh từ (bỏ だ) + らしい'],
    'Diễn tả suy đoán có căn cứ khách quan hoặc thông tin nghe từ bên ngoài. Khi gắn trực tiếp sau danh từ (男らしい, 春らしい) mang nghĩa "đậm chất / đúng kiểu ~".',
    'Không thêm だ trước らしい.',
    'あの新しいレストランはとても人気があるらしいです。', 'あのあたらしいれすとらんはとてもにんきがあるらしいです。', 'Nghe nói nhà hàng mới kia rất được yêu thích.', 'Apparently, that new restaurant is very popular.'
  ],
  [
    'V（ますstem）+ すぎる', 'すぎる', 'sugiru',
    'Quá ~ / Làm gì đó quá mức', 'Too much / Excessively ~',
    ['Động từ (bỏ ます) + すぎる', 'Tính từ い (bỏ い) / Tính từ な (bỏ な) + すぎる'],
    'Biểu thị một hành động hoặc tính chất vượt quá giới hạn bình thường (thường mang hàm ý không tốt).',
    'すぎます là động từ nhóm 2 (chia sang thể て là すぎて, thể ない là すぎない).',
    '昨日、晩ご飯を食べすぎました。', 'きのう、ばんごはんをたべすぎました。', 'Hôm qua tôi đã ăn tối quá nhiều.', 'I ate too much dinner yesterday.'
  ],
  [
    'V（ますstem）+ やすい / にくい', 'やすいにくい', 'yasui nikui',
    'Dễ làm ~ / Khó làm ~', 'Easy to do ~ / Difficult to do ~',
    ['Động từ (bỏ ます) + やすい (Dễ ~)', 'Động từ (bỏ ます) + にくい (Khó ~)'],
    'Mô tả đặc tính của đồ vật hoặc việc gì đó dễ hay khó thực hiện. Sau khi ghép sẽ trở thành một tính từ đuôi い.',
    'Ví dụ: 分かりやすい (dễ hiểu), 読みにくい (khó đọc), 壊れやすい (dễ vỡ).',
    'この辞書は字が大きくて、とても使いやすいです。', 'このじしょはじがおおきくて、とてもつかいやすいです。', 'Quyển từ điển này chữ to nên rất dễ sử dụng.', 'This dictionary has large print and is very easy to use.'
  ],
  [
    '〜方（〜かた・How to do）', 'かた', 'kata',
    'Cách làm ~', 'How to do ~ / Way of doing ~',
    ['Động từ (bỏ ます) + 方（かた）'],
    'Biến động từ thành danh từ chỉ phương pháp, cách thức thực hiện hành động đó.',
    'Với các động từ N + します thì dùng N + のしかた (勉強のしかた, 料理のしかた).',
    'この漢字の読み方を教えてください。', 'このかんじのよみかたをおしえてください。', 'Xin hãy chỉ cho tôi cách đọc chữ Kanji này.', 'Please teach me how to read this Kanji.'
  ],
  [
    'V-て + みる', 'てみる', 'te miru',
    'Thử làm ~ xem sao', 'Try doing ~ (to see what happens)',
    ['Động từ thể て + みる / みます / みました'],
    'Diễn tả việc thực hiện thử một hành động để trải nghiệm hoặc kiểm tra kết quả.',
    'Thường kết hợp với 〜たい (食べてみたい = muốn ăn thử) hoặc 〜ください (着てみてください = xin hãy mặc thử).',
    '日本の着物を一度着てみたいです。', 'にほんのきものをいちどきてみたいです。', 'Tôi muốn mặc thử Kimono của Nhật một lần.', 'I would like to try wearing a Japanese kimono once.'
  ],
  [
    'V-て + しまう', 'てしまう', 'te shimau',
    'Làm xong hết hoàn toàn / Lỡ làm ~ mất rồi', 'Finish completely / Regrettably end up doing ~',
    ['Động từ thể て + しまう / しまいます'],
    'Có hai sắc thái: (1) Hoàn tất trọn vẹn một việc (đọc hết quyển sách); (2) Lỡ xảy ra việc ngoài ý muốn, mang cảm giác tiếc nuối (quên mất, làm hỏng).',
    'Trong văn nói thân mật: 〜てしまう → 〜ちゃう; 〜でしまう → 〜じゃう.',
    '電車の中に傘を忘れてしまいました。', 'でんしゃのなかにかさをわすれてしまいました。', 'Tôi lỡ để quên ô trên tàu điện mất rồi.', 'I accidentally left my umbrella on the train.'
  ],
  [
    'V-て + おく', 'ておく', 'te oku',
    'Làm sẵn ~ trước (Để chuẩn bị cho việc sau)', 'Do ~ in advance / Leave as is',
    ['Động từ thể て + おく / おきます'],
    'Thực hiện một hành động trước nhằm chuẩn bị cho một sự kiện sắp tới, hoặc giữ nguyên trạng thái vì mục đích nào đó.',
    'Trong hội thoại thường rút gọn: 〜ておく → 〜とく; 〜でおく → 〜どく.',
    '旅行の前に、ホテルを予約しておきます。', 'りょこうのまえに、ほてるをよやくしておきます。', 'Trước chuyến du lịch, tôi sẽ đặt sẵn khách sạn.', 'Before the trip, I will book a hotel in advance.'
  ],
  [
    'V-て + ある（結果の状態）', 'てある', 'te aru',
    'Đã được làm sẵn ~ (Trạng thái kết quả có chủ đích)', 'Have been done / Be in a prepared state',
    ['Danh từ + が / は + Ngoại động từ thể て + あります'],
    'Mô tả trạng thái hiện tại là kết quả của một hành động có chủ đích mà ai đó đã thực hiện trước đó.',
    'Phân biệt: 自動詞 + ています (mô tả trạng thái tự nhiên: 窓が開いています) và 他動詞 + てあります (ai đó đã mở sẵn có mục đích: 窓が開けてあります).',
    '机の上にメモが書いてあります。', 'つくえのうえにめもがかいてあります。', 'Trên bàn có tờ ghi chú đã được viết sẵn.', 'A memo is written on the desk.'
  ],
  [
    'V-て + いく / V-て + くる', 'ていくてくる', 'te iku te kuru',
    'Tiếp tục ~ trong tương lai / Đã ~ cho đến nay', 'Go on doing ~ / Come to ~ / Do and return',
    ['Động từ thể て + いく (Hướng ra xa / Tiếp diễn từ nay về sau)', 'Động từ thể て + くる (Hướng lại gần / Từ quá khứ đến hiện tại / Làm gì rồi quay lại)'],
    'Biểu thị phương hướng không gian hoặc dòng chảy thời gian của hành động và sự biến đổi.',
    'Ví dụ: 買ってくる (đi mua rồi quay về), 寒くなってきた (trời đã bắt đầu trở lạnh).',
    'これからも日本語を勉強していきたいです。', 'これからもにほんごをべんきょうしていきたいです。', 'Từ nay về sau tôi cũng muốn tiếp tục học tiếng Nhật.', 'I want to continue studying Japanese from now on as well.'
  ],
  [
    'V-て + あげる / さしあげる / やる', 'てあげる', 'te ageru',
    'Làm ~ cho ai (Người nói làm giúp người khác)', 'Do ~ for someone\'s benefit',
    ['Người nhận + に + Động từ thể て + あげる / さしあげる (kính ngữ) / やる (cho em nhỏ/thú cưng/cây cối)'],
    'Diễn tả hành động mang lại lợi ích cho người khác.',
    'Tránh nói trực tiếp V-てあげます với người trên vì dễ gây cảm giác kể ơn; thay vào đó nên dùng 〜ましょうか.',
    '友達に日本語の本を貸してあげました。', 'ともだちににほんごのほんをかしてあげました。', 'Tôi đã cho bạn mượn quyển sách tiếng Nhật.', 'I lent a Japanese book to my friend.'
  ],
  [
    'V-て + もらう / いただく', 'てもらう', 'te morau',
    'Được ai đó làm ~ cho (Nhận sự giúp đỡ)', 'Have someone do ~ / Receive the favor of ~',
    ['Người làm + に + Động từ thể て + もらいます / いただきます (khiêm nhường)'],
    'Chủ ngữ là người nhận được sự giúp đỡ hoặc ân huệ từ người khác, thể hiện lòng biết ơn.',
    'Khi dùng với cấp trên hoặc giáo viên thì đổi もらいます thành いただきます.',
    '日本人の友達に作文を直してもらいました。', 'にほんじんのともだちにさくぶんをなおしてもらいました。', 'Tôi đã được người bạn Nhật sửa giúp bài văn.', 'I had my Japanese friend correct my essay.'
  ],
  [
    'V-て + くれる / くださる', 'てくれる', 'te kureru',
    'Ai đó làm ~ cho tôi (Người khác chủ động giúp mình)', 'Someone kindly does ~ for me',
    ['Người làm + が / は +（私に）+ Động từ thể て + くれます / くださいます (kính ngữ)'],
    'Chủ ngữ là người thực hiện hành động mang lại lợi ích cho người nói (hoặc người thân của người nói).',
    'Thường lược bỏ 私に vì bản thân くれる đã hàm ý hướng về phía người nói.',
    '母が誕生日にセーターを作ってくれました。', 'ははがたんじょうびにせーたーをつくってくれました。', 'Mẹ đã đan cho tôi một chiếc áo len vào ngày sinh nhật.', 'My mother knitted a sweater for me on my birthday.'
  ],
  [
    'V-て + いただけませんか（丁寧な依頼）', 'ていただけませんか', 'te itadakemasen ka',
    'Anh/chị có thể vui lòng làm ~ giúp tôi được không?', 'Could you please ~ for me? (Very polite request)',
    ['Động từ thể て + いただけませんか / もらえませんか / くれませんか'],
    'Cách nhờ vả vô cùng lịch sự (dùng thể khả năng của いただく ở dạng câu hỏi phủ định), rất phổ biến trong giao tiếp công sở và với người lạ.',
    'Mức độ lịch sự giảm dần: ていただけませんか > てもらえませんか > てくれませんか.',
    'すみませんが、もう一度説明していただけませんか。', 'すみませんが、もういちどせつめいしていただけませんか。', 'Xin lỗi, anh/chị có thể vui lòng giải thích lại một lần nữa được không ạ?', 'Excuse me, could you please explain it one more time?'
  ],
  [
    '条件形（〜ば・Conditional ba-form）', 'ば', 'ba',
    'Nếu ~ thì ~ (Điều kiện giả định)', 'If ~ (Conditional form)',
    ['Động từ: Đổi âm cột う → cột え + ば (行く → 行けば)', 'Tính từ い: Bỏ い + ければ (安い → 安ければ)', 'Tính từ な / Danh từ: + なら / であれば'],
    'Nêu điều kiện cần để kết quả ở mệnh đề sau xảy ra. Thường dùng trong câu châm ngôn, lời khuyên hoặc điều kiện chung.',
    'Ngoại lệ: いい → よければ, ない → なければ.',
    '天気がよければ、向こうに富士山が見えます。', 'てんきがよければ、むこうにふじさんがみえます。', 'Nếu thời tiết đẹp thì có thể nhìn thấy núi Phú Sĩ ở phía bên kia.', 'If the weather is good, you can see Mt. Fuji over there.'
  ],
  [
    '〜たら（仮定条件・After / If）', 'たら', 'tara',
    'Nếu ~ / Sau khi ~ thì ~', 'If ~ / When ~ / After ~',
    ['Động từ / Tính từ / Danh từ chia ở Thể quá khứ ngắn (Thể た / だった) + ら'],
    'Là mẫu câu điều kiện linh hoạt nhất trong tiếng Nhật: dùng được cho cả giả định ("Nếu...") lẫn mốc thời gian tương lai ("Khi nào xong A thì làm B").',
    'Mệnh đề sau たら có thể thoải mái dùng câu mệnh lệnh, rủ rê, ý chí.',
    '駅に着いたら、電話してください。', 'えきについたら、でんわしてください。', 'Khi nào đến nhà ga thì hãy gọi điện cho tôi nhé.', 'Please call me when you arrive at the station.'
  ],
  [
    '〜なら（話題・助言の条件）', 'なら', 'nara',
    'Nếu là ~ thì ~ (Đưa lời khuyên dựa trên thông tin người nghe vừa nêu)', 'If it is the case that ~ / As for ~',
    ['Danh từ / Tính từ な (bỏ だ) / Động từ・Tính từ い (Thể thông thường) + なら'],
    'Dùng khi bắt lấy chủ đề mà đối phương vừa nhắc tới để đưa ra gợi ý, lời khuyên hoặc nhận xét.',
    'Mệnh đề sau なら thường xảy ra TRƯỚC hành động ở mệnh đề なら (京都へ行くなら、カメラを買ったほうがいい = Nếu định đi Kyoto thì nên mua máy ảnh trước).',
    'カメラを買うなら、この店がいいですよ。', 'かめらをかうなら、このみせがいいですよ。', 'Nếu định mua máy ảnh thì cửa hàng này tốt đấy.', 'If you are buying a camera, this shop is great.'
  ],
  [
    '〜ても / 〜でも（逆接仮定）', 'てもでも', 'temo demo',
    'Cho dù ~ thì vẫn ~', 'Even if ~ / Even though ~',
    ['Động từ thể て + も', 'Tính từ い (bỏ い) + くても', 'Tính từ な / Danh từ + でも'],
    'Diễn tả điều kiện nhượng bộ: dù giả thiết ở vế đầu có xảy ra thì kết quả ở vế sau vẫn không thay đổi.',
    'Thường đi kèm với từ nhấn mạnh いくら hoặc どんなに ở đầu câu.',
    '雨が降っても、明日の試合は行われます。', 'あめがふっても、あしたのしあいはおこなわれます。', 'Cho dù trời có mưa thì trận đấu ngày mai vẫn diễn ra.', 'Even if it rains, tomorrow\'s match will take place.'
  ],
  [
    'V-た / V-ない + ほうがいいです（助言）', 'ほうがいいです', 'hou ga ii desu',
    'Nên làm ~ / Không nên làm ~ (Lời khuyên)', 'Had better ~ / Should ~',
    ['Động từ thể た (V-た) + ほうがいいです (Nên làm ~)', 'Động từ thể ない (V-ない) + ほうがいいです (Không nên làm ~)'],
    'Dùng để đưa ra lời khuyên cho người nghe khi họ đang gặp vấn đề (như ốm đau, phân vân).',
    'Ở dạng khẳng định dùng V-た (quá khứ ngắn) chứ ít dùng V-る.',
    '熱がありますから、今日は早く寝たほうがいいですよ。', 'ねつがありますから、きょうははやくねたほうがいいですよ。', 'Vì bạn đang bị sốt nên hôm nay nên đi ngủ sớm thì hơn.', 'Since you have a fever, you had better go to bed early today.'
  ],
  [
    '意向形（〜よう・〜おう・Volitional Form）', 'いこうけい', 'ikoukei',
    'Thể ý chí (Hãy cùng ~ / Định làm ~)', 'Volitional verb form (Let\'s ~ / Will ~)',
    ['Nhóm 1: Đổi âm cột う → cột お + う (行く → 行こう, 話す → 話そう)', 'Nhóm 2: Bỏ ます + よう (食べる → 食べよう)', 'Nhóm 3: する → しよう, 来る → 来よう（こよう）'],
    'Là dạng thông thường (Plain form) của 〜ましょう, dùng để rủ bạn bè thân thiết hoặc kết hợp với 〜と思う để nói về ý định.',
    'V-ようと思っています diễn tả dự định đã ấp ủ từ trước cho đến hiện tại.',
    '週末、海へ泳ぎに行こうと思っています。', 'しゅうまつ、うみへおよぎにいこうとおもっています。', 'Cuối tuần này tôi đang định đi bơi ở biển.', 'I am thinking of going swimming at the beach this weekend.'
  ],
  [
    '受身形（うけみけい・Passive Form）', 'うけみけい', 'ukemikei',
    'Thể bị động (Bị / Được ~)', 'Passive verb form (Be done by ~)',
    ['Nhóm 1: Đổi âm cột う → cột あ + れる (書く → 書かれる, 読む → 読まれる)', 'Nhóm 2: Bỏ ます + られる (褒める → 褒められる)', 'Nhóm 3: する → される, 来る → 来られる（こられる）'],
    'Dùng khi chủ ngữ chịu tác động từ người khác (A は B に V-られる) hoặc khi nói về các sự kiện công cộng, công trình kiến trúc mà không cần nêu người thực hiện.',
    'Tiếng Nhật có "bị động gián tiếp" (迷惑の受身) mang sắc thái bị làm phiền (雨に降られた = bị dính mưa).',
    '先生に発音を褒められました。', 'せんせいに発音をほめられました。', 'Tôi đã được thầy giáo khen về phát âm.', 'I was praised by the teacher for my pronunciation.'
  ],
  [
    '使役形（しえきけい・Causative Form）', 'しえきけい', 'shiekikei',
    'Thể sai khiến (Bắt / Cho phép ai làm ~)', 'Causative verb form (Make / Let someone do ~)',
    ['Nhóm 1: Đổi âm cột う → cột あ + せる (行く → 行かせる, 飲む → 飲ませる)', 'Nhóm 2: Bỏ ます + させる (食べる → 食べさせる)', 'Nhóm 3: する → させる, 来る → 来させる（こさせる）'],
    'Diễn tả việc cấp trên/cha mẹ yêu cầu, bắt buộc hoặc cho phép cấp dưới/con cái thực hiện hành động.',
    'Khi đi với 〜ていただけますか (V-させていただけませんか), câu mang nghĩa xin phép cực kỳ lịch sự: "Xin cho phép tôi được làm ~".',
    '母は毎日私に野菜を食べさせます。', 'はははまいにちわたしにやさいをたべさせます。', 'Mẹ bắt tôi ăn rau mỗi ngày.', 'My mother makes me eat vegetables every day.'
  ],
  [
    '使役受身形（しえきうけみけい）', 'しえきうけみけい', 'shieki ukemikei',
    'Thể sai khiến bị động (Bị bắt phải làm ~)', 'Causative-passive form (Be made to do ~)',
    ['Nhóm 1: Đổi âm cột う → cột あ + される (riêng nhóm kết thúc bằng す → させられる)', 'Nhóm 2: Bỏ ます + させられる', 'Nhóm 3: する → させられる, 来る → 来させられる'],
    'Diễn tả tâm trạng miễn cưỡng khi bị người khác ép hoặc giao làm một việc mình không muốn.',
    'Ví dụ: 待たされる (bị bắt đợi), 飲まされる (bị ép uống).',
    '子供のとき、嫌いな牛乳を飲まされました。', 'こどものとき、きらいなぎゅうにゅうをのまされました。', 'Hồi nhỏ tôi đã bị bắt phải uống món sữa mà mình ghét.', 'When I was a child, I was made to drink milk that I disliked.'
  ],
  [
    '命令形・禁止形（めいれいけい・きんしけい）', 'めいれいけいきんしけい', 'meireikei kinshikei',
    'Thể mệnh lệnh (Hãy làm!) & Thể cấm đoán (Cấm làm!)', 'Imperative and Prohibitive forms',
    ['Mệnh lệnh: Nhóm 1 cột う → cột え (行け); Nhóm 2 bỏ ます + ろ (食べろ); する → しろ, 来る → 来い（こい）', 'Cấm đoán: Động từ thể từ điển (V-る) + な (行くな, 食べるな, するな)'],
    'Cách ra lệnh hoặc cấm đoán rất mạnh, thường xuất hiện trên biển báo giao thông, khẩu hiệu thể thao hoặc lời nói của nam giới trong tình huống khẩn cấp.',
    'Hạn chế dùng trực tiếp trong hội thoại thông thường (thay bằng 〜てください / 〜ないでください).',
    '危ない！ここに車を止めるな。', 'あぶない！ここにくるまをとめるな。', 'Nguy hiểm! Cấm đỗ xe ở đây.', 'Dangerous! Do not park your car here.'
  ],
  [
    '〜ために（目的・原因）', 'ために', 'tame ni',
    'Để ~ (Mục đích) / Vì ~ (Lợi ích hoặc Nguyên nhân)', 'In order to ~ / For the sake of ~ / Because of ~',
    ['Mục đích: Động từ thể từ điển (V-る) + ために', 'Lợi ích: Danh từ + の + ために'],
    'Dùng khi chủ ngữ chủ động thực hiện hành động nhằm đạt được một mục tiêu lớn, hoặc làm vì lợi ích của ai đó.',
    'Hai vế của 〜ために (mục đích) phải có cùng một chủ ngữ và động từ trước ために là động từ có ý chí.',
    '将来、自分の店を持つために貯金しています。', 'しょうらい、じぶんのみせをもつためにちょきんしています。', 'Tôi đang tiết kiệm tiền để mở cửa hàng riêng trong tương lai.', 'I am saving money in order to own my own shop in the future.'
  ],
  [
    '〜ように（目的・Goal that becomes possible）', 'ように', 'you ni',
    'Để có thể ~ / Sao cho không ~', 'So that ~ / In order that ~',
    ['Động từ thể khả năng / Tự động từ / V-ない + ように'],
    'Chỉ mục đích hướng tới một trạng thái hoặc khả năng (khác với ために dùng cho ngoại động từ có ý chí).',
    'Rất hay đi với 忘れないように (để không quên), 聞こえるように (để nghe rõ), 間に合うように (để kịp giờ).',
    '後ろの人にも聞こえるように、大きい声で話してください。', 'うしろのひとにもきこえるように、おおきいこえではなしてください。', 'Xin hãy nói to để người ngồi sau cũng có thể nghe thấy.', 'Please speak loudly so that people in the back can also hear.'
  ],
  [
    '〜のに（用途・For the purpose of）', 'のにようと', 'no ni (youto)',
    'Để dùng vào việc ~', 'For the purpose of ~ / In order to ~',
    ['Động từ thể từ điển (V-る) + のに + 使う / 便利だ / 役に立つ / 必要だ / かかる'],
    'Nêu công dụng của một đồ vật hoặc đánh giá mức độ tiện lợi, thời gian, chi phí cần thiết cho một mục đích.',
    'Vị ngữ phía sau luôn là các từ như 使います, 便利です, いいです, 時間がかかります.',
    'このアプリは漢字を覚えるのにとても便利です。', 'このあぷりかんじをおぼえるのにとてもべんりです。', 'Ứng dụng này rất tiện lợi cho việc ghi nhớ chữ Kanji.', 'This app is very convenient for memorizing Kanji.'
  ],
  [
    '〜のに（逆接・Even though）', 'のにぎゃくせつ', 'no ni (gyakusetsu)',
    'Mặc dù ~ thế mà lại ~ (Ngạc nhiên / Phàn nàn)', 'Even though ~ / Despite ~',
    ['Động từ / Tính từ い (Thể thông thường) + のに', 'Tính từ な / Danh từ + な + のに'],
    'Biểu thị kết quả trái ngược với kỳ vọng đương nhiên, kèm theo cảm xúc tiếc nuối, bất ngờ hoặc trách móc của người nói.',
    'Không dùng câu mệnh lệnh, ý chí hay câu hỏi ở mệnh đề sau のに (khác với 〜けれども).',
    '約束したのに、彼は来ませんでした。', 'やくそくしたのに、かれはきませんでした。', 'Mặc dù đã hẹn rồi thế mà anh ấy lại không đến.', 'Even though he promised, he did not come.'
  ],
  [
    '〜ので（丁寧な理由）', 'ので', 'node',
    'Vì ~ nên ~ (Nêu lý do nhẹ nhàng, lịch sự)', 'Because ~ / Since ~ (Polite causal connector)',
    ['Động từ / Tính từ い (Thể thông thường) + ので', 'Tính từ な / Danh từ + な + ので'],
    'Nêu nguyên nhân khách quan một cách mềm mỏng, lịch sự hơn から, thường dùng khi xin phép, xin lỗi hoặc giải thích lý do.',
    'Danh từ và tính từ な phải đổi だ thành な trước ので (雨なので, 静かなので).',
    '電車が遅れたので、遅刻してしまいました。', 'でんしゃがおくれたので、ちこくしてしまいました。', 'Vì tàu điện bị trễ nên tôi đã đến muộn mất.', 'Because the train was delayed, I ended up being late.'
  ],
  [
    '〜かしら / 〜かな（自問）', 'かなかしら', 'kana kashira',
    'Không biết có ~ không nhỉ? (Tự hỏi bản thân)', 'I wonder if ~',
    ['Mệnh đề Thể thông thường (Danh từ / Tính từ な bỏ だ) + かな / かしら'],
    'Dùng khi người nói tự băn khoăn hoặc hỏi nhẹ nhàng người nghe.',
    'かな dùng cho cả nam và nữ; かしら thường mang sắc thái nữ tính trong văn viết/phim ảnh.',
    '明日はいい天気かな。', 'あしたはいいてんきかな。', 'Không biết ngày mai thời tiết có đẹp không nhỉ?', 'I wonder if the weather will be nice tomorrow.'
  ],
  [
    '疑問詞 + 〜か（間接疑問文）', 'ぎもんしか', 'gimonshi ka',
    'Câu hỏi gián tiếp lồng trong câu (Biết ~ là gì / ở đâu / khi nào)', 'Embedded question clause (what / where / when ~)',
    ['Từ để hỏi (何 / どこ / いつ / だれ / どう...) + Mệnh đề Thể thông thường + か + 分かります / 教えてください / 忘れました'],
    'Biến một câu hỏi thành một cụm danh từ làm tân ngữ cho các động từ như biết, nhớ, quên, hãy chỉ cho tôi.',
    'Danh từ và tính từ な bỏ だ trước か.',
    '会議が何時に始まるか知っていますか。', 'かいぎがなんじにはじまるかしっていますか。', 'Bạn có biết cuộc họp bắt đầu lúc mấy giờ không?', 'Do you know what time the meeting starts?'
  ],
  [
    '〜かどうか（Yes/No 間接疑問文）', 'かどうか', 'ka dou ka',
    'Liệu có ~ hay không', 'Whether or not ~',
    ['Mệnh đề Thể thông thường (không có từ nghi vấn; N / Na bỏ だ) + かどうか + 分かりません / 調べます / 聞いてみます'],
    'Dùng để lồng một câu hỏi Yes/No vào bên trong câu chính.',
    'Không đi cùng các từ nghi vấn như 何, どこ, いつ.',
    'このニュースが本当かどうか分かりません。', 'このにゅーすがほんとうかどうかわかりません。', 'Tôi không biết tin tức này có thật hay không.', 'I don\'t know whether or not this news is true.'
  ],
  [
    '〜かもしれない', 'かもしれない', 'kamoshirenai',
    'Có lẽ là ~ / Biết đâu chừng ~', 'Might ~ / May ~ / Perhaps ~',
    ['Động từ / Tính từ い (Thể thông thường) + かもしれません', 'Tính từ な / Danh từ (bỏ だ) + かもしれません'],
    'Diễn tả sự suy đoán với mức độ chắc chắn thấp (khoảng 30–50%), cho rằng một khả năng nào đó có thể xảy ra.',
    'Trong văn nói thân mật thường rút gọn thành 〜かも.',
    '道が混んでいますから、少し遅れるかもしれません。', 'みちがこんでいますから、すこしおくれるかもしれません。', 'Vì đường đang đông nên có lẽ tôi sẽ đến muộn một chút.', 'Because the roads are congested, I might be a little late.'
  ],
  [
    '〜はずだ（当然の推量）', 'はずだ', 'hazu da',
    'Chắc chắn là ~ / Đáng lý ra phải ~', 'Must be ~ / Be supposed to ~',
    ['Động từ / Tính từ い (Thể thông thường) + はずです', 'Tính từ な + な + はずです', 'Danh từ + の + はずです'],
    'Diễn tả sự suy đoán có độ tin cậy cao vì có căn cứ, lịch trình hoặc logic rõ ràng hỗ trợ.',
    'Phủ định mạnh là 〜はずがありません (Không đời nào có chuyện ~).',
    '田中さんは日本に十年住んでいましたから、日本語が上手なはずです。', 'たなかさんはにほんにじゅうねんすんでいましたから、にほんごがじょうずなはずです。', 'Anh Tanaka đã sống ở Nhật 10 năm nên chắc chắn tiếng Nhật rất giỏi.', 'Since Mr. Tanaka lived in Japan for ten years, his Japanese must be good.'
  ],
  [
    '〜まま（状態維持）', 'まま', 'mama',
    'Cứ để nguyên trạng thái ~ mà làm gì', 'As it is / Leaving in the same state',
    ['Động từ thể た (V-た) / V-ない + まま', 'Tính từ い + まま / Tính từ な + なまま', 'Danh từ + の + まま'],
    'Diễn tả việc giữ nguyên một trạng thái (thường là khác thường) trong khi thực hiện hành động tiếp theo.',
    'Ví dụ: 靴を履いたまま (để nguyên giày mà bước vào), テレビをつけたまま寝る (để nguyên tivi bật mà ngủ).',
    '電気をつけたまま、寝てしまいました。', 'でんきをつけたまま、ねてしまいました。', 'Tôi đã ngủ quên trong khi vẫn bật đèn.', 'I fell asleep with the light left on.'
  ],
  [
    '〜あいだ / 〜あいだに（間・間に）', 'あいだあいだに', 'aida aida ni',
    'Trong suốt thời gian ~ / Nhân lúc đang ~', 'While ~ / During ~',
    ['Động từ V-ている / Tính từ / Danh từ + の + あいだ（に）'],
    '〜あいだ chỉ hành động kéo dài suốt toàn bộ khoảng thời gian đó; 〜あいだに chỉ một sự việc xảy ra tại một thời điểm nằm trong khoảng thời gian đó.',
    'Chú ý chia động từ ở V-ている trước あいだ(に).',
    '母が昼寝をしている間に、晩ご飯を作りました。', 'ははがひるねをしているあいだに、ばんごはんをつくりました。', 'Nhân lúc mẹ đang ngủ trưa, tôi đã nấu bữa tối.', 'While my mother was taking a nap, I made dinner.'
  ],
  [
    '〜ころ（頃・Approximate time）', 'ころ', 'koro',
    'Vào khoảng thời gian ~ / Hồi còn ~', 'Around the time of ~ / When ~',
    ['Động từ (V-る / V-ている / V-た) / Tính từ + ころ', 'Danh từ + の + ころ'],
    'Chỉ một khoảng thời điểm tương đối hoặc một giai đoạn trong cuộc đời (子供のころ = hồi còn nhỏ).',
    'Khi gắn sau giờ giấc cụ thể thì đọc là ごろ (六時ごろ).',
    '大学生のころ、よく一人旅をしました。', 'だいがくせいのころ、よくひとりたびをしました。', 'Hồi còn là sinh viên đại học, tôi thường đi du lịch một mình.', 'When I was a university student, I often traveled alone.'
  ],
  [
    '〜ばかり（限定・完了直後）', 'ばかり', 'bakari',
    'Toàn là ~ / Vừa mới làm ~ xong', 'Nothing but ~ / Just finished doing ~',
    ['Danh từ + ばかり (Toàn là ~)', 'Động từ thể た (V-た) + ばかりです (Vừa mới ~ xong)'],
    'Khi đi với danh từ hoặc V-てばかりいる, câu mang ý phê bình làm mãi một việc. Khi đi với V-たばかり, câu diễn tả cảm nhận chủ quan rằng việc đó vừa mới diễn ra chưa lâu.',
    'Phân biệt với V-たところ (vừa mới xong ngay tức thì về mặt thời gian thực).',
    '先月、日本へ来たばかりです。', 'せんげつ、にほんへきたばかりです。', 'Tôi vừa mới đến Nhật vào tháng trước thôi.', 'I just came to Japan last month.'
  ],
  [
    '〜ところだ（段階・About to / In the middle of / Just did）', 'ところだ', 'tokoro da',
    'Sắp sửa ~ / Đang đúng lúc ~ / Vừa mới ~ tức thì', 'About to do ~ / In the middle of doing ~ / Just did ~',
    ['V-る + ところです (Sắp sửa làm ~)', 'V-ている + ところです (Đang làm ~)', 'V-た + ところです (Vừa mới làm xong tức thì)'],
    'Xác định chính xác giai đoạn tiến triển của một hành động tại thời điểm nói.',
    'Hay đi kèm với これから (sắp), 今 (đang), たった今 (vừa mới tức thì).',
    'ちょうど今から昼ご飯を食べるところです。', 'ちょうどいまからひるごはんをたべるところです。', 'Tôi vừa đúng lúc chuẩn bị ăn trưa ngay bây giờ.', 'I am just about to eat lunch right now.'
  ],
  [
    '〜出す / 〜始める / 〜終わる / 〜続ける（複合動詞）', 'ふくごうどうし', 'fukugou doushi',
    'Bắt đầu (đột ngột) / Bắt đầu / Kết thúc / Tiếp tục làm ~', 'Burst into ~ / Start ~ / Finish ~ / Continue ~',
    ['Động từ (bỏ ます) + 出す（だす）/ 始める（はじめる）/ 終わる（おわる）/ 続ける（つづける）'],
    'Ghép gốc ます của động từ với một động từ phụ để mô tả giai đoạn bắt đầu, tiếp diễn hay kết thúc của hành động.',
    '〜出す nhấn mạnh sự khởi phát bất ngờ (泣き出す = bật khóc, 降り出す = đổ mưa).',
    '急に雨が降り出しました。', 'きゅうにあめがふりだしました。', 'Đột nhiên trời đổ mưa.', 'Suddenly it started to rain.'
  ],
  [
    '〜がる（第三者の感情・欲求）', 'がる', 'garu',
    'Người khác tỏ ra muốn / cảm thấy ~', 'Show signs of feeling / wanting ~ (3rd person)',
    ['Tính từ い (bỏ い) / Tính từ な (bỏ な) / V-たい (bỏ い) + がる / がっています'],
    'Trong tiếng Nhật, các từ chỉ cảm xúc/mong muốn (欲しい, 〜たい, 怖い, 寂しい, 嬉しい) không dùng trực tiếp cho ngôi thứ 3 ở câu trần thuật mà phải chuyển sang 〜がっています.',
    'Sau khi thêm がる, từ đó trở thành ngoại động từ nhóm 1 nên tân ngữ đi với trợ từ を.',
    '子供が新しいおもちゃを欲しがっています。', 'こどもがあたらしいおもちゃをほしがっています。', 'Đứa trẻ đang đòi/muốn có món đồ chơi mới.', 'The child is wanting a new toy.'
  ],
  [
    '〜さ（形容詞の名詞化）', 'さ', 'sa',
    'Độ ~ / Sự ~ (Danh từ hóa tính từ chỉ mức độ)', '-ness (Nominalizing adjectives into measurable nouns)',
    ['Tính từ い (bỏ い) + さ (高い → 高さ, 重い → 重さ)', 'Tính từ な (bỏ な) + さ (便利 → 便利さ, 大切 → 大切さ)'],
    'Hậu tố 〜さ biến tính từ thành danh từ chỉ mức độ, kích thước hoặc tính chất khách quan.',
    'Ngoại lệ: いい → よさ.',
    'この山の高さは三千メートルぐらいです。', 'このやまのたかさはさんぜんめーとるぐらいです。', 'Độ cao của ngọn núi này khoảng 3.000 mét.', 'The height of this mountain is about 3,000 meters.'
  ],
  [
    '〜ば〜ほど（比例変化）', 'ばほど', 'ba hodo',
    'Càng ~ càng ~', 'The more ~, the more ~',
    ['Động từ chia thể ば + Động từ thể từ điển + ほど', 'Tính từ い (〜ければ) + Tính từ い + ほど', 'Tính từ な (〜なら) + Tính từ な + なほど'],
    'Diễn tả mối quan hệ tỷ lệ thuận: mức độ ở vế trước tăng lên bao nhiêu thì kết quả ở vế sau cũng tăng theo bấy nhiêu.',
    'Lặp lại cùng một động từ hoặc tính từ ở cả trước và sau ば.',
    '日本語は勉強すれば勉強するほど面白くなります。', 'にほんごはべんきょうすればべんきょうするほどおもしろくなります。', 'Tiếng Nhật càng học càng thấy thú vị.', 'The more you study Japanese, the more interesting it becomes.'
  ],
  [
    '〜て / 〜で（原因・理由）', 'てでりゆう', 'te de (reason)',
    'Vì ~ nên ~ (Nguyên nhân dẫn đến cảm xúc hoặc trạng thái không tự chủ)', 'Because of ~ (Cause of emotion or state)',
    ['Động từ thể て / Tính từ (〜くて / 〜で) / Danh từ + で + Vị ngữ chỉ cảm xúc / trạng thái khả năng'],
    'Nêu nguyên nhân trực tiếp gây ra một cảm xúc (vui, buồn, lo lắng, ngạc nhiên) hoặc một sự cố ngoài tầm kiểm soát.',
    'Vế sau KHÔNG được dùng các câu mang ý chí, mệnh lệnh hay rủ rê (nếu có ý chí phải dùng から hoặc ので).',
    'ニュースを聞いて、とてもびっくりしました。', 'にゅーすをきいて、とてもびっくりしました。', 'Nghe tin tức xong, tôi đã vô cùng ngạc nhiên.', 'Hearing the news, I was very surprised.'
  ],
  [
    '〜ないで / 〜ずに（付帯状況）', 'ないでずに', 'naide zuni',
    'Làm B mà không làm A', 'Without doing A, do B',
    ['Động từ thể ない + で、Động từ 2', 'Động từ thể ない (bỏ ない) + ずに、Động từ 2 (する → せずに)'],
    'Diễn tả việc thực hiện hành động chính mà bỏ qua một bước thông thường hay làm.',
    '〜ずに là dạng trang trọng/văn viết của 〜ないで.',
    '今朝は朝ご飯を食べないで、学校へ行きました。', 'けさはあさごはんをたべないで、がっこうへいきました。', 'Sáng nay tôi đã đến trường mà không ăn sáng.', 'This morning I went to school without eating breakfast.'
  ],
  [
    '〜代わりに（かわりに）', 'かわりに', 'kawari ni',
    'Thay vì ~ / Thay mặt cho ~ / Đổi lại ~', 'Instead of ~ / On behalf of ~ / In exchange for ~',
    ['Động từ thể từ điển (V-る) + 代わりに', 'Danh từ + の + 代わりに'],
    'Diễn tả việc chọn phương án B thay cho phương án A, làm đại diện cho ai đó, hoặc trao đổi lợi ích tương đương.',
    'Khi nối 2 câu độc lập có thể dùng その代わりに ("Đổi lại thì...").',
    '日曜日に働く代わりに、月曜日に休みます。', 'にちようびにはたらくかわりに、げつようびにやすみます。', 'Thay vì làm việc vào Chủ nhật, tôi sẽ nghỉ vào thứ Hai.', 'In exchange for working on Sunday, I will take Monday off.'
  ],
  [
    '〜までに（期限・By the time）', 'までに', 'made ni',
    'Trước thời điểm ~ / Muộn nhất là vào ~ (Hạn chót)', 'By (a deadline / time limit)',
    ['Danh từ chỉ thời điểm + までに', 'Động từ thể từ điển (V-る) + までに'],
    'Chỉ thời hạn cuối cùng mà một hành động một lần phải được hoàn tất.',
    'Phân biệt: まで dùng cho hành động kéo dài liên tục (5時まで働く = làm việc suốt đến 5 giờ), còn までに dùng cho hạn chót hoàn thành (5時までにレポートを出す = nộp báo cáo trước 5 giờ).',
    'この本は来週の金曜日までに返してください。', 'このほんはらいしゅうのきんようびまでにかえしてください。', 'Quyển sách này xin hãy trả lại muộn nhất là thứ Sáu tuần sau.', 'Please return this book by next Friday.'
  ],
  [
    '〜によると / 〜によれば（情報源）', 'によると', 'ni yoru to',
    'Theo như ~ (Trích dẫn nguồn thông tin)', 'According to ~',
    ['Danh từ (Nguồn tin: 天気予報, 新聞, ニュース...) + によると / によれば、〜そうです / 〜らしいです'],
    'Nêu nguồn gốc thông tin làm cơ sở cho câu truyền đạt ở phía sau.',
    'Cuối câu hầu như luôn đi kèm với 〜そうです hoặc 〜らしいです.',
    '今朝の新聞によると、来月から電車賃が上がるそうです。', 'けさのしんぶんによると、らいげつからでんしゃちんがあがるそうです。', 'Theo báo sáng nay thì nghe nói từ tháng sau giá vé tàu điện sẽ tăng.', 'According to this morning\'s newspaper, train fares will go up starting next month.'
  ],
  [
    '尊敬語（そんけいご・Honorific Language）', 'そんけいご', 'sonkeigo',
    'Tôn kính ngữ (Nâng cao hành động của cấp trên / khách hàng)', 'Honorific expressions (Respectful language)',
    ['お + V（ますstem）+ になります (お読みになります)', 'Động từ thể bị động (読まれます)', 'Động từ đặc biệt: いらっしゃる (đi/đến/ở), 召し上がる (ăn/uống), おっしゃる (nói), ご覧になる (xem), なさる (làm)'],
    'Dùng để nói về hành động, trạng thái hoặc vật sở hữu của người bề trên (thầy cô, sếp, khách hàng) nhằm thể hiện sự kính trọng.',
    'Tuyệt đối không dùng tôn kính ngữ cho hành động của chính bản thân mình.',
    '先生はもうお帰りになりました。', 'せんせいはもうおかえりになりました。', 'Thầy giáo đã về rồi ạ.', 'The teacher has already gone home.'
  ],
  [
    '謙譲語（けんじょうご・Humble Language）', 'けんじょうご', 'kenjougo',
    'Khiêm nhường ngữ (Hạ mình khi nói về hành động của bản thân hướng tới cấp trên)', 'Humble expressions (Modest language)',
    ['お + V（ますstem）+ します / いたします (お持ちします)', 'ご + Danh từ Hán Nhật + します (ご案内します)', 'Động từ đặc biệt: 参る/伺う (đi/đến), いただく (ăn/uống/nhận), 申す/申し上げる (nói), 拝見する (xem), 存じる (biết)'],
    'Dùng để nói về hành động của chính mình (hoặc người trong công ty mình) nhằm thể hiện sự khiêm tốn đối với người nghe hoặc người nhận hành động.',
    'Phân biệt: 知っています → 存じております; 知りません → 存じません.',
    'お荷物は私がお持ちします。', 'おにもつはわたしがおもちします。', 'Hành lý của quý khách xin để tôi xách giúp ạ.', 'I will carry your luggage for you.'
  ],
  [
    '丁寧語・美化語（でございます・よろしいでしょうか）', 'ていねいご', 'teineigo',
    'Lịch sự ngữ trang trọng (でございます / よろしいでしょうか)', 'Formal polite expressions',
    ['Danh từ + でございます (Lịch sự trang trọng của です)', 'よろしいでしょうか (Lịch sự của いいですか)'],
    'Dùng trong dịch vụ khách hàng, thuyết trình, lễ tân hoặc email công việc để làm câu nói trang nhã, lịch thiệp.',
    'ございます là dạng lịch sự của あります.',
    'こちらが会議室でございます。', 'こちらがかいぎしつでございます。', 'Phía bên này là phòng họp ạ.', 'This way is the conference room.'
  ],
  [
    '〜てほしい / 〜ないでほしい', 'てほしい', 'te hoshii',
    'Muốn ai đó làm ~ / Không làm ~', 'Want someone to do ~ / Not to do ~',
    ['Người thực hiện + に + Động từ thể て + ほしいです', 'Người thực hiện + に + Động từ thể ない + でほしいです'],
    'Biểu thị mong muốn của người nói rằng một người khác hãy thực hiện (hoặc đừng thực hiện) hành động nào đó.',
    'Khác với V-たい (bản thân mình muốn làm), V-てほしい là muốn người khác làm.',
    '両親にはいつまでも元気でいてほしいです。', 'りょうしんにはいつまでもげんきでいてほしいです。', 'Tôi mong bố mẹ mình lúc nào cũng luôn khỏe mạnh.', 'I want my parents to stay healthy forever.'
  ],
  [
    '〜ことにする（主観的決定）', 'ことにする', 'koto ni suru',
    'Quyết định sẽ làm ~ (Tự mình đưa ra quyết định)', 'Decide to do ~ (Personal decision)',
    ['Động từ thể từ điển (V-る) / thể ない (V-ない) + ことにする / ことにしました'],
    'Diễn tả quyết định xuất phát từ ý chí chủ quan của chính người nói.',
    'Khi dùng ở dạng 〜ことにしています, câu mang nghĩa "tôi tự đặt ra nguyên tắc/thói quen cho mình là ~".',
    '健康のために、毎日三十分歩くことにしました。', 'けんこうのために、まいにちさんじっぷんあるくことにしました。', 'Vì sức khỏe, tôi đã quyết định đi bộ 30 phút mỗi ngày.', 'For my health, I decided to walk for 30 minutes every day.'
  ],
  [
    '〜ことになる（客観的決定・規則）', 'ことになる', 'koto ni naru',
    'Đã được quyết định là sẽ ~ / Theo quy định là ~', 'It has been decided that ~ / Turn out that ~',
    ['Động từ thể từ điển (V-る) / thể ない (V-ない) + ことになる / ことになりました'],
    'Diễn tả một quyết định được đưa ra bởi tập thể, công ty, nhà trường hoặc hoàn cảnh khách quan, không phải tự ý cá nhân.',
    'Dạng 〜ことになっています dùng để nêu nội quy, quy tắc hiện hành ("Theo quy định thì...").',
    '来月から東京の支店で働くことになりました。', 'らいげつからとうきょうのしてんではたらくことになりました。', 'Đã có quyết định là từ tháng sau tôi sẽ làm việc ở chi nhánh Tokyo.', 'It has been decided that I will work at the Tokyo branch starting next month.'
  ],
  [
    '〜ように言う / 伝える / 頼む（間接命令）', 'ようにいう', 'you ni iu',
    'Nhắn / Bảo / Nhờ ai đó hãy làm ~', 'Tell / Ask / Instruct someone to do ~',
    ['Động từ thể từ điển (V-る) / thể ない (V-ない) + ように + 言う / 伝える / 注意する / 頼む'],
    'Dùng để thuật lại gián tiếp một lời yêu cầu, nhắc nhở hoặc mệnh lệnh.',
    'Khác với 〜と言う (thuật lại thông tin trần thuật), 〜ように言う thuật lại yêu cầu hành động.',
    '先生は学生に遅刻しないように注意しました。', 'せんせいはがくせいにちこくしないようにちゅういしました。', 'Thầy giáo đã nhắc nhở học sinh không được đi muộn.', 'The teacher warned the students not to be late.'
  ],
  [
    '〜みたいだ（例示・推量）', 'みたいだ', 'mitai da',
    'Giống như là ~ / Hình như là ~', 'Like ~ / Similar to ~ / Seems that ~',
    ['Danh từ / Tính từ な (bỏ だ) / Động từ・Tính từ い + みたいだ', 'Trước danh từ: 〜みたいな + Danh từ; Trước động từ: 〜みたいに + Động từ'],
    'Dạng hội thoại tự nhiên của 〜ようだ, dùng để so sánh ví von hoặc phỏng đoán.',
    'Không thêm の sau danh từ như ようだ (子供みたいだ = giống như trẻ con).',
    '今日は春みたいに暖かいですね。', 'きょうははるみたいにあたたかいですね。', 'Hôm nay trời ấm áp như mùa xuân nhỉ.', 'Today is warm just like spring, isn\'t it?'
  ],
  [
    '〜という + N（名称・定義・内容）', 'という', 'to iu',
    'N có tên gọi là ~ / N mang nội dung là ~', 'Called ~ / Named ~ / The fact that ~',
    ['Tên riêng / Cụm từ + という + Danh từ chung', 'Mệnh đề Thể thông thường + という + 話 / ニュース / 意味 / 知らせ'],
    'Dùng để giới thiệu tên của một người/địa danh/sự vật chưa quen biết, hoặc giải thích nội dung chi tiết của một tin tức/từ vựng.',
    'Cấu trúc 「X」というのはどういう意味ですか dùng để hỏi nghĩa của từ X.',
    '昨日、「千と千尋の神隠し」という映画を見ました。', 'きのう、「せんとちひろのかみかくし」というえいがをみました。', 'Hôm qua tôi đã xem bộ phim tên là "Vùng đất linh hồn".', 'Yesterday I watched a movie called "Spirited Away".'
  ],
  [
    '〜てすみません / 〜てありがとう（感謝・謝罪の理由）', 'てすみません', 'te sumimasen',
    'Xin lỗi vì đã ~ / Cảm ơn vì đã ~', 'Sorry for doing ~ / Thank you for doing ~',
    ['Động từ thể て / V-なくて + すみません / ごめんなさい / ありがとうございます'],
    'Nêu lý do cụ thể khi cảm ơn hoặc xin lỗi ai đó.',
    'Có thể kết hợp với 〜てくれてありがとう để nhấn mạnh lòng biết ơn.',
    '返事が遅くなってすみません。', 'へんじがおそくなってすみません。', 'Xin lỗi vì tôi đã phản hồi muộn.', 'I am sorry for replying late.'
  ],
  [
    '〜かなあ（願望・詠嘆）', 'かなあ', 'kanaa',
    'Ước gì ~ nhỉ / Không biết bao giờ mới ~', 'I wish ~ / I wonder ~',
    ['Động từ thể ない + かなあ (Mong điều đó xảy ra)', 'Mệnh đề Thể thông thường + かなあ'],
    'Khi đi với động từ phủ định V-ないかなあ, câu biểu thị mong ước một điều gì đó sớm thành hiện thực.',
    'Ví dụ: 早く金曜日にならないかなあ (Mong sao nhanh đến thứ Sáu quá).',
    '早く夏休みにならないかなあ。', 'はやくなつやすみにならないかなあ。', 'Mong sao nhanh đến kỳ nghỉ hè quá đi.', 'I wish summer vacation would come soon.'
  ],
  [
    '〜くする / 〜にする（他動詞的変化・選択）', 'くするにする', 'ku suru ni suru',
    'Làm cho trở nên ~ / Chọn món ~', 'Make something [Adj] / Decide on [Noun]',
    ['Tính từ い (bỏ い) + く + します', 'Tính từ な / Danh từ + に + します'],
    'Khi đi với tính từ, nó diễn tả hành động chủ động làm thay đổi trạng thái của vật (làm ấm phòng, vặn nhỏ âm lượng). Khi đi với danh từ (N にします), nó mang nghĩa quyết định chọn món hoặc phương án đó.',
    'Cặp đối xứng với 〜くなる / 〜になる (tự thay đổi).',
    'テレビの音をもう少し小さくしてください。', 'てれびのおとをもうすこしちいさくしてください。', 'Xin hãy vặn nhỏ tiếng tivi xuống một chút nữa.', 'Please turn down the TV volume a little more.'
  ],
  [
    '〜やすい / 〜にくい（傾向・Frequency & Tendency）', 'けいこうやすい', 'yasui (tendency)',
    'Hay bị ~ / Dễ xảy ra ~', 'Prone to ~ / Tend to ~',
    ['Tự động từ (bỏ ます) + やすい / にくい'],
    'Ngoài nghĩa "dễ/khó làm", khi gắn với tự động từ (太る, 風邪を引く, 壊れる), nó chỉ khuynh hướng tự nhiên dễ hoặc khó xảy ra.',
    'Ví dụ: 冬は風邪を引きやすいです (Mùa đông rất dễ bị cảm cúm).',
    '季節の変わり目は風邪を引きやすいです。', 'きせつのかわりめはかぜをひきやすいです。', 'Vào lúc giao mùa rất dễ bị cảm lạnh.', 'It is easy to catch a cold during the change of seasons.'
  ],
  [
    '〜てたまらない / 〜てしかたがない', 'てたまらない', 'te tamaranai',
    '~ đến mức không chịu nổi / Vô cùng ~', 'Unbearably ~ / Extremely ~',
    ['Động từ thể て / Tính từ い (〜くて) / Tính từ な (〜で) + たまらない / しかたがない'],
    'Nhấn mạnh cảm xúc hoặc cảm giác cơ thể ở mức độ cực kỳ mãnh liệt, không thể kìm nén được.',
    'Thường đi với 嬉しい, 悲しい, 寂しい, 眠い, 暑い, 会いたい.',
    '国にいる家族に会いたくてたまりません。', 'くににいるかぞくにあいたくてたまりません。', 'Tôi nhớ và muốn gặp gia đình ở quê hương đến mức không chịu nổi.', 'I miss my family back home so much I can hardly bear it.'
  ],
  [
    '〜かい / 〜だい（親しい疑問）', 'かいだい', 'kai dai',
    '~ đấy à? / ~ thế? (Câu hỏi thân mật)', 'Familiar question particles',
    ['Câu hỏi Yes/No (Thể thông thường) + かい？', 'Câu hỏi có từ nghi vấn (Thể thông thường) + だい？'],
    'Trợ từ cuối câu hỏi mang sắc thái ấm áp, thân mật, thường được nam giới hoặc người lớn dùng khi hỏi thăm bạn bè, trẻ nhỏ.',
    'Phân biệt: かい dùng cho câu không có từ để hỏi; だい dùng cho câu có từ để hỏi (どうだい？, 何だい？).',
    'もう宿題は終わったかい？', 'もうしゅくだいはおわったかい？', 'Con đã làm xong bài tập về nhà chưa đấy?', 'Have you finished your homework already?'
  ],
  [
    '〜かしら / 〜わ / 〜ぞ / 〜ぜ（終助詞）', 'しゅうじょし', 'shuujoshi',
    'Các trợ từ cuối câu biểu cảm trong hội thoại', 'Sentence-ending expressive particles',
    ['Thể thông thường + ぞ / ぜ (Nhấn mạnh mạnh mẽ)', 'Thể thông thường + わ (Cảm thán nhẹ nhàng)'],
    'Giúp người học nhận diện sắc thái giới tính, độ tuổi và cảm xúc nhân vật trong hội thoại thực tế, phim ảnh và bài đọc.',
    'Thường gặp trong phần nghe hiểu (聴解) JLPT N4.',
    'さあ、これから頑張るぞ！', 'さあ、これからがんばるぞ！', 'Nào, từ bây giờ phải cố gắng hết sức thôi!', 'Alright, I\'m going to do my best from now on!'
  ],
  [
    '〜てもかまいません（許可・No problem）', 'てもかまいません', 'temo kamaimasen',
    'Dù ~ cũng không sao / Được phép ~', 'It doesn\'t matter if ~ / You may ~',
    ['Động từ thể て / Tính từ (〜くても / 〜でも) + かまいません'],
    'Diễn tả sự chấp thuận hoặc cho biết một việc không gây trở ngại gì, trang trọng hơn 〜てもいいです.',
    'Dùng nhiều trong câu hỏi xin phép: ここに座ってもかまいませんか.',
    '鉛筆で書いてもかまいません。', 'えんぴつでかいてもかまいません。', 'Bạn viết bằng bút chì cũng không sao đâu.', 'It is fine if you write in pencil.'
  ],
  [
    '〜なくてはならない / 〜ないといけない', 'ないといけない', 'naito ikenai',
    'Phải làm ~ (Nghĩa vụ trong giao tiếp hằng ngày)', 'Have to ~ / Must ~',
    ['Động từ thể ない (bỏ い) + くてはなりません / くてはいけません', 'Động từ thể ない + といけません'],
    'Tương đương với 〜なければなりません nhưng 〜ないといけない được dùng phổ biến hơn trong hội thoại hằng ngày.',
    'Dạng rút gọn trong văn nói: 〜なくちゃ / 〜なきゃ.',
    'もう時間だから、そろそろ行かないといけません。', 'もうじかんだから、そろそろいかないといけません。', 'Đã đến giờ rồi nên tôi phải đi bây giờ đây.', 'It\'s time already, so I have to get going soon.'
  ],
  [
    '〜だけでなく〜も（添加・Not only A but also B）', 'だけでなくも', 'dake de naku mo',
    'Không những ~ mà còn ~', 'Not only A, but also B',
    ['Danh từ / Động từ・Tính từ い (Thể thông thường) + だけでなく、〜も', 'Tính từ な + な + だけでなく、〜も'],
    'Mở rộng phạm vi: không chỉ dừng lại ở A mà còn bao gồm cả B.',
    'Trong văn nói có thể dùng 〜ばかりでなく.',
    '彼は英語だけでなく、日本語も話せます。', 'かれはえいごだけでなく、にほんごもはなせます。', 'Anh ấy không những nói được tiếng Anh mà còn nói được cả tiếng Nhật.', 'He can speak not only English, but also Japanese.'
  ]
];

export const CURATED_GRAMMAR = [
  ...RAW_GRAMMAR_N5.map((row, index) => {
    const [title, reading, romaji, vi, en, formation, explanation, notes, exJa, exFurigana, exVi, exEn] = row;
    return {
      id: `g_n5_${String(index + 1).padStart(3, '0')}`,
      title,
      reading,
      romaji,
      jlpt: 'N5',
      meaning: { vi, en },
      formation,
      explanation,
      notes,
      examples: [
        {
          ja: exJa,
          furigana: exFurigana,
          vi: exVi,
          en: exEn
        }
      ]
    };
  }),
  ...RAW_GRAMMAR_N4.map((row, index) => {
    const [title, reading, romaji, vi, en, formation, explanation, notes, exJa, exFurigana, exVi, exEn] = row;
    return {
      id: `g_n4_${String(index + 1).padStart(3, '0')}`,
      title,
      reading,
      romaji,
      jlpt: 'N4',
      meaning: { vi, en },
      formation,
      explanation,
      notes,
      examples: [
        {
          ja: exJa,
          furigana: exFurigana,
          vi: exVi,
          en: exEn
        }
      ]
    };
  })
];
