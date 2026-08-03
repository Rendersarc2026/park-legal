'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationModal';
import AdminLoader from '@/components/AdminLoader';

const noScript = (value: string | undefined) => {
  if (!value) return true;
  return !/<script\b[^>]*>([\s\S]*?)<\/script>/gim.test(value);
};

const schema = yup.object({
  quote: yup.string()
    .min(10, 'Quote must be at least 10 characters')
    .test('no-script', 'Script tags are not allowed', noScript)
    .required('Quote is required'),
  stars: yup.number()
    .typeError('Stars must be a number')
    .min(1, 'Minimum 1 star')
    .max(5, 'Maximum 5 stars')
    .required('Stars are required'),
  author: yup.string()
    .test('no-script', 'Script tags are not allowed', noScript)
    .default(''),
}).required();

type FormData = yup.InferType<typeof schema>;

interface Testimonial {
  id: string;
  quote: string;
  stars: number;
  author: string | null;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      quote: '',
      stars: 5,
      author: ''
    }
  });

  const fetchTestimonials = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/testimonials?page=${page}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials);
        setTotalPages(data.totalPages);
        setCurrentPage(data.page);
      }
    } catch {
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTestimonials(currentPage);
  }, [currentPage, fetchTestimonials]);

  const handleOpenModal = (item?: Testimonial) => {
    if (item) {
      setEditingId(item.id);
      reset({
        quote: item.quote,
        stars: item.stars,
        author: item.author || ''
      });
    } else {
      setEditingId(null);
      reset({ quote: '', stars: 5, author: '' });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: editingId, ...data } : data;

    try {
      const res = await fetch('/api/admin/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingId ? 'Testimonial updated successfully' : 'Testimonial created successfully');
        setIsModalOpen(false);
        fetchTestimonials(currentPage);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to save testimonial');
      }
    } catch {
      toast.error('An error occurred while saving');
    }
  };

  const handleDelete = async (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemToDelete }),
      });

      if (res.ok) {
        toast.success('Testimonial deleted successfully');
        fetchTestimonials(currentPage);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to delete testimonial');
      }
    } catch {
      toast.error('An error occurred while deleting');
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-light text-[#333333]">Testimonials</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black transition-all shadow-md shadow-gray-200 w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)] min-h-[460px]">
        {loading ? (
          <AdminLoader message="Loading testimonials..." className="flex-grow" />
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 bg-gray-50">Quote</th>
                <th className="px-6 py-4 w-32 bg-gray-50">Author</th>
                <th className="px-6 py-4 w-32 bg-gray-50">Stars</th>
                <th className="px-6 py-4 text-right w-32 bg-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {testimonials.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 text-sm">
                    <p className="line-clamp-2">{item.quote}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{item.author || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex text-yellow-400">
                      {[...Array(item.stars)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No testimonials found.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!loading && testimonials.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
            <p className="text-sm text-gray-500">
              Page <span className="font-medium text-gray-900">{currentPage}</span> of{' '}
              <span className="font-medium text-gray-900">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto border border-gray-100">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-medium">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                <textarea
                  {...register('quote')}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${errors.quote ? 'border-red-500' : 'border-gray-200'}`}
                />
                {errors.quote && <p className="text-red-500 text-xs mt-1">{errors.quote.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author Name (Optional)</label>
                  <input
                    {...register('author')}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stars (1-5)</label>
                  <input
                    {...register('stars', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="5"
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${errors.stars ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.stars && <p className="text-red-500 text-xs mt-1">{errors.stars.message}</p>}
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-xl hover:bg-gray-50">Cancel</button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </div>
  );
}
