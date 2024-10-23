import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../service/firebase';

function UploadStatement() {
    const { id } = useParams(); // Extract userId from URL parameters
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
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

    // Handle file upload (CSV or HTML)
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Parse and save CSV or HTML data to Firestore
    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (fileExtension === 'csv') {
            handleCsvUpload();
        } else if (fileExtension === 'html') {
            handleHtmlUpload();
        } else {
            alert('Unsupported file format. Please upload a CSV or HTML file.');
        }
    };

    // Function to handle CSV file upload
    const handleCsvUpload = () => {
        Papa.parse(file, {
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
                    alert('CSV data uploaded successfully!');
                    setUploadMessage('CSV data uploaded successfully!');
                } catch (error) {
                    console.error('Error uploading CSV data:', error);
                    alert('Error uploading CSV data. Please try again.');
                    setUploadMessage('Error uploading CSV data. Please try again.');
                }
            },
        });
    };

    // Function to handle HTML file upload
    const handleHtmlUpload = async () => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const htmlContent = event.target.result;
            // console.log(htmlContent)
            try {
                // Parse HTML content here (basic example)
                const parser = new DOMParser();
                // console.log("parser", parser)

                const doc = parser.parseFromString(htmlContent, 'text/html');
                // Extract user details (personal information)
                const userDetails = Array.from(doc.querySelectorAll('div')).find(div =>
                    div.textContent.includes("Account") && div.textContent.includes("Name")
                )?.textContent.split('|').reduce((acc, info) => {
                    const [key, value] = info.split(':').map(str => str.trim());
                    if (key && value) {
                        acc[key.toLowerCase()] = value;
                    }
                    return acc;
                }, {});

                // Extract transaction details from the Closed Transactions table
                const transactions = Array.from(doc.querySelectorAll('table')).flatMap((table) => {
                    if (table.previousElementSibling?.textContent.includes('Closed Transactions')) {
                        const rows = Array.from(table.querySelectorAll('tr')).slice(1); // Skip header row
                        return rows.map((row) => {
                            const cells = row.querySelectorAll('td');
                            return {
                                ticket: cells[0]?.textContent.trim() || '',
                                openTime: cells[1]?.textContent.trim() || '',
                                type: cells[2]?.textContent.trim() || '',
                                size: cells[3]?.textContent.trim() || '',
                                item: cells[4]?.textContent.trim() || '',
                                price: cells[5]?.textContent.trim() || '',
                                sl: cells[6]?.textContent.trim() || '',
                                tp: cells[7]?.textContent.trim() || '',
                                closeTime: cells[8]?.textContent.trim() || '',
                                closePrice: cells[9]?.textContent.trim() || '',
                                commission: cells[10]?.textContent.trim() || '',
                                taxes: cells[11]?.textContent.trim() || '',
                                swap: cells[12]?.textContent.trim() || '',
                                profit: cells[13]?.textContent.trim() || '',
                            };
                        });
                    }
                    return [];
                });

                const normalizeKey = (key) => key.replace(/[^\w]+/g, '_').toLowerCase();

                // Extract summary information
                const summary = Array.from(doc.querySelectorAll('h2')).find(h2 =>
                    h2.textContent.includes('Summary')
                )?.nextElementSibling.textContent.split('\n').reduce((acc, line) => {
                    const [key, value] = line.split(':').map(str => str.trim());
                    console.log(acc)
                    console.log(key, value)
                    if (key && value) {
                        acc[normalizeKey(key)] = value;
                    }
                    return acc;
                }, {});

                // Log the results
                console.log("User Details:", userDetails);
                console.log("Transactions:", transactions);
                console.log("Summary:", summary);

                // console.log("data", userDetails)
                // Upload the parsed HTML data to Firestore
                // const promises = dataRows.map(async (row) => {
                // return 
                addDoc(collection(db, 'statements'), {
                    id,
                    user: userDetails, transactions, summary
                });
                // });
                // await Promise.all(promises);
                // alert('HTML data uploaded successfully!');
                setUploadMessage('HTML data uploaded successfully!');
            } catch (error) {
                console.error('Error uploading HTML data:', error);
                alert('Error uploading HTML data. Please try again.');
                setUploadMessage('Error uploading HTML data. Please try again.');
            }
        };

        reader.readAsText(file); // Read the HTML file content
    };

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div>
            <h1>Upload Statement for {user.email}</h1> {/* Display user email */}
            <input
                type="file"
                accept=".csv, .html"
                onChange={handleFileChange}
            />
            <button onClick={handleUpload}>Upload Statement</button>
            {uploadMessage && <p>{uploadMessage}</p>} {/* Display upload status */}
        </div>
    );
}

export default UploadStatement;
