import radicalsRaw from '../data/radicalsData.json' with { type: 'json' };

export interface RadicalEntry {
    id: number;
    radical: string;
    variants?: string[];
    strokes: number;
    nameVi: string;
    meaning: string;
    kanjiList: string[];
}

export interface KanjiStrokePath {
    index: number;
    id: string;
    d: string;
    type?: string;
    element?: string;
    numberPos: { x: number; y: number };
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    points: { x: number; y: number }[];
    length: number;
}

export interface KanjiStrokeData {
    kanji: string;
    hex: string;
    viewBox: string;
    strokes: KanjiStrokePath[];
    source: 'kanjivg-cdn' | 'cache' | 'fallback';
}

export interface KanjiApiResponse {
    kanji: string;
    grade: number | null;
    stroke_count: number;
    meanings: string[];
    kun_readings: string[];
    on_readings: string[];
    name_readings?: string[];
    jlpt: number | null;
    unicode?: string;
    heisig_en: string | null;
}

export interface KanjiMetadata extends KanjiApiResponse {
    hanViet: string;
    meaningVi: string;
    jlptLabel: string;
    compounds: string[];
    source: 'local+kanjiapi' | 'kanjiapi' | 'local';
}

export interface StrokeValidationResult {
    valid: boolean;
    reason: 'ok' | 'reverse_direction' | 'wrong_order_or_position' | 'too_short';
    accuracy: number;
    startDistance: number;
    endDistance: number;
    directionCosine: number;
}

export interface KanjiSummaryInfo {
    kanji: string;
    strokes: number;
    hanViet: string;
    meaningVi: string;
    meaningEn: string;
    jlpt: string;
}

export interface MultiRadicalSearchResult {
    selectedRadicals: string[];
    matchedKanji: string[];
    groupedByStrokes: {
        strokes: number;
        items: KanjiSummaryInfo[];
    }[];
    compatibleRadicals: Set<string>;
}

export const RADICALS_DATA: RadicalEntry[] = radicalsRaw as RadicalEntry[];

export const DEFAULT_TRACING_TOLERANCE = 25;

// Local N5-N4 + Core Kanji Dictionary (stroke count, Hán Việt, Vietnamese/English meanings, readings, compounds)
const LOCAL_KANJI_DB: Record<
    string,
    {
        strokes: number;
        hanViet: string;
        meaningVi: string;
        meanings: string[];
        on: string[];
        kun: string[];
        jlpt: number;
        grade: number;
        heisig?: string;
        compounds: string[];
    }
