'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Plus, Trash2, Mail, Phone, MapPin, ExternalLink, Users, Edit } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationModal';
import AdminLoader from '@/components/AdminLoader';

const noScript = (value: string | undefined): boolean => {
  if (!value) return true;
  return !/<script\b[^>]*>([\s\S]*?)<\/script>/gim.test(value);
};

const phoneRegex = /^\+91\s[0-9]{10}$/;

const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allowed = [
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End'
  ];
  if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) {
    return;
  }
  if (e.key === '+' || e.key === ' ') {
    return;
  }
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
};

const formatPhoneInput = (val: string): string => {
  if (!val) return '';
  if (val.trim() === '') return '';
  
  const digitsOnly = val.replace(/\D/g, '');
  if (!digitsOnly) {
    return val.startsWith('+') ? '+' : '';
  }
  
  let localDigits = digitsOnly;
  if (digitsOnly.startsWith('91')) {
    localDigits = digitsOnly.slice(2);
  }
  
  const trimmedLocalDigits = localDigits.slice(0, 10);
  return `+91 ${trimmedLocalDigits}`;
};

const phoneValidation = yup.string()
  .matches(phoneRegex, 'Phone number must start with +91 followed by 10 digits')
  .test('no-letters', 'Phone number cannot contain letters', (value) => {
    if (!value) return true;
    return !/[a-zA-Z]/.test(value);
  })
  .test('exactly-10-digits', 'Phone number must have exactly 10 digits after +91', (value) => {
    if (!value) return false;
    const rawNumber = value.replace(/^\+91\s?/, '');
    const digitsOnly = rawNumber.replace(/\D/g, '');
    return digitsOnly.length === 10;
  })
  .test('no-script', 'Script tags are not allowed', noScript)
  .required('Phone number is required');

const schema = yup.object({
  phone: phoneValidation,
  email: yup.string()
    .email('Must be a valid email address')
    .test('no-script', 'Script tags are not allowed', noScript)
    .required('Email address is required'),
  address: yup.string()
    .test('no-script', 'Script tags are not allowed', noScript)
    .required('Physical address is required'),
  directionsLink: yup.string()
    .url('Must be a valid Google Maps directions URL')
    .test('no-script', 'Script tags are not allowed', noScript)
    .required('Google Maps directions URL is required'),
  directContacts: yup.array().of(
    yup.object({
      name: yup.string().required('Name is required').test('no-script', 'Script tags are not allowed', noScript),
      phone: phoneValidation,
    }).required()
  ).required('At least one direct contact is required').min(1, 'At least one direct contact is required'),
}).required();

type FormData = yup.InferType<typeof schema>;

const defaultContact: FormData = {
  phone: "+91 99959 05111",
  email: "parklegalkochi@gmail.com",
  address: "1st Floor, Johns Corner Building, Judges Ave, GCDA LIG Colony, Ernakulam North, Kathrikadavu, Kaloor, Kochi, Kerala 682017",
  directionsLink: "https://share.google/RA8iNjjGzmtfZquIz",
  directContacts: [
    { name: "Aravind", phone: "+91 8714812848" },
    { name: "Manu", phone: "+91 9400897108" }
  ]
};

