import * as d3 from 'd3';
import fs from 'fs';
import { rangeMap } from '../constants/rangeMap';

export const load = async () => {
  const year = '2022';
  const fileName = 'gdp'
  const output = [];

  const csvData = fs.readFileSync('src/data/gdp.csv', 'utf8')
  const res = d3.csvParse(csvData); // Parse CSV data

  for (const obj of res) {
    const country = obj['Country Code'];
    const name = obj['Country Name'];
    const rawValue = obj[year];
    const group = { country, name, rawValue };
    output.push(group);
  }

  const rawValues = output.map((obj) => obj.rawValue) || [];
  const maxValue = Number(d3.max(rawValues));
  const minValue = Number(d3.min(rawValues));

  const circleSizeScale = d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .rangeRound(rangeMap[fileName][year]);

  for (const obj of output) {
    if (obj?.rawValue > 0) {
      const width = circleSizeScale(obj.rawValue);
      obj.width = width;
    } else {
      obj.width = 1;
    }
  }

  return {
    output
  }
}