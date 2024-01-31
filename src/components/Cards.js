import React from 'react';
import './Cards.css';
import CardItem from './CardItem';
import {Custbutton} from './Custbutton';
function Cards() {
  return (
    <div className='cards'>
      <h1>Check out these EPIC Destinations!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/img-9.jpg'
              text='Explore the hidden waterfall deep inside the North of Pakistan'
              label='Adventure'
              path='/services'
            />
            
            <CardItem
              src='images/img-11.webp'
              text='Travel through the Charna Island in a Private Cruise'
              label='Luxury'
              path='/services'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/img-3.jpg'
              text='Set Sail in the Arabian Sea visiting Uncharted Waters'
              label='Mystery'
              path='/services'
            />
            <CardItem
              src='images/60180818a5741.jpg'
              text='Experience Cricket in between the large Gwadar Hills'
              label='Adventure'
              path='/products'
            />
            <CardItem
              src='images/desert41-1024x640.jpg'
              text='Ride through the Desert of Pakistan on a guided camel tour'
              label='Adrenaline'
              path='/sign-up'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/MC1.jpg'
              text='Want a clean blue swimming pool in middle of mountains, try MOOLA CHOTOK!'
              label='Mystery'
              path='/services'
            />
            <CardItem
              src='images/NK.jpg'
              text='Naran is a valley with lush green mountains, blue lakes and meadows'
              label='Adventure'
              path='/products'
            />
            <CardItem
              src='images/sv.jpg'
              text='Experience the coldness of the Switzerland of Pakistan, SWAT VALLEY'
              label='Adrenaline'
              path='/sign-up'
            />
          </ul>
        </div>
        <Custbutton
        className='btns'
        buttonStyle='btn--outline'
        buttonSize='btn--large'
        >
        Customize Package
        </Custbutton>
      
      </div>
    </div>
  );
}

export default Cards;
