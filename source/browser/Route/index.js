/* eslint-disable react/no-unknown-property */

import { useRef, useState, useEffect } from 'react';
import { Application, useExtend, useApplication, useTick } from '@pixi/react';
import pixiJs, { Graphics, Texture, AnimatedSprite, Assets } from 'pixi.js';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';

const AnimatedSpriteComponent = ({ boundRef }) => {
  useExtend({ AnimatedSprite });

  const ref = useRef(undefined);

  const [textureCollection, textureCollectionSet] = useState([Texture.EMPTY]);

  useEffect(() => {
    Assets.load('asset/mc.json')
      .then(({ textures }) => Object.values(textures))
      .then(textureCollectionSet);
  }, []);

  useEffect(() => {
    textureCollection[0] !== Texture.EMPTY &&
      /** @type {pixiJs.AnimatedSprite} */ (ref.current).gotoAndPlay(
        (Math.random() * textureCollection.length) | 0
      );
  }, [textureCollection]);

  useEffect(() => {
    Object.assign(
      ref.current,
      /** @type {pixiJs.AnimatedSpriteOptions} */ ({
        position: {
          x: Math.random() * boundRef.current?.maxX,
          y: Math.random() * boundRef.current?.maxY
        },
        rotation: Math.random() * (Math.PI * 2),
        scale: Math.random() * 0.5 + 1,
        animationSpeed: 1
      })
    );
  });

  return (
    <pixiAnimatedSprite ref={ref} textures={textureCollection} anchor={0.5} />
  );
};

const ApplicationComponent = () => {
  useExtend({ LayoutContainer, Graphics });

  const {
    app: { screen }
  } = useApplication();

  const ref = useRef(undefined);

  const boundRef = useRef(undefined);

  useEffect(() => {
    boundRef.current = /** @type {pixiJs.AnimatedSprite} */ (
      ref.current
    ).getBounds();
  }, []);

  useTick(() => {
    Object.assign(ref.current, { rotation: ref.current.rotation + 0.0 });
  });

  return (
    // @ts-expect-error native
    <pixiLayoutContainer ref={ref}>
      <pixiGraphics
        draw={(graphics) => {
          graphics
            .rect(0, 0, screen.width, screen.height)
            .stroke({ width: 10, alignment: 1, color: 0x000000 });
        }}
      />

      {Array.from({ length: 50 }).map((_, index) => {
        return <AnimatedSpriteComponent key={index} boundRef={boundRef} />;
      })}
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
