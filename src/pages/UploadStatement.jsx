import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
// import { ToastContainer, toast } from 'material-react-toastify'; // Correct import
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../service/firebase';

function UploadStatement() {
    const { id } = useParams(); // Extract userId from URL parameters
    const [user, setUser] = useState(null);
    const [csvFile, setCsvFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');

    // Fetch user data from Firestore
    useEffect(() => {
        const fetchUser = async () => {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const userList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const filteredUser = userList.find((u) => u.id === id);
            setUser(filteredUser);
        };

        fetchUser();
    }, [id]);

    // Handle CSV file upload
    const handleFileChange = (event) => {
        setCsvFile(event.target.files[0]);
    };

    // Parse CSV and save data to Firestore
    const handleUpload = async () => {
        if (!csvFile) {
            alert('Please select a CSV file to upload.'); // Show error toast
            return;
        }

        Papa.parse(csvFile, {
            header: true, // Assuming the CSV has a header row
            complete: async (results) => {
                try {
                    const promises = results.data.map(async (row) => {
                        return addDoc(collection(db, 'statements'), {
                            id,
                            ...row,
                        });
                    });
                    await Promise.all(promises);
                    alert("CSV data uploaded successfully!"); // Success toast
                    setUploadMessage('CSV data uploaded successfully!');
                } catch (error) {
                    console.error('Error uploading data:', error);
                    alert('Error uploading data. Please try again.'); // Error toast
                    setUploadMessage('Error uploading data. Please try again.');
                }
            },
        });
    };

    if (!user) {
        return <div>Loading user data...</div>; // Optional loading state
    }

    return (
        <div>
            {/* <ToastContainer /> */}
            <h1>Upload Statement for {user.email}</h1> {/* Display user email */}
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
            />
            <button onClick={handleUpload}>Upload Statement</button>
            {uploadMessage && <p>{uploadMessage}</p>} {/* Display upload status */}
        </div>
    );
}

export default UploadStatement;
