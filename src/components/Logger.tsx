/* eslint-disable @typescript-eslint/no-explicit-any */
type LoggerProps = {
  value: any;
  replacer?: (this: any, key: string, value: any) => any;
  space?: string | number;
};

export const Logger = ({
  value,
  replacer = undefined,
  space = 2,
}: LoggerProps) => {
  return (
    <pre style={{ overflow: "hidden", whiteSpace: "break-spaces" }}>
      <code>{JSON.stringify(value, replacer, space)}</code>
    </pre>
  );
};
