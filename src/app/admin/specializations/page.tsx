'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
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
  icon: yup.string().default(''),
  label: yup.string().test('no-script', 'Script tags are not allowed', noScript).required('Label is required'),
  description: yup.string().test('no-script', 'Script tags are not allowed', noScript).required('Description is required'),
  details: yup.string().test('no-script', 'Script tags are not allowed', noScript).required('Details are required'),
}).required();

type FormData = yup.InferType<typeof schema>;

interface Specialization {
  id: string;
  icon: string;
  label: string;
  description: string;
  details: string[];
}

export default function AdminSpecializations() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      icon: '',
      label: '',
      description: '',
      details: ''
    }
  });

  const fetchSpecializations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/specializations`);
      if (res.ok) {
        const data = await res.json();
        setSpecializations(data.specializations || []);
      }
    } catch {
      toast.error('Failed to fetch specializations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpecializations();
  }, [fetchSpecializations]);

  const handleOpenModal = (item?: Specialization) => {
    if (item) {
      setEditingId(item.id);
      reset({
        icon: item.icon,
        label: item.label,
        description: item.description,
        details: item.details.join('\n\n')
      });
    } else {
      setEditingId(null);
      reset({ icon: '', label: '', description: '', details: '' });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    const method = editingId ? 'PUT' : 'POST';
    
    // Convert details string to array
    const detailsArray = data.details
      .split(/\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const body = {
      ...(editingId && { id: editingId }),
      icon: data.icon,
      label: data.label,
      description: data.description,
      details: detailsArray
    };

    try {
      const res = await fetch('/api/admin/specializations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingId ? 'Specialization updated successfully' : 'Specialization created successfully');
        setIsModalOpen(false);
        fetchSpecializations();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to save specialization');
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
      const res = await fetch('/api/admin/specializations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemToDelete }),
      });

      if (res.ok) {
        toast.success('Specialization deleted successfully');
        fetchSpecializations();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to delete specialization');
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
        <h1 className="text-3xl font-light text-[#333333]">Specializations</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black transition-all shadow-md shadow-gray-200 w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Add Specialization
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)] min-h-[460px]">
        {loading ? (
          <AdminLoader message="Loading specializations..." className="flex-grow" />
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 w-64 bg-gray-50">Label</th>
                  <th className="px-6 py-4 bg-gray-50">Description</th>
                  <th className="px-6 py-4 text-right w-32 bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {specializations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900">{item.label}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      <p className="line-clamp-2">{item.description}</p>
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
                {specializations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No specializations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-medium">{editingId ? 'Edit Specialization' : 'New Specialization'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    {...register('label')}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${errors.label ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Short summary)</label>
                <textarea
                  {...register('description')}
                  rows={2}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details (Full paragraphs, separate with blank lines)</label>
                <textarea
                  {...register('details')}
                  rows={8}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${errors.details ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Enter detailed paragraphs here. Leave a blank line between each paragraph."
                />
                {errors.details && <p className="text-red-500 text-xs mt-1">{errors.details.message}</p>}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
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
        title="Delete Specialization"
        message="Are you sure you want to delete this specialization? This action cannot be undone."
      />
    </div>
  );
}
