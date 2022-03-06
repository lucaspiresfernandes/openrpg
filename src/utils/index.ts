import React from 'react';

const clickEventsList = new Map<EventTarget, { clickCount: number, timeout?: number }>();
const clickCountThreshold = 250;

export function clamp(num: number, min: number, max: number): number {
    if (num < min) return min;
    if (num > max) return max;
    return num;
}

export function sleep(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

export function getClickCount(event: React.MouseEvent) {
    let clickEvent = clickEventsList.get(event.currentTarget);

    if (!clickEvent) {
        clickEvent = { clickCount: 0 };
        clickEventsList.set(event.currentTarget, clickEvent);
    }
    else window.clearTimeout(clickEvent.timeout);

    clickEvent.clickCount = clickEvent.clickCount + 1;
    clickEvent.timeout = window.setTimeout(() => {
        clickEventsList.delete(event.currentTarget);
    }, clickCountThreshold);

    return clickEvent.clickCount;
}