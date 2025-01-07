import { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    country: "",
    state: "",
    city: "",
    area: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const countries = ["India", "Other"];
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
    "Other",
  ];
  const indianCities = {
    "Andhra Pradesh": [
      "Visakhapatnam",
      "Vijayawada",
      "Guntur",
      "Nellore",
      "Tirupati",
      "Kurnool",
      "Kakinada",
      "Rajahmundry",
      "Anantapur",
      "Kadapa",
      "Other",
    ],
    "Arunachal Pradesh": [
      "Itanagar",
      "Pasighat",
      "Naharlagun",
      "Tawang",
      "Ziro",
      "Bomdila",
      "Tezu",
      "Roing",
      "Changlang",
      "Daporijo",
      "Other",
    ],
    Assam: [
      "Guwahati",
      "Silchar",
      "Dibrugarh",
      "Jorhat",
      "Nagaon",
      "Tinsukia",
      "Tezpur",
      "Diphu",
      "Goalpara",
      "Sibsagar",
      "Other",
    ],
    Bihar: [
      "Patna",
      "Gaya",
      "Bhagalpur",
      "Muzaffarpur",
      "Purnia",
      "Darbhanga",
      "Bihar Sharif",
      "Arrah",
      "Begusarai",
      "Katihar",
      "Other",
    ],
    Chhattisgarh: [
      "Raipur",
      "Bilaspur",
      "Durg",
      "Bhilai",
      "Korba",
      "Rajnandgaon",
      "Jagdalpur",
      "Raigarh",
      "Ambikapur",
      "Dhamtari",
      "Other",
    ],
    Goa: [
      "Panaji",
      "Margao",
      "Vasco da Gama",
      "Mapusa",
      "Ponda",
      "Bicholim",
      "Curchorem",
      "Canacona",
      "Valpoi",
      "Sanquelim",
      "Other",
    ],
    Gujarat: [
      "Ahmedabad",
      "Surat",
      "Vadodara",
      "Rajkot",
      "Bhavnagar",
      "Jamnagar",
      "Junagadh",
      "Gandhinagar",
      "Anand",
      "Navsari",
      "Other",
    ],
    Haryana: [
      "Gurgaon",
      "Faridabad",
      "Panipat",
      "Ambala",
      "Yamunanagar",
      "Rohtak",
      "Hisar",
      "Karnal",
      "Sonipat",
      "Panchkula",
      "Other",
    ],
    "Himachal Pradesh": [
      "Shimla",
      "Dharamshala",
      "Mandi",
      "Solan",
      "Kullu",
      "Bilaspur",
      "Chamba",
      "Hamirpur",
      "Una",
      "Nahan",
      "Other",
    ],
    Jharkhand: [
      "Ranchi",
      "Jamshedpur",
      "Dhanbad",
      "Bokaro",
      "Hazaribagh",
      "Deoghar",
      "Giridih",
      "Ramgarh",
      "Chaibasa",
      "Phusro",
      "Other",
    ],
    Karnataka: [
      "Bengaluru",
      "Mysuru",
      "Hubballi",
      "Mangaluru",
      "Belagavi",
      "Davanagere",
      "Ballari",
      "Tumakuru",
      "Shivamogga",
      "Bidar",
      "Other",
    ],
    Kerala: [
      "Thiruvananthapuram",
      "Kochi",
      "Kozhikode",
      "Kollam",
      "Thrissur",
      "Alappuzha",
      "Palakkad",
      "Malappuram",
      "Kannur",
      "Kottayam",
      "Other",
    ],
    "Madhya Pradesh": [
      "Bhopal",
      "Indore",
      "Gwalior",
      "Jabalpur",
      "Ujjain",
      "Sagar",
      "Dewas",
      "Satna",
      "Ratlam",
      "Rewa",
      "Other",
    ],
    Maharashtra: [
      "Mumbai",
      "Pune",
      "Nagpur",
      "Nashik",
      "Thane",
      "Aurangabad",
      "Solapur",
      "Amravati",
      "Kolhapur",
      "Navi Mumbai",
      "Other",
    ],
    Manipur: [
      "Imphal",
      "Thoubal",
      "Bishnupur",
      "Churachandpur",
      "Kakching",
      "Ukhrul",
      "Senapati",
      "Tamenglong",
      "Moirang",
      "Jiribam",
      "Other",
    ],
    Meghalaya: [
      "Shillong",
      "Tura",
      "Nongstoin",
      "Jowai",
      "Williamnagar",
      "Baghmara",
      "Mawkyrwat",
      "Resubelpara",
      "Khliehriat",
      "Ampati",
      "Other",
    ],
    Mizoram: [
      "Aizawl",
      "Lunglei",
      "Saiha",
      "Champhai",
      "Serchhip",
      "Kolasib",
      "Lawngtlai",
      "Mamit",
      "Tlabung",
      "Zawlnuam",
      "Other",
    ],
    Nagaland: [
      "Kohima",
      "Dimapur",
      "Mokokchung",
      "Tuensang",
      "Wokha",
      "Zunheboto",
      "Phek",
      "Mon",
      "Kiphire",
      "Longleng",
      "Other",
    ],
    Odisha: [
      "Bhubaneswar",
      "Cuttack",
      "Rourkela",
      "Berhampur",
      "Sambalpur",
      "Puri",
      "Balasore",
      "Baripada",
      "Bhadrak",
      "Jeypore",
      "Other",
    ],
    Punjab: [
      "Amritsar",
      "Ludhiana",
      "Jalandhar",
      "Patiala",
      "Bathinda",
      "Mohali",
      "Hoshiarpur",
      "Pathankot",
      "Moga",
      "Phagwara",
      "Other",
    ],
    Rajasthan: [
      "Jaipur",
      "Jodhpur",
      "Udaipur",
      "Kota",
      "Ajmer",
      "Bikaner",
      "Alwar",
      "Bharatpur",
      "Sikar",
      "Pali",
      "Other",
    ],
    Sikkim: [
      "Gangtok",
      "Namchi",
      "Geyzing",
      "Mangan",
      "Jorethang",
      "Rangpo",
      "Singtam",
      "Rhenock",
      "Soreng",
      "Yuksom",
      "Other",
    ],
    "Tamil Nadu": [
      "Chennai",
      "Coimbatore",
      "Madurai",
      "Tiruchirappalli",
      "Salem",
      "Tiruppur",
      "Erode",
      "Vellore",
      "Thoothukudi",
      "Dindigul",
      "Other",
    ],
    Telangana: [
      "Hyderabad",
      "Warangal",
      "Nizamabad",
      "Khammam",
      "Karimnagar",
      "Ramagundam",
      "Mahbubnagar",
      "Adilabad",
      "Siddipet",
      "Jagtial",
      "Other",
    ],
    Tripura: [
      "Agartala",
      "Udaipur",
      "Kailashahar",
      "Dharmanagar",
      "Belonia",
      "Ambassa",
      "Sonamura",
      "Kamalpur",
      "Amarpur",
      "Sabroom",
      "Other",
    ],
    "Uttar Pradesh": [
      "Lucknow",
      "Kanpur",
      "Ghaziabad",
      "Agra",
      "Meerut",
      "Varanasi",
      "Prayagraj",
      "Noida",
      "Aligarh",
      "Moradabad",
      "Other",
    ],
    Uttarakhand: [
      "Dehradun",
      "Haridwar",
      "Nainital",
      "Rishikesh",
      "Haldwani",
      "Rudrapur",
      "Kashipur",
      "Roorkee",
      "Almora",
      "Pithoragarh",
      "Other",
    ],
    "West Bengal": [
      "Kolkata",
      "Asansol",
      "Siliguri",
      "Durgapur",
      "Howrah",
      "Bardhaman",
      "Malda",
      "Kharagpur",
      "Darjeeling",
      "Berhampore",
      "Other",
    ],
    "Andaman and Nicobar Islands": [
      "Port Blair",
      "Rangat",
      "Mayabunder",
      "Diglipur",
      "Bombooflat",
      "Wimberly Gunj",
      "Garacharma",
      "Prothrapur",
      "Havelock",
      "Neil Island",
      "Other",
    ],
    Chandigarh: ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": [
      "Silvassa",
      "Daman",
      "Diu",
      "Amli",
      "Kachigam",
      "Bhimpore",
      "Other",
    ],
    Delhi: [
      "New Delhi",
      "Central Delhi",
      "West Delhi",
      "East Delhi",
      "North Delhi",
      "South Delhi",
      "Shahdara",
      "Rohini",
      "Dwarka",
      "Karol Bagh",
      "Other",
    ],
    "Jammu and Kashmir": [
      "Srinagar",
      "Jammu",
      "Anantnag",
      "Baramulla",
      "Udhampur",
      "Kathua",
      "Kupwara",
      "Pulwama",
      "Ganderbal",
      "Poonch",
      "Other",
    ],
    Ladakh: ["Leh", "Kargil", "Other"],
    Lakshadweep: [
      "Kavaratti",
      "Agatti",
      "Amini",
      "Androth",
      "Kalpeni",
      "Minicoy",
      "Kadmat",
      "Other",
    ],
    Puducherry: ["Puducherry", "Karaikal", "Mahe", "Yanam", "Other"],
  };

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCustomCity, setShowCustomCity] = useState(false);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  // Update available states when country changes
  useEffect(() => {
    if (formData.country === "India") {
      setAvailableStates(indianStates);
    } else {
      setAvailableStates([]);
    }
    // Reset state and city when country changes
    setFormData((prev) => ({ ...prev, state: "", city: "" }));
  }, [formData.country]);

  // Update available cities when state changes
  useEffect(() => {
    if (formData.state && indianCities[formData.state]) {
      setAvailableCities(indianCities[formData.state]);
    } else {
      setAvailableCities([]);
    }
    // Reset city when state changes
    setFormData((prev) => ({ ...prev, city: "" }));
  }, [formData.state]);

  console.log(formData);
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setImageUploadError(false);
    setUploading(true);

    try {
      if (files.length === 0) {
        setImageUploadError("Please select at least one image");
        return;
      }

      if (files.length + formData.imageUrls.length > 6) {
        setImageUploadError("You can only upload up to 6 images");
        return;
      }

      const formDataToUpload = new FormData();
      Array.from(files).forEach((file) => {
        formDataToUpload.append("images", file);
      });

      const response = await axios.post("/api/upload", formDataToUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds timeout
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      if (response.data.success) {
        setFormData({
          ...formData,
          imageUrls: [...formData.imageUrls, ...response.data.urls],
        });
        setImageUploadError(false);
        setFiles([]);
      } else {
        setImageUploadError(response.data.message);
      }
    } catch (error) {
      setImageUploadError(error.message || "Error uploading images");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include", // Important for cookies if you're using them
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error(error.message || "Image upload failed");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    } else if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.tagName.toLowerCase() === "select" // Handle select elements
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setShowCustomCity(selectedCity === "Other");
    setFormData((prev) => ({
      ...prev,
      city: selectedCity === "Other" ? "" : selectedCity,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          

          {/* Country Dropdown */}
          <select
            className="border p-3 rounded-lg"
            id="country"
            required
            onChange={handleChange}
            value={formData.country}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          {/* State Dropdown */}
          <select
            className="border p-3 rounded-lg"
            id="state"
            required
            onChange={handleChange}
            value={formData.state}
            disabled={!formData.country || formData.country === "Other"}
          >
            <option value="">Select State</option>
            {formData.country === "India" &&
              indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
          </select>

          {/* City Selection */}
          {formData.state && formData.state !== "Other" && (
            <div className="flex flex-col gap-2">
              <select
                className="border p-3 rounded-lg"
                id="city"
                required={!showCustomCity}
                onChange={handleCityChange}
                value={showCustomCity ? "Other" : formData.city}
              >
                <option value="">Select City</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              {showCustomCity && (
                <input
                  type="text"
                  placeholder="Enter City Name"
                  className="border p-3 rounded-lg"
                  id="city"
                  required
                  onChange={handleChange}
                  value={formData.city}
                />
              )}
              
            </div>
          )}

          {/* Show text input for city if country or state is "Other" */}
          {(formData.country === "Other" || formData.state === "Other") && (
            <input
              type="text"
              placeholder="City"
              className="border p-3 rounded-lg"
              id="city"
              required
              onChange={handleChange}
              value={formData.city}
            />
          )}
          
          <input
            type="text"
            placeholder="Area"
            className="border p-3 rounded-lg"
            id="area"
            required
            onChange={handleChange}
            value={formData.area}
          />
          <input
            type="text"
            placeholder="Full Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">(₹ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>

                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
