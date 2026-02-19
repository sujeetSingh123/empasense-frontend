import axios, {
	AxiosError,
	type AxiosInstance,
	type AxiosResponse,
} from 'axios'

import { refreshToken } from './endpoints'
import { getErrorMessage } from '@/utils/error'
import {
	clearStorage,
	getLocalStorageRefreshToken,
	getToken,
	setRefreshToken,
	setToken,
} from '@/utils/localStorage'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const http = axios.create({
	baseURL: API_BASE_URL,
})

export function authHeader() {
	const idToken = getToken()

	return idToken
}



http.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data

		return response
	},
	async function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		// getRefreshToken();
		if (error?.response?.status === 401 ) {
			// clearStorage();
			// window.location.href = '/';
			await getRefreshToken(error, http)
		}
		// window.location.href = '/';

		return Promise.reject(error)
	}
)

export const getRefreshToken = async (
	error: AxiosError,
	parentHttp: AxiosInstance,
	isLegacy?: boolean
) => {
	const originalRequest = error.config
	const localStorageRefreshToken = getLocalStorageRefreshToken()
	if (localStorageRefreshToken) {
		try {
			const response = await axios({
				method: 'get',
				url: API_BASE_URL + refreshToken,
				headers: {
					Authorization: 'Bearer ' + localStorageRefreshToken,
				},
			})

			if (originalRequest?.headers && response.status === 200) {
				const authorization = isLegacy
					? response.data.authJwtToken
					: 'Bearer ' + response.data.authJwtToken
				setToken(response.data.authJwtToken)
				setRefreshToken(response.data.refreshToken)

				// @ts-expect-error - originalRequest may have flexible header typings
				originalRequest['headers'] = {
					...originalRequest.headers,
					Authorization: authorization,
				}

				return parentHttp
					.request(originalRequest)
					.then((response: AxiosResponse) => response)
					.catch((error: AxiosError) => {
						throw error
					})
			}
		} catch (error: unknown) {
			// handle axios-like error - if refresh token fails, logout the user
			// Logout on any error (401, network error, etc.) when refresh token fails
			clearStorage()
			window.location.href = '/'
			const message = getErrorMessage(error)
			throw new Error(message || 'Unable to complete request')
		}
	} else {
		// No refresh token available, logout the user
		clearStorage()
		window.location.href = '/'
	}
}

export default http
