/* eslint-disable react/no-unknown-property */

import { useRef, useState, useEffect } from 'react';
import { Application, useExtend, useApplication, useTick } from '@pixi/react';
import { Assets, Texture, AnimatedSprite } from 'pixi.js';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';

const AnimatedSpriteComponent = () => {
  useExtend({ AnimatedSprite });

  const ref = useRef(undefined);

  const [textureCollection, textureCollectionSet] = useState([Texture.EMPTY]);

  useEffect(() => {
    Assets.load('asset/fighter.json')
      .then(({ textures }) => Object.values(textures))
      .then(textureCollectionSet);
  }, []);

  useEffect(() => {
    textureCollection[0] !== Texture.EMPTY && ref.current.play();
  }, [textureCollection]);

  return (
    <pixiAnimatedSprite
      ref={ref}
      anchor={0.5}
      layout={true}
      textures={textureCollection}
      animationSpeed={0.5}
    />
  );
};

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

  useTick(() => {
    Object.assign(ref.current, {
      rotation: ref.current.rotation + 0.01
    });
  });

  return (
    /* @ts-expect-error native */
    <pixiLayoutContainer
      ref={ref}
      layout={
        /** @type {pixiLayout.LayoutStyles} */ ({
          padding: 20,
          borderWidth: 1,
          borderRadius: 12,
          borderColor: 0x00000,
          backgroundColor: 0x00ff0
        })
      }
    >
      <AnimatedSpriteComponent />
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
