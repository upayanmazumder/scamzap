import UserRoleManager from "../../components/admin/userrolemanager/UserRoleManager";

export default function Dashboard() {
  return (
    <main>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and content</p>
      </div>
      <UserRoleManager />
    </main>
  );
}
