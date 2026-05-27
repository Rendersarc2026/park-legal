'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationModal';

const noScript = (value: string | undefined) => {
  if (!value) return true;
  return !/<script\b[^>]*>([\s\S]*?)<\/script>/gim.test(value);
};

const schema = yup.object({
  title: yup.string()
    .min(5, 'Title must be at least 5 characters')
    .test('no-script', 'Script tags are not allowed', noScript)
    .required('Title is required'),
  date: yup.string().required('Date is required'),
  category: yup.string()
    .test('no-script', 'Script tags are not allowed', noScript)
    .required('Category is required'),
  imageUrl: yup.string()
    .required('Image URL is required')
    .test('is-valid-src', 'Must be a valid URL or relative path (starting with /)', (value) => {
      if (!value) return false;
      return value.startsWith('/') || value.startsWith('http');
    })
    .test('no-script', 'Script tags are not allowed', noScript),
  excerpt: yup.string()
    .min(10, 'Excerpt must be at least 10 characters')
    .test('no-script', 'Script tags are not allowed', noScript)
    .required('Excerpt is required'),
  content: yup.string()
    .test('no-script', 'Script tags are not allowed', noScript)
    .ensure(),
}).required();

type FormData = yup.InferType<typeof schema>;

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  category: string;
  imageUrl: string;
}

export default function AdminNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      date: '',
      category: '',
      imageUrl: '',
    }
  });

  const imageUrl = watch('imageUrl');

  const fetchArticles = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/news?page=${page}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles);
        setTotalPages(data.totalPages);
        setCurrentPage(data.page);
      }
    } catch {
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage, fetchArticles]);

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      e.target.value = ''; // Reset input
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      if (res.ok) {
        const data = await res.json();
        setValue('imageUrl', data.imageUrl);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingId(article.id);
      reset({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content || '',
        date: article.date, // Now stored as YYYY-MM-DD
        category: article.category,
        imageUrl: article.imageUrl,
      });
    } else {
      setEditingId(null);
      reset({ 
        title: '', 
        excerpt: '', 
        content: '',
        date: new Date().toISOString().split('T')[0], 
        category: '', 
        imageUrl: '', 
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: editingId, ...data } : data;

    try {
      const res = await fetch('/api/admin/news', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingId ? 'Article updated successfully' : 'Article created successfully');
        setIsModalOpen(false);
        fetchArticles(currentPage);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to save article');
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
      const res = await fetch('/api/admin/news', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemToDelete }),
      });

      if (res.ok) {
        toast.success('Article deleted successfully');
        fetchArticles(currentPage);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to delete article');
      }
    } catch {
      toast.error('An error occurred while deleting');
    } finally {
      setItemToDelete(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Fallback to raw string
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-light text-[#333333]">News & Articles</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black transition-all shadow-md shadow-gray-200 w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Add Article
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)] min-h-[460px]">
        {loading ? (
          <div className="p-8 text-center text-gray-500 flex-1 flex items-center justify-center">Loading...</div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 bg-gray-50">Title</th>
                <th className="px-6 py-4 bg-gray-50">Date</th>
                <th className="px-6 py-4 bg-gray-50">Category</th>
                <th className="px-6 py-4 text-right bg-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 text-sm">{article.title}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(article.date)}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{article.category}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(article)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(article.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No articles found. Add one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && articles.length > 0 && (
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-medium">{editingId ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  {...register('title')}
                  type="text" 
                  className={`w-full px-4 py-2 border rounded-xl ${errors.title ? 'border-red-500' : ''}`} 
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    {...register('date')}
                    type="date" 
                    className={`w-full px-4 py-2 border rounded-xl ${errors.date ? 'border-red-500' : ''}`} 
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category (e.g. Legal Advice)</label>
                  <input 
                    {...register('category')}
                    type="text" 
                    className={`w-full px-4 py-2 border rounded-xl ${errors.category ? 'border-red-500' : ''}`} 
                  />
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                {imageUrl && (
                  <div className="relative aspect-[16/9] w-full mb-4 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
                  <input 
                    {...register('imageUrl')}
                    type="text" 
                    readOnly
                    className={`flex-1 px-4 py-2 border rounded-xl bg-gray-50 cursor-not-allowed ${errors.imageUrl ? 'border-red-500' : ''}`} 
                    placeholder="Click 'Upload File' to select an image" 
                  />
                  <label className="cursor-pointer bg-gray-50 px-4 py-2 border border-dashed border-gray-300 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap">
                    <span className="text-sm text-gray-600">{uploading ? 'Uploading...' : 'Upload File'}</span>
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                  </label>
                </div>
                {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Short Summary)</label>
                <textarea 
                  {...register('excerpt')}
                  rows={2} 
                  className={`w-full px-4 py-2 border rounded-xl ${errors.excerpt ? 'border-red-500' : ''}`} 
                />
                {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                <textarea 
                  {...register('content')}
                  rows={8} 
                  className={`w-full px-4 py-2 border rounded-xl ${errors.content ? 'border-red-500' : ''}`} 
                  placeholder="Paste the full article content here..."
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
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
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
      />
    </div>
  );
}
