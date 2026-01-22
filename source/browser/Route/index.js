/* eslint-disable react/no-unknown-property */

import { useState, useEffect } from 'react';
import { Application, useExtend, useApplication } from '@pixi/react';
import pixiJs, { Assets, Texture } from 'pixi.js';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer, LayoutSprite } from '@pixi/layout/components';

/** @type {[string, string[]][]} */
const bundleDefinitionCollection = [
  ['load-screen', ['flowerTop']],
  ['game-screen', ['eggHead']]
];

const BundleComponent = ({
  bundleDefinitionIndexActive,
  _bundleDefinitionIndexActiveSet
}) => {
  useExtend({ LayoutContainer, LayoutSprite });

  const [texture, textureSet] = useState(Texture.EMPTY);

  useEffect(() => {
    const [bundleName, [assetAlias]] =
      bundleDefinitionCollection[bundleDefinitionIndexActive];

    Assets.loadBundle(bundleName)
      .then(() => {
        return Assets.load(assetAlias);
      })
      .then(textureSet);
  }, [bundleDefinitionIndexActive]);

  return (
    texture !== Texture.EMPTY && (
      /* @ts-expect-error native */
      <pixiLayoutContainer
        layout={
          /** @type {pixiLayout.LayoutStyles} */ ({
            width: 350,
            height: 400,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 0x000000
          })
        }
      >
        {/* @ts-expect-error native */}
        <pixiLayoutSprite
          {...(() => {
            return /** @type {pixiJs.SpriteOptions} */ ({
              layout: /** @type {pixiLayout.LayoutStyles} */ ({
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }),
              anchor: 0.5,
              texture,
              eventMode: 'static',
              cursor: 'pointer',
              onClick: () => {
                textureSet(Texture.EMPTY);

                _bundleDefinitionIndexActiveSet();
              }
            });
          })()}
        />
        {/* @ts-expect-error native */}
      </pixiLayoutContainer>
    )
  );
};

const ApplicationComponent = () => {
  const {
    app: { stage, screen }
  } = useApplication();

  const [bundleDefinitionIndexActive, bundleDefinitionIndexActiveSet] =
    useState(0);

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
    <BundleComponent
      bundleDefinitionIndexActive={bundleDefinitionIndexActive}
      _bundleDefinitionIndexActiveSet={() => {
        bundleDefinitionIndexActiveSet(!bundleDefinitionIndexActive ? 1 : 0);
      }}
    />
  );
};

const Route = () => {
  useEffect(() => {
    Assets.init({
      manifest: {
        bundles: bundleDefinitionCollection.map(
          ([name, assetAliasCollection]) => ({
            name,
            assets: assetAliasCollection.map((alias) => ({
              alias,
              src: `asset/${alias}.png`
            }))
          })
        )
      }
    });

    Assets.backgroundLoadBundle(
      bundleDefinitionCollection.map(([name]) => name)
    );
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
