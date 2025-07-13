
export interface AppInfo {
  slug: string;
  name: string;
  description: string;
  icon: string;
  version: string;
  url: string;
  thumbnail: string;
  component?: string;
}

export const apps: AppInfo[] = [
  {
    slug: 'app-1',
    name: 'AI恋愛診断',
    description: '気になるあの人との相性を占ってみよう！簡単な質問に答えるだけで、2人の未来がわかるかも？💕',
    icon: '/icons/app-1.svg',
    version: '1.0.0',
    url: '#',
    thumbnail: 'https://placehold.jp/800x400.png?text=ドキドキ相性診断',
    component: 'App-1',
  },
  {
    slug: 'app-2',
    name: '便利なツール2',
    description: '日常のちょっとした面倒を解決する、便利なツールです。',
    icon: '/icons/app-2.svg',
    version: '1.0.0',
    url: '#',
    thumbnail: 'https://placehold.jp/800x400.png?text=App2',
    component: 'App-2',
  },
  {
    slug: 'relationship-checker',
    name: 'なんちゃって関係診断',
    description: 'AIも心理学も使わない！二人の名前から関係性を診断する、バズりやすい診断アプリです。',
    icon: '/icons/app-relationship-checker.svg', // 仮のアイコンパス
    version: '1.0.0',
    url: '/apps/relationship-checker',
    thumbnail: 'https://placehold.jp/800x400.png?text=なんちゃって関係診断',
    component: 'DefaultAppDetail',
  },
];
