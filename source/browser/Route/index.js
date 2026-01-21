/* eslint-disable react/no-unknown-property */

import { useRef, useEffect } from 'react';
import { Application, useExtend, useApplication } from '@pixi/react';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';

const ApplicationComponent = () => {
  useExtend({ LayoutContainer });

  const {
    app: { stage, screen, renderer }
  } = useApplication();

  const ref = useRef(undefined);

  useEffect(() => {
    Object.assign(stage, {
      layout: /** @type {pixiLayout.LayoutStyles} */ ({
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
        layout: /** @type {pixiLayout.LayoutStyles} */ ({
          width: screen.width,
          height: screen.height
        })
      });
    };

    renderer.on('resize', onRendererResizeHandle);

    return () => {
      renderer.off('resize', onRendererResizeHandle);
    };
  }, [renderer, stage, screen]);

  const option = {
    borderWidth: 1,
    borderColor: 0x000000,
    borderRadius: 8
  };

  return (
    // @ts-expect-error native
    <pixiLayoutContainer
      layout={
        /** @type {pixiLayout.LayoutStyles} */ ({
          width: 200,
          height: 250,
          padding: 10,
          ...option
        })
      }
    >
      {/* @ts-expect-error native */}
      <pixiLayoutContainer
        ref={ref}
        layout={
          /** @type {pixiLayout.LayoutStyles} */ ({
            position: 'static',
            width: 100,
            height: 100,
            ...option
          })
        }
      >
        {/* @ts-expect-error native */}
        <pixiLayoutContainer
          layout={
            /** @type {pixiLayout.LayoutStyles} */ ({
              position: 'absolute',
              bottom: 10,
              width: '50%',
              height: 25,
              ...option
            })
          }
        />
        {/* @ts-expect-error native */}
      </pixiLayoutContainer>

      {/* @ts-expect-error native */}
    </pixiLayoutContainer>
  );
};

const Route = () => {
  return (
    <div className='Route'>
      <Application resizeTo={window} backgroundColor={0x1099bb}>
        <ApplicationComponent />
      </Application>
    </div>
  );
};

export default Route;
