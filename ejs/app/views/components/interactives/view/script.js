class View {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.view').forEach(view => {
            this.setupView(view);
        });
    }

    setupView(view) {
        const valueElement = view.querySelector('.view-value');

        const initialValue = Number(view.dataset.viewValue);
        const suffix = view.dataset.viewSuffix || '';

        const storageKey = 'miz-view-' + initialValue;

        let value = localStorage.getItem(storageKey);

        if (value === null) {
            value = initialValue;
        } else {
            value = Number(value) + 1;
        }

        localStorage.setItem(storageKey, value);

        valueElement.textContent = `${value}${suffix}`;
    }
}

new View();