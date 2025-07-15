import { sha256 } from 'js-sha256';

// 名前から一意のハッシュIDを生成
export function getPairId(name1: string, name2: string): string {
  const raw = `${name1.trim().toLowerCase()}-${name2.trim().toLowerCase()}`;
  return sha256(raw).slice(0, 12);
}

// スコアに応じてタイトルを返す仮関数（必要に応じて調整してください）
function getTitle(score: number, type: 'love' | 'friend' | 'work'): string {
  if (score < 20) return '地獄のような関係';
  if (score < 50) return '微妙な関係';
  if (score < 80) return '良好な関係';
  return '最高の関係';
}

interface RelationshipResult {
  title: string;
  compatibility: number;
}

interface DiagnosisResults {
  love: RelationshipResult;
  friendship: RelationshipResult;
  work: RelationshipResult;
}

// ハッシュIDから診断結果を決定論的に生成
export function generateResultFromId(id: string): DiagnosisResults {
  // ハッシュの文字列からシードを決定
  const seed = parseInt(id.slice(0, 6), 16); // ハッシュの最初の6文字を数値に変換

  // シードを元にスコアを決定
  const loveComp = (seed % 100);
  const friendshipComp = ((seed >> 2) % 100);
  const workComp = ((seed >> 4) % 100);

  return {
    love: { title: getTitle(loveComp, 'love'), compatibility: loveComp },
    friendship: { title: getTitle(friendshipComp, 'friend'), compatibility: friendshipComp },
    work: { title: getTitle(workComp, 'work'), compatibility: workComp },
  };
}