> = {
    一: { strokes: 1, hanViet: 'NHẤT', meaningVi: 'một', meanings: ['one'], on: ['イチ', 'イツ'], kun: ['ひと', 'ひと.つ'], jlpt: 5, grade: 1, heisig: 'one', compounds: ['一つ', '一人', '一日'] },
    二: { strokes: 2, hanViet: 'NHỊ', meaningVi: 'hai', meanings: ['two'], on: ['ニ'], kun: ['ふた', 'ふた.つ'], jlpt: 5, grade: 1, heisig: 'two', compounds: ['二つ', '二人', '二月'] },
    三: { strokes: 3, hanViet: 'TAM', meaningVi: 'ba', meanings: ['three'], on: ['サン'], kun: ['み', 'み.つ', 'みっ.つ'], jlpt: 5, grade: 1, heisig: 'three', compounds: ['三つ', '三人', '三月'] },
    四: { strokes: 5, hanViet: 'TỨ', meaningVi: 'bốn', meanings: ['four'], on: ['シ'], kun: ['よ', 'よ.つ', 'よっ.つ', 'よん'], jlpt: 5, grade: 1, heisig: 'four', compounds: ['四つ', '四月', '四人'] },
    五: { strokes: 4, hanViet: 'NGŨ', meaningVi: 'năm (5)', meanings: ['five'], on: ['ゴ'], kun: ['いつ', 'いつ.つ'], jlpt: 5, grade: 1, heisig: 'five', compounds: ['五つ', '五月', '五日'] },
    六: { strokes: 4, hanViet: 'LỤC', meaningVi: 'sáu', meanings: ['six'], on: ['ロク'], kun: ['む', 'む.つ', 'むっ.つ'], jlpt: 5, grade: 1, heisig: 'six', compounds: ['六つ', '六月', '六日'] },
    七: { strokes: 2, hanViet: 'THẤT', meaningVi: 'bảy', meanings: ['seven'], on: ['シチ'], kun: ['なな', 'なな.つ'], jlpt: 5, grade: 1, heisig: 'seven', compounds: ['七つ', '七月', '七日'] },
    八: { strokes: 2, hanViet: 'BÁT', meaningVi: 'tám', meanings: ['eight'], on: ['ハチ'], kun: ['や', 'や.つ', 'やっ.つ'], jlpt: 5, grade: 1, heisig: 'eight', compounds: ['八つ', '八月', '八日'] },
    九: { strokes: 2, hanViet: 'CỬU', meaningVi: 'chín', meanings: ['nine'], on: ['キュウ', 'ク'], kun: ['ここの', 'ここの.つ'], jlpt: 5, grade: 1, heisig: 'nine', compounds: ['九つ', '九月', '九日'] },
    十: { strokes: 2, hanViet: 'THẬP', meaningVi: 'mười', meanings: ['ten'], on: ['ジュウ', 'ジッ'], kun: ['とお', 'と'], jlpt: 5, grade: 1, heisig: 'ten', compounds: ['十月', '十日', '十分'] },
    百: { strokes: 6, hanViet: 'BÁCH', meaningVi: 'một trăm', meanings: ['hundred'], on: ['ヒャク'], kun: ['もも'], jlpt: 5, grade: 1, heisig: 'hundred', compounds: ['百円', '三百', '百科'] },
    千: { strokes: 3, hanViet: 'THIÊN', meaningVi: 'một nghìn', meanings: ['thousand'], on: ['セン'], kun: ['ち'], jlpt: 5, grade: 1, heisig: 'thousand', compounds: ['千円', '三千', '千葉'] },
    万: { strokes: 3, hanViet: 'VẠN', meaningVi: 'mười nghìn, vạn', meanings: ['ten thousand'], on: ['マン', 'バン'], kun: ['よろず'], jlpt: 5, grade: 2, heisig: 'ten thousand', compounds: ['一万', '万年筆', '万一'] },
    円: { strokes: 4, hanViet: 'VIÊN', meaningVi: 'đồng Yên, hình tròn', meanings: ['yen', 'circle', 'round'], on: ['エン'], kun: ['まる.い'], jlpt: 5, grade: 1, heisig: 'circle', compounds: ['百円', '円高', '円形'] },
    日: { strokes: 4, hanViet: 'NHẬT', meaningVi: 'mặt trời; ngày', meanings: ['sun', 'day', 'Japan'], on: ['ニチ', 'ジツ'], kun: ['ひ', '-び', '-か'], jlpt: 5, grade: 1, heisig: 'day', compounds: ['日本', '日曜日', '毎日', '今日'] },
    月: { strokes: 4, hanViet: 'NGUYỆT', meaningVi: 'mặt trăng; tháng', meanings: ['moon', 'month'], on: ['ゲツ', 'ガツ'], kun: ['つき'], jlpt: 5, grade: 1, heisig: 'month', compounds: ['月曜日', '一月', '今月'] },
    火: { strokes: 4, hanViet: 'HỎA', meaningVi: 'lửa', meanings: ['fire'], on: ['カ'], kun: ['ひ', '-び', 'ほ-'], jlpt: 5, grade: 1, heisig: 'fire', compounds: ['火曜日', '火山', '花火'] },
    水: { strokes: 4, hanViet: 'THỦY', meaningVi: 'nước', meanings: ['water'], on: ['スイ'], kun: ['みず'], jlpt: 5, grade: 1, heisig: 'water', compounds: ['水曜日', '水道', '水泳'] },
    木: { strokes: 4, hanViet: 'MỘC', meaningVi: 'cây; gỗ', meanings: ['tree', 'wood'], on: ['モク', 'ボク'], kun: ['き', 'こ-'], jlpt: 5, grade: 1, heisig: 'tree', compounds: ['木曜日', '木漏れ日', '大木'] },
    金: { strokes: 8, hanViet: 'KIM', meaningVi: 'vàng; tiền; kim loại', meanings: ['gold', 'money', 'metal'], on: ['キン', 'コン'], kun: ['かね', 'かな-'], jlpt: 5, grade: 1, heisig: 'gold', compounds: ['金曜日', 'お金', '銀行'] },
    土: { strokes: 3, hanViet: 'THỔ', meaningVi: 'đất', meanings: ['soil', 'earth', 'ground'], on: ['ド', 'ト'], kun: ['つち'], jlpt: 5, grade: 1, heisig: 'soil', compounds: ['土曜日', '土地', 'お土産'] },
    人: { strokes: 2, hanViet: 'NHÂN', meaningVi: 'người', meanings: ['person', 'human'], on: ['ジン', 'ニン'], kun: ['ひと'], jlpt: 5, grade: 1, heisig: 'person', compounds: ['日本人', '一人', '大人'] },
    山: { strokes: 3, hanViet: 'SƠN', meaningVi: 'núi', meanings: ['mountain'], on: ['サン', 'セン'], kun: ['やま'], jlpt: 5, grade: 1, heisig: 'mountain', compounds: ['富士山', '火山', '登山'] },
    川: { strokes: 3, hanViet: 'XUYÊN', meaningVi: 'sông', meanings: ['river', 'stream'], on: ['セン'], kun: ['かわ'], jlpt: 5, grade: 1, heisig: 'stream', compounds: ['川', '河川', '小川'] },
    本: { strokes: 5, hanViet: 'BẢN', meaningVi: 'sách; gốc; bản', meanings: ['book', 'origin', 'main'], on: ['ホン'], kun: ['もと'], jlpt: 5, grade: 1, heisig: 'book', compounds: ['日本', '本屋', '本当'] },
    学: { strokes: 8, hanViet: 'HỌC', meaningVi: 'học tập', meanings: ['study', 'learning', 'science'], on: ['ガク'], kun: ['まな.ぶ'], jlpt: 5, grade: 1, heisig: 'study', compounds: ['学校', '学生', '大学'] },
    校: { strokes: 10, hanViet: 'HIỆU', meaningVi: 'trường học', meanings: ['school', 'exam'], on: ['コウ'], kun: [], jlpt: 5, grade: 1, heisig: 'exam', compounds: ['学校', '高校', '校長'] },
    生: { strokes: 5, hanViet: 'SINH', meaningVi: 'sống; sinh ra', meanings: ['life', 'birth', 'student'], on: ['セイ', 'ショウ'], kun: ['い.きる', 'う.まれる', 'なま'], jlpt: 5, grade: 1, heisig: 'life', compounds: ['先生', '学生', '生活'] },
    先: { strokes: 6, hanViet: 'TIÊN', meaningVi: 'trước; tiên sinh', meanings: ['before', 'ahead', 'previous'], on: ['セン'], kun: ['さき', 'ま.ず'], jlpt: 5, grade: 1, heisig: 'before', compounds: ['先生', '先週', '先月'] },
    休: { strokes: 6, hanViet: 'HƯU', meaningVi: 'nghỉ ngơi', meanings: ['rest', 'day off', 'retire', 'sleep'], on: ['キュウ'], kun: ['やす.む', 'やす.まる', 'やす.める'], jlpt: 5, grade: 1, heisig: 'rest', compounds: ['休み', '休む', '休日', '夏休み'] },
    体: { strokes: 7, hanViet: 'THỂ', meaningVi: 'cơ thể; thân thể', meanings: ['body', 'substance', 'object'], on: ['タイ', 'テイ'], kun: ['からだ', 'かたち'], jlpt: 4, grade: 2, heisig: 'body', compounds: ['体', '体育館', '体力'] },
    何: { strokes: 7, hanViet: 'HÀ', meaningVi: 'cái gì', meanings: ['what'], on: ['カ'], kun: ['なに', 'なん'], jlpt: 5, grade: 2, heisig: 'what', compounds: ['何', '何時', '何人'] },
    作: { strokes: 7, hanViet: 'TÁC', meaningVi: 'làm; chế tạo; sáng tác', meanings: ['make', 'production', 'prepare', 'build'], on: ['サク', 'サ'], kun: ['つく.る', 'つく.り'], jlpt: 4, grade: 2, heisig: 'make', compounds: ['作る', '作文', '作品'] },
    住: { strokes: 7, hanViet: 'TRÚ', meaningVi: 'sống; cư trú', meanings: ['dwell', 'reside', 'live', 'inhabit'], on: ['ジュウ'], kun: ['す.む', 'す.まう'], jlpt: 4, grade: 3, heisig: 'dwell', compounds: ['住む', '住所', '住民'] },
    仕: { strokes: 5, hanViet: 'SĨ', meaningVi: 'phục vụ; làm việc', meanings: ['attend', 'doing', 'official', 'serve'], on: ['シ', 'ジ'], kun: ['つか.える'], jlpt: 4, grade: 3, heisig: 'attend', compounds: ['仕事', '仕方', '仕上げる'] },
    使: { strokes: 8, hanViet: 'SỬ', meaningVi: 'sử dụng; dùng', meanings: ['use', 'send on a mission', 'messenger'], on: ['シ'], kun: ['つか.う'], jlpt: 4, grade: 3, heisig: 'use', compounds: ['使う', '大使館', '使用'] },
    借: { strokes: 10, hanViet: 'TÁ', meaningVi: 'mượn; vay', meanings: ['borrow', 'rent'], on: ['シャク'], kun: ['か.りる'], jlpt: 4, grade: 4, heisig: 'borrow', compounds: ['借りる', '借金', '貸借'] },
    働: { strokes: 13, hanViet: 'ĐỘNG', meaningVi: 'làm việc; lao động', meanings: ['work', 'labor'], on: ['ドウ'], kun: ['はたら.く'], jlpt: 4, grade: 4, heisig: 'work', compounds: ['働く', '労働'] },
    保: { strokes: 9, hanViet: 'BẢO', meaningVi: 'bảo vệ; giữ gìn', meanings: ['protect', 'guarantee', 'keep'], on: ['ホ', 'ホウ'], kun: ['たも.つ'], jlpt: 3, grade: 5, heisig: 'protect', compounds: ['保証', '保険', '保存'] },
    語: { strokes: 14, hanViet: 'NGỮ', meaningVi: 'ngôn ngữ; từ ngữ; kể', meanings: ['word', 'speech', 'language'], on: ['ゴ'], kun: ['かた.る', 'かた.らう'], jlpt: 5, grade: 2, heisig: 'word', compounds: ['日本語', '英語', '物語', '単語'] },
    言: { strokes: 7, hanViet: 'NGÔN', meaningVi: 'nói; lời nói', meanings: ['say', 'word'], on: ['ゲン', 'ゴン'], kun: ['い.う', 'こと'], jlpt: 5, grade: 2, heisig: 'say', compounds: ['言葉', '言う', '言語'] },
    話: { strokes: 13, hanViet: 'THOẠI', meaningVi: 'nói chuyện; câu chuyện', meanings: ['tale', 'talk'], on: ['ワ'], kun: ['はな.す', 'はなし'], jlpt: 5, grade: 2, heisig: 'tale', compounds: ['話す', '電話', '会話'] },
    読: { strokes: 14, hanViet: 'ĐỘC', meaningVi: 'đọc', meanings: ['read'], on: ['ドク', 'トク', 'トウ'], kun: ['よ.む'], jlpt: 5, grade: 2, heisig: 'read', compounds: ['読む', '読書', '音読み'] },
    書: { strokes: 10, hanViet: 'THƯ', meaningVi: 'viết; sách', meanings: ['write', 'book'], on: ['ショ'], kun: ['か.く'], jlpt: 5, grade: 2, heisig: 'write', compounds: ['書く', '図書館', '辞書'] },
    聞: { strokes: 14, hanViet: 'VĂN', meaningVi: 'nghe; hỏi', meanings: ['hear', 'ask', 'listen'], on: ['ブン', 'モン'], kun: ['き.く', 'き.こえる'], jlpt: 5, grade: 2, heisig: 'hear', compounds: ['聞く', '新聞'] },
    食: { strokes: 9, hanViet: 'THỰC', meaningVi: 'ăn; thức ăn', meanings: ['eat', 'food'], on: ['ショク', 'ジキ'], kun: ['た.べる', 'く.う'], jlpt: 5, grade: 2, heisig: 'eat', compounds: ['食べる', '食事', '食堂'] },
    飲: { strokes: 12, hanViet: 'ẨM', meaningVi: 'uống', meanings: ['drink'], on: ['イン'], kun: ['の.む'], jlpt: 5, grade: 3, heisig: 'drink', compounds: ['飲む', '飲み物', '飲食店'] },
    見: { strokes: 7, hanViet: 'KIẾN', meaningVi: 'nhìn; xem; thấy', meanings: ['see', 'hopes', 'chances', 'idea', 'opinion', 'look at', 'visible'], on: ['ケン'], kun: ['み.る', 'み.える', 'み.せる'], jlpt: 5, grade: 1, heisig: 'see', compounds: ['見る', '見学', '意見'] },
    行: { strokes: 6, hanViet: 'HÀNH', meaningVi: 'đi; tiến hành; dòng', meanings: ['going', 'journey', 'carry out', 'line', 'row'], on: ['コウ', 'ギョウ', 'アン'], kun: ['い.く', 'ゆ.く', 'おこな.う'], jlpt: 5, grade: 2, heisig: 'going', compounds: ['行く', '旅行', '銀行'] },
    来: { strokes: 7, hanViet: 'LAI', meaningVi: 'đến; tương lai', meanings: ['come', 'due', 'next'], on: ['ライ'], kun: ['く.る', 'きた.る'], jlpt: 5, grade: 2, heisig: 'come', compounds: ['来る', '来週', '来年'] },
    帰: { strokes: 10, hanViet: 'QUY', meaningVi: 'trở về', meanings: ['homecoming', 'arrive at', 'lead to'], on: ['キ'], kun: ['かえ.る', 'かえ.す'], jlpt: 4, grade: 2, heisig: 'homecoming', compounds: ['帰る', '帰国', '日帰り'] },
    大: { strokes: 3, hanViet: 'ĐẠI', meaningVi: 'to; lớn', meanings: ['large', 'big'], on: ['ダイ', 'タイ'], kun: ['おお.きい'], jlpt: 5, grade: 1, heisig: 'large', compounds: ['大きい', '大学', '大人'] },
    小: { strokes: 3, hanViet: 'TIỂU', meaningVi: 'nhỏ; bé', meanings: ['little', 'small'], on: ['ショウ'], kun: ['ちい.さい', 'こ-', 'お-'], jlpt: 5, grade: 1, heisig: 'little', compounds: ['小さい', '小学校', '小川'] },
    中: { strokes: 4, hanViet: 'TRUNG', meaningVi: 'ở giữa; bên trong', meanings: ['in', 'inside', 'middle', 'mean', 'center'], on: ['チュウ'], kun: ['なか'], jlpt: 5, grade: 1, heisig: 'in', compounds: ['中', '中学校', '一日中'] },
    上: { strokes: 3, hanViet: 'THƯỢNG', meaningVi: 'trên; lên', meanings: ['above', 'up'], on: ['ジョウ', 'ショウ'], kun: ['うえ', 'あ.がる', 'のぼ.る'], jlpt: 5, grade: 1, heisig: 'above', compounds: ['上', '上手', '上がる'] },
    下: { strokes: 3, hanViet: 'HẠ', meaningVi: 'dưới; xuống', meanings: ['below', 'down', 'descend'], on: ['カ', 'ゲ'], kun: ['した', 'さ.がる', 'くだ.さる'], jlpt: 5, grade: 1, heisig: 'below', compounds: ['下', '地下鉄', '下手'] },
    口: { strokes: 3, hanViet: 'KHẨU', meaningVi: 'miệng; cổng ra vào', meanings: ['mouth', 'entrance'], on: ['コウ', 'ク'], kun: ['くち'], jlpt: 5, grade: 1, heisig: 'mouth', compounds: ['人口', '入口', '出口'] },
    目: { strokes: 5, hanViet: 'MỤC', meaningVi: 'mắt; mục', meanings: ['eye', 'class', 'look'], on: ['モク', 'ボク'], kun: ['め'], jlpt: 5, grade: 1, heisig: 'eye', compounds: ['目', '目的', '一番目'] },
    手: { strokes: 4, hanViet: 'THỦ', meaningVi: 'tay', meanings: ['hand'], on: ['シュ'], kun: ['て'], jlpt: 5, grade: 1, heisig: 'hand', compounds: ['手紙', '上手', '下手'] },
    足: { strokes: 7, hanViet: 'TÚC', meaningVi: 'chân; đủ', meanings: ['leg', 'foot', 'be sufficient'], on: ['ソク'], kun: ['あし', 'た.りる', 'た.す'], jlpt: 5, grade: 1, heisig: 'leg', compounds: ['足', '遠足', '満足'] },
    耳: { strokes: 6, hanViet: 'NHĨ', meaningVi: 'tai', meanings: ['ear'], on: ['ジ'], kun: ['みみ'], jlpt: 5, grade: 1, heisig: 'ear', compounds: ['耳', '耳鼻科'] },
    女: { strokes: 3, hanViet: 'NỮ', meaningVi: 'phụ nữ; con gái', meanings: ['woman', 'female'], on: ['ジョ', 'ニョ'], kun: ['おんな', 'め'], jlpt: 5, grade: 1, heisig: 'woman', compounds: ['女の子', '女性', '彼女'] },
    子: { strokes: 3, hanViet: 'TỬ', meaningVi: 'con; đứa trẻ', meanings: ['child'], on: ['シ', 'ス'], kun: ['こ'], jlpt: 5, grade: 1, heisig: 'child', compounds: ['子供', '椅子', '帽子'] },
    男: { strokes: 7, hanViet: 'NAM', meaningVi: 'đàn ông; con trai', meanings: ['male', 'man'], on: ['ダン', 'ナン'], kun: ['おとこ'], jlpt: 5, grade: 1, heisig: 'male', compounds: ['男の子', '男性', '長男'] },
    父: { strokes: 4, hanViet: 'PHỤ', meaningVi: 'cha; bố', meanings: ['father'], on: ['フ'], kun: ['ちち'], jlpt: 5, grade: 2, heisig: 'father', compounds: ['父', 'お父さん', '父母'] },
    母: { strokes: 5, hanViet: 'MẪU', meaningVi: 'mẹ', meanings: ['mother'], on: ['ボ'], kun: ['はは'], jlpt: 5, grade: 2, heisig: 'mama', compounds: ['母', 'お母さん', '父母'] },
    友: { strokes: 4, hanViet: 'HỮU', meaningVi: 'bạn bè', meanings: ['friend'], on: ['ユウ'], kun: ['とも'], jlpt: 5, grade: 2, heisig: 'friend', compounds: ['友達', '友人', '親友'] },
    명: { strokes: 6, hanViet: 'DANH', meaningVi: 'tên; danh tiếng', meanings: ['name', 'noted'], on: ['メイ', 'ミョウ'], kun: ['な'], jlpt: 5, grade: 1, heisig: 'name', compounds: ['名前', '有名', '名字'] },
    名: { strokes: 6, hanViet: 'DANH', meaningVi: 'tên; danh tiếng', meanings: ['name', 'noted'], on: ['メイ', 'ミョウ'], kun: ['な'], jlpt: 5, grade: 1, heisig: 'name', compounds: ['名前', '有名', '名字'] },
    明: { strokes: 8, hanViet: 'MINH', meaningVi: 'sáng; rõ ràng; ngày mai', meanings: ['bright', 'light', 'clear'], on: ['メイ', 'ミョウ'], kun: ['あ.かり', 'あか.るい', 'あ.ける'], jlpt: 4, grade: 2, heisig: 'bright', compounds: ['明日', '説明', '明るい'] },
    好: { strokes: 6, hanViet: 'HẢO', meaningVi: 'thích; tốt đẹp', meanings: ['fond', 'pleasing', 'like something'], on: ['コウ'], kun: ['す.き', 'この.む'], jlpt: 4, grade: 4, heisig: 'fond', compounds: ['好き', '大好き', '好物'] },
    安: { strokes: 6, hanViet: 'AN', meaningVi: 'rẻ; an tâm; bình an', meanings: ['relax', 'cheap', 'low', 'quiet', 'peaceful'], on: ['アン'], kun: ['やす.い'], jlpt: 5, grade: 3, heisig: 'relax', compounds: ['安い', '安心', '安全'] },
    高: { strokes: 10, hanViet: 'CAO', meaningVi: 'cao; đắt', meanings: ['tall', 'high', 'expensive'], on: ['コウ'], kun: ['たか.い'], jlpt: 5, grade: 2, heisig: 'tall', compounds: ['高い', '高校', '最高'] },
    新: { strokes: 13, hanViet: 'TÂN', meaningVi: 'mới', meanings: ['new'], on: ['シン'], kun: ['あたら.しい', 'あら.た'], jlpt: 5, grade: 2, heisig: 'new', compounds: ['新しい', '新聞', '新年'] },
    古: { strokes: 5, hanViet: 'CỔ', meaningVi: 'cũ; cổ xưa', meanings: ['old'], on: ['コ'], kun: ['ふる.い'], jlpt: 5, grade: 2, heisig: 'old', compounds: ['古い', '中古'] },
    電: { strokes: 13, hanViet: 'ĐIỆN', meaningVi: 'điện', meanings: ['electricity'], on: ['デン'], kun: [], jlpt: 5, grade: 2, heisig: 'electricity', compounds: ['電車', '電話', '電気', '電池'] },
    車: { strokes: 7, hanViet: 'XA', meaningVi: 'xe; ô tô', meanings: ['car', 'wheel'], on: ['シャ'], kun: ['くるま'], jlpt: 5, grade: 1, heisig: 'car', compounds: ['車', '電車', '自転車'] },
    駅: { strokes: 14, hanViet: 'DỊCH', meaningVi: 'nhà ga', meanings: ['station'], on: ['エキ'], kun: [], jlpt: 5, grade: 3, heisig: 'station', compounds: ['駅', '駅前', '駅員'] },
    店: { strokes: 8, hanViet: 'ĐIẾM', meaningVi: 'cửa hàng; tiệm', meanings: ['store', 'shop'], on: ['テン'], kun: ['みせ'], jlpt: 5, grade: 2, heisig: 'store', compounds: ['店', '店員', '喫茶店'] },
    家: { strokes: 10, hanViet: 'GIA', meaningVi: 'nhà; gia đình', meanings: ['house', 'home', 'family'], on: ['カ', 'ケ'], kun: ['いえ', 'や'], jlpt: 4, grade: 2, heisig: 'house', compounds: ['家', '家族', '作家'] },
    海: { strokes: 9, hanViet: 'HẢI', meaningVi: 'biển', meanings: ['sea', 'ocean'], on: ['カイ'], kun: ['うみ'], jlpt: 4, grade: 2, heisig: 'sea', compounds: ['海', '海外', '北海道'] },
    花: { strokes: 7, hanViet: 'HOA', meaningVi: 'hoa', meanings: ['flower'], on: ['カ'], kun: ['はな'], jlpt: 5, grade: 1, heisig: 'flower', compounds: ['花', '花火', '花見'] },
    茶: { strokes: 9, hanViet: 'TRÀ', meaningVi: 'trà; chè', meanings: ['tea'], on: ['チャ', 'サ'], kun: [], jlpt: 4, grade: 2, heisig: 'tea', compounds: ['お茶', '喫茶店', '紅茶'] },
    時: { strokes: 10, hanViet: 'THỜI', meaningVi: 'thời gian; giờ', meanings: ['time', 'hour'], on: ['ジ'], kun: ['とき'], jlpt: 5, grade: 2, heisig: 'time', compounds: ['時間', '時計', '何時'] },
    間: { strokes: 12, hanViet: 'GIAN', meaningVi: 'khoảng giữa; thời gian', meanings: ['interval', 'space'], on: ['カン', 'ケン'], kun: ['あいだ', 'ま'], jlpt: 5, grade: 2, heisig: 'interval', compounds: ['時間', '人間', '間に合う'] },
};

