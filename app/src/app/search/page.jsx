import Search from "../../components/users/search/Search";

export default function SearchPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-6 mx-auto">
      <div className="flex flex-col items-center justify-center pt-6 mx-auto">
        <h1>Search Users</h1>
      </div>
      <Search />
    </div>
  );
}
