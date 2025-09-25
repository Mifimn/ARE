
import { User, Edit3, Trophy, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold flex items-center">
              <User className="mr-3 text-primary-500" size={32} />
              Profile
            </h1>
            <Link to="/edit-profile" className="btn-primary flex items-center">
              <Edit3 className="mr-2" size={16} />
              Edit Profile
            </Link>
          </div>
          <p className="text-gray-300">Your profile information and stats will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
