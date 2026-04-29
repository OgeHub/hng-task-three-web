import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfileById } from "../api/profiles";

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProfileById(id);
        setProfile(data.data || data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div>
      <h2>Profile Detail</h2>
      <p>Name: {profile.name}</p>
      <p>Gender: {profile.gender}</p>
      <p>Age: {profile.age}</p>
      <p>Country: {profile.country_name}</p>
      <p>Created: {profile.created_at}</p>
    </div>
  );
}