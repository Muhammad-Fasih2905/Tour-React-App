import React from 'react'
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import Chatbot from '../Chatbot';

const ChatMiddle = () => {
    const user_id = sessionStorage.getItem('user_id');
    const pubnub = new PubNub({
        publishKey: 'pub-c-1fca1d75-9f1d-4579-afe1-3117de45012f',
        subscribeKey: 'sub-c-b0d2e173-95a2-40cb-9ccc-e58ed01a8d24',
        uuid: user_id !== null ? user_id : 'user1234'
    });
    return (
        <>
            <PubNubProvider client={pubnub}>
                <Chatbot />
            </PubNubProvider>
        </>
    )
}

export default ChatMiddle