import { CATEGORIES } from '@/constants/menu';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-1 px-1">
      <Button
        type="button"
        variant={selectedCategory === null ? 'default' : 'outline'}
        onClick={() => onSelectCategory(null)}
        className={`whitespace-nowrap rounded-full font-bold transition-all ${selectedCategory === null ? 'bg-[#FFCC00] text-slate-900 border-[#FFCC00] hover:bg-[#F2C200]' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'}`}
      >
        Todos
      </Button>
      {CATEGORIES.map((category) => (
        <Button
          key={category}
          type="button"
          variant={selectedCategory === category ? 'default' : 'outline'}
          onClick={() => onSelectCategory(category)}
          className={`whitespace-nowrap rounded-full font-bold transition-all ${selectedCategory === category ? 'bg-[#FFCC00] text-slate-900 border-[#FFCC00] hover:bg-[#F2C200]' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'}`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
