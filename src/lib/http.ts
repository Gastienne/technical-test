interface FetchOptions extends RequestInit {
  // number of retries before returning the error
  retries?: number;

  // timeout in milliseconds to not exceed to receive a response from server
  timeout?: number;
}
class FetchError extends Error {
  response: Response;

  constructor(response: Response, message?: string) {
    super(message);

    this.response = response;
  }

  getResponse(): Response {
    return this.response;
  }
}

const fetchWithThrow = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new FetchError(response);
  }

  return response;
}

const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number = 0) => {
  if (! timeout) return [await fetchWithThrow(url, options), false];

  let isAborted = false;
  const abortController = new AbortController();

  setTimeout(() => {
    abortController.abort();
    isAborted = true;
  }, timeout);
  
  return [await fetchWithThrow(url, { ...options , ...(timeout && { signal: abortController.signal }) }), isAborted];
}

const fetchWithRetries = async (url: string, options: { maxRetries: number }, retryCount = 1): Promise<Response> => {
  const { maxRetries = 1, ...remainingOptions } = options
  let leftRetries = maxRetries - retryCount;
  
  console.log(`call ${url}, Left retries: ${leftRetries}`);

  try {
    return await fetchWithThrow(url, remainingOptions);
  } catch (e) {
    const error = e as FetchError

    if (retryCount < maxRetries) {
      return fetchWithRetries(url, options, retryCount + 1)
    }

    return error.getResponse();
  }
}

/**
 * Execute fetch with additional options, inlcuding retries and timeout
 *
 * @param url: URL to call
 * @param o FetchOptions: options to pass to fetch, including retries and timeout
 *
 * @todo:
 * - implement retries flow: when the request fails, the retry flow is executed.
 *    When attempts are exhausted, the entire process should result into failure
 *    by keeping the original error
 * - timeout flow: when the response is not received within the timeout,
 *    the request is aborted, and the retry flow is executed
 *
 * You can find an example of usage at `src/app/fetch/pages.tsx`
 * It makes an API call to /api/mayfail, which may fail over calls and duration varies from 0 to 2 seconds
 *
 * So for better testing, you can change the `retries` and `timeout` values to have a value under 2 seconds
 *
 * @param url
 * @param o
 * @returns
 */
export default async function fetchEnhanced(url: string, o: FetchOptions): Promise<Response> {
  const { retries = 0, timeout = 0, ...options } = o || {};
  
  console.log('additional options', { retries, timeout });

  try {
    const [response, isAborted] = await fetchWithTimeout(url, options, timeout);
    if (! isAborted) return response as Response;
   
    throw new Error('Call api timeout! Fallback to retry flow');
  } catch (e) {
    return fetchWithRetries(url, { maxRetries: retries, ...options });
  }
}
