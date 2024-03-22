import { Location, useLocation } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface LocationWithState extends Location {
  state: {
    from: {
      pathname: string;
    };
    sessionExpired?: boolean;
  };
}

export const useAppLocation = () => useLocation() as LocationWithState;
