export const templates = {
  snsFunnyPersonality: {
    id: 'snsFunnyPersonality',
    title: '【ぶっちゃけ教えて】私ってどんな人？',
    description: 'あなたが思う私の印象やキャラを匿名で教えてください！',
    questions: [
      { text: '私の第一印象は？', type: 'text', options: [] },
      { text: '正直、私の性格を一言でいうと？', type: 'text', options: [] },
      { text: '私を動物に例えると？', type: 'text', options: [] },
      { text: '一番似合うと思う職業は？', type: 'text', options: [] },
      { text: '私の口癖、何か思い出せる？', type: 'text', options: [] },
      { text: '私って友達に紹介したいタイプ？', type: 'radio', options: [
        { value: 'ぜひ紹介したい' }, { value: '場合によるかも' }, { value: 'ちょっと無理かも' }
      ] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  snsCrushCheck: {
    id: 'snsCrushCheck',
    title: '【匿名で回答】気になる人に聞いてみた！',
    description: 'ちょっとドキドキ…気になるあの人のホンネ、聞いてみませんか？',
    questions: [
      { text: '私って恋愛対象になりますか？', type: 'radio', options: [
        { value: 'なる' }, { value: 'ならない' }, { value: '迷う' }
      ] },
      { text: '付き合ったら楽しそう度', type: '5-point', options: [
        { value: '5: めっちゃ楽しそう' }, { value: '4: 楽しそう' }, { value: '3: 普通' }, { value: '2: 微妙' }, { value: '1: 不安かも' }
      ] },
      { text: '第一印象のスコア（100点満点中）', type: 'radio', options: [
        { value: '90〜100' }, { value: '70〜89' }, { value: '50〜69' }, { value: 'それ以下' }
      ] },
      { text: '正直、今の印象は？', type: 'text', options: [] },
      { text: 'どんなところが魅力的？', type: 'text', options: [] },
      { text: '逆にちょっと気になるところは？', type: 'text', options: [] }
    ],
    resultRestricted: true,
    anonymous: true
  },

  snsRatingMe: {
    id: 'snsRatingMe',
    title: '【匿名評価】私って何点？',
    description: '見た目？性格？人間力？あなたからの点数をこっそり知りたい！',
    questions: [
      { text: '私を一言で評価すると？', type: '5-point', options: [
        { value: '5: 最高' }, { value: '4: かなり良い' }, { value: '3: 普通' }, { value: '2: 微妙' }, { value: '1: 厳しい' }
      ] },
      { text: '見た目の評価', type: '5-point', options: [
        { value: '5: とても魅力的' }, { value: '4: 魅力的' }, { value: '3: 普通' }, { value: '2: 改善が必要' }, { value: '1: 評価不能' }
      ] },
      { text: '性格の評価', type: '5-point', options: [
        { value: '5: 完璧' }, { value: '4: とても良い' }, { value: '3: 普通' }, { value: '2: 少し気になる' }, { value: '1: 改善が必要' }
      ] },
      { text: '良いと思う点は？', type: 'text', options: [] },
      { text: '直した方がいい点があれば教えてください', type: 'text', options: [] },
      { text: '総合コメントお願いします！', type: 'text', options: [] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  snsSelfIntro: {
    id: 'snsSelfIntro',
    title: '【自己紹介リレー】あなたの〇〇を教えて！',
    description: 'あなたの好きなものや、最近ハマっていることを教えてください！',
    questions: [
      { text: '好きな食べ物は？', type: 'text', options: [] },
      { text: '最近ハマってることは？', type: 'text', options: [] },
      { text: '休日の過ごし方は？', type: 'text', options: [] },
      { text: '自分を一言で表すと？', type: 'text', options: [] },
      { text: '好きな音楽・アーティストは？', type: 'text', options: [] },
      { text: '今年の目標を教えてください！', type: 'text', options: [] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  snsWhoAmI: {
    id: 'snsWhoAmI',
    title: '【私ってどんな人？】本音で答えて！',
    description: '匿名だからこそ聞けるホンネ！私の印象教えて！',
    questions: [
      { text: '私を色で表すと？', type: 'text', options: [] },
      { text: '私に足りないものは？', type: 'text', options: [] },
      { text: '逆に、良いところも！', type: 'text', options: [] },
      { text: '私の特徴を一言で表すと？', type: 'text', options: [] },
      { text: '私ってどんな場面で輝いてると思う？', type: 'text', options: [] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  snsFriendshipTest: {
    id: 'snsFriendshipTest',
    title: '【友情度チェック】私たちどれくらい仲良し？',
    description: '友達って言える？あなたの本音を教えてください！',
    questions: [
      { text: '初対面の印象は？', type: 'text', options: [] },
      { text: '一緒にいて楽しいと感じる度', type: '5-point', options: [
        { value: '5: とても楽しい' }, { value: '4: 楽しい' }, { value: '3: 普通' }, { value: '2: 微妙' }, { value: '1: 少しつらい' }
      ] },
      { text: '連絡頻度はどのくらい？', type: 'radio', options: [
        { value: '毎日' }, { value: '週に1回' }, { value: '月1回以下' }
      ] },
      { text: '喧嘩したら仲直りできそう？', type: 'radio', options: [
        { value: 'すぐできそう' }, { value: '時間かかりそう' }, { value: '無理かも' }
      ] },
      { text: 'もっと仲良くなるには何が必要？', type: 'text', options: [] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  snsComplimentBox: {
    id: 'snsComplimentBox',
    title: '【褒めてボックス】あなたの良いところ教えて！',
    description: '匿名で褒め合おう！ちょっと嬉しい気分になれるかも？',
    questions: [
      { text: 'あなたが思う私の長所は？', type: 'text', options: [] },
      { text: '一緒にいて安心できるポイントは？', type: 'text', options: [] },
      { text: '「ありがとう」と言いたいことは？', type: 'text', options: [] },
      { text: '私の努力を感じた瞬間があれば教えて！', type: 'text', options: [] },
      { text: '最後に一言メッセージがあればどうぞ！', type: 'text', options: [] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  snsDareMe: {
    id: 'snsDareMe',
    title: '【やってみた募集】なにしてほしい？',
    description: '挑戦してみたいから、アイデア募集します！',
    questions: [
      { text: '私にやってほしいことは？', type: 'text', options: [] },
      { text: 'その理由や背景も教えて！', type: 'text', options: [] },
      { text: '誰と一緒にやったら面白そう？', type: 'text', options: [] },
      { text: 'SNSでバズりそうな要素ある？', type: 'text', options: [] },
      { text: '難易度レベルは？', type: '5-point', options: [
        { value: '5: 超簡単' }, { value: '4: 比較的簡単' }, { value: '3: 普通' }, { value: '2: 難しい' }, { value: '1: ガチでキツい' }
      ] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  bizCustomer: {
    id: 'bizCustomer',
    title: '【顧客満足度調査】サービス品質向上にご協力ください',
    description: '日頃のご利用ありがとうございます。今後の改善の参考にさせていただきます。',
    questions: [
      { text: '当社のサービス総合満足度', type: '5-point', options: [
        { value: '5: 非常に満足' }, { value: '4: 満足' }, { value: '3: 普通' }, { value: '2: やや不満' }, { value: '1: 非常に不満' }
      ] },
      { text: 'どの点に満足していますか？', type: 'text', options: [] },
      { text: '改善してほしい点はありますか？', type: 'text', options: [] },
      { text: 'スタッフの対応満足度', type: '5-point', options: [
        { value: '5: とても良い' }, { value: '4: 良い' }, { value: '3: 普通' }, { value: '2: 少し悪い' }, { value: '1: 悪い' }
      ] },
      { text: '今後どんなサービスを望みますか？', type: 'text', options: [] },
      { text: '他者へのおすすめ度', type: '5-point', options: [
        { value: '5: 強く勧めたい' }, { value: '4: 勧めたい' }, { value: '3: どちらでもない' }, { value: '2: 勧めない' }, { value: '1: 全く勧めない' }
      ] }
    ],
    resultRestricted: true,
    anonymous: false
  },

  bizEmployee: {
    id: 'bizEmployee',
    title: '【従業員意識調査】より良い職場環境のために',
    description: '従業員の声をもとに、職場改善を目指しています。',
    questions: [
      { text: '現在の仕事内容への満足度', type: '5-point', options: [
        { value: '5: 非常に満足' }, { value: '4: 満足' }, { value: '3: 普通' }, { value: '2: やや不満' }, { value: '1: 不満' }
      ] },
      { text: '上司・同僚との関係性', type: '5-point', options: [
        { value: '5: 非常に良好' }, { value: '4: 良好' }, { value: '3: 普通' }, { value: '2: 少し悪い' }, { value: '1: 悪い' }
      ] },
      { text: '働きやすさを10点満点で評価すると？', type: 'radio', options: [
        { value: '10' }, { value: '8〜9' }, { value: '6〜7' }, { value: '5以下' }
      ] },
      { text: '福利厚生に対するご意見があればお聞かせください。', type: 'text', options: [] },
      { text: '改善してほしい点は？', type: 'text', options: [] },
      { text: '自由にご意見・ご提案をお願いします。', type: 'text', options: [] }
    ],
    resultRestricted: true,
    anonymous: false
  },

  bizEventFeedback: {
    id: 'bizEventFeedback',
    title: '【イベント参加者アンケート】ご意見ください',
    description: '本イベントにご参加いただきありがとうございました。今後の運営の参考とさせていただきます。',
    questions: [
      { text: 'イベントの総合満足度', type: '5-point', options: [
        { value: '5: 大変満足' }, { value: '4: 満足' }, { value: '3: 普通' }, { value: '2: やや不満' }, { value: '1: 不満' }
      ] },
      { text: '最も印象に残ったプログラムは何ですか？', type: 'text', options: [] },
      { text: 'スタッフの対応はいかがでしたか？', type: '5-point', options: [
        { value: '5: とても良かった' }, { value: '4: 良かった' }, { value: '3: 普通' }, { value: '2: 少し悪かった' }, { value: '1: 悪かった' }
      ] },
      { text: '会場やオンライン配信の環境について感想を教えてください。', type: 'text', options: [] },
      { text: '今後どのようなテーマで開催してほしいですか？', type: 'text', options: [] },
      { text: 'その他、自由なご意見があればご記入ください。', type: 'text', options: [] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  bizServiceImprovement: {
    id: 'bizServiceImprovement',
    title: '【改善提案募集】もっと良くするには？',
    description: 'サービスや社内制度をより良くするためのご意見を募集しています。',
    questions: [
      { text: '現在困っていることがあれば教えてください。', type: 'text', options: [] },
      { text: 'サービスや業務フローの改善案を自由にご記入ください。', type: 'text', options: [] },
      { text: '提案する改善案の効果やメリットは何ですか？', type: 'text', options: [] },
      { text: 'すぐに実行できそうな工夫があれば教えてください。', type: 'text', options: [] },
      { text: '改善にあたり障害となることがあればご記入ください。', type: 'text', options: [] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  bizInternalComms: {
    id: 'bizInternalComms',
    title: '【社内コミュニケーション調査】風通しはどう？',
    description: 'チームワークや人間関係に関する実態を把握し、改善につなげるための調査です。',
    questions: [
      { text: '部署内の情報共有の満足度', type: '5-point', options: [
        { value: '5: とてもできている' }, { value: '4: ある程度できている' }, { value: '3: 普通' }, { value: '2: あまりできていない' }, { value: '1: 全くできていない' }
      ] },
      { text: '部署外との連携に問題を感じますか？', type: 'radio', options: [
        { value: '問題なし' }, { value: '少しある' }, { value: 'かなりある' }
      ] },
      { text: '対面 or オンライン、どちらが話しやすいですか？', type: 'radio', options: [
        { value: '対面' }, { value: 'オンライン' }, { value: 'どちらでも変わらない' }
      ] },
      { text: 'コミュニケーションの悩みがあれば教えてください。', type: 'text', options: [] },
      { text: '改善のために会社にできそうな取り組みは？', type: 'text', options: [] }
    ],
    resultRestricted: true,
    anonymous: true
  },

  funAnimeRanking: {
    id: 'funAnimeRanking',
    title: '【アニメ好き集合】推し作品TOP3',
    description: 'アニメ好き同士、推し作品や好みを語ろう！',
    questions: [
      { text: '1番好きなアニメ作品は？', type: 'text', options: [] },
      { text: '2番目に好きなアニメは？', type: 'text', options: [] },
      { text: '3番目に好きなアニメは？', type: 'text', options: [] },
      { text: '好きなキャラクターは？', type: 'text', options: [] },
      { text: '好きなジャンル（複数選択可）', type: 'checkbox', options: [
        { value: '日常' }, { value: 'バトル' }, { value: '恋愛' }, { value: 'SF' }, { value: 'ギャグ' }
      ] },
      { text: 'おすすめしたい隠れた名作は？', type: 'text', options: [] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  funLunchVote: {
    id: 'funLunchVote',
    title: '【今日のお昼どうする？】みんなの意見集め！',
    description: 'ランチ候補を投票形式で決めよう！',
    questions: [
      { text: '今日のランチ候補を選んでください', type: 'checkbox', options: [
        { value: 'ラーメン' }, { value: 'カレー' }, { value: 'パスタ' }, { value: '定食' }, { value: 'コンビニ飯' }
      ] },
      { text: 'ランチに求めるポイントは？', type: 'checkbox', options: [
        { value: '安さ' }, { value: '栄養バランス' }, { value: 'スピード' }, { value: '美味しさ' }
      ] },
      { text: 'おすすめのランチ店があれば教えてください', type: 'text', options: [] },
      { text: '一緒に食べたい人がいますか？（任意）', type: 'text', options: [] },
      { text: '午後に備えて軽めがいいですか？', type: 'radio', options: [
        { value: '軽め希望' }, { value: 'がっつり派' }, { value: 'どちらでもOK' }
      ] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  funTravelSurvey: {
    id: 'funTravelSurvey',
    title: '【旅行アンケート】行きたい場所は？',
    description: '次の旅行はどこへ？みんなの好みを教えて！',
    questions: [
      { text: '国内or海外どちらに行きたい？', type: 'radio', options: [
        { value: '国内' }, { value: '海外' }, { value: 'どちらでも' }
      ] },
      { text: '行ってみたい具体的な場所は？', type: 'text', options: [] },
      { text: '旅行の目的は？', type: 'checkbox', options: [
        { value: '観光' }, { value: 'グルメ' }, { value: '温泉' }, { value: 'アクティビティ' }, { value: '買い物' }
      ] },
      { text: '誰と行きたいですか？', type: 'radio', options: [
        { value: '友達' }, { value: '恋人' }, { value: '家族' }, { value: 'ひとり旅' }
      ] },
      { text: '旅行にかけたい予算は？', type: 'radio', options: [
        { value: '〜1万円' }, { value: '1〜3万円' }, { value: '3〜5万円' }, { value: '5万円以上' }
      ] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  funPetSurvey: {
    id: 'funPetSurvey',
    title: '【ペット好きアンケート】あなたの推しペットは？',
    description: '動物好きなら答えてね！飼ってる人も飼ってない人も歓迎！',
    questions: [
      { text: '現在飼っているペットは？', type: 'checkbox', options: [
        { value: '犬' }, { value: '猫' }, { value: '鳥' }, { value: '爬虫類' }, { value: 'その他' }
      ] },
      { text: 'その子の名前（またはあだ名）', type: 'text', options: [] },
      { text: 'ペットにどんな性格がありますか？', type: 'text', options: [] },
      { text: 'いつ頃から飼っていますか？', type: 'text', options: [] },
      { text: '動物に癒される瞬間はどんなとき？', type: 'text', options: [] },
      { text: '飼っていない人：飼ってみたい動物は？', type: 'text', options: [] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  funGamePrefs: {
    id: 'funGamePrefs',
    title: '【ゲーム診断】あなたのゲームタイプは？',
    description: 'ゲーマーの皆さんの好みや傾向を大調査！',
    questions: [
      { text: '好きなジャンル（複数選択可）', type: 'checkbox', options: [
        { value: 'RPG' }, { value: 'FPS/TPS' }, { value: 'シミュレーション' }, { value: 'パズル' }, { value: 'アドベンチャー' }
      ] },
      { text: '最近ハマったゲームタイトルは？', type: 'text', options: [] },
      { text: 'あなたのゲーム熱度は？', type: '5-point', options: [
        { value: '5: 毎日プレイ' }, { value: '4: 週に数回' }, { value: '3: たまに' }, { value: '2: ほとんどしない' }, { value: '1: 全くしない' }
      ] },
      { text: 'どのプラットフォームで遊びますか？', type: 'checkbox', options: [
        { value: 'PC' }, { value: 'PS5/PS4' }, { value: 'Switch' }, { value: 'スマホ' }, { value: 'その他' }
      ] },
      { text: 'ゲームで得意なこと or 苦手なことがあれば教えてください', type: 'text', options: [] },
      { text: '理想のゲームとは？', type: 'text', options: [] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  funMusicVibes: {
    id: 'funMusicVibes',
    title: '【音楽の好み】あなたのプレイリスト見せて！',
    description: '気分を上げる曲から、一人で聴く曲まで、あなたの音楽の好みを知りたい！',
    questions: [
      { text: '最近よく聴くアーティストは？', type: 'text', options: [] },
      { text: 'よく聴く音楽ジャンルは？', type: 'checkbox', options: [
        { value: 'J-POP' }, { value: 'K-POP' }, { value: '洋楽' }, { value: 'ロック' }, { value: 'クラシック' }
      ] },
      { text: '好きな曲の雰囲気を5段階で表すと？', type: '5-point', options: [
        { value: '5: アップテンポで元気が出る' }, { value: '4: リラックスできるミディアムテンポ' }, { value: '3: 普通' }, { value: '2: しっとりしたバラード' }, { value: '1: 激しいロック・メタル' }
      ] },
      { text: 'カラオケの十八番は？', type: 'text', options: [] },
      { text: 'おすすめのプレイリストがあれば教えて！', type: 'text', options: [] }
    ],
    resultRestricted: false,
    anonymous: true
  },

  bizProjectReview: {
    id: 'bizProjectReview',
    title: '【プロジェクト振り返り】次への改善点を探る',
    description: '今回のプロジェクトについて、みんなで率直に振り返りましょう。',
    questions: [
      { text: '今回のプロジェクトの成功度', type: '5-point', options: [
        { value: '5: 大成功' }, { value: '4: 成功' }, { value: '3: どちらとも言えない' }, { value: '2: やや失敗' }, { value: '1: 失敗' }
      ] },
      { text: 'プロジェクトの目標は明確でしたか？', type: '5-point', options: [
        { value: '5: とても明確だった' }, { value: '4: 明確だった' }, { value: '3: 普通' }, { value: '2: あまり明確ではなかった' }, { value: '1: 全く明確ではなかった' }
      ] },
      { text: 'チームワークは良好でしたか？', type: '5-point', options: [
        { value: '5: 非常に良好' }, { value: '4: 良好' }, { value: '3: 普通' }, { value: '2: 少し問題があった' }, { value: '1: かなり問題があった' }
      ] },
      { text: 'よかった点・うまくいった点を教えてください。', type: 'text', options: [] },
      { text: '改善すべき点・反省点を教えてください。', type: 'text', options: [] }
    ],
    resultRestricted: true,
    anonymous: false
  }
};

const handleTemplateSelect = async (event) => {
  const selectedValue = event.target.value;
  if (!selectedValue) {
    return;
  }
  const template = JSON.parse(selectedValue);
  await setTemplate(template);
};