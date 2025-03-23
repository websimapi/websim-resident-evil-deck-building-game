import { config } from './config.js';

const { useState, useEffect } = React;

// Card component extracted from app.js
export const Card = ({ card }) => {
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

// CardLibrary component extracted from app.js
export const CardLibrary = ({ cards, loading, error, onCardClick }) => {
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
  
  if (!cards || cards.length === 0) {
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

// CardModal component extracted from app.js
export const CardModal = ({ card, onClose }) => {
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

// CardTemplates component extracted from app.js
export const CardTemplates = ({ username }) => {
  const [templates, setTemplates] = useState([]); 
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Import templates dynamically to avoid circular imports
    import('./cardData.js').then(module => {
      setTemplates(module.getAllCardTemplates());
      setLoading(false);
    });
  }, []);
  
  const useTemplate = async (template) => {
    setSelectedTemplate(template);
  };
  
  if (loading) {
    return (
      <div className="loading">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <p>Loading templates...</p>
      </div>
    );
  }
  
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
                  const room = new WebsimSocket();
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