// src/pages/GuidancePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, User, Users, Trophy, UserCheck, UserSearch, Heart } from 'lucide-react';

// Re-usable guide item component
const GuideItem = ({ icon: Icon, title, children }) => (
  <div className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
    <div className="flex items-center mb-4">
      <Icon className="w-8 h-8 text-primary-500 mr-3" />
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
    <div className="space-y-2 text-gray-300 leading-relaxed">
      {children}
    </div>
  </div>
);

export default function GuidancePage() {
  return (
    <div className="bg-dark-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto py-8 space-y-16">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
             <HelpCircle className="w-10 h-10 mr-3 text-primary-400"/>
             Website Guidance
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your guide to using and managing your profile, teams, and tournaments on Africa Rise Esports.
          </p>
        </div>

        {/* Getting Started */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GuideItem icon={User} title="Your Profile">
              <p>Your profile is your public identity. You can view your own by clicking your name in the header, or view others' by clicking their name anywhere on the site.</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>View your game stats (wins, losses) from tournaments.</li>
                <li>See your recent tournament match results.</li>
                <li>Display your in-game profiles (IGNs/UIDs) for others to see.</li>
                <li>Showcase the teams you are a part of.</li>
              </ul>
              <Link to="/edit-profile" className="btn-secondary btn-sm mt-4 inline-block">Edit Your Profile</Link>
            </GuideItem>
            
            <GuideItem icon={Trophy} title="Finding Tournaments">
              <p>All tournaments are organized by game. To find one:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Navigate to <Link to="/tournaments" className="text-primary-400 hover:underline">Games Hub</Link> from the header.</li>
                <li>Select the game you want to play (e.g., Free Fire, Mobile Legends).</li>
                <li>On the game's hub page, click the "Cups" tab to see all upcoming and past tournaments.</li>
                <li>Click on any tournament to see its details.</li>
              </ul>
            </GuideItem>
          </div>
        </div>

        {/* For Players & Teams */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">For Players & Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GuideItem icon={Users} title="Managing Your Team">
              <p>Only **Team Owners** can manage a team and register for tournaments.</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Go to <Link to="/my-teams" className="text-primary-400 hover:underline">My Teams</Link> in the header to create a team or manage one you own.</li>
                <li>On the "Manage Team" page, you can:</li>
                <li className="pl-4">• Update your team's name, logo, and banner.</li>
                <li className="pl-4">• Send invites to players by typing their exact username.</li>
                <li className="pl-4">• **Accept** or **Decline** pending join requests from players.</li>
                <li className="pl-4">• Change the role of existing members or kick them from the team.</li>
              </ul>
            </GuideItem>
            
            <GuideItem icon={UserCheck} title="Joining a Tournament">
              <p>As a **Team Owner**, you can register your team for a tournament.</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Go to the details page for the tournament you want to join.</li>
                <li>A dropdown menu will show your eligible teams (must be the same game as the tournament).</li>
                <li>Select your team and click "Join Tournament".</li>
                <li>**Important:** You must have **4 or more members** (including yourself) to join.</li>
                <li>**Conflict Check:** The system will block you if any player on your roster is **already registered** in that tournament with another team.</li>
              </ul>
            </GuideItem>

            <GuideItem icon={UserSearch} title="Finding Players & Teams">
              <p>Looking for a team to join, or players to recruit? Use the Player Directory.</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Go to the <Link to="/players" className="text-primary-400 hover:underline">Players</Link> page.</li>
                <li>You can browse all registered players on the platform.</li>
                <li>Click the **"Teams"** tab to see a directory of all created teams.</li>
                <li>Visit a team's page to see their roster and send a request to join.</li>
              </ul>
            </GuideItem>
            
            <GuideItem icon={Heart} title="Liking & Interacting">
              <p>Show support for your favorite players and teams.</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>When viewing another player's **Profile Page**, click the "Like" button to give them a "Like".</li>
                <li>This increases the "Like" count on their profile.</li>
                <li>You can also visit a **Team Page** and click the "Like" button to support the entire team.</li>
                <li>You must be logged in to like a profile or team.</li>
              </ul>
            </GuideItem>
          </div>
        </div>
        
        {/* Removed Tournament Organizer Section */}

      </div>
    </div>
  );
}