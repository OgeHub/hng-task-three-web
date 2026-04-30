import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../api/auth";
import { createProfile, deleteProfile, exportProfilesCsv, getProfiles } from "../api/profiles";

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    links: { self: "", next: null, prev: null },
  });
  const [filters, setFilters] = useState({ page: 1, limit: 10, name: "" });
  const [nameInput, setNameInput] = useState("");
  const [userRole, setUserRole] = useState("");
  const [newProfileName, setNewProfileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = { page: filters.page, limit: filters.limit };
      if (filters.name.trim()) params.name = filters.name.trim();
      const data = await getProfiles(params);

      setProfiles(data.data || []);
      setPagination({
        page: data.page || 1,
        limit: data.limit || filters.limit,
        total: data.total || 0,
        totalPages: data.total_pages || 1,
        links: data.links || { self: "", next: null, prev: null },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profiles.");
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, filters.name]);

  useEffect(() => {
    getCurrentUser()
      .then((me) => {
        setUserRole(me?.role || "analyst");
      })
      .catch(() => setUserRole("analyst"));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProfiles();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadProfiles]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, name: nameInput, page: 1 }));
  };

  const handleCreate = async () => {
    if (!newProfileName.trim()) return;
    try {
      setError("");
      await createProfile({ name: newProfileName.trim() });
      setNewProfileName("");
      setFilters((prev) => ({ ...prev, page: 1 }));
      await loadProfiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create profile.");
    }
  };

  const handleExportCsv = async () => {
    try {
      setError("");
      const params = {
        page: filters.page,
        limit: filters.limit,
      };
      if (filters.name.trim()) params.name = filters.name.trim();

      const res = await exportProfilesCsv(params);
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      const contentDisposition = res.headers["content-disposition"] || "";
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      const fileName = fileNameMatch?.[1] || `profiles_${Date.now()}.csv`;
      a.href = blobUrl;
      a.setAttribute("download", fileName);
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to export CSV.");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteProfile(id);
      await loadProfiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete profile.");
    }
  };

  return (
    <div>
      <h2>Profiles List</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={onSearchSubmit} style={{ marginBottom: "12px" }}>
        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Filter by name"
        />
        <button type="submit">Apply filter</button>
        <button type="button" onClick={handleExportCsv}>
          Export CSV
        </button>
      </form>

      {userRole === "admin" && (
        <div style={{ marginBottom: "12px" }}>
          <input
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="New profile name"
          />
          <button onClick={handleCreate}>Create profile</button>
        </div>
      )}

      {loading ? (
        <p>Loading profiles...</p>
      ) : (
        <ul>
          {profiles.map((profile) => (
            <li key={profile.id}>
              <Link to={`/profiles/${profile.id}`}>{profile.name}</Link>
              {userRole === "admin" && (
                <button
                  style={{ marginLeft: "8px" }}
                  onClick={() => handleDelete(profile.id)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "12px" }}>
        <p>
          Page {pagination.page} of {pagination.totalPages} | Total {pagination.total}
        </p>
        <button
          disabled={!pagination.links.prev}
          onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
        >
          Prev
        </button>
        <button
          disabled={!pagination.links.next}
          onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
        >
          Next
        </button>
      </div>
    </div>
  );
}