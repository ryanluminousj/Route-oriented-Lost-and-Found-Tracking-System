import { useState } from 'react';
import { X, Upload } from 'lucide-react';

export function ReportItem({ routes, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    routeId: routes[0]?.id || '',
    type: 'lost',
    category: 'Other',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    reportedBy: '',
    contactEmail: '',
    imageUrl: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    'Electronics',
    'Personal Items',
    'Clothing',
    'Accessories',
    'Documents',
    'Other'
  ];

  const selectedRoute = routes.find(r => r.id === formData.routeId);

  // Show toast-like message (using alert as fallback)
  const showError = (message) => {
    alert(message);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setImagePreview(result);
        setImageFile({
          base64: result,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate: found items must have an image
    if (formData.type === 'found' && !imageFile) {
      showError('Please upload an image of the found item');
      return;
    }

    try {
      setIsUploading(true);

      // Use the base64 data URL directly (no upload needed)
      const imageUrl = imageFile ? imageFile.base64 : '';

      // Submit the form
      onSubmit({
        ...formData,
        imageUrl: imageUrl,
        status: 'open'
      });

      setIsUploading(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      showError('Failed to submit form. Please try again.');
      setIsUploading(false);
    }
  };

  const isFormValid = formData.description &&
    formData.location &&
    formData.reportedBy &&
    formData.contactEmail &&
    (formData.type === 'lost' || imageFile) &&
    !isUploading;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Report Lost or Found Item</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'lost' })}
                className={`p-4 border-2 rounded-lg font-medium transition-colors ${
                  formData.type === 'lost'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">🔍</div>
                Lost Item
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'found' })}
                className={`p-4 border-2 rounded-lg font-medium transition-colors ${
                  formData.type === 'found'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">✨</div>
                Found Item
              </button>
            </div>
          </div>

          {/* Route Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Route *
            </label>
            <select
              value={formData.routeId}
              onChange={(e) => setFormData({ ...formData, routeId: e.target.value, location: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {routes.map(route => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
              placeholder="Detailed description of the item..."
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo {formData.type === 'found' ? '*' : '(Optional)'}
            </label>
            {formData.type === 'found' && (
              <p className="text-sm text-amber-600 mb-2">
                ⚠️ Photo of the found item is mandatory (to assist the owner)
              </p>
            )}

            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center py-6">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 font-medium">
                    Click to upload photo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG (up to 10 MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required={formData.type === 'found'}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-60 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (Stop) *
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select location...</option>
              {selectedRoute?.stops.map(stop => (
                <option key={stop} value={stop}>
                  {stop}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Reporter Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reported By *
              </label>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Your name or ID"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
