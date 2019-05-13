export class MinValueError extends Error {
    constructor(m?: string) {
        super(m);
        Object.setPrototypeOf(this, MinValueError.prototype);
    }
}

export class MaxValueError extends Error {
    constructor(m?: string) {
        super(m);
        Object.setPrototypeOf(this, MaxValueError.prototype);
    }
}

export class NullReferenceError extends Error {
    constructor(m?: string) {
        super(m);
        Object.setPrototypeOf(this, NullReferenceError.prototype);
    }
}

export class MinLengthError extends Error {
    constructor(m?: string) {
        super(m);
        Object.setPrototypeOf(this, MinLengthError.prototype);
    }
}

export class MaxLengthError extends Error {
    constructor(m?: string) {
        super(m);
        Object.setPrototypeOf(this, MaxLengthError.prototype);
    }
}

export class RegExError extends Error {
    constructor(m?: string) {
        super(m);
        Object.setPrototypeOf(this, RegExError.prototype);
    }
}
