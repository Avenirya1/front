import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Edit, Trash, LogIn, BookOpen, Loader2, Upload, Plus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

// Get logged-in agency ID from localStorage once
const agencyId = localStorage.getItem("agencyId");

// Define a constant for the initial form state
const initialFormState = {
  name: "",
  email: "",
  address: "",
  logo: "",
  contact: "",
  password: "",
  subadmin_id: agencyId || "", // Default to the logged-in agency (if any)
  membership_level: "",
  currency: "INR",
  homeImage: "",
  active: true,
};

const SuperAdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");

  // You can set your password in an environment variable or here
  const SUPER_ADMIN_PASSWORD = "SuperAdmin#@5645"; // 🔒 Change this

  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [uploadingHome, setUploadingHome] = useState(false);
  const [loading, setLoading] = useState(false); // For fetching restaurant list
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [formOpen, setFormOpen] = useState(false);
  const formRef = useRef(null);

  const API = "/api/admin";
  const WP_USERNAME = "yashkolnure58@gmail.com";
  const WP_APP_PASSWORD = "05mq iTLF UvJU dyaz 7KxQ 8pyc";
  const WP_SITE_URL = "https://website.avenirya.com";

  const currencies = [
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  ];

  // Check for password auth on component mount
  useEffect(() => {
    if (localStorage.getItem("superAdminAuth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  // Fetch all restaurants once authenticated
  useEffect(() => {
    if (authenticated) {
      fetchRestaurants();
    }
  }, [authenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (enteredPassword === SUPER_ADMIN_PASSWORD) {
      localStorage.setItem("superAdminAuth", "true");
      setAuthenticated(true);
    } else {
      toast.error("Incorrect password!");
    }
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/restaurants`);
      setRestaurants(res.data);
    } catch (err) {
      toast.error("Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };
  const agencyId = localStorage.getItem("agencyId");

  useEffect(() => {
    if (agencyId) {
      setForm((prev) => ({ ...prev, subadmin_id: agencyId }));
      fetchRestaurantsByAgency(agencyId);
    }
  }, [agencyId]);

  const fetchRestaurantsByAgency = async () => {

  try {
    const res = await axios.get(`${API}/restaurants`);
    setRestaurants(res.data);  // Directly use the fetched restaurant list
  } catch (err) {
    alert("Failed to fetch restaurants");
  }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Function to handle closing the form and resetting state
  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(initialFormState); // Reset form to initial state
  };

  const handleSubmit = async () => {
    setSubmitting(true); // Use submission state
    try {
      const payload = { ...form, membership_level: 3 };
      if (!payload.password) delete payload.password;

      if (editingId) {
        await axios.put(`${API}/restaurants/${editingId}`, payload);
        toast.success("Restaurant updated successfully!");
      } else {
        await axios.post(`${API}/restaurant/register`, payload);
        toast.success("Restaurant created successfully!");
      }

      handleCloseForm(); // Use the close/reset function
      fetchRestaurants(); // Refetch all restaurants
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save restaurant");
    } finally {
      setSubmitting(false); // Stop submission state
    }
  };

  const handleEdit = (restaurant) => {
    setEditingId(restaurant._id);
    setForm({
      name: restaurant.name,
      email: restaurant.email,
      address: restaurant.address,
      logo: restaurant.logo || "",
      contact: restaurant.contact || "",
      password: "",
      subadmin_id: restaurant.subadmin_id || agencyId || "",
      homeImage: restaurant.homeImage || "",
      active: typeof restaurant.active === "boolean" ? restaurant.active : true,
      currency: restaurant.currency || "INR",
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axios.delete(`${API}/restaurants/${id}`);
        toast.success("Restaurant deleted successfully");
        fetchRestaurants(); // Refetch all restaurants
      } catch (err) {
        toast.error("Failed to delete restaurant");
      }
    }
  };

  const handleRestaurantLogin = async (restaurantId) => {
    try {
      const agencyToken = localStorage.getItem("agencyToken");
      if (!agencyToken) {
        toast.error("Agency token not found. Cannot impersonate.");
        return;
      }

      const res = await axios.post(
        `${API}/agency-login-restaurant/${restaurantId}`,
        {},
        { headers: { Authorization: `Bearer ${agencyToken}` } }
      );

      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("restaurantId", data.restaurant._id);
      localStorage.setItem("impersonatedBy", "agency");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to login as restaurant");
    }
  };

  const uploadHomeImageToWordPress = async (file) => {
    if (!file) return;
    const formDataImage = new FormData();
    formDataImage.append("file", file);
    setUploadingHome(true);

    try {
      const response = await axios.post(`${WP_SITE_URL}/wp-json/wp/v2/media`, formDataImage, {
        headers: {
          Authorization: "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`),
          "Content-Disposition": `attachment; filename="${file.name}"`,
        },
      });

      const imageUrl = response.data.source_url;
      setForm((prev) => ({ ...prev, homeImage: imageUrl }));
      toast.success("Home image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload home image to WordPress");
    } finally {
      setUploadingHome(false);
    }
  };

  const uploadImageToWordPress = async (file) => {
    if (!file) return;
    const formDataImage = new FormData();
    formDataImage.append("file", file);
    setUploading(true);

    try {
      const response = await axios.post(`${WP_SITE_URL}/wp-json/wp/v2/media`, formDataImage, {
        headers: {
          Authorization: "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`),
          "Content-Disposition": `attachment; filename="${file.name}"`,
        },
      });

      const imageUrl = response.data.source_url;
      setForm((prev) => ({ ...prev, logo: imageUrl }));
      toast.success("Logo uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image to WordPress");
    } finally {
      setUploading(false);
    }
  };

  // 🔐 If not authenticated, show password screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Toaster position="top-right" />
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-80 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Super Admin Access</h2>
          <input
            type="password"
            placeholder="Enter Password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 mb-4"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>
      
      <Toaster position="top-right" />

      <div className="relative p-6 md:p-10 font-sans max-w-6xl mx-auto">
        {/* Button to open form */}
        <button
          onClick={() => {
            // REMOVED agency level check. Super admin has no limits.
            setFormOpen(true);
          }}
          className="mb-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          <Plus size={20} /> Add Restaurant
        </button>

        {/* Popup form */}
        {formOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
              ref={formRef}
              className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow relative"
            >
              <button
                onClick={handleCloseForm} // Use the state-resets ting close function
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                {editingId ? "Edit Restaurant" : "Add Restaurant"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" placeholder="Restaurant Name" value={form.name} onChange={handleChange} className="p-3 border rounded-lg focus:ring focus:ring-blue-300" />
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-3 border rounded-lg focus:ring focus:ring-blue-300" />
                <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="p-3 border rounded-lg focus:ring focus:ring-blue-300" />
                <input type="number" name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} className="p-3 border rounded-lg focus:ring focus:ring-blue-300" />
                <input name="password" type="password" placeholder={editingId ? "Change Password (optional)" : "Password"} value={form.password} onChange={handleChange} className="p-3 border rounded-lg focus:ring focus:ring-blue-300" />
                
                {/* TODO: As a super admin, you probably want a dropdown to *select* the subadmin_id
                    For now, it defaults to the logged-in agency's ID per the initial state.
                <input name="subadmin_id" placeholder="Agency ID" value={form.subadmin_id} onChange={handleChange} className="p-3 border rounded-lg" />
                */}
                
                <div className="md:col-span-2 mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Upload Home Image
                  </label>
                  <div className="border-dashed border-2 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadHomeImageToWordPress(e.target.files[0])}
                      className="hidden"
                      id="homeImageUpload"
                    />
                    <label htmlFor="homeImageUpload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
                      <Upload size={24} />
                      <span>Click or drag to upload</span>
                    </label>
                  </div>
                  {uploadingHome && <p className="text-blue-500 mt-2 flex items-center gap-2"><Loader2 className="animate-spin" size={16}/> Uploading...</p>}
                  {form.homeImage && <img src={form.homeImage} alt="Home" className="mt-3 rounded-md h-20 object-cover border" />}
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Upload Logo
                  </label>
                  <div className="border-dashed border-2 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-50">
                    <input type="file" accept="image/*" onChange={(e) => uploadImageToWordPress(e.target.files[0])} className="hidden" id="logoUpload" />
                    <label htmlFor="logoUpload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
                      <Upload size={24} />
                      <span>Click or drag to upload</span>
                    </label>
                  </div>
                  {uploading && <p className="text-blue-500 mt-2 flex items-center gap-2"><Loader2 className="animate-spin" size={16}/> Uploading...</p>}
                  {form.logo && <img src={form.logo} alt="Uploaded" className="mt-3 rounded-md h-20 object-cover border" />}
                </div>
              </div>
              <div>
                <label className="block mb-2 mt-4 text-sm font-medium text-gray-600">
                  Select Currency
                </label>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:ring focus:ring-blue-300 w-full"
                >
                  {currencies.map((cur) => (
                    <option key={cur.code} value={cur.code}>
                      {cur.symbol} {cur.name} ({cur.code})
                    </option>
                  ))}
                </select>
              </div>


              <button
                onClick={handleSubmit}
                className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 flex items-center justify-center gap-2"
                disabled={uploading || uploadingHome || submitting} // Check submitting state
              >
                {submitting ? <Loader2 className="animate-spin" size={18}/> : editingId ? "Update" : "Create"} Restaurant
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white p-6 rounded-2xl shadow relative z-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Registered Restaurants ({restaurants.length})</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border rounded-lg ">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="p-3 border">Logo</th>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Contact</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {restaurants.map((rest, idx) => (
                    <tr key={rest._id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 border text-center">
                        {rest.logo ? <img src={rest.logo} alt="logo" className="h-10 w-10 object-cover rounded-full mx-auto" /> : "-"}
                      </td>
                      <td className="p-3 border">{rest.name}</td>
                      <td className="p-3 border">{rest.contact || "-"}</td>
                      <td className="p-3 border text-center">
                       <div className="relative inline-block">
                         <button
                           onClick={async () => {
                             if (rest.active) {
                               const confirmMsg = `Are you sure you want to deactivate "${rest.name}"?`;
                               if (!window.confirm(confirmMsg)) return;
                       
                               try {
                                 await axios.put(`${API}/restaurants/${rest._id}`, {
                                   active: false,
                                   expiresAt: null,
                                 });
                                 toast.success(`Restaurant deactivated!`);
                                 fetchRestaurantsByAgency(agencyId);
                               } catch {
                                 toast.error("Failed to deactivate");
                               }
                             } else {
                               // Toggle dropdown visibility
                               setShowDropdown((prev) => (prev === rest._id ? null : rest._id));
                             }
                           }}
                           className={`px-3 py-1 rounded-full font-semibold text-xs ${
                             rest.active
                               ? "bg-green-100 text-green-700 border border-green-300"
                               : "bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300"
                           }`}
                         >
                           {rest.active ? "Active" : "Inactive"}
                         </button>
                       
                         {/* dropdown menu for duration */}
                         {showDropdown === rest._id && !rest.active && (
                           <div className="absolute right-0 w-40 mt-2 bg-white border border-gray-200 rounded-lg shadow-md text-sm z-10">
                             <p className="px-3 py-2 text-gray-700 font-semibold border-b">Select Duration</p>
                             {[
                               { label: "7 Days", value: "7d" },
                               { label: "1 Month", value: "1m" },
                               { label: "2 Months", value: "2m" },
                               { label: "6 Months", value: "6m" },
                               { label: "1 Year", value: "1y" },
                               { label: "Lifetime", value: "5y" },
                             ].map((opt) => (
                               <button
                                 key={opt.value}
                                 onClick={async () => {
                                   setShowDropdown(null);
                                   const now = new Date();
                                   if (opt.value === "7d") now.setDate(now.getDate() + 7);
                                   else if (opt.value === "1m") now.setMonth(now.getMonth() + 1);
                                   else if (opt.value === "2m") now.setMonth(now.getMonth() + 2);
                                   else if (opt.value === "6m") now.setMonth(now.getMonth() + 6);
                                   else if (opt.value === "1y") now.setFullYear(now.getFullYear() + 1);
                                   else if (opt.value === "5y") now.setFullYear(now.getFullYear() + 5);
                       
                                   const expiresAt = now;
                                   try {
                                     await axios.put(`${API}/restaurants/${rest._id}`, {
                                       active: true,
                                       expiresAt,
                                     });
                                     toast.success(`"${rest.name}" activated for ${opt.label}!`);
                                     fetchRestaurantsByAgency(agencyId);
                                   } catch {
                                     toast.error("Failed to activate");
                                   }
                                 }}
                                 className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                               >
                                 {opt.label}
                               </button>
                             ))}
                           </div>
                         )}
                       </div>
                                               
                       {rest.expiresAt && (() => {
                         const now = new Date();
                         const expiry = new Date(rest.expiresAt);
                         const diffMs = expiry - now;
                       
                         if (diffMs <= 0) {
                           return <span className="text-xs text-gray-500"><br />Expired</span>;
                         }
                       
                         const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                         const diffMonths = Math.floor(diffDays / 30);
                         const diffYears = Math.floor(diffDays / 365);
                       
                         let timeLeft = "";
                       
                         if (diffYears >= 1) {
                           timeLeft = `${diffYears}y left`;
                         } else if (diffMonths >= 1) {
                           timeLeft = `${diffMonths}m left`;
                         } else {
                           timeLeft = `${diffDays}d left`;
                         }
                       
                         return (
                           <span className="text-xs text-gray-500">
                             <br />
                             {timeLeft}
                           </span>
                         );
                       })()}
                      </td>
                      <td className="p-3 border text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(rest)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={18} /> Edit
                          </button>

                          <button
                            onClick={() => handleDelete(rest._id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800"
                          >
                            <Trash size={18} /> Delete
                          </button>

                          <a
                            href={`/m/${rest.slug}`} // Assumes 'slug' is part of the 'rest' object
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-green-600 hover:text-green-800"
                          >
                            <BookOpen size={18} /> Menu
                          </a>

                          <button
                            onClick={() => handleRestaurantLogin(rest._id)}
                            className="flex items-center gap-1 text-purple-600 hover:text-purple-800"
                          >
                            <LogIn size={18} /> Login
                          </button>
                        </div>

                      </td>
                    </tr>
                  ))}
                  {restaurants.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-3 text-center text-gray-500">
                        No restaurants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;