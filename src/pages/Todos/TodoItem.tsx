import { TodoType } from ".";

import { Checkbox, List, ListItem } from "@mui/material";

const TodoItem = ({ value }: { value: TodoType }) => {
  return (
    <List>
      <ListItem>
        {value.title}
        <Checkbox id={`todo-${value.id}`} defaultChecked={value.complete} />
      </ListItem>
    </List>
  );
};

export default TodoItem;
