import { MenuItem } from '@/types/menu';
import { SMO, YOG, ICM, SDK, SOD, DST, FRT, SSH } from './imagePool';

export const coldItems: MenuItem[] = [
  // ── سموزي ────────────────────────────────────────────────────────────────
  { id: 'sm-1',  name: 'سموزي ليمون',            description: 'سموزي ليمون منعش طبيعي',                  price: 50,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 03.35.54.jpeg'},
  { id: 'sm-2',  name: 'سموزي ليمون نعناع',      description: 'سموزي ليمون ونعناع بارد ومنعش',           price: 60,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 03.36.45.jpeg' },
  { id: 'sm-3',  name: 'سموزي مانجو',            description: 'سموزي مانجو استوائي حلو ومنعش',           price: 60,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 03.40.25.jpeg' },
  { id: 'sm-4',  name: 'سموزي فراوله',           description: 'سموزي فراولة وردي لا يُقاوَم',            price: 60,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 03.41.18.jpeg', badge: 'Popular' },
  { id: 'sm-5',  name: 'سموزي جوافه',            description: 'سموزي جوافة استوائي بنكهة أصيلة',          price: 60,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 03.42.57.jpeg' },
  { id: 'sm-6',  name: 'سموزي بطيخ',            description: 'سموزي بطيخ منعش بلون أحمر جميل',          price: 65,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 03.48.08.jpeg' },
  { id: 'sm-7',  name: 'سموزي بطيخ نعناع',      description: 'بطيخ ونعناع في سموزي صيفي مثالي',         price: 70,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 03.52.15.jpeg' },
  { id: 'sm-8',  name: 'سموزي بلو بيري',         description: 'سموزي توت أزرق غني بالأنتيوكسيدان',       price: 70,  currency: 'ج.م', category: 'smoothies', image:'/images/smoothi/WhatsApp Image 2026-07-29 at 03.52.15.jpeg' },
  { id: 'sm-9',  name: 'سموزي ميكس بيري',        description: 'خليط التوت المتنوع في سموزي صحي',          price: 70,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 03.54.04.jpeg' },
  { id: 'sm-10', name: 'سموزي باشن فروت',        description: 'سموزي باشن فروت استوائي فريد',             price: 70,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 03.54.50.jpeg' },
  { id: 'sm-11', name: 'سموزي خوخ',              description: 'سموزي خوخ طازج بنكهة حلوة',               price: 70,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 03.58.14.jpeg' },
  { id: 'sm-12', name: 'سموزي اناناس',           description: 'سموزي اناناس استوائي منعش',               price: 70,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 03.59.34.jpeg' },
  { id: 'sm-13', name: 'سموزي كيوي',             description: 'سموزي كيوي أخضر بنكهة استوائية',          price: 85,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 04.01.03.jpeg' },
  { id: 'sm-14', name: 'سموزي ميكس سكاي',        description: 'سموزي sky 7 المميز — خلطة سرية فاخرة',    price: 90,  currency: 'ج.م', category: 'smoothies', image: '/images/smoothi/WhatsApp Image 2026-07-29 at 04.02.05.jpeg', badge: "Chef's Choice" },

  // ── مع الزبادي ───────────────────────────────────────────────────────────
  { id: 'yg-1',  name: 'زبادي خلاط',             description: 'زبادي طازج محلوط بنعومة كريمية',          price: 45,  currency: 'ج.م', category: 'yogurt', image: '/images/yougurt/WhatsApp Image 2026-07-29 at 04.07.00.jpeg' },
  { id: 'yg-2',  name: 'زبادي عسل',              description: 'زبادي كريمي مع عسل نحل طبيعي',            price: 50,  currency: 'ج.م', category: 'yogurt', image: '/images/yougurt/WhatsApp Image 2026-07-29 at 04.08.15.jpeg', badge: 'Popular' },
  { id: 'yg-3',  name: 'زبادي فلافور',           description: 'زبادي بنكهات متنوعة مميزة',                price: 60,  currency: 'ج.م', category: 'yogurt', image: '/images/yougurt/WhatsApp Image 2026-07-29 at 04.12.29.jpeg' },
  { id: 'yg-4',  name: 'زبادي فواكه',            description: 'زبادي كريمي مع فواكه طازجة',              price: 85,  currency: 'ج.م', category: 'yogurt', image: '/images/yougurt/WhatsApp Image 2026-07-30 at 00.25.04.jpeg' },

  // ── آيس كريم ─────────────────────────────────────────────────────────────
  { id: 'ic2-1', name: 'آيس كريم صغير (2 بوله)',  description: 'كرتان آيس كريم بنكهات اختيارية',         price: 35,  currency: 'ج.م', category: 'ice-cream', image: ICM[0] },
  { id: 'ic2-2', name: 'آيس كريم وسط (3 بوله)',   description: 'ثلاث كرات آيس كريم بنكهات طازجة',        price: 50,  currency: 'ج.م', category: 'ice-cream', image: ICM[1], badge: 'Popular' },
  { id: 'ic2-3', name: 'آيس كريم كبير (4 بوله)',  description: 'أربع كرات آيس كريم بنكهات متنوعة',       price: 60,  currency: 'ج.م', category: 'ice-cream', image: ICM[0] },
  { id: 'ic2-4', name: 'آيس كريم أوريو قطع',      description: 'آيس كريم مع قطع أوريو وصوص شوكولاتة',   price: 65,  currency: 'ج.م', category: 'ice-cream', image: ICM[2] },
  { id: 'ic2-5', name: 'آيس كريم لوتس قطع',       description: 'آيس كريم مع قطع لوتس كراميلية فاخرة',   price: 65,  currency: 'ج.م', category: 'ice-cream', image: ICM[2] },
  { id: 'ic2-6', name: 'آيس كريم فروت',           description: 'آيس كريم مع فواكه طازجة وصوص الفانيليا', price: 75,  currency: 'ج.م', category: 'ice-cream', image: ICM[1] },

  // ── سوفت درينك ───────────────────────────────────────────────────────────
  { id: 'sd-1',  name: 'مياه معدنيه صغيره',      description: 'مياه معدنية طبيعية مُبرَّدة',              price: 10,  currency: 'ج.م', category: 'soft-drink', image: SDK[0] },
  { id: 'sd-2',  name: 'صودا كانز',              description: 'مشروبات غازية معروفة في علب',              price: 30,  currency: 'ج.م', category: 'soft-drink', image: SDK[0] },
  { id: 'sd-3',  name: 'فيروز',                  description: 'فيروز مُنكَّهة فاخرة بنكهات منعشة',        price: 40,  currency: 'ج.م', category: 'soft-drink', image: SDK[0] },
  { id: 'sd-4',  name: 'بيريل شعير',             description: 'بيريل شعير باردة ومنعشة',                 price: 40,  currency: 'ج.م', category: 'soft-drink', image: SDK[0] },
  { id: 'sd-5',  name: 'ريد بل',                 description: 'مشروب طاقة Red Bull لتجديد النشاط',       price: 75,  currency: 'ج.م', category: 'soft-drink', image: SDK[1] },
  { id: 'sd-6',  name: 'مونستر إنرجي',           description: 'Monster Energy مشروب طاقة قوي',           price: 60,  currency: 'ج.م', category: 'soft-drink', image: SDK[1] },

  // ── صودا ونكهات ───────────────────────────────────────────────────────────
  { id: 'sf-1',  name: 'صن شاين',                description: 'صودا بنكهة الشمس الاستوائية الجذابة',     price: 50,  currency: 'ج.م', category: 'soda-flavors', image: SOD[0] },
  { id: 'sf-2',  name: 'صن رايز',                description: 'صودا بنكهة الشروق الاستوائي المشرق',      price: 55,  currency: 'ج.م', category: 'soda-flavors', image: SOD[0] },
  { id: 'sf-3',  name: 'ستار منت',               description: 'صودا نعناع نجمية باردة ومنعشة',           price: 50,  currency: 'ج.م', category: 'soda-flavors', image: SOD[1] },
  { id: 'sf-4',  name: 'موهيتو فلافور',          description: 'موهيتو بنكهة مع نعناع وليمون طازج',       price: 60,  currency: 'ج.م', category: 'soda-flavors', image: SOD[1], badge: 'Popular' },
  { id: 'sf-5',  name: 'سكاي بلو',               description: 'صودا sky 7 الزرقاء الخاصة',               price: 60,  currency: 'ج.م', category: 'soda-flavors', image: SOD[0], badge: 'New' },
  { id: 'sf-6',  name: 'باشن فروت',              description: 'صودا باشن فروت استوائية حيوية',           price: 55,  currency: 'ج.م', category: 'soda-flavors', image: SOD[1] },
  { id: 'sf-7',  name: 'في كيوي',                description: 'صودا كيوي خضراء بنكهة منعشة',             price: 50,  currency: 'ج.م', category: 'soda-flavors', image: SOD[2] },
  { id: 'sf-8',  name: 'موهيتو رد بل',           description: 'موهيتو مع ريد بل لطاقة مضاعفة',           price: 90,  currency: 'ج.م', category: 'soda-flavors', image: SOD[0], badge: "Chef's Choice" },
  { id: 'sf-9',  name: 'همر هد',                 description: 'مشروب همر هيد بنكهة قوية مُركَّبة',       price: 100, currency: 'ج.م', category: 'soda-flavors', image: SOD[1] },
  { id: 'sf-10', name: 'شيري كولا',              description: 'كولا بنكهة الكرز في تجربة راقية',          price: 60,  currency: 'ج.م', category: 'soda-flavors', image: SOD[2] },

  // ── الحلويات ──────────────────────────────────────────────────────────────
  { id: 'ds-1',  name: 'تشيز كيك كلاسيك',        description: 'تشيز كيك نيويورك بالجبن الكريمي',          price: 70,  currency: 'ج.م', category: 'desserts', image: DST[0] },
  { id: 'ds-2',  name: 'تشيز كيك فلافور',        description: 'تشيز كيك بنكهة خاصة مميزة',               price: 80,  currency: 'ج.م', category: 'desserts', image: DST[0] },
  { id: 'ds-3',  name: 'تشيز كيك نوتيلا',        description: 'تشيز كيك مع نوتيلا الكريمية',             price: 85,  currency: 'ج.م', category: 'desserts', image: DST[0], badge: 'Popular' },
  { id: 'ds-4',  name: 'تشيز كيك لوتس',          description: 'تشيز كيك مع صوص لوتس الكراميلي',          price: 85,  currency: 'ج.م', category: 'desserts', image: DST[0] },
  { id: 'ds-5',  name: 'تشيز كيك بستاشيو',       description: 'تشيز كيك مع فستق حلبي فاخر',              price: 90,  currency: 'ج.م', category: 'desserts', image: DST[0] },
  { id: 'ds-6',  name: 'مولتن كيك كلاسيك',       description: 'كيك شوكولاتة ذائبة بمركز ساخن',           price: 85,  currency: 'ج.م', category: 'desserts', image: DST[4] },
  { id: 'ds-7',  name: 'مولتن كيك نوتيلا ايس',   description: 'مولتن كيك مع نوتيلا وآيس كريم فانيليا',  price: 100, currency: 'ج.م', category: 'desserts', image: DST[4], badge: "Chef's Choice" },
  { id: 'ds-8',  name: 'ديسباسيتو',              description: 'حلوى ديسباسيتو بكريمة الكاسترد',          price: 90,  currency: 'ج.م', category: 'desserts', image: DST[3] },
  { id: 'ds-9',  name: 'وافل نوتيلا',            description: 'وافل بلجيكي مع نوتيلا وكريمة شنطة',       price: 85,  currency: 'ج.م', category: 'desserts', image: DST[1] },
  { id: 'ds-10', name: 'وافل شوكلت',             description: 'وافل مُقرمَش مع شوكولاتة داكنة',           price: 85,  currency: 'ج.م', category: 'desserts', image: DST[1] },
  { id: 'ds-11', name: 'وافل كراميل',            description: 'وافل ذهبي مع كراميل محضّر يدوياً',        price: 85,  currency: 'ج.م', category: 'desserts', image: DST[1], badge: 'Popular' },
  { id: 'ds-12', name: 'وافل بستاشيو',           description: 'وافل مع فستق حلبي فاخر ومميز',            price: 100, currency: 'ج.م', category: 'desserts', image: DST[1] },
  { id: 'ds-13', name: 'وافل ميكس صوص',          description: 'وافل مع خليط من الصوصات الفاخرة',          price: 110, currency: 'ج.م', category: 'desserts', image: DST[1] },
  { id: 'ds-14', name: 'وافل سكاي مود',          description: 'وافل sky 7 الخاص — التجربة الكاملة',       price: 130, currency: 'ج.م', category: 'desserts', image: DST[1], badge: 'New' },
  { id: 'ds-15', name: 'بان كيك 10 قطع',         description: 'عشر قطع بان كيك صغيرة طرية لذيذة',        price: 35,  currency: 'ج.م', category: 'desserts', image: DST[2] },
  { id: 'ds-16', name: 'بان كيك 20 قطعه',        description: 'عشرون قطعة بان كيك مع توبينجز متنوعة',    price: 60,  currency: 'ج.م', category: 'desserts', image: DST[2], badge: 'Popular' },
  { id: 'ds-17', name: 'بان كيك 30 قطعه',        description: 'ثلاثون قطعة للحفلات والعائلات',            price: 80,  currency: 'ج.م', category: 'desserts', image: DST[2] },
  { id: 'ds-18', name: 'طاجن نوتيلا',            description: 'طاجن نوتيلا ساخن كريمي لا يُقاوَم',       price: 85,  currency: 'ج.م', category: 'desserts', image: DST[4] },
  { id: 'ds-19', name: 'طاجن هرمون السعادة',      description: 'طاجن بالشوكولاتة والكريمة والفواكه',       price: 100, currency: 'ج.م', category: 'desserts', image: DST[3], badge: "Chef's Choice" },
  { id: 'ds-20', name: 'طاجن سكاي مود',          description: 'طاجن sky 7 الأسطوري — فخامة في كل لقمة',  price: 130, currency: 'ج.م', category: 'desserts', image: DST[4], badge: 'New' },

  // ── سلطة الفواكه ─────────────────────────────────────────────────────────
  { id: 'fs-1',  name: 'فروت سلاط صغير',         description: 'سلطة فواكه طازجة صغيرة موسمية',           price: 75,  currency: 'ج.م', category: 'fruit-salad', image: FRT[0] },
  { id: 'fs-2',  name: 'فروت سلاط وسط',          description: 'سلطة فواكه وسط متنوعة وغنية',             price: 90,  currency: 'ج.م', category: 'fruit-salad', image: FRT[1], badge: 'Popular' },
  { id: 'fs-3',  name: 'فروت سلاط كبير',         description: 'سلطة فواكه كبيرة للمجموعات',              price: 110, currency: 'ج.م', category: 'fruit-salad', image: FRT[0] },
  { id: 'fs-4',  name: 'سلطة فواكه سبيشال',      description: 'سلطة مميزة مع كريمة وعسل وبذور',          price: 150, currency: 'ج.م', category: 'fruit-salad', image: FRT[1], badge: "Chef's Choice" },
  { id: 'fs-5',  name: 'طبق فاكهه',              description: 'طبق فاكهة فاخر مُصمَّم بإبداع',            price: 200, currency: 'ج.م', category: 'fruit-salad', image: FRT[0] },

  // ── الشيشة والمعسل ────────────────────────────────────────────────────────
  // { id: 'sh-1',  name: 'شيشة سبيشل',             description: 'شيشة فاخرة بمعسل سبيشل أجود الأنواع',     price: 110, currency: 'ج.م', category: 'shisha', image: SSH[0] },
  // { id: 'sh-2',  name: 'شيشة فواكه فاخره',       description: 'شيشة بمعسل فواكه استوائية فاخرة',         price: 85,  currency: 'ج.م', category: 'shisha', image: SSH[0], badge: 'Popular' },
  // { id: 'sh-3',  name: 'شيشة معسل',              description: 'معسل سادة عالي الجودة',                    price: 15,  currency: 'ج.م', category: 'shisha', image: SSH[1] },
];
