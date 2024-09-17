import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateQuotation({ auth }: { auth: any }) {
  // Initializing the form with the fields we need
  const { data, setData, post, processing, errors } = useForm({
    project_name: '',
    description: '',
    price: '',
    duration: '',
  });

  const [formErrors, setFormErrors] = useState<any>({});

  const validate = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!data.price || parseFloat(data.price) <= 0) {
      newErrors.price = !data.price ? 'Price is required.' : 'Price must be greater than 0.';
      isValid = false;
    }
    if (!data.duration || parseFloat(data.duration) <= 0) {
      newErrors.duration = !data.duration ? 'Duration is required.' : 'Duration must be greater than 0.';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      post('/quotations', {
        onSuccess: () => {
          window.location.href = '/quotations';
        },
      });
    }
  };
  return (
    <AuthenticatedLayout 
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create New Quotation</h2>}
    >
      <Head title="Create Quotation" />

      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

          {/* Back Button */}
          <div className="mb-4">
            <Link
              href="/quotations"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              &larr; Back to Quotation List
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">              
              <form onSubmit={handleSubmit}>
                {/* Project Name */}
                <div className="mb-4">
                  <label htmlFor="project_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Project Name
                  </label>
                  <input
                    id="project_name"
                    type="text"
                    value={data.project_name}
                    onChange={(e) => setData('project_name', e.target.value)}
                    required
                    className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {errors.project_name && <div className="text-red-600 text-sm mt-2">{errors.project_name}</div>}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    required
                    className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  ></textarea>
                  {errors.description && <div className="text-red-600 text-sm mt-2">{errors.description}</div>}
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    required
                    className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {formErrors.price && <div className="text-red-600 text-sm mt-2">{formErrors.price}</div>}
                </div>
  
                {/* Duration */}
                <div className="mb-4">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Duration (Months)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    value={data.duration}
                    onChange={(e) => setData('duration', e.target.value)}
                    required
                    min="0" // Ensure the value is not negative
                    className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {formErrors.duration && <div className="text-red-600 text-sm mt-2">{formErrors.duration}</div>}
                </div>

                {/* Submit Button */}
                <div className="mb-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    {processing ? 'Creating...' : 'Create Quotation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
