import {
  csv,
  scaleLinear,
  min,
  max
} from 'd3';
import { json } from '@sveltejs/kit';
import { generateData } from '../../../helpers/generateData.js';

export const GET = async () => {
  return json({
    message: 'nice, 200'
  });
}

export const POST = async ({ request }) => {
  const data = await request.json();
  
  console.log({ data });
  const { year, metric } = data;
  return json(generateData(year, metric))

  // return json({
  //   message: 'nice, 200'
  // });
}