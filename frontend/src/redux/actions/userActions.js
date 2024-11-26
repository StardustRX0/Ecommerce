import { 
    userLoginRequest, 
    userLoginSuccess, 
    userLoginFailure 
} from "../slices/userSlices/userInfoSlice";
import { 
    userDetailRequest, 
    userDetailSuccess, 
    userDetailFailure 
} from "../slices/userSlices/userDetailsSlice";
import { 
    userUpdateRequest, 
    userUpdateSuccess, 
    userUpdateFailure 
} from "../slices/userSlices/userUpdateSlice";
import { userLogout } from "../slices/userSlices/userInfoSlice";
import { userDetailReset } from "../slices/userSlices/userDetailsSlice";
import { orderUserListReset } from "../slices/orderSlices/orderUserListSlice";
import { 
    userRegisterRequest, 
    userRegisterSuccess, 
    userRegisterFailure 
} from "../slices/userSlices/userRegisterSlice";
import { 
    userListRequest, 
    userListSuccess, 
    userListFailure 
} from "../slices/userSlices/userListSlice";
import { 
    userDeleteRequest, 
    userDeleteSuccess, 
    userDeleteFailure 
} from "../slices/userSlices/userDeleteSlice";
import { 
    userUpdateAdminRequest, 
    userUpdateAdminSuccess, 
    userUpdateAdminFailure, 
    // userUpdateAdminReset 
} from "../slices/userSlices/userUpdateAdminSlice";
import axios from "axios";


export const fetchUserInfo = (username, password) => async (dispatch) => {
    try {
        dispatch(userLoginRequest());
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };
        const { data } = await axios.post(
            `/api/users/login`, 
            { username, password }, 
            config
        );
        dispatch(userLoginSuccess(data));
        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
        dispatch(userLoginFailure(
            error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        ));
    }
  };

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch(userLogout());
    dispatch(userDetailReset());
    dispatch(orderUserListReset());
    // dispatch({ type: USER_LIST_RESET })
}

export const register = (username, email, password, password_confirm) => async (dispatch) => {
    try {
        dispatch(userRegisterRequest());
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };

        const { data } = await axios.post(
            `/api/users/register`,
            { 
                'username': username,
                'email': email,
                'password': password,
                'password_confirm': password_confirm
            },
            config
        );

        dispatch(userRegisterSuccess(data));
        dispatch(userLoginSuccess(data));
        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        dispatch(userRegisterFailure(
            error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        ));
    }
};

export const fetchUserDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch(userDetailRequest());
        const {
            userInfo: { user },
        } = getState();
        
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${user.token}`
            }
        };

        const { data } = await axios.get(`/api/users/${id}`, config);
        dispatch(userDetailSuccess(data));
    }
    catch (error) {
        dispatch(userDetailFailure(
            error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        ));
    }
  };

  export const updateUserDetails = (userUpdateDetail) => async (dispatch, getState) => {
    try {
        dispatch(userUpdateRequest());
        const {
            userInfo: { user },
        } = getState();

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${user.token}`
            }
        };

        const { data } = await axios.put(`/api/users/update`, userUpdateDetail,
        config,
        )
        dispatch(userUpdateSuccess(data));
        dispatch(userLoginSuccess(data));
        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch(userUpdateFailure(
            error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        ));
    }
  };

  export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch(userListRequest());

        const {
            userInfo: { user },
        } = getState();

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${user.token}`
            }
        };

        const { data } = await axios.get(
            `/api/users/`,
            config
        );

        dispatch(userListSuccess(data));

    } catch (error) {
        dispatch(userListFailure(
            error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        ));
    }
};

export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch(userDeleteRequest());

        const {
            userInfo: { user },
        } = getState();

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${user.token}`
            }
        };

        const { data } = await axios.delete(
            `/api/users/delete/${id}/`,
            config
        );

        dispatch(userDeleteSuccess(data));

    } catch (error) {
        dispatch(userDeleteFailure(
            error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        ));
    }
};

export const updateUser = (userUpdate) => async (dispatch, getState) => {
    try {
        dispatch(userUpdateAdminRequest());

        const {
            userInfo: { user },
        } = getState();

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${user.token}`
            }
        };

        const { data } = await axios.put(
            `/api/users/update/${userUpdate.id}/`,
            userUpdate,
            config
        );

        dispatch(userUpdateAdminSuccess(data));

    } catch (error) {
        dispatch(userUpdateAdminFailure(
            error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        ));
    }
};
