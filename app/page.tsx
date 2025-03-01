'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FilterByCategory } from './filterByCategory';
import { Advertisement, Category } from './types/supabase';
import { supabase } from './utils/supabase';

export default function Home() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Add mounted state to handle client-side rendering
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [adsResponse, categoriesResponse] = await Promise.all([
          supabase
            .from('advertisements')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false }),
          supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true })
        ]);

        setAdvertisements(adsResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Only render content after component is mounted on client
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div 
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>

          <div className="mx-auto max-w-7xl">
            <div className="text-center py-12 sm:py-20">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Discover Amazing Advertisements
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Browse through our collection of curated advertisements from various creators
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/auth/login"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </Link>
                <Link href="/auth/signup" className="text-sm font-semibold leading-6 text-gray-900">
                  Create an account <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Featured Advertisements with Category Filter */}
            <div className="py-12">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Featured Advertisements</h2>
                <div className="mt-4 md:mt-0">
                  <FilterByCategory
                    categories={categories}
                    setAdvertisements={setAdvertisements}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {advertisements.length > 0 ? (
                    advertisements.map((ad) => (
                      <div 
                        key={ad.id} 
                        className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105"
                      >
                        {ad.image_url && (
                          <div className="relative h-48">
                            <img
                              src={ad.image_url}
                              alt={ad.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{ad.title}</h3>
                          <p className="text-gray-600">{ad.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 text-lg">No approved advertisements available yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}