// Explicit compound Kanji -> constituent radical sequence (KRADFILE-style decomposition)
const EXPLICIT_KANJI_RADICALS: Record<string, string[]> = {
    休: ['亻', '木'],
    体: ['亻', '木', '一'],
    保: ['亻', '口', '木'],
    何: ['亻', '一', '口', '亅'],
    作: ['亻', '丿', '丨'],
    住: ['亻', '丶', '玉'],
    仕: ['亻', '士'],
    使: ['亻', '口', '一'],
    借: ['亻', '廾', '日'],
    働: ['亻', '里', '力'],
    便: ['亻', '一', '日'],
    信: ['亻', '言'],
    語: ['言', '五', '口'],
    話: ['言', '舌', '口'],
    読: ['言', '士', '冖', '儿'],
    記: ['言', '己'],
    計: ['言', '十'],
    詩: ['言', '土', '寸'],
    試: ['言', '弋', '工'],
    説: ['言', '八', '口', '儿'],
    課: ['言', '田', '木'],
    校: ['木', '亠', '父'],
    本: ['木', '一'],
    机: ['木', '几'],
    林: ['木'],
    森: ['木'],
    果: ['田', '木'],
    楽: ['白', '木'],
    様: ['木', '羊', '水'],
    橋: ['木', '口'],
    新: ['立', '木', '斤'],
    親: ['立', '木', '見'],
    明: ['日', '月'],
    時: ['日', '土', '寸'],
    早: ['日', '十'],
    春: ['三', '人', '日'],
    昨: ['日', '乍'],
    晴: ['日', '青'],
    曜: ['日', '羽', '隹'],
    間: ['門', '日'],
    問: ['門', '口'],
    聞: ['門', '耳'],
    開: ['門', '廾'],
    閉: ['門', '才'],
    好: ['女', '子'],
    安: ['宀', '女'],
    始: ['女', '厶', '口'],
    姉: ['女', '巾'],
    妹: ['女', '木'],
    家: ['宀', '豕'],
    室: ['宀', '至'],
    宿: ['宀', '亻', '百'],
    字: ['宀', '子'],
    学: ['冖', '子'],
    食: ['人', '良', '食'],
    飲: ['飠', '欠'],
    飯: ['飠', '厂', '又'],
    館: ['飠', '宀'],
    海: ['氵', '母'],
    泳: ['氵', '永'],
    池: ['氵', '乙'],
    洗: ['氵', '先'],
    活: ['氵', '舌'],
    消: ['氵', '小', '月'],
    清: ['氵', '青'],
    漢: ['氵', '艹', '口', '大'],
    花: ['艹', '亻', '匕'],
    茶: ['艹', '人', '木'],
    草: ['艹', '日', '十'],
    薬: ['艹', '白', '木'],
    菜: ['艹', '爪', '木'],
    葉: ['艹', '世', '木'],
    近: ['辶', '斤'],
    道: ['辶', '首'],
    通: ['辶', '用'],
    週: ['辶', '冂', '土', '口'],
    進: ['辶', '隹'],
    遠: ['辶', '土', '口', '衣'],
    選: ['辶', '己', '共'],
    持: ['扌', '土', '寸'],
    指: ['扌', '匕', '日'],
    拾: ['扌', '人', '口'],
    待: ['彳', '土', '寸'],
    行: ['彳', '行'],
    後: ['彳', '幺', '夂'],
    思: ['田', '心'],
    意: ['立', '日', '心'],
    急: ['彐', '心'],
    忘: ['亠', '心'],
    忙: ['忄', '亠'],
    情: ['忄', '青'],
    電: ['雨', '田', '乙'],
    雪: ['雨', '彐'],
    雲: ['雨', '二', '厶'],
    駅: ['馬', '尸'],
    験: ['馬', '人', '口'],
    銀: ['金', '艮'],
    鉄: ['金', '失'],
    鏡: ['金', '立', '日', '儿'],
    買: ['网', '貝'],
    売: ['士', '冖', '儿'],
    員: ['口', '貝'],
    見: ['目', '儿'],
    男: ['田', '力'],
    動: ['里', '力'],
    勉: ['免', '力'],
    強: ['弓', '厶', '虫'],
    猫: ['犬', '艹', '田'],
    犬: ['大', '丶'],
    鳥: ['鳥', '灬'],
    魚: ['魚', '田', '灬'],
};

