export const colorNumTextArray = [
  'color1',
  'color2',
  'color3',
  'color4',
  'color5',
  'color6',
  'color7',
  'color8',
  'color9',
  'color10',
  'color11',
  'color12',
  'color13',
  'color14',
  'color15',
  'color16',
];

export function colorToText(mm) {
  let colorText = '#';
  let m1 = Math.floor(mm.r * 255 % 16);
  let m2 = Math.floor(mm.r * 255 / 16);
  if      (m1 == 10) { m1 = 'a'; }
  else if (m1 == 11) { m1 = 'b'; }
  else if (m1 == 12) { m1 = 'c'; }
  else if (m1 == 13) { m1 = 'd'; }
  else if (m1 == 14) { m1 = 'e'; }
  else if (m1 == 15) { m1 = 'f'; }
  if      (m2 == 10) { m2 = 'a'; }
  else if (m2 == 11) { m2 = 'b'; }
  else if (m2 == 12) { m2 = 'c'; }
  else if (m2 == 13) { m2 = 'd'; }
  else if (m2 == 14) { m2 = 'e'; }
  else if (m2 >= 15) { m2 = 'f'; }
  colorText += m2 + '' + m1;
  m1 = Math.floor(mm.g * 255 % 16);
  m2 = Math.floor(mm.g * 255 / 16);
  if      (m1 == 10) { m1 = 'a'; }
  else if (m1 == 11) { m1 = 'b'; }
  else if (m1 == 12) { m1 = 'c'; }
  else if (m1 == 13) { m1 = 'd'; }
  else if (m1 == 14) { m1 = 'e'; }
  else if (m1 == 15) { m1 = 'f'; }
  if      (m2 == 10) { m2 = 'a'; }
  else if (m2 == 11) { m2 = 'b'; }
  else if (m2 == 12) { m2 = 'c'; }
  else if (m2 == 13) { m2 = 'd'; }
  else if (m2 == 14) { m2 = 'e'; }
  else if (m2 >= 15) { m2 = 'f'; }
  colorText += m2 + '' + m1;
  m1 = Math.floor(mm.b * 255 % 16);
  m2 = Math.floor(mm.b * 255 / 16);
  if      (m1 == 10) { m1 = 'a'; }
  else if (m1 == 11) { m1 = 'b'; }
  else if (m1 == 12) { m1 = 'c'; }
  else if (m1 == 13) { m1 = 'd'; }
  else if (m1 == 14) { m1 = 'e'; }
  else if (m1 == 15) { m1 = 'f'; }
  if      (m2 == 10) { m2 = 'a'; }
  else if (m2 == 11) { m2 = 'b'; }
  else if (m2 == 12) { m2 = 'c'; }
  else if (m2 == 13) { m2 = 'd'; }
  else if (m2 == 14) { m2 = 'e'; }
  else if (m2 >= 15) { m2 = 'f'; }
  colorText += m2 + '' + m1;
  return colorText;
}  
