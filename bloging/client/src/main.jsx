import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState("");
  const [authMode, setAuthMode] = useState("register");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authResult, setAuthResult] = useState(null);
  const [authError, setAuthError] = useState("");
  const [blogForm, setBlogForm] = useState({ title: "", content: "" });
  const [blogs, setBlogs] = useState([]);
  const [blogError, setBlogError] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);

  const user = authResult?.user;

  const statusText = useMemo(() => {
    if (healthError) return "Backend offline";
    if (!health) return "Checking backend";
    return "Backend online";
  }, [health, healthError]);

  async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with ${response.status}`);
    }

    return data;
  }

  async function checkHealth() {
    setHealthError("");

    try {
      const data = await request("/health");
      setHealth(data);
    } catch (error) {
      setHealth(null);
      setHealthError(error.message);
    }
  }

  async function loadBlogs() {
    setBlogError("");

    try {
      const data = await request("/blogs");
      setBlogs(data.blogs || []);
    } catch (error) {
      setBlogError(error.message);
    }
  }

  useEffect(() => {
    checkHealth();
    loadBlogs();
  }, []);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError("");
    setAuthResult(null);
    setIsSubmittingAuth(true);

    try {
      const payload =
        authMode === "register"
          ? authForm
          : { email: authForm.email, password: authForm.password };
      const data = await request(`/auth/${authMode}`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setAuthResult(data);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  async function handleBlogSubmit(event) {
    event.preventDefault();
    setBlogError("");
    setIsSubmittingBlog(true);

    try {
      await request("/blogs", {
        method: "POST",
        body: JSON.stringify({
          ...blogForm,
          authorId: user?.id ? String(user.id) : undefined
        })
      });
      setBlogForm({ title: "", content: "" });
      await loadBlogs();
    } catch (error) {
      setBlogError(error.message);
    } finally {
      setIsSubmittingBlog(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Microservices test client</p>
          <h1>Backend Control Room</h1>
        </div>
        <button className="status-pill" type="button" onClick={checkHealth}>
          <span className={health ? "status-dot online" : "status-dot"} />
          {statusText}
        </button>
      </section>

      <section className="grid">
        <div className="panel auth-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Auth service :3001</p>
              <h2>Account</h2>
            </div>
            <div className="segmented">
              <button
                type="button"
                className={authMode === "register" ? "active" : ""}
                onClick={() => setAuthMode("register")}
              >
                Register
              </button>
              <button
                type="button"
                className={authMode === "login" ? "active" : ""}
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit}>
            {authMode === "register" && (
              <label>
                Name
                <input
                  value={authForm.name}
                  onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                  placeholder="Basant"
                />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                placeholder="basant@example.com"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                placeholder="password123"
              />
            </label>
            <button className="primary-button" type="submit" disabled={isSubmittingAuth}>
              {isSubmittingAuth ? "Sending..." : authMode === "register" ? "Create account" : "Login"}
            </button>
          </form>

          {authError && <p className="error">{authError}</p>}
          {authResult && (
            <div className="result-box">
              <strong>{authMode === "register" ? "Registered" : "Logged in"}</strong>
              <span>{authResult.user?.email}</span>
              {authResult.token && <code>{authResult.token}</code>}
            </div>
          )}
        </div>

        <div className="panel blog-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Blog service :3002</p>
              <h2>Create Blog</h2>
            </div>
          </div>

          <form onSubmit={handleBlogSubmit}>
            <label>
              Title
              <input
                value={blogForm.title}
                onChange={(event) => setBlogForm({ ...blogForm, title: event.target.value })}
                placeholder="My first microservice post"
              />
            </label>
            <label>
              Content
              <textarea
                value={blogForm.content}
                onChange={(event) => setBlogForm({ ...blogForm, content: event.target.value })}
                placeholder="Write a quick test post..."
                rows="6"
              />
            </label>
            <button className="primary-button secondary" type="submit" disabled={isSubmittingBlog}>
              {isSubmittingBlog ? "Publishing..." : "Publish post"}
            </button>
          </form>

          {blogError && <p className="error">{blogError}</p>}
        </div>
      </section>

      <section className="posts-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Main backend :3000</p>
            <h2>Posts from MongoDB</h2>
          </div>
          <button className="ghost-button" type="button" onClick={loadBlogs}>
            Refresh
          </button>
        </div>

        <div className="posts-grid">
          {blogs.length === 0 ? (
            <div className="empty-state">No blog posts yet.</div>
          ) : (
            blogs.map((blog) => (
              <article className="post-card" key={blog._id}>
                <div>
                  <h3>{blog.title}</h3>
                  <p>{blog.content}</p>
                </div>
                <span>{new Date(blog.createdAt).toLocaleString()}</span>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
