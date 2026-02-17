import HeroTitle from './HeroTitle';
import ApplicationDashboard from './ApplicationDashboard';
import LiveJobUpdates from './LiveJobUpdates';
import ModernNavbar from './ModernNavbar';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <ModernNavbar />
      
      {/* Hero Section */}
      <section className="hero-section" id="hero">
        <HeroTitle />
      </section>

      {/* Dashboard Section */}
      <section className="dashboard-section" id="dashboard">
        <ApplicationDashboard />
      </section>

      {/* Jobs Section */}
      <section className="jobs-section" id="jobs">
        <LiveJobUpdates />
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">TI</div>
            <h3>Tensed Intern</h3>
            <p>Your career companion</p>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#updates">Updates</a>
            </div>

            <div className="link-group">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#contact">Contact Us</a>
              <a href="#faq">FAQ</a>
            </div>

            <div className="link-group">
              <h4>Legal</h4>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#cookies">Cookies</a>
            </div>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#twitter" className="social-icon">𝕏</a>
              <a href="#linkedin" className="social-icon">in</a>
              <a href="#github" className="social-icon">◎</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Tensed Intern. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
