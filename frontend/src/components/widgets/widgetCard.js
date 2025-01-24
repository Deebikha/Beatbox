import React from "react";
import "./widgetCard.css";
import WidgetEntry from "./widgetEntry";
import { IconContext } from "react-icons";
import { FiChevronRight } from "react-icons/fi";

export default function WidgetCard({ title, items, onCardClick, onItemClick }) {
  return (
    <div className="widgetcard-body">
      <p className="widget-title">{title}</p>
      {items && items.map((item) => (
        <WidgetEntry
          key={item.id}
          title={item?.name}
          subtitle={item?.artists ? item?.artists[0]?.name : item?.followers?.total + " Followers"}
          image={item?.images[0]?.url}
          onClick={onItemClick ? () => onItemClick(item) : onCardClick}
        />
      ))}

      <div className="widget-fade" onClick={onCardClick}>
        <div className="fade-button">
          <IconContext.Provider value={{ size: "24px", color: "#c4d0e3" }}>
            <FiChevronRight />
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
}
