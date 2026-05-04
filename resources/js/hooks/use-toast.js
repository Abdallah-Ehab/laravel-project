import { useState, useEffect } from 'react';

const TOAST_LIMIT = 1;
let count = 0;

function generateId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}

const timeouts = new Map();

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const dismiss = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const toast = ({ ...props }) => {
        const id = generateId();
        const update = (props) => setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...props } : t)));
        const dismissToast = () => dismiss(id);

        setToasts((prev) => [...prev, { id, ...props }]);

        if (props.duration !== Infinity) {
            const timeout = setTimeout(dismissToast, props.duration || 5000);
            timeouts.set(id, timeout);
        }
    };

    useEffect(() => {
        return () => {
            timeouts.forEach((timeout) => clearTimeout(timeout));
        };
    }, []);

    return { toast, dismiss, toasts };
}
