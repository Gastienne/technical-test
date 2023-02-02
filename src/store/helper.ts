/**
 * For the purpose of the challenge, i didn't install another library
 * such react-redux, @reduxjs/toolkit to connect redux store to the react component.
 * I use my own naive implementation to connect them.
 * 
 * NB: Do not use this is real application.
 */

import store from "./index";
import React from "react";

export const useDispatch = () => store.dispatch;

export const useIsMounted = () => {
    const isMounted = React.useRef(false);

    React.useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false }
    }, []);

    return isMounted;
}

export const refCompare = (a: any, b: any) => a === b;

export const useSelector = (selectFn: CallableFunction, compareFn = refCompare) => {
    const [state, setState] = React.useState(() => selectFn(store.getState()));

    const mounted = useIsMounted();

    React.useEffect(() => {
        const unsubscribe = store.subscribe(() => {
          const currentStoreState = selectFn(store.getState());
          if (!mounted.current) return;
          setState(
            (currentLocalState: any) =>
              compareFn(currentLocalState, currentStoreState)
                ? currentLocalState
                : currentStoreState
          );
        });
        return unsubscribe;
    }, [compareFn, mounted, selectFn]);

      return state;
}
