import { memo } from "react";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  useTheme,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";

// stores
import { useAssetsStore } from "~/stores";

// constants
import { TOKEN, TOKEN_MAP, type ValidToken } from "~/constants/tokens";

// types
import { type ChainId } from "~/types";
import type { SelectedToken } from "../types";

const TOKEN_LIST = Object.values(TOKEN);

const TABLE_HEAD = [
  {
    title: "Asset",
    key: "asset",
    isNumeric: false,
  },
  {
    title: "Amount",
    key: "amount",
    isNumeric: true,
  },
  {
    title: "Value",
    key: "value",
    isNumeric: true,
  },
  {
    title: null,
    key: "action",
    isNumeric: false,
  },
];

const AssetTable = (props: {
  tokenList: (typeof TOKEN_MAP)[ChainId];
  onSelectedToken: (args: SelectedToken) => void;
}) => {
  const iconFill = useTheme().colors.gray[500];
  const iconSize = useBreakpointValue(
    {
      base: 16,
      md: 24,
    },
    {
      fallback: "base",
    },
  );

  return (
    <TableContainer overflowY="scroll" maxH="240px">
      <Table variant="simple">
        <Thead>
          <Tr>
            {TABLE_HEAD.map((head) => (
              <Th key={head.key} isNumeric={head.isNumeric}>
                {head.title}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {TOKEN_LIST.map((_token) => {
            const token = props.tokenList[_token];
            if (!token) return null;

            const TokenIcon = token.icon;

            return (
              <Tr key={token.symbol}>
                <Td>
                  <Flex alignItems="center" gap={2}>
                    <TokenIcon
                      fill={iconFill}
                      width={iconSize}
                      height={iconSize}
                    />
                    <span>{token.name}</span>
                  </Flex>
                </Td>
                <Td isNumeric>
                  <AssetAmount token={token.symbol} />
                </Td>
                <Td isNumeric>
                  <AssetValue token={token.symbol} />
                </Td>
                <Td>
                  <span
                    onClick={() => {
                      props.onSelectedToken({
                        token: token.symbol,
                        decimals: token.decimals,
                        address: token.address,
                      });
                    }}
                  >
                    <ArrowForwardIcon style={{ transform: "rotate(-45deg)" }} />
                  </span>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const AssetAmount = (props: { token: ValidToken }) => {
  const amount = useAssetsStore((state) => state.getAmount(props.token).value);
  const decimals = useAssetsStore(
    (state) => state.getAmount(props.token).decimals,
  );

  const toDecimals = 10n ** BigInt(decimals);
  const value = (amount * 100n) / toDecimals;

  const valueString = `${(parseFloat(value.toString()) / 100).toFixed(2)} ${props.token}`;

  return <span>{valueString}</span>;
};

const AssetValue = (props: { token: ValidToken }) => {
  const price = useAssetsStore((state) => state.getPrice(props.token));
  const valueString = `$${price.toString()}`;

  return <span>{valueString}</span>;
};

const MemoAssetTable = memo(AssetTable);

export default MemoAssetTable;
