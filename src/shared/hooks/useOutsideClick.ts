import { useEffect, type DependencyList } from "react";

export default function useOutsideClick(
    func: () => void,
    ref: React.RefObject<any>,
    deps?: DependencyList
) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target)) {
                func();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, ...(deps ?? [])]);
}
