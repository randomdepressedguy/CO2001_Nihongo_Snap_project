// Comprehensive JLPT N5 & N4 Vocabulary Bank + Vietnamese Translation & Example Enrichment
// Used by scripts/seed-jlpt-n5-n4.mjs to merge with upstream OpenJLPT & Bluskyo JLPT datasets.

export const PRIORITY_VOCAB = [
  {
    id: 'v_n4_0001',
    word: '約束',
    reading: 'やくそく',
    romaji: 'yakusoku',
    hanViet: 'ƯỚC THÚC',
    jlpt: 'N4',
    pos: ['noun', 'suru-verb'],
    meanings: { vi: ['Lời hứa', 'Cuộc hẹn'], en: ['promise', 'appointment'] },
    examples: [
      {
        ja: '友達と約束があります。',
        furigana: 'ともだちとやくそくがあります。',
        vi: 'Tôi có cuộc hẹn với bạn.',
        en: 'I have an appointment with a friend.'
      }
    ]
  }
];

// Compact TSV rows: word|reading|jlpt|pos|vi|en
const N5_VOCAB_ROWS = `
私|わたし|N5|pronoun|Tôi|I; me
僕|ぼく|N5|pronoun|Tôi, tớ (nam)|I; me (male)
あなた|あなた|N5|pronoun|Bạn, anh, chị|you
彼|かれ|N5|pronoun|Anh ấy, bạn trai|he; boyfriend
彼女|かのじょ|N5|pronoun|Cô ấy, bạn gái|she; girlfriend
私たち|わたしたち|N5|pronoun|Chúng tôi, chúng ta|we; us
皆さん|みなさん|N5|noun|Mọi người, quý vị|everyone; ladies and gentlemen
人|ひと|N5|noun|Người, con người|person; human
方|かた|N5|noun|Vị, người (lịch sự)|person (polite); way
大人|おとな|N5|noun|Người lớn|adult
子供|こども|N5|noun|Trẻ em, con cái|child; children
男|おとこ|N5|noun|Đàn ông, nam giới|man; male
女|おんな|N5|noun|Phụ nữ, nữ giới|woman; female
男の子|おとこのこ|N5|noun|Bé trai|boy
女の子|おんなのこ|N5|noun|Bé gái|girl
男の人|おとこのひと|N5|noun|Người đàn ông|man
女の人|おんなのひと|N5|noun|Người phụ nữ|woman
友達|ともだち|N5|noun|Bạn bè|friend
家族|かぞく|N5|noun|Gia đình|family
両親|りょうしん|N5|noun|Bố mẹ, song thân|parents
父|ちち|N5|noun|Bố (của mình)|my father
母|はは|N5|noun|Mẹ (của mình)|my mother
お父さん|おとうさん|N5|noun|Bố (người khác / gọi bố)|father
お母さん|おかあさん|N5|noun|Mẹ (người khác / gọi mẹ)|mother
兄|あに|N5|noun|Anh trai (của mình)|my older brother
姉|あね|N5|noun|Chị gái (của mình)|my older sister
弟|おとうと|N5|noun|Em trai|younger brother
妹|いもうと|N5|noun|Em gái|younger sister
お兄さん|おにいさん|N5|noun|Anh trai|older brother
お姉さん|おねえさん|N5|noun|Chị gái|older sister
兄弟|きょうだい|N5|noun|Anh chị em|siblings; brothers and sisters
姉妹|しまい|N5|noun|Chị em gái|sisters
夫|おっと|N5|noun|Chồng (của mình)|my husband
主人|しゅじん|N5|noun|Chồng (của mình)|my husband; master
妻|つま|N5|noun|Vợ (của mình)|my wife
奥さん|おくさん|N5|noun|Vợ (người khác)|wife (someone else's)
おじいさん|おじいさん|N5|noun|Ông, cụ ông|grandfather; old man
おばあさん|おばあさん|N5|noun|Bà, cụ bà|grandmother; old woman
伯父さん|おじさん|N5|noun|Bác trai, chú, cậu|uncle; middle-aged man
伯母さん|おばさん|N5|noun|Bác gái, cô, dì, mợ|aunt; middle-aged woman
先生|せんせい|N5|noun|Giáo viên, thầy/cô, bác sĩ|teacher; doctor; master
学生|がくせい|N5|noun|Học sinh, sinh viên|student
留学生|りゅうがくせい|N5|noun|Du học sinh|international student
生徒|せいと|N5|noun|Học sinh|pupil; student
会社員|かいしゃいん|N5|noun|Nhân viên công ty|company employee
社員|しゃいん|N5|noun|Nhân viên công ty|company member
銀行員|ぎんこういん|N5|noun|Nhân viên ngân hàng|bank clerk
医者|いしゃ|N5|noun|Bác sĩ|doctor; physician
警官|けいかん|N5|noun|Cảnh sát|police officer
お巡りさん|おまわりさん|N5|noun|Chú cảnh sát|police officer (friendly)
外国人|がいこくじん|N5|noun|Người nước ngoài|foreigner
日本人|にほんじん|N5|noun|Người Nhật|Japanese person
自分|じぶん|N5|pronoun|Bản thân mình|oneself
誰|だれ|N5|pronoun|Ai|who
どなた|どなた|N5|pronoun|Vị nào (lịch sự của 誰)|who (polite)
体|からだ|N5|noun|Cơ thể, sức khỏe|body; health
頭|あたま|N5|noun|Đầu, trí óc|head; mind
髪|かみ|N5|noun|Tóc|hair
顔|かお|N5|noun|Khuôn mặt|face
目|め|N5|noun|Mắt|eye
耳|みみ|N5|noun|Tai|ear
鼻|はな|N5|noun|Mũi|nose
口|くち|N5|noun|Miệng|mouth
歯|は|N5|noun|Răng|tooth; teeth
首|くび|N5|noun|Cổ|neck
肩|かた|N5|noun|Vai|shoulder
胸|むね|N5|noun|Ngực|chest; breast
お腹|おなか|N5|noun|Bụng|stomach; belly
背|せ|N5|noun|Lưng, chiều cao|back; height; stature
手|て|N5|noun|Tay, bàn tay|hand
指|ゆび|N5|noun|Ngón tay, ngón chân|finger; toe
足|あし|N5|noun|Chân, bàn chân|foot; leg
声|こえ|N5|noun|Giọng nói|voice
病気|びょうき|N5|noun|Bệnh tật, ốm|illness; sickness
風邪|かぜ|N5|noun|Cảm cúm, cảm lạnh|common cold
熱|ねつ|N5|noun|Sốt, nhiệt độ|fever; heat
薬|くすり|N5|noun|Thuốc|medicine
元気|げんき|N5|na-adjective|Khỏe mạnh, tràn đầy năng lượng|healthy; energetic; lively
学校|がっこう|N5|noun|Trường học|school
小学校|しょうがっこう|N5|noun|Trường tiểu học|elementary school
中学校|ちゅうがっこう|N5|noun|Trường trung học cơ sở|junior high school
高校|こうこう|N5|noun|Trường trung học phổ thông|high school
大学|だいがく|N5|noun|Trường đại học|university; college
教室|きょうしつ|N5|noun|Phòng học, lớp học|classroom
図書館|としょかん|N5|noun|Thư viện|library
食堂|しょくどう|N5|noun|Nhà ăn, căng tin|cafeteria; dining hall
事務所|じむしょ|N5|noun|Văn phòng|office
受付|うけつけ|N5|noun|Quầy lễ tân|reception desk
部屋|へや|N5|noun|Căn phòng|room
庭|にわ|N5|noun|Sân vườn|garden; yard
玄関|げんかん|N5|noun|Lối vào nhà, tiền sảnh|entranceway; foyer
廊下|ろうか|N5|noun|Hành lang|corridor; hallway
階段|かいだん|N5|noun|Cầu thang|stairs; stairway
台所|だいどころ|N5|noun|Nhà bếp|kitchen
お風呂|おふろ|N5|noun|Bồn tắm, phòng tắm|bath; bathroom
お手洗い|おてあらい|N5|noun|Nhà vệ sinh|restroom; washroom
トイレ|トイレ|N5|noun|Nhà vệ sinh|toilet; restroom
家|いえ|N5|noun|Ngôi nhà|house; home
うち|うち|N5|noun|Nhà mình, gia đình mình|home; my house
アパート|アパート|N5|noun|Căn hộ chung cư nhỏ|apartment
ホテル|ホテル|N5|noun|Khách sạn|hotel
会社|かいしゃ|N5|noun|Công ty|company; corporation
銀行|ぎんこう|N5|noun|Ngân hàng|bank
郵便局|ゆうびんきょく|N5|noun|Bưu điện|post office
病院|びょういん|N5|noun|Bệnh viện|hospital
店|みせ|N5|noun|Cửa hàng, tiệm|shop; store
レストラン|レストラン|N5|noun|Nhà hàng|restaurant
喫茶店|きっさてん|N5|noun|Quán cà phê, quán giải khát|coffee shop; tearoom
スーパー|スーパー|N5|noun|Siêu thị|supermarket
デパート|デパート|N5|noun|Trung tâm thương mại|department store
本屋|ほんや|N5|noun|Hiệu sách|bookstore
花屋|はなや|N5|noun|Tiệm hoa|flower shop
八百屋|やおや|N5|noun|Cửa hàng rau củ quả|greengrocer
肉屋|にくや|N5|noun|Cửa hàng thịt|butcher shop
魚屋|さかなや|N5|noun|Cửa hàng cá|fish shop
薬局|やっきょく|N5|noun|Hiệu thuốc|pharmacy; drugstore
映画館|えいがかん|N5|noun|Rạp chiếu phim|movie theater; cinema
美術館|びじゅつかん|N5|noun|Bảo tàng mỹ thuật|art museum
博物館|はくぶつかん|N5|noun|Viện bảo tàng|museum
公園|こうえん|N5|noun|Công viên|park
動物園|どうぶつえん|N5|noun|Sở thú|zoo
プール|プール|N5|noun|Hồ bơi|swimming pool
大使館|たいしかん|N5|noun|Đại sứ quán|embassy
交番|こうばん|N5|noun|Đồn cảnh sát khu vực|police box
お寺|おてら|N5|noun|Ngôi chùa|Buddhist temple
神社|じんじゃ|N5|noun|Đền Thần đạo|Shinto shrine
駅|えき|N5|noun|Nhà ga|train station
空港|くうこう|N5|noun|Sân bay|airport
道|みち|N5|noun|Con đường|road; street; way
角|かど|N5|noun|Góc đường, góc|corner
橋|はし|N5|noun|Cây cầu|bridge
交差点|こうさてん|N5|noun|Ngã tư, giao lộ|intersection; crossing
信号|しんごう|N5|noun|Đèn tín hiệu giao thông|traffic light; signal
入口|いりぐち|N5|noun|Lối vào, cửa vào|entrance
出口|でぐち|N5|noun|Lối ra, cửa ra|exit
エレベーター|エレベーター|N5|noun|Thang máy|elevator
エスカレーター|エスカレーター|N5|noun|Thang cuốn|escalator
建物|たてもの|N5|noun|Tòa nhà, công trình|building
場所|ばしょ|N5|noun|Địa điểm, nơi chốn|place; location
国|くに|N5|noun|Đất nước, quê hương|country; hometown
外国|がいこく|N5|noun|Nước ngoài|foreign country
日本|にほん|N5|noun|Nhật Bản|Japan
東京|とうきょう|N5|noun|Thủ đô Tokyo|Tokyo
町|まち|N5|noun|Thị trấn, phố phường|town; street
村|むら|N5|noun|Ngôi làng|village
電車|でんしゃ|N5|noun|Tàu điện|electric train
地下鉄|ちかてつ|N5|noun|Tàu điện ngầm|subway; underground train
新幹線|しんかんせん|N5|noun|Tàu cao tốc Shinkansen|bullet train (Shinkansen)
汽車|きしゃ|N5|noun|Tàu hỏa hơi nước|steam train
バス|バス|N5|noun|Xe buýt|bus
タクシー|タクシー|N5|noun|Xe taxi|taxi
車|くるま|N5|noun|Xe hơi, ô tô|car; vehicle
自動車|じどうしゃ|N5|noun|Ô tô|automobile; car
自転車|じてんしゃ|N5|noun|Xe đạp|bicycle
バイク|バイク|N5|noun|Xe máy|motorcycle
飛行機|ひこうき|N5|noun|Máy bay|airplane
船|ふね|N5|noun|Tàu thủy, thuyền|ship; boat
切符|きっぷ|N5|noun|Vé (tàu, xe)|ticket
荷物|にもつ|N5|noun|Hành lý, đồ đạc|luggage; baggage
旅行|りょこう|N5|noun,suru-verb|Du lịch, chuyến đi|travel; trip
散歩|さんぽ|N5|noun,suru-verb|Đi dạo|walk; stroll
今|いま|N5|noun|Bây giờ|now
今日|きょう|N5|noun|Hôm nay|today
明日|あした|N5|noun|Ngày mai|tomorrow
昨日|きのう|N5|noun|Hôm qua|yesterday
明後日|あさって|N5|noun|Ngày kia, ngày mốt|day after tomorrow
一昨日|おととい|N5|noun|Hôm kia|day before yesterday
朝|あさ|N5|noun|Buổi sáng|morning
昼|ひる|N5|noun|Buổi trưa|noon; daytime
夕方|ゆうがた|N5|noun|Buổi chiều tà|evening; dusk
晩|ばん|N5|noun|Buổi tối|evening; night
夜|よる|N5|noun|Ban đêm, buổi tối|night
今朝|けさ|N5|noun|Sáng nay|this morning
今晩|こんばん|N5|noun|Tối nay|tonight; this evening
夕べ|ゆうべ|N5|noun|Tối hôm qua|last night
毎日|まいにち|N5|noun|Mỗi ngày, hằng ngày|every day
毎朝|まいあさ|N5|noun|Mỗi sáng|every morning
毎晩|まいばん|N5|noun|Mỗi tối|every night
毎週|まいしゅう|N5|noun|Mỗi tuần|every week
毎月|まいつき|N5|noun|Mỗi tháng|every month
毎年|まいとし|N5|noun|Mỗi năm|every year
今週|こんしゅう|N5|noun|Tuần này|this week
来週|らいしゅう|N5|noun|Tuần sau|next week
先週|せんしゅう|N5|noun|Tuần trước|last week
再来週|さらいしゅう|N5|noun|Tuần sau nữa|week after next
今月|こんげつ|N5|noun|Tháng này|this month
来月|らいげつ|N5|noun|Tháng sau|next month
先月|せんげつ|N5|noun|Tháng trước|last month
今年|ことし|N5|noun|Năm nay|this year
来年|らいねん|N5|noun|Năm sau|next year
去年|きょねん|N5|noun|Năm ngoái|last year
一昨年|おととし|N5|noun|Năm kia|year before last
時間|じかん|N5|noun|Thời gian, tiếng đồng hồ|time; hour
午前|ごぜん|N5|noun|Buổi sáng (AM)|morning; a.m.
午後|ごご|N5|noun|Buổi chiều (PM)|afternoon; p.m.
半分|はんぶん|N5|noun|Một nửa|half
月曜日|げつようび|N5|noun|Thứ Hai|Monday
火曜日|かようび|N5|noun|Thứ Ba|Tuesday
水曜日|すいようび|N5|noun|Thứ Tư|Wednesday
木曜日|もくようび|N5|noun|Thứ Năm|Thursday
金曜日|きんようび|N5|noun|Thứ Sáu|Friday
土曜日|どようび|N5|noun|Thứ Bảy|Saturday
日曜日|にちようび|N5|noun|Chủ nhật|Sunday
何曜日|なんようび|N5|noun|Thứ mấy|what day of the week
週末|しゅうまつ|N5|noun|Cuối tuần|weekend
休み|やすみ|N5|noun|Ngày nghỉ, kỳ nghỉ|holiday; break; rest
夏休み|なつやすみ|N5|noun|Kỳ nghỉ hè|summer vacation
誕生日|たんじょうび|N5|noun|Ngày sinh nhật|birthday
お正月|おしょうがつ|N5|noun|Tết Nguyên đán / Năm mới|New Year
春|はる|N5|noun|Mùa xuân|spring
夏|なつ|N5|noun|Mùa hè|summer
秋|あき|N5|noun|Mùa thu|autumn; fall
冬|ふゆ|N5|noun|Mùa đông|winter
季節|きせつ|N5|noun|Mùa (trong năm)|season
天気|てんき|N5|noun|Thời tiết|weather
晴れ|はれ|N5|noun|Trời nắng, quang đãng|clear weather; sunny
曇り|くもり|N5|noun|Trời nhiều mây, âm u|cloudy weather
雨|あめ|N5|noun|Mưa|rain
雪|ゆき|N5|noun|Tuyết|snow
風|かぜ|N5|noun|Gió|wind; breeze
空|そら|N5|noun|Bầu trời|sky
山|やま|N5|noun|Núi|mountain
川|かわ|N5|noun|Sông|river
海|うみ|N5|noun|Biển|sea; ocean
池|いけ|N5|noun|Cái ao|pond
木|き|N5|noun|Cây, gỗ|tree; wood
花|はな|N5|noun|Hoa|flower
動物|どうぶつ|N5|noun|Động vật|animal
犬|いぬ|N5|noun|Con chó|dog
猫|ねこ|N5|noun|Con mèo|cat
鳥|とり|N5|noun|Con chim|bird
魚|さかな|N5|noun|Con cá|fish
ご飯|ごはん|N5|noun|Cơm, bữa ăn|cooked rice; meal
朝ご飯|あさごはん|N5|noun|Bữa sáng|breakfast
昼ご飯|ひるごはん|N5|noun|Bữa trưa|lunch
晩ご飯|ばんごはん|N5|noun|Bữa tối|dinner; supper
お弁当|おべんとう|N5|noun|Cơm hộp|boxed lunch (bento)
料理|りょうり|N5|noun,suru-verb|Món ăn, nấu ăn|cooking; dish; cuisine
食べ物|たべもの|N5|noun|Đồ ăn, thức ăn|food
飲み物|のみもの|N5|noun|Đồ uống, thức uống|drink; beverage
パン|パン|N5|noun|Bánh mì|bread
肉|にく|N5|noun|Thịt|meat
牛肉|ぎゅうにく|N5|noun|Thịt bò|beef
豚肉|ぶたにく|N5|noun|Thịt lợn (heo)|pork
鶏肉|とりにく|N5|noun|Thịt gà|chicken meat
卵|たまご|N5|noun|Trứng|egg
野菜|やさい|N5|noun|Rau củ|vegetable
果物|くだもの|N5|noun|Trái cây, hoa quả|fruit
りんご|りんご|N5|noun|Quả táo|apple
みかん|みかん|N5|noun|Quả quýt|mandarin orange
バナナ|バナナ|N5|noun|Quả chuối|banana
いちご|いちご|N5|noun|Quả dâu tây|strawberry
お菓子|おかし|N5|noun|Bánh kẹo|sweets; snacks; candy
ケーキ|ケーキ|N5|noun|Bánh kem, bánh ngọt|cake
飴|あめ|N5|noun|Kẹo|candy; sweets
砂糖|さとう|N5|noun|Đường|sugar
塩|しお|N5|noun|Muối|salt
醤油|しょうゆ|N5|noun|Nước tương (xì dầu)|soy sauce
カレー|カレー|N5|noun|Món cà ri|curry
ラーメン|ラーメン|N5|noun|Mì Ramen|ramen noodles
うどん|うどん|N5|noun|Mì Udon|udon noodles
そば|そば|N5|noun|Mì Soba / Bên cạnh|soba noodles; near
水|みず|N5|noun|Nước (lạnh)|water
お湯|おゆ|N5|noun|Nước nóng|hot water
お茶|おちゃ|N5|noun|Trà, trà xanh|tea; green tea
紅茶|こうちゃ|N5|noun|Hồng trà, trà đen|black tea
牛乳|ぎゅうにゅう|N5|noun|Sữa bò|milk
ミルク|ミルク|N5|noun|Sữa|milk
コーヒー|コーヒー|N5|noun|Cà phê|coffee
ジュース|ジュース|N5|noun|Nước ép trái cây, nước ngọt|juice; soft drink
お酒|おさけ|N5|noun|Rượu, đồ uống có cồn|alcohol; sake
ビール|ビール|N5|noun|Bia|beer
ワイン|ワイン|N5|noun|Rượu vang|wine
本|ほん|N5|noun|Sách|book
辞書|じしょ|N5|noun|Từ điển|dictionary
雑誌|ざっし|N5|noun|Tạp chí|magazine
新聞|しんぶん|N5|noun|Báo chí|newspaper
ノート|ノート|N5|noun|Vở ghi chép|notebook
手帳|てちょう|N5|noun|Sổ tay nhỏ|pocket notebook; planner
紙|かみ|N5|noun|Giấy|paper
手紙|てがみ|N5|noun|Bức thư|letter
葉書|はがき|N5|noun|Bưu thiếp|postcard
切手|きって|N5|noun|Con tem|postage stamp
封筒|ふうとう|N5|noun|Phong bì|envelope
鉛筆|えんぴつ|N5|noun|Bút chì|pencil
ボールペン|ボールペン|N5|noun|Bút bi|ballpoint pen
万年筆|まんねんひつ|N5|noun|Bút máy|fountain pen
消しゴム|けしゴム|N5|noun|Cục tẩy, gôm|eraser
机|つくえ|N5|noun|Cái bàn|desk
椅子|いす|N5|noun|Cái ghế|chair
テーブル|テーブル|N5|noun|Bàn ăn, bàn tròn|table
ベッド|ベッド|N5|noun|Giường ngủ|bed
窓|まど|N5|noun|Cửa sổ|window
ドア|ドア|N5|noun|Cửa ra vào|door
鍵|かぎ|N5|noun|Chìa khóa, ổ khóa|key; lock
時計|とけい|N5|noun|Đồng hồ|clock; watch
カレンダー|カレンダー|N5|noun|Lịch|calendar
傘|かさ|N5|noun|Cái ô, cái dù|umbrella
鞄|かばん|N5|noun|Cặp sách, túi xách|bag; briefcase
財布|さいふ|N5|noun|Ví tiền|wallet; purse
お金|おかね|N5|noun|Tiền bạc|money
電話|でんわ|N5|noun,suru-verb|Điện thoại, gọi điện|telephone; phone call
携帯電話|けいたいでんわ|N5|noun|Điện thoại di động|mobile phone
パソコン|パソコン|N5|noun|Máy tính cá nhân|personal computer
カメラ|カメラ|N5|noun|Máy ảnh|camera
写真|しゃしん|N5|noun|Bức ảnh|photograph; photo
テレビ|テレビ|N5|noun|Tivi|television; TV
ラジオ|ラジオ|N5|noun|Đài radio|radio
電気|でんき|N5|noun|Điện, đèn điện|electricity; electric light
エアコン|エアコン|N5|noun|Máy điều hòa|air conditioner
冷蔵庫|れいぞうこ|N5|noun|Tủ lạnh|refrigerator
洗濯機|せんたくき|N5|noun|Máy giặt|washing machine
掃除機|そうじき|N5|noun|Máy hút bụi|vacuum cleaner
皿|さら|N5|noun|Cái đĩa|plate; dish
茶碗|ちゃわん|N5|noun|Bát ăn cơm, chén trà|rice bowl; teacup
コップ|コップ|N5|noun|Cái cốc, cái ly|glass; cup
カップ|カップ|N5|noun|Tách (có quai)|cup; mug
箸|はし|N5|noun|Đũa|chopsticks
スプーン|スプーン|N5|noun|Thìa, muỗng|spoon
フォーク|フォーク|N5|noun|Cái nĩa|fork
ナイフ|ナイフ|N5|noun|Con dao|knife
鋏|はさみ|N5|noun|Cái kéo|scissors
箱|はこ|N5|noun|Cái hộp|box; case
石鹸|せっけん|N5|noun|Xà phòng|soap
タオル|タオル|N5|noun|Khăn bông, khăn mặt|towel
歯ブラシ|はブラシ|N5|noun|Bàn chải đánh răng|toothbrush
服|ふく|N5|noun|Quần áo|clothes
洋服|ようふく|N5|noun|Âu phục, quần áo hiện đại|Western-style clothes
着物|きもの|N5|noun|Kimono, trang phục truyền thống|kimono; clothing
シャツ|シャツ|N5|noun|Áo sơ mi|shirt
Tシャツ|ティーシャツ|N5|noun|Áo phông, áo thun|T-shirt
セーター|セーター|N5|noun|Áo len|sweater
コート|コート|N5|noun|Áo khoác dài|coat
上着|うわぎ|N5|noun|Áo khoác ngoài|jacket; outerwear
ズボン|ズボン|N5|noun|Quần dài|trousers; pants
スカート|スカート|N5|noun|Chân váy|skirt
靴|くつ|N5|noun|Giày|shoes
靴下|くつした|N5|noun|Tất, vớ|socks
スリッパ|スリッパ|N5|noun|Dép đi trong nhà|slippers
帽子|ぼうし|N5|noun|Cái mũ, cái nón|hat; cap
眼鏡|めがね|N5|noun|Kính mắt|eyeglasses
ネクタイ|ネクタイ|N5|noun|Cà vạt|necktie
ポケット|ポケット|N5|noun|Túi áo, túi quần|pocket
ボタン|ボタン|N5|noun|Cúc áo, nút bấm|button
ハンカチ|ハンカチ|N5|noun|Khăn tay|handkerchief
日本語|にほんご|N5|noun|Tiếng Nhật|Japanese language
英語|えいご|N5|noun|Tiếng Anh|English language
言葉|ことば|N5|noun|Từ ngữ, ngôn ngữ, lời nói|word; language
漢字|かんじ|N5|noun|Chữ Hán (Kanji)|Kanji; Chinese character
ひらがな|ひらがな|N5|noun|Chữ Hiragana|Hiragana
カタカナ|カタカナ|N5|noun|Chữ Katakana|Katakana
ローマ字|ローマじ|N5|noun|Chữ Romaji (chữ Latinh)|Roman alphabet (Romaji)
字|じ|N5|noun|Chữ viết|character; handwriting
文|ぶん|N5|noun|Câu văn|sentence
作文|さくぶん|N5|noun|Bài văn, viết văn|composition; essay
意味|いみ|N5|noun|Ý nghĩa|meaning; significance
質問|しつもん|N5|noun,suru-verb|Câu hỏi, đặt câu hỏi|question; inquiry
問題|もんだい|N5|noun|Vấn đề, câu hỏi bài tập|problem; question
答え|こたえ|N5|noun|Câu trả lời, đáp án|answer; reply
宿題|しゅくだい|N5|noun|Bài tập về nhà|homework
テスト|テスト|N5|noun|Bài kiểm tra|test; quiz
試験|しけん|N5|noun|Kỳ thi|examination; exam
授業|じゅぎょう|N5|noun|Giờ học, tiết học|class; lesson
勉強|べんきょう|N5|noun,suru-verb|Học tập|study
練習|れんしゅう|N5|noun,suru-verb|Luyện tập|practice
仕事|しごと|N5|noun,suru-verb|Công việc, nghề nghiệp|work; job
買い物|かいもの|N5|noun,suru-verb|Mua sắm|shopping
掃除|そうじ|N5|noun,suru-verb|Dọn dẹp, quét dọn|cleaning
洗濯|せんたく|N5|noun,suru-verb|Giặt giũ|laundry; washing
食事|しょくじ|N5|noun,suru-verb|Bữa ăn, dùng bữa|meal; dining
結婚|けっこん|N5|noun,suru-verb|Kết hôn, đám cưới|marriage
電話|でんわ|N5|noun,suru-verb|Gọi điện thoại|phone call
名前|なまえ|N5|noun|Tên|name
番号|ばんごう|N5|noun|Số, số hiệu|number
電話番号|でんわばんごう|N5|noun|Số điện thoại|phone number
住所|じゅうしょ|N5|noun|Địa chỉ|address
地図|ちず|N5|noun|Bản đồ|map
映画|えいが|N5|noun|Bộ phim, điện ảnh|movie; film
音楽|おんがく|N5|noun|Âm nhạc|music
歌|うた|N5|noun|Bài hát|song
絵|え|N5|noun|Bức tranh|picture; drawing; painting
スポーツ|スポーツ|N5|noun|Thể thao|sports
サッカー|サッカー|N5|noun|Bóng đá|soccer; football
野球|やきゅう|N5|noun|Bóng chày|baseball
テニス|テニス|N5|noun|Quần vợt (Tennis)|tennis
水泳|すいえい|N5|noun|Bơi lội|swimming
ギター|ギター|N5|noun|Đàn ghi-ta|guitar
ピアノ|ピアノ|N5|noun|Đàn dương cầm (Piano)|piano
ニュース|ニュース|N5|noun|Tin tức, thời sự|news
パーティー|パーティー|N5|noun|Bữa tiệc|party
お土産|おみやげ|N5|noun|Quà lưu niệm|souvenir; gift
プレゼント|プレゼント|N5|noun|Món quà|present; gift
色|いろ|N5|noun|Màu sắc|color
赤|あか|N5|noun|Màu đỏ|red
青|あお|N5|noun|Màu xanh dương|blue
白|しろ|N5|noun|Màu trắng|white
黒|くろ|N5|noun|Màu đen|black
黄色|きいろ|N5|noun|Màu vàng|yellow
茶色|ちゃいろ|N5|noun|Màu nâu|brown
緑|みどり|N5|noun|Màu xanh lá cây|green
上|うえ|N5|noun|Phía trên, ở trên|above; on top of
下|した|N5|noun|Phía dưới, ở dưới|below; under
前|まえ|N5|noun|Phía trước, trước đây|in front of; before
後ろ|うしろ|N5|noun|Phía sau, đằng sau|behind; back
右|みぎ|N5|noun|Bên phải|right
左|ひだり|N5|noun|Bên trái|left
中|なか|N5|noun|Bên trong, ở giữa|inside; middle
外|そと|N5|noun|Bên ngoài|outside
隣|となり|N5|noun|Bên cạnh, sát vách|next to; neighbor
近く|ちかく|N5|noun|Gần, vùng lân cận|near; neighborhood
間|あいだ|N5|noun|Ở giữa, khoảng cách|between; among
横|よこ|N5|noun|Bên cạnh, chiều ngang|beside; side; width
東|ひがし|N5|noun|Phía Đông|east
西|にし|N5|noun|Phía Tây|west
南|みなみ|N5|noun|Phía Nam|south
北|きた|N5|noun|Phía Bắc|north
行く|いく|N5|verb|Đi|to go
来る|くる|N5|verb|Đến|to come
帰る|かえる|N5|verb|Trở về, về nhà|to return; to go home
出る|でる|N5|verb|Đi ra, rời khỏi, xuất hiện|to leave; to exit; to attend
出かける|でかける|N5|verb|Ra ngoài, đi chơi|to go out
入る|はいる|N5|verb|Đi vào, bước vào|to enter; to go in
入れる|いれる|N5|verb|Cho vào, bỏ vào, pha (trà/cà phê)|to put in; to insert; to make tea
出す|だす|N5|verb|Lấy ra, nộp, gửi (thư)|to take out; to hand in; to send
乗る|のる|N5|verb|Lên (tàu, xe)|to get on; to ride
降りる|おりる|N5|verb|Xuống (tàu, xe)|to get off; to descend
歩く|あるく|N5|verb|Đi bộ|to walk
走る|はしる|N5|verb|Chạy|to run
泳ぐ|およぐ|N5|verb|Bơi|to swim
飛ぶ|とぶ|N5|verb|Bay|to fly; to jump
登る|のぼる|N5|verb|Leo (núi), trèo lên|to climb
渡る|わたる|N5|verb|Băng qua (cầu, đường)|to cross over
曲がる|まがる|N5|verb|Rẽ, quẹo|to turn; to bend
止まる|とまる|N5|verb|Dừng lại|to stop; to halt
立つ|たつ|N5|verb|Đứng lên|to stand
座る|すわる|N5|verb|Ngồi xuống|to sit
起きる|おきる|N5|verb|Thức dậy|to wake up; to get up
寝る|ねる|N5|verb|Ngủ, đi ngủ|to sleep; to go to bed
休む|やすむ|N5|verb|Nghỉ ngơi, nghỉ học/làm|to rest; to take a day off
働く|はたらく|N5|verb|Làm việc, lao động|to work
始まる|はじまる|N5|verb|Bắt đầu (tự động từ)|to begin; to start
終わる|おわる|N5|verb|Kết thúc, xong|to end; to finish
食べる|たべる|N5|verb|Ăn|to eat
飲む|のむ|N5|verb|Uống|to drink
吸う|すう|N5|verb|Hút (thuốc), hít vào|to smoke; to breathe in
見る|みる|N5|verb|Nhìn, xem, khám|to see; to look; to watch
見せる|みせる|N5|verb|Cho xem, đưa ra|to show
聞く|きく|N5|verb|Nghe, hỏi|to listen; to hear; to ask
読む|よむ|N5|verb|Đọc|to read
書く|かく|N5|verb|Viết, vẽ|to write; to draw
話す|はなす|N5|verb|Nói chuyện, kể|to speak; to talk
言う|いう|N5|verb|Nói, bảo rằng|to say; to tell
買う|かう|N5|verb|Mua|to buy
売る|うる|N5|verb|Bán|to sell
払う|はらう|N5|verb|Trả tiền, thanh toán|to pay
作る|つくる|N5|verb|Làm, chế tạo, nấu|to make; to cook; to produce
使う|つかう|N5|verb|Sử dụng, dùng|to use
持つ|もつ|N5|verb|Cầm, nắm, mang, có|to hold; to carry; to possess
持っていく|もっていく|N5|verb|Mang đi|to take along
持ってくる|もってくる|N5|verb|Mang đến|to bring
取る|とる|N5|verb|Lấy, cầm, chụp (ảnh)|to take; to pass; to take a photo
撮る|とる|N5|verb|Chụp (ảnh), quay (phim)|to take a photo; to film
待つ|まつ|N5|verb|Chờ, đợi|to wait
会う|あう|N5|verb|Gặp gỡ|to meet
遊ぶ|あそぶ|N5|verb|Chơi, đi chơi|to play; to hang out
習う|ならう|N5|verb|Học (từ thầy cô)|to learn; to take lessons
教える|おしえる|N5|verb|Dạy, chỉ bảo, cho biết|to teach; to tell
覚える|おぼえる|N5|verb|Nhớ, ghi nhớ|to memorize; to remember
忘れる|わすれる|N5|verb|Quên|to forget
知る|しる|N5|verb|Biết, quen biết|to know; to get to know
分かる|わかる|N5|verb|Hiểu, nắm được|to understand
考える|かんがえる|N5|verb|Suy nghĩ, cân nhắc|to think; to consider
思う|おもう|N5|verb|Nghĩ rằng, cảm thấy|to think; to feel
貸す|かす|N5|verb|Cho mượn, cho vay|to lend; to rent out
借りる|かりる|N5|verb|Mượn, vay|to borrow; to rent
返す|かえす|N5|verb|Trả lại|to return something
あげる|あげる|N5|verb|Tặng, cho|to give
もらう|もらう|N5|verb|Nhận được|to receive
くれる|くれる|N5|verb|Cho (tôi)|to give (to me)
送る|おくる|N5|verb|Gửi (đồ/thư), tiễn|to send; to see someone off
切る|きる|N5|verb|Cắt, tắt (công tắc)|to cut; to turn off
開ける|あける|N5|verb|Mở (cửa, hộp)|to open
閉める|しめる|N5|verb|Đóng (cửa)|to close; to shut
開く|あく|N5|verb|Mở ra (tự động từ)|to be open
閉まる|しまる|N5|verb|Đóng lại (tự động từ)|to be closed
つける|つける|N5|verb|Bật (đèn, điện)|to turn on; to attach
消す|けす|N5|verb|Tắt (đèn), xóa|to turn off; to erase
消える|きえる|N5|verb|Tắt, biến mất|to go out; to disappear
洗う|あらう|N5|verb|Rửa, giặt|to wash
着る|きる|N5|verb|Mặc (áo trên thắt lưng)|to wear; to put on (upper body)
履く|はく|N5|verb|Đi, mặc (giày, quần, váy)|to wear (lower body: shoes, pants)
かぶる|かぶる|N5|verb|Đội (mũ)|to wear (on head: hat)
かける|かける|N5|verb|Đeo (kính), gọi (điện thoại)|to wear (glasses); to make a call
脱ぐ|ぬぐ|N5|verb|Cởi (quần áo, giày dép)|to take off (clothes, shoes)
住む|すむ|N5|verb|Sống, cư trú|to live; to reside
結婚する|けっこんする|N5|verb|Kết hôn|to get married
生まれる|うまれる|N5|verb|Được sinh ra, chào đời|to be born
死ぬ|しぬ|N5|verb|Chết, mất|to die
歌う|うたう|N5|verb|Hát|to sing
弾く|ひく|N5|verb|Chơi (nhạc cụ dây/phím)|to play (string/keyboard instrument)
吹く|ふく|N5|verb|Thổi (gió, sáo)|to blow; to play wind instrument
降る|ふる|N5|verb|Rơi (mưa, tuyết)|to fall (rain, snow)
晴れる|はれる|N5|verb|Trời nắng lên, quang đãng|to clear up; to be sunny
曇る|くもる|N5|verb|Trời kéo mây, mờ đi|to become cloudy
咲く|さく|N5|verb|Nở (hoa)|to bloom
鳴く|なく|N5|verb|Kêu, hót (chim, thú)|to cry; to sing (animal/bird)
置く|おく|N5|verb|Đặt, để|to put; to place
並べる|ならべる|N5|verb|Xếp hàng, bày biện|to line up; to arrange
並ぶ|ならぶ|N5|verb|Xếp hàng (tự động từ)|to stand in line
貼る|はる|N5|verb|Dán (tem, áp phích)|to stick; to paste
引く|ひく|N5|verb|Kéo, tra (từ điển), bị (cảm)|to pull; to look up; to catch a cold
押す|おす|N5|verb|Ấn, bấm, đẩy|to push; to press
回す|まわす|N5|verb|Vặn, xoay, chuyển tiếp|to turn; to rotate
ارتباط|ある|N5|verb|Có (đồ vật), ở|to exist (inanimate); to have
ある|ある|N5|verb|Có, tồn tại (đồ vật/cây cối)|to be; to exist (inanimate); to have
いる|いる|N5|verb|Có, ở (người/động vật)|to be; to exist (animate)
要る|いる|N5|verb|Cần|to need; to require
かかる|かかる|N5|verb|Tốn, mất (thời gian, tiền bạc)|to take (time or money)
なる|なる|N5|verb|Trở thành, trở nên|to become
する|する|N5|verb|Làm, chơi|to do; to make
勉強する|べんきょうする|N5|verb|Học tập|to study
練習する|れんしゅうする|N5|verb|Luyện tập|to practice
買い物する|かいものする|N5|verb|Mua sắm|to shop
掃除する|そうじする|N5|verb|Dọn dẹp|to clean
洗濯する|せんたくする|N5|verb|Giặt giũ|to do laundry
料理する|りょうりする|N5|verb|Nấu ăn|to cook
散歩する|さんぽする|N5|verb|Đi dạo|to take a walk
旅行する|りょこうする|N5|verb|Đi du lịch|to travel
大きい|おおきい|N5|i-adjective|To, lớn|big; large
小さい|ちいさい|N5|i-adjective|Nhỏ, bé|small; little
新しい|あたらしい|N5|i-adjective|Mới|new; fresh
古い|ふるい|N5|i-adjective|Cũ, cổ kính|old (not for people)
いい|いい|N5|i-adjective|Tốt, hay, đẹp|good; fine; nice
良い|よい|N5|i-adjective|Tốt, đẹp|good; fine
悪い|わるい|N5|i-adjective|Xấu, tồi, có lỗi|bad; poor; sorry
高い|たかい|N5|i-adjective|Cao, đắt tiền|high; tall; expensive
低い|ひくい|N5|i-adjective|Thấp|low; short
安い|やすい|N5|i-adjective|Rẻ|cheap; inexpensive
暑い|あつい|N5|i-adjective|Nóng (thời tiết)|hot (weather)
寒い|さむい|N5|i-adjective|Lạnh (thời tiết)|cold (weather)
熱い|あつい|N5|i-adjective|Nóng (khi chạm vào, đồ ăn/uống)|hot (to the touch)
冷たい|つめたい|N5|i-adjective|Mát lạnh, lạnh lùng|cold (to touch: water, drink)
暖かい|あたたかい|N5|i-adjective|Ấm áp|warm
涼しい|すずしい|N5|i-adjective|Mát mẻ|cool; refreshing
難しい|むずかしい|N5|i-adjective|Khó|difficult; hard
易しい|やさしい|N5|i-adjective|Dễ dàng|easy; simple
優しい|やさしい|N5|i-adjective|Hiền lành, dịu dàng, tốt bụng|kind; gentle
美味しい|おいしい|N5|i-adjective|Ngon|delicious; tasty
不味い|まずい|N5|i-adjective|Dở, không ngon|unappetizing; bad tasting
甘い|あまい|N5|i-adjective|Ngọt|sweet
辛い|からい|N5|i-adjective|Cay|spicy; hot
塩辛い|しおからい|N5|i-adjective|Mặn|salty
酸っぱい|すっぱい|N5|i-adjective|Chua|sour
苦い|にがい|N5|i-adjective|Đắng|bitter
面白い|おもしろい|N5|i-adjective|Thú vị, hay, buồn cười|interesting; funny
つまらない|つまらない|N5|i-adjective|Nhàm chán, tẻ nhạt|boring; dull
楽しい|たのしい|N5|i-adjective|Vui vẻ|fun; enjoyable
嬉しい|うれしい|N5|i-adjective|Vui mừng, hạnh phúc|happy; glad
悲しい|かなしい|N5|i-adjective|Buồn bã|sad; sorrowful
忙しい|いそがしい|N5|i-adjective|Bận rộn|busy
遠い|とおい|N5|i-adjective|Xa|far; distant
近い|ちかい|N5|i-adjective|Gần|near; close
早い|はやい|N5|i-adjective|Sớm, nhanh|early; fast
速い|はやい|N5|i-adjective|Nhanh|fast; quick
遅い|おそい|N5|i-adjective|Muộn, chậm|slow; late
長い|ながい|N5|i-adjective|Dài|long
短い|みじかい|N5|i-adjective|Ngắn|short
広い|ひろい|N5|i-adjective|Rộng rãi|wide; spacious
狭い|せまい|N5|i-adjective|Chật hẹp|narrow; cramped
明るい|あかるい|N5|i-adjective|Sáng sủa, vui tươi|bright; cheerful
暗い|くらい|N5|i-adjective|Tối tăm|dark; gloomy
重い|おもい|N5|i-adjective|Nặng|heavy
軽い|かるい|N5|i-adjective|Nhẹ|light (weight)
太い|ふとい|N5|i-adjective|To, béo, dày|thick; fat
細い|ほそい|N5|i-adjective|Thon, gầy, mảnh|thin; slender
厚い|あつい|N5|i-adjective|Dày|thick
薄い|うすい|N5|i-adjective|Mỏng, nhạt|thin; pale; weak (taste)
強い|つよい|N5|i-adjective|Mạnh mẽ|strong
弱い|よわい|N5|i-adjective|Yếu ớt|weak
痛い|いたい|N5|i-adjective|Đau|painful; sore
欲しい|ほしい|N5|i-adjective|Muốn có|wanted; desired
危ない|あぶない|N5|i-adjective|Nguy hiểm|dangerous
汚い|きたない|N5|i-adjective|Bẩn, lộn xộn|dirty; messy
可愛い|かわいい|N5|i-adjective|Dễ thương, đáng yêu|cute; adorable
若い|わかい|N5|i-adjective|Trẻ tuổi|young
多い|おおい|N5|i-adjective|Nhiều|many; much
少ない|すくない|N5|i-adjective|Ít|few; scarce
丸い|まるい|N5|i-adjective|Tròn|round; circular
白い|しろい|N5|i-adjective|Màu trắng|white
黒い|くろい|N5|i-adjective|Màu đen|black
赤い|あかい|N5|i-adjective|Màu đỏ|red
青い|あおい|N5|i-adjective|Màu xanh dương|blue
黄色い|きいろい|N5|i-adjective|Màu vàng|yellow
静か|しずか|N5|na-adjective|Yên tĩnh|quiet; peaceful
賑やか|にぎやか|N5|na-adjective|Nhộn nhịp, náo nhiệt|lively; bustling
綺麗|きれい|N5|na-adjective|Đẹp, sạch sẽ|pretty; clean; beautiful
有名|ゆうめい|N5|na-adjective|Nổi tiếng|famous
親切|しんせつ|N5|na-adjective|Tốt bụng, thân thiện|kind; helpful
便利|べんり|N5|na-adjective|Tiện lợi|convenient; handy
不便|ふべん|N5|na-adjective|Bất tiện|inconvenient
暇|ひま|N5|na-adjective|Rảnh rỗi|free time; not busy
好き|すき|N5|na-adjective|Thích, yêu thích|liked; favorite
嫌い|きらい|N5|na-adjective|Ghét, không thích|disliked; hated
大好き|だいすき|N5|na-adjective|Rất thích|love; like very much
上手|じょうず|N5|na-adjective|Giỏi, khéo léo|skillful; good at
下手|へた|N5|na-adjective|Kém, vụng về|unskillful; poor at
大切|たいせつ|N5|na-adjective|Quan trọng, trân trọng|important; precious
大変|たいへん|N5|na-adjective|Vất vả, rất|tough; hard; very
大丈夫|だいじょうぶ|N5|na-adjective|Không sao, ổn thỏa|all right; okay; safe
丈夫|じょうぶ|N5|na-adjective|Bền chắc, khỏe mạnh|sturdy; durable; healthy
いろいろ|いろいろ|N5|na-adjective|Nhiều loại, đa dạng|various; all sorts of
同じ|おなじ|N5|noun|Giống nhau, cùng|same; identical
とても|とても|N5|adverb|Rất, lắm|very; exceedingly
たいへん|たいへん|N5|adverb|Rất, vô cùng|very; greatly
少し|すこし|N5|adverb|Một chút, một ít|a little; a bit
ちょっと|ちょっと|N5|adverb|Một chút, hơi|a little; just a moment
たくさん|たくさん|N5|adverb|Nhiều|many; a lot
よく|よく|N5|adverb|Thường xuyên, kỹ, giỏi|often; well
だいたい|だいたい|N5|adverb|Đại khái, hầu hết|mostly; roughly
あまり|あまり|N5|adverb|Không ~ lắm (đi với phủ định)|not very; not much
全然|ぜんぜん|N5|adverb|Hoàn toàn không (đi với phủ định)|not at all
いつも|いつも|N5|adverb|Luôn luôn, lúc nào cũng|always; usually
時々|ときどき|N5|adverb|Thỉnh thoảng|sometimes
もっと|もっと|N5|adverb|Hơn nữa, thêm nữa|more; even more
もう|もう|N5|adverb|Đã ~ rồi, thêm nữa|already; soon; more
まだ|まだ|N5|adverb|Vẫn còn, vẫn chưa|still; not yet
すぐ|すぐ|N5|adverb|Ngay lập tức|immediately; right away
ゆっくり|ゆっくり|N5|adverb|Chậm rãi, thong thả|slowly; leisurely
だんだん|だんだん|N5|adverb|Dần dần|gradually; little by little
まっすぐ|まっすぐ|N5|adverb|Thẳng, đi thẳng|straight ahead
一緒に|いっしょに|N5|adverb|Cùng nhau|together
一人で|ひとりで|N5|adverb|Một mình|alone; by oneself
初めて|はじめて|N5|adverb|Lần đầu tiên|for the first time
本当に|ほんとうに|N5|adverb|Thật sự|really; truly
もちろん|もちろん|N5|adverb|Tất nhiên, dĩ nhiên|of course; certainly
たぶん|たぶん|N5|adverb|Có lẽ, chắc là|probably; maybe
一番|いちばん|N5|adverb|Nhất, số một|best; most; number one
全部|ぜんぶ|N5|noun,adverb|Tất cả, toàn bộ|all; everything
みんな|みんな|N5|noun|Mọi người, tất cả|everyone; all
ほか|ほか|N5|noun|Khác, ngoài ra|other; besides
どうして|どうして|N5|adverb|Tại sao|why; how
どうやって|どうやって|N5|adverb|Bằng cách nào|how; in what way
いくら|いくら|N5|noun|Bao nhiêu tiền|how much
いくつ|いくつ|N5|noun|Mấy cái, bao nhiêu tuổi|how many; how old
いつ|いつ|N5|pronoun|Khi nào, bao giờ|when
どこ|どこ|N5|pronoun|Ở đâu|where
どれ|どれ|N5|pronoun|Cái nào|which one
どの|どの|N5|determiner|Nào (trước danh từ)|which
どんな|どんな|N5|determiner|Như thế nào, loại nào|what kind of
どう|どう|N5|adverb|Thế nào|how; what about
はい|はい|N5|interjection|Vâng, dạ|yes
いいえ|いいえ|N5|interjection|Không|no
おはよう|おはよう|N5|expression|Chào buổi sáng|good morning
こんにちは|こんにちは|N5|expression|Xin chào (ban ngày)|hello; good afternoon
こんばんは|こんばんは|N5|expression|Chào buổi tối|good evening
おやすみなさい|おやすみなさい|N5|expression|Chúc ngủ ngon|good night
ありがとう|ありがとう|N5|expression|Cảm ơn|thank you
すみません|すみません|N5|expression|Xin lỗi, cảm ơn vì đã phiền|excuse me; I'm sorry; thank you
ごめんなさい|ごめんなさい|N5|expression|Xin lỗi|I am sorry
いただきます|いただきます|N5|expression|Mời cả nhà ăn cơm (trước bữa ăn)|thank you for the meal (before eating)
ごちそうさま|ごちそうさま|N5|expression|Cảm ơn vì bữa ăn ngon (sau bữa ăn)|thank you for the meal (after eating)
行ってきます|いってきます|N5|expression|Tôi đi đây (khi ra khỏi nhà)|I'm leaving now
行ってらっしゃい|いってらっしゃい|N5|expression|Bạn đi nhé (tiễn người nhà)|have a good day; see you later
ただいま|ただいま|N5|expression|Tôi đã về rồi đây|I'm home
お帰りなさい|おかえりなさい|N5|expression|Mừng bạn đã về nhà|welcome home
さようなら|さようなら|N5|expression|Tạm biệt|goodbye
お願いします|おねがいします|N5|expression|Xin vui lòng giúp đỡ|please
どうぞ|どうぞ|N5|adverb|Xin mời|please; here you are
どうも|どうも|N5|adverb|Cảm ơn rất nhiều, xin chào|thanks; very
`.trim();