export default function AdminContact() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: defaultContact
  });

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control,
    name: "directContacts"
  });

  const fetchContact = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/contact', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const formatted = {
          phone: data.phone || defaultContact.phone,
          email: data.email || defaultContact.email,
          address: data.address || defaultContact.address,
          directionsLink: data.directionsLink || defaultContact.directionsLink,
          directContacts: data.directContacts || defaultContact.directContacts
        };
        reset(formatted);
        setOriginalData(formatted);
      }
    } catch {
      toast.error('Failed to fetch contact details');
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const savedData = await res.json();
        const formatted = {
          phone: savedData.phone || defaultContact.phone,
          email: savedData.email || defaultContact.email,
          address: savedData.address || defaultContact.address,
          directionsLink: savedData.directionsLink || defaultContact.directionsLink,
          directContacts: savedData.directContacts || defaultContact.directContacts
        };
        reset(formatted);
        setOriginalData(formatted);
        setIsEditing(false);
        toast.success('Contact details updated successfully!');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to save contact details');
      }
    } catch {
      toast.error('An error occurred while saving');
    }
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      removeContact(deleteIndex);
    }
    setIsDeleteModalOpen(false);
    setDeleteIndex(null);
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

  if (loading) return <AdminLoader message="Loading contact details..." className="flex-1" />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light text-[#333333]">Contact Details</h1>
          <p className="text-gray-500 mt-1">Manage office contact information, directions, and direct lawyers lines.</p>
        </div>
        <div className="hidden sm:flex gap-3 w-full sm:w-auto">
          {renderActionButtons()}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Main Office Contacts */}
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-medium flex items-center gap-2 text-gray-800 border-b border-gray-50 pb-4">
              <span className="w-1.5 h-6 bg-brand-primary rounded-full"></span>
              Primary Office Info
            </h2>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Phone size={16} className="text-brand-primary" />
                Phone Number
              </label>
              <input
                {...register('phone')}
                disabled={!isEditing}
                type="tel"
                onKeyDown={handlePhoneKeyDown}
                onChange={(e) => {
                  const val = e.target.value;
                  const formatted = formatPhoneInput(val);
                  e.target.value = formatted;
                  register('phone').onChange(e);
                }}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="+91 99959 05111"
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Mail size={16} className="text-brand-primary" />
                Email Address
              </label>
              <input
                {...register('email')}
                disabled={!isEditing}
                type="email"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="parklegalkochi@gmail.com"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            {/* Directions Map Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <ExternalLink size={16} className="text-brand-primary" />
                Google Maps Directions URL
              </label>
              <input
                {...register('directionsLink')}
                disabled={!isEditing}
                type="text"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.directionsLink ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="https://share.google/..."
              />
              {errors.directionsLink && <p className="text-red-500 text-xs">{errors.directionsLink.message}</p>}
            </div>
          </div>

          {/* Physical Address */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-medium flex items-center gap-2 text-gray-800">
              <span className="w-1.5 h-6 bg-brand-primary rounded-full"></span>
              Office Physical Address
            </h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <MapPin size={16} className="text-brand-primary" />
                Full Location Details
              </label>
              <textarea
                {...register('address')}
                disabled={!isEditing}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Enter detailed office address..."
              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>
          </div>
        </div>

        {/* Direct Lawyer Contacts list */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-[580px]">
          <div className="flex justify-between items-center mb-6 shrink-0 border-b border-gray-50 pb-4">
            <h2 className="text-lg font-medium flex items-center gap-2 text-gray-800">
              <span className="w-1.5 h-6 bg-brand-primary rounded-full"></span>
              Direct Lawyers Contacts
            </h2>
            <button
              type="button"
              onClick={() => { if (!isEditing) setIsEditing(true); appendContact({ name: '', phone: '+91 ' }); }}
              className="flex items-center gap-1 text-sm bg-gray-50 text-brand-primary px-3 py-1.5 rounded-lg transition-colors font-medium shrink-0 hover:bg-gray-100"
            >
              <Plus size={16} /> Add Contact
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {contactFields.map((field, i) => (
              <div key={field.id} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-200 hover:border-brand-primary/20 transition-all space-y-3">
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-brand-primary shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center border border-brand-primary/10">
                    {i + 1}
                  </span>
                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Contact Name */}
                    <div>
                      <input
                        {...register(`directContacts.${i}.name` as const)}
                        disabled={!isEditing}
                        type="text"
                        placeholder="Name"
                        className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.directContacts?.[i]?.name ? 'border-red-500' : 'border-gray-200'}`}
                      />
                    </div>
                    {/* Contact Phone */}
                    <div>
                      <input
                        {...register(`directContacts.${i}.phone` as const)}
                        disabled={!isEditing}
                        type="tel"
                        onKeyDown={handlePhoneKeyDown}
                        onChange={(e) => {
                          const val = e.target.value;
                          const formatted = formatPhoneInput(val);
                          e.target.value = formatted;
                          register(`directContacts.${i}.phone` as const).onChange(e);
                        }}
                        placeholder="Phone"
                        className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.directContacts?.[i]?.phone ? 'border-red-500' : 'border-gray-200'}`}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(i)}
                    disabled={!isEditing}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {/* Validation Errors */}
                {(errors.directContacts?.[i]?.name || errors.directContacts?.[i]?.phone) && (
                  <div className="flex flex-col text-[10px] text-red-500 ml-8 space-y-0.5">
                    {errors.directContacts?.[i]?.name && <p>Name: {errors.directContacts[i]?.name?.message}</p>}
                    {errors.directContacts?.[i]?.phone && <p>Phone: {errors.directContacts[i]?.phone?.message}</p>}
                  </div>
                )}
              </div>
            ))}

            {contactFields.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl flex-1 flex flex-col justify-center">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No direct contacts added. Add at least one.</p>
              </div>
            )}
            
            {errors.directContacts && !Array.isArray(errors.directContacts) && (
              <p className="text-red-500 text-xs mt-2">{errors.directContacts.message}</p>
            )}
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
        title="Delete Contact"
        message="Are you sure you want to remove this direct lawyer contact?"
      />
    </div>
  );
}
