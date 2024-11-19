new Vue({
    el: '#app',
    data: {
        pageMax: 1,
        title: "Sample",
        currentID: 1,
        currentCaption: "",
        isCaptionVisible: true,
        directory: "default"
    },
    computed: {
        currentImage() {
            const id = String(this.currentID).padStart(4, '0');
            return `${this.directory}/${id}.avif`;
        }
    },
    methods: {
        nextPage() {
            this.currentID = (this.currentID % this.pageMax) + 1;
            this.loadCaption();
        },
        prevPage() {
            this.currentID = this.currentID === 1 ? this.pageMax : this.currentID - 1;
            this.loadCaption();
        },
        goToPage(id) {
            this.currentID = id;
            this.loadCaption();
        },
        loadCaption() {
            const id = String(this.currentID).padStart(4, '0');
            const timestamp = new Date().getTime();
            const url = `${this.directory}/${id}.txt?ts=${timestamp}`;

            fetch(url)
                .then((response) => response.text())
                .then((text) => {
                    this.currentCaption = text.replace(/\n/g, "<br>");
                })
                .catch(() => {
                    this.currentCaption = "Caption not available.";
                });
        },
        toggleCaptionVisibility() {
            this.isCaptionVisible = !this.isCaptionVisible;
        },
        handleKeydown(event) {
            if (event.key === "ArrowRight") {
                this.nextPage();
            } else if (event.key === "ArrowLeft") {
                this.prevPage();
            } else if (event.key === " ") {
                event.preventDefault();
                this.toggleCaptionVisibility();
            }
        },
        validateDirectoryName(name) {
            const validPattern = /^[a-zA-Z0-9_-]+$/;
            return validPattern.test(name) ? name : "default";
        },
        initialize() {
            const params = new URLSearchParams(window.location.search);
            const dir = params.get("dir");

            if (dir) {
                this.directory = this.validateDirectoryName(dir);
            }

            const metaUrl = `${this.directory}/meta.json`;
            fetch(metaUrl)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to load meta.json");
                    }
                    return response.json();
                })
                .then((meta) => {
                    this.pageMax = meta.pageMax || this.pageMax;
                    this.title = meta.title || this.title;
                    document.title = this.title;
                })
                .catch(() => {
                    console.error("meta.json could not be loaded. Using default values.");
                })
                .finally(() => {
                    this.loadCaption();
                });

        }
    },
    mounted() {
        this.initialize();
        this.loadCaption();
        window.addEventListener("keydown", this.handleKeydown);
    }
});