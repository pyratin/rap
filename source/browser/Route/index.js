/* eslint-disable react/no-unknown-property */

import { useMemo, useRef, useState, useEffect } from 'react';
import { Application, useExtend, useApplication, useTick } from '@pixi/react';
import pixiJs, { Assets } from 'pixi.js';
import * as pixiLayout from '@pixi/layout';
import {
  LayoutContainer,
  LayoutText,
  LayoutSprite
} from '@pixi/layout/components';
import 'pixi.js/advanced-blend-modes';

const textureAliasCollection = ['panda', 'rainbow-gradient'];

const blendModeCollection = [
  'normal',
  'add',
  'screen',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'linear-burn',
  'linear-dodge',
  'linear-light',
  'hard-light',
  'soft-light',
  'pin-light',
  'difference',
  'exclusion',
  'overlay',
  'saturation',
  'color',
  'luminosity',
  'add-npm',
  'subtract',
  'divide',
  'vivid-light',
  'hard-mix',
  'negation'
];

const TextComponent = ({ index }) => {
  useExtend({ LayoutText });

  return (
    /* @ts-expect-error native */
    <pixiLayoutText
      {...{
        layout: /** @type {pixiLayout.LayoutStyles} */ ({
          width: 'intrinsic',
          height: 'intrinsic',
          padding: 4,
          marginTop: 'auto',
          backgroundColor: 0x000000
        }),
        text: blendModeCollection[index].toUpperCase(),
        style: /** @type {CSSStyleDeclaration} */ ({
          fontSize: '20',
          fontWeight: '800',
          fontFamily: 'Roboto',
          fill: '0xffffff'
        })
      }}
    />
  );
};

const SpriteComponent = ({ index }) => {
  const textureCollection = useMemo(
    () => textureAliasCollection.map((alias) => Assets.cache.get(alias)),
    []
  );

  useExtend({ LayoutSprite });

  const ref = useRef(undefined);

  useTick(() => {
    Object.assign(ref.current, { rotation: ref.current.rotation + 0.01 });
  });

  return (
    <>
      {/* @ts-expect-error native */}
      <pixiLayoutSprite
        ref={ref}
        layout={
          /** @type {pixiLayout.LayoutStyles} */ ({
            width: 100,
            height: 100,
            marginTop: 'auto'
          })
        }
        texture={textureCollection[0]}
      />

      {/* @ts-expect-error native */}
      <pixiLayoutSprite
        layout={
          /** @type {pixiLayout.LayoutStyles} */ ({
            position: 'absolute',
            width: '100%',
            height: '100%'
          })
        }
        {...(() => {
          return /** @type {pixiJs.SpriteOptions} */ ({
            texture: textureCollection[1],
            blendMode: blendModeCollection[index]
          });
        })()}
      />
    </>
  );
};

const LayoutContainerComponent = ({ index, bound }) => {
  const columnCount = 5;

  const dimension = useMemo(() => {
    const { minX, maxX = 0, minY, maxY = 0 } = bound || {};

    const value = Math.min(minX + maxX, minY + maxY) / columnCount;

    return value && Array.from({ length: 2 }).map(() => value);
  }, [bound]);

  useExtend({ LayoutContainer });

  return (
    /* @ts-expect-error native */
    <pixiLayoutContainer
      layout={
        /** @type {pixiLayout.LayoutStyles} */ ({
          width: dimension[0],
          height: dimension[1],
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 0x00000
        })
      }
    >
      <SpriteComponent index={index} />

      <TextComponent index={index} />
      {/* @ts-expect-error native */}
    </pixiLayoutContainer>
  );
};

const ApplicationComponent = () => {
  useExtend({ LayoutContainer });

  const {
    app: { stage, screen }
  } = useApplication();

  const ref = useRef(undefined);

  const [bound, boundSet] = useState(/** @type {pixiJs.Bounds} */ (undefined));

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
    boundSet(ref.current.getBounds());
  }, []);

  useTick(() => {
    Object.assign(ref.current, { rotation: ref.current.rotation + 0.0 });
  });

  return (
    /* @ts-expect-error native */
    <pixiLayoutContainer
      ref={ref}
      layout={
        /** @type {pixiLayout.LayoutStyles} */ ({
          width: screen.width,
          height: screen.height,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignContent: 'center'
        })
      }
    >
      {Array.from({ length: 25 }).map((_, index) => {
        return (
          <LayoutContainerComponent key={index} index={index} bound={bound} />
        );
      })}
      {/* @ts-expect-error native */}
    </pixiLayoutContainer>
  );
};

const Route = () => {
  const [initialized, initializedSet] = useState(false);

  useEffect(() => {
    const assetCollection = [
      {
        alias: 'Roboto',
        src: 'font/Roboto/Roboto-VariableFont_wdth,wght.ttf',
        data: { family: 'Roboto' }
      },
      ...textureAliasCollection.map((alias) => ({
        alias,
        src: `asset/${alias}.png`
      }))
    ];

    Assets.add(assetCollection);

    Assets.load(assetCollection.map(({ alias }) => alias)).then(() => {
      initializedSet(true);
    });
  });

  return (
    initialized && (
      <div className='Route'>
        <Application
          resizeTo={window}
          backgroundColor={0xffffff}
          useBackBuffer={true}
        >
          <ApplicationComponent />
        </Application>
      </div>
    )
  );
};

export default Route;
