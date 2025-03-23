// This file has been refactored to reduce its size
// Many components have been moved to separate files: components.js and card-creator.js
import { Card, CardLibrary, CardModal, CardTemplates } from './components.js';
import { CardCreator } from './card-creator.js';

const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

// Initialize WebsimSocket for multiplayer functionality
const room = new WebsimSocket();

const App = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [userCards, setUserCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Get creator username
  const [creatorUsername, setCreatorUsername] = useState('');
  
  useEffect(() => {
    async function fetchCreator() {
      try {
        const creator = await window.websim.getCreatedBy();
        setCreatorUsername(creator.username);
      } catch (err) {
        console.error("Error fetching creator:", err);
      }
    }
    fetchCreator();
    
    // Load cards from collection
    loadCards();
  }, []);
  
  const loadCards = async () => {
    setLoading(true);
    try {
      // Subscribe to card collection changes
      room.collection('card').subscribe(cards => {
        setUserCards(cards);
        setLoading(false);
      });
    } catch (err) {
      console.error("Error loading cards:", err);
      setError("Failed to load cards");
      setLoading(false);
    }
  };
  
  return (
    <div className="app-container">
      <header>
        <div className="logo">Resident Evil: Deck Building Game</div>
      </header>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`} 
          onClick={() => setActiveTab('create')}
        >
          Create Card
        </button>
        <button 
          className={`tab ${activeTab === 'library' ? 'active' : ''}`} 
          onClick={() => setActiveTab('library')}
        >
          Card Library
        </button>
        <button 
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`} 
          onClick={() => setActiveTab('templates')}
        >
          Card Templates
        </button>
      </div>
      
      {activeTab === 'create' && <CardCreator setUserCards={setUserCards} username={creatorUsername} />}
      {activeTab === 'library' && (
        <CardLibrary 
          cards={userCards} 
          loading={loading} 
          error={error} 
          onCardClick={(card) => {
            setSelectedCard(card);
            setShowModal(true);
          }}
        />
      )}
      {activeTab === 'templates' && <CardTemplates username={creatorUsername} />}
      
      {showModal && (
        <CardModal 
          card={selectedCard} 
          onClose={() => {
            setShowModal(false);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
};

// Render the app
const root = createRoot(document.getElementById('app'));
root.render(<App />);