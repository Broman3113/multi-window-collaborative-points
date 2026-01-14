interface Item {
  id: string;
  name: string;
}
const items: Item[] = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
];
export const Main = () => {
    return (
        <div className="">
            main
          <List items={items} render={item => <div>{item.name}</div>}/>
        </div>
    );
};

interface ListProps<T> {
  items: T[],
  render: (item: T) => React.ReactNode
}

const List = <T = any>({items, render}: ListProps<T> ) => {
  return <div>
    {items.map(i => render(i))}
  </div>
};
