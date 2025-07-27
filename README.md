# kotaete-website

無料のアンケート作成サイト「kotaete」の開発リポジトリです。
サイトURLは[https://kotaete.xyz](https://kotaete.xyz)です。
公式X (旧Twitter) アカウントは[https://x.com/kotaete_xyz](https://x.com/kotaete_xyz)です。

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
    git clone https://github.com/penpengusa2k/kotaete-website.git
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

### Google Apps Script (GAS) ライフサイクル管理

### `cleanUpOldSurveys()`
この関数は、定期的にAM4-5:00(GAS上で手動設定)に実行されるように設計されています。以下の処理を実行します。
- **バックアップ:** 削除を行う前に、指定された Google Drive フォルダにメインのスプレッドシートのバックアップコピーを作成します。
- **古いアンケートのクリーンアップ:** 期限が10日以上過ぎたアンケートエントリを `master` シートから削除します。
- **回答シートの削除:** `master` シートから削除されたアンケートに対応する回答シートを自動的に削除します。
- **エラー通知:** バックアッププロセスが失敗した場合、設定された `NOTIFICATION_EMAIL` にメール通知を送信し、データ損失を防ぐためにその場合は削除プロセスをスキップします。

## 制約事項と今後の展望

現在のKOTAETEは無料でご利用いただけますが、以下の制約があります。

### アンケート作成時の制約

*   **アンケートタイトル:** 50文字まで
*   **作成者名:** 50文字まで
*   **説明文:** 500文字まで
*   **質問文:** 500文字まで
*   **質問数:** 最大50個
*   **選択肢の数:** 1質問につき最大10個
*   **選択肢の値:** 500文字まで

### お問い合わせフォームの制約

*   **お名前:** 500文字まで
*   **メールアドレス:** 100文字まで
*   **お問い合わせ内容:** 500文字まで

### 今後の展望

将来的に、有料プランの導入を検討しています。有料プランでは、広告の非表示化や、上記の各種文字数・質問数の制約撤廃など、より高度な機能や柔軟な利用を提供していく予定です。

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
