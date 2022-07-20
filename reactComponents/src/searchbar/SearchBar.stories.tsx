import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SearchBar } from './';
import Networks from './SearchBar.mock';

const Template: ComponentStory<typeof SearchBar> = (args) => <SearchBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  networks: Networks
};

export default {
  title: '1. Components/SearchBar',
  component: SearchBar,
} as ComponentMeta<typeof SearchBar>; 
