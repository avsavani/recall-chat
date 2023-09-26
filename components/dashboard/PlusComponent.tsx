import React, { useState, useEffect } from 'react';
import va from '@vercel/analytics';
import Multiload from "../Upload/Upload"
import { Button } from '../shadui/button';
import mixpanel from '@/lib/initMixpanel';
import { useTheme } from 'next-themes'
import { FiUpload } from 'react-icons/fi';
import { useStore } from '@/lib/globalState';

const PlusComponent = (userId) => {
    const [isOpen, setIsOpen] = useState(false);
    const { loadingStatus, setLoadingStatus } = useStore();
    const [uploadComplete, setUploadComplete] = useState(false);
    useEffect(() => {
        const closeOnEscapeKeyDown = (e) => {
            if ((e.charCode || e.keyCode) === 27) {
                setIsOpen(false);
            }
        }
        document.body.addEventListener('keydown', closeOnEscapeKeyDown);

        //clean up function to remove event listener when this component is unmounted
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
        }
    }, []);

    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);

    }

    return (
        <div>
            <Button
                className=" bg-blue-700 text-white"
                variant="outline"
                disabled={loadingStatus === 'loading'}
                size='default'
                onClick={() => {
                    mixpanel.track("Upload Clicked", { user_id: userId });
                    va.track('Upload', { location: 'Dashboard' });
                    handleOpenModal();
                }}
            >
                <FiUpload className="mr-2 h-4 w-4" /> Upload Meeting
            </Button>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '1em',
                    zIndex: 1000
                }}>
                    <Multiload handleCloseModal={handleCloseModal} />

                </div>
            )}
            {isOpen && <div style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 999,
                backdropFilter: 'blur(5px)' // Add this line for the blur effect
            }} onClick={handleCloseModal}></div>}
        </div>
    );
};

export default PlusComponent;


