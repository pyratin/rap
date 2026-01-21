/* eslint-disable react/no-unknown-property */

import { Application, useExtend } from '@pixi/react';
import { Graphics } from 'pixi.js';
import { LayoutContainer } from '@pixi/layout/components';

const LayoutContainerComponent = () => {
  useExtend({ LayoutContainer, Graphics });

  return (
    <pixiLayoutContainer
      layout={{
        width: 200,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: `#000`
      }}
    >
      <pixiLayoutContainer
        layout={{
          height: 50,
          width: 50,
          borderWidth: 1,
          borderColor: `#fff`
        }}
      />
    </pixiLayoutContainer>
  );
};

const Route = () => {
  return (
    <div className='Route'>
      <Application backgroundColor={0x1099bb} resizeTo={window}>
        <LayoutContainerComponent />
      </Application>
    </div>
  );
};

export default Route;