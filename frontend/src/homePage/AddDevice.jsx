import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export const AddDevice = ({
}) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [devices, setDevices] = useState('');
    const [device, setDevice] = useState('');
    const [information, setInformation] = useState('');

    const [deviceErr, setDeviceErr] = useState('');
    const [informationErr, setInformationErr] = useState('');
    const [pictureErr, setPictureErr] = useState('');

    const [file, setFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(null);
    const dropzoneRef = useRef(null);

    { id && (
        useEffect(() => { 
            const getDeviceById = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/devices/${id}`);
                    setDevices(response.data);
                    setDevice(response.data.device);
                    setInformation(response.data.information);
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        console.error(error.response.data);
                    } else {
                        console.error(error);
                    }
                }
            };
            getDeviceById();
        }, [id])
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
            if (id) {
                const response = await axios.put(`http://localhost:5000/devices/${id}`, formData, {
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
            const e = error.response
            if (e && e.status === 400) {
                console.error(e.data)
                setDeviceErr(e.data.device)
                setInformationErr(e.data.information)
                setPictureErr(e.data.picture)
            } else {
                console.error(error)
            }
        }
    };

    const handleClose = () => {
        navigate('/');
    };

    return (
        <div className="fixed block z-50 inset-0 backdrop-blur-sm backdrop-brightness-75 overflow-y-auto h-full w-full px-4">

            <div className="relative my-10 max-w-md mx-auto bg-white rounded-md shadow-lg">
                <div className="flex justify-end p-2">
                    <button
                        onClick={handleClose}
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-100 active:bg-gray-200 hover:text-gray-900 transition duration-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    >
                        <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        ></path>
                        </svg>
                    </button>
                </div>
                <div className='px-8 pb-8'>
                    <h2 className="text-2xl font-semibold mb-6"> { id ? 'Edit Device' : 'Add New Device' }</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="device" className="block text-gray-700 text-sm font-bold mb-2">
                                { id ? 'Edit Device Name' : 'New Device Name' }
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
                            { deviceErr &&
                            <p className="text-red-500 text-sm mt-1">{deviceErr}</p>
                            }
                        </div>
                

                        <div className="mb-6">
                            <label htmlFor="information" className="block text-gray-700 text-sm font-bold mb-2">
                                { id ? 'New More Information About Device' : 'More Information About Device' }
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
                            { informationErr &&
                                <p className="text-red-500 text-sm">{informationErr}</p>
                            }
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
                            { previewSrc ? (
                                <img src={previewSrc} className="mt-4 mx-auto max-h-40" alt="Preview" />
                            ) : (
                                id && devices.picture && (
                                    <img
                                        src={`http://localhost:5000/public/pictures/${devices.picture}`}
                                        className="mt-4 mx-auto max-h-40"
                                        alt="Device"
                                    />
                                )
                            )}
                            { pictureErr &&
                                <p className="text-red-500 text-sm mt-2 text-center">{pictureErr}</p>
                            }
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 active:bg-blue-700 transition duration-200 focus:outline-none focus:shadow-outline-blue"
                        >
                            {id ? 'Update Device' : 'Add Device'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDevice;