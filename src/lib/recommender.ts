import { MenuItem } from '@/types/menu';
import { UserAnswers, ItemMetadata, CoreMood } from '@/types/recommendation';
import { getItemMetadata } from '@/constants/menuMetadata';
import { menuItems } from '@/constants/menuData';

/* ── Scoring ───────────────────────────────────────────────────────────── */
function calcScore(item: MenuItem, meta: ItemMetadata, ans: UserAnswers): number {
  let s = 0;

  // Temperature: strong signal
  if (ans.temperature !== 'any') {
    s += meta.temperature === ans.temperature ? 3 : -2;
  }

  // Mood: strong signal
  if (ans.mood !== 'any') {
    s += meta.moods.includes(ans.mood as CoreMood) ? 3 : 0;
  }

  // Flavor family: strong signal with mild penalty for mismatch
  if (ans.flavorFamily !== 'any') {
    s += meta.flavorFamily === ans.flavorFamily ? 3 : -1;
  }

  // Sweetness: medium signal with strong penalty for opposite extremes
  if (ans.sweetness !== 'any') {
    if (meta.sweetness === ans.sweetness) {
      s += 2;
    } else if (
      (ans.sweetness === 'light' && meta.sweetness === 'high') ||
      (ans.sweetness === 'high'  && meta.sweetness === 'light')
    ) {
      s -= 2;
    }
    // medium vs light/high: no penalty (close enough)
  }

  // Badge bonus
  if (item.badge === "Chef's Choice") s += 1;
  else if (item.badge === 'Popular')  s += 0.5;

  return s;
}

/* ── Reason generator ─────────────────────────────────────────────────── */
function buildReason(item: MenuItem, meta: ItemMetadata, ans: UserAnswers): string {
  const parts: string[] = [];

  if (ans.temperature !== 'any') {
    parts.push(meta.temperature === 'hot' ? 'يناسب طلبك السخن' : 'منعش وبارد على طلبك');
  }

  const moodText: Record<string, string> = {
    energize: 'هيصحّيك ويعطيك طاقة',
    relax:    'هيريّحك ويخليك تروق',
    refresh:  'منعش ومُبرَّد لكمال يومك',
    sweet:    'بنكهة حلوة هتعشقها',
  };
  if (ans.mood !== 'any' && meta.moods.includes(ans.mood as CoreMood) && moodText[ans.mood]) {
    parts.push(moodText[ans.mood]);
  }

  const famText: Record<string, string> = {
    coffee: 'من أرقى تشكيلة القهوة',
    herbs:  'من أعشابنا الطبيعية المختارة',
    fruits: 'بنكهة الفواكه الطازجة',
    milk:   'كريمي ومُشبع',
  };
  if (ans.flavorFamily !== 'any' && meta.flavorFamily === ans.flavorFamily) {
    parts.push(famText[meta.flavorFamily]);
  }

  const sweetText: Record<string, string> = {
    light:  'بحلاوة خفيفة على ذوقك',
    medium: 'بحلاوة متوازنة ومثالية',
    high:   'بحلاوة عالية على طلبك',
  };
  if (ans.sweetness !== 'any' && meta.sweetness === ans.sweetness) {
    parts.push(sweetText[meta.sweetness]);
  }

  // Fallback: use badge info
  if (parts.length === 0) {
    if      (item.badge === "Chef's Choice") parts.push('من اختيارات الشيف المميزة');
    else if (item.badge === 'Popular')        parts.push('الأكثر طلباً عند عملاءنا');
    else                                      parts.push('اختيار مميز يناسب ذوقك');
  }

  return parts.slice(0, 2).join('، ') + ' ✨';
}

/* ── Public API ───────────────────────────────────────────────────────── */
export interface RecommendationResult {
  item: MenuItem;
  reason: string;
}

export function getRecommendation(
  answers: UserAnswers,
  excludeIds: string[] = [],
): RecommendationResult {
  let pool = menuItems.filter(i => !excludeIds.includes(i.id));
  if (pool.length === 0) pool = [...menuItems]; // reset if exhausted

  const scored = pool.map(item => {
    const meta = getItemMetadata(item.id, item.category);
    return { item, meta, score: calcScore(item, meta, answers) };
  });

  const max = Math.max(...scored.map(s => s.score));
  const top = scored.filter(s => s.score >= max - 0.5); // allow near-ties
  const chosen = top[Math.floor(Math.random() * top.length)];

  return {
    item:   chosen.item,
    reason: buildReason(chosen.item, chosen.meta, answers),
  };
}