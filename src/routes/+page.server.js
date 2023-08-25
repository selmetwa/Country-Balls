import { generateData } from '../helpers/generateData';

export const load = async () => {
  // Initial metrics on first load
  const year = '2022';
  const fileName = 'gdp'

  return await generateData(year, fileName)
}
