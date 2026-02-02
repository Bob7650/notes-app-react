import { useEffect, type DependencyList } from "react";

export default function useOutsideClick(
    func: () => void,
    ref: React.RefObject<any>,
    deps?: DependencyList,
) {
    useEffect(() => {
        let enabled = false;

        const id = requestAnimationFrame(() => {
            enabled = true;
        });

        function handleClickOutside(event: MouseEvent) {
            if (!enabled) return;
            if (!ref.current) return;
            if (!ref.current.contains(event.target)) {
                func();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            cancelAnimationFrame(id);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, ...(deps ?? [])]);
}
