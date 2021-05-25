import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation, useParams } from 'react-router';
import { authenticationFetchSelector, LoginResponse, LoginResponseKey, setUserLoggedIn } from '../slices/authenticationSlice';




const Login = () => {
    const { userLoggedIn } = useSelector(authenticationFetchSelector)
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        if (window.location.href.includes("?")) {
            const query = window.location.href.split("?")[1]
            const params = query.split("&").filter(val => !!val)
            let loginResponse: LoginResponse = {}

            params.forEach(param => {
                const [key, val] = param.split("=")
                loginResponse[key as LoginResponseKey] = val
            })

            if (loginResponse.access_token) {
                dispatch(setUserLoggedIn(loginResponse))
            }
        }
    }, [userLoggedIn])


    if (userLoggedIn.access_token) {
        return <Redirect to="/"></Redirect>
    }

    return <div></div>
}

export default Login