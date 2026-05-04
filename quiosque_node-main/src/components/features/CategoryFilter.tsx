import { useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '@/constants/menu';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (selectedRef.current && containerRef.current && !isDragging) {
      const container = containerRef.current;
      const button = selectedRef.current;
      const scrollLeftPos = button.offsetLeft - (container.clientWidth / 2) + (button.clientWidth / 2);
      
      container.scrollTo({
        left: scrollLeftPos,
        behavior: 'smooth'
      });
    }
  }, [selectedCategory]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (containerRef.current) {
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={containerRef} 
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      className={"flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-1 px-1 " + (isDragging ? 'cursor-grabbing' : 'cursor-grab')}
      style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
    >
      <Button
        ref={selectedCategory === 'Todos' ? selectedRef : null}
        type="button"
        variant={selectedCategory === 'Todos' ? 'default' : 'outline'}
        onClick={() => onSelectCategory('Todos')}
        className={`whitespace-nowrap rounded-full font-bold transition-all ${selectedCategory === 'Todos' ? 'bg-[#FFCC00] text-slate-900 border-[#FFCC00] hover:bg-[#F2C200]' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'}`}
      >
        Todos
      </Button>
      {CATEGORIES.map((category) => (
        <Button
          key={category}
          ref={selectedCategory === category ? selectedRef : null}
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
