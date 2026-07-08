import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check, FolderHeart } from "lucide-react";
import { Brand } from "../types";
import { getCategoryTitle } from "../data";

interface SearchableBrandSelectProps {
  brands: Brand[];
  selectedBrandId: string;
  onBrandSelect: (brandId: string) => void;
  label?: string;
}

export default function SearchableBrandSelect({
  brands,
  selectedBrandId,
  onBrandSelect,
  label = "Select Brand",
}: SearchableBrandSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];

  // Filter brands based on search input
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase()) ||
    getCategoryTitle(brand.category).toLowerCase().includes(search.toLowerCase())
  );

  // Auto-scroll highlighted item into view if needed
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
        setSearch("");
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % filteredBrands.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + filteredBrands.length) % filteredBrands.length);
        break;
      case "Enter":
        e.preventDefault();
        if (filteredBrands[highlightedIndex]) {
          onBrandSelect(filteredBrands[highlightedIndex].id);
          setIsOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSelect = (brandId: string) => {
    onBrandSelect(brandId);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative space-y-1.5" ref={dropdownRef}>
      {label && (
        <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-700">
          {label}
        </label>
      )}

      {/* Dropdown Control Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
          setHighlightedIndex(0);
          setTimeout(() => {
            if (!isOpen && inputRef.current) {
              inputRef.current.focus();
            }
          }, 50);
        }}
        onKeyDown={handleKeyDown}
        className="flex w-full items-center justify-between rounded-lg border border-[#E7E2D8] bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 transition-all focus:border-[#9E5A44] focus:outline-hidden text-left cursor-pointer hover:bg-[#FAF7F2]/40"
      >
        <span className="flex items-center space-x-2">
          {selectedBrand.isCustom && (
            <span className="text-[9px] uppercase font-mono px-1 bg-[#9E5A44] text-[#FAF7F2] rounded mr-1">Custom</span>
          )}
          <span>{selectedBrand.name}</span>
          <span className="text-[10px] text-neutral-400 font-normal">({getCategoryTitle(selectedBrand.category)})</span>
        </span>
        <ChevronDown className="h-4 w-4 text-neutral-400" />
      </button>

      {/* Dropdown Content Search Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-[#E7E2D8] bg-white shadow-lg animate-fadeIn max-h-80 flex flex-col overflow-hidden">
          {/* Search box header */}
          <div className="flex items-center border-b border-[#E7E2D8] px-3 py-2.5 bg-[#FAF7F2]">
            <Search className="h-3.5 w-3.5 text-neutral-400 mr-2 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search torrid, levi, swimwear..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-0 p-0 text-xs text-neutral-800 focus:outline-hidden focus:ring-0 placeholder-neutral-400 font-sans"
            />
          </div>

          {/* List panel */}
          <ul
            ref={listRef}
            className="flex-grow overflow-y-auto divide-y divide-neutral-50/60 max-h-60"
          >
            {filteredBrands.length === 0 ? (
              <li className="p-4 text-center text-xs text-neutral-400 font-sans italic">
                No couture brand matches.
              </li>
            ) : (
              filteredBrands.map((brand, idx) => {
                const isSelected = brand.id === selectedBrandId;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={brand.id}
                    onClick={() => handleSelect(brand.id)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer text-xs font-sans transition-colors ${
                      isHighlighted ? "bg-[#EEDCD2]/40 text-[#9E5A44]" : "text-neutral-700"
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold">{brand.name}</span>
                        {brand.isCustom && (
                          <span className="text-[8px] uppercase font-mono px-1 bg-[#9E5A44]/15 text-[#9E5A44] rounded">Custom</span>
                        )}
                      </div>
                      <span className="text-[9px] text-neutral-400">{getCategoryTitle(brand.category)}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#9E5A44]" />}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
