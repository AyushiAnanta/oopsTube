import React, { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { X } from 'lucide-react';

const ChangePasswordPopup = ({ onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            return setError("New passwords don't match");
        }

        setLoading(true);
        try {
            await axiosInstance.post('/users/change-password', {
                oldPassword,
                newPassword
            });
            alert("Password changed successfully!");
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-dark-900 border border-dark-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                <div className="flex justify-between items-center p-6 border-b border-dark-800">
                    <h2 className="text-xl font-bold text-white">Change Password</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Old Password</label>
                        <input
                            type="password"
                            required
                            className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500 transition-colors"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">New Password</label>
                        <input
                            type="password"
                            required
                            className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500 transition-colors"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500 transition-colors"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-dark-700 text-gray-300 hover:bg-dark-800 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPopup;
