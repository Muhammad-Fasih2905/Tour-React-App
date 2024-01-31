import React from 'react'
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import Chat from './Chat';

const AdminChatMiddle = () => {
    const admin_id = sessionStorage.getItem('admin_id');
    const pubnub = new PubNub({
        publishKey: 'pub-c-1fca1d75-9f1d-4579-afe1-3117de45012f',
        subscribeKey: 'sub-c-b0d2e173-95a2-40cb-9ccc-e58ed01a8d24',
        uuid: admin_id !== null ? admin_id : 'admin1234'
    });
    return (
        <>
            <PubNubProvider client={pubnub}>
                <Chat />
            </PubNubProvider>
        </>
    )
}

export default AdminChatMiddle