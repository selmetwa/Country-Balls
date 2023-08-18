import * as d3 from 'd3';
import fs from 'fs';
import { rangeMap } from '../constants/rangeMap';

export const generateData = (year, metric) => {
  const output = [];
  const exclude = ["TEA", "TEC", "PST", "PRE", "OSS", "OED", "MEA", "LTE", "LMY", "LMC", "LDC", "LCN", "LAC", "INX", "IDB", "IDA", "IBT", "IBD", "FCS", "EMU", "ECS", "ECA", "EAS", "CSS", ""]

  const csvData = fs.readFileSync(`src/data/${metric}.csv`, 'utf8')
  const res = d3.csvParse(csvData)

  for (const obj of res) {
    // const a = !exclude.includes(obj['Country Code'])
    // console.log({ a });

    if (!exclude.includes(obj['Country Code'])) {
      const country = obj['Country Code'];
      const name = obj['Country Name'];
      const rawValue = obj[year];
      const group = { country, name, rawValue };
      output.push(group);
    }
  }

  const rawValues = output.map((obj) => obj.rawValue) || [];
  const maxValue = Number(d3.max(rawValues));
  const minValue = Number(d3.min(rawValues)) || 0;

  console.log({ maxValue, minValue });
  const circleSizeScale = d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .rangeRound(rangeMap[metric][year]);

  for (const obj of output) {
    console.log({ obj });
    if (obj && obj.rawValue > 0) {
      const width = circleSizeScale(obj.rawValue);
      obj.width = width;
    } else {
      obj.width = 1;
    }
  }

  const years = Object.keys(rangeMap[metric]).reverse()

  return {
    mapData: output,
    years: years,
    metric,
    year
  }
}