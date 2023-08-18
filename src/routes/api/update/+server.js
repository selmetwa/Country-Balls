import { json } from '@sveltejs/kit';
import { generateData } from '../../../helpers/generateData.js';

export const GET = async () => {
  return json({
    message: 'nice, 200'
  });
}

export const POST = async ({ request }) => {
  const data = await request.json();
  
  const { year, metric } = data;
  return json(generateData(year, metric))
}