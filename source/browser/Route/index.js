/* eslint-disable react/no-unknown-property */

import { useState, useEffect } from 'react';
import { Application, useExtend, useApplication } from '@pixi/react';
import { Assets, Texture, Sprite } from 'pixi.js';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';

const assetAliasCollection = ['flowerTop', 'eggHead'];

const SpriteComponent = () => {
  useExtend({ Sprite });

  const [texture, textureSet] = useState(Texture.EMPTY);

  const [assetAliasActiveIndex, assetAliasActiveIndexSet] = useState(0);

  useEffect(() => {
    Assets.load(assetAliasCollection[assetAliasActiveIndex]).then(textureSet);
  }, [assetAliasActiveIndex]);

  return (
    texture !== Texture.EMPTY && (
      <pixiSprite
        layout={
          /** @type {pixiLayout.LayoutStyles} */ ({
            width: 200,
            height: 200,
            objectFit: 'contain',
            borderWidth: 2,
            borderColor: 0xff0000
          })
        }
        anchor={0.5}
        texture={texture}
        eventMode='static'
        cursor='pointer'
        onClick={() => assetAliasActiveIndexSet(!assetAliasActiveIndex ? 1 : 0)}
      />
    )
  );
};

const ApplicationComponent = () => {
  useExtend({ LayoutContainer });

  const {
    app: { stage, screen }
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

  return (
    /* @ts-expect-error native */
    <pixiLayoutContainer
      layout={
        /** @type {pixiLayout.LayoutStyles} */ ({
          justifyContent: 'center',
          alignItems: 'center',
          padding: 40,
          borderWidth: 1,
          borderColor: 0xff000
        })
      }
    >
      <SpriteComponent />
      {/* @ts-expect-error native */}
    </pixiLayoutContainer>
  );
};

const Route = () => {
  useEffect(() => {
    Assets.add(
      assetAliasCollection.map((alias) => ({
        alias,
        src: `asset/${alias}.png`
      }))
    );

    Assets.backgroundLoad(assetAliasCollection);
  }, []);

  return (
    <div className='Route'>
      <Application resizeTo={window} backgroundColor={0x1099bb}>
        <ApplicationComponent />
      </Application>
    </div>
  );
};

export default Route;
