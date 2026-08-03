'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Plus, Trash2, Edit } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
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
  description: yup.string()
    .min(20, 'Description must be at least 20 characters')
    .test('no-script', 'Script tags are not allowed', noScript)
    .required('Description is required'),
  stats: yup.array().of(
    yup.object({
      label: yup.string().required('Label is required').test('no-script', 'Script tags are not allowed', noScript),
      value: yup.string().required('Value is required').test('no-script', 'Script tags are not allowed', noScript),
    }).required()
  ).required().min(1, 'At least one statistic is required'),
  points: yup.array().of(
    yup.object({
      text: yup.string().required('Point text is required').test('no-script', 'Script tags are not allowed', noScript)
    }).required()
  ).required().min(1, 'At least one point is required'),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function AdminAbout() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{ type: 'point' | 'stat', index: number } | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: '',
      stats: [],
      points: []
    }
  });

  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({
    control,
    name: "stats"
  });

  const { fields: pointFields, append: appendPoint, remove: removePoint } = useFieldArray({
    control,
    name: "points"
  });

  const fetchAbout = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/about', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const formatted = {
          description: data.description || '',
          stats: data.stats || [],
          // Map string array to object array for the form
          points: (data.points || []).map((p: string | { text: string }) => ({
            text: typeof p === 'string' ? p : (p.text || '')
          }))
        };
        reset(formatted);
        setOriginalData(formatted);
      }
    } catch {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const onSubmit = async (data: FormData) => {
    try {
      // Map object array back to string array for the API
      const payload = {
        ...data,
        points: data.points.map(p => p.text)
      };

      const res = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const savedData = await res.json();
        const formatted = {
          description: savedData.description || '',
          stats: savedData.stats || [],
          points: (savedData.points || []).map((p: string | { text: string }) => ({
            text: typeof p === 'string' ? p : (p.text || '')
          }))
        };
        reset(formatted);
        setOriginalData(formatted);
        setIsEditing(false);
        toast.success('About section updated successfully!');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to save changes');
      }
    } catch {
      toast.error('An error occurred while saving');
    }
  };

  const handleDeleteClick = (type: 'point' | 'stat', index: number) => {
    setDeleteConfig({ type, index });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteConfig) return;
    if (deleteConfig.type === 'point') {
      removePoint(deleteConfig.index);
    } else {
      removeStat(deleteConfig.index);
    }
    setIsDeleteModalOpen(false);
    setDeleteConfig(null);
  };

  const renderActionButtons = () => (
    <>
      {!isEditing ? (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-black transition-all shadow-lg shadow-gray-200 w-full sm:w-auto justify-center"
        >
          <Edit size={20} /> Edit
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              if (originalData) {
                reset(originalData);
              }
              setIsEditing(false);
            }}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all w-full sm:w-auto justify-center"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-gray-200 w-full sm:w-auto justify-center"
          >
            <Save size={20} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </>
      )}
    </>
  );

  if (loading) return <AdminLoader message="Loading about section settings..." className="flex-1" />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light text-[#333333]">About Section</h1>
          <p className="text-gray-500 mt-1">Manage the &quot;Why Choose Park Legal?&quot; content on the homepage.</p>
        </div>
        <div className="hidden sm:flex gap-3 w-full sm:w-auto">
          {renderActionButtons()}
        </div>
      </div>

      <div className="space-y-8">
        {/* Main Description */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-800">
            <span className="w-1.5 h-6 bg-brand-primary rounded-full"></span>
            Section Description
          </h2>
          <textarea
            {...register('description')}
            disabled={!isEditing}
            rows={4}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="Enter the main description text that explains why clients should choose your firm..."
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Key Points */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-[480px]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-lg font-medium flex items-center gap-2 text-gray-800">
                <span className="w-1.5 h-6 bg-brand-primary rounded-full"></span>
                Key Points
              </h2>
              <button 
                type="button"
                onClick={() => { if (!isEditing) setIsEditing(true); appendPoint({ text: '' }); }} 
                className="flex items-center gap-1 text-sm bg-gray-50 text-brand-primary px-3 py-1.5 rounded-lg transition-colors font-medium shrink-0 hover:bg-gray-100"
              >
                <Plus size={16} /> Add Point
              </button>
            </div>
            
            <div data-lenis-prevent className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {pointFields.map((field, i) => (
                <div key={field.id} className="group relative">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        {...register(`points.${i}.text` as const)}
                        disabled={!isEditing}
                        type="text"
                        placeholder={`Point ${i + 1}`}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.points?.[i]?.text ? 'border-red-500' : 'border-gray-200'}`}
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleDeleteClick('point', i)} 
                      disabled={!isEditing}
                      className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  {errors.points?.[i]?.text && <p className="text-red-500 text-xs mt-1 ml-1">{errors.points[i]?.text?.message}</p>}
                </div>
              ))}
              {pointFields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl flex-1 flex flex-col justify-center">
                  <p className="text-gray-400 text-sm">No points added. Add at least one.</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-[480px]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-lg font-medium flex items-center gap-2 text-gray-800">
                <span className="w-1.5 h-6 bg-brand-primary rounded-full"></span>
                Statistics
              </h2>
              <button 
                type="button"
                onClick={() => { if (!isEditing) setIsEditing(true); appendStat({ label: '', value: '' }); }} 
                className="flex items-center gap-1 text-sm bg-gray-50 text-brand-primary px-3 py-1.5 rounded-lg transition-colors font-medium shrink-0 hover:bg-gray-100"
              >
                <Plus size={16} /> Add Stat
              </button>
            </div>
            
            <div data-lenis-prevent className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {statFields.map((field, i) => (
                <div key={field.id} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="w-20 sm:w-24 shrink-0">
                      <input
                        {...register(`stats.${i}.value` as const)}
                        disabled={!isEditing}
                        type="text"
                        placeholder="Value"
                        className={`w-full px-2 sm:px-3 py-2.5 border rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.stats?.[i]?.value ? 'border-red-500' : 'border-gray-200'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        {...register(`stats.${i}.label` as const)}
                        disabled={!isEditing}
                        type="text"
                        placeholder="Label"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.stats?.[i]?.label ? 'border-red-500' : 'border-gray-200'}`}
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleDeleteClick('stat', i)} 
                      disabled={!isEditing}
                      className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  {(errors.stats?.[i]?.value || errors.stats?.[i]?.label) && (
                    <div className="flex gap-2 ml-1">
                      {errors.stats?.[i]?.value && <p className="text-red-500 text-[10px] w-20 sm:w-24">{errors.stats[i]?.value?.message}</p>}
                      {errors.stats?.[i]?.label && <p className="text-red-500 text-[10px] flex-1">{errors.stats[i]?.label?.message}</p>}
                    </div>
                  )}
                </div>
              ))}
              {statFields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl flex-1 flex flex-col justify-center">
                  <p className="text-gray-400 text-sm">No statistics added. Add at least one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Mobile Sticky Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-30 flex gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {renderActionButtons()}
      </div>
      <div className="h-20 sm:hidden"></div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${deleteConfig?.type === 'point' ? 'Point' : 'Statistic'}`}
        message={`Are you sure you want to remove this ${deleteConfig?.type === 'point' ? 'key point' : 'statistic'}?`}
      />
    </div>
  );
}
