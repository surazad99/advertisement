'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/utils/supabase';
import { Advertisement } from '@/app/types/supabase';

export default function AdminDashboard() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAdmin();
    fetchAdvertisements();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      router.push('/dashboard');
    }
  };

  const fetchAdvertisements = async () => {
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setAdvertisements(data || []);
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('advertisements')
      .update({ status })
      .eq('id', id);

    if (error) {
      setError(error.message);
      return;
    }

    fetchAdvertisements();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">All Advertisements</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {advertisements.map((ad) => (
              <div key={ad.id} className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{ad.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      ad.status === 'approved' ? 'bg-green-100 text-green-800' :
                      ad.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ad.status}
                    </span>
                    {ad.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(ad.id, 'approved')}
                          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(ad.id, 'rejected')}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
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
          </div>
        </div>
      </main>
    </div>
  );
}