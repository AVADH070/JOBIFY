import { createContext, useContext, useReducer, useState } from "react";
import {
  CLEAT_ALERT,
  DISPLAY_ALERT,

  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,

  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,

  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,

  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,

  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,

  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,

  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,

  DELETE_JOB_BEGIN,
  CHANGE_PAGE,
  SET_EDIT_JOB,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  HANDLE_CHANGE,
  CLEAR_VALUE,
  CLEAR_FILTER,
} from "./actions";

import axios from "axios";
import reducer from "./reducer";
const AppContext = createContext();

const user = localStorage.getItem('user');
const token = localStorage.getItem('token');
const userLocation = localStorage.getItem('location')

export const intialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  showSidebar: false,
  userLocation: userLocation || '',
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: userLocation || '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
}

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, intialState);

  const authFetch = axios.create({
    baseURL: '/api/v1',
  });

  authFetch.interceptors.request.use(
    (config) => {
      config.headers['Authorization'] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error.response);
      if (error.response.status === 401) {
        logoutUser()
      }
      return Promise.reject(error);
    }
  );
  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT })
    clearAlert();
  }

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAT_ALERT })
    }, 2000);
  }

  const addToLocalStore = ({ user, token, location }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  }

  const removeFromLocalStore = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("location")
  }

  const toggleSidebar = () => {
    dispatch({
      type: TOGGLE_SIDEBAR
    })
  }

  const logoutUser = () => {
    dispatch({
      type: LOGOUT_USER
    })
    removeFromLocalStore()
  }

  const handleChange = ({ name, value }) => {
    dispatch({
      type: HANDLE_CHANGE,
      payload: { name, value }
    })
  }

  const clearValue = () => {
    dispatch({
      type: CLEAR_VALUE
    })
  }

  const registerUser = async (currentUser) => {
    dispatch({
      type: REGISTER_USER_BEGIN
    })

    try {
      const response = await axios.post('/api/v1/auth/register', currentUser)
      const { user, token, location } = response.data;

      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: {
          user,
          token,
          location
        }
      })
      clearAlert()
      addToLocalStore({ user, token, location })
    } catch (error) {
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg }
      })
      clearAlert()
    }
  }


  const loginUser = async (currentUser) => {
    dispatch({
      type: LOGIN_USER_BEGIN
    })

    try {
      const { data } = await axios.post('/api/v1/auth/login', currentUser)
      const { user, token, location } = data;

      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {
          user,
          token,
          location
        }
      })
      addToLocalStore({ user, token, location })
    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
    clearAlert()
  }

  const updateUser = async (currentUser) => {
    dispatch({
      type: UPDATE_USER_BEGIN,
    })
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser)
      const { user, token, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, token, location }
      })
      addToLocalStore({ user, token, location })

    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg }
        })
      }
    }
    clearAlert()
  }

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN })

    const { position, company, jobLocation, jobType, status } = state
    try {
      await authFetch.post('/jobs', {
        position, company, jobLocation, jobType, status
      })
      dispatch({ type: CREATE_JOB_SUCCESS })
      dispatch({ type: CLEAR_VALUE })
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
    clearAlert()
  }

  const getJobs = async () => {

    const {page, search, searchStatus, searchType, sort } = state;
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }

    dispatch({ type: GET_JOBS_BEGIN })
    try {
      const { data } = await authFetch.get(url)
      const { jobs, totalJobs, numOfPages } = data
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      })
    } catch (error) {
      console.log(error.response)
      logoutUser()
    }
    clearAlert()
  }

  const setEditJob = (id) => {
    dispatch({
      type: SET_EDIT_JOB,
      payload: { id }
    })
  }

  const editJob = async () => {
    dispatch({
      type: EDIT_JOB_BEGIN
    })
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        position, company, jobLocation, jobType, status,
      })

      dispatch({ type: EDIT_JOB_SUCCESS })
      dispatch({ type: CLEAR_VALUE })
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }

  }

  const deleteJob = async (id) => {
    dispatch({
      type: DELETE_JOB_BEGIN
    })
    try {
      await authFetch.delete(`/jobs/${id}`)
      getJobs()
    } catch (error) {
      console.log(error.response);
      logoutUser()
    }
  }

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN })
    try {
      const { data } = await authFetch.get('/jobs/stats')
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications
        }
      })
    } catch (error) {
      console.log(error.response)
      logoutUser()
    }
  }

  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER })
  }

  const changePage = (page) => {
    dispatch({
      type: CHANGE_PAGE,
      payload: { page }
    })
  }
  return (
    < AppContext.Provider
      value={{ ...state, displayAlert, clearAlert, registerUser, loginUser, toggleSidebar, logoutUser, updateUser, handleChange, clearValue, createJob, getJobs, setEditJob, deleteJob, editJob, showStats, clearFilter, changePage }}
    >
      {children}
    </ AppContext.Provider>
  )
}
export const useGlobleContext = () => {
  return useContext(AppContext);
}

export { AppProvider }

