/* eslint-disable @typescript-eslint/no-explicit-any */
interface LoggerProps {
  value: any;
  replacer?: (this: any, key: string, value: any) => any;
  space?: string | number;
}

const Logger = ({ value, replacer = undefined, space = 2 }: LoggerProps) => {
  return (
    <pre>
      <code>{JSON.stringify(value, replacer, space)}</code>
    </pre>
  );
};

export default Logger;
