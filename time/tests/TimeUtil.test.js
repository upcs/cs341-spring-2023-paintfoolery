/**
 * Testing for TimeUtil, verifies that returns are formatted correctly
 * 
 * Author: Dylan Kramis 
 * Version: 2/21/2023
 */

import React from 'react';
import TimeUtil from '../comps/TimeUtil';
import TimeCardStart from '../comps/TimeCardStart';


test('test time return format', () => {
  const testTime = Math.floor(Math.random() * 1e9);
  const timeString = TimeUtil.convertMsToReadable(testTime * 1000);
  console.log("Time String: " + timeString + "\n");
  expect(timeString.charAt(2)).toBe(':');
  expect(timeString.charAt(5)).toBe(':');
});

test('test date return format', () => {
  const testTime = Math.floor(Math.random() * 1e9);
  const dateString = TimeUtil.convertMsToDate(testTime * 1000);
  console.log("Date String: " + dateString + "\n");
  expect(dateString.charAt(2)).toBe('/');
  expect(dateString.charAt(5)).toBe('/');
});