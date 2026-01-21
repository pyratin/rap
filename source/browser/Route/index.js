/* eslint-disable react/no-unknown-property */

import { useRef, useEffect } from 'react';
import { Application, useExtend, useApplication, useTick } from '@pixi/react';
import pixiJs from 'pixi.js';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer, LayoutHTMLText } from '@pixi/layout/components';

const ApplicationComponent = () => {
  useExtend({ LayoutContainer, LayoutHTMLText });

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

  useTick(() => {
    Object.assign(ref.current, {
      rotation: ref.current.rotation + 0.01
    });
  });

  const defaults = {
    backgroundColor: `#1e293b`,
    borderWidth: 1,
    borderColor: `#fff`
  };

  return (
    // @ts-expect-error native
    <pixiLayoutContainer
      layout={
        /** @type {pixiLayout.LayoutStyles} */ ({
          width: 200,
          height: 200,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: `#0f172a`,
          ...defaults
        })
      }
    >
      {/* @ts-expect-error native */}
      <pixiLayoutContainer
        ref={ref}
        layout={
          /** @type {pixiLayout.LayoutStyles} */ ({
            height: 100,
            width: 100,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            ...defaults
          })
        }
      >
        {/* @ts-expect-error native */}
        <pixiLayoutHTMLText
          text="Hello <span style='color: gold'>Pixi!</span> 🚀"
          layout={
            /** @type {pixiLayout.LayoutStyles} */ ({
              width: '50%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            })
          }
          style={
            /** @type {CSSStyleRule & pixiJs.TextStyle} */ ({
              wordWrap: true,
              align: 'center',
              fontSize: 32,
              fill: '#ffffff'
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
