import React from 'react'
import PubNub from 'pubnub';
import { PubNubProvider, usePubNub } from 'pubnub-react';
import Chat from './Chat';

const MiddleScreen = () => {
    const user_id = sessionStorage.getItem('user_id');
    const pubnub = new PubNub({
        publishKey: 'pub-c-4c80f238-a997-4ce3-bf50-24ef4d1bc21c',
        subscribeKey: 'sub-c-7a96ab6c-5f71-4b3d-adde-3de6268dcd20',
        uuid: user_id
    });
    return (
        <PubNubProvider client={pubnub}>
          <Chat />
        </PubNubProvider>
    )
}

export default MiddleScreen