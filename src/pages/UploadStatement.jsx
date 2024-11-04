import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import { collection, getDocs, addDoc, query, where, getDoc, updateDoc } from 'firebase/firestore';
import { LoadingButton } from '@mui/lab';
import { db } from '../service/firebase';

function UploadStatement() {
    const { id } = useParams(); // Extract userId from URL parameters
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [loading, setLoading] = useState(false)
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
        // setLoading(true)

        if (fileExtension === 'csv') {
            handleCsvUpload();
        }
        //  else if (fileExtension === 'html') {
        // } 
        else {
            handleHtmlUpload();
            // alert('Unsupported file format. Please upload a CSV or HTML file.');
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
                    setTimeout(() => {
                        setLoading(false)
                        alert('CSV data uploaded successfully!');
                        setUploadMessage('CSV data uploaded successfully!');
                    }, 1500);
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

            try {
                // Parse HTML content with DOMParser
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');

                // Example 1: Get all text within a specific element (e.g., <body>)
                const bodyText = doc.body.innerText;
                // console.log("bodyText:", bodyText);

                // Regular expressions to extract each field
                const accountMatch = bodyText.match(/Account:\s*(-?\d+)/)?.[1]?.trim() || "";
                const nameMatch = bodyText.match(/Name:\s*([^\n]+)/)?.[1]?.trim().replace(/\s+/g, ' ') || "";
                const depositWithdrawalMatch = bodyText.match(/Deposit\/Withdrawal:\s*([-]?\d[\d\s.,]*)/)?.[1]?.trim().replace(/\s+/g, ' ') || "";
                const grossLossMatch = bodyText.match(/Gross Loss:\s*(-?[\d.,]+)/)?.[1]?.trim().replace(/\s+/g, ' ') || "";
                const grossProfitMatch = bodyText.match(/Gross Profit:\s*(-?[\d\s.,]+)/)?.[1]?.trim().replace(/\s+/g, ' ') || "";
                const closedPLMatch = bodyText.match(/Closed P\/L:\s*(-?[\d\s.,]+)/)?.[1]?.trim().replace(/\s+/g, ' ') || "";
                const totalNetProfitMatch = bodyText.match(/Total Net Profit:\s*(-?[\d.,]+)/)?.[1]?.trim() || "";
                const totalProfitPercentageMatch = bodyText.match(/Relative Drawdown:\s*(-?[\d.]+)/)?.[1]?.trim() || "";
                const balanceMatch = bodyText.match(/Balance:\s*(-?[\d\s.,]+)/)?.[1]?.trim().replace(/\s+/g, ' ') || "";
                const totalBalanceMatch = bodyText.match(/Withdrawal:\s*(-?[\d\s.,]+)/)?.[1]?.trim().replace(/\s+/g, ' ') || "";

                // console.log({
                //     accountMatch,
                //     nameMatch,
                //     depositWithdrawalMatch,
                //     grossLossMatch,
                //     grossProfitMatch,
                //     closedPLMatch,
                //     totalNetProfitMatch,
                //     totalProfitPercentageMatch,
                //     balanceMatch,
                //     totalBalanceMatch
                // });

                // Extract values or set default if not found
                // const accountNumber = accountMatch ? accountMatch[1] : 'Account number not found';
                // const name = nameMatch ? nameMatch[1].trim() : 'Name not found';
                // const closedPL = closedPLMatch ? closedPLMatch[1].trim() : 'Closed P/L not found';
                // const depositWithdrawal = depositWithdrawalMatch ? depositWithdrawalMatch[1] : 'Deposit/Withdrawal not found';
                // const grossLoss = grossLossMatch ? grossLossMatch[1].trim() : 'Gross Loss not found';
                // const totalNetProfit = totalNetProfitMatch ? totalNetProfitMatch[1].trim() : 'Total Net Profit not found';
                // const totalProfitPercentage = totalProfitPercentageMatch ? totalProfitPercentageMatch[1].trim() : 'Total Net Profit not found';
                // const balance = balanceMatch ? balanceMatch[1].trim() : "Not balance found"
                // const totalBalance = totalBalanceMatch ? totalBalanceMatch[1].trim() : "Not balance found"


                // console.log(totalBalance)
                // console.log("totalNetProfitMatch:", totalNetProfitMatch)
                // console.log("grossLoss:", grossLoss);
                // console.log("balance:", balance);
                // console.log("Name:", name);
                // console.log("Closed P/L:", closedPL);
                // // console.log("depositWithdrawalMatch:", depositWithdrawalMatch);
                // console.log("Deposit/Withdrawal:", depositWithdrawal);
                // console.log("Gross Loss:", grossLoss);
                // console.log("Total Net Profit:", totalNetProfit);

                const statementRef = collection(db, "statements")
                const q = query(statementRef, where("id", "==", id))
                const snapShot = await getDocs(q)
                if (!snapShot.empty) {
                    // If document exists, update it
                    const docRef = snapShot.docs[0].ref;
                    console.log(docRef)
                    await updateDoc(docRef, {
                        name: nameMatch,
                        closedPL: closedPLMatch,
                        depositWithdrawal: depositWithdrawalMatch,
                        grossLoss: grossLossMatch,
                        grossProfit: grossProfitMatch,
                        totalNetProfit: totalNetProfitMatch,
                        totalProfitPercentage: totalProfitPercentageMatch,
                        balance: balanceMatch,
                        totalBalance: totalBalanceMatch,
                    });
                    alert('Document updated successfully');
                    console.log('Document updated successfully');
                } else {

                    // Save parsed text data to Firestore (example)
                    await addDoc(collection(db, 'statements'), {
                        id,
                        accountNumber: accountMatch,
                        name: nameMatch,
                        closedPL: closedPLMatch,
                        depositWithdrawal: depositWithdrawalMatch,
                        grossLoss: grossLossMatch,
                        grossProfit: grossProfitMatch,
                        totalNetProfit: totalNetProfitMatch,
                        totalProfitPercentage: totalProfitPercentageMatch,
                        balance: balanceMatch,
                        totalBalance: totalBalanceMatch,
                    });

                    // Show success message
                    setTimeout(() => {
                        setLoading(false);
                        alert('HTML data uploaded successfully!');
                        setUploadMessage('HTML data uploaded successfully!');
                    }, 1500);
                }
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
                accept=".csv, .html, .htm"
                onChange={handleFileChange}
            />
            <LoadingButton size="large" loading={loading} type="submit" variant="contained" onClick={handleUpload}>Upload Statement</LoadingButton>
            {uploadMessage && <p>{uploadMessage}</p>} {/* Display upload status */}
        </div>
    );
}

export default UploadStatement;
