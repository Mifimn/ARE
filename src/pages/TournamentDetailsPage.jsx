
import { Trophy, Calendar, Users, MapPin, DollarSign, Clock, Star, UserPlus, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TournamentDetailsPage() {
  const tournament = {
    id: 1,
    name: 'FIFA 24 African Championship',
    game: 'FIFA 24',
    description: 'The biggest FIFA tournament in Africa featuring top players from across the continent. This championship will determine the best FIFA player in Africa.',
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    registrationDeadline: '2024-03-10',
    maxParticipants: 128,
    currentParticipants: 96,
    prizePool: 5000,
    entryFee: 0,
    format: 'Single Elimination',
    platform: 'Console',
    region: 'Africa',
    status: 'Registration Open',
    organizer: 'Africa Rise Esports',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop',
    streamingPlatform: 'https://twitch.tv/africariesports',
    rules: `
      1. Standard FIFA 24 rules apply
      2. No exploits or glitches allowed
      3. Players must be from African countries
      4. All matches will be best of 3
      5. Time limit: 6 minutes per half
      6. Any form of cheating will result in immediate disqualification
    `
  };

  const prizeDistribution = [
    { position: '1st Place', prize: '$2,500', percentage: '50%' },
    { position: '2nd Place', prize: '$1,250', percentage: '25%' },
    { position: '3rd Place', prize: '$750', percentage: '15%' },
    { position: '4th Place', prize: '$500', percentage: '10%' }
  ];

  const participants = [
    {
      id: 1,
      username: 'FIFAKing23',
      fullName: 'John Doe',
      country: 'Nigeria',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      ranking: 'Gold III'
    },
    {
      id: 2,
      username: 'DesertStorm',
      fullName: 'Ahmed Hassan',
      country: 'Egypt',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      ranking: 'Platinum I'
    },
    {
      id: 3,
      username: 'LionHeart',
      fullName: 'Sipho Mbeki',
      country: 'South Africa',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
      ranking: 'Gold I'
    },
    {
      id: 4,
      username: 'AtlasWarrior',
      fullName: 'Youssef Alami',
      country: 'Morocco',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=50&h=50&fit=crop&crop=face',
      ranking: 'Diamond II'
    }
  ];

  const schedule = [
    {
      round: 'Round 1',
      date: '2024-03-15',
      time: '10:00 AM',
      matches: 64
    },
    {
      round: 'Round 2',
      date: '2024-03-15',
      time: '2:00 PM',
      matches: 32
    },
    {
      round: 'Quarter Finals',
      date: '2024-03-16',
      time: '10:00 AM',
      matches: 8
    },
    {
      round: 'Semi Finals',
      date: '2024-03-16',
      time: '6:00 PM',
      matches: 4
    },
    {
      round: 'Finals',
      date: '2024-03-17',
      time: '8:00 PM',
      matches: 1
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden mb-8">
          <img
            src={tournament.image}
            alt={tournament.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center">
            <div className="max-w-4xl mx-auto px-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{tournament.name}</h1>
                  <p className="text-xl text-primary-400 mb-2">{tournament.game}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <Calendar className="mr-1" size={16} />
                      {new Date(tournament.startDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Users className="mr-1" size={16} />
                      {tournament.currentParticipants}/{tournament.maxParticipants}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="mr-1" size={16} />
                      ${tournament.prizePool}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="btn-primary flex items-center">
                    <UserPlus className="mr-2" size={16} />
                    Join Tournament
                  </button>
                  <Link to={`/update-tournament/${tournament.id}`} className="btn-secondary flex items-center">
                    <Edit3 className="mr-2" size={16} />
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-4">Tournament Overview</h2>
              <p className="text-gray-300 mb-6">{tournament.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">{tournament.format}</div>
                  <div className="text-gray-400 text-sm">Format</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{tournament.platform}</div>
                  <div className="text-gray-400 text-sm">Platform</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{tournament.region}</div>
                  <div className="text-gray-400 text-sm">Region</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    tournament.status === 'Registration Open' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {tournament.status}
                  </div>
                  <div className="text-gray-400 text-sm">Status</div>
                </div>
              </div>
            </div>

            {/* Tournament Rules */}
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-4">Tournament Rules</h2>
              <div className="text-gray-300 whitespace-pre-line">{tournament.rules}</div>
            </div>

            {/* Schedule */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Tournament Schedule</h2>
              <div className="space-y-4">
                {schedule.map((item, index) => (
                  <div key={index} className="bg-dark-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{item.round}</h3>
                        <p className="text-gray-400 text-sm">{item.matches} matches</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{new Date(item.date).toLocaleDateString()}</p>
                        <p className="text-gray-400 text-sm">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Prize Pool */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Trophy className="mr-2 text-primary-400" size={20} />
                Prize Pool
              </h2>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-primary-400">${tournament.prizePool}</div>
                <div className="text-gray-400 text-sm">Total Prize Pool</div>
              </div>
              <div className="space-y-3">
                {prizeDistribution.map((prize, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{prize.position}</span>
                    <div className="text-right">
                      <div className="font-semibold">{prize.prize}</div>
                      <div className="text-xs text-gray-400">{prize.percentage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tournament Info */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Tournament Info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Organizer:</span>
                  <span>{tournament.organizer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Entry Fee:</span>
                  <span className="text-green-400">
                    {tournament.entryFee === 0 ? 'Free' : `$${tournament.entryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Registration Deadline:</span>
                  <span>{new Date(tournament.registrationDeadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Stream:</span>
                  <a href={tournament.streamingPlatform} className="text-primary-400 hover:text-primary-300">
                    Watch Live
                  </a>
                </div>
              </div>
            </div>

            {/* Recent Participants */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Recent Participants</h2>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center">
                    <img
                      src={participant.avatar}
                      alt={participant.fullName}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{participant.username}</p>
                      <p className="text-xs text-gray-400">{participant.country}</p>
                    </div>
                    <div className="text-xs text-primary-400">{participant.ranking}</div>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Link to="/players" className="text-primary-400 hover:text-primary-300 text-sm">
                    View All Participants
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
