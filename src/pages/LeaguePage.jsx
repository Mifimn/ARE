
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from 'lucide-react';

export default function LeaguePage() {
  const league = {
    name: 'African FIFA Pro League',
    season: '2024 Season 1',
    game: 'FIFA 24',
    totalRounds: 22,
    currentRound: 15,
    startDate: '2024-01-15',
    endDate: '2024-06-15'
  };

  const standings = [
    {
      position: 1,
      team: 'Thunder Hawks',
      logo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=50&fit=crop',
      played: 14,
      wins: 12,
      draws: 2,
      losses: 0,
      goalsFor: 34,
      goalsAgainst: 8,
      goalDifference: 26,
      points: 38,
      form: ['W', 'W', 'D', 'W', 'W'],
      change: 0
    },
    {
      position: 2,
      team: 'Desert Eagles',
      logo: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=50&h=50&fit=crop',
      played: 14,
      wins: 10,
      draws: 3,
      losses: 1,
      goalsFor: 28,
      goalsAgainst: 12,
      goalDifference: 16,
      points: 33,
      form: ['W', 'D', 'W', 'W', 'L'],
      change: 1
    },
    {
      position: 3,
      team: 'Lion Pride',
      logo: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=50&h=50&fit=crop',
      played: 14,
      wins: 9,
      draws: 4,
      losses: 1,
      goalsFor: 25,
      goalsAgainst: 10,
      goalDifference: 15,
      points: 31,
      form: ['D', 'W', 'W', 'D', 'W'],
      change: -1
    },
    {
      position: 4,
      team: 'Storm Riders',
      logo: 'https://images.unsplash.com/photo-1569517282132-25d22f4573b7?w=50&h=50&fit=crop',
      played: 14,
      wins: 8,
      draws: 4,
      losses: 2,
      goalsFor: 22,
      goalsAgainst: 15,
      goalDifference: 7,
      points: 28,
      form: ['W', 'D', 'L', 'W', 'D'],
      change: 2
    },
    {
      position: 5,
      team: 'Atlas Warriors',
      logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop',
      played: 14,
      wins: 7,
      draws: 5,
      losses: 2,
      goalsFor: 20,
      goalsAgainst: 14,
      goalDifference: 6,
      points: 26,
      form: ['D', 'W', 'D', 'W', 'D'],
      change: -1
    },
    {
      position: 6,
      team: 'Pharaoh Force',
      logo: 'https://images.unsplash.com/photo-1586232702178-f044c5f4d4b7?w=50&h=50&fit=crop',
      played: 14,
      wins: 6,
      draws: 6,
      losses: 2,
      goalsFor: 18,
      goalsAgainst: 16,
      goalDifference: 2,
      points: 24,
      form: ['D', 'D', 'W', 'L', 'D'],
      change: 1
    },
    {
      position: 7,
      team: 'Savanna Kings',
      logo: 'https://images.unsplash.com/photo-1594736797933-d0b22b585e85?w=50&h=50&fit=crop',
      played: 14,
      wins: 5,
      draws: 7,
      losses: 2,
      goalsFor: 17,
      goalsAgainst: 16,
      goalDifference: 1,
      points: 22,
      form: ['D', 'D', 'D', 'W', 'L'],
      change: -2
    },
    {
      position: 8,
      team: 'Nile Sharks',
      logo: 'https://images.unsplash.com/photo-1578320780850-72ec3431e73d?w=50&h=50&fit=crop',
      played: 14,
      wins: 4,
      draws: 6,
      losses: 4,
      goalsFor: 15,
      goalsAgainst: 18,
      goalDifference: -3,
      points: 18,
      form: ['L', 'D', 'W', 'L', 'D'],
      change: 0
    }
  ];

  const topScorers = [
    {
      player: 'Ahmed Hassan',
      team: 'Desert Eagles',
      goals: 12,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    },
    {
      player: 'John Doe',
      team: 'Thunder Hawks',
      goals: 11,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
    },
    {
      player: 'Sipho Mbeki',
      team: 'Lion Pride',
      goals: 9,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face'
    }
  ];

  const upcomingMatches = [
    {
      homeTeam: 'Thunder Hawks',
      awayTeam: 'Desert Eagles',
      date: '2024-02-20',
      time: '18:00',
      round: 16
    },
    {
      homeTeam: 'Lion Pride',
      awayTeam: 'Storm Riders',
      date: '2024-02-21',
      time: '19:00',
      round: 16
    },
    {
      homeTeam: 'Atlas Warriors',
      awayTeam: 'Pharaoh Force',
      date: '2024-02-22',
      time: '20:00',
      round: 16
    }
  ];

  const getFormIcon = (result) => {
    switch (result) {
      case 'W': return <div className="w-6 h-6 bg-green-600 text-white text-xs font-bold rounded flex items-center justify-center">W</div>;
      case 'D': return <div className="w-6 h-6 bg-yellow-600 text-white text-xs font-bold rounded flex items-center justify-center">D</div>;
      case 'L': return <div className="w-6 h-6 bg-red-600 text-white text-xs font-bold rounded flex items-center justify-center">L</div>;
      default: return null;
    }
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return null;
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* League Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Trophy className="mr-3 text-primary-500" size={32} />
                {league.name}
              </h1>
              <p className="text-xl text-primary-400">{league.season}</p>
              <p className="text-gray-400">{league.game}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">Round {league.currentRound}</div>
              <div className="text-gray-400">of {league.totalRounds}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">{standings.length}</div>
              <div className="text-gray-400 text-sm">Teams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{league.currentRound}</div>
              <div className="text-gray-400 text-sm">Rounds Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{standings.reduce((acc, team) => acc + team.played, 0)}</div>
              <div className="text-gray-400 text-sm">Total Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{standings.reduce((acc, team) => acc + team.goalsFor, 0)}</div>
              <div className="text-gray-400 text-sm">Total Goals</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* League Table */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">League Table</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="text-left py-3 px-2">#</th>
                      <th className="text-left py-3 px-2">Team</th>
                      <th className="text-center py-3 px-2">P</th>
                      <th className="text-center py-3 px-2">W</th>
                      <th className="text-center py-3 px-2">D</th>
                      <th className="text-center py-3 px-2">L</th>
                      <th className="text-center py-3 px-2">GF</th>
                      <th className="text-center py-3 px-2">GA</th>
                      <th className="text-center py-3 px-2">GD</th>
                      <th className="text-center py-3 px-2">Pts</th>
                      <th className="text-center py-3 px-2">Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team) => (
                      <tr key={team.position} className="border-b border-dark-800 hover:bg-dark-800">
                        <td className="py-3 px-2">
                          <div className="flex items-center">
                            <span className="w-6 text-center">{team.position}</span>
                            {getPositionIcon(team.position)}
                            {getChangeIcon(team.change)}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center">
                            <img src={team.logo} alt={team.team} className="w-6 h-6 rounded mr-2" />
                            <span className="font-medium">{team.team}</span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-2">{team.played}</td>
                        <td className="text-center py-3 px-2 text-green-400">{team.wins}</td>
                        <td className="text-center py-3 px-2 text-yellow-400">{team.draws}</td>
                        <td className="text-center py-3 px-2 text-red-400">{team.losses}</td>
                        <td className="text-center py-3 px-2">{team.goalsFor}</td>
                        <td className="text-center py-3 px-2">{team.goalsAgainst}</td>
                        <td className={`text-center py-3 px-2 ${team.goalDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                        </td>
                        <td className="text-center py-3 px-2 font-bold">{team.points}</td>
                        <td className="py-3 px-2">
                          <div className="flex space-x-1 justify-center">
                            {team.form.slice(-5).map((result, index) => (
                              <div key={index}>{getFormIcon(result)}</div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Crown className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>Championship</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded mr-1"></div>
                  <span>Continental Cup</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-600 rounded mr-1"></div>
                  <span>Relegation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Top Scorers */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Top Scorers</h2>
              <div className="space-y-3">
                {topScorers.map((scorer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <img src={scorer.avatar} alt={scorer.player} className="w-8 h-8 rounded-full mr-3" />
                      <div>
                        <p className="font-medium text-sm">{scorer.player}</p>
                        <p className="text-xs text-gray-400">{scorer.team}</p>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary-400">{scorer.goals}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Matches */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Upcoming Matches</h2>
              <div className="space-y-4">
                {upcomingMatches.map((match, index) => (
                  <div key={index} className="bg-dark-800 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2">Round {match.round}</div>
                      <div className="font-medium mb-1">{match.homeTeam} vs {match.awayTeam}</div>
                      <div className="text-sm text-primary-400">
                        {new Date(match.date).toLocaleDateString()} • {match.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Season Progress */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Season Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Season Progress</span>
                    <span>{Math.round((league.currentRound / league.totalRounds) * 100)}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${(league.currentRound / league.totalRounds) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <p>Started: {new Date(league.startDate).toLocaleDateString()}</p>
                  <p>Ends: {new Date(league.endDate).toLocaleDateString()}</p>
                  <p>Rounds remaining: {league.totalRounds - league.currentRound}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