// Curated authentic KanjiVG 109x109 SVG stroke datasets for instant offline rendering & deterministic tests
const FALLBACK_KANJI_VG_XML: Record<string, string> = {
    // 休 (6 strokes: 亻 + 木)
    休: `<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
<g id="kvg:StrokePaths_04f11">
<path id="kvg:04f11-s1" d="M32.5,16.5c0.24,2.06-0.06,4.76-0.83,6.52c-4.9,11.23-11.12,22.25-22.42,35.77"/>
<path id="kvg:04f11-s2" d="M25.53,41.5c0.86,0.86,1.26,2.25,1.26,3.98c0,10.62-0.03,30.9-0.04,42.77c0,2.91,0,5.21,0,6.62"/>
<path id="kvg:04f11-s3" d="M38.25,38.88c2.45,0.57,5.23,0.4,7.69,0.12c10.97-1.25,25.68-3.09,37.81-3.88c2.59-0.17,5.12-0.15,7.62,0.4"/>
<path id="kvg:04f11-s4" d="M62.68,14.5c1.1,1.1,1.67,2.62,1.67,4.25c0,0.87,0.04,50.85,0.04,70.25c0,4.28,0,7.13-0.01,7.75"/>
<path id="kvg:04f11-s5" d="M62.18,38.25c0,1.62-0.78,3.59-1.64,5.16C53.68,55.97,43.76,69.85,31.5,78.5"/>
<path id="kvg:04f11-s6" d="M64.62,38.5c4.73,8.59,16.53,24.47,24.4,33.17c2.22,2.46,4.73,4.83,7.73,6.58"/>
</g>
<g id="kvg:StrokeNumbers_04f11">
<text transform="matrix(1 0 0 1 23.50 16.50)">1</text>
<text transform="matrix(1 0 0 1 19.50 56.50)">2</text>
<text transform="matrix(1 0 0 1 36.50 35.50)">3</text>
<text transform="matrix(1 0 0 1 53.50 14.50)">4</text>
<text transform="matrix(1 0 0 1 48.50 49.50)">5</text>
<text transform="matrix(1 0 0 1 73.50 48.50)">6</text>
</g>
</svg>`,

    // 体 (7 strokes: 亻 + 本)
    体: `<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
<g id="kvg:StrokePaths_04f53">
<path id="kvg:04f53-s1" d="M31.75,16.25c0.23,2.1-0.06,4.61-0.81,6.4c-4.69,11.1-10.94,22.6-21.69,36.14"/>
<path id="kvg:04f53-s2" d="M24.78,41.25c0.92,0.92,1.25,2.38,1.25,4c0,10.73-0.02,32.18-0.03,44.25c0,3.02,0,5.36,0,6.62"/>
<path id="kvg:04f53-s3" d="M38.28,37.43c2.47,0.57,5.07,0.44,7.6,0.12c10.74-1.36,26.12-3.29,37.75-4.01c2.52-0.16,5.02-0.13,7.49,0.42"/>
<path id="kvg:04f53-s4" d="M62.68,13.75c1.04,1.04,1.54,2.62,1.54,4.25c0,0.86,0.04,53.25,0.04,72.75c0,3.96,0,6.6,0,7.25"/>
<path id="kvg:04f53-s5" d="M62.15,37.23c0,1.39-0.66,3.25-1.5,4.78C53.95,54.23,43.9,67.5,32.25,75.5"/>
<path id="kvg:04f53-s6" d="M64.62,37.25c4.62,8.25,16.21,23.22,23.9,31.59c2.22,2.42,4.6,4.78,7.48,6.41"/>
<path id="kvg:04f53-s7" d="M46.75,74.65c1.85,0.44,3.88,0.42,5.75,0.23c6.81-0.68,15.69-1.69,22.38-2.16c1.92-0.13,3.77-0.11,5.62,0.29"/>
</g>
<g id="kvg:StrokeNumbers_04f53">
<text transform="matrix(1 0 0 1 22.50 16.50)">1</text>
<text transform="matrix(1 0 0 1 18.50 57.50)">2</text>
<text transform="matrix(1 0 0 1 36.50 34.50)">3</text>
<text transform="matrix(1 0 0 1 53.50 13.50)">4</text>
<text transform="matrix(1 0 0 1 49.50 47.50)">5</text>
<text transform="matrix(1 0 0 1 72.50 46.50)">6</text>
<text transform="matrix(1 0 0 1 47.50 71.50)">7</text>
</g>
</svg>`,

    // 校 (10 strokes: 木 + 交)
    校: `<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
<g id="kvg:StrokePaths_06821">
<path id="kvg:06821-s1" d="M11.78,38.72c1.85,0.41,3.89,0.36,5.48,0.16c5.49-0.68,15.26-2.48,21.02-3.51c1.25-0.22,2.84-0.37,4.24-0.25"/>
<path id="kvg:06821-s2" d="M28.11,15.25c1.13,1.13,1.54,2.75,1.54,4.67c0,0.81-0.04,49.23-0.05,68.83c0,3.96,0,6.79,0,7.75"/>
<path id="kvg:06821-s3" d="M28.69,39.53c0,1.59-0.54,3.77-1.08,5.19c-4.63,12.16-8.36,18.52-16.25,29.87"/>
<path id="kvg:06821-s4" d="M32.22,47.65c2.68,1.8,6.4,6.85,8.66,10.6"/>
<path id="kvg:06821-s5" d="M66.52,14.5c1.18,1.18,1.6,2.62,1.6,4.32c0,4.08-0.06,6.83-0.06,10.05"/>
<path id="kvg:06821-s6" d="M45.75,31.48c2.5,0.52,4.88,0.41,7.38,0.11c9.76-1.17,24.22-2.96,34.12-3.58c2.25-0.14,4.62-0.13,6.75,0.39"/>
<path id="kvg:06821-s7" d="M56.98,38.83c0.08,1.03-0.08,2.01-0.58,2.93c-2.29,4.21-6.51,9.79-12.65,14.49"/>
<path id="kvg:06821-s8" d="M76.52,37.73c5.64,3.8,11.35,8.89,14.63,14.02"/>
<path id="kvg:06821-s9" d="M77.4,48.75c0.47,1.14,0.35,2.66-0.36,4.35C70.5,68.5,58.5,83.25,41.25,92.5"/>
<path id="kvg:06821-s10" d="M54.5,54.5c3.82,0.29,21.09,21.05,32.57,31.69c2.77,2.57,5.55,4.68,8.93,6.06"/>
</g>
<g id="kvg:StrokeNumbers_06821">
<text transform="matrix(1 0 0 1 5.50 39.50)">1</text>
<text transform="matrix(1 0 0 1 19.50 15.50)">2</text>
<text transform="matrix(1 0 0 1 18.50 49.50)">3</text>
<text transform="matrix(1 0 0 1 35.50 46.50)">4</text>
<text transform="matrix(1 0 0 1 57.50 15.50)">5</text>
<text transform="matrix(1 0 0 1 44.50 28.50)">6</text>
<text transform="matrix(1 0 0 1 49.50 41.50)">7</text>
<text transform="matrix(1 0 0 1 70.50 38.50)">8</text>
<text transform="matrix(1 0 0 1 69.50 49.50)">9</text>
<text transform="matrix(1 0 0 1 49.50 62.50)">10</text>
</g>
</svg>`,

    // 語 (14 strokes: 言 + 五 + 口)
    語: `<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
<g id="kvg:StrokePaths_08a9e">
<path id="kvg:08a9e-s1" d="M24.38,14.75c2.6,1.5,6.72,6.17,7.37,8.5"/>
<path id="kvg:08a9e-s2" d="M11.87,32.58c1.63,0.42,3.6,0.36,5.27,0.16c7.61-0.91,15.99-2.24,22.62-3.05c1.56-0.19,3.12-0.19,4.58,0.13"/>
<path id="kvg:08a9e-s3" d="M17.73,45.56c1.27,0.36,2.87,0.29,4.15,0.14c4.37-0.51,9.74-1.45,14.12-2.07c1.25-0.18,2.63-0.25,3.9-0.03"/>
<path id="kvg:08a9e-s4" d="M18.23,58.33c1.2,0.35,2.78,0.28,4.03,0.12c4.12-0.53,9.87-1.45,14.25-2.09c1.22-0.18,2.52-0.21,3.77,0.01"/>
<path id="kvg:08a9e-s5" d="M16.64,71.4c0.79,0.68,1.21,1.56,1.36,2.6c0.73,4.23,1.52,9.88,2.23,15.22c0.2,1.51,0.39,2.96,0.57,4.28"/>
<path id="kvg:08a9e-s6" d="M18.81,72.87c6.44-1.12,12.48-2.1,18.42-2.97c2.39-0.35,4.01,0.6,3.5,3.12c-0.88,4.35-1.73,8.73-3.18,14.95"/>
<path id="kvg:08a9e-s7" d="M21.47,90.55c4.49-0.54,9.85-1.18,15.77-1.85c1.12-0.13,2.27-0.26,3.42-0.39"/>
<path id="kvg:08a9e-s8" d="M51.5,20.75c2.12,0.42,4.31,0.34,6.49,0.12c7.89-0.81,18.29-2.16,26.89-2.74c2.15-0.14,4.25-0.11,6.37,0.37"/>
<path id="kvg:08a9e-s9" d="M67.25,23.25c0.5,1.12,0.5,2.38,0.12,3.88c-1.86,7.45-5.62,21.5-7.88,29.62"/>
<path id="kvg:08a9e-s10" d="M51.25,38.75c1.89,0.46,4.02,0.53,5.93,0.23c7.82-1.23,17.45-2.61,23.58-3.24c2.73-0.28,4.62,0.88,4.12,3.62c-1.08,5.94-2.5,12.76-3.88,18.62"/>
<path id="kvg:08a9e-s11" d="M44.5,59.75c2.5,0.5,5.14,0.42,7.62,0.16c12.25-1.29,26.63-2.54,39.75-3.04c2.55-0.1,5.12,0.01,7.62,0.5"/>
<path id="kvg:08a9e-s12" d="M52.5,70.25c0.88,0.88,1.35,1.98,1.54,3.15c0.89,5.52,1.69,11.69,2.44,17.85c0.2,1.64,0.39,3.24,0.56,4.75"/>
<path id="kvg:08a9e-s13" d="M54.88,71.88c9.29-1.28,22.62-2.66,29.25-3.28c3.18-0.3,4.97,0.82,4.28,4.14c-1.06,5.11-2.29,10.76-3.91,17.01"/>
<path id="kvg:08a9e-s14" d="M57.75,92.5c6.45-0.55,16.65-1.37,25.5-2.02c1.56-0.11,3.06-0.22,4.5-0.31"/>
</g>
<g id="kvg:StrokeNumbers_08a9e">
<text transform="matrix(1 0 0 1 17.50 14.50)">1</text>
<text transform="matrix(1 0 0 1 4.50 33.50)">2</text>
<text transform="matrix(1 0 0 1 10.50 46.50)">3</text>
<text transform="matrix(1 0 0 1 10.50 59.50)">4</text>
<text transform="matrix(1 0 0 1 10.50 78.50)">5</text>
<text transform="matrix(1 0 0 1 20.50 69.50)">6</text>
<text transform="matrix(1 0 0 1 24.50 87.50)">7</text>
<text transform="matrix(1 0 0 1 49.50 17.50)">8</text>
<text transform="matrix(1 0 0 1 59.50 29.50)">9</text>
<text transform="matrix(1 0 0 1 47.50 35.50)">10</text>
<text transform="matrix(1 0 0 1 42.50 56.50)">11</text>
<text transform="matrix(1 0 0 1 43.50 78.50)">12</text>
<text transform="matrix(1 0 0 1 56.50 68.50)">13</text>
<text transform="matrix(1 0 0 1 59.50 89.50)">14</text>
</g>
</svg>`,

    // 日 (4 strokes)
    日: `<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
<g id="kvg:StrokePaths_065e5">
<path id="kvg:065e5-s1" d="M30.5,23.5c1.12,1.12,1.75,2.75,1.75,4.75c0,1.74-0.12,40.38-0.12,57.5c0,3.62,0,6.12,0,6.75"/>
<path id="kvg:065e5-s2" d="M33.25,25.5c10.5-1.25,31.75-3.25,41.5-4c3.55-0.27,5.5,1.5,5.5,4.75c0,6.5-0.12,40.75-0.12,58.25c0,3.75,0,6.38,0,7"/>
<path id="kvg:065e5-s3" d="M33.5,55.25c11.25-1,32.25-2.75,45.25-3.25"/>
<path id="kvg:065e5-s4" d="M33.25,87.5c12.25-0.75,31.5-2.25,45.5-2.75"/>
</g>
<g id="kvg:StrokeNumbers_065e5">
<text transform="matrix(1 0 0 1 23.50 31.50)">1</text>
<text transform="matrix(1 0 0 1 35.50 21.50)">2</text>
<text transform="matrix(1 0 0 1 37.50 51.50)">3</text>
<text transform="matrix(1 0 0 1 37.50 83.50)">4</text>
</g>
</svg>`,

    // 木 (4 strokes)
    木: `<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
<g id="kvg:StrokePaths_06728">
<path id="kvg:06728-s1" d="M19.25,39.5c2.75,0.62,5.62,0.5,8.62,0.25c15.38-1.25,37.88-3.5,54.25-4.25c3.12-0.14,6.12,0,9.12,0.5"/>
<path id="kvg:06728-s2" d="M52.75,13.5c1.25,1.25,1.75,3,1.75,5c0,8.5,0,55.75,0,72.25c0,4,0,6.75,0,7.75"/>
<path id="kvg:06728-s3" d="M51.75,38.75c0,1.75-0.88,3.62-1.88,5.25C41.25,58,28.75,72.5,14.5,81.25"/>
<path id="kvg:06728-s4" d="M55,39c6.5,9.25,22.25,26.5,32.75,36.25c2.88,2.68,5.88,5,9.25,6.75"/>
</g>
<g id="kvg:StrokeNumbers_06728">
<text transform="matrix(1 0 0 1 12.50 40.50)">1</text>
<text transform="matrix(1 0 0 1 43.50 14.50)">2</text>
<text transform="matrix(1 0 0 1 38.50 49.50)">3</text>
<text transform="matrix(1 0 0 1 64.50 48.50)">4</text>
</g>
</svg>`,

    // 本 (5 strokes)
    本: `<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
<g id="kvg:StrokePaths_0672c">
<path id="kvg:0672c-s1" d="M20.5,35.5c2.75,0.62,5.62,0.5,8.62,0.25c15.38-1.25,36.88-3.5,53.25-4.25c3.12-0.14,6.12,0,9.12,0.5"/>
<path id="kvg:0672c-s2" d="M52.75,12.5c1.25,1.25,1.75,3,1.75,5c0,8.5,0,58.75,0,75.25c0,4,0,6.75,0,7.75"/>
<path id="kvg:0672c-s3" d="M51.75,35.25c0,1.75-0.88,3.62-1.88,5.25C41.25,54.5,28.75,69,14.5,77.75"/>
<path id="kvg:0672c-s4" d="M55,35.5c6.5,9.25,22.25,26.5,32.75,36.25c2.88,2.68,5.88,5,9.25,6.75"/>
<path id="kvg:0672c-s5" d="M33.5,73.25c2.25,0.5,4.62,0.45,6.88,0.25c9.88-0.88,21.5-2.12,30.75-2.62c2.38-0.13,4.62-0.12,6.88,0.38"/>
</g>
<g id="kvg:StrokeNumbers_0672c">
<text transform="matrix(1 0 0 1 13.50 36.50)">1</text>
<text transform="matrix(1 0 0 1 43.50 13.50)">2</text>
<text transform="matrix(1 0 0 1 38.50 45.50)">3</text>
<text transform="matrix(1 0 0 1 64.50 44.50)">4</text>
<text transform="matrix(1 0 0 1 33.50 70.50)">5</text>
</g>
</svg>`,

    // 人 (2 strokes)
    人: `<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
<g id="kvg:StrokePaths_04eba">
<path id="kvg:04eba-s1" d="M54.5,20c0.37,2.12,0.23,4.03-0.22,6.27C51.62,39.5,38.25,72.25,16.5,87.25"/>
<path id="kvg:04eba-s2" d="M46,54.25c6.12,6,25.51,22.24,35.52,29.72c3.66,2.73,6.98,4.65,11.48,5.78"/>
</g>
<g id="kvg:StrokeNumbers_04eba">
<text transform="matrix(1 0 0 1 45.50 19.50)">1</text>
<text transform="matrix(1 0 0 1 52.50 55.50)">2</text>
</g>
</svg>`,
};

