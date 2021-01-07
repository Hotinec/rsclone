import React from 'react';
import {NavLink} from 'react-router-dom'
import './menu.css'


export const Menu = () => {
    return (
        <section className='menu-wrapper'>
            <ul className='menu'>
                <li>
                    <NavLink to='/start' className='menu-link'>
                        Start
                    </NavLink>
                </li>
            </ul>

        </section>
    );
};

