import type { Word } from './core';

// Everyday words added after the original starter set, preserving existing IDs.
// Level is a learning hint, not an official JLPT classification.
const rows = `バナナ|バナナ|banana|chuối|banana|food|朝、バナナを食べます。|Buổi sáng tôi ăn chuối.|I eat a banana in the morning.
みかん|みかん|mikan|quýt|mandarin orange|food|みかんを一つください。|Cho tôi một quả quýt.|One mandarin orange, please.
いちご|いちご|ichigo|dâu tây|strawberry|food|このいちごは甘いです。|Quả dâu tây này ngọt.|This strawberry is sweet.
すいか|すいか|suika|dưa hấu|watermelon|food|夏にすいかを食べます。|Tôi ăn dưa hấu vào mùa hè.|I eat watermelon in summer.
メロン|メロン|meron|dưa lưới|melon|food|スーパーでメロンを買いました。|Tôi đã mua dưa lưới ở siêu thị.|I bought a melon at the supermarket.
トマト|トマト|tomato|cà chua|tomato|food|サラダにトマトを入れます。|Tôi cho cà chua vào salad.|I put tomato in the salad.
じゃがいも|じゃがいも|jagaimo|khoai tây|potato|food|じゃがいもを二つ使います。|Tôi dùng hai củ khoai tây.|I use two potatoes.
塩|しお|shio|muối|salt|food|スープに塩を少し入れます。|Tôi cho một ít muối vào súp.|I add a little salt to the soup.
砂糖|さとう|satou|đường|sugar|food|コーヒーに砂糖を入れません。|Tôi không cho đường vào cà phê.|I do not put sugar in my coffee.
皿|さら|sara|đĩa|plate|objects|皿をテーブルに置きます。|Tôi đặt đĩa lên bàn.|I put the plate on the table.
箸|はし|hashi|đũa|chopsticks|objects|箸でご飯を食べます。|Tôi ăn cơm bằng đũa.|I eat rice with chopsticks.
スプーン|スプーン|supuun|thìa|spoon|objects|スプーンでスープを飲みます。|Tôi dùng thìa ăn súp.|I eat soup with a spoon.
フォーク|フォーク|fooku|nĩa|fork|objects|フォークを取ってください。|Hãy lấy giúp tôi cái nĩa.|Please get me a fork.
冷蔵庫|れいぞうこ|reizouko|tủ lạnh|refrigerator|objects|牛乳は冷蔵庫にあります。|Sữa ở trong tủ lạnh.|The milk is in the refrigerator.
窓|まど|mado|cửa sổ|window|objects|窓を開けてもいいですか。|Tôi mở cửa sổ được không?|May I open the window?
ドア|ドア|doa|cửa ra vào|door|objects|ドアを閉めてください。|Hãy đóng cửa lại.|Please close the door.
ベッド|ベッド|beddo|giường|bed|objects|ベッドの上に猫がいます。|Có một con mèo trên giường.|There is a cat on the bed.
電気|でんき|denki|đèn điện; điện|light; electricity|objects|部屋の電気を消します。|Tôi tắt đèn trong phòng.|I turn off the light in the room.
パソコン|パソコン|pasokon|máy tính|computer|objects|パソコンで宿題をします。|Tôi làm bài tập trên máy tính.|I do homework on a computer.
携帯電話|けいたいでんわ|keitaidenwa|điện thoại di động|mobile phone|objects|携帯電話を鞄に入れました。|Tôi đã bỏ điện thoại vào túi.|I put my phone in my bag.
教室|きょうしつ|kyoushitsu|phòng học|classroom|places|教室に先生がいます。|Giáo viên ở trong phòng học.|The teacher is in the classroom.
トイレ|トイレ|toire|nhà vệ sinh|restroom|places|トイレはどこですか。|Nhà vệ sinh ở đâu?|Where is the restroom?
スーパー|スーパー|suupaa|siêu thị|supermarket|places|スーパーで野菜を買います。|Tôi mua rau ở siêu thị.|I buy vegetables at the supermarket.
郵便局|ゆうびんきょく|yuubinkyoku|bưu điện|post office|places|郵便局は駅の近くです。|Bưu điện ở gần nhà ga.|The post office is near the station.
空港|くうこう|kuukou|sân bay|airport|places|空港までバスで行きます。|Tôi đi xe buýt đến sân bay.|I take a bus to the airport.
道|みち|michi|con đường|road|travel|この道をまっすぐ行きます。|Tôi đi thẳng theo con đường này.|I go straight along this road.
信号|しんごう|shingou|đèn giao thông|traffic light|travel|信号が赤です。|Đèn giao thông đang đỏ.|The traffic light is red.
交差点|こうさてん|kousaten|ngã tư|intersection|travel|次の交差点を右に曲がります。|Tôi rẽ phải ở ngã tư tiếp theo.|I turn right at the next intersection.
地下鉄|ちかてつ|chikatetsu|tàu điện ngầm|subway|travel|地下鉄で大学に行きます。|Tôi đi tàu điện ngầm đến trường đại học.|I take the subway to university.
タクシー|タクシー|takushii|taxi|taxi|travel|雨なのでタクシーに乗ります。|Vì trời mưa nên tôi đi taxi.|It is raining, so I take a taxi.
電池|でんち|denchi|pin|battery|objects|時計の電池を替えます。|Tôi thay pin đồng hồ.|I replace the watch battery.
充電器|じゅうでんき|juudenki|bộ sạc|charger|objects|充電器を忘れました。|Tôi quên mang bộ sạc.|I forgot my charger.
財布|さいふ|saifu|ví tiền|wallet|objects|財布は鞄の中です。|Ví tiền ở trong túi.|The wallet is in the bag.
帽子|ぼうし|boushi|mũ|hat|objects|暑いので帽子をかぶります。|Trời nóng nên tôi đội mũ.|It is hot, so I wear a hat.
シャツ|シャツ|shatsu|áo sơ mi|shirt|objects|白いシャツを着ます。|Tôi mặc áo sơ mi trắng.|I wear a white shirt.
石鹸|せっけん|sekken|xà phòng|soap|objects|石鹸で手を洗います。|Tôi rửa tay bằng xà phòng.|I wash my hands with soap.
タオル|タオル|taoru|khăn|towel|objects|新しいタオルを使います。|Tôi dùng một chiếc khăn mới.|I use a new towel.
薬|くすり|kusuri|thuốc|medicine|objects|食事の後で薬を飲みます。|Tôi uống thuốc sau bữa ăn.|I take medicine after a meal.
木曜日|もくようび|mokuyoubi|thứ Năm|Thursday|time|木曜日に図書館に行きます。|Tôi đến thư viện vào thứ Năm.|I go to the library on Thursday.
金曜日|きんようび|kinyoubi|thứ Sáu|Friday|time|金曜日に友達と会います。|Tôi gặp bạn vào thứ Sáu.|I meet a friend on Friday.
土曜日|どようび|doyoubi|thứ Bảy|Saturday|time|土曜日は家で休みます。|Tôi nghỉ ở nhà vào thứ Bảy.|I rest at home on Saturday.`;

export const EXTRA_WORDS: Word[] = rows.split('\n').map((line, index) => {
  const [jp, kana, romaji, vi, en, tag, example, exampleVi, exampleEn] = line.split('|');
  return { id: `w${123 + index}`, jp, kana, romaji, vi, en, tag, level: 'N5', example, exampleVi, exampleEn };
});
