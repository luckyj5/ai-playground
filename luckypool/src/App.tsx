import { Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import Players from './pages/Players';
import PlayerDetail from './pages/PlayerDetail';
import Venues from './pages/Venues';
import TournamentBuilder from './pages/TournamentBuilder';
import Leaderboard from './pages/Leaderboard';
import Play from './pages/Play';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 animate-fade-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournaments/:id" element={<TournamentDetail />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/builder" element={<TournamentBuilder />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/play" element={<Play />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
