import { useEffect, useState } from "react";

export const useSubscribeState = (sourceState) => {
  const [state, setState] = useState(sourceState);
  useEffect(() => {
    setState(sourceState);
  }, [sourceState]);

  return [state, setState];
};

/**
 * 联动 state
 *
 * linkState 改变时, 联动修改当前 state,
 * 当前 state 改变时, 联动修改 linkState
 * @param linkState
 * @param setLinkState
 */
export const useLinkState = (linkState, setLinkState = undefined) => {
  const [state, setState] = useState(linkState);
  useEffect(() => {
    setState(linkState);
  }, [linkState]);

  return [
    state,
    (n) => {
      setState(n);
      setLinkState && setLinkState(n);
    },
  ];
};
