import React from 'react';

import { useTheme, Stack, IStackTokens, Text } from '@fluentui/react';

import ISectionProps from './Section.types';
import useSectionStyles from './Section.styles';

const Section: React.FC<ISectionProps> = ({ children, title }) => {
  const theme = useTheme();
  const classes = useSectionStyles();

  const sectionStackTokens: IStackTokens = { childrenGap: theme.spacing.l1 };

  return (
    <Stack as="section" tokens={sectionStackTokens} className={classes.root}>
      <Stack.Item>
        <Text as="h1" variant="xxLarge">
          {title}
        </Text>
      </Stack.Item>
      <Stack.Item>{children}</Stack.Item>
    </Stack>
  );
};

export default Section;
