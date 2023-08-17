---
title: 'Designing User-Friendly Components: A Case Study with chakra-ui'
excerpt: 'Recently, our company has been building a unified platform for our department, and I was responsible for developing the frontend of the unified login. To integrate with various systems, I developed a unified login SDK, which is essentially a component library. Taking this as an opportunity, along with previous experience using different component libraries like Element UI, Vant, Ant Design, and chakra-ui, I'd like to discuss what constitutes reasonable component design and how to create user-friendly components.'
coverImage: '/assets/blog/chakra-ui.png'
date: '2021-10-28T12:52:42.712Z'
type: tech
tag: ['ui', 'react']
author:
name: Alfxjx
picture: '/assets/authors/alfxjx.jpg'
language: 'en'

---

> Also published on [Yuque](https://www.yuque.com/alfxjx/notes/wchz9f)

## Introduction

Recently, our company has been building a unified platform for our department, and I was responsible for developing the frontend of the unified login. To integrate with various systems, I developed a unified login SDK, which is essentially a component library. Taking this as an opportunity, along with previous experience using different component libraries like Element UI, Vant, Ant Design, and chakra-ui, I'd like to discuss what constitutes reasonable component design and how to create user-friendly components.

## Exploring chakra-ui

![](/assets/blog/chakra-ui.png)

Among the various component libraries, one that stands out in terms of design is [chakra-ui](https://chakra-ui.com/). While it might not be widely used in China, I stumbled upon it during a previous technology selection process. Upon carefully reading its documentation, I found that chakra-ui is a unique and distinctive component library. Here's why:

### Customizable Styles

When I came across chakra-ui, it was because I needed to use a component library alongside Tailwind CSS. One notable feature of chakra-ui is its usage of styles that are nearly identical to Tailwind CSS's API. For instance:

```typescript
Copy code
import { Box } from "@chakra-ui/react"

// m={2} refers to the value of `theme.space[2]`
<Box m={2}>Tomato</Box>

// You can also use custom values
<Box maxW="960px" mx="auto" />

// sets margin `8px` on all viewports and `16px` from the first breakpoint and up
<Box m={[2, 3]} />
```

If you're familiar with Tailwind CSS's API, you can quickly get started with chakra-ui. But how is this achieved? At first, I thought chakra-ui was using Tailwind CSS under the hood, but upon inspecting the source code, I discovered that chakra-ui wraps styled-components with its own modifications to simulate this tailwind-like API. In the [/packages/styled-system/config/](https://github.com/chakra-ui/chakra-ui/blob/main/packages/styled-system/src/config/background.ts) directory, different styles and their abbreviations are defined. Taking background as an example:

```typescript
export const background: Config = {
  background: t.colors("background"),
  ...
  bg: t.colors("background"),
  ...
}
```

This encapsulates the dirty work and presents a user-friendly API.

### Component Composition

Continuing from the previous point, chakra-ui employs a lot of mapping and wrapping of components to reduce code duplication and ensure unified management. The library uses component composition through the "compose" feature. Starting from a basic component, it creates new components by applying default styles.

For example, the [ Square Circle ](https://chakra-ui.com/docs/layout/center#square-and-circle) component is an extension of the Box component:

```typescript
export const Square = forwardRef<SquareProps, 'div'>((props, ref) => {
  const { size, centerContent = true, ...rest } = props;

  const styles: SystemStyleObject = centerContent
    ? { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    : {};

  return (
    <Box
      ref={ref}
      boxSize={size}
      __css={{
        ...styles,
        flexShrink: 0,
        flexGrow: 0,
      }}
      {...rest}
    />
  );
});

if (__DEV__) {
  Square.displayName = 'Square';
}

export const Circle = forwardRef<SquareProps, 'div'>((props, ref) => {
  const { size, ...rest } = props;
  return <Square size={size} ref={ref} borderRadius="9999px" {...rest} />;
});

if (__DEV__) {
  Circle.displayName = 'Circle';
}
```

This approach reduces code repetition and enhances maintainability. During development, you can follow a similar pattern to develop the most abstract components and derive other components from them.

### Theming

Another distinctive feature of chakra-ui is its highly customizable theming system. The approach is similar to [tailwind CSS theme customization](https://tailwindcss.com/docs/theme). This means you can apply the same theme file to multiple libraries. You can learn more about this in the [chakra documentation](https://chakra-ui.com/docs/theming/customize-theme). But how is this theme system implemented?

Initially, chakra-ui maintains a default theme that serves as a base when no custom theme or only partial customization is provided. The merging process (`toCSSVar`) involves converting the custom theme configuration into CSS variable syntax using the `createThemeVars` function. The default theme and the generated theme are then merged. Finally, it's applied using the `<ThemeProvider />` component:

```typescript
export const ThemeProvider = (props: ThemeProviderProps) => {
  const { cssVarsRoot = ':host, :root', theme, children } = props;
  const computedTheme = React.useMemo(() => toCSSVar(theme), [theme]);
  return (
    <EmotionThemeProvider theme={computedTheme}>
      <Global styles={(theme: any) => ({ [cssVarsRoot]: theme.__cssVars })} />
      {children}
    </EmotionThemeProvider>
  );
};
```

Here, the ThemeProvider leverages Emotion's [ThemeProvider](https://emotion.sh/docs/theming#themeprovider-reactcomponenttype). This approach simplifies theme customization. Furthermore, if you want to build upon an existing theme, chakra-ui provides an API called [Theme extensions](https://chakra-ui.com/docs/theming/customize-theme#using-theme-extensions). It's similar to a higher-order component (HOC), such as the withDefaultColorScheme example:

```typescript
export function withDefaultColorScheme({
  colorScheme,
  components,
}): ThemeExtension {
  return theme => {
    let names = Object.keys(theme.components || {});
    // ....
    return mergeThemeOverride(theme, {
      components: Object.fromEntries(
        names.map(componentName => {
          const withColorScheme = {
            defaultProps: {
              colorScheme,
            },
          };
          return [componentName, withColorScheme];
        })
      ),
    });
  };
}
```

This function assigns the configured color scheme to the corresponding component. Internally, it's achieved using the `mergeThemeOverride` method:

```typescript
export function mergeThemeOverride<BaseTheme extends ChakraTheme = ChakraTheme>(
  ...overrides: ThemeOverride<BaseTheme>[]
): ThemeOverride<BaseTheme> {
  return mergeWith({}, ...overrides, mergeThemeCustomizer);
}
```

Within this function, [`lodash.mergewith`](https://www.lodashjs.com/docs/lodash.mergeWith/) is utilized for merging. Chakra-ui also provides a custom mergeThemeCustomizer method as the third argument to `lodash.mergewith`. This method employs a recursive approach to handle merging:

```typescript
function mergeThemeCustomizer(
  source: unknown,
  override: unknown,
  key: string,
  object: any
) {
  if (
    (isFunction(source) || isFunction(override)) &&
    Object.prototype.hasOwnProperty.call(object, key)
  ) {
    return (...args: unknown[]) => {
      const sourceValue = isFunction(source) ? source(...args) : source;

      const overrideValue = isFunction(override) ? override(...args) : override;

      return mergeWith({}, sourceValue, overrideValue, mergeThemeCustomizer);
    };
  }

  // fallback to default behaviour
  return undefined;
}
```

### Integration with External Libraries

As evident from the exploration, component libraries often leverage third-party tools and libraries. Chakra-ui is no exception; it uses styling libraries like emotion and styled-components, as well as utility libraries like lodash. Additionally, the chakra-ui team recommends using the library in conjunction with other third-party tools. For instance, in element-ui, throttle-debounce and async-validator are directly encapsulated, and chakra-ui similarly suggests using external libraries like [formik](https://chakra-ui.com/docs/form/form-control#usage-with-form-libraries) for form validation.

### Providing Escape Hatches

When working with other component libraries, there might be situations where the default behavior or design of a component doesn't align with your requirements. In element-ui and Ant Design, this is often tackled by providing ways to override styles. Chakra-ui offers an escape hatch through the [sx Props](https://chakra-ui.com/docs/features/the-sx-prop). This prop allows you to pass custom styles directly to components:

```typescript
<Box sx={{ '--my-color': '#53c8c4' }}>
  <Heading color="var(--my-color)" size="lg">
    This uses CSS Custom Properties!
  </Heading>
</Box>
```

This approach is powerful and supports nested styles, media queries, and more. The sx prop is a wrapper around the styled method from @emotion/styled. The [packages/system/src/system.ts](https://github.com/chakra-ui/chakra-ui/blob/main/packages/system/src/system.ts) file contains the implementation of this method. Inside this styled method, the toCSSObject function is called to retrieve the input styles. All UI components use this styled method, which is how the sx prop becomes globally effective.

```typescript
export function styled<T extends As, P = {}>(
  component: T,
  options?: StyledOptions
) {
  const { baseStyle, ...styledOptions } = options ?? {};
  // ...
  const styleObject = toCSSObject({ baseStyle });
  return _styled(
    component as React.ComponentType<any>,
    styledOptions
  )(styleObject) as ChakraComponent<T, P>;
}

export const toCSSObject: GetStyleObject =
  ({ baseStyle }) =>
  props => {
    const { theme, css: cssProp, __css, sx, ...rest } = props;
    const styleProps = objectFilter(rest, (_, prop) => isStyleProp(prop));
    const finalBaseStyle = runIfFn(baseStyle, props);
    const finalStyles = Object.assign(
      {},
      __css,
      finalBaseStyle,
      styleProps,
      sx
    );
    const computedCSS = css(finalStyles)(props.theme);
    return cssProp ? [computedCSS, cssProp] : computedCSS;
  };
```

## Designing User-Friendly Components

After delving into the chakra-ui component library's source code and exploring its features, let's consider how to design user-friendly components. I'll use a progress bar as an example.

### MVP Version and Existing Issues

```typescript
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ProgressBarWrapper = styled.div<{ progress: number }>`
  width: 100%;
  height: 4px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  .bar-used {
    background: #34c;
    width: ${({ progress }) => progress + '%'};
    height: 100%;
    border-radius: 0 2px 2px 0;
  }
`;

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      setProgress(
        (document.documentElement.scrollTop /
          (document.body.scrollHeight - window.innerHeight)) *
          100
      );
    });
    return () => {
      window.removeEventListener('scroll', () => {});
    };
  });
  return (
    <ProgressBarWrapper progress={progress}>
      <div className="bar-used"></div>
    </ProgressBarWrapper>
  );
};

export { ProgressBar };
```

The above code demonstrates a simple top-scroll progress bar component. However, it's tailored to a specific use case, with a fixed position at the top and progress growing only from left to right. But in reality, progress bars can be used in various scenarios, so we need to identify the customizable variables and default values. Here are a few requirements:

1. Customizable colors, positions, and directions are global options.
1. Specific style modifications, such as height and border radius, are optional props that might not be commonly used.

Additionally, the ProgressBar component combines presentation and logic. It calculates the scroll progress inside the component, making it challenging to reuse the component without this logic.

Let's refactor this component to address these issues and make it more user-friendly.

### Refactoring

First, let's separate the logic from the presentation. Create a hook for calculating the progress percentage:

```typescript
import { useState, useEffect } from 'react';

export function useProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      setProgress(
        (document.documentElement.scrollTop /
          (document.body.scrollHeight - window.innerHeight)) *
          100
      );
    });
    return () => {
      window.removeEventListener('scroll', () => {});
    };
  });
  return progress;
}
```

Next, let's add props for necessary parameters while setting default values. For example, we'll add an optional height parameter. If provided, it will use the passed value; otherwise, it will default to a standard value. We can also utilize a theme system for colors.

```typescript
const ProgressBarWrapper = styled.div<{ progress: number; height?: string }>`
  width: 100%;
  height: ${({ height }) => (height ? height : '4px')};
  .bar-used {
    background: ${({ theme }) => theme.themeColor};
    width: ${({ progress }) => progress + '%'};
    height: 100%;
    border-radius: ${({ height }) =>
      height ? `0 calc( ${height}/ 2) calc(${height}/ 2) 0` : '0 2px 2px 0'};
  }
`;
```

To improve flexibility, extract the fixed layout into a separate component:

```typescript
const FixedTopWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
`;
// 组合之后就是这样的
const ProgressBarWrapperFixed = styled(FixedTopWrapper)<{
  progress: number;
  height?: string;
}>`.....`;
```

With these changes, we've created a ProgressBar component for basic use and a SimpleProgressBar for more customizable functionality:

```typescript
interface ProgressProps {
  progress: number;
  height?: string;
}
const ProgressBar = ({ height }: Omit<ProgressProps, 'progress'>) => {
  const progress = useProgress();
  return (
    <ProgressBarWrapperFixed progress={progress} height={height}>
      <div className="bar-used"></div>
    </ProgressBarWrapperFixed>
  );
};

const SimpleProgressBar = ({ progress, height }: ProgressProps) => {
  return (
    <ProgressBarWrapper progress={progress} height={height}>
      <div className="bar-used"></div>
    </ProgressBarWrapper>
  );
};
```

Additionally, we've added a style prop for customization:

```typescript
// usage
<ProgressBar style={{ background: '#000' }}></ProgressBar>;
// 修改组件 添加rest参数接受附加的style,并且修改一下类型
const ProgressBar = ({
  height,
  ...rest
}: Omit<ProgressProps, 'progress'> & React.HTMLAttributes<HTMLDivElement>) => {
  const progress = useProgress();
  return (
    <ProgressBarWrapperFixed {...rest} progress={progress} height={height}>
      <div className="bar-used"></div>
    </ProgressBarWrapperFixed>
  );
};
```

This design results in a user-friendly ProgressBar component that can be used as-is or customized further.

Online Demo: [https://codepen.io/alfxjx/pen/ZEJyygo?editors=0010](https://codepen.io/alfxjx/pen/ZEJyygo?editors=0010)

## Conclusion

Through the exploration of the chakra-ui component library's source code and the example provided, you should now have a clearer understanding of how to design a user-friendly component library. I hope this knowledge empowers you to develop your own component library for your company, enhancing your KPIs, OKRs, and more.

## References

1. [https://github.com/chakra-ui/chakra-ui](https://github.com/chakra-ui/chakra-ui)
1. [https://chakra-ui.com/](https://chakra-ui.com/)
1. [https://emotion.sh/](https://emotion.sh/)
1. [https://www.lodashjs.com/](https://www.lodashjs.com/)
1. [https://tailwindcss.com/](https://tailwindcss.com/)
1. [https://element.eleme.cn/#/zh-CN](https://element.eleme.cn/#/zh-CN)
1. [https://ant.design/index-cn](https://ant.design/index-cn)
1. [https://stackoverflow.com/questions/55318165/add-styled-components-to-codepen](https://stackoverflow.com/questions/55318165/add-styled-components-to-codepen)
