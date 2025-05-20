import Search from "../../components/users/search/Search";

export default function SearchPage() {
  return (
    <main>
      <div className="page-header">
        <h1>Search Users</h1>
        <p>Find users by their username or email.</p>
      </div>
      <Search />
    </main>
  );
}