// In-memory caches
const strokeMemoryCache = new Map<string, KanjiStrokeData>();
const metadataMemoryCache = new Map<string, KanjiMetadata>();

const IDB_NAME = 'nihongo_snap_kanji_cache_v1';
const IDB_STROKE_STORE = 'kanjivg_strokes';
const IDB_META_STORE = 'kanjiapi_meta';

function openCacheDb(): Promise<IDBDatabase | null> {
    if (typeof indexedDB === 'undefined') return Promise.resolve(null);
    return new Promise(resolve => {
        try {
            const req = indexedDB.open(IDB_NAME, 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(IDB_STROKE_STORE)) {
                    db.createObjectStore(IDB_STROKE_STORE);
                }
                if (!db.objectStoreNames.contains(IDB_META_STORE)) {
                    db.createObjectStore(IDB_META_STORE);
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        } catch {
            resolve(null);
        }
    });
}

async function idbGet<T>(storeName: string, key: string): Promise<T | null> {
    const db = await openCacheDb();
    if (!db) return null;
    return new Promise(resolve => {
        try {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const req = store.get(key);
            req.onsuccess = () => resolve((req.result as T) ?? null);
            req.onerror = () => resolve(null);
        } catch {
            resolve(null);
        }
    });
}

async function idbSet<T>(storeName: string, key: string, value: T): Promise<void> {
    const db = await openCacheDb();
    if (!db) return;
    return new Promise(resolve => {
        try {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.put(value, key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
        } catch {
            resolve();
        }
    });
}

function sessionGet<T>(key: string): T | null {
    if (typeof sessionStorage === 'undefined') return null;
    try {
        const raw = sessionStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}

function sessionSet<T>(key: string, value: T): void {
    if (typeof sessionStorage === 'undefined') return;
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore storage quota errors
    }
}

/**
 * Step 2.1: Convert any single Kanji/Kana character into its 5-digit lowercase hexadecimal Unicode code point.
 */
export function kanjiToHex(char: string): string {
    const firstChar = Array.from((char || '').trim())[0];
    if (!firstChar) return '';
    const hex = firstChar.codePointAt(0)!.toString(16).padStart(5, '0').toLowerCase();
    return hex;
}

/**
 * Returns the official KanjiVG vector URL on jsDelivr CDN.
 */
export function getKanjiVgUrl(char: string): string {
    const hex = kanjiToHex(char);
    return `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${hex}.svg`;
}

/**
 * Returns the KanjiAPI.dev endpoint URL for a single Kanji character.
 */
export function getKanjiApiUrl(char: string): string {
    const firstChar = Array.from((char || '').trim())[0] || '';
    return `https://kanjiapi.dev/v1/kanji/${encodeURIComponent(firstChar)}`;
}

/**
 * Extract all Kanji characters from a Japanese string (word, phrase, or single char).
 */
export function extractKanjiCharacters(text: string): string[] {
    if (!text) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const ch of Array.from(text)) {
        if (/^[\u4e00-\u9faf\u3400-\u4dbf]$/u.test(ch) && !seen.has(ch)) {
            seen.add(ch);
            out.push(ch);
        }
    }
    return out;
}

/**
 * Parse an SVG path `d` string into sampled points, startPoint, endPoint, and path length.
 * Works both in browser and Node.js (without DOM SVGPathElement).
 */
export function parseSvgPathGeometry(d: string): {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    points: { x: number; y: number }[];
    length: number;
} {
    const tokens = d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/g) || [];
    const points: { x: number; y: number }[] = [];
    let i = 0;
    let cmd = '';
    let curX = 0;
    let curY = 0;
    let startX = 0;
    let startY = 0;

    const nextNum = () => (i < tokens.length ? parseFloat(tokens[i++]) : 0);
    const isCmd = (t: string) => /^[a-zA-Z]$/.test(t);

    const pushSampleCubic = (
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number,
        y3: number
    ) => {
        const steps = 8;
        for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            const mt = 1 - t;
            const px =
                mt * mt * mt * x0 +
                3 * mt * mt * t * x1 +
                3 * mt * t * t * x2 +
                t * t * t * x3;
            const py =
                mt * mt * mt * y0 +
                3 * mt * mt * t * y1 +
                3 * mt * t * t * y2 +
                t * t * t * y3;
            points.push({ x: px, y: py });
        }
    };

    const pushSampleQuad = (
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ) => {
        const steps = 6;
        for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            const mt = 1 - t;
            const px = mt * mt * x0 + 2 * mt * t * x1 + t * t * x2;
            const py = mt * mt * y0 + 2 * mt * t * y1 + t * t * y2;
            points.push({ x: px, y: py });
        }
    };

    let lastCtrlX = 0;
    let lastCtrlY = 0;

    while (i < tokens.length) {
        if (isCmd(tokens[i])) {
            cmd = tokens[i++];
        }
        switch (cmd) {
            case 'M': {
                curX = nextNum();
                curY = nextNum();
                startX = curX;
                startY = curY;
                points.push({ x: curX, y: curY });
                cmd = 'L';
                break;
            }
            case 'm': {
                curX += nextNum();
                curY += nextNum();
                startX = curX;
                startY = curY;
                points.push({ x: curX, y: curY });
                cmd = 'l';
                break;
            }
            case 'L': {
                curX = nextNum();
                curY = nextNum();
                points.push({ x: curX, y: curY });
                break;
            }
            case 'l': {
                curX += nextNum();
                curY += nextNum();
                points.push({ x: curX, y: curY });
                break;
            }
            case 'H': {
                curX = nextNum();
                points.push({ x: curX, y: curY });
                break;
            }
            case 'h': {
                curX += nextNum();
                points.push({ x: curX, y: curY });
                break;
            }
            case 'V': {
                curY = nextNum();
                points.push({ x: curX, y: curY });
                break;
            }
            case 'v': {
                curY += nextNum();
                points.push({ x: curX, y: curY });
                break;
            }
            case 'C': {
                const x1 = nextNum();
                const y1 = nextNum();
                const x2 = nextNum();
                const y2 = nextNum();
                const x = nextNum();
                const y = nextNum();
                pushSampleCubic(curX, curY, x1, y1, x2, y2, x, y);
                lastCtrlX = x2;
                lastCtrlY = y2;
                curX = x;
                curY = y;
                break;
            }
            case 'c': {
                const x1 = curX + nextNum();
                const y1 = curY + nextNum();
                const x2 = curX + nextNum();
                const y2 = curY + nextNum();
                const x = curX + nextNum();
                const y = curY + nextNum();
                pushSampleCubic(curX, curY, x1, y1, x2, y2, x, y);
                lastCtrlX = x2;
                lastCtrlY = y2;
                curX = x;
                curY = y;
                break;
            }
            case 'S': {
                const x1 = 2 * curX - lastCtrlX;
                const y1 = 2 * curY - lastCtrlY;
                const x2 = nextNum();
                const y2 = nextNum();
                const x = nextNum();
                const y = nextNum();
                pushSampleCubic(curX, curY, x1, y1, x2, y2, x, y);
                lastCtrlX = x2;
                lastCtrlY = y2;
                curX = x;
                curY = y;
                break;
            }
            case 's': {
                const x1 = 2 * curX - lastCtrlX;
                const y1 = 2 * curY - lastCtrlY;
                const x2 = curX + nextNum();
                const y2 = curY + nextNum();
                const x = curX + nextNum();
                const y = curY + nextNum();
                pushSampleCubic(curX, curY, x1, y1, x2, y2, x, y);
                lastCtrlX = x2;
                lastCtrlY = y2;
                curX = x;
                curY = y;
                break;
            }
            case 'Q': {
                const x1 = nextNum();
                const y1 = nextNum();
                const x = nextNum();
                const y = nextNum();
                pushSampleQuad(curX, curY, x1, y1, x, y);
                lastCtrlX = x1;
                lastCtrlY = y1;
                curX = x;
                curY = y;
                break;
            }
            case 'q': {
                const x1 = curX + nextNum();
                const y1 = curY + nextNum();
                const x = curX + nextNum();
                const y = curY + nextNum();
                pushSampleQuad(curX, curY, x1, y1, x, y);
                lastCtrlX = x1;
                lastCtrlY = y1;
                curX = x;
                curY = y;
                break;
            }
            case 'Z':
            case 'z': {
                curX = startX;
                curY = startY;
                points.push({ x: curX, y: curY });
                break;
            }
            default: {
                i++;
                break;
            }
        }
    }

    if (points.length === 0) {
        return {
            startPoint: { x: 54.5, y: 54.5 },
            endPoint: { x: 54.5, y: 54.5 },
            points: [{ x: 54.5, y: 54.5 }],
            length: 0,
        };
    }

    let totalLen = 0;
    for (let j = 1; j < points.length; j++) {
        const dx = points[j].x - points[j - 1].x;
        const dy = points[j].y - points[j - 1].y;
        totalLen += Math.hypot(dx, dy);
    }

    return {
        startPoint: {
            x: Math.round(points[0].x * 100) / 100,
            y: Math.round(points[0].y * 100) / 100,
        },
        endPoint: {
            x: Math.round(points[points.length - 1].x * 100) / 100,
            y: Math.round(points[points.length - 1].y * 100) / 100,
        },
        points,
        length: Math.max(1, Math.round(totalLen * 100) / 100),
    };
}

