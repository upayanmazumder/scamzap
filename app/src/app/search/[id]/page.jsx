import User from "../../../components/users/user/User";
import API from "../../../utils/api";

export default async function UserPage({ params }) {
  const { id } = params;

  let userName = "Unknown User";
  let userDetailsText = "Viewing user details";

  try {
    const res = await fetch(`${API}/users/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.name) {
        userName = data.name;
        userDetailsText = `Viewing details for ${data.name}`;
      }
    } else {
      console.error(`Failed to fetch user with ID ${id}: ${res.statusText}`);
    }
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
  }

  return (
    <main>
      <div className="page-header">
        <h2>User Profile</h2>
        <p>{userDetailsText}</p>
      </div>
      <User id={id} />
    </main>
  );
}
