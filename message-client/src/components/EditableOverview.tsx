import React, { JSX, useEffect, useRef, useState } from "react";
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useDndMonitor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SortableItem = <T extends {id: number},>({ item, render, onClick }: { item: T, render: (item: T, onClick: (item: T) => void) => JSX.Element, onClick: (item: T) => void}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  
  // useDndMonitor({
  //   onDragStart: (event) => {
  //     if (event.active.data.current?.type === "button") {
  //       event.preventDefault();
  //       event.cancel(); // Prevent drag on buttons
  //     }
  //   }
  // });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "pointer",
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners} onDoubleClick={() => onClick(item)} onKeyDown={(e) => {
      if (e.target instanceof HTMLInputElement) {
        e.stopPropagation(); // Prevent drag from blocking key events
      }
    }}>
      {render(item, onClick)}
    </li>
  );
};

interface IProps<T> {
  items: T[];
  className?: string;
  render: (item: T, onClick: (item: T) => void) => JSX.Element;
  renderActive: (item: T) => JSX.Element;
  error?: string | null;
  filter: (item: T, query: string) => boolean;
  headings?: (string | { label: string, onSort(a: T, b: T): number })[] | null;
  active?: T | null;
  onActivate: (item: T) => void;
  onAdd: () => void;
  onReorder: (itemsNewOrder: T[]) => void;
};

const EditableOverview: React.FC<any> = <T extends {id: number, order: number}, >({ items, className, render, active, renderActive, error, filter, headings, onAdd, onReorder, onActivate }: IProps<T>) => {
  const [renderItems, setRenderItems] = useState<T[]>(items ?? []);
  const [search, setSearch] = useState("");
  const [activeItem, setActiveItem] = useState<T | null>(null);
  const [sort, setSort] = useState<number | null>(null);
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => setActiveItem(active ?? null), [active]);
  useEffect(() => setRenderItems(items ?? []), [items]);

  // window.onclick = (event) => {
  //   if (ref.current && ref.current.contains(event.target as Node)) {
  //     // Click happened inside the element, do nothing
  //     return;
  //   }
  //   // Click happened outside, reset active item
  //   setActiveItem(null);
  // };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((p) => p.id === active.id);
      const newIndex = items.findIndex((p) => p.id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);

      onReorder(newOrder);
    }
  };

  const renderHeading = (heading: string | { label: string, onSort(a: T, b: T): boolean | number }, index: number) => (
    typeof heading === "string"
      ? (<div key={index}>{heading}</div>)
      : (
        <div key={index} className={`sort-head${index === sort ? ' active' : ''}${sort && index === sort * -1 ? ' active inverse' : ''}`} onClick={() => setSort(sort === index ? index * -1 : index)}>
          {heading.label}
        </div>
      )
  );

  const handleSort = (a: T, b: T) => {
    if(sort === null || !headings) return a.order - b.order;
    
    const sortMethod = headings[sort] ?? headings[sort * -1] ?? null;

    if(typeof sortMethod === "string") return a.order - b.order;

    return sortMethod.onSort(a, b) * (sort < 0 ? -1 : 1);
  };

  return (
    <div className={`overview ${className}`}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <header>
        <div className="input">
          <span><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={onAdd}><FontAwesomeIcon icon={faAdd} title="Add" /></button>
      </header>
      {headings ? (
        <div className="head">
          {headings.map(renderHeading)}
        </div>
      ) : null}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ul ref={ref}>
            {renderItems
              .sort(handleSort)
              .filter((item) => filter(item, search))
              .map((item, index) => (
                <SortableItem key={index} item={activeItem && activeItem.id === item.id ? activeItem : item} render={activeItem && activeItem.id === item.id ? renderActive : render} onClick={onActivate} />
              ))
            }
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default EditableOverview;
