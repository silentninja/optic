import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { IOpticEngine } from '@useoptic/spectacle';
import { InvariantViolationError } from '<src>/errors';

const OpticEngineContext = React.createContext<IOpticEngine | null>(null);

export function OpticEngineStore(props: { children: ReactNode }) {
  const [opticEngine, setOpticEngine] = useState<IOpticEngine | null>(null);
  useEffect(() => {
    async function task() {
      const opticEngine = await import('@useoptic/optic-engine-wasm/browser');
      setOpticEngine(opticEngine);
    }

    task();
  }, []);
  if (!opticEngine) {
    //@aidan todo
    return <div>loading...</div>;
  }
  return (
    <OpticEngineContext.Provider
      children={props.children}
      value={opticEngine}
    />
  );
}

export function useOpticEngine(): IOpticEngine {
  const value = useContext(OpticEngineContext);
  if (!value) {
    throw new InvariantViolationError(
      'useOpticEngine could not find OpticEngineContext'
    );
  }
  return value;
}
