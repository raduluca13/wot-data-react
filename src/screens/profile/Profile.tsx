import React from 'react';
import { useSelector } from 'react-redux';
import { authenticationFetchSelector } from '../../slices/authenticationSlice';

const Profile = () => {
    const { userLoggedIn } = useSelector(authenticationFetchSelector)

    return <div>{userLoggedIn.nickname} {userLoggedIn.account_id} </div>
}

export default Profile;