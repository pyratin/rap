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

const textureAliasCollection = ['panda', 'rainbow-gradient'];

const SpriteComponent = ({ index }) => {
  const textureCollection = useMemo(
    () => textureAliasCollection.map((alias) => Assets.get(alias)),
    []
  );

  useExtend({ LayoutSprite });

  const ref = useRef(undefined);

  useTick(() => {
    Object.assign(ref.current, {
      rotation: ref.current.rotation + 0.0025 * (index % 2 ? 1 : -1)
    });
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
        {...(() => {
          return /** @type {pixiJs.SpriteOptions} */ ({
            texture: textureCollection[0]
          });
        })()}
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

const TextComponent = ({ index }) => {
  useExtend({ LayoutText });

  return (
    /* @ts-expect-error native */
    <pixiLayoutText
      layout={
        /** @type {pixiLayout.LayoutStyles} */ ({
          width: 'intrinsic',
          height: 'intrinsic',
          padding: 1,
          marginTop: 'auto',
          borderWidth: 1,
          borderColor: 0x000000,
          backgroundColor: 0x000000
        })
      }
      {...(() => {
        return /** @type {pixiJs.TextOptions} */ ({
          text: blendModeCollection[index].toUpperCase()
        });
      })()}
      style={
        /** @type {CSSStyleDeclaration} */ ({
          fontSize: '16px',
          fontWeight: '800',
          fontFamily: 'Roboto',
          fill: '#ffffff'
        })
      }
    />
  );
};

const ContainerComponent = ({ index, bound }) => {
  const dimension = useMemo(() => {
    const { minX = 0, maxX = 0, minY = 0, maxY = 0 } = bound || {};

    return Math.min(maxX - minX, maxY - minY) / 5;
  }, [bound]);

  useExtend({ LayoutContainer });

  return (
    /* @ts-expect-error native */
    <pixiLayoutContainer
      layout={
        /** @type {pixiLayout.LayoutStyles} */ ({
          width: dimension,
          height: dimension,
          flexDirection: 'column',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 0x000000
        })
      }
    >
      <SpriteComponent index={index} />

      {!!dimension && <TextComponent index={index} />}
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

  const [bound, boundSet] = useState(undefined);

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

  return (
    /* @ts-expect-error native */
    <pixiLayoutContainer
      ref={ref}
      layout={
        /** @type {pixiLayout.LayoutStyles} */ ({
          width: screen.width,
          height: screen.height,
          flexWrap: 'wrap',
          alignContent: 'center',
          justifyContent: 'center'
        })
      }
    >
      {Array.from({ length: 25 }).map((_, index) => {
        return <ContainerComponent key={index} index={index} bound={bound} />;
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
  }, []);

  return (
    initialized && (
      <div className='Route'>
        <Application
          resizeTo={window}
          backgroundColor={0x1099bb}
          useBackBuffer={true}
        >
          <ApplicationComponent />
        </Application>
      </div>
    )
  );
};

export default Route;
