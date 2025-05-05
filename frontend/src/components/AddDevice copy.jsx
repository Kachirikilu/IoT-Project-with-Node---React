import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const AddDevice = ({ setDevices2, isOpen, device2, onClose, 
}) => {
    const { slug } = useParams();
    const [data, setDevices] = useState('');
    const [device, setDevice] = useState('');
    const [information, setInformation] = useState('');

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(null);
    const dropzoneRef = useRef(null);

    { slug && (
    useEffect(() => { 
        const getDeviceBySlug = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/devices/${slug}`);
                setDevices(response.data);
                setDevice(response.data.device);
                setInformation(response.data.information);
            } catch (error) {
                console.error(error);
            }
        };
        getDeviceBySlug();
    }, [slug])
    )}

    const handleDragOver = (e) => {
        e.preventDefault();
        dropzoneRef.current.classList.add('border-indigo-600');
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        dropzoneRef.current.classList.remove('border-indigo-600');
    };
    const handleDrop = (e) => {
        e.preventDefault();
        dropzoneRef.current.classList.remove('border-indigo-600');
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
        displayPreview(droppedFile);
    };
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        displayPreview(selectedFile);
    };

    const displayPreview = (file) => {
        if (!file) {
            alert('No file selected');
            setPreviewSrc(null);
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file (PNG, JPG, GIF)');
            setPreviewSrc(null);
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPreviewSrc(reader.result);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('device', device);
        formData.append('information', information);
        if (file) {
            formData.append('file', file);
        }

        try {
            if (slug) {
                const response = await axios.put(`http://localhost:5000/devices/${slug}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response.data);
            } else {
                const response = await axios.post('http://localhost:5000/devices', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response.data);
            }
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="max-w-md mx-auto flex justify-end">
                <button
                    onClick={() => navigate('/')}
                    className="mb-4 bg-blue-500 text-white px-9 py-1 rounded-md hover:bg-blue-600 active:bg-blue-700 transition duration-200 focus:outline-none focus:shadow-outline-blue"
                >
                    Back
                </button>
            </div>

            <div className="max-w-md mx-auto p-8 bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Add New Device</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="device" className="block text-gray-700 text-sm font-bold mb-2">
                            { slug ? 'Edit Device Name' : 'New Device Name' }
                        </label>
                        <input       
                            value={device}
                            onChange={(e) => setDevice(e.target.value)}
                            type="text"
                            id="device"
                            name="device"
                            placeholder="ESP32"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="information" className="block text-gray-700 text-sm font-bold mb-2">
                            { slug ? 'New More Information About Device' : 'More Information About Device' }
                        </label>
                        <textarea
                            value={information}
                            onChange={(e) => setInformation(e.target.value)}
                            id="information"
                            name="information"
                            rows="4"
                            required
                            placeholder="Specify the device information"
                            className="w-full min-h-11 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        ></textarea>
                    </div>

                    <div
                        ref={dropzoneRef}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className="my-6 relative border-2 border-gray-300 border-dashed rounded-lg p-6"
                    >
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 z-50"
                            onChange={handleFileChange}
                        />
                        <div className="text-center">
                            <img
                                className="mx-auto h-12 w-12"
                                src="https://www.svgrepo.com/show/357902/image-upload.svg"
                                alt=""
                            />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                <label htmlFor="file-upload" className="relative cursor-pointer">
                                    <span>Drag and drop</span>
                                    <span className="text-indigo-600"> or browse </span>
                                    <span>to upload</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        {previewSrc ? (
                            <img src={previewSrc} className="mt-4 mx-auto max-h-40" alt="Preview" />
                        ) : (
                            data.picture && (
                                <img
                                    src={`http://localhost:5000/public/pictures/${data.picture}`}
                                    className="mt-4 mx-auto max-h-40"
                                    alt="Device"
                                />
                            )
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 active:bg-blue-700 transition duration-200 focus:outline-none focus:shadow-outline-blue"
                    >
                         {slug ? 'Update Device' : 'Add Device'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddDevice;