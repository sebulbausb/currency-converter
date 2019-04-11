import React, {useState} from 'react';
import {Formik, Form} from 'formik';
import {LocalStorage} from 'ttl-localstorage';
import money from 'money';
import * as Yup from 'yup';

import Input from './input';
import From from './from';
import To from './to';
import Button from './convert-button';
import Reset from './reset-button';

// Cache API results for 1 hour
LocalStorage.timeoutInSeconds = 3600;

// Validation
const ConverterSchema = Yup.object().shape({
	amount: Yup.number()
		.required('Required!')
		.positive('Amount must be a positive number!'),
	from: Yup.string()
		.required('Required!'),
	to: Yup.string()
		.required('Required!')
});

const Converter = () => {
	const [result, setResult] = useState('');

	const resetState = () => setResult('');

	return (
		<div>
			<Formik
				initialValues={{
					amount: '',
					from: '',
					to: ''
				}}
				validationSchema={ConverterSchema}
				onSubmit={async (values, {setSubmitting}) => {
					setSubmitting(false);

					LocalStorage.get('exchangeRates').then(async data => {
						// If there is no cached data, make a request.
						if (data === null) {
							const request = await fetch(`https://api.exchangeratesapi.io/latest?base=${values.from}`);
							const response = await request.json();
							await LocalStorage.put('exchangeRates', response);

							money.base = response.base;
							money.rates = response.rates;

							const result = money.convert(values.amount, {from: values.from, to: values.to}).toFixed(3);

							setResult(`${values.amount} ${values.from} => ${result} ${values.to}`);
						} else {
							money.base = data.base;
							money.rates = data.rates;

							const result = money.convert(values.amount, {from: values.from, to: values.to}).toFixed(3);

							setResult(`${values.amount} ${values.from} => ${result} ${values.to}`);
						}
					});
				}}
			>
				{({isSubmitting, resetForm}) => (
					<Form>
						<Input/>
						<br/>
						<From/>
						<br/>
						<To/>
						<br/>
						<Button type="submit" disabled={isSubmitting}>
							Convert
						</Button>
						<Reset type="reset" onClick={() => {
							resetForm();
							resetState();
						}}
						>X
						</Reset>
						<br/>
						<br/>
						{result}
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default Converter;