const N4_VOCAB_ROWS = `
約束|やくそく|N4|noun,suru-verb|Lời hứa, cuộc hẹn|promise; appointment
予約|よやく|N4|noun,suru-verb|Đặt chỗ trước, đặt hẹn|reservation; booking
予定|よてい|N4|noun,suru-verb|Dự định, lịch trình|plan; schedule
準備|じゅんび|N4|noun,suru-verb|Chuẩn bị|preparation; setup
用意|ようい|N4|noun,suru-verb|Sửa soạn, chuẩn bị sẵn|preparation; arrangement
経験|けいけん|N4|noun,suru-verb|Kinh nghiệm, trải nghiệm|experience
説明|せつめい|N4|noun,suru-verb|Giải thích, thuyết minh|explanation; description
相談|そうだん|N4|noun,suru-verb|Thảo luận, hỏi ý kiến|consultation; discussion
連絡|れんらく|N4|noun,suru-verb|Liên lạc, thông báo|contact; communication
紹介|しょうかい|N4|noun,suru-verb|Giới thiệu|introduction
案内|あんない|N4|noun,suru-verb|Hướng dẫn, dẫn đường|guidance; information
招待|しょうたい|N4|noun,suru-verb|Mời, chiêu đãi|invitation
注意|ちゅうい|N4|noun,suru-verb|Chú ý, nhắc nhở, cẩn thận|caution; attention; warning
注文|ちゅうもん|N4|noun,suru-verb|Gọi món, đặt hàng|order; request
生活|せいかつ|N4|noun,suru-verb|Cuộc sống, sinh hoạt|daily life; living
文化|ぶんか|N4|noun|Văn hóa|culture
社会|しゃかい|N4|noun|Xã hội|society
政治|せいじ|N4|noun|Chính trị|politics; government
経済|けいざい|N4|noun|Kinh tế|economy; economics
法律|ほうりつ|N4|noun|Pháp luật|law
歴史|れきし|N4|noun|Lịch sử|history
地理|ちり|N4|noun|Địa lý|geography
科学|かがく|N4|noun|Khoa học|science
数学|すうがく|N4|noun|Toán học|mathematics
文学|ぶんがく|N4|noun|Văn học|literature
美術|びじゅつ|N4|noun|Mỹ thuật|fine arts
技術|ぎじゅつ|N4|noun|Kỹ thuật, công nghệ|technology; skill
研究|けんきゅう|N4|noun,suru-verb|Nghiên cứu|research; study
教育|きょういく|N4|noun,suru-verb|Giáo dục|education
入学|にゅうがく|N4|noun,suru-verb|Nhập học|admission to school
卒業|そつぎょう|N4|noun,suru-verb|Tốt nghiệp|graduation
留学|りゅうがく|N4|noun,suru-verb|Du học|studying abroad
予習|よしゅう|N4|noun,suru-verb|Chuẩn bị bài trước khi lên lớp|preparation for a lesson
復習|ふくしゅう|N4|noun,suru-verb|Ôn tập bài cũ|review of lessons
講義|こうぎ|N4|noun,suru-verb|Bài giảng đại học|lecture
会議|かいぎ|N4|noun,suru-verb|Cuộc họp, hội nghị|meeting; conference
発表|はっぴょう|N4|noun,suru-verb|Phát biểu, thuyết trình, công bố|presentation; announcement
放送|ほうそう|N4|noun,suru-verb|Phát sóng, truyền thanh|broadcasting
展覧会|てんらんかい|N4|noun|Triển lãm|exhibition
コンサート|コンサート|N4|noun|Buổi hòa nhạc|concert
試合|しあい|N4|noun,suru-verb|Trận đấu|match; game; competition
競争|きょうそう|N4|noun,suru-verb|Cạnh tranh, thi đua|competition; contest
運動|うんどう|N4|noun,suru-verb|Vận động, tập thể dục|exercise; motion
散歩|さんぽ|N4|noun,suru-verb|Đi dạo|walk; stroll
見物|けんぶつ|N4|noun,suru-verb|Tham quan, ngắm cảnh|sightseeing
観光|かんこう|N4|noun,suru-verb|Du lịch tham quan|sightseeing; tourism
出発|しゅっぱつ|N4|noun,suru-verb|Xuất phát, khởi hành|departure
到着|とうちゃく|N4|noun,suru-verb|Đến nơi, hạ cánh|arrival
帰国|きこく|N4|noun,suru-verb|Về nước|returning to one's home country
引越し|ひっこし|N4|noun,suru-verb|Chuyển nhà|moving house
運転|うんてん|N4|noun,suru-verb|Lái xe, vận hành|driving; operation
故障|こしょう|N4|noun,suru-verb|Hỏng hóc, trục trặc|breakdown; out of order
事故|じこ|N4|noun|Tai nạn, sự cố|accident; incident
火事|かじ|N4|noun|Hỏa hoạn, đám cháy|fire (disaster)
地震|じしん|N4|noun|Động đất|earthquake
台風|たいふう|N4|noun|Bão lớn|typhoon
交通|こうつう|N4|noun|Giao thông|traffic; transportation
駐車場|ちゅうしゃじょう|N4|noun|Bãi đỗ xe|parking lot
飛行場|ひこうじょう|N4|noun|Sân bay|airfield; airport
港|みなと|N4|noun|Bến cảng|harbor; port
急行|きゅうこう|N4|noun|Tàu tốc hành|express train
特急|とっきゅう|N4|noun|Tàu đặc biệt tốc hành|limited express train
乗り換え|のりかえ|N4|noun|Chuyển tàu, đổi chuyến|transfer (trains/buses)
席|せき|N4|noun|Chỗ ngồi, ghế|seat
自由席|じゆうせき|N4|noun|Ghế tự do|non-reserved seat
指定席|していせき|N4|noun|Ghế đặt trước|reserved seat
旅館|りょかん|N4|noun|Nhà trọ truyền thống Nhật Bản|traditional Japanese inn
神社|じんじゃ|N4|noun|Đền Thần đạo|Shinto shrine
教会|きょうかい|N4|noun|Nhà thờ|church
工場|こうじょう|N4|noun|Nhà máy, công xưởng|factory; plant
美術館|びじゅつかん|N4|noun|Bảo tàng mỹ thuật|art gallery; art museum
動物園|どうぶつえん|N4|noun|Vườn bách thú|zoo
受付|うけつけ|N4|noun|Quầy tiếp tân|reception desk
事務所|じむしょ|N4|noun|Văn phòng|office
会議室|かいぎしつ|N4|noun|Phòng họp|conference room
研究室|けんきゅうしつ|N4|noun|Phòng nghiên cứu|laboratory; professor's office
屋上|おくじょう|N4|noun|Sân thượng|rooftop
地下|ちか|N4|noun|Tầng hầm, dưới lòng đất|basement; underground
売り場|うりば|N4|noun|Quầy bán hàng|sales floor; counter
レジ|レジ|N4|noun|Quầy thu ngân|cashier; register
品物|しなもの|N4|noun|Hàng hóa, vật phẩm|goods; article; item
値段|ねだん|N4|noun|Giá cả|price; cost
お釣り|おつり|N4|noun|Tiền thừa, tiền thối lại|change (money)
料金|りょうきん|N4|noun|Phí, cước phí|fee; charge; fare
家賃|やちん|N4|noun|Tiền thuê nhà|rent
給料|きゅうりょう|N4|noun|Tiền lương|salary; wages
貯金|ちょきん|N4|noun,suru-verb|Tiết kiệm tiền, tiền gửi|savings; deposit
アルバイト|アルバイト|N4|noun,suru-verb|Việc làm thêm|part-time job
貿易|ぼうえき|N4|noun,suru-verb|Thương mại quốc tế, mậu dịch|foreign trade
輸出|ゆしゅつ|N4|noun,suru-verb|Xuất khẩu|export
輸入|ゆにゅう|N4|noun,suru-verb|Nhập khẩu|import
生産|せいさん|N4|noun,suru-verb|Sản xuất|production; manufacture
工業|こうぎょう|N4|noun|Công nghiệp|manufacturing industry
農業|のうぎょう|N4|noun|Nông nghiệp|agriculture
産業|さんぎょう|N4|noun|Ngành công nghiệp, sản nghiệp|industry
人口|じんこう|N4|noun|Dân số|population
世界|せかい|N4|noun|Thế giới|the world
国際|こくさい|N4|noun|Quốc tế|international
平和|へいわ|N4|noun,na-adjective|Hòa bình|peace; harmony
自由|じゆう|N4|noun,na-adjective|Tự do|freedom; liberty
規則|きそく|N4|noun|Quy tắc, nội quy|rule; regulation
習慣|しゅうかん|N4|noun|Thói quen, tập quán|habit; custom
趣味|しゅみ|N4|noun|Sở thích|hobby; interest
興味|きょうみ|N4|noun|Hứng thú, sự quan tâm|interest (in something)
意見|いけん|N4|noun|Ý kiến, quan điểm|opinion; view
気持ち|きもち|N4|noun|Cảm giác, tâm trạng|feeling; mood
気分|きぶん|N4|noun|Tâm trạng, thể trạng|feeling; mood; health condition
心|こころ|N4|noun|Trái tim, tấm lòng|heart; mind; spirit
夢|ゆめ|N4|noun|Giấc mơ, ước mơ|dream
将来|しょうらい|N4|noun|Tương lai|future; prospects
目的|もくてき|N4|noun|Mục đích, mục tiêu|purpose; goal; objective
理由|りゆう|N4|noun|Lý do|reason; cause
原因|げんいん|N4|noun|Nguyên nhân|cause; origin; source
結果|けっか|N4|noun|Kết quả|result; consequence
関係|かんけい|N4|noun,suru-verb|Mối quan hệ, liên quan|relationship; connection
場合|ばあい|N4|noun|Trường hợp, tình huống|case; situation
都合|つごう|N4|noun|Sự thuận tiện, hoàn cảnh|circumstances; convenience
機会|きかい|N4|noun|Cơ hội, dịp|chance; opportunity
途中|とちゅう|N4|noun|Giữa đường, đang giữa chừng|on the way; midway
代わり|かわり|N4|noun|Sự thay thế|substitute; replacement
反対|はんたい|N4|noun,suru-verb|Phản đối, trái ngược|opposition; reverse
賛成|さんせい|N4|noun,suru-verb|Tán thành, đồng ý|approval; agreement
成功|せいこう|N4|noun,suru-verb|Thành công|success
失敗|しっぱい|N4|noun,suru-verb|Thất bại, sai sót|failure; mistake
努力|どりょく|N4|noun,suru-verb|Nỗ lực, cố gắng|effort; exertion
我慢|がまん|N4|noun,suru-verb|Kiên nhẫn, chịu đựng|patience; endurance
遠慮|えんりょ|N4|noun,suru-verb|Ngại ngùng, khách sáo, kiềm chế|reserve; restraint; hesitation
心配|しんぱい|N4|noun,na-adjective,suru-verb|Lo lắng, quan tâm|worry; anxiety; care
安心|あんしん|N4|noun,suru-verb|Yên tâm, an tâm|relief; peace of mind
びっくり|びっくり|N4|adverb,suru-verb|Ngạc nhiên, giật mình|to be surprised; amazed
がっかり|がっかり|N4|adverb,suru-verb|Thất vọng, buồn lòng|to be disappointed
挨拶|あいさつ|N4|noun,suru-verb|Chào hỏi|greeting; salutation
お祝い|おいわい|N4|noun,suru-verb|Chúc mừng, quà mừng|celebration; congratulatory gift
お礼|おれい|N4|noun|Lời cảm ơn, quà cảm tạ|thanks; gratitude
お見舞い|おみまい|N4|noun|Thăm người ốm|visiting a sick person
返事|へんじ|N4|noun,suru-verb|Trả lời, hồi âm|reply; answer
会話|かいわ|N4|noun,suru-verb|Hội thoại, trò chuyện|conversation
連絡先|れんらくさき|N4|noun|Địa chỉ liên lạc|contact information
怪我|けが|N4|noun,suru-verb|Vết thương, bị thương|injury; hurt
入院|にゅういん|N4|noun,suru-verb|Nhập viện|hospitalization
退院|たいいん|N4|noun,suru-verb|Xuất viện|discharge from hospital
歯医者|はいしゃ|N4|noun|Nha sĩ, phòng khám răng|dentist
注射|ちゅうしゃ|N4|noun,suru-verb|Tiêm thuốc|injection
健康|けんこう|N4|noun,na-adjective|Sức khỏe, khỏe mạnh|health; healthy
安全|あんぜん|N4|noun,na-adjective|An toàn|safety; safe
危険|きけん|N4|noun,na-adjective|Nguy hiểm|danger; dangerous
必要|ひつよう|N4|noun,na-adjective|Cần thiết, thiết yếu|necessary; essential
大切|たいせつ|N4|na-adjective|Quan trọng, quý giá|important; valuable
大事|だいじ|N4|na-adjective|Quan trọng, cẩn thận|important; serious
特別|とくべつ|N4|na-adjective|Đặc biệt|special; particular
普通|ふつう|N4|noun,na-adjective|Bình thường, tàu thường|normal; ordinary; local train
簡単|かんたん|N4|na-adjective|Đơn giản, dễ dàng|simple; easy
複雑|ふくざつ|N4|na-adjective|Phức tạp, rắc rối|complex; complicated
丁寧|ていねい|N4|na-adjective|Lịch sự, cẩn thận, tỉ mỉ|polite; careful; thorough
真面目|まじめ|N4|na-adjective|Nghiêm túc, chăm chỉ|serious; diligent; honest
熱心|ねっしん|N4|na-adjective|Nhiệt tình, tâm huyết|enthusiastic; eager
立派|りっぱ|N4|na-adjective|Tuyệt vời, đáng ngưỡng mộ, bề thế|splendid; fine; admirable
盛ん|さかん|N4|na-adjective|Thịnh hành, phát đạt, sôi nổi|popular; prosperous; active
無理|むり|N4|noun,na-adjective|Vô lý, quá sức, không thể|unreasonable; impossible; overdoing
無駄|むだ|N4|noun,na-adjective|Lãng phí, vô ích|wasteful; futile
十分|じゅうぶん|N4|na-adjective,adverb|Đầy đủ, dư dả|enough; sufficient; plenty
適当|てきとう|N4|na-adjective|Phù hợp, đại khái|suitable; appropriate
残念|ざんねん|N4|na-adjective|Đáng tiếc, lấy làm tiếc|regrettable; disappointing
不思議|ふしぎ|N4|na-adjective|Kỳ diệu, bí ẩn, lạ lùng|wonderful; mysterious; strange
変|へん|N4|na-adjective|Kỳ lạ, khác thường|strange; weird; odd
急|きゅう|N4|na-adjective|Đột ngột, gấp gáp, dốc|sudden; urgent; steep
邪魔|じゃま|N4|noun,na-adjective,suru-verb|Làm phiền, cản trở|hindrance; intrusion
一生懸命|いっしょうけんめい|N4|na-adjective,adverb|Cố gắng hết sức mình|with utmost effort; as hard as one can
嬉しい|うれしい|N4|i-adjective|Vui mừng, hạnh phúc|happy; glad
悲しい|かなしい|N4|i-adjective|Buồn bã|sad
寂しい|さびしい|N4|i-adjective|Cô đơn, buồn tẻ|lonely; lonesome
怖い|こわい|N4|i-adjective|Đáng sợ, sợ hãi|scary; afraid
恥ずかしい|はずかしい|N4|i-adjective|Xấu hổ, ngại ngùng|embarrassed; shy
羨ましい|うらやましい|N4|i-adjective|Ghen tị, ngưỡng mộ|envious; jealous
懐かしい|なつかしい|N4|i-adjective|Hoài niệm, thân thương|nostalgic; missed
眠い|ねむい|N4|i-adjective|Buồn ngủ|sleepy; drowsy
痒い|かゆい|N4|i-adjective|Ngứa|itchy
苦い|にがい|N4|i-adjective|Đắng|bitter
甘い|あまい|N4|i-adjective|Ngọt, chiều chuộng|sweet; lenient
辛い|つらい|N4|i-adjective|Cay đắng, khổ sở, vất vả|painful; tough; hard
厳しい|きびしい|N4|i-adjective|Nghiêm khắc, khắc nghiệt|strict; severe
優しい|やさしい|N4|i-adjective|Hiền hậu, dịu dàng|gentle; kind
正しい|ただしい|N4|i-adjective|Đúng đắn, chính xác|correct; right
詳しい|くわしい|N4|i-adjective|Chi tiết, am hiểu tường tận|detailed; knowledgeable
細かい|こまかい|N4|i-adjective|Nhỏ nhặt, chi tiết, tiền lẻ|small; fine; detailed
深い|ふかい|N4|i-adjective|Sâu, sâu sắc|deep; profound
浅い|あさい|N4|i-adjective|Nông, cạn|shallow; superficial
固い|かたい|N4|i-adjective|Cứng, chắc|hard; solid; stiff
柔らかい|やわらかい|N4|i-adjective|Mềm mại|soft; tender
濃い|こい|N4|i-adjective|Đậm (màu, vị, cà phê)|dark; thick; strong (taste)
薄い|うすい|N4|i-adjective|Nhạt, mỏng|thin; pale; light
うるさい|うるさい|N4|i-adjective|Ồn ào, phiền phức|noisy; loud; fussy
素晴らしい|すばらしい|N4|i-adjective|Tuyệt vời, xuất sắc|wonderful; splendid
凄い|すごい|N4|i-adjective|Tuyệt đỉnh, ghê gớm|amazing; great; terrible
ひどい|ひどい|N4|i-adjective|Tồi tệ, quá đáng, dữ dội|terrible; awful; cruel
おかしい|おかしい|N4|i-adjective|Buồn cười, kỳ quặc|funny; strange; odd
珍しい|めずらしい|N4|i-adjective|Hiếm có, lạ mắt|rare; unusual
新しい|あたらしい|N4|i-adjective|Mới mẻ|new
親しい|したしい|N4|i-adjective|Thân thiết, gần gũi|intimate; close (friend)
美しい|うつくしい|N4|i-adjective|Đẹp đẽ, mỹ lệ|beautiful
おとなしい|おとなしい|N4|i-adjective|Hiền lành, ngoan ngoãn, trầm tính|quiet; gentle; obedient
選ぶ|えらぶ|N4|verb|Lựa chọn, bầu chọn|to choose; to select
決める|きめる|N4|verb|Quyết định|to decide
決まる|きまる|N4|verb|Được quyết định|to be decided
変える|かえる|N4|verb|Thay đổi (ngoại động từ)|to change; to alter
変わる|かわる|N4|verb|Thay đổi (tự động từ)|to change; to be transformed
調べる|しらべる|N4|verb|Tra cứu, điều tra, kiểm tra|to investigate; to check; to look up
探す|さがす|N4|verb|Tìm kiếm|to search; to look for
見つける|みつける|N4|verb|Tìm thấy, phát hiện ra|to find; to discover
見つかる|みつかる|N4|verb|Được tìm thấy|to be found
集める|あつめる|N4|verb|Tập hợp, sưu tầm|to collect; to gather
集まる|あつまる|N4|verb|Tụ tập, tập trung lại|to gather; to assemble
増える|ふえる|N4|verb|Tăng lên|to increase; to multiply
減る|へる|N4|verb|Giảm xuống|to decrease; to diminish
始まる|はじまる|N4|verb|Bắt đầu (tự động từ)|to begin
始める|はじめる|N4|verb|Bắt đầu làm (ngoại động từ)|to start; to initiate
続ける|つづける|N4|verb|Tiếp tục làm|to continue; to keep up
続く|つづく|N4|verb|Tiếp diễn, kéo dài|to continue; to last
止める|やめる|N4|verb|Từ bỏ, nghỉ việc, thôi làm|to quit; to stop doing
止める|とめる|N4|verb|Dừng lại, đỗ (xe)|to stop; to park
残る|のこる|N4|verb|Còn lại, ở lại|to remain; to be left over
残す|のこす|N4|verb|Để lại, chừa lại|to leave behind; to save
直す|なおす|N4|verb|Sửa chữa, chữa lại|to repair; to fix; to correct
直る|なおる|N4|verb|Được sửa xong|to be fixed; to get better
治る|なおる|N4|verb|Khỏi bệnh, lành vết thương|to be cured; to recover
壊す|こわす|N4|verb|Làm hỏng, phá vỡ|to break; to destroy
壊れる|こわれる|N4|verb|Bị hỏng, bị vỡ|to be broken; to break down
割る|わる|N4|verb|Làm vỡ, chia ra|to break; to split; to divide
割れる|われる|N4|verb|Bị nứt, bị vỡ (cốc, đĩa)|to break; to crack
折る|おる|N4|verb|Bẻ gãy, gấp (giấy)|to break; to fold (origami)
折れる|おれる|N4|verb|Bị gãy|to snap; to be folded
破る|やぶる|N4|verb|Xé rách, phá vỡ (lời hứa)|to tear; to break (a rule/promise)
破れる|やぶれる|N4|verb|Bị rách|to get torn
汚す|よごす|N4|verb|Làm bẩn|to make dirty
汚れる|よごれる|N4|verb|Bị bẩn|to get dirty
落とす|おとす|N4|verb|Làm rơi, đánh mất|to drop; to lose
落ちる|おちる|N4|verb|Rơi xuống, trượt (kỳ thi)|to fall; to fail (an exam)
倒れる|たおれる|N4|verb|Đổ, ngã quỵ|to fall down; to collapse
転ぶ|ころぶ|N4|verb|Vấp ngã|to fall down; to tumble
揺れる|ゆれる|N4|verb|Rung lắc, đung đưa|to shake; to sway
動く|うごく|N4|verb|Chuyển động, hoạt động|to move; to operate
動かす|うごかす|N4|verb|Di chuyển, vận hành|to move something
運ぶ|はこぶ|N4|verb|Vận chuyển, khuân vác|to carry; to transport
届ける|とどける|N4|verb|Giao đến, nộp|to deliver; to report
届く|とどく|N4|verb|Được gửi đến, với tới|to reach; to be delivered
送る|おくる|N4|verb|Gửi đi, tiễn đưa|to send; to escort
迎える|むかえる|N4|verb|Đón tiếp, ra đón|to welcome; to pick up
誘う|さそう|N4|verb|Rủ rê, mời mọc|to invite; to ask out
招く|まねく|N4|verb|Mời đến|to invite
訪ねる|たずねる|N4|verb|Ghé thăm, viếng thăm|to visit; to call on
尋ねる|たずねる|N4|verb|Hỏi thăm, tìm hỏi|to ask; to inquire
褒める|ほめる|N4|verb|Khen ngợi|to praise; to compliment
叱る|しかる|N4|verb|Mắng, la rầy|to scold
怒る|おこる|N4|verb|Tức giận|to get angry
笑う|わらう|N4|verb|Cười, mỉm cười|to laugh; to smile
泣く|なく|N4|verb|Khóc|to cry; to weep
喜ぶ|よろこぶ|N4|verb|Vui mừng, phấn khởi|to be delighted; to rejoice
驚く|おどろく|N4|verb|Ngạc nhiên|to be surprised
困る|こまる|N4|verb|Khốn đốn, gặp rắc rối|to be troubled; to be in difficulty
疲れる|つかれる|N4|verb|Mệt mỏi|to get tired
慣れる|なれる|N4|verb|Quen với|to get used to
飽きる|あきる|N4|verb|Chán, ngán|to get tired of; to lose interest
信じる|しんじる|N4|verb|Tin tưởng|to believe; to trust
祈る|いのる|N4|verb|Cầu nguyện, chúc|to pray; to wish
願う|ねがう|N4|verb|Mong ước, cầu mong|to wish; to request
頼む|たのむ|N4|verb|Nhờ vả, yêu cầu, gọi món|to ask a favor; to order
断る|ことわる|N4|verb|Từ chối, xin phép trước|to refuse; to decline
謝る|あやまる|N4|verb|Xin lỗi|to apologize
許す|ゆるす|N4|verb|Tha thứ, cho phép|to forgive; to permit
助ける|たすける|N4|verb|Giúp đỡ, cứu giúp|to help; to rescue
助かる|たすかる|N4|verb|Được cứu, đỡ vất vả|to be saved; to be helped
守る|まもる|N4|verb|Bảo vệ, tuân thủ (luật/hứa)|to protect; to obey; to keep
逃げる|にげる|N4|verb|Chạy trốn|to escape; to run away
勝つ|かつ|N4|verb|Chiến thắng|to win
負ける|まける|N4|verb|Thua cuộc, giảm giá|to lose; to be defeated
投げる|なげる|N4|verb|Ném, quăng|to throw
打つ|うつ|N4|verb|Đánh, gõ (máy chữ)|to hit; to strike; to type
踏む|ふむ|N4|verb|Giẫm, đạp lên|to step on
噛む|かむ|N4|verb|Cắn, nhai|to bite; to chew
触る|さわる|N4|verb|Chạm vào, sờ vào|to touch; to feel
盗む|ぬすむ|N4|verb|Ăn trộm, lấy cắp|to steal
拾う|ひろう|N4|verb|Nhặt lên, đón (taxi)|to pick up; to find
捨てる|すてる|N4|verb|Vứt bỏ|to throw away; to discard
片付ける|かたづける|N4|verb|Dọn dẹp gọn gàng|to tidy up; to put in order
包む|つつむ|N4|verb|Gói, bọc lại|to wrap; to pack
巻く|まく|N4|verb|Quấn, cuộn|to wind; to roll; to wrap
塗る|ぬる|N4|verb|Sơn, phết, bôi (thuốc)|to paint; to spread; to apply
焼く|やく|N4|verb|Nướng, rán, đốt|to bake; to grill; to roast
沸かす|わかす|N4|verb|Đun sôi (nước)|to boil; to heat up
沸く|わく|N4|verb|Sôi (nước)|to boil; to get hot
冷やす|ひやす|N4|verb|Làm lạnh, ướp lạnh|to chill; to cool
冷える|ひえる|N4|verb|Trở nên lạnh|to grow cold; to get chilly
温める|あたためる|N4|verb|Hâm nóng, làm ấm|to warm up; to heat
乾かす|かわかす|N4|verb|Làm khô, phơi khô|to dry something
乾く|かわく|N4|verb|Khô, khát (họng)|to get dry
濡れる|ぬれる|N4|verb|Bị ướt|to get wet
太る|ふとる|N4|verb|Béo lên, tăng cân|to gain weight; to grow fat
痩せる|やせる|N4|verb|Gầy đi, giảm cân|to lose weight; to become thin
育てる|そだてる|N4|verb|Nuôi dạy, trồng trọt|to raise; to bring up; to grow
育つ|そだつ|N4|verb|Lớn lên, trưởng thành|to grow up; to be raised
生きる|いきる|N4|verb|Sống, sinh tồn|to live; to exist
生える|はえる|N4|verb|Mọc lên (cỏ, răng, râu)|to grow; to sprout
植える|うえる|N4|verb|Trồng (cây, hoa)|to plant; to grow
飾る|かざる|N4|verb|Trang trí, trưng bày|to decorate; to display
比べる|くらべる|N4|verb|So sánh|to compare
似る|にる|N4|verb|Giống với|to resemble; to look like
合う|あう|N4|verb|Vừa vặn, hợp với|to fit; to match; to suit
間に合う|まにあう|N4|verb|Kịp giờ, đủ dùng|to be in time for
遅れる|おくれる|N4|verb|Trễ, muộn|to be late; to be delayed
通う|かよう|N4|verb|Đi đi về về (đi học, đi làm)|to commute; to attend regularly
通る|とおる|N4|verb|Đi ngang qua, thông qua|to pass through; to go by
渡す|わたす|N4|verb|Trao, đưa tận tay|to hand over; to pass
受ける|うける|N4|verb|Tham dự (kỳ thi), nhận|to take (an exam); to receive
込む|こむ|N4|verb|Đông đúc, tắc nghẽn|to be crowded; to be congested
空く|すく|N4|verb|Vắng vẻ, đói (bụng)|to become less crowded; to get hungry
替える|かえる|N4|verb|Đổi, thay thế|to exchange; to replace
代わる|かわる|N4|verb|Thay mặt, thay thế|to take the place of
乗り換える|のりかえる|N4|verb|Chuyển tàu, đổi xe|to transfer (trains)
着替える|きがえる|N4|verb|Thay quần áo|to change clothes
引っ越す|ひっこす|N4|verb|Chuyển nhà|to move house
建てる|たてる|N4|verb|Xây dựng (nhà cửa)|to build; to construct
建つ|たつ|N4|verb|Được xây lên|to be built
開く|ひらく|N4|verb|Mở (tiệc, lớp học, sách)|to open; to hold (an event)
伝える|つたえる|N4|verb|Truyền đạt, nhắn lại|to convey; to report; to tell
知らせる|しらせる|N4|verb|Thông báo, báo tin|to notify; to inform
聞こえる|きこえる|N4|verb|Nghe thấy (tự nhiên lọt vào tai)|to be heard; to be audible
見える|みえる|N4|verb|Nhìn thấy (lọt vào tầm mắt)|to be seen; to be in sight
見物する|けんぶつする|N4|verb|Tham quan|to sightsee
予約する|よやくする|N4|verb|Đặt trước|to reserve; to book
約束する|やくそくする|N4|verb|Hứa, hẹn|to promise; to make an appointment
説明する|せつめいする|N4|verb|Giải thích|to explain
準備する|じゅんびする|N4|verb|Chuẩn bị|to prepare
相談する|そうだんする|N4|verb|Bàn bạc, hỏi ý kiến|to consult; to discuss
連絡する|れんらくする|N4|verb|Liên lạc|to contact
紹介する|しょうかいする|N4|verb|Giới thiệu|to introduce
案内する|あんないする|N4|verb|Hướng dẫn|to guide; to show around
注意する|ちゅういする|N4|verb|Chú ý, nhắc nhở|to pay attention; to warn
運転する|うんてんする|N4|verb|Lái xe|to drive
入院する|にゅういんする|N4|verb|Nhập viện|to be hospitalized
退院する|たいいんする|N4|verb|Xuất viện|to leave the hospital
卒業する|そつぎょうする|N4|verb|Tốt nghiệp|to graduate
留学する|りゅうがくする|N4|verb|Du học|to study abroad
復習する|ふくしゅうする|N4|verb|Ôn tập|to review
予習する|よしゅうする|N4|verb|Soạn bài trước|to prepare for class
出席する|しゅっせきする|N4|verb|Tham dự, có mặt|to attend; to be present
欠席する|けっせきする|N4|verb|Vắng mặt, nghỉ học|to be absent
遅刻する|ちこくする|N4|verb|Đi muộn, đến trễ|to be late
賛成する|さんせいする|N4|verb|Tán thành|to agree; to approve
反対する|はんたいする|N4|verb|Phản đối|to oppose
成功する|せいこうする|N4|verb|Thành công|to succeed
失敗する|しっぱいする|N4|verb|Thất bại|to fail
努力する|どりょくする|N4|verb|Nỗ lực|to make an effort
心配する|しんぱいする|N4|verb|Lo lắng|to worry
安心する|あんしんする|N4|verb|Yên tâm|to feel relieved
びっくりする|びっくりする|N4|verb|Ngạc nhiên|to be surprised
がっかりする|がっかりする|N4|verb|Thất vọng|to be disappointed
遠慮する|えんりょする|N4|verb|Khách sáo, kiêng dè|to refrain; to hold back
我慢する|がまんする|N4|verb|Chịu đựng, nhẫn nại|to endure; to be patient
特に|とくに|N4|adverb|Đặc biệt là|especially; particularly
別に|べつに|N4|adverb|Không có gì đặc biệt (đi với phủ định)|nothing in particular; not really
急に|きゅうに|N4|adverb|Đột nhiên, bất ngờ|suddenly; abruptly
やっと|やっと|N4|adverb|Cuối cùng thì, mãi mới|finally; at last; barely
とうとう|とうとう|N4|adverb|Cuối cùng thì, rốt cuộc|finally; after all
そろそろ|そろそろ|N4|adverb|Sắp sửa, đã đến lúc|soon; gradually; it's about time
さっき|さっき|N4|adverb|Lúc nãy, vừa mới đây|a little while ago
この間|このあいだ|N4|adverb|Hôm vừa rồi, dạo gần đây|the other day; recently
最近|さいきん|N4|adverb|Dạo gần đây|recently; lately
これから|これから|N4|adverb|Từ bây giờ|from now on; after this
しばらく|しばらく|N4|adverb|Một lúc, một thời gian|for a while; for a moment
ずっと|ずっと|N4|adverb|Suốt, hơn hẳn, thẳng một mạch|all the time; much more
必ず|かならず|N4|adverb|Nhất định, chắc chắn|certainly; without fail
絶対|ぜったい|N4|adverb|Tuyệt đối, nhất định|absolutely; definitely
きっと|きっと|N4|adverb|Chắc chắn là (suy đoán)|surely; undoubtedly
もしかしたら|もしかしたら|N4|adverb|Biết đâu chừng, có lẽ|perhaps; possibly
たいてい|たいてい|N4|adverb|Thông thường, phần lớn|usually; generally
ほとんど|ほとんど|N4|adverb|Hầu hết, gần như không|almost; mostly; hardly
だいぶ|だいぶ|N4|adverb|Khá nhiều, đáng kể|considerably; a lot
かなり|かなり|N4|adverb|Khá là, tương đối|fairly; quite; considerably
ずいぶん|ずいぶん|N4|adverb|Rất, khá là (ngạc nhiên)|very; extremely; surprisingly
しっかり|しっかり|N4|adverb|Vững vàng, chắc chắn, chăm chỉ|firmly; steadily; properly
はっきり|はっきり|N4|adverb|Rõ ràng, dứt khoát|clearly; distinctly
すっかり|すっかり|N4|adverb|Hoàn toàn, sạch trơn|completely; thoroughly
なるべく|なるべく|N4|adverb|Càng ~ càng tốt, trong khả năng|as much as possible
できるだけ|できるだけ|N4|adverb|Trong phạm vi có thể|as much as possible
まず|まず|N4|adverb|Trước tiên, đầu tiên|first of all; to begin with
次に|つぎに|N4|adverb|Tiếp theo|next; secondly
最後に|さいごに|N4|adverb|Cuối cùng|finally; last of all
例えば|たとえば|N4|adverb|Ví dụ như|for example; for instance
つまり|つまり|N4|conjunction|Tức là, nói tóm lại là|in other words; that is to say
しかし|しかし|N4|conjunction|Tuy nhiên, thế nhưng|however; but
けれども|けれども|N4|conjunction|Tuy nhiên, mặc dù vậy|however; although
それに|それに|N4|conjunction|Hơn nữa, thêm vào đó|moreover; besides
それで|それで|N4|conjunction|Vì thế nên, thế rồi|and so; therefore
だから|だから|N4|conjunction|Chính vì vậy, cho nên|therefore; so
すると|すると|N4|conjunction|Thế là, ngay sau đó|thereupon; then
または|または|N4|conjunction|Hoặc là|or; otherwise
`.trim();

