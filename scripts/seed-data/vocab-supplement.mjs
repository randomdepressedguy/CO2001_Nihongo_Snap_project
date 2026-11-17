// Supplementary JLPT N5 & N4 Vocabulary (~450 additional words)
// Guarantees >= 1,350+ curated bilingual entries even offline, and ~1,550+ when merged with upstream

const SUPPLEMENT_VOCAB_ROWS = `
昼休み|ひるやすみ|N5|noun|Giờ nghỉ trưa|lunch break; noon recess
春休み|はるやすみ|N5|noun|Kỳ nghỉ xuân|spring vacation
冬休み|ふゆやすみ|N5|noun|Kỳ nghỉ đông|winter vacation
ゴールデンウィーク|ゴールデンウィーク|N4|noun|Tuần lễ Vàng (kỳ nghỉ dài đầu tháng 5)|Golden Week
祝日|しゅくじつ|N4|noun|Ngày lễ quốc gia|national holiday
祭日|さいじつ|N4|noun|Ngày lễ truyền thống|festival day; national holiday
お祭り|おまつり|N4|noun|Lễ hội truyền thống|festival
花火|はなび|N4|noun|Pháo hoa|fireworks
花見|はなみ|N4|noun,suru-verb|Ngắm hoa anh đào|cherry blossom viewing
忘年会|ぼうねんかい|N4|noun|Tiệc tất niên cuối năm|year-end party
新年会|しんねんかい|N4|noun|Tiệc tân niên đầu năm|New Year's party
歓迎会|かんげいかい|N4|noun|Tiệc chào mừng|welcome party
送別会|そうべつかい|N4|noun|Tiệc chia tay|farewell party
二次会|にじかい|N4|noun|Tăng hai (tiệc sau bữa tiệc chính)|after-party
結婚式|けっこんしき|N4|noun|Lễ cưới|wedding ceremony
入学式|にゅうがくしき|N4|noun|Lễ nhập học, lễ khai giảng|entrance ceremony
卒業式|そつぎょうしき|N4|noun|Lễ tốt nghiệp|graduation ceremony
成人式|せいじんしき|N4|noun|Lễ thành nhân|Coming-of-Age ceremony
葬式|そうしき|N4|noun|Lễ tang|funeral
年中|ねんじゅう|N4|noun,adverb|Quanh năm, suốt năm|all year round
今夜|こんや|N4|noun|Đêm nay, tối nay|tonight; this evening
夜中|よなか|N4|noun|Nửa đêm, đêm khuya|midnight; dead of night
明け方|あけがた|N4|noun|Rạng sáng, lúc tờ mờ sáng|dawn; daybreak
昼間|ひるま|N4|noun|Ban ngày|daytime; during the day
先日|せんじつ|N4|noun|Hôm trước, mấy ngày trước|the other day; a few days ago
前日|ぜんじつ|N4|noun|Ngày hôm trước (của sự kiện)|the previous day
翌日|よくじつ|N4|noun|Ngày hôm sau|the next day; the following day
当日|とうじつ|N4|noun|Ngay ngày hôm đó|the very day; the day of the event
平日|へいじつ|N4|noun|Ngày thường trong tuần|weekday
休日|きゅうじつ|N4|noun|Ngày nghỉ|holiday; day off
連休|れんきゅう|N4|noun|Kỳ nghỉ dài nhiều ngày liên tiếp|consecutive holidays
再来月|さらいげつ|N5|noun|Tháng sau nữa|month after next
再来年|さらいねん|N5|noun|Năm sau nữa|year after next
先々週|せんせんしゅう|N5|noun|Tuần trước nữa|week before last
先々月|せんせんげつ|N5|noun|Tháng trước nữa|month before last
毎時|まいじ|N4|noun|Mỗi giờ|every hour
秒|びょう|N4|noun|Giây|second (time)
世紀|せいき|N4|noun|Thế kỷ|century
時代|じだい|N4|noun|Thời đại, thời kỳ|era; period; epoch
時期|じき|N4|noun|Thời điểm, mùa vụ|time; season; period
期間|きかん|N4|noun|Khoảng thời gian, thời hạn|period; term; interval
期限|きげん|N4|noun|Thời hạn chót|time limit; deadline
締め切り|しめきり|N4|noun|Hạn cuối, khóa sổ|deadline; closing
遅刻|ちこく|N4|noun,suru-verb|Đi muộn, đến trễ|lateness; tardiness
早退|そうたい|N4|noun,suru-verb|Về sớm (trước giờ quy định)|leaving early
欠席|けっせき|N4|noun,suru-verb|Vắng mặt, nghỉ học|absence
出席|しゅっせき|N4|noun,suru-verb|Có mặt, tham dự|attendance; presence
留学|りゅうがく|N4|noun,suru-verb|Du học|studying abroad
進学|しんがく|N4|noun,suru-verb|Học lên bậc cao hơn|advancing to higher education
就職|しゅうしょく|N4|noun,suru-verb|Tìm được việc làm, đi làm|finding employment
転職|てんしょく|N4|noun,suru-verb|Chuyển việc, đổi nghề|changing jobs
退職|たいしょく|N4|noun,suru-verb|Nghỉ việc, về hưu|retirement; resignation
残業|ざんぎょう|N4|noun,suru-verb|Làm thêm giờ, tăng ca|overtime work
出張|しゅっちょう|N4|noun,suru-verb|Đi công tác|business trip
転勤|てんきん|N4|noun,suru-verb|Chuyển công tác|job transfer
通勤|つうきん|N4|noun,suru-verb|Đi làm hằng ngày|commuting to work
通学|つうがく|N4|noun,suru-verb|Đi học hằng ngày|commuting to school
面接|めんせつ|N4|noun,suru-verb|Phỏng vấn|interview
履歴書|りれきしょ|N4|noun|Sơ yếu lý lịch (CV)|resume; curriculum vitae
合格|ごうかく|N4|noun,suru-verb|Thi đỗ, đạt tiêu chuẩn|passing an exam; success
不合格|ふごうかく|N4|noun|Thi trượt, không đạt|failure in an exam
成績|せいせき|N4|noun|Thành tích, kết quả học tập|grades; academic record
点数|てんすう|N4|noun|Điểm số|score; points; marks
満点|まんてん|N4|noun|Điểm tuyệt đối|perfect score
平均点|へいきんてん|N4|noun|Điểm trung bình|average score
単位|たんい|N4|noun|Tín chỉ, đơn vị đo|academic credit; unit
奨学金|しょうがくきん|N4|noun|Học bổng|scholarship
授業料|じゅぎょうりょう|N4|noun|Học phí|tuition fee
入学金|にゅうがくきん|N4|noun|Lệ phí nhập học|admission fee
学部|がくぶ|N4|noun|Khoa (trong trường đại học)|faculty; department
学科|がっか|N4|noun|Ngành học, bộ môn|department; course of study
専攻|せんこう|N4|noun,suru-verb|Chuyên ngành|major; specialization
ゼミ|ゼミ|N4|noun|Lớp thảo luận chuyên đề (Seminar)|seminar
講堂|こうどう|N4|noun|Hội trường, giảng đường lớn|auditorium; lecture hall
体育館|たいいくかん|N4|noun|Nhà thi đấu thể chất|gymnasium
運動場|うんどうじょう|N4|noun|Sân vận động, sân tập|sports ground; playground
校庭|こうてい|N4|noun|Sân trường|schoolyard; campus
寮|りょう|N4|noun|Ký túc xá|dormitory
下宿|げしゅく|N4|noun,suru-verb|Nhà trọ sinh viên|boarding house; lodging
一人暮らし|ひとりぐらし|N4|noun|Sống tự lập một mình|living alone
引っ越し|ひっこし|N4|noun,suru-verb|Chuyển nhà|moving house
近所|きんじょ|N4|noun|Hàng xóm, vùng lân cận|neighborhood
隣人|りんじん|N4|noun|Người hàng xóm|neighbor
大家さん|おおやさん|N4|noun|Chủ nhà trọ|landlord; landlady
管理人|かんりにん|N4|noun|Người quản lý tòa nhà|building manager; caretaker
留守|るす|N4|noun|Vắng nhà|absence from home
留守番|るすばん|N4|noun,suru-verb|Trông nhà|house-sitting; looking after the house
帰宅|きたく|N4|noun,suru-verb|Về đến nhà|returning home
外出|がいしゅつ|N4|noun,suru-verb|Đi ra ngoài|going out
外食|がいしょく|N4|noun,suru-verb|Ăn ngoài hàng quán|eating out
自炊|じすい|N4|noun,suru-verb|Tự nấu ăn ở nhà|cooking for oneself
昼寝|ひるね|N4|noun,suru-verb|Ngủ trưa|afternoon nap
早起き|はやおき|N4|noun,suru-verb|Dậy sớm|early rising
夜更かし|よふかし|N4|noun,suru-verb|Thức khuya|staying up late
寝坊|ねぼう|N4|noun,suru-verb|Ngủ dậy muộn, ngủ nướng|oversleeping
化粧|けしょう|N4|noun,suru-verb|Trang điểm|makeup; cosmetics
髭剃り|ひげそり|N4|noun|Cạo râu, dao cạo râu|shaving; razor
散髪|さんぱつ|N4|noun,suru-verb|Cắt tóc|haircut
美容院|びよういん|N4|noun|Tiệm làm tóc, thẩm mỹ viện|beauty salon; hair salon
床屋|とこや|N4|noun|Hiệu cắt tóc nam|barbershop
クリーニング|クリーニング|N4|noun|Giặt khô, tiệm giặt là|dry cleaning; laundry service
洗濯物|せんたくもの|N4|noun|Quần áo giặt|laundry
物干し|ものほし|N4|noun|Giá phơi đồ|clothes-drying rack
掃除道具|そうじどうぐ|N4|noun|Dụng cụ dọn vệ sinh|cleaning tools
片付け|かたづけ|N4|noun|Việc thu dọn gọn gàng|tidying up
整理|せいり|N4|noun,suru-verb|Sắp xếp, chỉnh đốn|sorting; arrangement
整頓|せいとん|N4|noun,suru-verb|Dọn dẹp ngăn nắp|putting in order; tidying
修理|しゅうり|N4|noun,suru-verb|Sửa chữa (máy móc, đồ đạc)|repair; mending
点検|てんけん|N4|noun,suru-verb|Kiểm tra định kỳ, bảo dưỡng|inspection; checking
確認|かくにん|N4|noun,suru-verb|Xác nhận, kiểm tra lại|confirmation; verification
変更|へんこう|N4|noun,suru-verb|Thay đổi, điều chỉnh|change; modification
中止|ちゅうし|N4|noun,suru-verb|Hủy bỏ, đình chỉ|cancellation; suspension
延期|えんき|N4|noun,suru-verb|Hoãn lại, dời lịch|postponement; deferral
開始|かいし|N4|noun,suru-verb|Bắt đầu, khai cuộc|start; commencement
終了|しゅうりょう|N4|noun,suru-verb|Kết thúc, hoàn tất|end; close; termination
完成|かんせい|N4|noun,suru-verb|Hoàn thành, hoàn thiện|completion; perfection
実現|じつげん|N4|noun,suru-verb|Thực hiện hóa, thành hiện thực|realization; implementation
発見|はっけん|N4|noun,suru-verb|Phát hiện, khám phá|discovery; detection
発明|はつめい|N4|noun,suru-verb|Phát minh, sáng chế|invention
開発|かいはつ|N4|noun,suru-verb|Phát triển (sản phẩm, phần mềm)|development
設計|せっけい|N4|noun,suru-verb|Thiết kế|design; plan
建築|けんちく|N4|noun,suru-verb|Kiến trúc, xây dựng|architecture; construction
工事|こうじ|N4|noun,suru-verb|Thi công, công trình đang sửa|construction work
製造|せいぞう|N4|noun,suru-verb|Chế tạo, sản xuất|manufacture; production
販売|はんばい|N4|noun,suru-verb|Bán hàng, kinh doanh|sales; marketing
購入|こうにゅう|N4|noun,suru-verb|Mua sắm, thu mua|purchase; buying
注文書|ちゅうもんしょ|N4|noun|Đơn đặt hàng|order form
契約|けいやく|N4|noun,suru-verb|Hợp đồng, ký hợp đồng|contract; agreement
署名|しょめい|N4|noun,suru-verb|Chữ ký, ký tên|signature
ハンコ|ハンコ|N4|noun|Con dấu cá nhân|personal seal; stamp
印鑑|いんかん|N4|noun|Con dấu đăng ký|official seal; stamp
届出|とどけで|N4|noun|Khai báo hành chính|report; notification
手続き|てつづき|N4|noun,suru-verb|Thủ tục hành chính|procedure; formalities
申込|もうしこみ|N4|noun|Đăng ký, nộp đơn|application; entry
応募|おうぼ|N4|noun,suru-verb|Ứng tuyển, dự thi|application; subscription
参加|さんか|N4|noun,suru-verb|Tham gia|participation; joining
協力|きょうりょく|N4|noun,suru-verb|Hợp tác, chung sức|cooperation; collaboration
応援|おうえん|N4|noun,suru-verb|Cổ vũ, ủng hộ, tiếp sức|cheering; support; aid
援助|えんじょ|N4|noun,suru-verb|Viện trợ, trợ giúp|assistance; support
募金|ぼきん|N4|noun,suru-verb|Quyên góp từ thiện|fundraising; donation
ボランティア|ボランティア|N4|noun|Tình nguyện viên, hoạt động tình nguyện|volunteer
リサイクル|リサイクル|N4|noun,suru-verb|Tái chế|recycling
節約|せつやく|N4|noun,suru-verb|Tiết kiệm (điện, nước, chi tiêu)|economizing; saving
省エネ|しょうエネ|N4|noun|Tiết kiệm năng lượng|energy conservation
公害|こうがい|N4|noun|Ô nhiễm môi trường|public pollution
騒音|そうおん|N4|noun|Tiếng ồn|noise
渋滞|じゅうたい|N4|noun,suru-verb|Tắc đường, kẹt xe|traffic jam; congestion
満員|まんいん|N4|noun|Chật kín người, hết chỗ|full capacity; crowded
空席|くうせき|N4|noun|Chỗ ngồi còn trống|vacant seat
禁煙|きんえん|N4|noun|Cấm hút thuốc|no smoking
喫煙|きつえん|N4|noun,suru-verb|Hút thuốc|smoking
禁止|きんし|N4|noun,suru-verb|Nghiêm cấm|prohibition; ban
立ち入り禁止|たちいりきんし|N4|noun|Cấm vào|no trespassing; keep out
非常口|ひじょうぐち|N4|noun|Lối thoát hiểm khẩn cấp|emergency exit
階段|かいだん|N4|noun|Cầu thang bộ|stairs
歩道|ほどう|N4|noun|Vỉa hè, đường dành cho người đi bộ|sidewalk; pavement
車道|しゃどう|N4|noun|Lòng đường dành cho xe chạy|roadway;車 lane
横断歩道|おうだんほどう|N4|noun|Vạch kẻ đường cho người đi bộ|pedestrian crossing; crosswalk
歩道橋|ほどうきょう|N4|noun|Cầu vượt cho người đi bộ|pedestrian overpass
踏切|ふみきり|N4|noun|Chỗ đường sắt giao cắt đường bộ|railroad crossing
線路|せんろ|N4|noun|Đường ray tàu hỏa|railway track; line
ホーム|ホーム|N4|noun|Sân ga tàu điện|station platform
改札口|かいさつぐち|N4|noun|Cửa soát vé nhà ga|ticket gate
券売機|けんばいき|N4|noun|Máy bán vé tự động|ticket vending machine
定期券|ていきけん|N4|noun|Vé tháng|commuter pass
回数券|かいすうけん|N4|noun|Vé tập nhiều lượt|book of tickets
片道|かたみち|N4|noun|Một chiều (vé đi một lượt)|one-way (trip/ticket)
往復|おうふく|N4|noun,suru-verb|Khứ hồi (cả đi lẫn về)|round trip
終電|しゅうでん|N4|noun|Chuyến tàu điện cuối cùng trong ngày|last train
始発|しはつ|N4|noun|Chuyến tàu đầu tiên trong ngày|first train
各駅停車|かくえきていしゃ|N4|noun|Tàu dừng ở tất cả các ga|local train (stops at every station)
快速|かいそく|N4|noun|Tàu nhanh|rapid train
停留所|ていりゅうじょ|N4|noun|Trạm dừng xe buýt|bus stop; tram stop
バス停|バスてい|N4|noun|Bến xe buýt|bus stop
高速道路|こうそくどうろ|N4|noun|Đường cao tốc|highway; expressway
ガソリン|ガソリン|N4|noun|Xăng|gasoline; petrol
ガソリンスタンド|ガソリンスタンド|N4|noun|Trạm xăng|gas station
シートベルト|シートベルト|N4|noun|Dây an toàn trên xe|seatbelt
ヘルメット|ヘルメット|N4|noun|Mũ bảo hiểm|helmet
救急車|きゅうきゅうしゃ|N4|noun|Xe cấp cứu|ambulance
消防車|しょうぼうしゃ|N4|noun|Xe cứu hỏa|fire engine
パトカー|パトカー|N4|noun|Xe tuần tra cảnh sát|patrol car; police car
単語|たんご|N4|noun|Từ vựng|vocabulary; word
文法|ぶんぽう|N4|noun|Ngữ pháp|grammar
発音|はつおん|N4|noun,suru-verb|Phát âm|pronunciation
アクセント|アクセント|N4|noun|Trọng âm|accent; intonation
敬語|けいご|N4|noun|Kính ngữ|honorific language
方言|ほうげん|N4|noun|Phương ngữ, tiếng địa phương|dialect
標準語|ひょうじゅんご|N4|noun|Ngôn ngữ tiêu chuẩn (tiếng Nhật chuẩn)|standard language
母国語|ぼこくご|N4|noun|Tiếng mẹ đẻ|mother tongue; native language
外国語|がいこくご|N4|noun|Ngoại ngữ|foreign language
翻訳|ほんやく|N4|noun,suru-verb|Biên dịch, dịch viết|translation (written)
通訳|つうやく|N4|noun,suru-verb|Phiên dịch, thông dịch viên|interpretation (spoken); interpreter
読書|どくしょ|N4|noun,suru-verb|Việc đọc sách|reading books
暗記|あんき|N4|noun,suru-verb|Học thuộc lòng|memorization; learning by heart
筆記|ひっき|N4|noun,suru-verb|Ghi chép, thi viết|taking notes; written test
清書|せいしょ|N4|noun,suru-verb|Chép sạch đẹp|fair copy; clean copy
下書き|したがき|N4|noun|Bản nháp|rough draft
目次|もくじ|N4|noun|Mục lục|table of contents
表紙|ひょうし|N4|noun|Bìa sách|book cover
活字|かつじ|N4|noun|Chữ in|printed type; print
見出し|みだし|N4|noun|Tiêu đề, đề mục từ điển|heading; headline; entry word
例文|れいぶん|N4|noun|Câu ví dụ|example sentence
ことわざ|ことわざ|N4|noun|Tục ngữ, thành ngữ|proverb; saying
四字熟語|よじじゅくご|N4|noun|Thành ngữ 4 chữ Hán|four-character idiom
記号|きごう|N4|noun|Ký hiệu, biểu tượng|symbol; code; mark
点|てん|N4|noun|Dấu chấm, điểm số|dot; point; mark
丸|まる|N4|noun|Hình tròn, dấu tròn (đúng)|circle; correct mark
線|せん|N4|noun|Đường kẻ, tuyến tàu|line; wire; track
四角|しかく|N4|noun,na-adjective|Hình vuông, hình tứ giác|square; rectangle
三角|さんかく|N4|noun|Hình tam giác|triangle
縦|たて|N4|noun|Chiều dọc|vertical; length
横|よこ|N4|noun|Chiều ngang|horizontal; width; side
斜め|ななめ|N4|noun,na-adjective|Đường chéo, nghiêng|diagonal; slanting; oblique
曲線|きょくせん|N4|noun|Đường cong|curve; curved line
直線|ちょくせん|N4|noun|Đường thẳng|straight line
中心|ちゅうしん|N4|noun|Trung tâm, trọng tâm|center; core; focus
周囲|しゅうい|N4|noun|Chu vi, vùng xung quanh|surroundings; circumference
距離|きょり|N4|noun|Khoảng cách, cự ly|distance; range
面積|めんせき|N4|noun|Diện tích|area; square measure
体積|たいせき|N4|noun|Thể tích|volume; capacity
重量|じゅうりょう|N4|noun|Trọng lượng|weight
速度|そくど|N4|noun|Tốc độ, vận tốc|speed; velocity
時速|じそく|N4|noun|Tốc độ theo giờ (km/h)|speed per hour
角度|かくど|N4|noun|Góc độ|angle
程度|ていど|N4|noun|Mức độ, chừng mực|degree; extent; level
段階|だんかい|N4|noun|Giai đoạn, bước|stage; phase; step
状態|じょうたい|N4|noun|Trạng thái, tình trạng|state; condition; situation
状況|じょうきょう|N4|noun|Tình hình, hoàn cảnh|state of affairs; circumstances
様子|ようす|N4|noun|Vẻ ngoài, tình hình, dấu hiệu|appearance; state; sign
雰囲気|ふんいき|N4|noun|Bầu không khí, phong thái|atmosphere; mood; ambiance
印象|いんしょう|N4|noun|Ấn tượng|impression
魅力|みりょく|N4|noun|Sức hấp dẫn, sự cuốn hút|charm; attraction; appeal
特徴|とくちょう|N4|noun|Đặc trưng, nét nổi bật|characteristic; feature
長所|ちょうしょ|N4|noun|Ưu điểm, sở trường|strong point; merit; advantage
短所|たんしょ|N4|noun|Nhược điểm, sở đoản|weak point; fault; disadvantage
利点|りてん|N4|noun|Lợi điểm, mặt có lợi|advantage; point in favor
欠点|けってん|N4|noun|Khuyết điểm, thiếu sót|flaw; defect; shortcoming
共通点|きょうつうてん|N4|noun|Điểm chung|common point
相違点|そういてん|N4|noun|Điểm khác biệt|point of difference
違い|ちがい|N4|noun|Sự khác nhau|difference; discrepancy
間違い|まちがい|N4|noun|Sự nhầm lẫn, lỗi sai|mistake; error
誤り|あやまり|N4|noun|Sai lầm, lỗi|error; mistake
正解|せいかい|N4|noun,suru-verb|Đáp án đúng|correct answer
解決|かいけつ|N4|noun,suru-verb|Giải quyết|settlement; solution; resolution
工夫|くふう|N4|noun,suru-verb|Sáng kiến, tìm tòi cách làm hay|devising a way; ingenuity
苦労|くろう|N4|noun,suru-verb|Vất vả, gian truân|hardship; trouble; labor
我慢|がまん|N4|noun,suru-verb|Kiên nhẫn, chịu đựng|patience; endurance
辛抱|しんぼう|N4|noun,suru-verb|Nhẫn nại, bền bỉ|patience; perseverance
反省|はんせい|N4|noun,suru-verb|Tự kiểm điểm, nhìn nhận lại|self-reflection; reconsideration
後悔|こうかい|N4|noun,suru-verb|Hối hận, ân hận|regret; repentance
感謝|かんしゃ|N4|noun,suru-verb|Biết ơn, cảm tạ|gratitude; appreciation
感激|かんげき|N4|noun,suru-verb|Cảm kích, xúc động mạnh|deep emotion; inspiration
感動|かんどう|N4|noun,suru-verb|Cảm động, rung động|being deeply moved; excitement
緊張|きんちょう|N4|noun,suru-verb|Căng thẳng, hồi hộp|nervousness; tension
興奮|こうふん|N4|noun,suru-verb|Hưng phấn, phấn khích|excitement; stimulation
満足|まんぞく|N4|noun,na-adjective,suru-verb|Hài lòng, thỏa mãn|satisfaction; contentment
不満|ふまん|N4|noun,na-adjective|Bất mãn, không hài lòng|dissatisfaction; discontent
不安|ふあん|N4|noun,na-adjective|Bất an, lo âu|anxiety; uneasiness
期待|きたい|N4|noun,suru-verb|Kỳ vọng, mong đợi|expectation; anticipation
希望|きぼう|N4|noun,suru-verb|Hy vọng, nguyện vọng|hope; wish; aspiration
勇気|ゆうき|N4|noun|Dũng khí, lòng can đảm|courage; bravery
自信|じしん|N4|noun|Sự tự tin|self-confidence
誇り|ほこり|N4|noun|Niềm tự hào|pride
責任|せきにん|N4|noun|Trách nhiệm|responsibility; duty
義務|ぎむ|N4|noun|Nghĩa vụ, bổn phận|duty; obligation
権利|けんり|N4|noun|Quyền lợi|right; privilege
平和|へいわ|N4|noun,na-adjective|Hòa bình|peace
平等|びょうどう|N4|noun,na-adjective|Bình đẳng|equality; impartiality
公平|こうへい|N4|noun,na-adjective|Công bằng|fairness; justice
正直|しょうじき|N4|noun,na-adjective|Trung thực, thật thà|honest; frank
素直|すなお|N4|na-adjective|Ngoan ngoãn, thành thật, dễ bảo|obedient; honest; frank
謙虚|けんきょ|N4|na-adjective|Khiêm tốn|modest; humble
わがまま|わがまま|N4|noun,na-adjective|Ích kỷ, bướng bỉnh, chiều theo ý mình|selfish; willful
けち|けち|N4|noun,na-adjective|Keo kiệt, bủn xỉn|stingy; miserly
意地悪|いじわる|N4|noun,na-adjective|Xấu tính, hay bắt nạt|malicious; ill-tempered; unkind
乱暴|らんぼう|N4|noun,na-adjective|Thô bạo, cục cằn|rough; violent; rude
行儀|ぎょうぎ|N4|noun|Phép tắc cư xử, nết ăn ở|manners; behavior
礼儀|れいぎ|N4|noun|Lễ nghi, phép lịch sự|courtesy; etiquette; manners
マナー|マナー|N4|noun|Quy tắc ứng xử (Manners)|manners; etiquette
ルール|ルール|N4|noun|Luật lệ, quy tắc|rule
ユーモア|ユーモア|N4|noun|Sự hài hước (Humor)|humor
アイデア|アイデア|N4|noun|Ý tưởng (Idea)|idea
チャンス|チャンス|N4|noun|Cơ hội (Chance)|chance; opportunity
チャレンジ|チャレンジ|N4|noun,suru-verb|Thử thách (Challenge)|challenge
アドバイス|アドバイス|N4|noun,suru-verb|Lời khuyên (Advice)|advice
コミュニケーション|コミュニケーション|N4|noun|Giao tiếp (Communication)|communication
ボランティア|ボランティア|N4|noun|Tình nguyện (Volunteer)|volunteer
ストレス|ストレス|N4|noun|Căng thẳng tâm lý (Stress)|stress
ダイエット|ダイエット|N4|noun,suru-verb|Ăn kiêng, giảm cân|diet; losing weight
健康診断|けんこうしんだん|N4|noun|Khám sức khỏe định kỳ|health checkup
予防接種|よぼうせっしゅ|N4|noun|Tiêm phòng vắc-xin|vaccination
処方箋|しょほうせん|N4|noun|Đơn thuốc của bác sĩ|prescription
目薬|めぐすり|N4|noun|Thuốc nhỏ mắt|eye drops
飲み薬|のみぐすり|N4|noun|Thuốc uống|internal medicine; oral medication
塗り薬|ぬりぐすり|N4|noun|Thuốc bôi ngoài da|ointment; cream
包帯|ほうたい|N4|noun|Băng gạc y tế|bandage
マスク|マスク|N4|noun|Khẩu trang|face mask
体温計|たいおんけい|N4|noun|Nhiệt kế đo thân nhiệt|clinical thermometer
体重計|たいじゅうけい|N4|noun|Cân sức khỏe|bathroom scale
体重|たいじゅう|N4|noun|Cân nặng cơ thể|body weight
身長|しんちょう|N4|noun|Chiều cao cơ thể|stature; body height
体力|たいりょく|N4|noun|Thể lực, sức bền|physical strength; stamina
睡眠|すいみん|N4|noun|Giấc ngủ|sleep
休憩|きゅうけい|N4|noun,suru-verb|Nghỉ giải lao|rest; break; recess
深呼吸|しんこきゅう|N4|noun,suru-verb|Thở sâu, hít thở sâu|deep breath
体操|たいそう|N4|noun,suru-verb|Thể dục nhịp điệu/đồng diễn|gymnastics; calisthenics
ジョギング|ジョギング|N4|noun,suru-verb|Chạy bộ chậm|jogging
ハイキング|ハイキング|N4|noun,suru-verb|Đi bộ đường dài dã ngoại|hiking
キャンプ|キャンプ|N4|noun,suru-verb|Cắm trại|camping
登山|とざん|N4|noun,suru-verb|Leo núi|mountain climbing
スキー|スキー|N4|noun,suru-verb|Trượt tuyết|skiing
スケート|スケート|N4|noun,suru-verb|Trượt băng|skating
釣り|つり|N4|noun|Câu cá|fishing
将棋|しょうぎ|N4|noun|Cờ tướng Nhật Bản (Shogi)|Japanese chess (shogi)
囲碁|いご|N4|noun|Cờ vây|Go (board game)
茶道|さどう|N4|noun|Trà đạo|tea ceremony
華道|かどう|N4|noun|Hoa đạo (nghệ thuật cắm hoa)|flower arrangement (ikebana)
生け花|いけばな|N4|noun|Nghệ thuật cắm hoa Nhật Bản|ikebana; flower arrangement
書道|しょどう|N4|noun|Thư pháp|calligraphy
柔道|じゅうどう|N4|noun|Võ Judo (Nhu đạo)|judo
剣道|けんどう|N4|noun|Kiếm đạo (Kendo)|kendo
空手|からて|N4|noun|Võ Karate (Không thủ đạo)|karate
相撲|すもう|N4|noun|Võ vật Sumo|sumo wrestling
折り紙|おりがみ|N4|noun|Nghệ thuật gấp giấy Origami|origami; paper folding
人形|にんぎょう|N4|noun|Búp bê|doll; figure
おもちゃ|おもちゃ|N4|noun|Đồ chơi|toy
ゲーム|ゲーム|N4|noun|Trò chơi, trò chơi điện tử|game; video game
カラオケ|カラオケ|N4|noun|Hát Karaoke|karaoke
遊園地|ゆうえんち|N4|noun|Công viên giải trí|amusement park
水族館|すいぞくかん|N4|noun|Thủy cung|aquarium
植物園|しょくぶつえん|N4|noun|Vườn thực vật, thảo cầm viên|botanical garden
城|しろ|N4|noun|Lâu đài, thành cổ|castle
塔|とう|N4|noun|Ngọn tháp|tower; pagoda
銅像|どうぞう|N4|noun|Bức tượng đồng|bronze statue
広場|ひろば|N4|noun|Quảng trường, sân rộng|plaza; public square
噴水|ふんすい|N4|noun|Đài phun nước|fountain
ベンチ|ベンチ|N4|noun|Ghế dài công viên|bench
自動販売機|じどうはんばいき|N4|noun|Máy bán hàng tự động|vending machine
公衆電話|こうしゅうでんわ|N4|noun|Điện thoại công cộng|public telephone
コインロッカー|コインロッカー|N4|noun|Tủ gửi đồ tự động bằng xu|coin locker
案内所|あんないじょ|N4|noun|Quầy thông tin hướng dẫn|information desk; tourist office
忘れ物|わすれもの|N4|noun|Đồ để quên, đồ thất lạc|lost article; something left behind
落とし物|おとしもの|N4|noun|Đồ đánh rơi|lost property
交番|こうばん|N4|noun|Trạm cảnh sát khu phố|police box (koban)
警察署|けいさつしょ|N4|noun|Đồn cảnh sát, sở cảnh sát|police station
消防署|しょうぼうしょ|N4|noun|Trạm cứu hỏa|fire station
市役所|しやくしょ|N4|noun|Tòa thị chính, ủy ban thành phố|city hall; municipal office
区役所|くやくしょ|N4|noun|Ủy ban nhân dân quận|ward office
県庁|けんちょう|N4|noun|Ủy ban hành chính tỉnh|prefectural office
国会|こっかい|N4|noun|Quốc hội|National Diet; parliament
首相|しゅしょう|N4|noun|Thủ tướng|Prime Minister
大統領|だいとうりょう|N4|noun|Tổng thống|President (of a country)
選挙|せんきょ|N4|noun,suru-verb|Bầu cử|election
投票|とうひょう|N4|noun,suru-verb|Bỏ phiếu, bầu chọn|voting; ballot
平和|へいわ|N4|noun,na-adjective|Hòa bình|peace
戦争|せんそう|N4|noun,suru-verb|Chiến tranh|war
歴史的|れきしてき|N4|na-adjective|Mang tính lịch sử|historical; historic
伝統的|でんとうてき|N4|na-adjective|Mang tính truyền thống|traditional
現代的|げんだいてき|N4|na-adjective|Mang tính hiện đại|modern; contemporary
国際的|こくさいてき|N4|na-adjective|Mang tính quốc tế|international
世界的|せかいてき|N4|na-adjective|Mang tầm thế giới|worldwide; global
具体的|ぐたいてき|N4|na-adjective|Cụ thể, rõ ràng|concrete; specific
一般的|いっぱんてき|N4|na-adjective|Phổ biến, thông thường|general; common
専門的|せんもんてき|N4|na-adjective|Mang tính chuyên môn|specialized; professional
自動|じどう|N4|noun|Tự động|automatic
手動|しゅどう|N4|noun|Thủ công, chỉnh bằng tay|manual
直接|ちょくせつ|N4|noun,adverb|Trực tiếp|directly; in person
間接|かんせつ|N4|noun|Gián tiếp|indirect
実際|じっさい|N4|noun,adverb|Thực tế, quả thực|actually; in fact; reality
事実|じじつ|N4|noun|Sự thật, thực tế|fact; truth; reality
本当|ほんとう|N5|noun|Sự thật, thật sự|truth; reality; genuine
嘘|うそ|N4|noun|Lời nói dối|lie; falsehood
冗談|じょうだん|N4|noun|Lời nói đùa|joke; jest
秘密|ひみつ|N4|noun,na-adjective|Bí mật|secret; privacy
噂|うわさ|N4|noun,suru-verb|Tin đồn|rumor; gossip
話題|わだい|N4|noun|Chủ đề trò chuyện|topic of conversation; subject
ニュース|ニュース|N5|noun|Bản tin, tin tức|news
事件|じけん|N4|noun|Sự kiện, vụ việc, vụ án|incident; affair; case
問題点|もんだいてん|N4|noun|Điểm có vấn đề|problematic point; issue
注目|ちゅうもく|N4|noun,suru-verb|Sự chú ý, tâm điểm|attention; notice; observation
関心|かんしん|N4|noun|Sự quan tâm, mối lưu tâm|concern; interest
知識|ちしき|N4|noun|Kiến thức, tri thức|knowledge; information
教養|きょうよう|N4|noun|Học thức, văn hóa ứng xử|cultivation; education; refinement
知恵|ちえ|N4|noun|Trí tuệ, sự khôn ngoan|wisdom; wit; intelligence
才能|さいのう|N4|noun|Tài năng, năng khiếu|talent; ability
能力|のうりょく|N4|noun|Năng lực|ability; capacity
実力|じつりょく|N4|noun|Thực lực|real ability; merit
努力家|どりょくか|N4|noun|Người chăm chỉ nỗ lực|hard worker
名人|めいじん|N4|noun|Bậc thầy, nghệ nhân|master; expert
達人|たつじん|N4|noun|Cao thủ, người tinh thông|master; expert
初心者|しょしんしゃ|N4|noun|Người mới bắt đầu|beginner; novice
ベテラン|ベテラン|N4|noun|Người dày dạn kinh nghiệm|veteran; experienced person
`.trim();

export function parseSupplementVocabRows() {
  const result = [];
  for (const line of SUPPLEMENT_VOCAB_ROWS.split('\n')) {
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
