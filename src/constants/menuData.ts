import { MenuCategory } from '@/types/menu';
import { hotItems } from './hotItems';
import { coldItems } from './coldItems';

export const categories: MenuCategory[] = [
  { id: 'hot-drinks',   name: 'المشروبات الساخنة', icon: '🍵', description: 'شاي وأعشاب ومشروبات دافئة' },
  { id: 'coffee',       name: 'القهوة',             icon: '☕', description: 'Coffee & More — قهوة مختارة بعناية' },
  { id: 'ice-coffee',   name: 'القهوة الباردة',     icon: '🧊', description: 'مشروبات قهوة باردة منعشة' },
  { id: 'milk-shake',   name: 'ميلك شيك',           icon: '🥛', description: 'ميلك شيك بنكهات متنوعة' },
  { id: 'fresh-juice',  name: 'العصائر الطازجة',    icon: '🍊', description: 'عصائر طبيعية طازجة يومية' },
  { id: 'mix-fresh',    name: 'ميكس فريش',          icon: '🍹', description: 'خلطات فريش مميزة ومُبتكَرة' },
  { id: 'smoothies',    name: 'سموزي',              icon: '🥤', description: 'سموزي بفواكه طبيعية صحية' },
  { id: 'yogurt',       name: 'مع الزبادي',         icon: '🫙', description: 'زبادي بنكهات متنوعة' },
  { id: 'ice-cream',    name: 'آيس كريم',           icon: '🍦', description: 'آيس كريم بنكهات مميزة' },
  { id: 'soft-drink',   name: 'سوفت درينك',         icon: '🥃', description: 'مشروبات غازية وطاقة' },
  { id: 'soda-flavors', name: 'صودا ونكهات',        icon: '✨', description: 'صودا بنكهات sky 7 الخاصة' },
  { id: 'desserts',     name: 'الحلويات',           icon: '🍰', description: 'كيك ووافلز وبان كيك وطواجن' },
  { id: 'fruit-salad',  name: 'سلطة الفواكه',       icon: '🍓', description: 'سلطات فواكه طازجة' },
  // { id: 'shisha',       name: 'الشيشة والمعسل',     icon: '💨', description: 'شيشة فاخرة ومعسل مميز' },
];

export const menuItems = [...hotItems, ...coldItems];
