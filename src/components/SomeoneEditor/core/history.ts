export function createInputerHistory() {
    const history: string[] = [];
    let currentIndex = 0;

    function current() {
        return history[currentIndex];
    }

    function save(str: string) {
        if (str) {
            if (currentIndex === history.length) {
                currentIndex++;
            }
            history.push(str);
        }
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

    return {
        save,
        undo,
        redo,
        current
    }
}