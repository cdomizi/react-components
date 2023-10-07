type LoggerProps = {
  value: unknown;
  replacer?: (this: unknown, key: string, value: unknown) => unknown;
  space?: string | number;
};

const Logger = ({ value, replacer = undefined, space = 2 }: LoggerProps) => {
  return (
    <pre style={{ overflow: "hidden", whiteSpace: "break-spaces" }}>
      <code>{JSON.stringify(value, replacer, space)}</code>
    </pre>
  );
};

export default Logger;
