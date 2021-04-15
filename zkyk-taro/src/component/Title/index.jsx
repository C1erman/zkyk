import React from 'react';
import { View, Text } from '@tarojs/components';
import './title.css';

const Title = ({ text }) => <View className='bio-title'><Text className='text'>{text}</Text></View>;

export default Title;