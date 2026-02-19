export * from './hooks';
export * from './endpoints';

// Lightweight runtime helpers exported from the services entrypoint so caller
// code can import them from '@/services'. These keep the original project
// shape without requiring consumers to know about ./api or ./endpoints internals.
import http from './api';
import { getPropPnlStatementsEndpoint } from './endpoints';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPropPnlStatements(payload: Record<string, any>) {
	const res = await http.post(getPropPnlStatementsEndpoint, payload);
	return res.data;
}

