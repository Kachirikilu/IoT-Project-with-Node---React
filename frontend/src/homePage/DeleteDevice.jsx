import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const DeleteDevice = ({
}) => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [devices, setDevices] = useState('');

    { id && (
        useEffect(() => { 
            const getDeviceById = async () => {
                try {
                  const response = await axios.get(`http://localhost:5000/devices/${id}`);
                  setDevices(response.data);
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

  const deleteDevice = async () => {
    try {
      await axios.delete(`http://localhost:5000/devices/${devices.id}`);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error(error.response.data);
      } else {
          console.error(error);
      }
    }
  };

  const handleClose = () => {
    navigate('/');
    };

  return (
    <div className="fixed block z-50 inset-0 backdrop-blur-sm backdrop-brightness-75 overflow-y-auto h-full w-full px-4">
      <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
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

        <div className="p-6 pt-0 text-center">
          <svg
            className="w-20 h-20 text-red-600 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
            Are you sure you want to delete this {devices.device}?
          </h3>
          <button
            onClick={deleteDevice}
            type="submit"
            className="text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition duration-200 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
          >
            Yes, I'm sure
          </button>
          <button
            onClick={handleClose}
            className="text-gray-900 bg-white hover:bg-gray-100 active:bg-gray-200 transition duration-200 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDevice;