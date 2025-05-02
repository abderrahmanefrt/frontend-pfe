import { useState } from "react";
export interface ListGroupItem{
          label:string;
          value?:string;
}
interface Props{
     items:ListGroupItem[];
     heading:string;
     onSelectItem:(item:ListGroupItem)=>void
}
function ListGroup({items , heading, onSelectItem}:Props) {
  
  const [selectedIndex, setSelectedIndex] = useState(-1);
  return (
    <>
      <h2>{heading}</h2>
      {items.length === 0 && <p>no items found</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={index}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item); 
            }}
          >
            {item.value !== undefined ? (
            <div className="flex justify-between">
              <span className="font-medium">{item.label} : </span>
              <span>{item.value}</span>
            </div>
          ) : (
            <span>{item.label}</span>
          )}
          </li>
        ))}
      </ul>
    </>
  );
}
export default ListGroup;
