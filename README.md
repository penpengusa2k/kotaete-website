# kotaete-website

無料のアンケート作成サイト「kotaete」の開発リポジトリです。
サイトURLは[https://kotaete.xyz](https://kotaete.xyz)です。

## 概要

「kotaete」は、誰でも簡単にアンケートを作成、共有、回答できるウェブサービスです。作成されたアンケートにはユニークなURLが発行され、結果はリアルタイムで集計されます。

## 主な機能

*   **アンケート作成:** 直感的なインターフェースで簡単にアンケートを作成できます。
*   **回答:** 生成されたURLから誰でもアンケートに回答できます。
*   **結果表示:** 回答結果をグラフで視覚的に確認できます。
*   **OGP画像生成:** アンケートごとに動的なOGP画像が生成され、SNSでの共有時に目を引きます。

## 使用技術

*   **フロントエンド:** [Nuxt.js](https://nuxt.com/), [Tailwind CSS](https://tailwindcss.com/)
*   **バックエンド(OGP画像生成):** [Sharp](https://sharp.pixelplumbing.com/)
*   **バックエンド(データ連携):** [Google Apps Script](https://developers.google.com/apps-script)
*   **フォント:** [Kiwi Maru](https://fonts.google.com/specimen/Kiwi+Maru)

## 開発環境のセットアップ

1.  **リポジトリをクローン:**
    ```bash
    git clone https://github.com/your-username/kotaete-website.git
    cd kotaete-website/kotaete-web
    ```

2.  **依存関係をインストール:**
    ```bash
    npm install
    ```

3.  **開発サーバーを起動:**
    ```bash
    npm run dev
    ```
    `http://localhost:3000` で開発中のアプリケーションにアクセスできます。

## ビルドとデプロイ

アプリケーションを本番用にビルドするには、以下のコマンドを実行します。

```bash
npm run build
```

ビルドされたアプリケーションは `.output` ディレクトリに生成されます。詳細は[Nuxt.jsのデプロイメントドキュメント](https://nuxt.com/docs/getting-started/deployment)を参照してください。

## Google Apps Script (GAS)

このプロジェクトでは、Googleスプレッドシートを簡易的なデータベースとして利用するためにGoogle Apps Scriptを使用しています。GASのコードは `kotaete-web/gas/Code.gs` にあります。

GASをGoogle Cloudプロジェクトにデプロイし、APIとして実行可能にする必要があります。

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
