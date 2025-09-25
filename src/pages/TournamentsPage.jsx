import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, Trophy, Users, MapPin } from 'lucide-react';

export default function TournamentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const tournaments = [
    {
      id: 1,
      name: 'FIFA 24 Championship',
      game: 'FIFA 24',
      participants: '64/128',
      prizePool: '$5,000',
      startDate: '2024-03-15',
      status: 'Registration Open',
      difficulty: 'Professional',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Mobile Legends Cup',
      game: 'Mobile Legends',
      participants: '32/64',
      prizePool: '$2,500',
      startDate: '2024-03-20',
      status: 'Registration Open',
      difficulty: 'Amateur',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'COD Warzone Battle',
      game: 'COD Warzone',
      participants: '48/100',
      prizePool: '$3,000',
      startDate: '2024-03-25',
      status: 'Registration Open',
      difficulty: 'Professional',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Valorant Champions',
      game: 'Valorant',
      participants: '16/32',
      prizePool: '$1,500',
      startDate: '2024-04-01',
      status: 'Coming Soon',
      difficulty: 'Semi-Pro',
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=200&fit=crop'
    }
  ];

  const games = ['FIFA 24', 'Mobile Legends', 'COD Warzone', 'Valorant', 'Fortnite', 'Apex Legends'];
  const statuses = ['upcoming', 'live', 'completed'];

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = selectedGame === 'all' || tournament.game === selectedGame;
    const matchesStatus = selectedStatus === 'all' || tournament.status === selectedStatus;

    return matchesSearch && matchesGame && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400 bg-blue-400/10';
      case 'live': return 'text-green-400 bg-green-400/10';
      case 'completed': return 'text-gray-400 bg-gray-400/10';
      case 'Registration Open': return 'text-green-400 bg-green-400/10';
      case 'Coming Soon': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'live': return 'Live';
      case 'completed': return 'Completed';
      case 'Registration Open': return 'Registration Open';
      case 'Coming Soon': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tournaments</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover and join competitive gaming tournaments across Africa
          </p>
        </div>

        {/* Filters */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Game Filter */}
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="input-field"
            >
              <option value="all">All Games</option>
              {games.map(game => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {getStatusText(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTournaments.map(tournament => (
            <div key={tournament.id} className="card hover:scale-105 transition-transform duration-300">
              <div className="mb-4">
                <img
                  src={tournament.image}
                  alt={tournament.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>

              <h3 className="text-xl font-bold mb-2">{tournament.name}</h3>
              <p className="text-primary-400 font-medium mb-2">{tournament.game}</p>
              <p className="text-gray-300 text-sm mb-4">{tournament.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar size={16} className="mr-2" />
                  {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Trophy size={16} className="mr-2" />
                  Prize Pool: <span className="text-green-400 ml-1">{tournament.prizePool}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Users size={16} className="mr-2" />
                  {tournament.participants} Participants
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin size={16} className="mr-2" />
                  {tournament.location}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/tournament/${tournament.id}`}
                  className="btn-secondary flex-1 text-center"
                >
                  View Details
                </Link>
                {tournament.status === 'Registration Open' && tournament.participants < tournament.maxParticipants && (
                  <button className="btn-primary flex-1">
                    Join Tournament
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No tournaments found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}