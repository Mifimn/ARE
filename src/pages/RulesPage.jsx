// src/pages/RulesPage.jsx

import { Link } from 'react-router-dom'; // Added Link import
import { Shield, AlertTriangle, CheckCircle, Users, Trophy, Gavel } from 'lucide-react';
// import AnimatedSection from '../components/AnimatedSection'; // Removed broken component

export default function RulesPage() {
  const codeOfConduct = [
    {
      title: 'Respect and Sportsmanship',
      description: 'Treat all players, officials, and community members with respect. Unsportsmanlike conduct will result in immediate disqualification.',
      icon: Users
    },
    {
      title: 'Fair Play',
      description: 'No cheating, exploiting, or use of unauthorized software. Play with integrity and honor.',
      icon: Shield
    },
    {
      title: 'Communication Standards',
      description: 'Keep all communication appropriate. No harassment, hate speech, or offensive language.',
      icon: CheckCircle
    },
    {
      title: 'Account Responsibility',
      description: 'You are responsible for your account security. Account sharing is strictly prohibited.',
      icon: Gavel
    }
  ];

  // --- *** UPDATED GAME RULES *** ---
  const tournamentRules = [
    {
      game: 'Free Fire',
      rules: [
        'Game Mode: Battle Royale (BR).',
        'Squad Size: 4 players (Squads).',
        'Maps: Bermuda, Purgatory, Kalahari (rotated by admins).',
        'Scoring: Standard points system (Placement + Kills).',
        'No hacks, emulators, exploits, or teaming.'
      ]
    },
    {
      game: 'Farlight 84',
      rules: [
        'Game Mode: Battle Royale (Hunt).',
        'Squad Size: 4 players (Squads).',
        'Maps: Sunset City, Lampton (rotated by admins).',
        'Scoring: Standard BR points system (Placement + Kills).',
        'All heroes and vehicles are permitted.'
      ]
    },
    {
      game: 'Mobile Legends',
      rules: [
        'Game Mode: 5v5 Draft Pick.',
        'Map: Land of Dawn.',
        'Format: Best of 3 (Bo3) for standard matches, Best of 5 (Bo5) for Finals.',
        'No skins with significant visual advantages (e.g., recall animation bugs).',
        'Pauses limited to 5 minutes per team for technical issues.'
      ]
    },
    {
      game: 'COD Warzone',
      rules: [
        'Game Mode: Battle Royale (Quads or Trios as specified).',
        'Maps: Urzikstan, Vondel (as specified).',
        'Custom lobbies will be used.',
        'All loadouts are permitted. No exploits or "glitch" spots.',
        'Stream delay required for live matches if streaming.'
      ]
    },
    {
      game: 'Bloodstrike',
      rules: [
        'Game Mode: Squad Fight or Battle Royale (as specified).',
        'Squad Size: 4 players.',
        'All Strikers and weapons are permitted.',
        'Scoring: Based on match placement and total squad eliminations.',
        'Use of third-party software or crosshairs is strictly forbidden.'
      ]
    }
  ];
  // --- *** END UPDATE *** ---

  const violations = [
    {
      severity: 'Minor',
      examples: ['Late arrival (under 15 minutes)', 'Minor technical issues', 'First-time chat violations'],
      penalty: 'Warning or round penalty',
      color: 'text-yellow-400'
    },
    {
      severity: 'Major',
      examples: ['Unsportsmanlike conduct', 'Repeated minor violations', 'Disconnecting during matches'],
      penalty: 'Match forfeiture or tournament suspension',
      color: 'text-orange-400'
    },
    {
      severity: 'Severe',
      examples: ['Cheating or exploiting', 'Harassment or hate speech', 'Account sharing'],
      penalty: 'Immediate disqualification and platform ban',
      color: 'text-red-400'
    }
  ];

  return (
    // Padding is handled by the LayoutWrapper in App.jsx
    <div className="bg-dark-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto py-8 space-y-16">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rules & Regulations</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Fair play and respect are the foundations of our community. Please read and understand 
            all rules before participating in tournaments.
          </p>
        </div>

        {/* Code of Conduct */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center">
            <Shield className="mr-3 text-primary-500" size={32} />
            Code of Conduct
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {codeOfConduct.map((rule, index) => {
              const Icon = rule.icon;
              return (
                <div 
                  key={index}
                  className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700"
                >
                  <div className="flex items-center mb-4">
                    <Icon className="w-6 h-6 text-primary-500 mr-3" />
                    <h3 className="text-xl font-semibold">{rule.title}</h3>
                  </div>
                  <p className="text-gray-300">{rule.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tournament Rules by Game */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center">
            <Trophy className="mr-3 text-primary-500" size={32} />
            Tournament Rules by Game
          </h2>
          <div className="space-y-8">
            {tournamentRules.map((gameRules, index) => (
              <div 
                key={index}
                className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700"
              >
                <h3 className="text-2xl font-bold mb-4 text-primary-400">{gameRules.game}</h3>
                <ul className="space-y-2">
                  {gameRules.rules.map((rule, ruleIndex) => (
                    <li key={ruleIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* General Tournament Rules */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">General Tournament Rules</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
              <h3 className="text-xl font-semibold mb-4">Registration & Eligibility</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Must be 13 years or older to participate</li>
                <li>• Valid email address required for registration</li>
                <li>• One account per person - no multiple accounts</li>
                <li>• Must be available for entire tournament duration</li>
                <li>• Registration closes 24 hours before tournament start</li>
              </ul>
            </div>
            
            <div className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
              <h3 className="text-xl font-semibold mb-4">Match Procedures</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Players must check in 15 minutes before match time</li>
                <li>• Matches must start within 15 minutes of scheduled time</li>
                <li>• No-shows result in automatic forfeiture</li>
                <li>• Technical issues must be reported immediately</li>
                <li>• Match results must be reported by both players</li>
              </ul>
            </div>
            
            <div className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
              <h3 className="text-xl font-semibold mb-4">Prize Distribution</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Prizes awarded within 7 days of tournament completion</li>
                <li>• Valid identification required for prize collection</li>
                <li>• Prizes are non-transferable</li>
                <li>• Tax responsibilities belong to prize recipients</li>
                <li>• Disqualified players forfeit all prize eligibility</li>
              </ul>
            </div>
            
            <div className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
              <h3 className="text-xl font-semibold mb-4">Appeals Process</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Appeals must be submitted within 24 hours</li>
                <li>• Provide detailed explanation and evidence</li>
                <li>• Appeals reviewed by tournament officials</li>
                <li>• Final decisions made within 48 hours</li>
                <li>• Tournament organizer decisions are final</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Violations and Penalties */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center">
            <AlertTriangle className="mr-3 text-primary-500" size={32} />
            Violations & Penalties
          </h2>
          <div className="space-y-6">
            {violations.map((violation, index) => (
              <div 
                key={index}
                className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700"
              >
                <div className="flex items-center mb-4">
                  <h3 className={`text-xl font-semibold ${violation.color}`}>
                    {violation.severity} Violations
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-gray-300">Examples:</h4>
                    <ul className="text-gray-400 text-sm space-y-1">
                      {violation.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-gray-300">Typical Penalty:</h4>
                    <p className={`text-sm ${violation.color}`}>{violation.penalty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact for Questions */}
        <div className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About Rules?</h2>
          <p className="text-gray-300 mb-6">
            If you have any questions about our rules or need clarification on any policy, 
            don't hesitate to reach out to our support team.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="btn-primary">Contact Support</Link>
            {/* <button className="btn-secondary">View FAQ</button> */}
          </div>
        </div>
      </div>
    </div>
  );
}