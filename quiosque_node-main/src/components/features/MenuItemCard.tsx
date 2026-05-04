import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MenuItem } from '@/types';
import { ProductModal } from './ProductModal';

interface MenuItemCardProps {
  item: MenuItem;
  variant?: 'icon' | 'button';
}

export function MenuItemCard({ item, variant = 'icon' }: MenuItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card 
        className={"transition-all hover:shadow-md animate-fade-in flex flex-col h-full border-slate-200 relative group bg-white rounded-2xl ${variant === 'icon' ? 'overflow-visible' : 'overflow-hidden'}"}
      >
        <div className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer rounded-t-2xl" onClick={() => setIsModalOpen(true)}>
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
          />
        </div>
        <div className={"flex flex-col flex-1 px-3 py-4 cursor-pointer select-none ${variant === 'icon' ? 'pb-4' : 'pb-2'}"} onClick={() => setIsModalOpen(true)}>
          <h3 className="line-clamp-2 text-sm sm:text-base font-bold text-slate-800 leading-snug flex-1 mb-1">
            {item.name}
          </h3>
          <p className="text-base sm:text-lg font-black text-slate-900 mt-1">
            R$ {item.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
        
        {variant === 'icon' ? (
          <div className="absolute bottom-[-16px] right-2 z-10">
            <Button 
              onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} 
              className="h-12 w-12 px-0 bg-[#FFCC00] hover:bg-[#F2C200] text-slate-900 rounded-[14px] shadow-md transition-transform active:scale-95 flex items-center justify-center border-[3px] border-white"
            >
              <Plus className="h-6 w-6 relative left-[0.5px]" strokeWidth={3} />
            </Button>
          </div>
        ) : (
          <div className="px-3 pb-3 z-10">
             <Button
                className="w-full bg-[#FFCC00] hover:bg-[#F2C200] text-slate-900 font-bold transition-all h-10 shadow-sm"
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
             >
                Adicionar
             </Button>
          </div>
        )}
      </Card>

      <ProductModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

