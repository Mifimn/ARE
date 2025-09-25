
import { Trophy } from 'lucide-react';

export default function TournamentDetailsPage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <Trophy className="mr-3 text-primary-500" size={32} />
            Tournament Details
          </h1>
          <p className="text-gray-300">Detailed tournament information will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