/**
 * Parse KanjiVG SVG XML text to extract `<path id="kvg:...-s1" d="..." />` stroke paths
 * in exact sequential order (`s1, s2, ... sN`) and their corresponding `<text transform="matrix(...)">` stroke numbers.
 */
export function parseKanjiVgSvg(
    svgText: string,
    char: string,
    source: KanjiStrokeData['source'] = 'kanjivg-cdn'
): KanjiStrokeData {
    const firstChar = Array.from((char || '').trim())[0] || char;
    const hex = kanjiToHex(firstChar);

    const viewBoxMatch = svgText.match(/viewBox=["']([^"']+)["']/i);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 109 109';

    // Extract stroke number coordinates from <text transform="matrix(1 0 0 1 X Y)">N</text>
    const numberCoords = new Map<number, { x: number; y: number }>();
    const textRegex = /<text[^>]*transform=["']matrix\([^)]*?([+-]?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?)\)["'][^>]*>\s*(\d+)\s*<\/text>/gi;
    let textMatch: RegExpExecArray | null;
    while ((textMatch = textRegex.exec(svgText)) !== null) {
        const x = parseFloat(textMatch[1]);
        const y = parseFloat(textMatch[2]);
        const num = parseInt(textMatch[3], 10);
        if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(num)) {
            numberCoords.set(num, { x, y });
        }
    }

    // Extract all <path .../> tags that contain stroke id "-s1", "-s2", ...
    const rawPaths: {
        order: number;
        id: string;
        d: string;
        type?: string;
    }[] = [];

    const pathTagRegex = /<path\b([^>]*?)\/?>/gi;
    let pathMatch: RegExpExecArray | null;
    while ((pathMatch = pathTagRegex.exec(svgText)) !== null) {
        const attrs = pathMatch[1];
        const idMatch = attrs.match(/\bid=["']([^"']*?-s(\d+))["']/i);
        const dMatch = attrs.match(/\bd=["']([^"']+)["']/i);
        if (!dMatch) continue;
        const id = idMatch ? idMatch[1] : `kvg:${hex}-s${rawPaths.length + 1}`;
        const order = idMatch ? parseInt(idMatch[2], 10) : rawPaths.length + 1;
        const typeMatch = attrs.match(/kvg:type=["']([^"']+)["']/i);
        rawPaths.push({
            order,
            id,
            d: dMatch[1],
            type: typeMatch ? typeMatch[1] : undefined,
        });
    }

    // Sort strictly by stroke index s1, s2, ..., sN
    rawPaths.sort((a, b) => a.order - b.order);

    const strokes: KanjiStrokePath[] = rawPaths.map((p, idx) => {
        const strokeIndex = idx + 1;
        const geom = parseSvgPathGeometry(p.d);
        const numPos = numberCoords.get(p.order) ?? numberCoords.get(strokeIndex) ?? {
            x: Math.max(6, Math.min(100, geom.startPoint.x - 4)),
            y: Math.max(10, Math.min(103, geom.startPoint.y - 2)),
        };
        return {
            index: strokeIndex,
            id: p.id,
            d: p.d,
            type: p.type,
            numberPos: numPos,
            startPoint: geom.startPoint,
            endPoint: geom.endPoint,
            points: geom.points,
            length: geom.length,
        };
    });

    return {
        kanji: firstChar,
        hex,
        viewBox,
        strokes,
        source,
    };
}

/**
 * Generate a deterministic fallback KanjiVG stroke set if offline and character is not in FALLBACK_KANJI_VG_XML.
 */
