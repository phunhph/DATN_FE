import React, { useState, useMemo, useEffect } from "react";
import { TableSearch } from "../TableSearch/TableSearch";
import "./Table.scss";
import { Pagination } from "../Pagination/Pagination";
import { ToggleSwitch } from "../ToggleSwitch/ToggleSwitch";
import Notification from "../Notification/Notification";

interface TableAction {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (type: "add" | "edit" | "file" | string | any | null) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TableProps<T extends Record<string, any>> {
  data: T[];
  title: string[];
  tableName: string;
  actions_add?: TableAction;
  actions_edit?: TableAction;
  actions_detail?: TableAction;
  action_dowload?: TableAction;
  action_upload?: TableAction;
  action_status?: (id: string) => void;
  children?: string | React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Table = <T extends Record<string, any>>({
  data,
  title,
  tableName,
  actions_add,
  actions_edit,
  actions_detail,
  action_dowload,
  action_upload,
  action_status,
  children,
}: TableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [items, setItems] = useState(data);

  const hasData = items.length > 0;
  const dataKeys = hasData ? (Object.keys(items[0]) as (keyof T)[]) : [];

  const searchedData = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [items, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortKey) return searchedData;
    return [...searchedData].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [searchedData, sortKey, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, sortedData.length);
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleToggle = (id: string) => {
    if (action_status) {
      action_status(id);
      // setItems((prevItems) =>
      //   prevItems.map((item) =>
      //     item.id === id
      //       ? { ...item, status: item.status === "true" ? "false" : "true" }
      //       : item
      //   )
      // );
    }
  };

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text
      .split(regex)
      .map((part, index) =>
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <mark key={index}>{part}</mark>
        ) : (
          part
        )
      );
  };

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

   const [notifications, setNotifications] = useState<
     Array<{ message: string; isSuccess: boolean }>
   >([]);

   const addNotification = (message: string, isSuccess: boolean) => {
     setNotifications((prev) => [...prev, { message, isSuccess }]);
   };

   const clearNotifications = () => {
     setNotifications((prev) => prev.slice(1));
   };
  
  const renderCellValue = (key: keyof T, value: any) => {
    if (key === "status") {
      return (
        <ToggleSwitch
          key={value.id}
          id={value.id}
          toggleState={value.status}
          onToggle={handleToggle}
        />
      );
    } else if (key === "image") {
      return <img src={value.image} alt="Image" className="table-image" />;
    } else if (key === "url_listening") {
      return (
        <div className="audio-cell">
          {value.url_listening ? (
            <>
              <audio
                id={`audio-${value.id}`}
                src={value.url_listening}
                style={{ display: "none" }}
              ></audio>
              <button
                className="play-audio-button"
                onClick={() => {
                  const allAudioElements = document.querySelectorAll("audio");
                  allAudioElements.forEach((audio) => {
                    if (!audio.paused) {
                      audio.pause();
                      (audio as HTMLAudioElement).currentTime = 0;
                    }
                  });

                  const audioElement = document.getElementById(
                    `audio-${value.id}`
                  ) as HTMLAudioElement;

                  if (audioElement) {
                    if (audioElement.paused) {
                      audioElement.play().catch((error) => {
                        console.error("Error playing audio:", error);
                        addNotification(
                          "Không thể phát âm thanh. Định dạng không được hỗ trợ.",
                          false
                        );
                      });
                    } else {
                      audioElement.pause();
                      audioElement.currentTime = 0;
                    }
                  }
                }}
              >
                🎧
              </button>
            </>
          ) : (
            <span>Không có âm thanh</span>
          )}
        </div>
      );
    } else {
      return highlightText(String(value[key]));
    }
  };


  return (
    <div className="table-container">
      <div className="table-header">
        <h1>{tableName}</h1>
        <div className="table-button-group">
          {action_upload && (
            <button
              className="table-button"
              onClick={() => action_upload.onClick?.("file")}
            >
              <img src="/Lấy file.svg" alt="Upload file" />
            </button>
          )}
          {action_dowload && (
            <button
              className="table-button"
              onClick={() => action_dowload.onClick?.("")}
            >
              <img src="/Tải xuống.svg" alt="Tải xuống" />
              Tải xuống mẫu
            </button>
          )}
          {actions_add && (
            <button
              className="table-button"
              onClick={() => actions_add.onClick?.("add")}
            >
              {actions_add.name}
            </button>
          )}
        </div>
      </div>

      <div className="table-controls">
        <div className="items-per-page">
          <label htmlFor="itemsPerPage">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={sortedData.length}>All</option>
          </select>
        </div>
        <TableSearch onSearch={setSearchQuery} />
      </div>
      <div style={{ overflow: "hidden", overflowX: "auto" }}>
        <table id="custom-table" className="custom-table">
          <thead>
            <tr>
              {title.map((header, index) => (
                <th key={index} onClick={() => handleSort(dataKeys[index])}>
                  {header}{" "}
                  {sortKey === dataKeys[index]
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasData ? (
              paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={index}>
                    {dataKeys.map((key) => (
                      <td key={String(key)}>{renderCellValue(key, item)}</td>
                    ))}
                    {actions_edit || actions_detail ? (
                      <>
                        <td className="table-button-group">
                          {actions_edit && (
                            <button
                              className="table-button"
                              onClick={() => actions_edit.onClick?.(item)}
                            >
                              {actions_edit.name}
                            </button>
                          )}
                          {actions_detail && (
                            <button
                              className="table-button"
                              onClick={() =>
                                actions_detail.onClick?.(
                                  item.id != undefined ? item.id : item.idcode
                                )
                              }
                            >
                              {actions_detail.name}
                            </button>
                          )}
                        </td>
                      </>
                    ) : (
                      <></>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={title.length} className="no-data-message">
                    Không có dữ liệu
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan={title.length} className="no-data-message">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        totalItems={sortedData.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
      {children}
      <Notification
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    </div>
  );
};
