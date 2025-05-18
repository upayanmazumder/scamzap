"use client";

import API from "../../utils/api";
import Loader from "../../components/loader/Loader";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${API}/users`);
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading)
        return (
            <main>
                <Loader />
            </main>
        );

    return (
        <main>
            <div className="page-header">
                <h1>Users</h1>
                <p>List of registered users.</p>
            </div>
            <ul className="space-y-4">
                {users.map((user) => (
                    <li key={user._id} className="border p-4 rounded-md transition">
                        <Link href={`/users/${user.id}`} className="block">
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}