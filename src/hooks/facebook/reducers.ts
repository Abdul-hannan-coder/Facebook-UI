/**
 * Facebook Reducer
 */

import { FacebookState, FacebookAction } from './types';

export const initialState: FacebookState = {
  pages: [],
  userProfile: null,
  isConnected: false,
  isLoading: false,
  isConnecting: false,
  error: null,
  hasToken: false,
};

export const facebookReducer = (
  state: FacebookState,
  action: FacebookAction
): FacebookState => {
  switch (action.type) {
    case 'FACEBOOK_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'FACEBOOK_CONNECT_START':
      return {
        ...state,
        isConnecting: true,
        error: null,
      };

    case 'FACEBOOK_CONNECT_SUCCESS':
      return {
        ...state,
        isConnected: true,
        hasToken: true,
        isConnecting: false,
        error: null,
      };

    case 'FACEBOOK_PAGES_SUCCESS':
      return {
        ...state,
        pages: action.payload.pages,
        isConnected: action.payload.pages.length > 0,
        isLoading: false,
        error: null,
      };

    case 'FACEBOOK_PROFILE_SUCCESS':
      return {
        ...state,
        userProfile: action.payload.profile,
        isLoading: false,
        error: null,
      };

    case 'FACEBOOK_FAILURE':
      return {
        ...state,
        isLoading: false,
        isConnecting: false,
        error: action.payload.error,
      };

    case 'FACEBOOK_DISCONNECT':
      return {
        ...initialState,
      };

    case 'FACEBOOK_RESET_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'FACEBOOK_SET_TOKEN_STATUS':
      return {
        ...state,
        hasToken: action.payload.hasToken,
        isConnected: action.payload.hasToken,
      };

    default:
      return state;
  }
};

