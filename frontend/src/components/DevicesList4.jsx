import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import AddDevice from './AddDevice';
import DeleteDevice from './DeleteDevice';

export const DevicesList = () => {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

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

    // socket.on('deviceDelete', (deletedDeviceId) => {
    //   setDevices((prevDevices) => prevDevices.filter((d) => d.id !== deletedDeviceId));
    // });

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
      console.error(error);
    }
  };




  const openAddEdit = (id) => {
    if (id === 0) {
      setSelectedDevice(0);
    } else {
      const device = devices.find((d) => d.id === id);
      setSelectedDevice(device);
    }
    navigate('/add');
    setIsAddEditOpen(true);
  }
  const openDelete = (id) => {
    const device = devices.find((d) => d.id === id);
    setSelectedDevice(device);
    setIsDeleteOpen(true);
    // document.body.classList.add('overflow-y-hidden');
  }
  const closeAll = () => {
    setIsAddEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedDevice(null);
    // document.body.classList.remove('overflow-y-hidden');
  };
 

  return (
    <div>

      <div className='h-screen overflow-auto'>
        <div className='mt-5 mx-5 md:mx-10 flex justify-end'>
          <button
              onClick={() => openAddEdit(0)}
              disabled={isAddEditOpen || isDeleteOpen}
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
                              <button onClick={() => openAddEdit(device.id)} disabled={isAddEditOpen || isDeleteOpen} className="active:scale-102 hover:scale-105 transition duration-200 bg-yellow-500 active:bg-yellow-600 text-white font-bold w-25 h-7 mb-3 py-1 px-2 rounded-md text-xs">Edit</button>
                  
                              <button onClick={() => openDelete(device.id)} disabled={isAddEditOpen || isDeleteOpen} className="active:scale-102 hover:scale-105 transition duration-200 bg-red-600 active:bg-red-700 text-white font-bold w-25 h-7 py-1 px-2 rounded-md text-xs">Delete</button>
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

        <DeleteDevice
          setDevices={setDevices}
          isOpen={isDeleteOpen}
          device={selectedDevice}
          onClose={closeAll}
        />

        <AddDevice
          isOpen={isAddEditOpen}
          deviceData={selectedDevice}
          onClose={closeAll}
        />

      </div>
    </div>      
  );
  


//   return (
//     <div className='container w-full mx-auto px-12 py-4 rounded-md bg-gray-100'>
//       <h1 className='text-3xl font-bold text-center mt-4 mb-8'>Device List</h1>
//       <div className='grid grid-cols-3 gap-8'>
//       {devices.map((device, index) => (
//         <div key={device.id} className='p-1 bg-white shadow rounded-md w-full aspect-[2/1] flex'>
//             <img
//                 className='w-1/2 shadow-[1px_0_4px_rgba(0,0,0,0.1)] rounded-md h-full object-cover'
//                 src={`/image/${device.picture}`}
//                 alt={device.device}
//             />
//           <div className='py-4 w-1/2 text-left pl-5'>
//               <div className='text-gray-500 font-bold'>{device.device}</div>
//               <div className='text-gray-400'>{device.information}</div>
//               <div>
//                 <button className='text-sm text-white btn btn-sm bg-yellow-500 rounded min-w-20 py-1 mt-4'>
//                   Edit
//                 </button>
//               </div>
//               <div>
//                 <button className='text-sm text-white btn btn-sm bg-red-600 rounded min-w-20 py-1 mt-1'>
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
};

export default DevicesList;