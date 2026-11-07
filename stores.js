/* 高山エリア スタッフページの店舗設定
 * ここを直せば index.html / routine.html の両方に反映される。
 * - id は英小文字とハイフン。URL の #s=<id> と、鍵ファイル ~/.claude/secrets/takayama-<id>-portal-key.txt、data/<id>.enc.json に使う
 * - closed は定休日（0=日 … 6=土）
 * - chat は参考のため（11/4 の方針で画面には出さない）
 * - routine の項目は紙のチェック表をもらって差し替える（routineDraft:true のあいだは画面に「仮」と出る）
 * - url が空の行は「未登録」と表示される
 */
window.TAKAYAMA = (function () {
  var WS = 'https://yoom.fun/1c56849d-d033-44c9-948a-66875f9729cb/forms/shared/';
  var KT = 'https://creative-r.cybozu.com/k/';
  var SITE = 'https://takayama.creative-r.com';
  var COCKPIT = 'https://claude.ai/code/artifact/cca90ac8-902f-4178-80dc-7b10fd86f6f4';

  // 飲食店の共通ルーティン（仮）。店ごとの確定版が来たら各店の routine に入れる
  var R_SHOP = [
    { id: 'hall_open', area: 'ホール', when: '営業開始時', items: ['店内清掃・テーブル拭き', '椅子・座席の整列', '看板・のれんを出す', 'レジ立上げ・釣銭確認', 'ドリンク・氷の補充', 'トイレ清掃（ペーパー補充）', 'BGM・照明ON'] },
    { id: 'hall_close', area: 'ホール', when: '営業終了時（閉店）', items: ['テーブル・カウンター清掃', 'レジ締め', '看板・のれんをしまう', 'トイレ清掃', 'ゴミ出し', '戸締まり・消灯'] },
    { id: 'kitchen_open', area: 'キッチン', when: '営業開始時', items: ['仕込み・在庫の確認', '冷蔵庫の温度確認', '食材の賞味期限確認', '調理器具の準備', 'ガス・火元の確認'] },
    { id: 'kitchen_close', area: 'キッチン', when: '営業終了時（閉店）', items: ['食材の片付け・冷蔵', '調理器具・まな板の洗浄', 'キッチン全体の清掃', 'ガス・火元の確認', '冷蔵庫の確認'] }
  ];
  var R_TARC = [
    { id: 'front_open', area: '受付', when: '営業開始時', items: ['店頭看板を出す', '自転車を店頭に並べる', 'レジ立上げ・釣銭確認', '今日の予約（Bokun）を確認', 'ヘルメット・鍵の数を確認'] },
    { id: 'front_close', area: '受付', when: '営業終了時（閉店）', items: ['返却を確認（未返却があれば連絡）', '自転車を店内へ', 'レジ締め', '明日の予約を確認', '戸締まり・消灯'] },
    { id: 'bike_open', area: '車両', when: '営業開始時', items: ['タイヤの空気圧', 'ブレーキ・ライトの確認', '電動アシストのバッテリー残量'] },
    { id: 'bike_close', area: '車両', when: '営業終了時（閉店）', items: ['バッテリーを充電', '故障・不具合を記録', '車体の汚れを拭く'] }
  ];

  // 全店共通の一覧（店ごとに追加したいものは各店の lists に書く）
  function commonLists(s) {
    return {
      staffList: [
        ['form', '仕事用Gmailの登録', '新しいアルバイトに作ってもらう', 'https://forms.gle/JDGEsr77scuLezns6', 'copy']
      ],
      toolList: [
        ['check', 'LIMON BUS クーポンの確認', 'バス乗客のクーポンをPINで使用済みにする', s.limon ? SITE + '/limon' : '']
      ],
      docList: [
        ['book', '店のページ（高山エリアサイト）', 'お客様に見せる・営業時間の確認', s.site || '']
      ]
    };
  }
  function tiles(s) {
    return [
      { cls: 'main wide', ic: 'check', t: 'ルーティンチェック', s: '開店・閉店のチェック。送るとチャットに通知', go: 'routine.html', self: true },
      { c: 'sky', ic: 'form', t: '営業日報（kintone）', s: '閉店後に入力（ログインが要ります）', go: s.kintone.daily ? KT + s.kintone.daily + '/edit' : '' },
      { c: 'mint', ic: 'chart', t: 'デイリーコックピット', s: '全店の前日の売上', go: COCKPIT }
    ];
  }

  var STORES = {
    'visai-ekimae': {
      name: '美菜ラーメン 高山駅前店', en: 'VISAI RAMEN · Ekimae', short: '駅前',
      hours: '12:00〜17:00（L.O.16:00）', closed: [3],
      kintone: { daily: 83, monthly: 84 }, kutikomi: { store_id: '1741324' },
      site: SITE + '/visai', limon: true,
      chat: { staff: 'AAQAjmmmZQ8', sales: 'AAQAMby_czw', review: 'AAQALGL0Jpk' },
      routine: R_SHOP, routineDraft: true
    },
    'visai-kokubunji': {
      name: '美菜ラーメン 高山国分寺店', en: 'VISAI RAMEN · Kokubunji', short: '国分寺',
      hours: '17:00〜22:00（L.O.21:30）', closed: [3],
      kintone: { daily: 92, monthly: 93 }, kutikomi: { store_id: '' },
      site: SITE + '/visai', limon: true,
      chat: { sales: 'AAQAMby_czw', review: 'AAQAVQP8Tss' },
      routine: R_SHOP, routineDraft: true
    },
    'hidashi': {
      name: '炭火焼肉 炉端居酒屋 ひだし', en: 'HIDASHI', short: 'ひだし',
      hours: '17:00〜24:00', closed: [3],
      kintone: { daily: 69, monthly: 70 }, kutikomi: { store_id: '1693222' },
      site: SITE + '/hidashi', limon: true,
      chat: { staff: 'AAQAr7nG1JQ', sales: 'AAQA_oH4s8Q' },
      routine: R_SHOP, routineDraft: true
    },
    'utsuke': {
      name: '高山お好み焼き UTSUKE', en: 'UTSUKE', short: 'うつけ',
      hours: '17:00〜24:00', closed: [3],
      kintone: { daily: 66, monthly: 67 }, kutikomi: { store_id: '' },
      site: SITE + '/utsuke', limon: true,
      chat: { staff: 'AAQAlswQRNU', sales: 'AAQAdVcnc2w', review: 'AAQAFDoZwR8' },
      routine: R_SHOP, routineDraft: true
    },
    'tarc': {
      name: 'TARC レンタサイクル（高山駅前）', en: 'TARC Rental Cycle', short: 'TARC',
      hours: '9:00〜18:00', closed: [3],
      kintone: { daily: 77, monthly: 78 }, kutikomi: { store_id: '' },
      site: SITE + '/cycle', limon: true,
      chat: { sales: 'AAQAm9GPFEk', review: 'AAQA-9LSKOQ', booking: 'AAQAjGeAAPc' },
      routine: R_TARC, routineDraft: true,
      lists: { toolList: [['clock', 'Bokun（予約管理）', 'レンタル・ツアーの予約を見る', '']] }
    },
    'bettei-takayama': {
      name: 'いだ天別邸 高山でこなる店', en: 'IDATEN BETTEI · Takayama', short: '別邸',
      hours: '17:00〜22:30（L.O.21:30）', closed: [3, 4],
      kintone: { daily: 95, monthly: 96 }, kutikomi: { store_id: '' },
      site: SITE + '/idaten-bettei', limon: false,
      chat: { staff: 'AAQA0k89L6g', sales: 'AAQAia7nNyw', review: 'AAQAp5PaeH0' },
      routine: R_SHOP, routineDraft: true
    }
  };
  // 共通部分を合成
  Object.keys(STORES).forEach(function (id) {
    var s = STORES[id]; s.id = id;
    s.tiles = (s.tiles || []).concat(tiles(s));
    var c = commonLists(s), extra = s.lists || {};
    s.lists = {};
    Object.keys(c).forEach(function (k) { s.lists[k] = c[k].concat(extra[k] || []); });
  });
  return { area: 'Takayama', areaJa: '高山', order: ['visai-ekimae', 'visai-kokubunji', 'hidashi', 'utsuke', 'tarc', 'bettei-takayama'], stores: STORES, cockpit: COCKPIT };
})();
