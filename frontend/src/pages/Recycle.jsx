import React, { useState } from 'react';

const RecycleSteps = ({ number, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
        <div className="flex items-center mb-4">
            <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                {number}
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
    </div>
);

const AcceptedItem = ({ name, details }) => (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <h4 className="font-semibold mb-2">{name}</h4>
        <p className="text-sm text-gray-600">{details}</p>
    </div>
);

const RecycleForm = () => {
    const [formData, setFormData] = useState({
        deviceType: '',
        condition: '',
        quantity: '1',
        description: '',
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        }
    });

    const [images, setImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            alert('You can only upload up to 5 images');
            return;
        }
        
        setImages(files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...imagePreview];
        URL.revokeObjectURL(newPreviews[index]); // Clean up URL object
        newPreviews.splice(index, 1);
        setImagePreview(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        
        // Append form data
        Object.keys(formData).forEach(key => {
            if (key === 'address') {
                Object.keys(formData.address).forEach(addressKey => {
                    formDataToSend.append(`address[${addressKey}]`, formData.address[addressKey]);
                });
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        // Append images
        images.forEach((image, index) => {
            formDataToSend.append('images', image);
        });

        try {
            // TODO: Add your API endpoint
            const response = await fetch('/api/recycle', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                alert('Thank you for your submission! We will contact you soon.');
                // Reset form
                setFormData({
                    deviceType: '',
                    condition: '',
                    quantity: '1',
                    description: '',
                    name: '',
                    email: '',
                    phone: '',
                    address: {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: ''
                    }
                });
                setImages([]);
                setImagePreview([]);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit form. Please try again.');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule a Pickup</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Device Information */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2">Device Type</label>
                        <select
                            name="deviceType"
                            value={formData.deviceType}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Device Type</option>
                            <option value="computer">Computer/Laptop</option>
                            <option value="mobile">Mobile Device</option>
                            <option value="appliance">Home Appliance</option>
                            <option value="battery">Batteries</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2">Condition</label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Condition</option>
                            <option value="working">Working</option>
                            <option value="partial">Partially Working</option>
                            <option value="broken">Not Working</option>
                        </select>
                    </div>
                </div>

                {/* Quantity and Description */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows="2"
                            required
                        ></textarea>
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                    <label className="block text-lg font-semibold">Product Images (Max 5)</label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                            max="5"
                        />
                        <label
                            htmlFor="image-upload"
                            className="bg-green-50 border-2 border-dashed border-green-500 rounded-lg p-6 cursor-pointer hover:bg-green-100 transition-colors w-full"
                        >
                            <div className="text-center">
                                <div className="text-green-500 text-3xl mb-2">📸</div>
                                <p className="text-sm text-gray-600">Click to upload images</p>
                                <p className="text-xs text-gray-500">{images.length}/5 images selected</p>
                            </div>
                        </label>
                    </div>
                    {imagePreview.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                            {imagePreview.map((url, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Address Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block mb-2">Street Address</label>
                            <input
                                type="text"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">City</label>
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">State</label>
                            <input
                                type="text"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">ZIP Code</label>
                            <input
                                type="text"
                                name="address.zipCode"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Country</label>
                            <input
                                type="text"
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    );
};

const Recycle = () => {
    const steps = [
        {
            title: "Prepare Your Items",
            description: "Remove personal data from devices. Package items securely to prevent damage during transport."
        },
        {
            title: "Fill Details",
            description: "Complete the form below with information about your e-waste items and your contact details."
        },
        {
            title: "Schedule Pickup",
            description: "We'll review your submission and contact you to arrange a convenient pickup time."
        }
    ];

    const acceptedItems = [
        { name: "Computers", details: "Laptops, desktops, servers, and components" },
        { name: "Mobile Devices", details: "Phones, tablets, and accessories" },
        { name: "Home Electronics", details: "TVs, gaming consoles, audio equipment" },
        { name: "Appliances", details: "Small household electronics and kitchen appliances" },
        { name: "Office Equipment", details: "Printers, scanners, fax machines" },
        { name: "Batteries", details: "All types of batteries and power banks" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">E-Waste Recycling Program</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Help protect the environment by responsibly recycling your electronic waste
                    </p>
                </div>

                {/* Process Steps */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {steps.map((step, index) => (
                            <RecycleSteps
                                key={index}
                                number={index + 1}
                                title={step.title}
                                description={step.description}
                            />
                        ))}
                    </div>
                </div>

                {/* Accepted Items */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">What We Accept</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {acceptedItems.map((item, index) => (
                            <AcceptedItem
                                key={index}
                                name={item.name}
                                details={item.details}
                            />
                        ))}
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Recycle With Us?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-green-500 text-4xl mb-4">♻️</div>
                            <h3 className="font-semibold mb-2">Environmental Impact</h3>
                            <p className="text-gray-600">Proper disposal reduces landfill waste and pollution</p>
                        </div>
                        <div className="text-center">
                            <div className="text-green-500 text-4xl mb-4">🔒</div>
                            <h3 className="font-semibold mb-2">Data Security</h3>
                            <p className="text-gray-600">Secure data destruction on all devices</p>
                        </div>
                        <div className="text-center">
                            <div className="text-green-500 text-4xl mb-4">📋</div>
                            <h3 className="font-semibold mb-2">Certification</h3>
                            <p className="text-gray-600">Receive recycling certificates for your records</p>
                        </div>
                    </div>
                </div>

                {/* Replace CTA section with Form */}
                <div className="mb-16">
                    <RecycleForm />
                </div>

                <div className="text-center text-gray-600 mt-8">
                    <p>Questions? Contact us at recycling@example.com</p>
                </div>
            </div>
        </div>
    );
};

export default Recycle;