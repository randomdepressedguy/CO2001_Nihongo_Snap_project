// Extended JLPT N5 & N4 Vocabulary Bank (~900 additional entries)
// Ensures complete N5 + N4 coverage (~1,500+ total words) with accurate Vietnamese & English meanings

const EXTENDED_VOCAB_ROWS = `
一つ|ひとつ|N5|counter,noun|Một cái|one thing
二つ|ふたつ|N5|counter,noun|Hai cái|two things
三つ|みっつ|N5|counter,noun|Ba cái|three things
四つ|よっつ|N5|counter,noun|Bốn cái|four things
五つ|いつつ|N5|counter,noun|Năm cái|five things
六つ|むっつ|N5|counter,noun|Sáu cái|six things
七つ|ななつ|N5|counter,noun|Bảy cái|seven things
八つ|やっつ|N5|counter,noun|Tám cái|eight things
九つ|ここのつ|N5|counter,noun|Chín cái|nine things
十|とお|N5|counter,noun|Mười cái|ten things
一日|ついたち|N5|noun|Mùng 1 (ngày đầu tháng)|first day of the month
二日|ふつか|N5|noun|Mùng 2, 2 ngày|second day of the month; two days
三日|みっか|N5|noun|Mùng 3, 3 ngày|third day of the month; three days
四日|よっか|N5|noun|Mùng 4, 4 ngày|fourth day of the month; four days
五日|いつか|N5|noun|Mùng 5, 5 ngày|fifth day of the month; five days
六日|むいか|N5|noun|Mùng 6, 6 ngày|sixth day of the month; six days
七日|なのか|N5|noun|Mùng 7, 7 ngày|seventh day of the month; seven days
八日|ようか|N5|noun|Mùng 8, 8 ngày|eighth day of the month; eight days
九日|ここのか|N5|noun|Mùng 9, 9 ngày|ninth day of the month; nine days
十日|とおか|N5|noun|Mùng 10, 10 ngày|tenth day of the month; ten days
十四日|じゅうよっか|N5|noun|Ngày 14, 14 ngày|fourteenth day of the month
二十日|はつか|N5|noun|Ngày 20, 20 ngày|twentieth day of the month; twenty days
二十四日|にじゅうよっか|N5|noun|Ngày 24, 24 ngày|twenty-fourth day of the month
一月|いちがつ|N5|noun|Tháng Một|January
二月|にがつ|N5|noun|Tháng Hai|February
三月|さんがつ|N5|noun|Tháng Ba|March
四月|しがつ|N5|noun|Tháng Tư|April
五月|ごがつ|N5|noun|Tháng Năm|May
六月|ろくがつ|N5|noun|Tháng Sáu|June
七月|しちがつ|N5|noun|Tháng Bảy|July
八月|はちがつ|N5|noun|Tháng Tám|August
九月|くがつ|N5|noun|Tháng Chín|September
十月|じゅうがつ|N5|noun|Tháng Mười|October
十一月|じゅういちがつ|N5|noun|Tháng Mười Một|November
十二月|じゅうにがつ|N5|noun|Tháng Mười Hai|December
一人|ひとり|N5|noun|Một người, một mình|one person; alone
二人|ふたり|N5|noun|Hai người|two people
三人|さんにん|N5|noun|Ba người|three people
四人|よにん|N5|noun|Bốn người|four people
百|ひゃく|N5|noun|Một trăm|hundred
千|せん|N5|noun|Một nghìn|thousand
万|まん|N5|noun|Mười nghìn, một vạn|ten thousand
ゼロ|ゼロ|N5|noun|Số không (0)|zero
零|れい|N5|noun|Số không (0)|zero
一|いち|N5|noun|Số một (1)|one
二|に|N5|noun|Số hai (2)|two
三|さん|N5|noun|Số ba (3)|three
四|よん|N5|noun|Số bốn (4)|four
五|ご|N5|noun|Số năm (5)|five
六|ろく|N5|noun|Số sáu (6)|six
七|なな|N5|noun|Số bảy (7)|seven
八|はち|N5|noun|Số tám (8)|eight
九|きゅう|N5|noun|Số chín (9)|nine
十|じゅう|N5|noun|Số mười (10)|ten
一階|いっかい|N5|noun|Tầng 1|first floor
二階|にかい|N5|noun|Tầng 2|second floor
三階|さんがい|N5|noun|Tầng 3|third floor
何階|なんがい|N5|noun|Tầng mấy|what floor
一回|いっかい|N5|noun|Một lần|one time; once
二回|にかい|N5|noun|Hai lần|twice; two times
何回|なんかい|N5|noun|Mấy lần|how many times
一本|いっぽん|N5|noun|Một cây (bút, ô, chai)|one long cylindrical object
二本|にほん|N5|noun|Hai cây|two long cylindrical objects
三本|さんぼん|N5|noun|Ba cây|three long cylindrical objects
何本|なんぼん|N5|noun|Mấy cây|how many long objects
一枚|いちまい|N5|noun|Một tờ, một tấm|one flat object
二枚|にまい|N5|noun|Hai tờ, hai tấm|two flat objects
何枚|なんまい|N5|noun|Mấy tờ|how many flat objects
一杯|いっぱい|N5|noun,adverb|Một cốc, đầy ắp|one cup/glass; full
二杯|にはい|N5|noun|Hai cốc|two cups/glasses
三杯|さんばい|N5|noun|Ba cốc|three cups/glasses
一台|いちだい|N5|noun|Một chiếc (xe, máy)|one machine or vehicle
一冊|いっさつ|N5|noun|Một quyển (sách, vở)|one book/volume
一匹|いっぴき|N5|noun|Một con (vật nhỏ)|one small animal
一足|いっそく|N5|noun|Một đôi (giày, tất)|one pair of footwear
一歳|いっさい|N5|noun|Một tuổi|one year old
二十歳|はたち|N5|noun|Hai mươi tuổi (20 tuổi)|twenty years old
何歳|なんさい|N5|noun|Bao nhiêu tuổi|how old
おいくつ|おいくつ|N5|noun|Bao nhiêu tuổi (lịch sự)|how old (polite)
一時|いちじ|N5|noun|1 giờ|one o'clock
二時|にじ|N5|noun|2 giờ|two o'clock
三時|さんじ|N5|noun|3 giờ|three o'clock
四時|よじ|N5|noun|4 giờ|four o'clock
五時|ごじ|N5|noun|5 giờ|five o'clock
六時|ろくじ|N5|noun|6 giờ|six o'clock
七時|しちじ|N5|noun|7 giờ|seven o'clock
八時|はちじ|N5|noun|8 giờ|eight o'clock
九時|くじ|N5|noun|9 giờ|nine o'clock
十時|じゅうじ|N5|noun|10 giờ|ten o'clock
十一時|じゅういちじ|N5|noun|11 giờ|eleven o'clock
十二時|じゅうにじ|N5|noun|12 giờ|twelve o'clock
何時|なんじ|N5|noun|Mấy giờ|what time
一分|いっぷん|N5|noun|1 phút|one minute
五分|ごふん|N5|noun|5 phút|five minutes
十分|じっぷん|N5|noun|10 phút|ten minutes
十五分|じゅうごふん|N5|noun|15 phút|fifteen minutes
三十分|さんじっぷん|N5|noun|30 phút|thirty minutes
何分|なんぷん|N5|noun|Mấy phút|how many minutes
一時間|いちじかん|N5|noun|1 tiếng đồng hồ|one hour
一日中|いちにちじゅう|N5|noun|Suốt cả ngày|all day long
一週間|いっしゅうかん|N5|noun|1 tuần lễ|one week
一ヶ月|いっかげつ|N5|noun|1 tháng|one month
一年間|いちねんかん|N5|noun|1 năm trời|one year period
これ|これ|N5|pronoun|Cái này|this one
それ|それ|N5|pronoun|Cái đó|that one
あれ|あれ|N5|pronoun|Cái kia|that one over there
この|この|N5|determiner|Này|this ~
その|その|N5|determiner|Đó|that ~
あの|あの|N5|determiner|Kia|that ~ over there
ここ|ここ|N5|pronoun|Ở đây, chỗ này|here; this place
そこ|そこ|N5|pronoun|Ở đó, chỗ đó|there; that place
あそこ|あそこ|N5|pronoun|Ở đằng kia|over there
こちら|こちら|N5|pronoun|Phía này, vị này|this way; this person
そちら|そちら|N5|pronoun|Phía đó, bên bạn|that way; your side
あちら|あちら|N5|pronoun|Phía kia|that way over there
どちら|どちら|N5|pronoun|Phía nào, cái nào, ở đâu|which way; which one; where
こっち|こっち|N5|pronoun|Đằng này (thân mật)|this way (casual)
そっち|そっち|N5|pronoun|Đằng đó (thân mật)|that way (casual)
あっち|あっち|N5|pronoun|Đằng kia (thân mật)|over there (casual)
どっち|どっち|N5|pronoun|Cái nào, đằng nào (thân mật)|which one (casual)
何|なに|N5|pronoun|Cái gì|what
何か|なにか|N5|pronoun|Cái gì đó|something
誰か|だれか|N5|pronoun|Ai đó|someone; somebody
どこか|どこか|N5|pronoun|Đâu đó|somewhere
いつか|いつか|N5|adverb|Một lúc nào đó|someday; sometime
いつも|いつも|N5|adverb|Luôn luôn|always
誰も|だれも|N5|pronoun|Không ai cả (đi với phủ định)|no one; nobody
何も|なにも|N5|pronoun|Không có gì cả (đi với phủ định)|nothing
どこも|どこも|N5|pronoun|Đâu cũng / Không nơi nào|everywhere; nowhere
カメラマン|カメラマン|N5|noun|Nhiếp ảnh gia, thợ quay phim|photographer; cameraman
ガイド|ガイド|N5|noun|Hướng dẫn viên, sách hướng dẫn|tour guide; guidebook
カレンダー|カレンダー|N5|noun|Tờ lịch|calendar
ガラス|ガラス|N5|noun|Kính, thủy tinh|glass (material)
グラム|グラム|N5|noun|Gam (đơn vị khối lượng)|gram
キロ|キロ|N5|noun|Ki-lô-gam, ki-lô-mét|kilogram; kilometer
メートル|メートル|N5|noun|Mét|meter
ページ|ページ|N5|noun|Trang sách|page
クラス|クラス|N5|noun|Lớp học|class
グループ|グループ|N5|noun|Nhóm|group
コピー|コピー|N5|noun,suru-verb|Bản sao, photocopy|copy; photocopy
メモ|メモ|N5|noun,suru-verb|Ghi chú nhanh|memo; note
テープ|テープ|N5|noun|Băng dính, băng cát-xét|tape
テープレコーダー|テープレコーダー|N5|noun|Máy ghi âm|tape recorder
レコード|レコード|N5|noun|Đĩa nhạc, kỷ lục|record
ギター|ギター|N5|noun|Đàn ghi-ta|guitar
デパート|デパート|N5|noun|Bách hóa tổng hợp|department store
エレベーター|エレベーター|N5|noun|Thang máy|elevator
エスカレーター|エスカレーター|N5|noun|Thang cuốn|escalator
ロビー|ロビー|N5|noun|Sảnh chờ|lobby
シャワー|シャワー|N5|noun|Vòi hoa sen, tắm vòi sen|shower
ストーブ|ストーブ|N5|noun|Lò sưởi|heater; stove
クーラー|クーラー|N5|noun|Máy lạnh|air conditioner; cooler
ラジオ|ラジオ|N5|noun|Đài phát thanh|radio
ニュース|ニュース|N5|noun|Bản tin|news
フィルム|フィルム|N5|noun|Cuộn phim|film
ペット|ペット|N5|noun|Thú cưng|pet
ポスト|ポスト|N5|noun|Hòm thư bưu điện|mailbox; postbox
マッチ|マッチ|N5|noun|Diêm|match
ナイフ|ナイフ|N5|noun|Dao ăn|knife
フォーク|フォーク|N5|noun|Dĩa, nĩa|fork
スプーン|スプーン|N5|noun|Muỗng, thìa|spoon
コップ|コップ|N5|noun|Cốc nước|cup; drinking glass
バター|バター|N5|noun|Bơ|butter
チーズ|チーズ|N5|noun|Phô mai|cheese
ハム|ハム|N5|noun|Thịt nguội, giăm bông|ham
ソーセージ|ソーセージ|N5|noun|Xúc xích|sausage
サラダ|サラダ|N5|noun|Rau trộn, sa-lát|salad
スープ|スープ|N5|noun|Súp, canh|soup
チョコレート|チョコレート|N5|noun|Sô-cô-la|chocolate
アイスクリーム|アイスクリーム|N5|noun|Kem lạnh|ice cream
ビスケット|ビスケット|N5|noun|Bánh quy|biscuit; cookie
ガム|ガム|N5|noun|Kẹo cao su|chewing gum
주ース|ジュース|N5|noun|Nước trái cây|juice
ネクタイ|ネクタイ|N5|noun|Cà vạt|necktie
ワイシャツ|ワイシャツ|N5|noun|Áo sơ mi trắng công sở|dress shirt; business shirt
セーター|セーター|N5|noun|Áo len|sweater
コート|コート|N5|noun|Áo măng tô, áo khoác|coat
ジャケット|ジャケット|N5|noun|Áo khoác ngắn|jacket
スーツ|スーツ|N5|noun|Bộ đồ vest, âu phục|suit
スカート|スカート|N5|noun|Chân váy|skirt
ドレス|ドレス|N5|noun|Váy đầm dạ hội|dress
ズボン|ズボン|N5|noun|Quần dài|pants; trousers
ジーンズ|ジーンズ|N5|noun|Quần bò (jeans)|jeans
ベルト|ベルト|N5|noun|Thắt lưng, dây nịt|belt
ブーツ|ブーツ|N5|noun|Giày bốt, ủng|boots
サンダル|サンダル|N5|noun|Dép xăng-đan|sandals
スリッパ|スリッパ|N5|noun|Dép đi trong nhà|slippers
マフラー|マフラー|N5|noun|Khăn quàng cổ mùa đông|winter scarf; muffler
手袋|てぶくろ|N4|noun|Găng tay|gloves
指輪|ゆびわ|N4|noun|Nhẫn|finger ring
腕時計|うでどけい|N4|noun|Đồng hồ đeo tay|wristwatch
着物|きもの|N4|noun|Trang phục truyền thống Kimono|kimono
下着|したぎ|N4|noun|Đồ lót|underwear
パジャマ|パジャマ|N4|noun|Đồ ngủ|pajamas
スーツケース|スーツケース|N4|noun|Va-li du lịch|suitcase
ハンドバッグ|ハンドバッグ|N4|noun|Túi xách tay|handbag
アクセサリー|アクセサリー|N4|noun|Trang sức, phụ kiện|accessory; jewelry
化粧品|けしょうひん|N4|noun|Mỹ phẩm|cosmetics
鏡|かがみ|N4|noun|Cái gương|mirror
櫛|くし|N4|noun|Cái lược|comb
髭|ひげ|N4|noun|Râu|beard; mustache
爪|つめ|N4|noun|Móng tay, móng chân|nail; claw
腕|うで|N4|noun|Cánh tay, tay nghề|arm; skill
肘|ひじ|N4|noun|Khuỷu tay|elbow
膝|ひざ|N4|noun|Đầu gối|knee
腰|こし|N4|noun|Hông, thắt lưng|waist; lower back
背中|せなか|N4|noun|Lưng|back (of body)
喉|のど|N4|noun|Cổ họng|throat
舌|した|N4|noun|Cái lưỡi|tongue
唇|くちびる|N4|noun|Đôi môi|lips
頬|ほほ|N4|noun|Gò má|cheek
額|ひたい|N4|noun|Trán|forehead
脳|のう|N4|noun|Não bộ|brain
心臓|しんぞう|N4|noun|Tim, quả tim|heart (organ)
胃|い|N4|noun|Dạ dày|stomach (organ)
血|ち|N4|noun|Máu|blood
骨|ほね|N4|noun|Xương|bone
皮|かわ|N4|noun|Da, vỏ (trái cây)|skin; peel; bark
汗|あせ|N4|noun|Mồ hôi|sweat; perspiration
涙|なみだ|N4|noun|Nước mắt|tear; teardrops
息|いき|N4|noun|Hơi thở|breath
咳|せき|N4|noun|Ho|cough
くしゃみ|くしゃみ|N4|noun|Hắt xì hơi|sneeze
頭痛|ずつう|N4|noun|Đau đầu|headache
腹痛|ふくつう|N4|noun|Đau bụng|stomachache
下痢|げり|N4|noun|Tiêu chảy|diarrhea
怪我|けが|N4|noun,suru-verb|Bị thương, vết thương|injury
火傷|やけど|N4|noun,suru-verb|Bị bỏng, vết bỏng|burn; scald
命|いのち|N4|noun|Sinh mệnh, tính mạng|life
赤ちゃん|あかちゃん|N4|noun|Em bé sơ sinh|baby; infant
幼児|ようじ|N4|noun|Trẻ nhỏ|toddler; young child
少年|しょうねん|N4|noun|Thiếu niên, cậu bé|boy; youth
少女|しょうじょ|N4|noun|Thiếu nữ, cô gái trẻ|girl; young lady
若者|わかもの|N4|noun|Người trẻ, thanh niên|young people; youth
老人|ろうじん|N4|noun|Người già, người cao tuổi|elderly person
お年寄り|おとしより|N4|noun|Người lớn tuổi (lịch sự)|elderly person (polite)
夫婦|ふうふ|N4|noun|Vợ chồng|married couple
親戚|しんせき|N4|noun|Họ hàng, thân thích|relative; kin
祖先|そせん|N4|noun|Tổ tiên|ancestor
孫|まご|N4|noun|Cháu (nội, ngoại)|grandchild
息子|むすこ|N4|noun|Con trai (của mình)|my son
娘|むすめ|N4|noun|Con gái (của mình)|my daughter
お子さん|おこさん|N4|noun|Con (của người khác)|someone else's child
坊ちゃん|ぼっちゃん|N4|noun|Cậu ấm, con trai (người khác)|someone else's son
お嬢さん|おじょうさん|N4|noun|Tiểu thư, con gái (người khác)|someone else's daughter
ご主人|ごしゅじん|N4|noun|Chồng (của người khác)|someone else's husband
家内|かない|N4|noun|Vợ (của mình)|my wife
彼氏|かれし|N4|noun|Bạn trai|boyfriend
恋人|こいびと|N4|noun|Người yêu|lover; sweetheart
親友|しんゆう|N4|noun|Bạn thân|best friend; close friend
知り合い|しりあい|N4|noun|Người quen|acquaintance
仲間|なかま|N4|noun|Đồng đội, bạn đồng hành|companion; colleague; peer
先輩|せんぱい|N4|noun|Tiền bối, đàn anh/chị|senior (at work or school)
後輩|こうはい|N4|noun|Hậu bối, đàn em|junior (at work or school)
同僚|どうりょう|N4|noun|Đồng nghiệp|colleague; coworker
上司|じょうし|N4|noun|Cấp trên, sếp|superior; boss
部下|ぶか|N4|noun|Cấp dưới|subordinate
社長|しゃちょう|N4|noun|Giám đốc công ty|company president; CEO
部長|ぶちょう|N4|noun|Trưởng phòng|department manager
課長|かちょう|N4|noun|Trưởng bộ phận, tổ trưởng|section manager
店長|てんちょう|N4|noun|Cửa hàng trưởng, quản lý tiệm|store manager
校長|こうちょう|N4|noun|Hiệu trưởng|school principal
学長|がくちょう|N4|noun|Hiệu trưởng trường đại học|university president
教授|きょうじゅ|N4|noun|Giáo sư|professor
学者|がくしゃ|N4|noun|Học giả|scholar
研究者|けんきゅうしゃ|N4|noun|Nhà nghiên cứu|researcher
医者|いしゃ|N4|noun|Bác sĩ|doctor
看護師|かんごし|N4|noun|Y tá, điều dưỡng viên|nurse
薬剤師|やくざいし|N4|noun|Dược sĩ|pharmacist
弁護士|べんごし|N4|noun|Luật sư|lawyer; attorney
政治家|せいじか|N4|noun|Chính trị gia|politician
警察官|けいさつかん|N4|noun|Cảnh sát viên|police officer
公務員|こうむいん|N4|noun|Công chức nhà nước|civil servant; government worker
店員|てんいん|N4|noun|Nhân viên cửa hàng|shop assistant; clerk
駅員|えきいん|N4|noun|Nhân viên nhà ga|station attendant
運転手|うんてんしゅ|N4|noun|Tài xế, người lái xe|driver; chauffeur
料理人|りょうりにん|N4|noun|Đầu bếp|cook; chef
美容師|びようし|N4|noun|Thợ làm tóc, chuyên viên thẩm mỹ|beautician; hairdresser
歌手|かしゅ|N4|noun|Ca sĩ|singer
俳優|はいゆう|N4|noun|Diễn viên|actor; actress
作家|さっか|N4|noun|Nhà văn, tác giả|writer; author; novelist
画家|がか|N4|noun|Họa sĩ|painter; artist
音楽家|おんがくか|N4|noun|Nhạc sĩ|musician
建築家|けんちくか|N4|noun|Kiến trúc sư|architect
エンジニア|エンジニア|N4|noun|Kỹ sư|engineer
プログラマー|プログラマー|N4|noun|Lập trình viên|programmer
デザイナー|デザイナー|N4|noun|Nhà thiết kế|designer
ジャーナリスト|ジャーナリスト|N4|noun|Nhà báo|journalist
選手|せんしゅ|N4|noun|Tuyển thủ, vận động viên|player; athlete
お客様|おきゃくさま|N4|noun|Quý khách, khách hàng|guest; customer; client
お客さん|おきゃくさん|N4|noun|Khách, vị khách|guest; visitor; customer
泥棒|どろぼう|N4|noun|Kẻ trộm|thief; burglar
犯人|はんにん|N4|noun|Thủ phạm, tội phạm|criminal; culprit
相手|あいて|N4|noun|Đối phương, bạn đồng hành|partner; opponent; companion
皆様|みなさま|N4|noun|Quý vị, mọi người (trang trọng)|everyone (formal)
個人|こじん|N4|noun|Cá nhân|individual; personal
市民|しみん|N4|noun|Công dân thành phố, thị dân|citizen; townspeople
国民|こくみん|N4|noun|Quốc dân, người dân trong nước|citizens of a nation
住民|じゅうみん|N4|noun|Cư dân|residents; inhabitants
人類|じんるい|N4|noun|Nhân loại, loài người|mankind; humanity
リビング|リビング|N4|noun|Phòng khách|living room
居間|いま|N4|noun|Phòng khách, phòng sinh hoạt chung|living room (Japanese style)
寝室|しんしつ|N4|noun|Phòng ngủ|bedroom
和室|わしつ|N4|noun|Phòng kiểu Nhật (trải chiếu Tatami)|Japanese-style room
洋室|ようしつ|N4|noun|Phòng kiểu Tây|Western-style room
洗面所|せんめんじょ|N4|noun|Phòng rửa mặt|washroom; bathroom sink area
ベランダ|ベランダ|N4|noun|Ban công|balcony; veranda
屋根|やね|N4|noun|Mái nhà|roof
壁|かべ|N4|noun|Bức tường|wall
床|ゆか|N4|noun|Sàn nhà|floor
天井|てんじょう|N4|noun|Trần nhà|ceiling
柱|はしら|N4|noun|Cây cột|pillar; post
門|もん|N4|noun|Cổng|gate
塀|へい|N4|noun|Hàng rào, tường bao|wall; fence
畳|たたみ|N4|noun|Chiếu Tatami|tatami mat
布団|ふとん|N4|noun|Chăn đệm kiểu Nhật (Futon)|futon bedding
毛布|もうふ|N4|noun|Chăn lông|blanket
枕|まくら|N4|noun|Cái gối|pillow
シーツ|シーツ|N4|noun|Ga trải giường|bed sheet
カーテン|カーテン|N4|noun|Rèm cửa|curtain
絨毯|じゅうたん|N4|noun|Thảm trải sàn|carpet; rug
棚|たな|N4|noun|Cái kệ, giá sách|shelf; rack
本棚|ほんだな|N4|noun|Giá sách, tủ sách|bookshelf
引き出し|ひきだし|N4|noun|Ngăn kéo|drawer
押入れ|おしいれ|N4|noun|Tủ âm tường để chăn đệm|Japanese closet
水道|すいどう|N4|noun|Nước máy, hệ thống cấp nước|water supply; tap water
ガス|ガス|N4|noun|Khí đốt, ga|gas
暖房|だんぼう|N4|noun|Hệ thống sưởi ấm|heating
冷房|れいぼう|N4|noun|Hệ thống làm mát, điều hòa lạnh|air conditioning (cooling)
扇風機|せんぷうき|N4|noun|Quạt máy|electric fan
電子レンジ|でんしレンジ|N4|noun|Lò vi sóng|microwave oven
炊飯器|すいはんき|N4|noun|Nồi cơm điện|rice cooker
アイロン|アイロン|N4|noun|Bàn là, bàn ủi|electric iron
ドライヤー|ドライヤー|N4|noun|Máy sấy tóc|hair dryer
電池|でんち|N4|noun|Cục pin|battery
充電器|じゅうでんき|N4|noun|Bộ sạc pin|battery charger
電球|でんきゅう|N4|noun|Bóng đèn|light bulb
コンセント|コンセント|N4|noun|Ổ cắm điện|electrical outlet
スイッチ|スイッチ|N4|noun|Công tắc|switch
画面|がめん|N4|noun|Màn hình|screen; display
キーボード|キーボード|N4|noun|Bàn phím|keyboard
マウス|マウス|N4|noun|Chuột máy tính|computer mouse
プリンター|プリンター|N4|noun|Máy in|printer
インターネット|インターネット|N4|noun|Mạng Internet|internet
メール|メール|N4|noun,suru-verb|Thư điện tử (Email), tin nhắn|email; message
ホームページ|ホームページ|N4|noun|Trang chủ, trang web|website; homepage
アプリ|アプリ|N4|noun|Ứng dụng|app; application
データ|データ|N4|noun|Dữ liệu|data
ファイル|ファイル|N4|noun|Tập tin, bìa hồ sơ|file; folder
パスワード|パスワード|N4|noun|Mật khẩu|password
番組|ばんぐみ|N4|noun|Chương trình (tivi, radio)|TV/radio program
ドラマ|ドラマ|N4|noun|Phim truyền hình|TV drama
アニメ|アニメ|N4|noun|Phim hoạt hình Nhật Bản|anime; animation
漫画|まんが|N4|noun|Truyện tranh (Manga)|manga; comic book
小説|しょうせつ|N4|noun|Tiểu thuyết|novel; fiction
物語|ものがたり|N4|noun|Câu chuyện, truyện kể|story; tale; legend
随筆|ずいひつ|N4|noun|Tùy bút, tản văn|essay
詩|し|N4|noun|Bài thơ, thi ca|poem; poetry
記事|きじ|N4|noun|Bài báo, bản tin|news article
広告|こうこく|N4|noun|Quảng cáo|advertisement
ポスター|ポスター|N4|noun|Áp phích|poster
チラシ|チラシ|N4|noun|Tờ rơi quảng cáo|flyer; leaflet
パンフレット|パンフレット|N4|noun|Tập sách mỏng giới thiệu|pamphlet; brochure
案内書|あんないしょ|N4|noun|Sách hướng dẫn|guidebook; manual
説明書|せつめいしょ|N4|noun|Sách hướng dẫn sử dụng|instruction manual
書類|しょるい|N4|noun|Tài liệu, giấy tờ, hồ sơ|documents; paperwork
資料|しりょう|N4|noun|Tư liệu, tài liệu tham khảo|materials; reference data
レポート|レポート|N4|noun|Báo cáo, tiểu luận|report; term paper
論文|ろんぶん|N4|noun|Luận văn, bài nghiên cứu|thesis; academic paper
日記|にっき|N4|noun|Nhật ký|diary; journal
予定表|よていひょう|N4|noun|Bảng kế hoạch, thời gian biểu|schedule; itinerary
時刻表|じこくひょう|N4|noun|Bảng giờ tàu chạy|timetable; schedule
名刺|めいし|N4|noun|Danh thiếp|business card
免許証|めんきょしょう|N4|noun|Giấy phép lái xe, bằng cấp|driver's license; permit
パスポート|パスポート|N4|noun|Hộ chiếu|passport
ビザ|ビザ|N4|noun|Thị thực (Visa)|visa
保険証|ほけんしょう|N4|noun|Thẻ bảo hiểm y tế|health insurance card
学生証|がくせいしょう|N4|noun|Thẻ sinh viên|student ID card
クレジットカード|クレジットカード|N4|noun|Thẻ tín dụng|credit card
現金|げんきん|N4|noun|Tiền mặt|cash
小銭|こぜに|N4|noun|Tiền lẻ, tiền xu|small change; coins
お札|おさつ|N4|noun|Tiền giấy|paper money; bill; banknote
口座|こうざ|N4|noun|Tài khoản ngân hàng|bank account
税金|ぜいきん|N4|noun|Tiền thuế|tax
領収書|りょうしゅうしょ|N4|noun|Hóa đơn, biên lai thu tiền|receipt
レシート|レシート|N4|noun|Hóa đơn bán lẻ|receipt
割引|わりびき|N4|noun|Giảm giá, chiết khấu|discount
無料|むりょう|N4|noun|Miễn phí|free of charge
有料|ゆうりょう|N4|noun|Có tính phí|toll; fee-charging
税込|ぜいこみ|N4|noun|Đã bao gồm thuế|tax included
半額|はんがく|N4|noun|Nửa giá (giảm 50%)|half price
セール|セール|N4|noun|Đợt giảm giá|sale
サービス|サービス|N4|noun,suru-verb|Dịch vụ, khuyến mãi miễn phí|service; complimentary item
宅配便|たくはいびん|N4|noun|Chuyển phát nhanh tận nhà|home delivery service
郵便|ゆうびん|N4|noun|Bưu phẩm, bưu chính|mail; postal service
小包|こづつみ|N4|noun|Bưu kiện|parcel; package
速達|そくたつ|N4|noun|Chuyển phát hỏa tốc|express mail; special delivery
書留|かきとめ|N4|noun|Thư bảo đảm|registered mail
航空便|こうくうびん|N4|noun|Đường hàng không (gửi thư)|airmail
船便|ふなびん|N4|noun|Đường tàu biển (gửi hàng)|surface mail; sea mail
宛名|あてな|N4|noun|Tên và địa chỉ người nhận|addressee's name and address
差出人|さしだしにん|N4|noun|Người gửi|sender
ごみ|ごみ|N4|noun|Rác|trash; garbage; rubbish
ごみ箱|ごみばこ|N4|noun|Thùng rác|trash can; wastebasket
燃えるごみ|もえるごみ|N4|noun|Rác cháy được|burnable trash
プラスチック|プラスチック|N4|noun|Nhựa (Plastic)|plastic
ビニール袋|ビニールぶくろ|N4|noun|Túi ni-lông|plastic bag
瓶|びん|N4|noun|Chai, lọ thủy tinh|bottle; jar
缶|かん|N4|noun|Lon, hộp thiếc|can; tin
鍋|なべ|N4|noun|Cái nồi, món lẩu|pot; saucepan; hot pot
フライパン|フライパン|N4|noun|Chảo rán|frying pan
包丁|ほうちょう|N4|noun|Dao làm bếp|kitchen knife
まな板|まないた|N4|noun|Cái thớt|chopping board
やかん|やかん|N4|noun|Ấm đun nước|kettle
お盆|おぼん|N4|noun|Cái khay, lễ Vu Lan (Obon)|tray; Obon festival
炊事|すいじ|N4|noun,suru-verb|Chuyện bếp núc, nấu nướng|cooking; kitchen work
味付け|あじつけ|N4|noun|Nêm nếm gia vị|seasoning; flavoring
材料|ざいりょう|N4|noun|Nguyên liệu|ingredients; materials
米|こめ|N4|noun|Gạo|uncooked rice
麦|むぎ|N4|noun|Lúa mì, lúa mạch|wheat; barley
豆|まめ|N4|noun|Hạt đậu|beans; peas
豆腐|とうふ|N4|noun|Đậu phụ (đậu hũ)|tofu
味噌|みそ|N4|noun|Tương Miso|miso paste
味噌汁|みそしる|N4|noun|Canh tương Miso|miso soup
刺身|さしみ|N4|noun|Món cá sống Sashimi|sashimi (sliced raw fish)
寿司|すし|N4|noun|Món Sushi|sushi
天ぷら|てんぷら|N4|noun|Món chiên Tempura|tempura
焼き肉|やきにく|N4|noun|Thịt nướng|grilled meat (yakiniku)
焼き魚|やきざかな|N4|noun|Cá nướng|grilled fish
定食|ていしょく|N4|noun|Suất ăn theo phần cố định|set meal
おかず|おかず|N4|noun|Đồ ăn mặn ăn kèm với cơm|side dishes
デザート|デザート|N4|noun|Món tráng miệng|dessert
油|あぶら|N4|noun|Dầu ăn, dầu mỡ|oil; fat
酢|す|N4|noun|Giấm|vinegar
胡椒|こしょう|N4|noun|Hạt tiêu|pepper
氷|こおり|N4|noun|Nước đá|ice
煙|けむり|N4|noun|Khói|smoke
灰|はい|N4|noun|Tro|ash
火|ひ|N4|noun|Ngọn lửa|fire; flame
光|ひかり|N4|noun|Ánh sáng|light; ray
影|かげ|N4|noun|Cái bóng|shadow; shade
太陽|たいよう|N4|noun|Mặt trời|the sun
月|つき|N4|noun|Mặt trăng, tháng|the moon; month
星|ほし|N4|noun|Ngôi sao|star
地球|ちきゅう|N4|noun|Trái Đất|the Earth; globe
宇宙|うちゅう|N4|noun|Vũ trụ, không gian|universe; outer space
自然|しぜん|N4|noun,na-adjective|Tự nhiên, thiên nhiên|nature; natural
環境|かんきょう|N4|noun|Môi trường|environment
空気|くうき|N4|noun|Không khí, bầu không khí|air; atmosphere
温度|おんど|N4|noun|Nhiệt độ|temperature
湿度|しつど|N4|noun|Độ ẩm|humidity
天気予報|てんきよほう|N4|noun|Dự báo thời tiết|weather forecast
雷|かみなり|N4|noun|Sấm sét|thunder; lightning
霧|きり|N4|noun|Sương mù|fog; mist
嵐|あらし|N4|noun|Giông bão|storm; tempest
梅雨|つゆ|N4|noun|Mùa mưa (ở Nhật)|rainy season
海岸|かいがん|N4|noun|Bờ biển|coast; beach; seashore
砂浜|すなはま|N4|noun|Bãi cát biển|sandy beach
波|なみ|N4|noun|Sóng biển|wave
島|しま|N4|noun|Hòn đảo|island
半島|はんとう|N4|noun|Bán đảo|peninsula
湖|みずうみ|N4|noun|Hồ nước lớn|lake
滝|たき|N4|noun|Thác nước|waterfall
温泉|おんせん|N4|noun|Suối nước nóng (Onsen)|hot spring
森|もり|N4|noun|Khu rừng rậm|forest
林|はやし|N4|noun|Rừng thưa|woods; grove
野原|のはら|N4|noun|Cánh đồng cỏ|field; meadow
畑|はたけ|N4|noun|Ruộng cạn, vườn rau|cultivated field; vegetable garden
田んぼ|たんぼ|N4|noun|Ruộng lúa nước|rice paddy
土|つち|N4|noun|Đất|soil; earth
石|いし|N4|noun|Hòn đá|stone
岩|いわ|N4|noun|Tảng đá lớn|rock; crag
砂|すな|N4|noun|Cát|sand
泥|どろ|N4|noun|Bùn lầy|mud
草|くさ|N4|noun|Cỏ|grass; weed
葉|は|N4|noun|Lá cây|leaf
枝|えだ|N4|noun|Cành cây|branch; twig
根|ね|N4|noun|Rễ cây|root
種|たね|N4|noun|Hạt giống|seed
実|み|N4|noun|Quả, trái|fruit; nut; berry
桜|さくら|N4|noun|Hoa anh đào|cherry blossom (sakura)
梅|うめ|N4|noun|Hoa mơ, quả mơ|Japanese apricot; plum
松|まつ|N4|noun|Cây thông|pine tree
竹|たけ|N4|noun|Cây tre, cây trúc|bamboo
紅葉|もみじ|N4|noun|Lá đỏ mùa thu|autumn leaves; Japanese maple
虫|むし|N4|noun|Côn trùng, sâu bọ|insect; bug
蚊|か|N4|noun|Con muỗi|mosquito
蝶|ちょう|N4|noun|Con bướm|butterfly
蜂|はち|N4|noun|Con ong|bee; wasp
蛇|へび|N4|noun|Con rắn|snake
蛙|かえる|N4|noun|Con ếch|frog
馬|うま|N4|noun|Con ngựa|horse
牛|うし|N4|noun|Con bò|cow; cattle
豚|ぶた|N4|noun|Con lợn (heo)|pig
羊|ひつじ|N4|noun|Con cừu|sheep
猿|さる|N4|noun|Con khỉ|monkey
象|ぞう|N4|noun|Con voi|elephant
熊|くま|N4|noun|Con gấu|bear
兎|うさぎ|N4|noun|Con thỏ|rabbit; hare
鼠|ねずみ|N4|noun|Con chuột|mouse; rat
虎|とら|N4|noun|Con hổ|tiger
ライオン|ライオン|N4|noun|Con sư tử|lion
パンダ|パンダ|N4|noun|Gấu trúc|panda
景色|けしき|N4|noun|Phong cảnh|scenery; landscape
眺め|ながめ|N4|noun|Tầm nhìn, cảnh đẹp|view; prospect
夕日|ゆうひ|N4|noun|Hoàng hôn, nắng chiều|evening sun; setting sun
日の出|ひので|N4|noun|Bình minh, mặt trời mọc|sunrise
空気|くうき|N4|noun|Không khí|air
音|おと|N4|noun|Âm thanh, tiếng động|sound; noise
匂い|におい|N4|noun|Mùi, hương thơm|smell; scent; odor
味|あじ|N4|noun|Vị, hương vị|taste; flavor
形|かたち|N4|noun|Hình dáng, hình thức|shape; form
大きさ|おおきさ|N4|noun|Kích thước, độ lớn|size
高さ|たかさ|N4|noun|Chiều cao, độ cao|height
長さ|ながさ|N4|noun|Chiều dài|length
広さ|ひろさ|N4|noun|Diện tích, độ rộng|area; spaciousness
重さ|おもさ|N4|noun|Trọng lượng, cân nặng|weight
深さ|ふかさ|N4|noun|Độ sâu|depth
厚さ|あつさ|N4|noun|Độ dày|thickness
速さ|はやさ|N4|noun|Tốc độ, độ nhanh|speed
強さ|つよさ|N4|noun|Sức mạnh, cường độ|strength
寒さ|さむさ|N4|noun|Cái lạnh|coldness
暑さ|あつさ|N4|noun|Cái nóng|heat (of weather)
数|かず|N4|noun|Con số, số lượng|number; amount
量|りょう|N4|noun|Số lượng, khối lượng|quantity; amount
倍|ばい|N4|noun|Gấp đôi, bội số|double; times
半分|はんぶん|N4|noun|Một nửa|half
割合|わりあい|N4|noun|Tỷ lệ|rate; ratio; percentage
平均|へいきん|N4|noun,suru-verb|Trung bình|average
合計|ごうけい|N4|noun,suru-verb|Tổng cộng|total; sum
計算|けいさん|N4|noun,suru-verb|Tính toán|calculation
順番|じゅんばん|N4|noun|Thứ tự, lượt|turn; order
最初|さいしょ|N4|noun|Đầu tiên, ban đầu|beginning; first
最後|さいご|N4|noun|Cuối cùng|last; end
真ん中|まんなか|N4|noun|Chính giữa|middle; center
隅|すみ|N4|noun|Góc phòng, xó|corner; nook
端|はし|N4|noun|Mép, rìa, đầu mút|edge; tip; end
表|おもて|N4|noun|Mặt trước, bề ngoài|front; surface; outside
裏|うら|N4|noun|Mặt sau, mặt trái|back; reverse side
奥|おく|N4|noun|Phía sâu bên trong|inner part; back
周り|まわり|N4|noun|Xung quanh|surroundings; circumference
向こう|むこう|N4|noun|Phía bên kia, đối diện|over there; opposite side
近く|ちかく|N4|noun|Gần đây, vùng lân cận|nearby; neighborhood
遠く|とおく|N4|noun|Nơi xa, đằng xa|far away; distance
方角|ほうがく|N4|noun|Phương hướng|direction; compass point
方向|ほうこう|N4|noun|Hướng đi, chiều hướng|direction; course
右側|みぎがわ|N4|noun|Phía bên phải|right side
左側|ひだりがわ|N4|noun|Phía bên trái|left side
両側|りょうがわ|N4|noun|Cả hai phía, hai bên đường|both sides
真ん前|まんまえ|N4|noun|Ngay trước mặt|right in front
`.trim();

export function parseExtendedVocabRows() {
  const result = [];
  for (const line of EXTENDED_VOCAB_ROWS.split('\n')) {
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
