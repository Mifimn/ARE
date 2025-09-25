
import { Plus } from 'lucide-react';

export default function CreateTournamentPage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <Plus className="mr-3 text-primary-500" size={32} />
            Create New Tournament
          </h1>
          <p className="text-gray-300">Tournament creation form will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}
