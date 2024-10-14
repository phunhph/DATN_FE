import React, { useState, useMemo, useEffect } from "react";
import { TableSearch } from "@components/TableSearch/TableSearch";
import "./Table.scss";
import { Pagination } from "@components/Pagination/Pagination";
import { ToggleSwitch } from "@components/ToggleSwitch/ToggleSwitch";

interface TableAction {
  name: string;
  onClick?: (type: "add" | "edit" | "file" | string | undefined) => void;
}


interface TableProps<T extends { [key: string] }> {
  data: T[];
  tableName: string;
  actions_add?: TableAction;
  actions_edit?: TableAction;
  actions_detail?: TableAction;
  action_dowload?: TableAction;
  action_upload?: TableAction;


  action_status?: (id: string) => void; // Có thể truyền hoặc không
}


export const Table = <T extends { [key: string] }>({
  data,
  tableName,
  actions_add,
  actions_edit,
  actions_detail,
  action_dowload,
  action_upload,
  action_status,
  children
}: TableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [items, setItems] = useState(data);

  const hasData = items.length > 0;
  const keys = hasData ? (Object.keys(items[0]) as (keyof T)[]) : [];

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

  // Phân trang dữ liệu
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, sortedData.length);
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, itemsPerPage]);

  // Hàm để thay đổi toggle state cho item
  const handleToggle = (id: string) => {
    if (action_status) {
      action_status(id);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, Status: item.Status=='true'?'false':'true' } : item
        )
      );
    }
  };

  // Hàm sắp xếp
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
    if (data) { //theo dõi data thay đổi
      setItems(data)
    }
  }, [data])
  return (
    <div className="table-container">
      <div className="table-header">
        <h1>{tableName}</h1>
        <div className="table-button-group">
          {action_upload && (
            <button className="table-button" onClick={action_upload.onClick}>
              <img src="/Lấy file.svg" alt="Upload file" />
            </button>
          )}
          {action_dowload && (
            <button className="table-button" onClick={action_dowload.onClick}>
              <img src="/Tải xuống.svg" alt="Tải xuống" />
              Tải xuống
            </button>
          )}
          {actions_add && (
            <button className="table-button" onClick={actions_add.onClick}>{actions_add.name}</button>
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
      <table id="custom-table" className="custom-table">
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={String(key)} onClick={() => handleSort(key)}>
                {String(key)}{" "}
                {sortKey === key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
            ))}
            {actions_edit || actions_detail ? <th>Thao tác</th> : <th></th>}
          </tr>
        </thead>
        <tbody>
          {hasData ? (
            paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index}>
                  {keys.map((key) => (
                    <td key={String(key)}>
                      {String(key) === "Status" ? (
                        <ToggleSwitch
                          key={item.id}
                          id={item.id}
                          toggleState={item.Status}
                          onToggle={handleToggle}
                        />
                      ) : (
                        highlightText(String(item[key]))
                      )}
                    </td>
                  ))}
                  <td className="table-button-group">
                    {actions_edit && (
                      <button className="table-button" onClick={() => actions_edit.onClick?.(item)}>
                        {actions_edit.name}
                      </button>
                    )}
                    {actions_detail && (
                      <button className="table-button" onClick={() => actions_detail.onClick?.(item.id)}>
                        {actions_detail.name}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={keys.length + 1} className="no-data-message">
                  Không có dữ liệu
                </td>

              </tr>
            )
          ) : (
            <tr>
              <td colSpan={keys.length + 1} className="no-data-message">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        totalItems={sortedData.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
      {children}
    </div>
  );
};
