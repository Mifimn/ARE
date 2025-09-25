
import { Edit } from 'lucide-react';

export default function UpdateTournamentPage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <Edit className="mr-3 text-primary-500" size={32} />
            Update Tournament
          </h1>
          <p className="text-gray-300">Tournament update form will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}
