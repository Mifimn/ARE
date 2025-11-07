// src/pages/LeaguePage.jsx
// This is now your admin "League Management" page.

import { useState, useEffect, useCallback } from 'react';
import { Trophy, Link as LinkIcon, Plus, Loader2, AlertCircle, Layers } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import AnimatedSection from '../components/AnimatedSection';

// We need this list to be consistent with your CreateTournamentPage
const availableGames = [
    'Free Fire',
    'Mobile Legends',
    'Mobile Legends (Pro League)',
    'Farlight 84',
].sort();

export default function LeaguePage() {
  const { user } = useAuth();
  const [leagues, setLeagues] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [linkedTournaments, setLinkedTournaments] = useState([]);

  const [newLeagueName, setNewLeagueName] = useState('');
  const [newLeagueGame, setNewLeagueGame] = useState(availableGames[0]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // --- UPDATED: Fetch data in two steps ---
  const fetchPageData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Step 1: Fetch Leagues and *all* Tournaments first
      const [leagueRes, tournamentRes] = await Promise.all([
        supabase
          .from('leagues')
          .select('*')
          .eq('organizer_id', user.id),
        supabase
          .from('tournaments')
          .select('id, name, game')
          .eq('organizer_id', user.id)
      ]);

      if (leagueRes.error) throw leagueRes.error;
      if (tournamentRes.error) throw tournamentRes.error;

      const fetchedLeagues = leagueRes.data || [];
      setLeagues(fetchedLeagues);
      setTournaments(tournamentRes.data || []);

      // Step 2: *Now* that we have leagues, fetch their links
      if (fetchedLeagues.length > 0) {
        const leagueIds = fetchedLeagues.map(l => l.id);

        // Fetch league_tournaments and join the tournament name
        const { data: linkedData, error: linkedError } = await supabase
          .from('league_tournaments')
          .select('*, tournaments(id, name)') // Join tournaments table
          .in('league_id', leagueIds); // Use .in() for a valid filter

        if (linkedError) throw linkedError;
        setLinkedTournaments(linkedData || []);
      } else {
        setLinkedTournaments([]); // No leagues, so no links
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]); // Only depends on the user

  useEffect(() => {
    fetchPageData();
  }, [user, fetchPageData]); // Run when user loads

  // Step A: Create the "League" (the folder)
  const handleCreateLeague = async (e) => {
    e.preventDefault();
    if (!newLeagueName || !newLeagueGame) {
      setError('Please provide a name and game.');
      return;
    }
    setFormLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('leagues')
        .insert({
          name: newLeagueName,
          game: newLeagueGame,
          organizer_id: user.id
        })
        .select()
        .single(); // Get the single new league

      if (error) throw error;

      if (data) {
        setLeagues([...leagues, data]); // Add new league to state
        setNewLeagueName('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Step C: Link Tournaments to the League
  const handleLinkTournament = async (leagueId, tournamentId, stageName, stageOrder) => {
    if (!tournamentId) {
        alert('Please select a tournament to link.');
        return;
    }
    setFormLoading(true); // Use form loader for this action
    try {
        const { error } = await supabase
            .from('league_tournaments')
            .upsert({
                league_id: leagueId,
                stage_order: stageOrder, // The unique key
                tournament_id: tournamentId,
                stage_name: stageName
            }, { onConflict: 'league_id, stage_order' }); // Update if it already exists

        if (error) throw error;

        // --- UPDATED: Refresh all data to get the new links ---
        await fetchPageData(); 
    } catch (err) {
        setError(err.message);
    } finally {
        setFormLoading(false);
    }
  };

  // Helper component for the league linking UI
  const LeagueLinker = ({ league }) => {

    // --- FIX: DEFINITION MUST COME BEFORE USESTATE CALLS ---
    // Find the *full linked tournament object* for each stage
    const getLinkedTournament = (order) => {
        return linkedTournaments.find(lt => lt.league_id === league.id && lt.stage_order === order);
    };

    // --- LOCAL STATE HOOKS (USE) getLinkedTournament for initialization ---
    const [s1, setS1] = useState(getLinkedTournament(1)?.tournament_id || '');
    const [s2, setS2] = useState(getLinkedTournament(2)?.tournament_id || '');
    const [s3, setS3] = useState(getLinkedTournament(3)?.tournament_id || '');
    const [cup, setCup] = useState(getLinkedTournament(4)?.tournament_id || '');
    // --- END FIX ---


    // Collect all tournaments created by the organizer that are ML-related for filtering
    const mlTournaments = tournaments.filter(t => 
        t.game === 'Mobile Legends (Pro League)' || t.game === 'Mobile Legends'
    );

    const renderDropdown = (value, setValue, stageName, stageOrder) => {
        const linked = getLinkedTournament(stageOrder);
        const isLinked = !!linked;

        let filteredTournaments = [];

        // --- FILTERING LOGIC ---
        if (league.game === 'Mobile Legends (Pro League)') {
            if (stageOrder <= 3) {
                // S1, S2, S3 must be the Pro League format
                filteredTournaments = mlTournaments.filter(t => t.game === 'Mobile Legends (Pro League)');
            } else if (stageOrder === 4) {
                // MASC Cup must be the Standard Mobile Legends format
                filteredTournaments = mlTournaments.filter(t => t.game === 'Mobile Legends');
            }
        } else {
            // For all other leagues (Free Fire, Farlight 84, etc.)
            filteredTournaments = tournaments.filter(t => t.game === league.game);
        }
        // --- END FILTERING LOGIC ---

        return (
            <div className="flex items-center gap-2">
                <label className="w-24 font-semibold text-gray-400">{stageName}:</label>
                <select
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="input-field flex-1 text-sm"
                >
                    <option value="">Select Tournament...</option>
                    {/* Show the currently linked tournament even if it's not in the list */}
                    {isLinked && !filteredTournaments.some(t => t.id === linked.tournament_id) && (
                        <option value={linked.tournament_id}>{linked.tournaments.name} (Linked)</option>
                    )}
                    {filteredTournaments.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
                <button
                    onClick={() => handleLinkTournament(league.id, value, stageName, stageOrder)}
                    className={`btn-secondary btn-xs flex-shrink-0 ${isLinked ? 'bg-primary-600 hover:bg-primary-700 text-white' : ''}`}
                    disabled={!value || formLoading}
                >
                    <LinkIcon size={14} className="mr-1" /> {isLinked ? 'Update' : 'Link'}
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-3 p-4 bg-dark-700/50 rounded-lg border border-dark-600">
            {renderDropdown(s1, setS1, 'Season 1', 1)}
            {renderDropdown(s2, setS2, 'Season 2', 2)}
            {renderDropdown(s3, setS3, 'Season 3', 3)}
            {renderDropdown(cup, setCup, 'MASC Cup', 4)}
        </div>
    );
  };


  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <AnimatedSection>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Layers className="mr-3 text-primary-500" size={32} />
            League Management
          </h1>
          <p className="text-gray-400">
            Create leagues and link your tournaments together to enable seasons and seeding.
          </p>
        </AnimatedSection>

        {/* Create New League Form */}
        <AnimatedSection delay={100}>
            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Step A: Create New League</h2>
                <form onSubmit={handleCreateLeague} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">League Name</label>
                            <input
                                type="text"
                                value={newLeagueName}
                                onChange={(e) => setNewLeagueName(e.target.value)}
                                className="input-field w-full"
                                placeholder="e.g., AML 2025"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Game</label>
                            <select
                                value={newLeagueGame}
                                onChange={(e) => setNewLeagueGame(e.target.value)}
                                className="input-field w-full appearance-none"
                                required
                            >
                                {availableGames.map(game => (
                                    <option key={game} value={game}>{game}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="btn-primary flex items-center" disabled={formLoading || loading}>
                            {formLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Plus size={16} className="mr-2" />}
                            Create League
                        </button>
                    </div>
                </form>
            </div>
        </AnimatedSection>

        {/* Error Display */}
        {error && (
            <AnimatedSection delay={200}>
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-sm text-red-300 flex items-center">
                    <AlertCircle size={18} className="mr-2" />
                    <strong>Error:</strong> {error}
                </div>
            </AnimatedSection>
        )}

        {/* Your Leagues List */}
        <AnimatedSection delay={300}>
            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Step C: Link Tournaments</h2>
                <p className="text-gray-400 mb-6 text-sm">
                    First, create your tournaments in the "Create Tournament" page. Then, link them here.
                </p>
                {loading && !formLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader2 size={32} className="animate-spin text-primary-500" />
                    </div>
                ) : leagues.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">You have not created any leagues yet.</p>
                ) : (
                    <div className="space-y-6">
                        {leagues.map(league => (
                            <div key={league.id} className="p-4 bg-dark-800 rounded-lg border border-dark-700">
                                <h3 className="text-xl font-semibold text-primary-400 mb-3">{league.name}</h3>
                                <p className="text-sm text-gray-400 mb-4 -mt-2">{league.game}</p>
                                <LeagueLinker league={league} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AnimatedSection>
      </div>
    </div>
  );
}