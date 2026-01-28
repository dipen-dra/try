import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import axios from 'axios';

const DonationSuccessPage = () => {
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const location = useLocation();
    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

    useEffect(() => {
        const verifyPayment = async () => {
            const params = new URLSearchParams(location.search);
            const pidx = params.get('pidx');

            if (!pidx) {
                setStatus('error');
                return;
            }

            try {
                const response = await axios.post(`${backendUrl}/api/donations/khalti-verify`, { pidx });
                if (response.data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('error');
            }
        };

        verifyPayment();
    }, [location.search, backendUrl]);

    if (status === 'verifying') {
        return (
            <div className="text-center py-20">
                <Loader2 className="mx-auto h-16 w-16 text-blood-500 animate-spin" />
                <h2 className="mt-4 text-2xl font-bold text-gray-800">Verifying Payment...</h2>
                <p className="text-gray-600 mt-2">Please wait while we confirm your donation.</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center py-20">
                <XCircle className="mx-auto h-16 w-16 text-red-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-800">Verification Failed</h2>
                <p className="text-gray-600 mt-2">We couldn't verify your payment. Please contact support.</p>
                <Link to="/" className="mt-6 inline-block bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold">
                    Return to Homepage
                </Link>
            </div>
        );
    }

    return (
        <div className="text-center py-20">
            <CheckCircle className="mx-auto h-16 w-16 text-blood-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Thank You!</h2>
            <p className="text-gray-600 mt-2">Your donation has been successfully processed and verified.</p>
            <Link to="/" className="mt-6 inline-block bg-blood-600 text-white px-8 py-3 rounded-lg font-semibold">
                Go to Homepage
            </Link>
        </div>
    );
};

export default DonationSuccessPage;

