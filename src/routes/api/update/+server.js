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
  const responseData = await generateData(year, metric)

  return json(responseData);
}