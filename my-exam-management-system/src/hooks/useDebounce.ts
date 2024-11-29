/**
 * hook tạo một fuction đã được debounce từ fuction truyền vào
 * function được thực thi sau một khoảng delay kể từ lần cuối nó được gọi
 *
 * @param callback - hàm để debounce
 * @param delay - thời gian delay
 * @returns trả về function đã được debounce
 * 
 * Ví dụ => xem CandidateInformation.ts
 */
import { useRef } from 'react';

function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debouncedFunction = (...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };

    return debouncedFunction;
}

export default useDebounce;
