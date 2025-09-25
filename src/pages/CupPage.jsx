
import { Trophy, Calendar, Clock, Users, Crown } from 'lucide-react';

export default function CupPage() {
  const cup = {
    name: 'African Mobile Legends Cup',
    game: 'Mobile Legends',
    totalTeams: 16,
    prizePool: 3000,
    startDate: '2024-02-20',
    status: 'Quarter Finals'
  };

  const bracket = {
    quarterFinals: [
      {
        match: 1,
        team1: { name: 'Thunder Hawks', score: 2, logo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=40&h=40&fit=crop' },
        team2: { name: 'Storm Riders', score: 1, logo: 'https://images.unsplash.com/photo-1569517282132-25d22f4573b7?w=40&h=40&fit=crop' },
        winner: 'Thunder Hawks',
        date: '2024-02-20',
        time: '18:00'
      },
      {
        match: 2,
        team1: { name: 'Desert Eagles', score: 3, logo: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=40&h=40&fit=crop' },
        team2: { name: 'Lion Pride', score: 1, logo: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=40&h=40&fit=crop' },
        winner: 'Desert Eagles',
        date: '2024-02-20',
        time: '19:00'
      },
      {
        match: 3,
        team1: { name: 'Atlas Warriors', score: null, logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=40&h=40&fit=crop' },
        team2: { name: 'Pharaoh Force', score: null, logo: 'https://images.unsplash.com/photo-1586232702178-f044c5f4d4b7?w=40&h=40&fit=crop' },
        winner: null,
        date: '2024-02-21',
        time: '18:00'
      },
      {
        match: 4,
        team1: { name: 'Savanna Kings', score: null, logo: 'https://images.unsplash.com/photo-1594736797933-d0b22b585e85?w=40&h=40&fit=crop' },
        team2: { name: 'Nile Sharks', score: null, logo: 'https://images.unsplash.com/photo-1578320780850-72ec3431e73d?w=40&h=40&fit=crop' },
        winner: null,
        date: '2024-02-21',
        time: '19:00'
      }
    ],
    semiFinals: [
      {
        match: 1,
        team1: { name: 'Thunder Hawks', score: null },
        team2: { name: 'Desert Eagles', score: null },
        winner: null,
        date: '2024-02-24',
        time: '18:00'
      },
      {
        match: 2,
        team1: { name: 'TBD', score: null },
        team2: { name: 'TBD', score: null },
        winner: null,
        date: '2024-02-24',
        time: '20:00'
      }
    ],
    final: {
      team1: { name: 'TBD', score: null },
      team2: { name: 'TBD', score: null },
      winner: null,
      date: '2024-02-26',
      time: '20:00'
    }
  };

  const prizeDistribution = [
    { position: 'Winner', prize: '$1,500', icon: Crown, color: 'text-yellow-400' },
    { position: 'Runner-up', prize: '$750', icon: Trophy, color: 'text-gray-300' },
    { position: 'Semi-finalists', prize: '$375', icon: Trophy, color: 'text-amber-600' },
    { position: 'Quarter-finalists', prize: '$75', icon: Trophy, color: 'text-blue-400' }
  ];

  const MatchCard = ({ match, round }) => (
    <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
      <div className="text-center mb-3">
        <div className="text-sm font-medium text-primary-400">{round} - Match {match.match}</div>
        <div className="text-xs text-gray-400">{match.date} • {match.time}</div>
      </div>
      
      <div className="space-y-2">
        {/* Team 1 */}
        <div className={`flex items-center justify-between p-2 rounded ${
          match.winner === match.team1.name ? 'bg-green-900/30 border border-green-700' : 'bg-dark-700'
        }`}>
          <div className="flex items-center">
            {match.team1.logo && (
              <img src={match.team1.logo} alt={match.team1.name} className="w-6 h-6 rounded mr-2" />
            )}
            <span className="text-sm font-medium">{match.team1.name}</span>
          </div>
          <div className="text-lg font-bold">
            {match.team1.score !== null ? match.team1.score : '-'}
          </div>
        </div>
        
        {/* VS Divider */}
        <div className="text-center text-xs text-gray-500">VS</div>
        
        {/* Team 2 */}
        <div className={`flex items-center justify-between p-2 rounded ${
          match.winner === match.team2.name ? 'bg-green-900/30 border border-green-700' : 'bg-dark-700'
        }`}>
          <div className="flex items-center">
            {match.team2.logo && (
              <img src={match.team2.logo} alt={match.team2.name} className="w-6 h-6 rounded mr-2" />
            )}
            <span className="text-sm font-medium">{match.team2.name}</span>
          </div>
          <div className="text-lg font-bold">
            {match.team2.score !== null ? match.team2.score : '-'}
          </div>
        </div>
      </div>
      
      {match.winner && (
        <div className="mt-3 text-center">
          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
            Winner: {match.winner}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cup Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Trophy className="mr-3 text-primary-500" size={32} />
                {cup.name}
              </h1>
              <p className="text-xl text-primary-400">{cup.game}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
                <span className="flex items-center">
                  <Users className="mr-1" size={16} />
                  {cup.totalTeams} Teams
                </span>
                <span className="flex items-center">
                  <Calendar className="mr-1" size={16} />
                  {new Date(cup.startDate).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Trophy className="mr-1" size={16} />
                  ${cup.prizePool}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{cup.status}</div>
              <div className="text-gray-400">Current Round</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Bracket */}
          <div className="lg:col-span-3">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Tournament Bracket</h2>
              
              <div className="space-y-8">
                {/* Quarter Finals */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-primary-400">Quarter Finals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bracket.quarterFinals.map((match) => (
                      <MatchCard key={match.match} match={match} round="QF" />
                    ))}
                  </div>
                </div>

                {/* Semi Finals */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-primary-400">Semi Finals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {bracket.semiFinals.map((match) => (
                      <MatchCard key={match.match} match={match} round="SF" />
                    ))}
                  </div>
                </div>

                {/* Final */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-primary-400">Final</h3>
                  <div className="max-w-md mx-auto">
                    <MatchCard match={bracket.final} round="Final" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prize Pool */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Prize Distribution</h2>
              <div className="space-y-3">
                {prizeDistribution.map((prize, index) => {
                  const IconComponent = prize.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IconComponent className={`w-5 h-5 mr-2 ${prize.color}`} />
                        <span className="text-sm">{prize.position}</span>
                      </div>
                      <span className="font-semibold">{prize.prize}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tournament Info */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Tournament Info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Format:</span>
                  <span>Single Elimination</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Teams:</span>
                  <span>{cup.totalTeams}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Prize:</span>
                  <span className="text-primary-400">${cup.prizePool}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform:</span>
                  <span>Mobile</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Region:</span>
                  <span>Africa</span>
                </div>
              </div>
            </div>

            {/* Upcoming Matches */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Next Matches</h2>
              <div className="space-y-3">
                {bracket.quarterFinals
                  .filter(match => !match.winner)
                  .concat(bracket.semiFinals.filter(match => match.team1.name !== 'TBD'))
                  .slice(0, 3)
                  .map((match, index) => (
                    <div key={index} className="bg-dark-800 rounded p-3">
                      <div className="text-xs text-gray-400 mb-1">
                        {match.date} • {match.time}
                      </div>
                      <div className="text-sm font-medium">
                        {match.team1.name} vs {match.team2.name}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Tournament Progress */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Progress</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Quarter Finals</span>
                  <span className="text-primary-400">50% Complete</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full w-1/2"></div>
                </div>
                <div className="text-xs text-gray-400">
                  2 of 4 matches completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
