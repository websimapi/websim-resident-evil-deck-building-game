import { config } from './config.js';
import { getAllCardTemplates } from './cardData.js';

const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;

// Initialize WebsimSocket for multiplayer functionality
const room = new WebsimSocket();

const App = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [userCards, setUserCards] = useState([]);
  const [loading, setLoading] = useState(false);
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
      // Get cards from the collection
      const cards = room.collection('card').getList();
      setUserCards(cards);
    } catch (err) {
      console.error("Error loading cards:", err);
      setError("Failed to load cards");
    } finally {
      setLoading(false);
    }
  };
  
  // Subscribe to card collection changes
  useEffect(() => {
    const unsubscribe = room.collection('card').subscribe(cards => {
      setUserCards(cards);
    });
    
    return () => unsubscribe();
  }, []);
  
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

const CardCreator = ({ setUserCards, username }) => {
  const initialCardState = {
    name: '',
    type: 'Character',
    rarity: 'Common',
    set: 'Custom',
    health: 0,
    damage: 0,
    cost: 0,
    ammo: 0,
    description: '',
    imageUrl: '',
    createdBy: username
  };
  
  const [card, setCard] = useState(initialCardState);
  const [generating, setGenerating] = useState({ description: false, image: false });
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (['health', 'damage', 'cost', 'ammo'].includes(name)) {
      // Ensure values don't exceed max for the stat
      const maxValue = config.maxStats[name] || 100;
      setCard({
        ...card,
        [name]: Math.min(parseInt(value) || 0, maxValue)
      });
    } else {
      setCard({
        ...card,
        [name]: value
      });
    }
  };
  
  const generateDescription = async () => {
    if (!card.name || !card.type) {
      setError("Please enter a name and select a type first");
      return;
    }
    
    setGenerating({ ...generating, description: true });
    setError('');
    
    try {
      const promptTemplate = config.descriptionPrompts[card.type];
      const prompt = promptTemplate.replace('{name}', card.name);
      
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert in Resident Evil lore and card game design. Create concise, accurate and thematic card descriptions."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });
      
      // Update card with generated description
      setCard({
        ...card,
        description: completion.content.trim()
      });
    } catch (err) {
      console.error("Error generating description:", err);
      setError("Failed to generate description");
    } finally {
      setGenerating({ ...generating, description: false });
    }
  };
  
  const generateImage = async () => {
    if (!card.name || !card.type) {
      setError("Please enter a name and select a type first");
      return;
    }
    
    setGenerating({ ...generating, image: true });
    setError('');
    
    try {
      const promptTemplate = config.imagePrompts[card.type];
      const prompt = promptTemplate.replace('{name}', card.name);
      
      const result = await websim.imageGen({
        prompt: prompt,
        aspect_ratio: "3:4",
      });
      
      // Update card with generated image URL
      setCard({
        ...card,
        imageUrl: result.url
      });
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Failed to generate image");
    } finally {
      setGenerating({ ...generating, image: false });
    }
  };
  
  const saveCard = async () => {
    if (!card.name) {
      setError("Please enter a card name");
      return;
    }
    
    if (!card.description) {
      setError("Please enter or generate a description");
      return;
    }
    
    if (!card.imageUrl) {
      setError("Please generate an image");
      return;
    }
    
    try {
      // Save card to database
      await room.collection('card').create({
        ...card,
        createdAt: new Date().toISOString()
      });
      
      // Reset form
      setCard(initialCardState);
      setError('');
    } catch (err) {
      console.error("Error saving card:", err);
      setError("Failed to save card");
    }
  };
  
  return (
    <div className="card-creator">
      <div className="card-form">
        <h2>Create New Card</h2>
        
        <div className="form-group">
          <label htmlFor="name">Card Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={card.name} 
            onChange={handleChange}
            placeholder="Enter card name" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="type">Card Type</label>
          <select id="type" name="type" value={card.type} onChange={handleChange}>
            {config.cardTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="rarity">Rarity</label>
          <select id="rarity" name="rarity" value={card.rarity} onChange={handleChange}>
            {config.rarities.map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="set">Set</label>
          <select id="set" name="set" value={card.set} onChange={handleChange}>
            {config.sets.map(set => (
              <option key={set} value={set}>{set}</option>
            ))}
          </select>
        </div>
        
        {(card.type === 'Character' || card.type === 'Infected') && (
          <div className="form-group">
            <label htmlFor="health">Health</label>
            <input 
              type="number" 
              id="health" 
              name="health" 
              value={card.health} 
              onChange={handleChange}
              min="0" 
              max={config.maxStats.health}
            />
          </div>
        )}
        
        {(card.type === 'Character' || card.type === 'Weapon' || card.type === 'Infected') && (
          <div className="form-group">
            <label htmlFor="damage">Damage</label>
            <input 
              type="number" 
              id="damage" 
              name="damage" 
              value={card.damage} 
              onChange={handleChange}
              min="0" 
              max={config.maxStats.damage}
            />
          </div>
        )}
        
        {(card.type !== 'Character' && card.type !== 'Infected') && (
          <div className="form-group">
            <label htmlFor="cost">Cost</label>
            <input 
              type="number" 
              id="cost" 
              name="cost" 
              value={card.cost} 
              onChange={handleChange}
              min="0" 
              max={config.maxStats.cost}
            />
          </div>
        )}
        
        {(card.type === 'Weapon' || card.type === 'Ammo') && (
          <div className="form-group">
            <label htmlFor="ammo">Ammo</label>
            <input 
              type="number" 
              id="ammo" 
              name="ammo" 
              value={card.ammo} 
              onChange={handleChange}
              min="0" 
              max={config.maxStats.ammo}
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            name="description" 
            value={card.description} 
            onChange={handleChange}
            placeholder="Enter card description or generate one" 
          />
          <button 
            type="button" 
            onClick={generateDescription}
            disabled={generating.description}
          >
            {generating.description ? 'Generating...' : 'Generate Description'}
          </button>
        </div>
        
        <div className="form-group">
          <label>Card Image</label>
          {card.imageUrl ? (
            <div className="image-preview">
              <img src={card.imageUrl} alt="Card" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>
          ) : (
            <div style={{ height: '100px', background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              No image generated
            </div>
          )}
          <button 
            type="button" 
            onClick={generateImage}
            disabled={generating.image}
          >
            {generating.image ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <button type="button" onClick={saveCard}>Save Card</button>
      </div>
      
      <div className="card-preview">
        <h2>Card Preview</h2>
        <Card card={card} />
      </div>
    </div>
  );
};

const Card = ({ card }) => {
  return (
    <div className="card">
      <div className="card-front">
        <div className="card-header">
          <div className="card-name">{card.name || 'Card Name'}</div>
          <div className="card-type">{card.type || 'Type'}</div>
        </div>
        
        <div className="card-image">
          {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.name} />
          ) : (
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          )}
        </div>
        
        <div className="card-stats">
          {card.type === 'Character' || card.type === 'Infected' ? (
            <span>❤️ {card.health || 0}</span>
          ) : (
            <span>💰 {card.cost || 0}</span>
          )}
          
          {(card.type === 'Character' || card.type === 'Weapon' || card.type === 'Infected') && (
            <span>⚔️ {card.damage || 0}</span>
          )}
          
          {(card.type === 'Weapon' || card.type === 'Ammo') && (
            <span>🔫 {card.ammo || 0}</span>
          )}
          
          {card.rarity && (
            <span>🌟 {card.rarity}</span>
          )}
        </div>
        
        <div className="card-description">
          {card.description || 'Card description will appear here.'}
        </div>
      </div>
    </div>
  );
};

const CardLibrary = ({ cards, loading, error, onCardClick }) => {
  if (loading) {
    return (
      <div className="loading">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <p>Loading cards...</p>
      </div>
    );
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (cards.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No cards created yet. Go to the Create Card tab to add some!</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2>Your Card Collection</h2>
      <div className="card-library">
        {cards.map(card => (
          <div 
            key={card.id} 
            className="library-card"
            onClick={() => onCardClick(card)}
          >
            <Card card={card} />
          </div>
        ))}
      </div>
    </div>
  );
};

const CardTemplates = ({ username }) => {
  const [templates, setTemplates] = useState(getAllCardTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [error, setError] = useState('');
  
  const useTemplate = async (template) => {
    setSelectedTemplate(template);
    // You can add more functionality here if needed
  };
  
  return (
    <div>
      <h2>Card Templates</h2>
      <p>Use these templates to quickly create new cards:</p>
      
      <div className="card-library">
        {templates.map((template, index) => (
          <div 
            key={index} 
            className="library-card"
            onClick={() => useTemplate(template)}
          >
            <Card card={template} />
          </div>
        ))}
      </div>
      
      {selectedTemplate && (
        <div className="modal-backdrop" onClick={() => setSelectedTemplate(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Use Template: {selectedTemplate.name}</h3>
              <button className="modal-close" onClick={() => setSelectedTemplate(null)}>×</button>
            </div>
            <p>This will create a new card based on this template.</p>
            <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center' }}>
              <Card card={selectedTemplate} />
            </div>
            <button 
              onClick={async () => {
                try {
                  // Generate image for template
                  const promptTemplate = config.imagePrompts[selectedTemplate.type];
                  const prompt = promptTemplate.replace('{name}', selectedTemplate.name);
                  
                  const result = await websim.imageGen({
                    prompt: prompt,
                    aspect_ratio: "3:4",
                  });
                  
                  // Save card to database with generated image
                  await room.collection('card').create({
                    ...selectedTemplate,
                    imageUrl: result.url,
                    createdBy: username,
                    createdAt: new Date().toISOString()
                  });
                  
                  setSelectedTemplate(null);
                } catch (err) {
                  console.error("Error using template:", err);
                  setError("Failed to create card from template");
                }
              }}
            >
              Create Card from Template
            </button>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

const CardModal = ({ card, onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{card.name}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center' }}>
          <Card card={card} />
        </div>
        <div>
          <p><strong>Created by:</strong> {card.createdBy}</p>
          <p><strong>Set:</strong> {card.set}</p>
          <p><strong>Type:</strong> {card.type}</p>
          <p><strong>Rarity:</strong> {card.rarity}</p>
        </div>
      </div>
    </div>
  );
};

// Render the app
const root = createRoot(document.getElementById('app'));
root.render(<App />);

