import { useMemo, useState } from "react";

import { Center, Text, useTheme } from "@chakra-ui/react";
import { ResponsiveContainer, PieChart, Pie, Sector } from "recharts";

// hooks
import { useAssetsStore } from "~/stores";

// types
import { PieSectorDataItem } from "recharts/types/polar/Pie";

const AssetValue = () => {
  const totalValues = useAssetsStore((state) => state.getAssetsValueByUsd());

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const chartFill = useTheme().colors.gray[500];

  const total = useMemo(
    () =>
      totalValues.reduce((sum, cur) => {
        return sum + cur.value;
      }, 0n),
    [totalValues],
  );

  const data = useMemo(() => {
    return totalValues.reduce(
      (d, cur) => {
        if (cur.value === 0n) return d;
        const parsedValue = {
          name: cur.asset,
          // recharts only receive number as value, wrong type will resulting in no rendering.
          value: parseFloat(((cur.value * 100n) / total).toString()),
        };
        d.push(parsedValue);
        return d;
      },
      [] as Array<{ name: string; value: number }>,
    );
  }, [totalValues, total]);

  const isEmpty = useMemo(() => {
    return data.every((d) => d.value === 0);
  }, [data]);

  return (
    <Center w="100%" h="100%">
      {isEmpty ? (
        <Text>No matched assets</Text>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={chartFill}
              onMouseLeave={() => setActiveIndex(0)}
              onMouseEnter={(_, i) => setActiveIndex(i)}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Center>
  );
};

export default AssetValue;

// modified: https://recharts.org/en-US/examples/CustomActiveShapePieChart
const renderActiveShape = (props: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const { innerRadius, startAngle, endAngle, fill, value, name } = props;
  const cx = props.cx ?? 0;
  const cy = props.cy ?? 0;
  const midAngle = props.midAngle ?? 0;
  const outerRadius = props.outerRadius ?? 0;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={fill}
      >{`${name}: ${value?.toFixed(1)}%`}</text>
    </g>
  );
};
