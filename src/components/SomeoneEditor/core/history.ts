export function createInputerHistory() {
    const history: string[] = [];
    let currentIndex = -1;

    function current() {
        return history[currentIndex];
    }

    function save(str: string) {
        history.push(str);
        currentIndex = history.length - 1;
    }

    function undo() {
        if (currentIndex > 0) {
            return history[--currentIndex];
        }
        return null;
    }

    function redo() {
        if (currentIndex < history.length - 1) {
            return history[++currentIndex];
        }
        return null;
    }

    function len() {
        return history.length;
    }

    return {
        save,
        undo,
        redo,
        current,
        len
    }
}