class Tab {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.tab').forEach(tab => {
            this.setupTab(tab);
        });
    }

    setupTab(tab) {
        const items = tab.querySelectorAll('.tab-item');

        items.forEach(item => {
            item.addEventListener('click', () => {
                this.activate(tab, item);
            });
        });
    }

    activate(tab, activeItem) {
        const value = activeItem.dataset.tab;

        // activate tab
        tab.querySelectorAll('.tab-item').forEach(item => {
            const isActive = item === activeItem;

            item.classList.toggle('active', isActive);

            item.setAttribute(
                'aria-selected',
                isActive ? 'true' : 'false'
            );
        });

        // activate content
        tab.querySelectorAll('[data-tab-content]').forEach(content => {
            const isActive = content.dataset.tabContent === value;

            content.classList.toggle('active', isActive);
        });
    }
}

new Tab();