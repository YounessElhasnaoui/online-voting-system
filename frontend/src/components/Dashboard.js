import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    allowedSelections: 1,
    selectionType: 'strict',
    endTime: '',
  });
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  // Vérifier si le token est présent
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login'); // Rediriger vers la page de connexion si non authentifié
    } else {
      fetchProfile();
      loadPolls(currentPage);
    }
  }, [navigate, currentPage]);

  // Fonction pour récupérer le profil utilisateur
  const fetchProfile = () => {
    const token = localStorage.getItem('authToken');
    fetch('http://localhost:5000/api/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.data);
        } else {
          throw new Error(data.message);
        }
      })
      .catch((err) => setError(err.message));
  };

  // Fonction pour récupérer les sondages
  const loadPolls = (page = 1) => {
    const token = localStorage.getItem('authToken');
    setLoading(true);
    setError('');

    fetch(`http://localhost:5000/api/polls?limit=10&page=${page}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPolls(data.data);
          setTotalPages(Math.ceil(data.total / 10));
        } else {
          throw new Error(data.message);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Fonction pour créer un sondage
  const createPoll = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    fetch('http://localhost:5000/api/polls', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPoll),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setNewPoll({
            question: '',
            options: ['', ''],
            allowedSelections: 1,
            selectionType: 'strict',
            endTime: '',
          });
          loadPolls(currentPage); // Rafraîchir la liste des sondages
        } else {
          throw new Error(data.message);
        }
      })
      .catch((err) => setError(err.message));
  };

  // Gestion des pages
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Ajout d'options pour un nouveau sondage
  const addOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  const updateOption = (index, value) => {
    const options = [...newPoll.options];
    options[index] = value;
    setNewPoll({ ...newPoll, options });
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f4f4f4',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Dashboard</h1>

      {/* Section Profil */}
      {profile && (
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
        }}>
          <h2 style={{ color: '#444' }}>Profile</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div style={{
          color: 'red',
          backgroundColor: '#ffe6e6',
          padding: '10px',
          border: '1px solid red',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {/* Section Création de sondage */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
      }}>
        <h2 style={{ color: '#444', marginBottom: '10px' }}>Create a New Poll</h2>
        <form onSubmit={createPoll}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              color: '#555',
              marginBottom: '5px',
              fontWeight: 'bold',
            }}>Question:</label>
            <input
              type="text"
              value={newPoll.question}
              onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px',
                marginTop: '5px',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              color: '#555',
              marginBottom: '5px',
              fontWeight: 'bold',
            }}>Options:</label>
            {newPoll.options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  marginTop: '5px',
                  marginBottom: '5px',
                }}
              />
            ))}
            <button type="button" onClick={addOption} style={{
              backgroundColor: '#007BFF',
              color: '#fff',
              padding: '10px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '10px',
              width: '100%',
            }}>
              Add Option
            </button>
          </div>
          <div>
            {/* Other form fields follow similar structure */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
