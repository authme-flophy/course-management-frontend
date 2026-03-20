/**
 * Extracts a safe, serialisable string error message from an unknown API error response.
 *
 * @param {any} errorResponse - The raw API error object or string.
 * @param {string} fallbackMessage - A default message to return if parsing fails.
 * @returns {string} A guaranteed string error message.
 */
export const extractErrorMessage = (errorResponse, fallbackMessage = "An unexpected error occurred") => {
    if (!errorResponse) return fallbackMessage;

    // If it's already a string, return it directly.
    if (typeof errorResponse === 'string') {
        return errorResponse;
    }

    // Handle common API error object structures like { error: "msg" } or { detail: "msg" }
    if (typeof errorResponse === 'object') {
        if (errorResponse.detail && typeof errorResponse.detail === 'string') {
            return errorResponse.detail;
        }
        if (errorResponse.error && typeof errorResponse.error === 'string') {
            return errorResponse.error;
        }
        if (errorResponse.message && typeof errorResponse.message === 'string') {
            return errorResponse.message;
        }

        // If it's an object with array values (e.g. Django form errors like { username: ["This field is required."] })
        const values = Object.values(errorResponse);
        if (values.length > 0) {
            const firstValue = values[0];
            if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') {
                return firstValue[0];
            } else if (typeof firstValue === 'string') {
                return firstValue;
            }
        }
    }

    return fallbackMessage;
};
