
import { Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EditProfilePage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
          <p className="text-gray-300 mb-6">Update your personal information</p>
          <div className="flex gap-4">
            <button className="btn-primary flex items-center">
              <Save className="mr-2" size={16} />
              Save Changes
            </button>
            <Link to="/profile" className="btn-secondary flex items-center">
              <X className="mr-2" size={16} />
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
