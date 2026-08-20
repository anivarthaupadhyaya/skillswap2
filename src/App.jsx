import { useEffect, useState } from 'react';

function App() {
  const [apiStatus, setApiStatus] = useState('Loading...');
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/skills');
        const data = await response.json();
        setApiStatus(data.message || 'API connected');
        setSkills(data.skills || []);
      } catch (error) {
        setApiStatus('API unavailable in local preview');
        setSkills([
          { name: 'Java', category: 'Backend' },
          { name: 'React', category: 'Frontend' },
          { name: 'Node.js', category: 'API' }
        ]);
      }
    }

    loadData();
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">SkillSwap</div>
        <nav>
          <a href="#">Home</a>
          <a href="#">Skills</a>
          <a href="#">Mentors</a>
          <a href="#">Requests</a>
        </nav>
      </header>

      <main className="container">
        <section className="hero">
          <span className="badge">Vercel-ready</span>
          <h1>Corporate knowledge exchange</h1>
          <p>
            SkillSwap helps teams share, learn, and exchange skills across mentorship and peer learning.
          </p>
          <div className="cta-row">
            <button>Find a mentor</button>
            <button className="secondary">Explore skills</button>
          </div>
        </section>

        <section className="panel">
          <h2>System status</h2>
          <p className="status">{apiStatus}</p>
        </section>

        <section className="skills-grid">
          {skills.map((skill) => (
            <article key={skill.name} className="skill-card">
              <div className="skill-icon">✦</div>
              <h3>{skill.name}</h3>
              <p>{skill.category}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
