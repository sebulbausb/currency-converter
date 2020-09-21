import React from 'react';
import {
	Stat,
	StatLabel,
	StatNumber
} from '@chakra-ui/core';

interface Props {
	amount: number;
	from: string;
	to: string;
	result: string;
}

const ResultBox = ({amount, from, to, result}: Readonly<Props>): JSX.Element => (
	<Stat textAlign="left">
		<StatLabel>{amount} {from} este echivalent cu </StatLabel>
		<StatNumber>{result} {to}</StatNumber>
	</Stat>
);

export default ResultBox;
