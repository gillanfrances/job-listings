$(document).ready(function () {
    let activeFilters = [];

    // 1. Load Data
    $.getJSON("data.json", function (data) {
        renderJobs(data);

        // 2. Click event for tags on job cards
        $(document).on("click", ".tag", function () {
            const tagValue = $(this).text().trim();
            if (!activeFilters.includes(tagValue)) {
                activeFilters.push(tagValue);
                updateFiltersUI(data);
            }
        });

        // 3. Click event for removing a specific filter
        $(document).on("click", ".remove-filter", function () {
        const tagValue = $(this).data("value");
        const $badge = $(this).closest('.filter-badge');

        $badge.fadeOut(200, function() {
            activeFilters = activeFilters.filter(item => item !== tagValue);
            updateFiltersUI(data);
        });
    });

        // 4. Clear all filters
        $("#clear-filters").on("click", function () {
            $("#filters").fadeOut(300, function() {
            activeFilters = [];
            updateFiltersUI(data);
        });
        });
    });

    function renderJobs(jobs) {
        const container = $("#job-list");
        container.empty();

        const filteredJobs = jobs.filter(job => {
            if (activeFilters.length === 0) return true;
            // Combine all searchable tags for this job
            const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
            // Check if every active filter is present in the job's tags
            return activeFilters.every(filter => jobTags.includes(filter));
        });

        filteredJobs.forEach(job => {
            const featuredClass = job.featured ? "feature" : "";
            const tags = [job.role, job.level, ...job.languages, ...job.tools];
            
            const jobHTML = `
                <div class="card ${featuredClass}" style="margin-bottom: 2rem;">
                    <img src="${job.logo}" alt="${job.company}" class="icon">
                    <div class="info">
                        <span class="category">${job.company}</span>
                        ${job.new ? '<span class="pill-new">New!</span>' : ''}
                        ${job.featured ? '<span class="pill-featured">Featured</span>' : ''}
                        <span class="role">${job.position}</span>
                        <p class="time">${job.postedAt} • ${job.contract} • ${job.location}</p>
                    </div>
                    <div class="tags">
                        ${tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                </div>
            `;
            container.append(jobHTML);
        });
    }

    function updateFiltersUI(data) {
        const filterContainer = $("#filter-tags-container");
        filterContainer.empty();

        if (activeFilters.length > 0) {
            $("#filters").css("display", "flex");
            activeFilters.forEach(filter => {
                filterContainer.append(`
                    <div class="filter-badge" style="display: flex; align-items: center; background: hsl(180, 52%, 96%); border-radius: 4px; overflow: hidden;">
                        <span style="padding: 0 8px; color: hsl(180, 8%, 52%); font-weight: 700;">${filter}</span>
                        <button class="remove-filter" data-value="${filter}" style="background: hsl(180, 8%, 52%); color: white; border: none; padding: 5px 10px; cursor: pointer;">X</button>
                    </div>
                `);
            });
        } else {
            $("#filters").hide();
        }
        renderJobs(data);
    }
});