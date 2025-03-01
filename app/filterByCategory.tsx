'use client';
import { Advertisement, Category } from "./types/supabase";
import { Dispatch, SetStateAction, useState } from 'react';
import { supabase } from "./utils/supabase";


interface FilterByCategoryProps {
    categories: Category[];
    setAdvertisements: Dispatch<SetStateAction<Advertisement[]>>;
}

 export function FilterByCategory({ categories , setAdvertisements } : FilterByCategoryProps) {
    const [selectedCategory, setSelectedCategory] = useState('all');
  
    const handleCategoryChange = async (e: { target: { value: any; }; }) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
    
        let query = supabase
          .from('advertisements')
          .select('*')
          .eq('status', 'approved');
    
        if (categoryId !== 'all') {
          query = query.eq('category_id', categoryId);
        }
    
        const { data: filteredAds } = await query.order('created_at', { ascending: false });
        setAdvertisements(filteredAds || []);
      };
  
    return (
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="block w-full rounded-lg border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    );
  }