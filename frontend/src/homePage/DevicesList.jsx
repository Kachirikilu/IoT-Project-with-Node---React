import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
// import AddDevice from './AddDevice';
// import DeleteDevice from './DeleteDevice';

import { Outlet } from 'react-router-dom';

export const DevicesList = ( userLog ) => {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('http://localhost:5000');
 
    socket.on('deviceUpdate', (updatedDevice) => {
      setDevices((prevDevices) => {
        const existingDeviceIndex = prevDevices.findIndex((d) => d.id === updatedDevice.id);

        if (existingDeviceIndex !== -1) {
          const updatedDevices = [...prevDevices];
          updatedDevices[existingDeviceIndex] = updatedDevice;
          return updatedDevices;
        } else {
          return [...prevDevices, updatedDevice];
        }
      });
    });
    socket.on('deviceDelete', (deletedDeviceId) => {
      setDevices((prevDevices) => prevDevices.filter((d) => d.id !== deletedDeviceId));
    });

    getDevices();

    return () => {
      socket.disconnect();
    };
  }, []);

  const getDevices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/devices');
      setDevices(response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error(error.response.data);
      } else {
          console.error(error);
      }
    }
  };

  const openAddEdit = (id) => {
    if (id === null) {
      navigate('/add_device');
    } else {
      navigate(`/edit_device/${id}`);
    }
  }
  const openDelete = (id) => {
    navigate(`/delete_device/${id}`);
  }

  const handleLogin = () => {
    navigate(`/login`);
  }
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/logout", { withCredentials: true });
      console.log("Logout berhasil");
      // Redirect atau update state setelah logout
    } catch (error) {
      console.error("Logout gagal", error.response?.data?.msg);
    }
  };

  return (
    <div>

      <div className='h-screen overflow-auto'>
        
        <div className="mt-5 mx-5 md:mx-10 flex flex-row items-center justify-end gap-4">
          { userLog?.userLog ? (<>
            <button onClick={() => handleLogout()} className="rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 transition duration-200 px-4 py-2 font-bold leading-none text-white">Logout</button>
            <button className="font-bold text-red-600 hover:text-red-700 active:text-red-800 transition duration-200">Delete Account</button>
          </>) : (<>
            <button onClick={() => handleLogin()} className="rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition duration-200 px-4 py-2 font-bold leading-none text-white">Login</button>
          </>)}
        </div>

        <div className='mt-5 mx-5 md:mx-10 flex justify-end'>
          <button
              onClick={() => openAddEdit(null)}
              // disabled={isAddEditOpen || isDeleteOpen}
              className="pb-1 mb-4 bg-blue-500 text-white px-9 py-1 rounded-md hover:bg-blue-600 active:bg-blue-700 transition duration-200 focus:outline-none focus:shadow-outline-blue"
            >
              Add Device
            </button>
        </div>

          <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10 mb-40">        
              <table className="w-full rounded-lg">
                  <thead>
                      <tr className="bg-blue-400 text-center text-white font-bold uppercase">
                          <th className="py-4 px-2">No</th>
                          <th className="py-4 px-2">ID</th>
                          <th className="w-4/11 py-4 px-6">Picture</th>
                          <th className="w-3/11 py-4 px-6">Device</th>
                          <th className="w-3/11 py-4 px-6">Information</th>
                          <th className="py-4 px-6">Tools</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white">
                    {devices.length > 0 ? (
                      devices.slice().sort((a, b) => b.id - a.id).map((device, index) => (
                        <tr key={device.id} className='group hover:bg-gray-100 transition duration-200'>
                          <td className="bg-gray-100 py-2 px-4 border-r border-gray-200">{index+1}</td>
                          <td className="py-2 px-4 border-b border-gray-200">{device.id}</td>
                          <td className="py-2 px-4 border-b border-gray-200">
                            <img
                              className='group-hover:scale-104 transition duration-200 aspect-[4/3] object-cover rounded-md'
                              src={`http://localhost:5000/public/pictures/${device.picture}`}
                              alt={device.picture}
                            />
                          </td>
                          <td className="break-all py-2 px-4 border-b border-gray-200">{device.device}</td>
                          <td className="py-2 px-4 border-b border-gray-200">{device.information}</td>
                          <td className="py-2 px-4 border-b border-gray-200">
                            <div className="flex flex-col item-center">
                              {/* <button onClick={() => navigate('/edit_device/' + device.id)} className="active:scale-102 hover:scale-105 transition duration-200 bg-yellow-500 active:bg-yellow-600 text-white font-bold w-25 h-7 mb-3 py-1 px-2 rounded-md text-xs">Edit</button> */}
                              <button onClick={() => openAddEdit(device.id)} className="active:scale-102 hover:scale-105 transition duration-200 bg-yellow-500 active:bg-yellow-600 text-white font-bold w-25 h-7 mb-3 py-1 px-2 rounded-md text-xs">Edit</button>
                  
                              <button onClick={() => openDelete(device.id)} className="active:scale-102 hover:scale-105 transition duration-200 bg-red-600 active:bg-red-700 text-white font-bold w-25 h-7 py-1 px-2 rounded-md text-xs">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-2 px-4 border-b border-gray-200">No devices available!</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        <Outlet />
      </div>
    </div>      
  );
  

};

export default DevicesList;