function buildProceduralFallbackStrokes(char: string): KanjiStrokeData {
    const firstChar = Array.from((char || '').trim())[0] || '日';
    const hex = kanjiToHex(firstChar);
    const xml = FALLBACK_KANJI_VG_XML[firstChar];
    if (xml) {
        return parseKanjiVgSvg(xml, firstChar, 'fallback');
    }

    const meta = LOCAL_KANJI_DB[firstChar];
    const count = Math.max(1, Math.min(16, meta?.strokes ?? 4));
    const templates = [
        'M22,26 C40,25 65,23 86,22',
        'M54,14 C54,36 54,64 54,92',
        'M26,52 C44,51 64,49 82,48',
        'M20,84 C42,83 68,81 88,80',
        'M34,26 C31,46 25,66 16,82',
        'M72,26 C76,46 82,66 90,82',
        'M32,38 C46,37 62,36 76,35',
        'M32,66 C46,65 62,64 76,63',
    ];
    const pathsXml = Array.from({ length: count }, (_, idx) => {
        const d = templates[idx % templates.length];
        return `<path id="kvg:${hex}-s${idx + 1}" d="${d}"/>`;
    }).join('\n');
    const numsXml = Array.from({ length: count }, (_, idx) => {
        const geom = parseSvgPathGeometry(templates[idx % templates.length]);
        return `<text transform="matrix(1 0 0 1 ${geom.startPoint.x - 4} ${geom.startPoint.y})">${idx + 1}</text>`;
    }).join('\n');

    return parseKanjiVgSvg(
        `<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109"><g>${pathsXml}</g><g>${numsXml}</g></svg>`,
        firstChar,
        'fallback'
    );
}

/**
 * Fetch and parse KanjiVG stroke order SVG for a character with memory + sessionStorage + IndexedDB caching.
 */
export async function fetchKanjiStrokes(
    char: string,
    options?: {
        fetchImpl?: typeof fetch;
        signal?: AbortSignal;
        bypassCache?: boolean;
    }
): Promise<KanjiStrokeData> {
    const firstChar = Array.from((char || '').trim())[0];
    if (!firstChar) {
        return buildProceduralFallbackStrokes('日');
    }
    const hex = kanjiToHex(firstChar);
    const cacheKey = `nihongo_kanjivg_${hex}`;

    if (!options?.bypassCache) {
        const mem = strokeMemoryCache.get(hex);
        if (mem) return { ...mem, source: 'cache' };

        const sess = sessionGet<KanjiStrokeData>(cacheKey);
        if (sess && Array.isArray(sess.strokes) && sess.strokes.length > 0) {
            strokeMemoryCache.set(hex, sess);
            return { ...sess, source: 'cache' };
        }

        const idb = await idbGet<KanjiStrokeData>(IDB_STROKE_STORE, hex);
        if (idb && Array.isArray(idb.strokes) && idb.strokes.length > 0) {
            strokeMemoryCache.set(hex, idb);
            sessionSet(cacheKey, idb);
            return { ...idb, source: 'cache' };
        }
    }

    const fetcher = options?.fetchImpl ?? (typeof fetch !== 'undefined' ? fetch : undefined);
    const url = getKanjiVgUrl(firstChar);

    if (fetcher) {
        try {
            const response = await fetcher(url, { signal: options?.signal });
            if (!response.ok) {
                throw new Error(`KanjiVG HTTP ${response.status}`);
            }
            const svgText = await response.text();
            const parsed = parseKanjiVgSvg(svgText, firstChar, 'kanjivg-cdn');
            if (parsed.strokes.length > 0) {
                strokeMemoryCache.set(hex, parsed);
                sessionSet(cacheKey, parsed);
                void idbSet(IDB_STROKE_STORE, hex, parsed);
                return parsed;
            }
        } catch (err) {
            if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError') {
                throw err;
            }
        }
    }

    const fallback = buildProceduralFallbackStrokes(firstChar);
    strokeMemoryCache.set(hex, fallback);
    return fallback;
}

/**
 * Extract startPoint, endPoint, and totalLength from a live SVGPathElement (via getPointAtLength)
 * or fallback to KanjiStrokePath geometry when running in non-DOM environments.
 */
export function getStrokeEndpoints(
    stroke: KanjiStrokePath,
    svgPathElement?: SVGPathElement | null
): {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    totalLength: number;
} {
    if (
        svgPathElement &&
        typeof svgPathElement.getTotalLength === 'function' &&
        typeof svgPathElement.getPointAtLength === 'function'
    ) {
        try {
            const totalLength = svgPathElement.getTotalLength();
            if (Number.isFinite(totalLength) && totalLength > 0) {
                const p0 = svgPathElement.getPointAtLength(0);
                const pEnd = svgPathElement.getPointAtLength(totalLength);
                return {
                    startPoint: { x: p0.x, y: p0.y },
                    endPoint: { x: pEnd.x, y: pEnd.y },
                    totalLength,
                };
            }
        } catch {
            // Fall through to pre-parsed geometry
        }
    }
    return {
        startPoint: stroke.startPoint,
        endPoint: stroke.endPoint,
        totalLength: stroke.length,
    };
}

/**
 * Step 3.2: Validate a user's drawn stroke against the target KanjiVG stroke path.
 * Uses startPoint, endPoint, length, and general direction vector with ~25 viewBox unit tolerance.
 */
export function validateTracingStroke(
    userPoints: { x: number; y: number }[],
    targetStroke: KanjiStrokePath,
    options?: {
        tolerance?: number;
        svgPathElement?: SVGPathElement | null;
    }
): StrokeValidationResult {
    const tolerance = options?.tolerance ?? DEFAULT_TRACING_TOLERANCE;
    if (!Array.isArray(userPoints) || userPoints.length < 2) {
        return {
            valid: false,
            reason: 'too_short',
            accuracy: 0,
            startDistance: Infinity,
            endDistance: Infinity,
            directionCosine: 0,
        };
    }

    const { startPoint: targetStart, endPoint: targetEnd, totalLength: targetLength } =
        getStrokeEndpoints(targetStroke, options?.svgPathElement);

    const userStart = userPoints[0];
    const userEnd = userPoints[userPoints.length - 1];

    let userLength = 0;
    for (let i = 1; i < userPoints.length; i++) {
        userLength += Math.hypot(
            userPoints[i].x - userPoints[i - 1].x,
            userPoints[i].y - userPoints[i - 1].y
        );
    }

    const minRequiredLength = Math.max(4, Math.min(12, targetLength * 0.25));
    if (userLength < minRequiredLength) {
        return {
            valid: false,
            reason: 'too_short',
            accuracy: 0,
            startDistance: Math.hypot(userStart.x - targetStart.x, userStart.y - targetStart.y),
            endDistance: Math.hypot(userEnd.x - targetEnd.x, userEnd.y - targetEnd.y),
            directionCosine: 0,
        };
    }

    const startDistance = Math.hypot(userStart.x - targetStart.x, userStart.y - targetStart.y);
    const endDistance = Math.hypot(userEnd.x - targetEnd.x, userEnd.y - targetEnd.y);

    const reverseStartDistance = Math.hypot(userStart.x - targetEnd.x, userStart.y - targetEnd.y);
    const reverseEndDistance = Math.hypot(userEnd.x - targetStart.x, userEnd.y - targetStart.y);

    const targetDx = targetEnd.x - targetStart.x;
    const targetDy = targetEnd.y - targetStart.y;
    const targetVecMag = Math.hypot(targetDx, targetDy);

    const userDx = userEnd.x - userStart.x;
    const userDy = userEnd.y - userStart.y;
    const userVecMag = Math.hypot(userDx, userDy);

    const directionCosine =
        targetVecMag > 1 && userVecMag > 1
            ? (targetDx * userDx + targetDy * userDy) / (targetVecMag * userVecMag)
            : 1;

    // Detect reverse stroke drawing
    if (
        directionCosine < -0.25 ||
        (reverseStartDistance <= tolerance &&
            reverseEndDistance <= tolerance &&
            reverseStartDistance + reverseEndDistance < startDistance + endDistance)
    ) {
        return {
            valid: false,
            reason: 'reverse_direction',
            accuracy: 0,
            startDistance,
            endDistance,
            directionCosine,
        };
    }

    const startOk = startDistance <= tolerance;
    const endOk = endDistance <= tolerance * 1.15;
    const directionOk = directionCosine >= 0.15 || targetVecMag < 8;

    if (startOk && endOk && directionOk) {
        const avgDist = (startDistance + endDistance) / 2;
        const distScore = Math.max(0, 1 - avgDist / (tolerance * 1.25));
        const dirScore = Math.max(0, (directionCosine + 1) / 2);
        const accuracy = Math.round(Math.min(100, Math.max(60, (distScore * 0.7 + dirScore * 0.3) * 100)));
        return {
            valid: true,
            reason: 'ok',
            accuracy,
            startDistance,
            endDistance,
            directionCosine,
        };
    }

    return {
        valid: false,
        reason: 'wrong_order_or_position',
        accuracy: 0,
        startDistance,
        endDistance,
        directionCosine,
    };
}

/**
 * Step 2.2: Fetch Kanji metadata from local N5-N4 database first and enrich/fallback via KanjiAPI.dev.
 */
export function getLocalKanjiMetadata(char: string): KanjiMetadata | null {
    const firstChar = Array.from((char || '').trim())[0];
    if (!firstChar) return null;
    const local = LOCAL_KANJI_DB[firstChar];
    if (!local) return null;

    return {
        kanji: firstChar,
        grade: local.grade,
        stroke_count: local.strokes,
        meanings: local.meanings,
        kun_readings: local.kun,
        on_readings: local.on,
        jlpt: local.jlpt,
        heisig_en: local.heisig ?? local.meanings[0] ?? null,
        hanViet: local.hanViet,
        meaningVi: local.meaningVi,
        jlptLabel: `N${local.jlpt}`,
        compounds: local.compounds,
        source: 'local',
    };
}

export async function fetchKanjiMetadata(
    char: string,
    options?: {
        fetchImpl?: typeof fetch;
        signal?: AbortSignal;
    }
): Promise<KanjiMetadata> {
    const firstChar = Array.from((char || '').trim())[0] || '日';
    const mem = metadataMemoryCache.get(firstChar);
    if (mem) return mem;

    const cacheKey = `nihongo_kanjiapi_${firstChar}`;
    const sess = sessionGet<KanjiMetadata>(cacheKey);
    if (sess && sess.kanji === firstChar) {
        metadataMemoryCache.set(firstChar, sess);
        return sess;
    }

    const idb = await idbGet<KanjiMetadata>(IDB_META_STORE, firstChar);
    if (idb && idb.kanji === firstChar) {
        metadataMemoryCache.set(firstChar, idb);
        sessionSet(cacheKey, idb);
        return idb;
    }

    const local = getLocalKanjiMetadata(firstChar);
    const fetcher = options?.fetchImpl ?? (typeof fetch !== 'undefined' ? fetch : undefined);

    if (fetcher) {
        try {
            const response = await fetcher(getKanjiApiUrl(firstChar), {
                signal: options?.signal,
            });
            if (response.ok) {
                const raw = (await response.json()) as Partial<KanjiApiResponse>;
                const jlptNum = typeof raw.jlpt === 'number' ? raw.jlpt : local?.jlpt ?? null;
                const merged: KanjiMetadata = {
                    kanji: firstChar,
                    grade: typeof raw.grade === 'number' ? raw.grade : local?.grade ?? null,
                    stroke_count:
                        typeof raw.stroke_count === 'number' && raw.stroke_count > 0
                            ? raw.stroke_count
                            : local?.stroke_count ?? 4,
                    meanings:
                        Array.isArray(raw.meanings) && raw.meanings.length > 0
                            ? raw.meanings
                            : local?.meanings ?? [],
                    kun_readings:
                        Array.isArray(raw.kun_readings) && raw.kun_readings.length > 0
                            ? raw.kun_readings
                            : local?.kun_readings ?? [],
                    on_readings:
                        Array.isArray(raw.on_readings) && raw.on_readings.length > 0
                            ? raw.on_readings
                            : local?.on_readings ?? [],
                    jlpt: jlptNum,
                    heisig_en: raw.heisig_en ?? local?.heisig_en ?? null,
                    hanViet: local?.hanViet ?? 'HÁN TỰ',
                    meaningVi:
                        local?.meaningVi ??
                        (Array.isArray(raw.meanings) && raw.meanings.length > 0
                            ? raw.meanings.slice(0, 3).join('; ')
                            : firstChar),
                    jlptLabel: jlptNum ? `N${jlptNum}` : local?.jlptLabel ?? 'JLPT',
                    compounds: local?.compounds ?? [],
                    source: local ? 'local+kanjiapi' : 'kanjiapi',
                };
                metadataMemoryCache.set(firstChar, merged);
                sessionSet(cacheKey, merged);
                void idbSet(IDB_META_STORE, firstChar, merged);
                return merged;
            }
        } catch (err) {
            if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError') {
                throw err;
            }
        }
    }

    if (local) {
        metadataMemoryCache.set(firstChar, local);
        return local;
    }

    // Fallback metadata from radical composition if KanjiAPI.dev is unreachable
    const constituentRadicals = getKanjiRadicals(firstChar);
    const estimatedStrokes =
        constituentRadicals.reduce((sum, r) => sum + r.strokes, 0) || 6;
    const fallbackMeta: KanjiMetadata = {
        kanji: firstChar,
        grade: null,
        stroke_count: estimatedStrokes,
        meanings: constituentRadicals.map(r => r.meaning),
        kun_readings: [],
        on_readings: [],
        jlpt: null,
        heisig_en: null,
        hanViet: constituentRadicals.map(r => r.nameVi.toUpperCase()).join(' · ') || 'HÁN TỰ',
        meaningVi: constituentRadicals.map(r => r.nameVi).join(' + ') || firstChar,
        jlptLabel: 'Kanji',
        compounds: [],
        source: 'local',
    };
    metadataMemoryCache.set(firstChar, fallbackMeta);
    return fallbackMeta;
}

/**
 * Step 2.3 & Step 3.3: Get constituent radicals for a single Kanji character.
 * Combines explicit KRADFILE radical order with `radicalsData.json` membership.
 */
export function getKanjiRadicals(char: string): RadicalEntry[] {
    const firstChar = Array.from((char || '').trim())[0];
    if (!firstChar) return [];

    const byRadicalSymbol = new Map<string, RadicalEntry>();
    for (const entry of RADICALS_DATA) {
        byRadicalSymbol.set(entry.radical, entry);
    }

    const result: RadicalEntry[] = [];
    const seen = new Set<string>();

    // 1. Add explicit KRADFILE sequence first if defined
    const explicit = EXPLICIT_KANJI_RADICALS[firstChar] ?? [];
    for (const radSymbol of explicit) {
        const entry = byRadicalSymbol.get(radSymbol);
        if (entry && !seen.has(entry.radical)) {
            seen.add(entry.radical);
            result.push(entry);
        }
    }

    // 2. Also include any radical in radicalsData.json whose kanjiList contains this Kanji
    for (const entry of RADICALS_DATA) {
        if (entry.kanjiList.includes(firstChar) && !seen.has(entry.radical)) {
            // Avoid redundant parent radical if positional variant is already present (e.g. 人 when 亻 is already listed for 休)
            if (entry.radical === '人' && seen.has('亻') && firstChar !== '人') continue;
            if (entry.radical === '水' && seen.has('氵') && firstChar !== '水') continue;
            if (entry.radical === '手' && seen.has('扌') && firstChar !== '手') continue;
            if (entry.radical === '心' && seen.has('忄') && firstChar !== '心') continue;
            if (entry.radical === '艸' && seen.has('艹') && firstChar !== '艸') continue;
            if (entry.radical === '辵' && seen.has('辶') && firstChar !== '辵') continue;
            if (entry.radical === '刀' && seen.has('刂') && firstChar !== '刀') continue;
            if (entry.radical === '火' && seen.has('灬') && firstChar !== '火') continue;
            if (entry.radical === '示' && seen.has('礻') && firstChar !== '示') continue;
            if (entry.radical === '衣' && seen.has('衤') && firstChar !== '衣') continue;
            if (entry.radical === '食' && seen.has('飠') && firstChar !== '食') continue;
            seen.add(entry.radical);
            result.push(entry);
        }
    }

    return result;
}

/**
 * Group all radicals in `radicalsData.json` by stroke count (1..17).
 */
export function getRadicalsByStrokeCount(): { strokes: number; radicals: RadicalEntry[] }[] {
    const groups = new Map<number, RadicalEntry[]>();
    for (const entry of RADICALS_DATA) {
        const list = groups.get(entry.strokes) ?? [];
        list.push(entry);
        groups.set(entry.strokes, list);
    }
    return Array.from(groups.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([strokes, radicals]) => ({ strokes, radicals }));
}

/**
 * Get summary info (stroke count, Hán Việt, meaning) for a Kanji character.
 */
export function getKanjiSummary(kanji: string): KanjiSummaryInfo {
    const local = LOCAL_KANJI_DB[kanji];
    if (local) {
        return {
            kanji,
            strokes: local.strokes,
            hanViet: local.hanViet,
            meaningVi: local.meaningVi,
            meaningEn: local.meanings[0] ?? '',
            jlpt: `N${local.jlpt}`,
        };
    }

    const cached = metadataMemoryCache.get(kanji);
    if (cached) {
        return {
            kanji,
            strokes: cached.stroke_count,
            hanViet: cached.hanViet,
            meaningVi: cached.meaningVi,
            meaningEn: cached.meanings[0] ?? '',
            jlpt: cached.jlptLabel,
        };
    }

    // Estimate stroke count from constituent radicals
    const rads = RADICALS_DATA.filter(r => r.kanjiList.includes(kanji));
    const estimatedStrokes =
        rads.length > 0
            ? Math.max(
                  ...rads.map(r => r.strokes),
                  Math.min(20, rads.reduce((acc, r) => acc + r.strokes, 0))
              )
            : 8;

    return {
        kanji,
        strokes: estimatedStrokes,
        hanViet: rads[0]?.nameVi.toUpperCase() ?? 'HÁN TỰ',
        meaningVi: rads.map(r => r.nameVi).slice(0, 2).join(' · ') || kanji,
        meaningEn: rads[0]?.meaning ?? '',
        jlpt: 'JLPT',
    };
}

/**
 * Build the reverse index of Kanji -> Set of radicals (including explicit decompositions)
 * and Radical -> Set of Kanji so multi-radical intersection is O(1) and bidirectional.
 */
const RADICAL_TO_KANJI_MAP: Map<string, Set<string>> = (() => {
    const map = new Map<string, Set<string>>();
    for (const entry of RADICALS_DATA) {
        map.set(entry.radical, new Set(entry.kanjiList));
    }
    for (const [kanji, rads] of Object.entries(EXPLICIT_KANJI_RADICALS)) {
        for (const rad of rads) {
            let set = map.get(rad);
            if (!set) {
                set = new Set<string>();
                map.set(rad, set);
            }
            set.add(kanji);
        }
    }
    return map;
})();

/**
 * Step 3.4: Multi-Radical Kanji Search
 * Computes the real-time intersection of `kanjiList` arrays for all selected radicals,
 * groups matching Kanji by total stroke count, and determines which remaining radicals
 * have a non-empty intersection (`compatibleRadicals`).
 */
export function searchKanjiByRadicals(selectedRadicals: string[]): MultiRadicalSearchResult {
    const cleanSelected = Array.from(
        new Set(selectedRadicals.map(r => r.trim()).filter(Boolean))
    );

    if (cleanSelected.length === 0) {
        return {
            selectedRadicals: [],
            matchedKanji: [],
            groupedByStrokes: [],
            compatibleRadicals: new Set(RADICALS_DATA.map(r => r.radical)),
        };
    }

    // Compute intersection across all selected radicals
    let intersection: Set<string> | null = null;
    for (const rad of cleanSelected) {
        const set = RADICAL_TO_KANJI_MAP.get(rad) ?? new Set<string>();
        if (intersection === null) {
            intersection = new Set(set);
        } else {
            const next = new Set<string>();
            for (const k of intersection) {
                if (set.has(k)) next.add(k);
            }
            intersection = next;
        }
    }

    const matchedKanji = Array.from(intersection ?? []);

    // Determine which radicals would still yield a non-empty intersection if selected
    const compatibleRadicals = new Set<string>();
    for (const entry of RADICALS_DATA) {
        if (cleanSelected.includes(entry.radical)) {
            compatibleRadicals.add(entry.radical);
            continue;
        }
        const radSet = RADICAL_TO_KANJI_MAP.get(entry.radical);
        if (!radSet) continue;
        for (const k of matchedKanji) {
            if (radSet.has(k)) {
                compatibleRadicals.add(entry.radical);
                break;
            }
        }
    }

    // Group matched Kanji by total stroke count
    const byStrokes = new Map<number, KanjiSummaryInfo[]>();
    for (const k of matchedKanji) {
        const summary = getKanjiSummary(k);
        const list = byStrokes.get(summary.strokes) ?? [];
        list.push(summary);
        byStrokes.set(summary.strokes, list);
    }

    const groupedByStrokes = Array.from(byStrokes.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([strokes, items]) => ({
            strokes,
            items,
        }));

    return {
        selectedRadicals: cleanSelected,
        matchedKanji,
        groupedByStrokes,
        compatibleRadicals,
    };
}
