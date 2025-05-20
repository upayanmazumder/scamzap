import AdminDashboard from "../../components/admin/admindashboard/AdminDashboard";

export default function AdminPage() {
  return (
    <main>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, reports, and more.</p>
      </div>
      <AdminDashboard />
    </main>
  );
}
