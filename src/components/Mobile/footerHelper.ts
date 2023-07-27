const footerPopups = new Set<() => void>();

export function registeDestory(callback: () => void) {
    const popupDestory = () => {
        callback();
        footerPopups.delete(popupDestory);
    };

    footerPopups.add(popupDestory);
    return popupDestory;
}

export function clearAllPopup() {
    footerPopups.forEach(item => item());
}