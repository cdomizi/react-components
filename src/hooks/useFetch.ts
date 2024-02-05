import { useEffect, useReducer, useRef } from "react";

type State<T> = {
  loading: boolean;
  error: Error | null | undefined;
  data: T | null | undefined;
};

type FetchCache<T> = Record<string, T>;

// Reducer actions
const ACTIONS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export const useFetch = <TData = unknown>(
  url?: string,
  options?: RequestInit,
  reload = false,
): State<TData> => {
  // Create ref variable for reload
  const forceReload = useRef(reload);
  // Initialize cache
  const cache = useRef<FetchCache<TData>>({});

  const initialState: State<TData> = {
    loading: false,
    error: undefined,
    data: undefined,
  };

  type ReducerAction<T> =
    | { type: typeof ACTIONS.LOADING }
    | { type: typeof ACTIONS.ERROR; payload: Error }
    | { type: typeof ACTIONS.SUCCESS; payload: T };

  // Reducer function
  const fetchReducer = (
    state: State<TData>,
    action: ReducerAction<TData>,
  ): State<TData> => {
    switch (action.type) {
      case ACTIONS.LOADING: {
        return { ...initialState, loading: true };
      }
      case ACTIONS.SUCCESS: {
        return {
          ...initialState,
          data: action.payload,
        };
      }
      case ACTIONS.ERROR: {
        return {
          ...initialState,
          error: action.payload,
        };
      }
      default: {
        return state;
      }
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    // If no url is provided, do nothing
    if (!url) return;

    // Initialize AbortController for cleanup
    const abortController = new AbortController();

    // Fetch data
    const fetchData = async () => {
      dispatch({ type: ACTIONS.LOADING });

      // If reload was not forced and a cache for this URL exists, return it
      if (cache.current[url] && !forceReload.current) {
        dispatch({ type: ACTIONS.SUCCESS, payload: cache.current[url] });
        return;
      }

      try {
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal,
        });

        // Throw an error if the request failed
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = (await response.json()) as TData;
        cache.current[url] = data;

        dispatch({
          type: ACTIONS.SUCCESS,
          payload: data,
        });
      } catch (error) {
        // Only return error if not caused by abortController
        if (!abortController.signal.aborted) {
          console.error("Error while fetching data");
          // Only log error stack in development mode
          import.meta.env.DEV && console.error(error);

          dispatch({
            type: ACTIONS.ERROR,
            payload: error as Error,
          });
        }
      }
    };

    void fetchData();

    // Clean up
    return () => {
      abortController.abort();
      forceReload.current = false;
    };
  }, [url, options, reload]);

  return state;
};
