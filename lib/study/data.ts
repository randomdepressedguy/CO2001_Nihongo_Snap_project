import type { Word } from './core';
// Original starter vocabulary. Level labels describe this course, not official JLPT lists.
const rows=`猫|ねこ|neko|con mèo|cat|animals
犬|いぬ|inu|con chó|dog|animals
鳥|とり|tori|con chim|bird|animals
魚|さかな|sakana|cá|fish|food
りんご|りんご|ringo|quả táo|apple|food
水|みず|mizu|nước|water|food
お茶|おちゃ|ocha|trà|tea|food
ご飯|ごはん|gohan|cơm; bữa ăn|rice; meal|food
パン|パン|pan|bánh mì|bread|food
卵|たまご|tamago|trứng|egg|food
牛乳|ぎゅうにゅう|gyuunyuu|sữa|milk|food
コーヒー|コーヒー|koohii|cà phê|coffee|food
肉|にく|niku|thịt|meat|food
野菜|やさい|yasai|rau|vegetables|food
果物|くだもの|kudamono|trái cây|fruit|food
本|ほん|hon|sách|book|objects
机|つくえ|tsukue|bàn|desk|objects
椅子|いす|isu|ghế|chair|objects
時計|とけい|tokei|đồng hồ|clock; watch|objects
傘|かさ|kasa|ô; dù|umbrella|objects
鞄|かばん|kaban|cặp; túi xách|bag|objects
靴|くつ|kutsu|giày|shoes|objects
鍵|かぎ|kagi|chìa khóa|key|objects
電話|でんわ|denwa|điện thoại|telephone|objects
写真|しゃしん|shashin|ảnh|photograph|objects
鉛筆|えんぴつ|enpitsu|bút chì|pencil|objects
紙|かみ|kami|giấy|paper|objects
服|ふく|fuku|quần áo|clothes|objects
眼鏡|めがね|megane|kính mắt|glasses|objects
学校|がっこう|gakkou|trường học|school|places
大学|だいがく|daigaku|đại học|university|places
図書館|としょかん|toshokan|thư viện|library|places
駅|えき|eki|nhà ga|station|places
病院|びょういん|byouin|bệnh viện|hospital|places
公園|こうえん|kouen|công viên|park|places
銀行|ぎんこう|ginkou|ngân hàng|bank|places
店|みせ|mise|cửa hàng|shop|places
家|いえ|ie|ngôi nhà|house|places
部屋|へや|heya|phòng|room|places
会社|かいしゃ|kaisha|công ty|company|places
先生|せんせい|sensei|giáo viên|teacher|people
学生|がくせい|gakusei|học sinh; sinh viên|student|people
友達|ともだち|tomodachi|bạn bè|friend|people
家族|かぞく|kazoku|gia đình|family|people
母|はは|haha|mẹ (của mình)|my mother|people
父|ちち|chichi|bố (của mình)|my father|people
兄|あに|ani|anh trai (của mình)|my older brother|people
姉|あね|ane|chị gái (của mình)|my older sister|people
子供|こども|kodomo|trẻ em|child|people
人|ひと|hito|người|person|people
私|わたし|watashi|tôi|I|people
日本語|にほんご|nihongo|tiếng Nhật|Japanese language|study
英語|えいご|eigo|tiếng Anh|English language|study
言葉|ことば|kotoba|từ; ngôn ngữ|word; language|study
名前|なまえ|namae|tên|name|study
宿題|しゅくだい|shukudai|bài tập về nhà|homework|study
質問|しつもん|shitsumon|câu hỏi|question|study
今日|きょう|kyou|hôm nay|today|time
明日|あした|ashita|ngày mai|tomorrow|time
昨日|きのう|kinou|hôm qua|yesterday|time
朝|あさ|asa|buổi sáng|morning|time
昼|ひる|hiru|buổi trưa|noon|time
夜|よる|yoru|buổi tối|night|time
毎日|まいにち|mainichi|mỗi ngày|every day|time
今|いま|ima|bây giờ|now|time
時間|じかん|jikan|thời gian; giờ|time; hours|time
月曜日|げつようび|getsuyoubi|thứ Hai|Monday|time
日曜日|にちようび|nichiyoubi|Chủ nhật|Sunday|time
電車|でんしゃ|densha|tàu điện|train|travel
バス|バス|basu|xe buýt|bus|travel
自転車|じてんしゃ|jitensha|xe đạp|bicycle|travel
車|くるま|kuruma|ô tô|car|travel
切符|きっぷ|kippu|vé|ticket|travel
地図|ちず|chizu|bản đồ|map|travel
旅行|りょこう|ryokou|du lịch|travel|travel
天気|てんき|tenki|thời tiết|weather|nature
雨|あめ|ame|mưa|rain|nature
雪|ゆき|yuki|tuyết|snow|nature
山|やま|yama|núi|mountain|nature
川|かわ|kawa|sông|river|nature
海|うみ|umi|biển|sea|nature
花|はな|hana|hoa|flower|nature
木|き|ki|cây|tree|nature
空|そら|sora|bầu trời|sky|nature
食べる|たべる|taberu|ăn|to eat|verbs
飲む|のむ|nomu|uống|to drink|verbs
行く|いく|iku|đi|to go|verbs
来る|くる|kuru|đến|to come|verbs
帰る|かえる|kaeru|trở về|to return|verbs
見る|みる|miru|xem; nhìn|to see; watch|verbs
聞く|きく|kiku|nghe; hỏi|to listen; ask|verbs
読む|よむ|yomu|đọc|to read|verbs
書く|かく|kaku|viết|to write|verbs
話す|はなす|hanasu|nói|to speak|verbs
買う|かう|kau|mua|to buy|verbs
待つ|まつ|matsu|đợi|to wait|verbs
寝る|ねる|neru|ngủ|to sleep|verbs
起きる|おきる|okiru|thức dậy|to wake up|verbs
勉強する|べんきょうする|benkyou suru|học|to study|verbs
大きい|おおきい|ookii|to; lớn|big|adjectives
小さい|ちいさい|chiisai|nhỏ|small|adjectives
新しい|あたらしい|atarashii|mới|new|adjectives
古い|ふるい|furui|cũ|old|adjectives
高い|たかい|takai|cao; đắt|high; expensive|adjectives
安い|やすい|yasui|rẻ|inexpensive|adjectives
おいしい|おいしい|oishii|ngon|delicious|adjectives
暑い|あつい|atsui|nóng (thời tiết)|hot weather|adjectives
寒い|さむい|samui|lạnh (thời tiết)|cold weather|adjectives
楽しい|たのしい|tanoshii|vui|enjoyable|adjectives
静か|しずか|shizuka|yên tĩnh|quiet|adjectives
便利|べんり|benri|tiện lợi|convenient|adjectives
予約|よやく|yoyaku|đặt trước|reservation|N4
注文|ちゅうもん|chuumon|gọi món; đặt hàng|order|N4
経験|けいけん|keiken|kinh nghiệm|experience|N4
予定|よてい|yotei|dự định; lịch trình|plan|N4
約束|やくそく|yakusoku|lời hứa; cuộc hẹn|promise; appointment|N4
必要|ひつよう|hitsuyou|cần thiết|necessary|N4
説明|せつめい|setsumei|giải thích|explanation|N4
練習|れんしゅう|renshuu|luyện tập|practice|N4
準備|じゅんび|junbi|chuẩn bị|preparation|N4
文化|ぶんか|bunka|văn hóa|culture|N4
料理|りょうり|ryouri|món ăn; nấu ăn|cooking; cuisine|N4
生活|せいかつ|seikatsu|cuộc sống|daily life|N4`;
const examples:Record<string,[string,string,string]>={
地図:['地図で駅を探します。','Tôi tìm nhà ga trên bản đồ.','I look for the station on a map.'],
"猫":["猫が窓のそばにいます。", "Có một con mèo bên cửa sổ.", "There is a cat by the window."],
"犬":["毎朝、犬と散歩します。", "Mỗi sáng tôi đi dạo với chó.", "I walk my dog every morning."],
"鳥":["木の上に鳥がいます。", "Có một con chim trên cây.", "There is a bird in the tree."],
"魚":["晩ご飯に魚を食べます。", "Tôi ăn cá vào bữa tối.", "I eat fish for dinner."],
"りんご":["りんごを一つください。", "Cho tôi một quả táo.", "One apple, please."],
"水":["水を飲んでください。", "Hãy uống nước nhé.", "Please drink some water."],
"お茶":["一緒にお茶を飲みませんか。", "Bạn uống trà cùng tôi nhé?", "Would you like to have tea together?"],
"ご飯":["家族とご飯を食べます。", "Tôi dùng bữa cùng gia đình.", "I have a meal with my family."],
"パン":["朝ご飯にパンを食べます。", "Tôi ăn bánh mì vào bữa sáng.", "I eat bread for breakfast."],
"卵":["卵を二つ買いました。", "Tôi đã mua hai quả trứng.", "I bought two eggs."],
"牛乳":["毎朝、牛乳を飲みます。", "Mỗi sáng tôi uống sữa.", "I drink milk every morning."],
"コーヒー":["コーヒーを一杯ください。", "Cho tôi một tách cà phê.", "A cup of coffee, please."],
"肉":["今日は肉を食べません。", "Hôm nay tôi không ăn thịt.", "I am not eating meat today."],
"野菜":["野菜をたくさん食べます。", "Tôi ăn nhiều rau.", "I eat a lot of vegetables."],
"果物":["どんな果物が好きですか。", "Bạn thích loại trái cây nào?", "What kind of fruit do you like?"],
"本":["図書館で本を借りました。", "Tôi đã mượn sách ở thư viện.", "I borrowed a book from the library."],
"机":["机の上に本があります。", "Có một quyển sách trên bàn.", "There is a book on the desk."],
"椅子":["この椅子に座ってもいいですか。", "Tôi ngồi ghế này được không?", "May I sit in this chair?"],
"時計":["この時計は少し古いです。", "Chiếc đồng hồ này hơi cũ.", "This watch is a little old."],
"傘":["雨ですから、傘を持っていきます。", "Vì trời mưa nên tôi mang theo ô.", "It is raining, so I am taking an umbrella."],
"鞄":["鞄の中に鍵があります。", "Chìa khóa ở trong túi.", "The key is in the bag."],
"靴":["新しい靴を買いました。", "Tôi đã mua đôi giày mới.", "I bought new shoes."],
"鍵":["家の鍵を探しています。", "Tôi đang tìm chìa khóa nhà.", "I am looking for my house key."],
"電話":["友達に電話をかけます。", "Tôi gọi điện cho bạn.", "I call my friend."],
"写真":["旅行の写真を見せてください。", "Cho tôi xem ảnh chuyến du lịch nhé.", "Please show me your travel photos."],
"鉛筆":["鉛筆で名前を書きます。", "Tôi viết tên bằng bút chì.", "I write my name with a pencil."],
"紙":["この紙に書いてください。", "Hãy viết lên tờ giấy này.", "Please write on this paper."],
"服":["明日、新しい服を着ます。", "Ngày mai tôi sẽ mặc quần áo mới.", "I will wear new clothes tomorrow."],
"眼鏡":["眼鏡をかけて本を読みます。", "Tôi đeo kính để đọc sách.", "I wear glasses to read a book."],
"学校":["学校まで歩いて行きます。", "Tôi đi bộ đến trường.", "I walk to school."],
"大学":["姉は大学で日本語を勉強しています。", "Chị tôi đang học tiếng Nhật ở đại học.", "My sister is studying Japanese at university."],
"図書館":["図書館で静かに勉強します。", "Tôi học yên lặng ở thư viện.", "I study quietly in the library."],
"駅":["駅で友達を待っています。", "Tôi đang đợi bạn ở nhà ga.", "I am waiting for a friend at the station."],
"病院":["明日、病院に行きます。", "Ngày mai tôi sẽ đến bệnh viện.", "I will go to the hospital tomorrow."],
"公園":["公園で散歩しましょう。", "Chúng mình đi dạo trong công viên nhé.", "Let’s take a walk in the park."],
"銀行":["銀行は九時に開きます。", "Ngân hàng mở cửa lúc chín giờ.", "The bank opens at nine."],
"店":["この店のパンはおいしいです。", "Bánh mì của cửa hàng này ngon.", "The bread at this shop is delicious."],
"家":["家で日本語を勉強します。", "Tôi học tiếng Nhật ở nhà.", "I study Japanese at home."],
"部屋":["部屋を掃除します。", "Tôi dọn phòng.", "I clean my room."],
"会社":["父は会社で働いています。", "Bố tôi làm việc tại công ty.", "My father works at a company."],
"電車":["電車で学校に行きます。", "Tôi đi học bằng tàu điện.", "I go to school by train."],
"バス":["駅の前でバスを待ちます。", "Tôi đợi xe buýt trước nhà ga.", "I wait for the bus in front of the station."],
"車":["父は車を運転します。", "Bố tôi lái ô tô.", "My father drives a car."],
"自転車":["自転車で公園に行きます。", "Tôi đạp xe đến công viên.", "I go to the park by bicycle."],
"飛行機":["飛行機で日本に行きます。", "Tôi đi Nhật bằng máy bay.", "I go to Japan by plane."],
"切符":["駅で切符を買います。", "Tôi mua vé ở nhà ga.", "I buy a ticket at the station."],

食べる:['パンを食べます。','Tôi ăn bánh mì.','I eat bread.'],飲む:['水を飲みます。','Tôi uống nước.','I drink water.'],行く:['学校に行きます。','Tôi đi đến trường.','I go to school.'],来る:['友達が来ます。','Bạn tôi sẽ đến.','My friend is coming.'],帰る:['家に帰ります。','Tôi về nhà.','I go home.'],見る:['映画を見ます。','Tôi xem phim.','I watch a movie.'],聞く:['音楽を聞きます。','Tôi nghe nhạc.','I listen to music.'],読む:['本を読みます。','Tôi đọc sách.','I read a book.'],書く:['名前を書きます。','Tôi viết tên.','I write my name.'],話す:['日本語を話します。','Tôi nói tiếng Nhật.','I speak Japanese.'],買う:['パンを買います。','Tôi mua bánh mì.','I buy bread.'],待つ:['駅で待ちます。','Tôi đợi ở nhà ga.','I wait at the station.'],寝る:['十時に寝ます。','Tôi ngủ lúc 10 giờ.','I go to bed at ten.'],起きる:['六時に起きます。','Tôi dậy lúc 6 giờ.','I wake up at six.'],勉強する:['毎日勉強します。','Tôi học mỗi ngày.','I study every day.'],
今日:['今日は月曜日です。','Hôm nay là thứ Hai.','Today is Monday.'],明日:['明日、学校に行きます。','Ngày mai tôi đi học.','I go to school tomorrow.'],昨日:['昨日、本を読みました。','Hôm qua tôi đã đọc sách.','I read a book yesterday.'],朝:['朝、パンを食べます。','Buổi sáng tôi ăn bánh mì.','I eat bread in the morning.'],昼:['昼にご飯を食べます。','Tôi ăn cơm vào buổi trưa.','I eat at noon.'],夜:['夜、本を読みます。','Tôi đọc sách vào buổi tối.','I read at night.'],毎日:['毎日、日本語を勉強します。','Tôi học tiếng Nhật mỗi ngày.','I study Japanese every day.'],今:['今、何時ですか。','Bây giờ là mấy giờ?','What time is it now?'],時間:['時間があります。','Tôi có thời gian.','I have time.'],月曜日:['月曜日に学校に行きます。','Tôi đi học vào thứ Hai.','I go to school on Monday.'],日曜日:['日曜日は休みです。','Chủ nhật là ngày nghỉ.','Sunday is a day off.'],
先生:['田中さんは先生です。','Anh/chị Tanaka là giáo viên.','Tanaka is a teacher.'],学生:['私は学生です。','Tôi là sinh viên.','I am a student.'],友達:['友達と話します。','Tôi nói chuyện với bạn.','I talk with a friend.'],家族:['家族と住んでいます。','Tôi sống với gia đình.','I live with my family.'],母:['母は家にいます。','Mẹ tôi ở nhà.','My mother is at home.'],父:['父は会社にいます。','Bố tôi ở công ty.','My father is at work.'],兄:['兄は大学生です。','Anh trai tôi là sinh viên.','My older brother is a university student.'],姉:['姉は本を読んでいます。','Chị tôi đang đọc sách.','My older sister is reading.'],子供:['子供が公園にいます。','Có trẻ em ở công viên.','There is a child in the park.'],人:['あの人は先生です。','Người kia là giáo viên.','That person is a teacher.'],私:['私はベトナム人です。','Tôi là người Việt Nam.','I am Vietnamese.'],
日本語:['日本語を勉強します。','Tôi học tiếng Nhật.','I study Japanese.'],英語:['英語を話します。','Tôi nói tiếng Anh.','I speak English.'],言葉:['新しい言葉を覚えます。','Tôi ghi nhớ từ mới.','I learn new words.'],名前:['名前を書いてください。','Hãy viết tên của bạn.','Please write your name.'],宿題:['宿題をします。','Tôi làm bài tập về nhà.','I do homework.'],質問:['質問があります。','Tôi có một câu hỏi.','I have a question.'],
天気:['今日はいい天気です。','Hôm nay thời tiết đẹp.','The weather is nice today.'],雨:['雨が降っています。','Trời đang mưa.','It is raining.'],雪:['雪が降っています。','Trời đang có tuyết rơi.','It is snowing.'],山:['山が見えます。','Tôi nhìn thấy núi.','I can see a mountain.'],川:['川の近くに住んでいます。','Tôi sống gần sông.','I live near a river.'],海:['海に行きたいです。','Tôi muốn đi biển.','I want to go to the sea.'],花:['花を買います。','Tôi mua hoa.','I buy flowers.'],木:['公園に木があります。','Trong công viên có cây.','There are trees in the park.'],空:['空が青いです。','Bầu trời màu xanh.','The sky is blue.'],
大きい:['この家は大きいです。','Ngôi nhà này lớn.','This house is big.'],小さい:['この鞄は小さいです。','Chiếc túi này nhỏ.','This bag is small.'],新しい:['新しい本を買いました。','Tôi đã mua một quyển sách mới.','I bought a new book.'],古い:['これは古い写真です。','Đây là một bức ảnh cũ.','This is an old photo.'],高い:['この時計は高いです。','Chiếc đồng hồ này đắt.','This watch is expensive.'],安い:['この店は安いです。','Cửa hàng này bán rẻ.','This shop is inexpensive.'],おいしい:['このパンはおいしいです。','Bánh mì này ngon.','This bread is delicious.'],暑い:['今日は暑いです。','Hôm nay trời nóng.','It is hot today.'],寒い:['今日は寒いです。','Hôm nay trời lạnh.','It is cold today.'],楽しい:['旅行は楽しいです。','Đi du lịch thật vui.','Travel is enjoyable.'],静か:['図書館は静かです。','Thư viện yên tĩnh.','The library is quiet.'],便利:['このアプリは便利です。','Ứng dụng này tiện lợi.','This app is convenient.'],
予約:['ホテルを予約しました。','Tôi đã đặt khách sạn.','I booked a hotel.'],注文:['注文してもいいですか。','Tôi gọi món được không?','May I order?'],経験:['日本に住んだ経験があります。','Tôi có kinh nghiệm sống ở Nhật.','I have experience living in Japan.'],予定:['明日は予定があります。','Ngày mai tôi có kế hoạch rồi.','I have plans tomorrow.'],約束:['友達と約束があります。','Tôi có hẹn với bạn.','I have an appointment with a friend.'],必要:['パスポートが必要です。','Cần có hộ chiếu.','A passport is necessary.'],説明:['もう一度説明してください。','Hãy giải thích thêm một lần nữa.','Please explain once more.'],練習:['毎日、日本語を練習します。','Tôi luyện tiếng Nhật mỗi ngày.','I practice Japanese every day.'],準備:['旅行の準備をします。','Tôi chuẩn bị cho chuyến du lịch.','I prepare for a trip.'],文化:['日本の文化に興味があります。','Tôi quan tâm đến văn hóa Nhật.','I am interested in Japanese culture.'],料理:['母の料理はおいしいです。','Món ăn của mẹ tôi rất ngon.','My mother’s cooking is delicious.'],生活:['日本の生活に慣れました。','Tôi đã quen với cuộc sống ở Nhật.','I have become used to life in Japan.'],旅行:['来月、旅行に行きます。','Tháng sau tôi đi du lịch.','I am going on a trip next month.']};
export const WORDS:Word[]=rows.split('\n').map((line,i)=>{const [jp,kana,romaji,vi,en,tag]=line.split('|');const ex=examples[jp]??(tag==='places'?[`${jp}はどこですか。`,`${vi.charAt(0).toUpperCase()+vi.slice(1)} ở đâu?`,`Where is the ${en}?`]:tag==='animals'?[`${jp}がいます。`,`Có một ${vi}.`,`There is a ${en}.`]:[`${jp}を見てください。`,`Hãy nhìn ${vi}.`,`Please look at the ${en}.`]);return {id:`w${i}`,jp,kana,romaji,vi,en,tag,level:tag==='N4'?'N4':'N5',example:ex[0],exampleVi:ex[1],exampleEn:ex[2]};});
export type Lesson={id:string;level:string;title:[string,string];desc:[string,string];pattern:string;explain:[string,string];examples:[string,string,string][];dialogue:[string,string,string][];words:string[];questions:{prompt:[string,string];jp:string;choices:string[];answer:string;explain:[string,string]}[]};
const Q=(jp:string,choices:string[],answer:string,vi:string,en:string)=>({prompt:['Điền vào chỗ trống','Fill in the blank'] as [string,string],jp,choices,answer,explain:[vi,en] as [string,string]});
export const LESSONS:Lesson[]=[
{id:'l1',level:'N5',title:['Bắt đầu một lời chào','A little introduction'],desc:['Giới thiệu tên, nghề nghiệp và bản thân.','Introduce yourself and meet someone new.'],pattern:'A は B です',explain:['は đánh dấu chủ đề, đọc là wa. です là cách kết thúc lịch sự. Thêm か cuối câu để đặt câu hỏi.','は marks the topic and is pronounced wa. です makes a polite statement. Add か to ask a question.'],examples:[['私は学生です。','Tôi là sinh viên.','I am a student.'],['田中さんは先生ですか。','Anh/chị Tanaka là giáo viên phải không?','Is Tanaka a teacher?']],dialogue:[['はじめまして。私はリンです。','Rất vui được gặp bạn. Tôi là Linh.','Nice to meet you. I’m Linh.'],['私は田中です。学生ですか。','Tôi là Tanaka. Bạn là sinh viên à?','I’m Tanaka. Are you a student?'],['はい、学生です。よろしくお願いします。','Vâng, tôi là sinh viên. Mong được giúp đỡ.','Yes, I am. It’s nice to meet you.']],words:['私','名前','学生','先生','友達','日本語'],questions:[Q('私＿学生です。',['は','を','に','で'],'は','は đánh dấu chủ đề.','は marks the topic.'),Q('先生です＿。',['を','の','か','が'],'か','か tạo câu hỏi lịch sự.','か makes a polite question.')]},
{id:'l2',level:'N5',title:['Những đồ vật quanh ta','Objects around you'],desc:['Nói “cái này”, “cái đó” và “của ai”.','This, that, and whose.'],pattern:'これ・それ・あれ / A の B',explain:['これ: gần người nói; それ: gần người nghe; あれ: xa cả hai. の liên kết người sở hữu với đồ vật.','これ is near the speaker; それ near the listener; あれ far from both. の connects an owner to an object.'],examples:[['これは私の本です。','Đây là sách của tôi.','This is my book.'],['それは誰の鞄ですか。','Đó là túi của ai?','Whose bag is that?']],dialogue:[['これは何ですか。','Đây là cái gì?','What is this?'],['それは時計です。','Đó là đồng hồ.','That is a watch.'],['私の時計です。','Đó là đồng hồ của tôi.','It is my watch.']],words:['本','鞄','時計','傘','鍵','鉛筆'],questions:[Q('これは私＿本です。',['は','の','を','に'],'の','の chỉ sự sở hữu.','の marks possession.'),Q('（Gần người nói / Near speaker）＿は本です。',['これ','それ','あれ','どれ'],'これ','これ chỉ đồ vật gần người nói.','これ refers to an object near the speaker.')]},
{id:'l3',level:'N5',title:['Một ngày của bạn','Your everyday rhythm'],desc:['Hành động, thời gian và thói quen.','Actions, time, and daily habits.'],pattern:'Vます / 時間 に',explain:['ます là đuôi động từ lịch sự. Thời điểm cụ thể đi với に. Các từ như 今日 và 毎日 thường không thêm に.','ます is a polite verb ending. Use に for a specific time. 今日 and 毎日 normally do not take に.'],examples:[['六時に起きます。','Tôi dậy lúc sáu giờ.','I wake up at six.'],['毎日、本を読みます。','Tôi đọc sách mỗi ngày.','I read every day.']],dialogue:[['何時に起きますか。','Bạn dậy lúc mấy giờ?','What time do you wake up?'],['七時に起きます。','Tôi dậy lúc bảy giờ.','I wake up at seven.'],['夜、日本語を勉強します。','Buổi tối tôi học tiếng Nhật.','I study Japanese at night.']],words:['起きる','寝る','朝','夜','毎日','勉強する'],questions:[Q('六時＿起きます。',['に','を','が','の'],'に','に đánh dấu thời điểm cụ thể.','に marks a specific time.'),Q('毎日、本を読み＿。',['ます','です','に','が'],'ます','読みます là dạng lịch sự của 読む.','読みます is the polite form of 読む.')]},
{id:'l4',level:'N5',title:['Một quán cà phê nhỏ','At a little café'],desc:['Gọi món và nói về điều bạn thích.','Order a drink and talk about taste.'],pattern:'N を V / N をください',explain:['を (đọc o) đánh dấu tân ngữ. N をください dùng để yêu cầu một món đồ một cách lịch sự.','を (pronounced o) marks the object. N をください politely requests an item.'],examples:[['お茶をください。','Cho tôi trà.','Tea, please.'],['パンを食べます。','Tôi ăn bánh mì.','I eat bread.']],dialogue:[['ご注文は？','Bạn muốn gọi món gì?','What would you like?'],['コーヒーとパンをください。','Cho tôi cà phê và bánh mì.','Coffee and bread, please.'],['このパンはおいしいですね。','Bánh mì này ngon nhỉ.','This bread is delicious, isn’t it?']],words:['コーヒー','お茶','パン','水','食べる','飲む'],questions:[Q('水＿飲みます。',['を','に','が','へ'],'を','を chỉ tân ngữ của 飲む.','を marks what you drink.'),Q('パンを＿。',['ください','です','あります','います'],'ください','N をください để yêu cầu đồ vật.','N をください requests an item.')]},
{id:'l5',level:'N5',title:['Khám phá thành phố','Find your way'],desc:['Đi đến đâu và bằng phương tiện gì.','Destinations and getting around.'],pattern:'場所 に／へ 行きます / 交通手段 で',explain:['に hoặc へ chỉ hướng/đích đến. で chỉ phương tiện. へ khi là trợ từ đọc là e.','に or へ marks a destination. で marks transport. As a particle, へ is pronounced e.'],examples:[['電車で学校に行きます。','Tôi đến trường bằng tàu điện.','I go to school by train.'],['駅はどこですか。','Nhà ga ở đâu?','Where is the station?']],dialogue:[['明日、どこに行きますか。','Ngày mai bạn đi đâu?','Where will you go tomorrow?'],['図書館に行きます。','Tôi đến thư viện.','I will go to the library.'],['バスで行きます。','Tôi đi bằng xe buýt.','I will go by bus.']],words:['駅','電車','バス','学校','図書館','行く'],questions:[Q('電車＿行きます。',['で','を','が','の'],'で','で dùng với phương tiện.','で marks transport.'),Q('学校＿行きます。',['に','を','が','と'],'に','に chỉ đích đến.','に marks the destination.')]},
{id:'l6',level:'N5',title:['Thế giới nhiều sắc thái','Describe your world'],desc:['Tính từ và những mô tả đơn giản.','Adjectives and simple descriptions.'],pattern:'い-adjective + N / な-adjective + な + N',explain:['Tính từ い nối trực tiếp với danh từ: 大きい家. Tính từ な cần な trước danh từ: 静かな部屋.','い-adjectives directly modify nouns: 大きい家. な-adjectives need な: 静かな部屋.'],examples:[['これは新しい本です。','Đây là sách mới.','This is a new book.'],['静かな部屋で勉強します。','Tôi học trong phòng yên tĩnh.','I study in a quiet room.']],dialogue:[['この鞄はどうですか。','Bạn thấy chiếc túi này thế nào?','What do you think of this bag?'],['小さくて、便利です。','Nó nhỏ và tiện lợi.','It is small and convenient.'],['でも、少し高いです。','Nhưng hơi đắt.','But it is a little expensive.']],words:['大きい','小さい','新しい','高い','静か','便利'],questions:[Q('静か＿部屋です。',['な','い','を','に'],'な','静か là tính từ な.','静か is a な-adjective.'),Q('＿家です。',['大きい','大きなです','大きくです','大きいな'],'大きい','大きい nối trực tiếp với danh từ.','大きい directly modifies a noun.')]},
{id:'l7',level:'N4',title:['Đang làm gì vậy?','In the middle of it'],desc:['Hành động đang diễn ra và lời nhờ.','Ongoing actions and requests.'],pattern:'Vて います / Vて ください',explain:['Vて + います diễn tả hành động đang diễn ra (và một số trạng thái). Vて + ください là lời yêu cầu. 書く→書いて, 読む→読んで, 食べる→食べて.','Vて + います describes ongoing actions (and some states). Vて + ください makes a request. 書く→書いて, 読む→読んで, 食べる→食べて.'],examples:[['今、本を読んでいます。','Bây giờ tôi đang đọc sách.','I am reading a book now.'],['名前を書いてください。','Hãy viết tên.','Please write your name.']],dialogue:[['何をしていますか。','Bạn đang làm gì?','What are you doing?'],['宿題をしています。','Tôi đang làm bài tập.','I am doing homework.'],['この言葉を説明してください。','Hãy giải thích từ này.','Please explain this word.']],words:['読む','書く','宿題','説明','今','言葉'],questions:[Q('本を読んで＿。',['います','です','あります','しました'],'います','読んでいます: đang đọc.','読んでいます means is reading.'),Q('名前を＿ください。',['書いて','書く','書きます','書いた'],'書いて','書く → 書いて.','書く becomes 書いて.')]},
{id:'l8',level:'N4',title:['Những điều muốn làm','A small wish list'],desc:['Nói về mong muốn của bản thân.','Talk about what you want to do.'],pattern:'Vます-stem + たいです',explain:['Bỏ ます, thêm たい: 行きます→行きたい. Phủ định: 行きたくない. Thường dùng để nói mong muốn của mình; không khẳng định trực tiếp mong muốn người khác.','Remove ます and add たい: 行きます→行きたい. Negative: 行きたくない. Usually used for your own wishes, not direct assertions about others’ wishes.'],examples:[['日本に行きたいです。','Tôi muốn đến Nhật.','I want to go to Japan.'],['お茶を飲みたいです。','Tôi muốn uống trà.','I want to drink tea.']],dialogue:[['休みに何をしたいですか。','Bạn muốn làm gì vào kỳ nghỉ?','What do you want to do on holiday?'],['海に行きたいです。','Tôi muốn đi biển.','I want to go to the sea.'],['写真も撮りたいです。','Tôi cũng muốn chụp ảnh.','I also want to take photos.']],words:['旅行','海','写真','買う','飲む','行く'],questions:[Q('日本に行き＿です。',['たい','ます','て','た'],'たい','Thân ます + たい.','Use the ます stem plus たい.'),Q('コーヒーを飲みたく＿です。',['ない','ません','ありません','なかったです'],'ない','たい → たくない ở dạng phủ định.','たい becomes たくない in the negative.')]},
{id:'l9',level:'N4',title:['Bạn đã từng…?','Have you ever?'],desc:['Kể về những trải nghiệm đã có.','Share your experiences.'],pattern:'Vた ことがあります',explain:['Dạng た + ことがあります diễn tả đã từng trải nghiệm. 食べる→食べた; 行く→行った. Không dùng để kể đơn thuần một việc xảy ra hôm qua.','The た form + ことがあります describes past experience. 食べる→食べた; 行く→行った. It is not the usual form for simply recounting yesterday’s event.'],examples:[['日本に行ったことがあります。','Tôi đã từng đến Nhật.','I have been to Japan.'],['寿司を食べたことがありますか。','Bạn đã từng ăn sushi chưa?','Have you ever eaten sushi?']],dialogue:[['日本に行ったことがありますか。','Bạn từng đến Nhật chưa?','Have you been to Japan?'],['はい、一度あります。','Vâng, một lần.','Yes, once.'],['日本の料理がおいしかったです。','Món ăn Nhật rất ngon.','The Japanese food was delicious.']],words:['経験','料理','日本語','文化','旅行','食べる'],questions:[Q('日本に＿ことがあります。',['行った','行きます','行って','行き'],'行った','Dùng dạng た trước ことがあります.','Use the た form before ことがあります.'),Q('寿司を食べたことが＿。',['あります','います','です','します'],'あります','ことがあります diễn tả trải nghiệm.','ことがあります expresses experience.')]},
{id:'l10',level:'N4',title:['Lên kế hoạch','Making a plan'],desc:['Nói về dự định và sự chuẩn bị.','Intentions and preparation.'],pattern:'V辞書形 + つもりです',explain:['Dạng từ điển + つもりです để nói dự định. Dạng ない + つもりです là dự định không làm. Phân biệt với lịch trình cố định.','Dictionary form + つもりです expresses intention. The ない form + つもりです expresses an intention not to do something.'],examples:[['明日、勉強するつもりです。','Ngày mai tôi định học.','I intend to study tomorrow.'],['今日は出かけないつもりです。','Hôm nay tôi định không ra ngoài.','I intend not to go out today.']],dialogue:[['週末は何をするつもりですか。','Cuối tuần bạn định làm gì?','What do you intend to do this weekend?'],['旅行の準備をするつもりです。','Tôi định chuẩn bị cho chuyến du lịch.','I intend to prepare for a trip.'],['ホテルを予約します。','Tôi sẽ đặt khách sạn.','I will book a hotel.']],words:['予定','準備','予約','明日','約束','旅行'],questions:[Q('明日、勉強＿つもりです。',['する','します','して','した'],'する','Trước つもり dùng dạng từ điển.','Use the dictionary form before つもり.'),Q('今日は行か＿つもりです。',['ない','ません','なく','なかった'],'ない','Dự định không làm: Vないつもり.','An intention not to act uses Vないつもり.')]},
{id:'l11',level:'N4',title:['Xin phép một chút','May I?'],desc:['Xin phép và nói về quy định.','Ask permission and understand rules.'],pattern:'Vて もいいです / Vて はいけません',explain:['Vて + もいいですか để xin phép. Vて + はいけません diễn tả điều bị cấm. Đây là cách nói khá trực tiếp về quy tắc.','Vて + もいいですか asks permission. Vて + はいけません expresses a prohibition, a fairly direct way to state a rule.'],examples:[['写真を撮ってもいいですか。','Tôi chụp ảnh được không?','May I take a photo?'],['ここで食べてはいけません。','Không được ăn ở đây.','You must not eat here.']],dialogue:[['ここで電話をしてもいいですか。','Tôi gọi điện ở đây được không?','May I make a call here?'],['すみません、ここではいけません。','Xin lỗi, ở đây thì không được.','Sorry, not here.'],['わかりました。','Tôi hiểu rồi.','Understood.']],words:['電話','写真','図書館','質問','必要','静か'],questions:[Q('ここで食べて＿いいですか。',['も','は','が','を'],'も','Vてもいい xin phép.','Vてもいい asks permission.'),Q('ここで食べてはいけ＿。',['ません','ます','です','ないですか'],'ません','Vてはいけません diễn tả cấm.','Vてはいけません expresses prohibition.')]},
{id:'l12',level:'N4',title:['Từng chút, mỗi ngày','A little, every day'],desc:['Kết nối các hành động theo thứ tự.','Connect actions in order.'],pattern:'Vてから / Vながら',explain:['Vてから: sau khi làm xong việc A rồi làm B. Thân ます + ながら: vừa làm A vừa làm B, cùng một chủ thể.','Vてから means doing B after finishing A. The ます stem + ながら means doing A while doing B, with the same subject.'],examples:[['宿題をしてから、寝ます。','Làm bài tập xong rồi tôi ngủ.','I go to bed after doing homework.'],['音楽を聞きながら、料理をします。','Tôi vừa nghe nhạc vừa nấu ăn.','I cook while listening to music.']],dialogue:[['毎日、どうやって練習しますか。','Mỗi ngày bạn luyện thế nào?','How do you practice every day?'],['言葉を覚えてから、文を書きます。','Tôi nhớ từ rồi viết câu.','I learn words and then write sentences.'],['少しずつ上手になりますね。','Bạn sẽ dần giỏi hơn nhỉ.','You will improve little by little.']],words:['練習','生活','聞く','書く','料理','毎日'],questions:[Q('宿題をして＿、寝ます。',['から','ながら','まで','より'],'から','Vてから chỉ thứ tự trước-sau.','Vてから marks sequential actions.'),Q('音楽を聞き＿、料理をします。',['ながら','から','ても','て'],'ながら','Thân ます + ながら.','Use the ます stem + ながら.')]}
];
export const KANA_ROWS=[['a','i','u','e','o'],['ka','ki','ku','ke','ko'],['sa','shi','su','se','so'],['ta','chi','tsu','te','to'],['na','ni','nu','ne','no'],['ha','hi','fu','he','ho'],['ma','mi','mu','me','mo'],['ya','','yu','','yo'],['ra','ri','ru','re','ro'],['wa','','','','wo'],['n','','','',''],['ga','gi','gu','ge','go'],['za','ji','zu','ze','zo'],['da','ji','zu','de','do'],['ba','bi','bu','be','bo'],['pa','pi','pu','pe','po']];
const hira=['あいうえお','かきくけこ','さしすせそ','たちつてと','なにぬねの','はひふへほ','まみむめも','や ゆ よ','らりるれろ','わ   を','ん    ','がぎぐげご','ざじずぜぞ','だぢづでど','ばびぶべぼ','ぱぴぷぺぽ'];
export const KANA=KANA_ROWS.flatMap((r,i)=>r.map((romaji,j)=>({romaji,hira:hira[i][j],kata:hira[i][j]===' '?' ':String.fromCharCode(hira[i].charCodeAt(j)+96)})).filter(k=>k.romaji));
for(const [prefix,r] of [['き','ky'],['し','sh'],['ち','ch'],['に','ny'],['ひ','hy'],['み','my'],['り','ry'],['ぎ','gy'],['じ','j'],['び','by'],['ぴ','py']])for(const [small,vowel] of [['ゃ','a'],['ゅ','u'],['ょ','o']]){const h=prefix+small;KANA.push({hira:h,kata:[...h].map(c=>String.fromCharCode(c.charCodeAt(0)+96)).join(''),romaji:r+vowel});}
export const KANJI=[['日','sun; day','mặt trời; ngày','ニチ・ジツ','ひ・か','日本・日曜日'],['月','moon; month','trăng; tháng','ゲツ・ガツ','つき','月曜日・一月'],['火','fire','lửa','カ','ひ','火曜日・火山'],['水','water','nước','スイ','みず','水曜日・水道'],['木','tree','cây','モク・ボク','き','木曜日・木'],['金','gold; money','vàng; tiền','キン・コン','かね','金曜日・お金'],['土','earth','đất','ド・ト','つち','土曜日・土地'],['人','person','người','ジン・ニン','ひと','日本人・一人'],['山','mountain','núi','サン','やま','火山・山'],['川','river','sông','セン','かわ','川・河川'],['本','book; origin','sách; gốc','ホン','もと','日本・本'],['学','study','học','ガク','まなぶ','学生・大学'],['生','life; birth','sống; sinh','セイ・ショウ','いきる・うまれる','先生・学生'],['先','ahead','trước','セン','さき','先生・先週'],['大','big','lớn','ダイ・タイ','おおきい','大学・大人'],['小','small','nhỏ','ショウ','ちいさい・こ','小学校・小さい'],['中','middle','giữa','チュウ','なか','中学校・中国'],['上','above','trên','ジョウ','うえ・あがる','上手・上'],['下','below','dưới','カ・ゲ','した・さがる','地下・下'],['食','eat','ăn','ショク','たべる','食事・食べる'],['飲','drink','uống','イン','のむ','飲み物・飲む'],['見','see','nhìn','ケン','みる','見学・見る'],['行','go','đi','コウ・ギョウ','いく・おこなう','銀行・旅行'],['語','language','ngôn ngữ','ゴ','かたる','日本語・英語']];
