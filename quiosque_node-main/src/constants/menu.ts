import { MenuItem } from '@/types';

export const MENU_ITEMS: MenuItem[] = [
  // Entradas
  {
    id: '1',
    name: 'Bruschetta Italiana',
    description: 'PÃ£o italiano tostado com tomate fresco, manjericÃ£o e azeite',
    price: 18.90,
    category: 'Entradas e Porções',
    image: 'https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    name: 'Carpaccio de Carne',
    description: 'Finas fatias de filÃ© mignon com rÃºcula, parmesÃ£o e alcaparras',
    price: 32.90,
    category: 'Entradas e Porções',
    image: 'https://images.pexels.com/photos/1639556/pexels-photo-1639556.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    name: 'CamarÃ£o ao Alho',
    description: 'CamarÃµes salteados no alho e ervas finas',
    price: 42.90,
    category: 'Entradas e Porções',
    image: 'https://images.pexels.com/photos/8697539/pexels-photo-8697539.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  
  // Pratos Principais
  {
    id: '4',
    name: 'FilÃ© Ã  Parmegiana',
    description: 'FilÃ© mignon empanado com molho de tomate e queijo derretido',
    price: 58.90,
    category: 'Pratos Principais',
    image: 'https://images.pexels.com/photos/628776/pexels-photo-628776.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '5',
    name: 'SalmÃ£o Grelhado',
    description: 'SalmÃ£o grelhado com legumes e molho de maracujÃ¡',
    price: 65.90,
    category: 'Pratos Principais',
    image: 'https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '6',
    name: 'Porção de Pastelzinhos',
      description: 'Porção com 10 minipastéis sortidos (carne, queijo e palmito)',
      price: 36.90,
      category: 'Entradas e Porções',
      image: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Brazilian_pastel.jpg',
  },
  {
    id: '7',
    name: 'Picanha na Brasa',
    description: 'Picanha grelhada acompanhada de arroz, feijÃ£o e farofa',
    price: 72.90,
    category: 'Pratos Principais',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Picanha3.jpg',
  },
  
  // Bebidas
  {
    id: '8',
    name: 'Suco Natural',
    description: 'Laranja, limÃ£o, abacaxi ou morango',
    price: 12.90,
    category: 'Bebidas',
    image: 'https://images.pexels.com/photos/158053/fresh-orange-juice-squeezed-refreshing-citrus-158053.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '9',
    name: 'Refrigerante',
    description: 'Coca-Cola, GuaranÃ¡ ou Sprite - 350ml',
    price: 8.90,
    category: 'Bebidas',
    image: 'https://images.pexels.com/photos/1200348/pexels-photo-1200348.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '10',
    name: 'Vinho Tinto',
    description: 'TaÃ§a de vinho tinto selecionado',
    price: 28.90,
    category: 'Bebidas',
    image: 'https://images.pexels.com/photos/2912162/pexels-photo-2912162.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  
  // Sobremesas
  {
    id: '11',
    name: 'Petit Gateau',
    description: 'Bolinho de chocolate com sorvete de creme',
    price: 24.90,
    category: 'Sobremesas',
    image: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '12',
    name: 'TiramisÃ¹',
    description: 'Sobremesa italiana com cafÃ© e mascarpone',
    price: 22.90,
    category: 'Sobremesas',
    image: 'https://images.pexels.com/photos/9500030/pexels-photo-9500030.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '13',
    name: 'Cheesecake de Frutas Vermelhas',
    description: 'Torta cremosa com calda de frutas vermelhas',
    price: 26.90,
    category: 'Sobremesas',
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400',
  }  ,
  // Destilados e Drinks
  {
    id: '14',
    name: 'Whisky 12 Anos',
    description: 'Dose de whisky escocês 12 anos envelhecido no carvalho',
    price: 34.90,
    category: 'Destilados & Drinks',
    image: 'https://images.pexels.com/photos/1170588/pexels-photo-1170588.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '15',
    name: 'Gin Tônica Classic',
      description: 'Gin importado, tônica, rodela de limão siciliano e alecrim',
      price: 29.90,
      category: 'Destilados & Drinks',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Gin_and_Tonic_with_ingredients.jpg/600px-Gin_and_Tonic_with_ingredients.jpg',
  },
  {
    id: '16',
    name: 'Caipirinha Premium',
    description: 'Vodka importada, limão tahiti, açúcar e bastante gelo',
    price: 24.90,
    category: 'Destilados & Drinks',
    image: 'https://images.pexels.com/photos/159265/caipirinha-cocktail-drink-brazilian-159265.jpeg?auto=compress&cs=tinysrgb&w=400',
  }
];

export const CATEGORIES = ['Entradas e Porções', 'Pratos Principais', 'Bebidas', 'Destilados & Drinks', 'Sobremesas'];


