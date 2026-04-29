import { useState } from "react";
import { Link } from "react-router-dom";
import { searchProfiles } from "../api/profiles";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [links, setLinks] = useState({ next: null, prev: null });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const runSearch = async (targetPage = 1) => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      setError("");
      const data = await searchProfiles({
        q: query.trim(),
        page: targetPage,
        limit,
      });
      setResults(data.data || []);
      setPage(data.page || targetPage);
      setLinks(data.links || { next: null, prev: null });
    } catch (err) {
      setError(err.response?.data?.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(1);
  };

  return (
    <div>
      <h2>Search Page</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search profiles"
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Searching...</p>
      ) : (
        <ul>
          {results.map((profile) => (
            <li key={profile.id}>
              <Link to={`/profiles/${profile.id}`}>{profile.name}</Link>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "12px" }}>
        <p>Page: {page}</p>
        <button disabled={!links.prev} onClick={() => runSearch(Math.max(1, page - 1))}>
          Prev
        </button>
        <button disabled={!links.next} onClick={() => runSearch(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}