// English-to-Vietnamese dictionary for enriching upstream OpenJLPT / Bluskyo entries
export const EN_TO_VI_DICT = {
  'promise': 'Lời hứa, cuộc hẹn',
  'appointment': 'Cuộc hẹn',
  'reservation': 'Đặt trước, đặt chỗ',
  'plan': 'Kế hoạch, dự định',
  'schedule': 'Lịch trình',
  'preparation': 'Sự chuẩn bị',
  'experience': 'Kinh nghiệm, trải nghiệm',
  'explanation': 'Sự giải thích',
  'practice': 'Sự luyện tập',
  'study': 'Học tập, nghiên cứu',
  'school': 'Trường học',
  'student': 'Học sinh, sinh viên',
  'teacher': 'Giáo viên, thầy cô',
  'university': 'Trường đại học',
  'library': 'Thư viện',
  'hospital': 'Bệnh viện',
  'station': 'Nhà ga',
  'train': 'Tàu điện',
  'subway': 'Tàu điện ngầm',
  'bus': 'Xe buýt',
  'car': 'Ô tô, xe hơi',
  'bicycle': 'Xe đạp',
  'airplane': 'Máy bay',
  'airport': 'Sân bay',
  'ticket': 'Vé',
  'map': 'Bản đồ',
  'travel': 'Du lịch',
  'trip': 'Chuyến đi',
  'hotel': 'Khách sạn',
  'room': 'Căn phòng',
  'house': 'Ngôi nhà',
  'home': 'Nhà, gia đình',
  'family': 'Gia đình',
  'friend': 'Bạn bè',
  'mother': 'Mẹ',
  'father': 'Bố, cha',
  'brother': 'Anh/em trai',
  'sister': 'Chị/em gái',
  'child': 'Trẻ em, con cái',
  'person': 'Người, con người',
  'man': 'Đàn ông',
  'woman': 'Phụ nữ',
  'company': 'Công ty',
  'work': 'Công việc, làm việc',
  'job': 'Công việc, nghề nghiệp',
  'office': 'Văn phòng',
  'bank': 'Ngân hàng',
  'post office': 'Bưu điện',
  'shop': 'Cửa hàng',
  'store': 'Cửa hiệu',
  'restaurant': 'Nhà hàng',
  'supermarket': 'Siêu thị',
  'department store': 'Trung tâm thương mại',
  'park': 'Công viên',
  'garden': 'Sân vườn',
  'mountain': 'Ngọn núi',
  'river': 'Con sông',
  'sea': 'Biển',
  'ocean': 'Đại dương',
  'sky': 'Bầu trời',
  'weather': 'Thời tiết',
  'rain': 'Cơn mưa',
  'snow': 'Tuyết',
  'wind': 'Cơn gió',
  'cloud': 'Đám mây',
  'flower': 'Bông hoa',
  'tree': 'Cái cây',
  'dog': 'Con chó',
  'cat': 'Con mèo',
  'bird': 'Con chim',
  'fish': 'Con cá',
  'animal': 'Động vật',
  'food': 'Thức ăn, đồ ăn',
  'drink': 'Đồ uống, uống',
  'water': 'Nước',
  'tea': 'Trà',
  'green tea': 'Trà xanh',
  'black tea': 'Hồng trà',
  'coffee': 'Cà phê',
  'milk': 'Sữa',
  'bread': 'Bánh mì',
  'rice': 'Cơm, gạo',
  'meal': 'Bữa ăn',
  'breakfast': 'Bữa sáng',
  'lunch': 'Bữa trưa',
  'dinner': 'Bữa tối',
  'meat': 'Thịt',
  'beef': 'Thịt bò',
  'pork': 'Thịt heo',
  'chicken': 'Thịt gà, con gà',
  'egg': 'Quả trứng',
  'vegetable': 'Rau củ',
  'fruit': 'Trái cây, hoa quả',
  'apple': 'Quả táo',
  'sugar': 'Đường',
  'salt': 'Muối',
  'book': 'Quyển sách',
  'dictionary': 'Từ điển',
  'magazine': 'Tạp chí',
  'newspaper': 'Tờ báo',
  'notebook': 'Quyển vở',
  'letter': 'Bức thư',
  'paper': 'Tờ giấy',
  'pen': 'Cây bút',
  'pencil': 'Bút chì',
  'desk': 'Cái bàn',
  'chair': 'Cái ghế',
  'table': 'Bàn ăn',
  'bed': 'Giường ngủ',
  'window': 'Cửa sổ',
  'door': 'Cửa ra vào',
  'key': 'Chìa khóa',
  'clock': 'Đồng hồ',
  'watch': 'Đồng hồ đeo tay',
  'umbrella': 'Cái ô, cái dù',
  'bag': 'Cặp xách, túi xách',
  'wallet': 'Ví tiền',
  'money': 'Tiền bạc',
  'telephone': 'Điện thoại',
  'phone': 'Điện thoại',
  'computer': 'Máy tính',
  'camera': 'Máy ảnh',
  'photo': 'Bức ảnh',
  'photograph': 'Bức ảnh',
  'picture': 'Bức tranh, bức ảnh',
  'movie': 'Bộ phim',
  'music': 'Âm nhạc',
  'song': 'Bài hát',
  'clothes': 'Quần áo',
  'shirt': 'Áo sơ mi',
  'coat': 'Áo khoác',
  'shoes': 'Đôi giày',
  'glasses': 'Kính mắt',
  'hat': 'Cái mũ',
  'time': 'Thời gian',
  'today': 'Hôm nay',
  'tomorrow': 'Ngày mai',
  'yesterday': 'Hôm qua',
  'morning': 'Buổi sáng',
  'noon': 'Buổi trưa',
  'afternoon': 'Buổi chiều',
  'evening': 'Buổi tối',
  'night': 'Ban đêm',
  'week': 'Tuần lễ',
  'month': 'Tháng',
  'year': 'Năm',
  'spring': 'Mùa xuân',
  'summer': 'Mùa hè',
  'autumn': 'Mùa thu',
  'winter': 'Mùa đông',
  'holiday': 'Ngày nghỉ, kỳ nghỉ',
  'birthday': 'Sinh nhật',
  'head': 'Cái đầu',
  'face': 'Khuôn mặt',
  'eye': 'Đôi mắt',
  'ear': 'Đôi tai',
  'nose': 'Cái mũi',
  'mouth': 'Cái miệng',
  'tooth': 'Cái răng',
  'hand': 'Bàn tay',
  'foot': 'Bàn chân',
  'leg': 'Cái chân',
  'body': 'Cơ thể',
  'heart': 'Trái tim, tấm lòng',
  'voice': 'Giọng nói',
  'medicine': 'Thuốc chữa bệnh',
  'illness': 'Bệnh tật',
  'sickness': 'Ốm đau',
  'language': 'Ngôn ngữ',
  'word': 'Từ vựng, lời nói',
  'meaning': 'Ý nghĩa',
  'question': 'Câu hỏi',
  'answer': 'Câu trả lời',
  'problem': 'Vấn đề, câu hỏi',
  'homework': 'Bài tập về nhà',
  'exam': 'Kỳ thi',
  'test': 'Bài kiểm tra',
  'class': 'Lớp học, giờ học',
  'lesson': 'Bài học',
  'name': 'Tên gọi',
  'number': 'Con số, số hiệu',
  'address': 'Địa chỉ',
  'color': 'Màu sắc',
  'white': 'Màu trắng',
  'black': 'Màu đen',
  'red': 'Màu đỏ',
  'blue': 'Màu xanh dương',
  'green': 'Màu xanh lá',
  'yellow': 'Màu vàng',
  'big': 'To, lớn',
  'large': 'Rộng lớn',
  'small': 'Nhỏ bé',
  'little': 'Nhỏ, một ít',
  'new': 'Mới',
  'old': 'Cũ, cổ',
  'good': 'Tốt, hay',
  'bad': 'Xấu, tồi',
  'high': 'Cao, đắt',
  'tall': 'Cao',
  'expensive': 'Đắt tiền',
  'low': 'Thấp',
  'cheap': 'Rẻ',
  'inexpensive': 'Rẻ, phải chăng',
  'hot': 'Nóng',
  'cold': 'Lạnh',
  'warm': 'Ấm áp',
  'cool': 'Mát mẻ',
  'difficult': 'Khó khăn',
  'easy': 'Dễ dàng',
  'simple': 'Đơn giản',
  'delicious': 'Ngon miệng',
  'sweet': 'Ngọt ngào',
  'spicy': 'Cay',
  'interesting': 'Thú vị, hấp dẫn',
  'fun': 'Vui vẻ',
  'happy': 'Hạnh phúc, vui mừng',
  'sad': 'Buồn bã',
  'lonely': 'Cô đơn',
  'busy': 'Bận rộn',
  'free': 'Rảnh rỗi, tự do, miễn phí',
  'quiet': 'Yên tĩnh',
  'lively': 'Nhộn nhịp, sôi nổi',
  'clean': 'Sạch sẽ',
  'beautiful': 'Đẹp đẽ, xinh đẹp',
  'pretty': 'Xinh xắn',
  'dirty': 'Bẩn',
  'famous': 'Nổi tiếng',
  'kind': 'Tốt bụng, tử tế',
  'convenient': 'Tiện lợi',
  'inconvenient': 'Bất tiện',
  'important': 'Quan trọng',
  'necessary': 'Cần thiết',
  'special': 'Đặc biệt',
  'normal': 'Bình thường',
  'ordinary': 'Thông thường',
  'safe': 'An toàn',
  'dangerous': 'Nguy hiểm',
  'healthy': 'Khỏe mạnh',
  'strong': 'Mạnh mẽ',
  'weak': 'Yếu ớt',
  'long': 'Dài',
  'short': 'Ngắn',
  'wide': 'Rộng rãi',
  'narrow': 'Chật hẹp',
  'bright': 'Sáng sủa',
  'dark': 'Tối tăm',
  'heavy': 'Nặng',
  'light': 'Nhẹ, ánh sáng',
  'fast': 'Nhanh chóng',
  'early': 'Sớm',
  'slow': 'Chậm chạp',
  'late': 'Muộn, trễ',
  'near': 'Gần',
  'close': 'Gần, đóng',
  'far': 'Xa xôi',
  'young': 'Trẻ tuổi',
  'same': 'Giống nhau',
  'different': 'Khác nhau',
  'correct': 'Đúng đắn, chính xác',
  'careful': 'Cẩn thận',
  'polite': 'Lịch sự',
  'serious': 'Nghiêm túc',
  'strange': 'Kỳ lạ',
  'wonderful': 'Tuyệt vời',
  'terrible': 'Tồi tệ, kinh khủng'
};

export function parseCuratedVocabRows() {
  const result = [];
  const allRows = [...N5_VOCAB_ROWS.split('\n'), ...N4_VOCAB_ROWS.split('\n')];
  for (const line of allRows) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split('|');
    if (parts.length < 6) continue;
    const [word, reading, jlpt, posCsv, viStr, enStr] = parts;
    result.push({
      word: word.trim(),
      reading: reading.trim(),
      jlpt: jlpt.trim(),
      pos: posCsv.split(',').map(s => s.trim()).filter(Boolean),
      vi: viStr.split(/[;,]/).map(s => s.trim()).filter(Boolean),
      en: enStr.split(/[;,]/).map(s => s.trim()).filter(Boolean)
    });
  }
  return result;
}
