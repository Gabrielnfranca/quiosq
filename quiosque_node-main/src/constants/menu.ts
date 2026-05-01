import { MenuItem } from '@/types';

export const MENU_ITEMS: MenuItem[] = [
  // Entradas
  {
    id: '1',
    name: 'Bruschetta Italiana',
    description: 'Pão italiano tostado com tomate fresco, manjericão e azeite',
    price: 18.90,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Carpaccio de Carne',
    description: 'Finas fatias de filé mignon com rúcula, parmesão e alcaparras',
    price: 32.90,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1626074353765-517a65eeef7a?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Camarão ao Alho',
    description: 'Camarões salteados no alho e ervas finas',
    price: 42.90,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
  },
  
  // Pratos Principais
  {
    id: '4',
    name: 'Filé à Parmegiana',
    description: 'Filé mignon empanado com molho de tomate e queijo derretido',
    price: 58.90,
    category: 'Pratos Principais',
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    name: 'Salmão Grelhado',
    description: 'Salmão grelhado com legumes e molho de maracujá',
    price: 65.90,
    category: 'Pratos Principais',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    name: 'Risoto de Funghi',
    description: 'Risoto cremoso com mix de cogumelos frescos',
    price: 52.90,
    category: 'Pratos Principais',
    image: 'https://images.unsplash.com/photo-1476124369491-f117ca4b11d1?w=400&h=300&fit=crop',
  },
  {
    id: '7',
    name: 'Picanha na Brasa',
    description: 'Picanha grelhada acompanhada de arroz, feijão e farofa',
    price: 72.90,
    category: 'Pratos Principais',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop',
  },
  
  // Bebidas
  {
    id: '8',
    name: 'Suco Natural',
    description: 'Laranja, limão, abacaxi ou morango',
    price: 12.90,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
  },
  {
    id: '9',
    name: 'Refrigerante',
    description: 'Coca-Cola, Guaraná ou Sprite - 350ml',
    price: 8.90,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
  },
  {
    id: '10',
    name: 'Vinho Tinto',
    description: 'Taça de vinho tinto selecionado',
    price: 28.90,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
  },
  
  // Sobremesas
  {
    id: '11',
    name: 'Petit Gateau',
    description: 'Bolinho de chocolate com sorvete de creme',
    price: 24.90,
    category: 'Sobremesas',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop',
  },
  {
    id: '12',
    name: 'Tiramisù',
    description: 'Sobremesa italiana com café e mascarpone',
    price: 22.90,
    category: 'Sobremesas',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
  },
  {
    id: '13',
    name: 'Cheesecake de Frutas Vermelhas',
    description: 'Torta cremosa com calda de frutas vermelhas',
    price: 26.90,
    category: 'Sobremesas',
    image: 'https://images.unsplash.com/photo-1533134242916-247a7c97b53f?w=400&h=300&fit=crop',
  },
];

export const CATEGORIES = ['Entradas', 'Pratos Principais', 'Bebidas', 'Sobremesas'];
