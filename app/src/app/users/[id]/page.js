"use client";

import API from "../../../utils/api";
import Loader from "../../../components/loader/Loader";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";

export default function User() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API}/users/${id}`);
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id]);

    if (loading)
        return (
            <main>
                <Loader />
            </main>
        );

    if (!user || user.error)
        return <p className="text-center text-red-600 mt-10">User not found.</p>;

    return (
        <main>
            <div className="page-header ">
                <h1>User Profile</h1>
                <p>User details of {user.name}</p>
            </div>
            <div className="mb-8 mt-6 bg-orange-400 p-4 rounded-md shadow-md">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <FaUserCircle className="text-2xl" />
                    {user.name}
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                    <FaEnvelope className="text-lg" />
                    {user.email}
                </p>
            </div>
        </main>
    );
}