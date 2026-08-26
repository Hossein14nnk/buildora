class Pagination {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('[data-pagination]').forEach(pagination => {
            this.setupPagination(pagination);
        });
    }

    setupPagination(pagination) {
        const containerSelector = pagination.dataset.container;
        const itemsPerPage = parseInt(
            pagination.dataset.itemsPerPage,
            10
        );

        const container = document.querySelector(containerSelector);
        const paginationList = pagination.querySelector('.pagination-list');

        if (!container || !paginationList || !itemsPerPage || itemsPerPage < 1) {
            return;
        }

        const items = Array.from(container.children);

        if (!items.length) {
            return;
        }

        const state = {
            currentPage: 1,
            itemsPerPage,
            items
        };

        this.render(pagination, paginationList, state);
        this.showPage(state);
    }

    render(pagination, paginationList, state) {
        const totalPages = Math.ceil(
            state.items.length / state.itemsPerPage
        );

        paginationList.innerHTML = '';

        /*
         * Previous
         */
        if (state.currentPage > 1) {
            const previous = this.createButton(
                'previous',
                '<i class="fa-solid fa-arrow-left"></i>',
                'Previous page'
            );

            previous.addEventListener('click', () => {
                state.currentPage--;

                this.render(pagination, paginationList, state);
                this.showPage(state);
            });

            paginationList.appendChild(previous);
        }

        /*
         * Page buttons
         */
        this.getPages(
            state.currentPage,
            totalPages
        ).forEach(page => {

            if (page === 'ellipsis') {
                const ellipsis = document.createElement('span');

                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                ellipsis.setAttribute('aria-hidden', 'true');

                paginationList.appendChild(ellipsis);

                return;
            }

            const button = this.createButton(
                'page',
                page,
                `Page ${page}`
            );

            if (page === state.currentPage) {
                button.classList.add('active');
                button.setAttribute('aria-current', 'page');
            }

            button.addEventListener('click', () => {
                state.currentPage = page;

                this.render(pagination, paginationList, state);
                this.showPage(state);
            });

            paginationList.appendChild(button);
        });

        /*
         * Next
         */
        if (state.currentPage < totalPages) {
            const next = this.createButton(
                'next',
                '<i class="fa-solid fa-arrow-right"></i>',
                'Next page'
            );

            next.addEventListener('click', () => {
                state.currentPage++;

                this.render(pagination, paginationList, state);
                this.showPage(state);
            });

            paginationList.appendChild(next);
        }
    }

    createButton(type, content, ariaLabel) {
        const button = document.createElement('button');

        button.type = 'button';
        button.className = `pagination-button pagination-${type}`;
        button.innerHTML = content;
        button.setAttribute('aria-label', ariaLabel);

        return button;
    }

    getPages(currentPage, totalPages) {

        /*
         * Example:
         *
         * 1 2 3 4 5 6
         */
        if (totalPages <= 6) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );
        }
        if (currentPage <= 3) {
            return [
                1,
                2,
                3,
                'ellipsis',
                totalPages
            ];
        }
        if (currentPage >= totalPages - 2) {
            return [
                1,
                'ellipsis',
                totalPages - 2,
                totalPages - 1,
                totalPages
            ];
        }
        return [
            1,
            'ellipsis',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            'ellipsis',
            totalPages
        ];
    }

    showPage(state) {
        const start = (state.currentPage - 1) * state.itemsPerPage;
        const end = start + state.itemsPerPage;

        state.items.forEach((item, index) => {
            const visible = index >= start && index < end;

            item.hidden = !visible;
            item.setAttribute(
                'aria-hidden',
                visible ? 'false' : 'true'
            );
        });
    }
}

new Pagination();