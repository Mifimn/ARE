import { useState } from 'react';
import { Search, Filter, Trophy, Star, Users, MapPin, Gamepad2, Shield } from 'lucide-react';

export default function PlayersDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [viewMode, setViewMode] = useState('players'); // 'players' or 'teams'

  const players = [
    {
      id: 1,
      username: 'LionKing_ZA',
      fullName: 'Thabo Mthembu',
      country: 'South Africa',
      games: ['FIFA 24', 'COD Warzone'],
      rank: 'Diamond I',
      wins: 45,
      losses: 12,
      avatar: 'https://via.placeholder.com/100x100?text=TM',
      verified: true,
      achievements: ['FIFA Regional Champion', 'Top 10 Africa Leaderboard']
    },
    {
      id: 2,
      username: 'QueenGamer_NG',
      fullName: 'Amina Hassan',
      country: 'Nigeria',
      games: ['Mobile Legends', 'Valorant'],
      rank: 'Mythic Glory',
      wins: 78,
      losses: 23,
      avatar: 'https://via.placeholder.com/100x100?text=AH',
      verified: true,
      achievements: ['ML Continental Champion', 'Valorant Pro League']
    },
    {
      id: 3,
      username: 'DesertFox_EG',
      fullName: 'Omar Mansour',
      country: 'Egypt',
      games: ['Valorant', 'Apex Legends'],
      rank: 'Immortal III',
      wins: 34,
      losses: 8,
      avatar: 'https://via.placeholder.com/100x100?text=OM',
      verified: false,
      achievements: ['Valorant Rising Star', 'Apex Predator Rank']
    },
    {
      id: 4,
      username: 'StormBreaker_KE',
      fullName: 'Grace Wanjiku',
      country: 'Kenya',
      games: ['Fortnite', 'Apex Legends'],
      rank: 'Champion',
      wins: 56,
      losses: 19,
      avatar: 'https://via.placeholder.com/100x100?text=GW',
      verified: true,
      achievements: ['Fortnite East Africa Champion']
    },
    {
      id: 5,
      username: 'PhoenixRise_MA',
      fullName: 'Youssef Benali',
      country: 'Morocco',
      games: ['FIFA 24', 'Mobile Legends'],
      rank: 'Legend V',
      wins: 67,
      losses: 15,
      avatar: 'https://via.placeholder.com/100x100?text=YB',
      verified: true,
      achievements: ['FIFA North Africa Cup', 'ML Tournament Winner']
    },
    {
      id: 6,
      username: 'LightningBolt_GH',
      fullName: 'Kwame Asante',
      country: 'Ghana',
      games: ['COD Warzone', 'Valorant'],
      rank: 'Radiant',
      wins: 89,
      losses: 21,
      avatar: 'https://via.placeholder.com/100x100?text=KA',
      verified: true,
      achievements: ['COD West Africa Champion', 'Valorant Masters']
    }
  ];

  const teams = [
    {
      id: 1,
      name: 'Thunder Hawks',
      game: 'COD Warzone',
      country: 'Nigeria',
      members: 4,
      wins: 23,
      losses: 5,
      logo: 'https://via.placeholder.com/80x80?text=TH',
      verified: true,
      achievements: ['COD Africa Championship', 'Regional Champions']
    },
    {
      id: 2,
      name: 'Desert Storms',
      game: 'Valorant',
      country: 'Egypt',
      members: 5,
      wins: 34,
      losses: 8,
      logo: 'https://via.placeholder.com/80x80?text=DS',
      verified: true,
      achievements: ['Valorant Pro League', 'MENA Champions']
    },
    {
      id: 3,
      name: 'Lion Pride',
      game: 'Mobile Legends',
      country: 'South Africa',
      members: 5,
      wins: 45,
      losses: 12,
      logo: 'https://via.placeholder.com/80x80?text=LP',
      verified: false,
      achievements: ['Regional Finalists']
    },
    {
      id: 4,
      name: 'Phoenix Squadron',
      game: 'FIFA 24',
      country: 'Morocco',
      members: 3,
      wins: 28,
      losses: 7,
      logo: 'https://via.placeholder.com/80x80?text=PS',
      verified: true,
      achievements: ['FIFA Team Championship']
    }
  ];

  const games = ['FIFA 24', 'Mobile Legends', 'COD Warzone', 'Valorant', 'Fortnite', 'Apex Legends'];
  const countries = ['Nigeria', 'South Africa', 'Egypt', 'Kenya', 'Morocco', 'Ghana'];

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = selectedGame === 'all' || player.games.includes(selectedGame);
    const matchesCountry = selectedCountry === 'all' || player.country === selectedCountry;

    return matchesSearch && matchesGame && matchesCountry;
  });

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = selectedGame === 'all' || team.game === selectedGame;
    const matchesCountry = selectedCountry === 'all' || team.country === selectedCountry;

    return matchesSearch && matchesGame && matchesCountry;
  });

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Players & Teams Directory</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover and connect with talented players and competitive teams across Africa
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('players')}
              className={`px-6 py-2 rounded-md transition-colors ${
                viewMode === 'players'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Users className="inline mr-2" size={16} />
              Players
            </button>
            <button
              onClick={() => setViewMode('teams')}
              className={`px-6 py-2 rounded-md transition-colors ${
                viewMode === 'teams'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Shield className="inline mr-2" size={16} />
              Teams
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${viewMode}...`}
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

            {/* Country Filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="input-field"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Players View */}
        {viewMode === 'players' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlayers.map(player => (
              <div key={player.id} className="card hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <img
                    src={player.avatar}
                    alt={player.fullName}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold">{player.username}</h3>
                      {player.verified && (
                        <Star className="w-4 h-4 text-yellow-400 ml-2" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{player.fullName}</p>
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin size={12} className="mr-1" />
                      {player.country}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Rank</span>
                    <span className="text-primary-400 font-medium">{player.rank}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">W/L Record</span>
                    <span className="text-green-400">{player.wins}W - {player.losses}L</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Games</p>
                  <div className="flex flex-wrap gap-1">
                    {player.games.map(game => (
                      <span key={game} className="bg-dark-700 text-xs px-2 py-1 rounded">
                        {game}
                      </span>
                    ))}
                  </div>
                </div>

                {player.achievements.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Achievements</p>
                    <div className="space-y-1">
                      {player.achievements.slice(0, 2).map((achievement, index) => (
                        <div key={index} className="flex items-center text-xs text-yellow-400">
                          <Trophy size={12} className="mr-1" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button className="btn-primary w-full">View Profile</button>
              </div>
            ))}
          </div>
        )}

        {/* Teams View */}
        {viewMode === 'teams' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map(team => (
              <div key={team.id} className="card hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-16 h-16 rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold">{team.name}</h3>
                      {team.verified && (
                        <Star className="w-4 h-4 text-yellow-400 ml-2" />
                      )}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Gamepad2 size={12} className="mr-1" />
                      {team.game}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin size={12} className="mr-1" />
                      {team.country}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Members</span>
                    <span className="text-primary-400">{team.members} players</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">W/L Record</span>
                    <span className="text-green-400">{team.wins}W - {team.losses}L</span>
                  </div>
                </div>

                {team.achievements.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Achievements</p>
                    <div className="space-y-1">
                      {team.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center text-xs text-yellow-400">
                          <Trophy size={12} className="mr-1" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button className="btn-primary w-full">View Team</button>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {((viewMode === 'players' && filteredPlayers.length === 0) ||
          (viewMode === 'teams' && filteredTeams.length === 0)) && (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No {viewMode} found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}