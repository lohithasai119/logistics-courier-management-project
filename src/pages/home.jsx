import { Link } from "react-router-dom";
import { getUser } from "../Services/auth";

function Home() {
  const user = getUser();

  return (
    <div className="home-page">

      {/* Hero Section */}

      <section className="hero">

        <div className="hero-content">

          <span className="hero-tag">
            FAST. SIMPLE. RELIABLE.
          </span>

          <h1>
            Welcome to
            <br />
            <span>LogiTrack</span>
          </h1>

          <p>
            Your simple and reliable logistics and courier
            management system for managing shipments,
            tracking deliveries and organizing courier operations.
          </p>

          <div className="hero-buttons">

            <Link
              to="/shipments"
              className="btn btn-primary hero-btn"
            >
              {user?.role === "admin" ? "📦 All Shipments" : "📦 My Shipments"}
            </Link>

            <Link
              to="/track"
              className="btn btn-secondary hero-btn"
            >
              🔍 Track Shipment
            </Link>

            {!user && (
              <>
                <Link
                  to="/login"
                  className="btn btn-info hero-btn"
                >
                  🔐 Login
                </Link>

                <Link
                  to="/signup"
                  className="btn btn-secondary hero-btn"
                >
                  📝 Signup
                </Link>
              </>
            )}

            {user && (
              <Link
                to="/dashboard"
                className="btn btn-info hero-btn"
              >
                📊 Dashboard
              </Link>
            )}

          </div>

        </div>


        <div className="hero-image">
          🚚
        </div>

      </section>


      {/* Features Section */}

      <section className="features">

        <h2>
          Our Features
        </h2>

        <p className="features-subtitle">
          Everything you need to manage shipments and
          courier deliveries easily.
        </p>


        <div className="feature-grid">


          {/* Shipment Management */}

          <div className="feature-card">

            <div className="feature-icon">
              📦
            </div>

            <h3>
              Shipment Management
            </h3>

            <p>
              Create, view and manage shipment
              information easily from one place.
            </p>

          </div>


          {/* Shipment Tracking */}

          <div className="feature-card">

            <div className="feature-icon cart-icon">
              🔍
            </div>

            <h3>
              Shipment Tracking
            </h3>

            <p>
              Search and track shipments using
              tracking ID, sender or receiver details.
            </p>

          </div>


          {/* Courier Management */}

          <div className="feature-card">

            <div className="feature-icon payment-icon">
              🚚
            </div>

            <h3>
              Courier Management
            </h3>

            <p>
              Manage courier information and
              monitor delivery progress efficiently.
            </p>

          </div>


          {/* Priority Shipments */}

          <div className="feature-card">

            <div className="feature-icon order-icon">
              ⚡
            </div>

            <h3>
              Priority Shipments
            </h3>

            <p>
              Quickly identify high-priority
              shipments that need faster attention.
            </p>

          </div>


          {/* Dashboard */}

          <div className="feature-card">

            <div className="feature-icon secure-icon">
              📊
            </div>

            <h3>
              Smart Dashboard
            </h3>

            <p>
              View total, pending, delivered and
              in-transit shipment statistics.
            </p>

          </div>


          {/* Route Management */}

          <div className="feature-card">

            <div className="feature-icon">
              🗺️
            </div>

            <h3>
              Route Management
            </h3>

            <p>
              Manage shipment origins, destinations
              and delivery routes easily.
            </p>

          </div>


        </div>

      </section>


      {/* Roles Section */}

      <section className="roles-section">

        <h2>Two Roles, One System</h2>

        <p className="features-subtitle">
          Everyone sees exactly what they need.
        </p>

        <div className="roles-grid">

          <div className="role-card admin">
            <h3>🛡️ Admin</h3>
            <ul>
              <li>View and manage all shipments</li>
              <li>Update delivery status</li>
              <li>Create shipments for any customer</li>
              <li>Manage users, promote or remove</li>
            </ul>
          </div>

          <div className="role-card user">
            <h3>👤 User</h3>
            <ul>
              <li>Sign up and log in</li>
              <li>Book new shipments</li>
              <li>See only their own shipments</li>
              <li>Edit or cancel while Pending</li>
            </ul>
          </div>

        </div>

      </section>


      {/* About Section */}

      <section className="about-section">

        <div className="about-content">

          <span className="hero-tag">
            ABOUT LOGITRACK
          </span>

          <h2>
            Manage Your Deliveries
            <br />
            With Ease
          </h2>

          <p>
            LogiTrack helps businesses organize their
            courier operations in one place. Users can
            manage shipments, search tracking information,
            monitor delivery status and identify priority
            shipments.
          </p>

          <Link
            to="/dashboard"
            className="btn btn-primary"
          >
            📊 Go to Dashboard
          </Link>

        </div>

        <div className="about-image">
          📦 🚚 🗺️
        </div>

      </section>


      {/* Footer */}

      <footer className="home-footer">

        <h3>
          🚚 LogiTrack
        </h3>

        <p>
          Track. Manage. Deliver.
        </p>

        <p>
          © 2026 LogiTrack. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default Home;