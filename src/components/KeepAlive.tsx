import  type { ReactNode } from 'react';
import { KeepAlive as RAKeepAlive } from 'react-activation';
export default function KeepAlive({ id, children }: { id: string; children:
ReactNode }) {
return <RAKeepAlive id={id}>{children}</RAKeepAlive>;
}