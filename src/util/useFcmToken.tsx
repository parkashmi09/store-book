import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from './firease';
import {API_URL} from "@/util/base_url";

const useFcmToken = () => {
    const [token, setToken] = useState('');

    const [notificationPermissionStatus, setNotificationPermissionStatus] =
        useState('');

    const addNoti = async ( token:any) => {
        try {
            const response = await fetch(`${API_URL}/notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            if (!response.ok) {
                throw new Error('Failed to add notification.');
            }
            // console.log('Notification added successfully');
        } catch (error:any) {
            // console.error('Error adding notification:', error.message);

        }
    };

    useEffect(() => {
        const retrieveToken = async () => {
            try {
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                    const messaging = getMessaging(firebaseApp);

                    // Retrieve the notification permission status
                    const permission = await Notification.requestPermission();
                    setNotificationPermissionStatus(permission);

                    // Check if permission is granted before retrieving the token
                    if (permission === 'granted') {
                        const currentToken = await getToken(messaging, {
                            vapidKey:
                                'BLUO2eqzNUDwoDx15U-IAc6m_DgOBBn-lqVmYMGScR5gXrE_GssnvZscUtCtZORogKZ2whZFms0tgYVGk_hyjLA',
                        });
                        if (currentToken) {
                            setToken(currentToken);
                            addNoti(currentToken)
                        } else {
                            console.log(
                                'No registration token available. Request permission to generate one.'
                            );
                        }
                    }
                }
            } catch (error) {
                console.log('An error occurred while retrieving token:', error);
            }
        };

        retrieveToken();
    }, []);

    return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
