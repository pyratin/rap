/* eslint-disable react/no-unknown-property */

import { useRef, useState, useEffect } from 'react';
import { Application, useExtend, useApplication } from '@pixi/react';
import pixiJs, { Assets, Texture, AnimatedSprite } from 'pixi.js';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';

const AnimatedSpriteComponent = ({ index }) => {
  useExtend({ AnimatedSprite });

  const ref = useRef(undefined);

  const [textureCollection, textureCollectionSet] = useState([
    { texture: Texture.EMPTY, time: 0 }
  ]);

  useEffect(() => {
    Assets.load('asset/0123456789.json')
      .then(({ data: { frames }, textures }) =>
        Object.entries(frames).map(([key, { duration }]) => ({
          texture: textures[key],
          time: duration
        }))
      )
      .then(textureCollectionSet);
  }, []);

  useEffect(() => {
    textureCollection[0].texture !== Texture.EMPTY &&
      /** @type {pixiJs.AnimatedSprite} */ (ref.current).play();
  }, [textureCollection]);

  return (
    <pixiAnimatedSprite
      ref={ref}
      textures={textureCollection}
      layout={{}}
      scale={2}
      animationSpeed={!index ? 0.5 : 1}
    />
  );
};

const ApplicationComponent = ({ index }) => {
  useExtend({ LayoutContainer });

  const {
    app: { stage, screen, renderer }
  } = useApplication();

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

  return (
    // @ts-expect-error native
    <pixiLayoutContainer
      layout={
        /** @type {pixiLayout.LayoutStyles} */ ({
          justifyContent: 'center',
          alignItems: 'center',
          padding: 40,
          borderWidth: 10,
          borderRadius: 20,
          borderColor: 0x555555
        })
      }
    >
      <AnimatedSpriteComponent index={index} />
      {/* @ts-expect-error native */}
    </pixiLayoutContainer>
  );
};

const Route = () => {
  return (
    <div className='Route'>
      <Application resizeTo={window} backgroundColor={0x1099bb}>
        {/* @ts-expect-error native */}
        <pixiLayoutContainer
          layout={
            /** @type {pixiLayout.LayoutStyles} */ ({
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20
            })
          }
        >
          {Array.from({ length: 2 }).map((_, index) => {
            return <ApplicationComponent key={index} index={index} />;
          })}
          {/* @ts-expect-error native */}
        </pixiLayoutContainer>
      </Application>
    </div>
  );
};

export default Route;
