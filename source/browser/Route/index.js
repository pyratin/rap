/* eslint-disable react/no-unknown-property */

import { useEffect } from 'react';
import { Application, useExtend, useApplication } from '@pixi/react';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';

const ContainerComponent = () => {
  useExtend({ LayoutContainer });

  const {
    app: { stage, screen, renderer }
  } = useApplication();

  useEffect(() => {
    Object.assign(stage, {
      layout: /** @type {pixiLayout.LayoutOptions} */ ({
        width: screen.width,
        height: screen.height,
        justifyContent: 'center',
        alignItems: 'center'
      })
    });
  }, [stage, screen]);

  useEffect(() => {
    const onRendererResizeHandle = () => {
      Object.assign(stage, {
        layout: /** @type {pixiLayout.LayoutOptions} */ ({
          width: window.innerWidth,
          height: window.innerHeight
        })
      });
    };

    renderer.on('resize', onRendererResizeHandle);

    return () => {
      renderer.off('resize', onRendererResizeHandle);
    };
  }, [renderer, stage]);

  return (
    // @ts-expect-error native
    <pixiLayoutContainer
      layout={
        /** @type {pixiLayout.LayoutOptions} */ ({
          width: 200,
          height: 100,
          borderWidth: 2,
          borderColor: 0x000000,
          borderRadius: 8
        })
      }
    >
      {/* @ts-expect-error native */}
    </pixiLayoutContainer>
  );
};

const Route = () => {
  return (
    <div className='Route'>
      <Application backgroundColor={0x1099bb} resizeTo={window}>
        <ContainerComponent />
      </Application>
    </div>
  );
};

export default Route;
