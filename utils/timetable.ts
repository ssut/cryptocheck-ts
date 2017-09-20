/**
 * creates a map with pre-populated time keys
 * @param {number} step rounding steps
 */
export const createTimeMap = (step: number = 5, defaults?: any): object => {
    const map = {};
    for (let h = 0; h < 24; h++) {
        map[h] = {};
        for (let m = 0; m < 60; m++) {
            map[h][m] = {};
            for (let s = 0; s < 60; s += step) {
                map[h][m][s] = defaults ? Object.assign({}, defaults) : undefined;
            }
        }
    }
    return map;
};

export const getNearestNumber = (n: number, step: number = 5) => {
    return Math.ceil(n / step * 1.0) * step;
};
