import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { CategoryFilter } from '@/components/features/CategoryFilter';
import { MenuItemCard } from '@/components/features/MenuItemCard';
import { CartDrawer } from '@/components/features/CartDrawer';
import { MENU_ITEMS } from '@/constants/menu';

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = selectedCategory
    ? MENU_ITEMS.filter((item) => item.category === selectedCategory)
    : MENU_ITEMS;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gradient">Nosso Cardápio</h1>
          <p className="text-muted-foreground">
            Escolha seus pratos favoritos e faça seu pedido
          </p>
        </div>

        <div className="mb-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </main>

      <CartDrawer />
    </div>
  );
}
