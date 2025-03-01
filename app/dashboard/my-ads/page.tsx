'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/utils/supabase';
import { Advertisement } from '@/app/types/supabase';

export default function MyAdvertisements() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchAdvertisements();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth/login');
    }
  };

  const fetchAdvertisements = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setAdvertisements(data || []);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Advertisements</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {advertisements.map((ad) => (
            <div key={ad.id} className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{ad.title}</h3>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  ad.status === 'approved' ? 'bg-green-100 text-green-800' :
                  ad.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {ad.status}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{ad.description}</p>
              {ad.image_url && (
                <img
                  src={ad.image_url}
                  alt={ad.title}
                  className="mt-4 rounded-lg max-h-48 object-cover"
                />
              )}
            </div>
          ))}
          {advertisements.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              You haven't created any advertisements yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}