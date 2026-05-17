export type Unit = 'ק"ג' | 'ארגז' | 'שק' | 'יחידה'
export interface VegetableItem {
  id: string
  name: string           // display name to show in the UI
  fullName?: string      // sent to the supply chain, can be the same as name
  unit: Unit
  icon: string           // emoji shown next to the item in the UI
  isGradeB?: boolean
}

export const vegetables: VegetableItem[] = [
  // the order of the items in this list is the order they will be shown in the UI
  { id: 'tomato',         name: 'עגבניה',        unit: 'ארגז',  icon: '🍅' },
  { id: 'cucumber',       name: 'מלפפון',        unit: 'ארגז',  icon: '🥒' },
  { id: 'pepper',         name: 'גמבה',          unit: 'ארגז',  icon: '🫑' },
  { id: 'carrot',         name: 'גזר',           unit: 'שק',    icon: '🥕' },
  { id: 'sweet_potato_b', name: 'בטטה',          unit: 'ארגז',  icon: '🍠', isGradeB: true },
  { id: 'pepper_b',       name: 'גמבה',          unit: 'ארגז',  icon: '🫑', isGradeB: true },
  { id: 'eggplant_b',     name: 'חציל',          unit: 'ארגז',  icon: '🍆', isGradeB: true },
  { id: 'mushroom_b',     name: 'פטריות',        unit: 'ארגז',  icon: '🍄', isGradeB: true },
  { id: 'zucchini_b',     name: 'קישוא',         unit: 'ארגז',  icon: '🥒', isGradeB: true },
  { id: 'hot_pepper',     name: 'פלפל חריף',     unit: 'ארגז',  icon: '🌶️' },
  { id: 'pumpkin',        name: 'דלעת',          unit: 'יחידה', icon: '🎃' },
  { id: 'delorit',        name: 'דלורית',        unit: 'יחידה', icon: '🎃' },
  { id: 'cabbage',        name: 'כרוב',          fullName: 'כרוב כשרות רגילה',      unit: 'ארגז',  icon: '🥬' },
  { id: 'potato',         name: 'תפו"א',         unit: 'שק',    icon: '🥔' },
  { id: 'potato_mini',    name: 'תפו"א מיני',    unit: 'שק',    icon: '🥔' },
  { id: 'white_onion',    name: 'בצל לבן',       unit: 'ארגז',  icon: '🧅' },
  { id: 'purple_onion',   name: 'בצל סגול',      unit: 'ארגז',  icon: '🧅' },
  { id: 'celery',         name: 'סלרי',          fullName: 'סלרי מהדרין',           unit: 'יחידה', icon: '🥬' },
  { id: 'apple',          name: 'תפוח עץ סמית',  unit: 'ארגז',  icon: '🍏' },
  { id: 'lettuce',        name: 'חסה ערבית',     fullName: 'חסה ערבית מהדרין',      unit: 'ארגז',  icon: '🥬' },
  { id: 'sprouts',        name: 'נבטים קטן',     unit: 'יחידה', icon: '🌱' },
  { id: 'beet_leaves',    name: 'סלק עלים',      fullName: 'סלק עלים מהדרין',       unit: 'יחידה', icon: '🌿' },
  { id: 'beet_vacuum',    name: 'סלק',           fullName: 'סלק וואקום',            unit: 'ארגז',  icon: '🥗' },
  { id: 'rocket',         name: 'רוקט',          fullName: 'רוקט כשרות רגילה',      unit: 'ק"ג',   icon: '🌿' },
  { id: 'cilantro',       name: 'כוסברה',        fullName: 'כוסברה כשרות רגילה',    unit: 'ק"ג',   icon: '🌿' },
  { id: 'parsley',        name: 'פטרוזיליה',     fullName: 'פטרוזיליה כשרות רגילה', unit: 'ק"ג',   icon: '🌿' },
  { id: 'basil',          name: 'בזיליקום',      fullName: 'בזיליקום כשרות רגילה',  unit: 'ק"ג',   icon: '🌿' },
  { id: 'green_onion',    name: 'בצל ירוק',      fullName: 'בצל ירוק מהדרין',       unit: 'יחידה', icon: '🌱' },
]
