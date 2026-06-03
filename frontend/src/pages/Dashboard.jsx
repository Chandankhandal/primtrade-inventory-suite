import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();


    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: ''
    });


    const fetchProducts = async () => {
        try {
            setLoading(true);


            const currentToken = localStorage.getItem('token');


            const res = await axios.get('/api/v1/products', {
                headers: {
                    Authorization: `Bearer ${currentToken}`
                }
            });

            if (user && user.role === 'admin') {
                const loggedInUserId = user._id || user.id;
                const isolatedProducts = res.data.filter(product => {
                    const productCreatorId = product.user?._id || product.user || '';
                    return productCreatorId.toString() === loggedInUserId.toString();
                });
                setProducts(isolatedProducts);
            }
            else {
                setProducts(res.data);
            }

        } catch (error) {
            console.error("Fetch products failed details:", error);
            toast.error(error.response?.data?.message || "Error pulling product records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    const handleLogout = () => {
        logoutUser();
        toast.info("Logged out securely.");
        navigate('/auth');
    };


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };




    const startEdit = (product) => {
        setEditingId(product._id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock
        });
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const currentToken = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${currentToken}` } };

            if (editingId) {

                await axios.put(`/api/v1/products/${editingId}`, formData, config);
                toast.success("Product record updated successfully!");
            } else {

                await axios.post('/api/v1/products', formData, config);
                toast.success("New product compiled to database inventory!");
            }

            setFormData({ name: '', description: '', price: '', category: '', stock: '' });
            setEditingId(null);
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed.");
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Are you absolutely sure you want to delete this inventory item?")) return;
        try {
            const currentToken = localStorage.getItem('token');

            await axios.delete(`/api/v1/products/${id}`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });

            toast.success("Item purged from inventory records cleanly.");
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Deletion sequence failed.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">


            <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-md">
                <div>
                    <h1 className="text-xl font-extrabold tracking-wider text-indigo-400">PRIMTRADE ANALYTICAL SUITE</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Logged in as: <span className="text-slate-200 font-bold">{user?.name || 'Developer Mode'}</span> ({user?.role?.toUpperCase()})</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                    Logout
                </button>
            </nav>


            <main className="p-6 max-w-7xl mx-auto space-y-8">


                {user?.role === 'admin' && (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">
                            {editingId ? "🔧 Modify Existing Product Record" : "➕ Add New Multiple-Vendor Inventory Item"}
                        </h2>
                        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text" name="name" required placeholder="Product Title"
                                value={formData.name} onChange={handleInputChange}
                                className="bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                            />
                            <input
                                type="text" name="category" required placeholder="Category Group"
                                value={formData.category} onChange={handleInputChange}
                                className="bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                            />
                            <input
                                type="number" name="price" required placeholder="Unit Price ($)"
                                value={formData.price} onChange={handleInputChange}
                                className="bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                            />
                            <input
                                type="number" name="stock" required placeholder="Initial Stock Count"
                                value={formData.stock} onChange={handleInputChange}
                                className="bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                            />
                            <input
                                type="text" name="description" required placeholder="Short Item Specification Detail"
                                value={formData.description} onChange={handleInputChange}
                                className="bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 md:col-span-2"
                            />

                            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                                {editingId && (
                                    <button
                                        type="button" onClick={() => { setEditingId(null); setFormData({ name: '', description: '', price: '', category: '', stock: '' }); }}
                                        className="bg-slate-600 hover:bg-slate-500 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2 rounded-lg shadow-md transition-colors cursor-pointer"
                                >
                                    {editingId ? "Update Metrics" : "Compile Asset"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Dynamic Display Area */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        📦 Live Catalog Records
                        <span className="text-xs bg-indigo-900 border border-indigo-700 text-indigo-300 font-extrabold px-2 py-0.5 rounded-full">
                            {products.length} Total Units
                        </span>
                    </h2>

                    {loading ? (
                        <div className="text-center py-12 text-slate-400 text-sm animate-pulse">Syncing catalog data arrays...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12 bg-slate-800 border border-slate-700 border-dashed rounded-xl text-slate-400 text-sm">
                            No inventory assets found in database cluster.
                        </div>
                    ) : user?.role === 'admin' ? (

                        /* VIEW: Admin Inventory Metrics Control Table Layout */
                        <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-xl shadow-xl">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-750 border-b border-slate-700 text-slate-300 font-semibold">
                                        <th className="p-4">Asset Detail</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Available Stock</th>
                                        <th className="p-4 text-right">Administrative Execution Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 text-slate-200">
                                    {products.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-750/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-white">{item.name}</div>
                                                <div className="text-xs text-slate-400 line-clamp-1 max-w-md">{item.description}</div>
                                            </td>
                                            <td className="p-4"><span className="bg-slate-700 px-2 py-1 rounded text-xs text-slate-300 font-medium">{item.category}</span></td>
                                            <td className="p-4 font-bold text-indigo-300">${Number(item.price).toFixed(2)}</td>
                                            <td className="p-4">
                                                <span className={`font-bold ${item.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {item.stock} units
                                                </span>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <button
                                                    onClick={() => startEdit(item)}
                                                    className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors cursor-pointer"
                                                >
                                                    Modify
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (


                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((item) => (
                                <div key={item._id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-indigo-500 transition-all">
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-bold text-white text-base leading-tight">{item.name}</h3>
                                            <span className="bg-slate-700 px-2 py-0.5 rounded text-xxs text-slate-300 uppercase font-bold tracking-wider shrink-0">{item.category}</span>
                                        </div>
                                        <p className="text-slate-400 text-xs line-clamp-3 mb-4">{item.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-700 pt-3 mt-2">
                                        <span className="text-xl font-extrabold text-indigo-400">${Number(item.price).toFixed(2)}</span>
                                        <span className={`text-xs font-bold ${item.stock > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                                            {item.stock > 0 ? `${item.stock} Available` : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;